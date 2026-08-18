"""System Status adapter boundary.

This adapter is intentionally thin. It obtains/accepts only externally
observed runtime data and delegates every verification decision to the
 deterministic comparator. It never manufactures VERIFIED state.
"""

from __future__ import annotations

from typing import Any, Mapping

from core.comparator import SYSTEM_STATUS_DESIRED, ComparatorResult, compare_system_status


def compare_observation(
    actual: Mapping[str, Any] | None,
    execution_id: str | None = None,
    desired: Mapping[str, Any] | None = None,
) -> ComparatorResult:
    """Send an external System Status observation through the truth gate."""

    return compare_system_status(
        actual=actual,
        desired=desired or SYSTEM_STATUS_DESIRED,
        execution_id=execution_id,
    )


def blocked_observation(
    execution_id: str,
    reason: str = "HEALTH_ENDPOINT_UNREACHABLE",
) -> dict[str, Any]:
    """Represent an unreachable/permission-blocked external health source."""

    return {
        "execution_id": execution_id,
        "adapter": "system_status",
        "status": "BLOCKED",
        "reason": reason,
    }


def build_observation(
    execution_id: str,
    payload: Mapping[str, Any],
    health_ok: bool,
    latency_ms: float | int,
    readback_sha256: str | None,
) -> dict[str, Any]:
    """Construct the canonical adapter observation from real read-back data."""

    return {
        "execution_id": execution_id,
        "adapter": "system_status",
        "payload": dict(payload),
        "health_ok": health_ok,
        "latency_ms": latency_ms,
        "readback_sha256": readback_sha256,
    }
