"""APEX circuit-breaker and bounded recovery gate."""
from __future__ import annotations

import time
from dataclasses import dataclass
from enum import Enum
from typing import Any

from .telemetry import Telemetry


class BreakerState(str, Enum):
    CLOSED = "CLOSED"
    OPEN = "OPEN"
    HALF_OPEN = "HALF_OPEN"


@dataclass
class CircuitBreaker:
    name: str
    threshold: int = 3
    recovery_timeout: float = 10.0
    state: BreakerState = BreakerState.CLOSED
    failures: int = 0
    last_failure: float = 0.0

    def allow(self) -> bool:
        if self.state == BreakerState.CLOSED:
            return True
        if self.state == BreakerState.OPEN and time.monotonic() - self.last_failure >= self.recovery_timeout:
            self.state = BreakerState.HALF_OPEN
            return True
        return self.state == BreakerState.HALF_OPEN

    def failure(self) -> None:
        self.failures += 1
        self.last_failure = time.monotonic()
        if self.failures >= self.threshold:
            self.state = BreakerState.OPEN

    def success(self) -> None:
        self.failures = 0
        self.state = BreakerState.CLOSED


class BreakerBox:
    def __init__(self, telemetry: Telemetry) -> None:
        self.telemetry = telemetry
        self.breakers: dict[str, CircuitBreaker] = {}

    def get(self, name: str) -> CircuitBreaker:
        return self.breakers.setdefault(name, CircuitBreaker(name=name))

    def check_request(self, name: str) -> bool:
        breaker = self.get(name)
        allowed = breaker.allow()
        if not allowed:
            self.telemetry.record_event(name, "breaker_open", state=breaker.state.value, failures=breaker.failures)
        return allowed

    def record_failure(self, name: str, error: str | None = None) -> None:
        breaker = self.get(name)
        breaker.failure()
        self.telemetry.record_event(name, "breaker_failure", state=breaker.state.value, failures=breaker.failures, error=error)

    def record_success(self, name: str) -> None:
        breaker = self.get(name)
        breaker.success()
        self.telemetry.record_event(name, "breaker_success", state=breaker.state.value)

    def status(self, name: str) -> dict[str, Any]:
        breaker = self.get(name)
        return {"state": breaker.state.value, "failures": breaker.failures, "last_failure": breaker.last_failure}
