"""Verification result boundary for the APEX command engine."""
from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Mapping

from core.comparator import BLOCKED, FAILED, UNVERIFIED, VERIFIED, compare_system_status


@dataclass(frozen=True)
class VerificationResult:
    execution_id: str
    status: str
    delta: float | None
    epsilon: float
    evidence: Mapping[str, Any]


def verify_canonical_state(
    desired: Mapping[str, Any],
    actual: Mapping[str, Any],
    execution_id: str,
) -> VerificationResult:
    tool = str(actual.get("action_id", "SYSTEM_STATUS")).upper() if isinstance(actual, Mapping) else "SYSTEM_STATUS"
    if actual.get("status") == BLOCKED:
        return VerificationResult(execution_id, BLOCKED, None, float(desired.get("epsilon", 0.0)), dict(actual))
    if tool == "SYSTEM_STATUS":
        result = compare_system_status(actual, desired, execution_id)
    else:
        result = {
            "execution_id": execution_id,
            "status": UNVERIFIED,
            "delta": None,
            "epsilon": float(desired.get("epsilon", 0.0)),
            "reason": "NO_COMPARATOR_FOR_ACTION",
        }
    return VerificationResult(
        execution_id=execution_id,
        status=str(result["status"]),
        delta=result.get("delta"),
        epsilon=float(result.get("epsilon", desired.get("epsilon", 0.0))),
        evidence=result,
    )
