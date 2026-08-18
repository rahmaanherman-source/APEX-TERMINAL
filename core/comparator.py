"""Deterministic APEX truth comparator.

The comparator never asks an LLM to judge its own work. It evaluates
observed state against a fixed desired-state contract and returns an
explicit verification state.
"""

from __future__ import annotations

from datetime import datetime
from typing import Any, Mapping
import math
import re


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
    """Compare a SYSTEM_STATUS observation to a deterministic contract."""

    if not isinstance(actual, Mapping):
        return {
            "execution_id": execution_id,
            "tool": "system_status",
            "delta": math.inf,
            "epsilon": desired.get("epsilon", 0.0),
            "status": FAILED,
            "reason": "MALFORMED_EVIDENCE",
            "checks": {},
        }

    payload = actual.get("payload")
    if not isinstance(payload, Mapping) or not execution_id:
        return {
            "execution_id": execution_id,
            "tool": "system_status",
            "delta": math.inf,
            "epsilon": desired.get("epsilon", 0.0),
            "status": FAILED,
            "reason": "MALFORMED_EVIDENCE",
            "checks": {"structure": False},
        }

    required = desired.get("required_fields", [])
    checks = {
        "structure": all(key in payload for key in required),
        "types": all(
            [
                isinstance(payload.get("status"), str),
                isinstance(payload.get("uptime"), (int, float))
                and not isinstance(payload.get("uptime"), bool),
                isinstance(payload.get("version"), str),
                isinstance(payload.get("timestamp"), str),
            ]
        ),
        "status_allowed": payload.get("status") in desired.get("status_allowlist", []),
        "timestamp_valid": _valid_timestamp(payload.get("timestamp")),
        "version_valid": _valid_version(
            payload.get("version"), desired.get("version_pattern", r"^$")
        ),
        "external_health": (
            actual.get("health_ok") is True
            if desired.get("external_health_required", False)
            else True
        ),
    }

    latency = actual.get("latency_ms")
    latency_ok = isinstance(latency, (int, float)) and not isinstance(latency, bool)
    if latency_ok:
        latency_ok = latency <= desired.get("max_response_ms", math.inf)
    checks["latency_ok"] = latency_ok

    delta = sum(1.0 for key, passed in checks.items() if key != "latency_ok" and not passed)
    if not latency_ok:
        if isinstance(latency, (int, float)) and not isinstance(latency, bool):
            budget = desired.get("max_response_ms", 1)
            delta += max(0.0, float(latency) - float(budget)) / float(budget)
        else:
            delta += 1.0

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
        "readback_sha256": actual.get("readback_sha256"),
    }
