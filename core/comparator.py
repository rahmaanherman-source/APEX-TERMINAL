"""Deterministic verification comparator for the GODSPEED closed-loop engine.

This module is intentionally independent of any LLM. It compares an observed
runtime state with an explicit goal and tolerance policy.

Status semantics:
- VERIFIED_CANDIDATE: comparator passed; higher-level evidence checks may still apply.
- HALT_REEVALUATE: comparator failed and the caller must re-read/re-evaluate.
- UNVERIFIED: required observation/evidence is absent.
"""

from __future__ import annotations

from dataclasses import dataclass
from enum import Enum
from math import sqrt
from typing import Mapping, Sequence


class VerificationStatus(str, Enum):
    VERIFIED_CANDIDATE = "VERIFIED_CANDIDATE"
    HALT_REEVALUATE = "HALT_REEVALUATE"
    UNVERIFIED = "UNVERIFIED"


@dataclass(frozen=True)
class VerificationPolicy:
    """Explicit comparator policy. No tolerance is invented by the model."""

    epsilon: float = 0.0
    metric: str = "absolute"
    zero_guard: float = 1e-12

    def __post_init__(self) -> None:
        if self.epsilon < 0:
            raise ValueError("epsilon must be >= 0")
        if self.metric not in {"absolute", "relative", "weighted_l2", "exact"}:
            raise ValueError("unsupported verification metric")


@dataclass(frozen=True)
class VerificationResult:
    status: VerificationStatus
    delta: float | None
    epsilon: float
    reason: str


def absolute_delta(actual: float, goal: float) -> float:
    """Δ(A,G) = |A - G|."""

    return abs(actual - goal)


def relative_delta(actual: float, goal: float, zero_guard: float = 1e-12) -> float:
    """Δ_rel(A,G) = |A-G| / max(|G|, δ₀)."""

    return abs(actual - goal) / max(abs(goal), zero_guard)


def weighted_l2_delta(
    actual: Sequence[float],
    goal: Sequence[float],
    weights: Sequence[float],
) -> float:
    """Δ_w(A,G) = sqrt(Σ wᵢ(Aᵢ-Gᵢ)²), Σwᵢ=1."""

    if not (len(actual) == len(goal) == len(weights)):
        raise ValueError("actual, goal, and weights must have equal length")
    if not weights:
        raise ValueError("vectors cannot be empty")
    if any(w < 0 for w in weights):
        raise ValueError("weights must be >= 0")
    if abs(sum(weights) - 1.0) > 1e-9:
        raise ValueError("weights must sum to 1")
    return sqrt(sum(w * (a - g) ** 2 for a, g, w in zip(actual, goal, weights)))


def compare_scalar(actual: float | None, goal: float | None, policy: VerificationPolicy) -> VerificationResult:
    """Compare a scalar observation against an explicit goal."""

    if actual is None or goal is None:
        return VerificationResult(
            VerificationStatus.UNVERIFIED,
            None,
            policy.epsilon,
            "required observation or goal is missing",
        )

    if policy.metric == "exact":
        delta = 0.0 if actual == goal else float("inf")
    elif policy.metric == "relative":
        delta = relative_delta(actual, goal, policy.zero_guard)
    else:
        delta = absolute_delta(actual, goal)

    if delta <= policy.epsilon:
        return VerificationResult(
            VerificationStatus.VERIFIED_CANDIDATE,
            delta,
            policy.epsilon,
            "verification delta is within tolerance",
        )

    return VerificationResult(
        VerificationStatus.HALT_REEVALUATE,
        delta,
        policy.epsilon,
        "verification delta exceeds tolerance",
    )


def compare_exact_state(
    actual: Mapping[str, object] | None,
    goal: Mapping[str, object] | None,
) -> VerificationResult:
    """Deterministic field-by-field comparison for structured system state."""

    if actual is None or goal is None:
        return VerificationResult(
            VerificationStatus.UNVERIFIED,
            None,
            0.0,
            "required structured observation or goal is missing",
        )

    if actual == goal:
        return VerificationResult(
            VerificationStatus.VERIFIED_CANDIDATE,
            0.0,
            0.0,
            "structured state matches exactly",
        )

    return VerificationResult(
        VerificationStatus.HALT_REEVALUATE,
        float("inf"),
        0.0,
        "structured state does not match exactly",
    )
