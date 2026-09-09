"""APEX Core Lifecycle Orchestrator.

Control-plane reference implementation for the APEX Resilience Statute.
The core never treats process creation as proof of health; readiness is
established separately and all lifecycle transitions are observable.
"""
from __future__ import annotations

import hashlib
import json
import os
import signal
import subprocess
import sys
import time
from dataclasses import dataclass, field
from enum import Enum
from pathlib import Path
from typing import Dict, Optional, Sequence

try:
    import psutil
except ImportError:  # pragma: no cover - runtime dependency check
    psutil = None

from guardrails.security_filter import SecurityFilter
from guardrails.black_box import BlackBoxLogger


class LifecycleState(str, Enum):
    INITIALIZING = "INITIALIZING"
    VALIDATING = "VALIDATING"
    SANITIZING = "SANITIZING"
    VERIFYING = "VERIFYING"
    REGISTERING = "REGISTERING"
    ISOLATING = "ISOLATING"
    STARTING = "STARTING"
    PROBING = "PROBING"
    AUTHORIZED = "AUTHORIZED"
    OPERATIONAL = "OPERATIONAL"
    DEGRADED = "DEGRADED"
    RECOVERING = "RECOVERING"
    BREAKER_TRIPPED = "BREAKER_TRIPPED"
    QUARANTINED = "QUARANTINED"
    FAILED = "FAILED"
    ROLLING_BACK = "ROLLING_BACK"
    SHUTTING_DOWN = "SHUTTING_DOWN"


@dataclass
class ModuleSpec:
    name: str
    command: Sequence[str]
    source_path: Optional[Path] = None
    health_command: Optional[Sequence[str]] = None
    max_restarts: int = 3
    restart_delay_seconds: float = 1.0
    environment: Dict[str, str] = field(default_factory=dict)


@dataclass
class ModuleRuntime:
    spec: ModuleSpec
    process: Optional[subprocess.Popen] = None
    state: LifecycleState = LifecycleState.INITIALIZING
    restart_count: int = 0
    last_error: Optional[str] = None
    last_transition: float = field(default_factory=time.time)


