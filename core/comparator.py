"""Deterministic state comparator for the GODSPEED control loop.

GABBY never calls this module to decide what *should* be true.  The desired
state is supplied by the command contract and the actual state must come from
an external adapter.  This module only compares the two and returns a
machine-readable decision.
"""

from __future__ import annotations

from dataclasses import dataclass
from math import isfinite
from typing import Any, Mapping


@dataclass(frozen=True)
class ComparisonResult:
    delta: float
    epsilon: float
    status: str
    reason: str


def _scalar_delta(desired: Any, actual: Any) -> float:
    """Return absolute numeric error or infinity for non-numeric values."""
    try:
        d = float(desired)
        a = float(actual)
    except (TypeError, ValueError):
        return float("inf")
    if not (isfinite(d) and isfinite(a)):
        return float("inf")
    return abs(a - d)


def verify_state(desired: Any, actual: Any, epsilon: float = 0.0) -> ComparisonResult:
    """Compare deterministic state.

    Scalars use absolute error.  Mappings/lists use an exact canonical
    comparison unless the caller supplies a scalar state.  This deliberately
    refuses to infer or repair malformed structured evidence.
    """
    if epsilon < 0:
        raise ValueError("epsilon must be non-negative")

    if type(desired) is type(actual) and desired == actual:
        return ComparisonResult(0.0, epsilon, "PASS", "EXACT_MATCH")

    if isinstance(desired, (int, float)) and not isinstance(desired, bool):
        delta = _scalar_delta(desired, actual)
        if delta <= epsilon:
            return ComparisonResult(delta, epsilon, "PASS", "WITHIN_EPSILON")
        return ComparisonResult(delta, epsilon, "FAIL_THRESHOLD_EXCEEDED", "DELTA_EXCEEDS_EPSILON")

    return ComparisonResult(float("inf"), epsilon, "FAIL_MALFORMED", "NON_SCALAR_STATE_MISMATCH")


def compare_system_status(
    desired: Mapping[str, Any],
    actual: Mapping[str, Any],
    *,
    epsilon: float = 0.0,
    max_response_ms: float = 2000.0,
) -> dict[str, Any]:
    """Deterministically verify the canonical SYSTEM_STATUS state.

    A malformed or missing adapter response is never repaired or inferred.
    External health is required to pass.  Latency contributes normalized error
    after the response-time budget is exceeded.
    """
    required = ("status", "uptime", "version", "timestamp")
    status_allowlist = {
        "SOVEREIGN_ONLINE",
        "DEGRADED",
        "OFFLINE",
        "UNVERIFIED",
        "UNKNOWN",
    }

    checks = {
        "structure": all(k in actual for k in required),
        "types": (
            isinstance(actual.get("status"), str)
            and isinstance(actual.get("uptime"), (int, float))
            and not isinstance(actual.get("uptime"), bool)
            and isinstance(actual.get("version"), str)
            and isinstance(actual.get("timestamp"), str)
        ),
        "status_allowed": actual.get("status") in status_allowlist,
        "timestamp_valid": _valid_iso8601(actual.get("timestamp")),
        "external_health": actual.get("health_ok") is True,
        "latency_ok": isinstance(actual.get("latency_ms"), (int, float))
        and not isinstance(actual.get("latency_ms"), bool)
        and actual.get("latency_ms") >= 0
        and actual.get("latency_ms") <= max_response_ms,
    }

    if not checks["structure"]:
        return {
            "delta": float("inf"),
            "epsilon": epsilon,
            "status": "MALFORMED_EVIDENCE",
            "reason": "REQUIRED_FIELD_MISSING",
            "checks": checks,
        }

    delta = sum(0 if checks[k] else 1 for k in (
        "structure", "types", "status_allowed", "timestamp_valid", "external_health"
    ))

    latency = actual.get("latency_ms")
    if not isinstance(latency, (int, float)) or isinstance(latency, bool):
        delta = float("inf")
    elif not checks["latency_ok"]:
        delta += max(0.0, latency - max_response_ms) / max_response_ms

    status = "VERIFIED" if delta <= epsilon else "FAILED"
    return {
        "delta": delta,
        "epsilon": epsilon,
        "status": status,
        "reason": "ALL_CHECKS_PASS" if status == "VERIFIED" else "COMPARATOR_DELTA_EXCEEDED",
        "checks": checks,
    }


def _valid_iso8601(value: Any) -> bool:
    if not isinstance(value, str):
        return False
    from datetime import datetime

    try:
        datetime.fromisoformat(value.replace("Z", "+00:00"))
        return True
    except ValueError:
        return False
