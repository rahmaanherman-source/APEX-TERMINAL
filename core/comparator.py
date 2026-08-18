"""Deterministic APEX truth comparator.

The comparator is the only component allowed to assign VERIFIED. Adapters report
observations; GABBY translates intent; neither is permitted to self-attest.
"""
from __future__ import annotations

from datetime import datetime
from typing import Any, Mapping
import math
import re

from core.protocol import validate_canonical_state

VERIFIED = "VERIFIED"
FAILED = "FAILED"
BLOCKED = "BLOCKED"
UNVERIFIED = "UNVERIFIED"


def _valid_timestamp(value: Any) -> bool:
    if not isinstance(value, str):
        return False
    try:
        datetime.fromisoformat(value.replace("Z", "+00:00"))
        return True
    except ValueError:
        return False


def _valid_version(value: Any, pattern: str) -> bool:
    return isinstance(value, str) and re.fullmatch(pattern, value) is not None


def compare_system_status(
    actual: Mapping[str, Any],
    desired: Mapping[str, Any],
    execution_id: str,
) -> dict[str, Any]:
    """Compare one observed SYSTEM_STATUS state to a deterministic contract."""
    if not execution_id:
        return _failure(execution_id, desired, "MALFORMED_EVIDENCE", {"structure": False})

    try:
        canonical = validate_canonical_state(actual)
    except (TypeError, ValueError) as exc:
        return _failure(execution_id, desired, "MALFORMED_EVIDENCE", {"structure": False}, str(exc))

    if canonical.execution_id != execution_id:
        return _failure(execution_id, desired, "EXECUTION_ID_MISMATCH", {"execution_id": False})

    payload = canonical.payload
    required = desired.get("required_fields", [])
    checks = {
        "structure": all(key in payload for key in required),
        "types": all([
            isinstance(payload.get("status"), str),
            isinstance(payload.get("uptime"), (int, float)) and not isinstance(payload.get("uptime"), bool),
            isinstance(payload.get("version"), str),
            isinstance(payload.get("timestamp"), str),
        ]),
        "status_allowed": payload.get("status") in desired.get("status_allowlist", []),
        "timestamp_valid": _valid_timestamp(payload.get("timestamp")),
        "version_valid": _valid_version(payload.get("version"), desired.get("version_pattern", r"^$")),
        "external_health": canonical.health_ok if desired.get("external_health_required", False) else True,
    }

    latency = canonical.latency_ms
    budget = float(desired.get("max_response_ms", math.inf))
    checks["latency_ok"] = latency <= budget

    delta = sum(1.0 for key, passed in checks.items() if key != "latency_ok" and not passed)
    if not checks["latency_ok"]:
        delta += max(0.0, latency - budget) / budget if math.isfinite(budget) and budget > 0 else 1.0

    epsilon = float(desired.get("epsilon", 0.0))
    status = VERIFIED if delta <= epsilon and all(checks.values()) else FAILED

    return {
        "execution_id": execution_id,
        "tool": "system_status",
        "delta": delta,
        "epsilon": epsilon,
        "status": status,
        "checks": checks,
        "payload": dict(payload),
        "latency_ms": latency,
        "readback_sha256": canonical.readback_sha256,
    }


def _failure(
    execution_id: str,
    desired: Mapping[str, Any],
    reason: str,
    checks: dict[str, bool],
    detail: str | None = None,
) -> dict[str, Any]:
    result = {
        "execution_id": execution_id,
        "tool": "system_status",
        "delta": math.inf,
        "epsilon": float(desired.get("epsilon", 0.0)),
        "status": FAILED,
        "reason": reason,
        "checks": checks,
    }
    if detail:
        result["detail"] = detail
    return result
