"""Deterministic GODSPEED truth-gate comparator.

The comparator is not an LLM and never accepts a model-generated status as
verification. It compares externally observed System Status data against a
fixed desired-state schema.

Governing equation:

    Δ_total = Δ_structure + Δ_type + Δ_status + Δ_semantic + Δ_latency

For this first critical System Status contract, epsilon is fixed at 0.0.
"""

from __future__ import annotations

import re
from dataclasses import dataclass
from datetime import datetime
from enum import Enum
from math import isfinite
from typing import Any, Mapping


class VerificationStatus(str, Enum):
    VERIFIED = "VERIFIED"
    FAILED = "FAILED"
    BLOCKED = "BLOCKED"
    UNVERIFIED = "UNVERIFIED"


SYSTEM_STATUS_DESIRED: dict[str, Any] = {
    "required_fields": ["status", "uptime", "version", "timestamp"],
    "status_allowlist": ["SOVEREIGN_ONLINE", "DEGRADED", "OFFLINE", "UNVERIFIED"],
    "version_pattern": r"^\d+\.\d+(\.\d+)?(\.\w+)?$",
    "max_response_ms": 2000,
    "epsilon": 0.0,
    "external_health_required": True,
    "timestamp_format": "ISO8601",
}


@dataclass(frozen=True)
class ComparatorResult:
    execution_id: str
    tool: str
    delta: float
    epsilon: float
    status: VerificationStatus
    checks: Mapping[str, bool]
    payload: Mapping[str, Any]
    latency_ms: float | int | None
    readback_sha256: str | None
    timestamp: str
    reason: str | None = None

    def as_dict(self) -> dict[str, Any]:
        return {
            "execution_id": self.execution_id,
            "tool": self.tool,
            "delta": self.delta,
            "epsilon": self.epsilon,
            "status": self.status.value,
            "checks": dict(self.checks),
            "payload": dict(self.payload),
            "latency_ms": self.latency_ms,
            "readback_sha256": self.readback_sha256,
            "timestamp": self.timestamp,
            "reason": self.reason,
        }


def _now_iso() -> str:
    return datetime.now().astimezone().isoformat().replace("+00:00", "Z")


def _timestamp_valid(value: object) -> bool:
    if not isinstance(value, str):
        return False
    try:
        datetime.fromisoformat(value.replace("Z", "+00:00"))
        return True
    except (TypeError, ValueError):
        return False


def _version_valid(value: object, pattern: str) -> bool:
    return isinstance(value, str) and re.fullmatch(pattern, value) is not None


def _blocked_result(execution_id: str, reason: str, actual: Mapping[str, Any]) -> ComparatorResult:
    return ComparatorResult(
        execution_id=execution_id,
        tool="system_status",
        delta=0.0,
        epsilon=0.0,
        status=VerificationStatus.BLOCKED,
        checks={
            "structure": False,
            "types": False,
            "status_allowed": False,
            "timestamp_valid": False,
            "external_health": False,
            "latency_ok": False,
        },
        payload=actual.get("payload", {}) if isinstance(actual.get("payload", {}), Mapping) else {},
        latency_ms=actual.get("latency_ms"),
        readback_sha256=actual.get("readback_sha256"),
        timestamp=_now_iso(),
        reason=reason,
    )


