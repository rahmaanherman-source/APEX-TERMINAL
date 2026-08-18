"""Hash-chained audit primitives for GODSPEED execution evidence.

This module does not claim digital signatures. A hash chain provides integrity
linkage; signatures require a separate key-management implementation.
"""

from __future__ import annotations

import hashlib
import json
from dataclasses import dataclass
from typing import Mapping


def canonical_json(value: Mapping[str, object]) -> bytes:
    return json.dumps(value, sort_keys=True, separators=(",", ":"), ensure_ascii=False).encode("utf-8")


def sha256_hex(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def chain_hash(previous_hash: str, event: Mapping[str, object]) -> str:
    """Hₙ = SHA256(Hₙ₋₁ || canonical_eventₙ)."""

    return sha256_hex(previous_hash.encode("ascii") + canonical_json(event))


@dataclass(frozen=True)
class AuditEvent:
    execution_id: str
    event_type: str
    timestamp: str
    previous_hash: str
    event: Mapping[str, object]

    @property
    def event_hash(self) -> str:
        return chain_hash(self.previous_hash, self.event)

    def as_record(self) -> dict[str, object]:
        return {
            "execution_id": self.execution_id,
            "event_type": self.event_type,
            "timestamp": self.timestamp,
            "previous_hash": self.previous_hash,
            "event": dict(self.event),
            "event_hash": self.event_hash,
        }
