"""Provenance-aware epistemic memory records.

The store model deliberately separates observation, inference, verification and
failure states. Persistence is an integration concern; this module defines the
canonical record shape and transition rules.
"""

from __future__ import annotations

from dataclasses import dataclass, replace
from enum import Enum
from typing import Optional


class EpistemicStatus(str, Enum):
    DECLARED = "DECLARED"
    OBSERVED = "OBSERVED"
    INFERRED = "INFERRED"
    VERIFIED = "VERIFIED"
    FAILED = "FAILED"
    BLOCKED = "BLOCKED"
    UNVERIFIED = "UNVERIFIED"
    SUPERSEDED = "SUPERSEDED"


@dataclass(frozen=True)
class EpistemicRecord:
    memory_id: str
    claim: str
    source_type: str
    source_id: str
    observed_at: str
    provenance_hash: str
    confidence: Optional[float]
    verification_status: EpistemicStatus
    supersedes: Optional[str]
    created_by: str

    def with_status(self, status: EpistemicStatus) -> "EpistemicRecord":
        """Return a new record; records are immutable by convention."""

        return replace(self, verification_status=status)

    def validate(self) -> None:
        if not self.memory_id or not self.claim or not self.source_id:
            raise ValueError("memory_id, claim, and source_id are required")
        if not self.provenance_hash:
            raise ValueError("provenance_hash is required")
        if self.confidence is not None and not 0.0 <= self.confidence <= 1.0:
            raise ValueError("confidence must be between 0 and 1")
        if self.verification_status == EpistemicStatus.VERIFIED and not self.provenance_hash:
            raise ValueError("verified records require provenance")