def compare_system_status(
    actual: Mapping[str, Any] | None,
    desired: Mapping[str, Any] | None = None,
    execution_id: str | None = None,
) -> ComparatorResult:
    """Apply the locked System Status truth-gate contract.

    Decision map:
      unreachable/permission missing -> BLOCKED
      malformed input/missing execution ID -> FAILED
      Δ_total > ε -> FAILED
      Δ_total <= ε with every check true -> VERIFIED

    No PENDING, PROBABLY_OK, model override, or implicit tolerance exists.
    """

    desired = dict(desired or SYSTEM_STATUS_DESIRED)
    execution_id = execution_id or (actual.get("execution_id") if isinstance(actual, Mapping) else None)

    if not execution_id:
        return _blocked_result("MISSING_EXECUTION_ID", "MISSING_EXECUTION_ID", actual or {}) .__class__(
            execution_id="MISSING_EXECUTION_ID",
            tool="system_status",
            delta=1.0,
            epsilon=float(desired.get("epsilon", 0.0)),
            status=VerificationStatus.FAILED,
            checks={
                "structure": False,
                "types": False,
                "status_allowed": False,
                "timestamp_valid": False,
                "external_health": False,
                "latency_ok": False,
            },
            payload={},
            latency_ms=None,
            readback_sha256=None,
            timestamp=_now_iso(),
            reason="MISSING_EXECUTION_ID",
        )

    if not isinstance(actual, Mapping):
        return ComparatorResult(
            execution_id=execution_id,
            tool="system_status",
            delta=1.0,
            epsilon=float(desired.get("epsilon", 0.0)),
            status=VerificationStatus.FAILED,
            checks={"structure": False, "types": False, "status_allowed": False, "timestamp_valid": False, "external_health": False, "latency_ok": False},
            payload={}, latency_ms=None, readback_sha256=None, timestamp=_now_iso(), reason="INVALID_JSON_OR_STATE",
        )

    if actual.get("status") == "BLOCKED" or actual.get("reason") in {"HEALTH_ENDPOINT_UNREACHABLE", "PERMISSION_MISSING"}:
        return _blocked_result(execution_id, str(actual.get("reason", "HEALTH_ENDPOINT_UNREACHABLE")), actual)

    payload = actual.get("payload")
    if not isinstance(payload, Mapping):
        payload = {}

    required = desired.get("required_fields", [])
    checks = {
        "structure": all(field in payload for field in required),
        "types": all([
            isinstance(payload.get("status"), str),
            isinstance(payload.get("uptime"), (int, float)) and not isinstance(payload.get("uptime"), bool),
            isinstance(payload.get("version"), str),
            isinstance(payload.get("timestamp"), str),
        ]),
        "status_allowed": payload.get("status") in desired.get("status_allowlist", []),
        "timestamp_valid": _timestamp_valid(payload.get("timestamp")),
        "external_health": (actual.get("health_ok") is True) if desired.get("external_health_required", True) else True,
        "latency_ok": False,
    }

    latency = actual.get("latency_ms")
    latency_numeric = isinstance(latency, (int, float)) and not isinstance(latency, bool) and isfinite(float(latency))
    if latency_numeric:
        checks["latency_ok"] = float(latency) <= float(desired.get("max_response_ms", 2000))

    delta = 0.0
    for key in ["structure", "types", "status_allowed", "timestamp_valid", "external_health"]:
        if not checks[key]:
            delta += 1.0

    max_response_ms = float(desired.get("max_response_ms", 2000))
    if not checks["latency_ok"]:
        if latency_numeric:
            delta += max(0.0, float(latency) - max_response_ms) / max_response_ms
        else:
            delta += 1.0

    epsilon = float(desired.get("epsilon", 0.0))
    status = VerificationStatus.VERIFIED if delta <= epsilon and all(checks.values()) else VerificationStatus.FAILED

    return ComparatorResult(
        execution_id=execution_id,
        tool="system_status",
        delta=delta,
        epsilon=epsilon,
        status=status,
        checks=checks,
        payload=payload,
        latency_ms=latency,
        readback_sha256=actual.get("readback_sha256"),
        timestamp=_now_iso(),
        reason=None if status is VerificationStatus.VERIFIED else "VERIFICATION_DELTA_EXCEEDS_EPSILON_OR_CHECK_FAILED",
    )


# General-purpose equations retained for later non-critical capability domains.
def absolute_delta(actual: float, goal: float) -> float:
    return abs(actual - goal)


def relative_delta(actual: float, goal: float, zero_guard: float = 1e-12) -> float:
    return abs(actual - goal) / max(abs(goal), zero_guard)