class ApexOrchestrator:
    """Owns the lifecycle but delegates security and evidence to dedicated layers."""

    def __init__(self, state_dir: str = ".apex") -> None:
        self.state_dir = Path(state_dir)
        self.state_dir.mkdir(parents=True, exist_ok=True)
        self.status = LifecycleState.INITIALIZING
        self.modules: Dict[str, ModuleRuntime] = {}
        self.security = SecurityFilter()
        self.black_box = BlackBoxLogger(self.state_dir / "black_box.jsonl")
        self._shutdown = False
        self._transition(LifecycleState.INITIALIZING, "core_initialized")

    def _transition(self, state: LifecycleState, reason: str, **details: object) -> None:
        self.status = state
        self.black_box.record(
            component="apex-core",
            event_type="lifecycle_transition",
            lifecycle_state=state.value,
            reason=reason,
            result="RECORDED",
            details=details,
        )

    def register(self, spec: ModuleSpec) -> None:
        if spec.name in self.modules:
            raise ValueError(f"Module already registered: {spec.name}")
        self.modules[spec.name] = ModuleRuntime(spec=spec)
        self.black_box.record(
            component=spec.name,
            event_type="module_registered",
            lifecycle_state=LifecycleState.REGISTERING.value,
            reason="registration",
            result="ACCEPTED",
        )

    def sanitize_source(self, source_path: Path) -> bool:
        self._transition(LifecycleState.SANITIZING, "source_gate", path=str(source_path))
        result = self.security.scan_file(source_path)
        self.black_box.record(
            component="sanitization-engine",
            event_type="security_gate",
            lifecycle_state=LifecycleState.SANITIZING.value,
            reason="source_scan",
            result=result.status,
            details={"path": str(source_path), "findings": result.findings},
        )
        return result.allowed

    def validate_environment(self) -> None:
        self._transition(LifecycleState.VALIDATING, "environment_validation")
        if psutil is None:
            raise RuntimeError("psutil is required for APEX health monitoring")
        if os.name == "nt":
            # Windows supports process isolation differently; do not pretend POSIX
            # signal semantics apply universally.
            self.black_box.record("apex-core", "platform_notice", self.status.value, "windows_runtime")
        self._transition(LifecycleState.VERIFYING, "environment_verified")

    def start_module(self, name: str) -> None:
        runtime = self.modules[name]
        spec = runtime.spec
        if spec.source_path and not self.sanitize_source(spec.source_path):
            runtime.state = LifecycleState.QUARANTINED
            raise PermissionError(f"Sanitization rejected module: {name}")

        runtime.state = LifecycleState.ISOLATING
        self.black_box.record(name, "isolation_prepared", runtime.state.value, "process_boundary")
        runtime.state = LifecycleState.STARTING
        env = os.environ.copy()
        env.update(spec.environment)
        runtime.process = subprocess.Popen(
            list(spec.command),
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            env=env,
            start_new_session=(os.name != "nt"),
        )
        self.black_box.record(name, "process_started", runtime.state.value, "controlled_launch", details={"pid": runtime.process.pid})
        runtime.state = LifecycleState.PROBING
        if not self.probe(name):
            self.trip_breaker(name, "startup_probe_failed")
            raise RuntimeError(f"Module failed readiness probe: {name}")
        runtime.state = LifecycleState.AUTHORIZED
        self.black_box.record(name, "module_authorized", runtime.state.value, "readiness_verified")

    def probe(self, name: str) -> bool:
        runtime = self.modules[name]
        process = runtime.process
        if process is None or process.poll() is not None:
            runtime.last_error = "process_not_running"
            return False
        if runtime.spec.health_command is None:
            # Process liveness is the minimum fallback; network services should
            # provide a real readiness command.
            return True
        try:
            completed = subprocess.run(
                list(runtime.spec.health_command),
                capture_output=True,
                text=True,
                timeout=3,
                check=False,
            )
            return completed.returncode == 0
        except (OSError, subprocess.TimeoutExpired) as exc:
            runtime.last_error = str(exc)
            return False

    def trip_breaker(self, name: str, reason: str) -> None:
        runtime = self.modules[name]
        runtime.state = LifecycleState.BREAKER_TRIPPED
        self.black_box.record(name, "breaker_trip", runtime.state.value, reason)
        self.stop_module(name)
        runtime.state = LifecycleState.QUARANTINED if runtime.restart_count >= runtime.spec.max_restarts else LifecycleState.RECOVERING

    def stop_module(self, name: str) -> None:
        runtime = self.modules[name]
        process = runtime.process
        if process is None:
            return
        try:
            if process.poll() is None:
                if os.name != "nt":
                    os.killpg(process.pid, signal.SIGTERM)
                else:
                    process.terminate()
                try:
                    process.wait(timeout=5)
                except subprocess.TimeoutExpired:
                    process.kill()
                    process.wait(timeout=2)
        finally:
            runtime.process = None
            self.black_box.record(name, "process_stopped", runtime.state.value, "controlled_stop")

    def recover_module(self, name: str) -> bool:
        runtime = self.modules[name]
        if runtime.restart_count >= runtime.spec.max_restarts:
            runtime.state = LifecycleState.QUARANTINED
            self.black_box.record(name, "quarantine", runtime.state.value, "restart_limit_exceeded")
            return False
        runtime.state = LifecycleState.RECOVERING
        delay = runtime.spec.restart_delay_seconds * (2 ** runtime.restart_count)
        time.sleep(delay)
        runtime.restart_count += 1
        self.black_box.record(name, "restart_attempt", runtime.state.value, "bounded_recovery", details={"attempt": runtime.restart_count})
        try:
            self.start_module(name)
            runtime.state = LifecycleState.OPERATIONAL
            self.black_box.record(name, "recovery_verified", runtime.state.value, "probe_passed")
            return True
        except Exception as exc:
            runtime.last_error = str(exc)
            self.black_box.record(name, "recovery_failed", runtime.state.value, "verification_failed")
            if runtime.restart_count >= runtime.spec.max_restarts:
                runtime.state = LifecycleState.QUARANTINED
                self.black_box.record(name, "quarantine", runtime.state.value, "recovery_exhausted")
            return False

    def monitor_once(self) -> None:
        for name, runtime in self.modules.items():
            if runtime.process is not None and psutil is not None:
                try:
                    proc = psutil.Process(runtime.process.pid)
                    self.black_box.record_metric(name, "cpu_percent", proc.cpu_percent(None))
                    self.black_box.record_metric(name, "memory_mb", proc.memory_info().rss / (1024 * 1024))
                except psutil.NoSuchProcess:
                    runtime.last_error = "process_disappeared"
            if runtime.state in {LifecycleState.OPERATIONAL, LifecycleState.AUTHORIZED, LifecycleState.PROBING} and not self.probe(name):
                self.trip_breaker(name, "health_probe_failed")
                self.recover_module(name)

    def run(self, interval_seconds: float = 5.0) -> None:
        self.validate_environment()
        self._transition(LifecycleState.REGISTERING, "bootstrap_complete")
        for name in list(self.modules):
            try:
                self.start_module(name)
            except Exception as exc:
                self.modules[name].last_error = str(exc)
                self.modules[name].state = LifecycleState.QUARANTINED
        if any(m.state == LifecycleState.QUARANTINED for m in self.modules.values()):
            self._transition(LifecycleState.DEGRADED, "module_quarantined")
        else:
            for runtime in self.modules.values():
                runtime.state = LifecycleState.OPERATIONAL
            self._transition(LifecycleState.OPERATIONAL, "required_modules_verified")
        try:
            while not self._shutdown:
                self.monitor_once()
                time.sleep(interval_seconds)
        except KeyboardInterrupt:
            self.shutdown()

    def shutdown(self) -> None:
        if self._shutdown:
            return
        self._shutdown = True
        self._transition(LifecycleState.SHUTTING_DOWN, "controlled_shutdown")
        for name in list(self.modules):
            self.stop_module(name)
        self.black_box.record("apex-core", "shutdown_complete", LifecycleState.SHUTTING_DOWN.value, "all_modules_stopped")


if __name__ == "__main__":
    orchestrator = ApexOrchestrator()
    # Production deployments should register modules from a signed/validated
    # registry rather than hard-coding executable commands here.
    orchestrator.run()
