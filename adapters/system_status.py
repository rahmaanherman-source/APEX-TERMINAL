"""System Status adapter boundary.

The adapter accepts an externally observed runtime state. It does not fabricate
health or version information. The caller supplies the observation obtained
from the real runtime-health source.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Mapping

from core.comparator import VerificationResult, compare_exact_state


@dataclass(frozen=True)
class SystemStatusGoal:
    service: str
    required_state: str
    required_version: str

    def as_mapping(self) -> dict[str, str]:
        return {
            "service": self.service,
            "state": self.required_state,
            "version": self.required_version,
        }


def verify_system_status(
    goal: SystemStatusGoal,
    observation: Mapping[str, object] | None,
) -> VerificationResult:
    """Compare runtime observation against an explicit system-status goal.

    Missing observations are UNVERIFIED. Exact mismatch enters HALT_REEVALUATE.
    """

    if observation is None:
        return compare_exact_state(None, goal.as_mapping())

    normalized = {
        "service": observation.get("service"),
        "state": observation.get("actual_state"),
        "version": observation.get("version"),
    }
    return compare_exact_state(normalized, goal.as_mapping())
