"""Hash-chained audit primitives for GODSPEED execution evidence.

A hash chain provides integrity linkage. It is not a digital signature. A
separate key-management boundary is required before signatures can honestly be
claimed.
"""

from __future__ import annotations

import hashlib
import json
from dataclasses import dataclass
from typing import Mapping, Any


def canonical_json(value: Mapping[str, object]) -> bytes:
    return json.dumps(value, sort_keys=True, separators=(",", ":"), ensure_ascii=False).encode("utf-8")


def sha256_hex(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def chain_hash(previous_hash: str, event: Mapping[str, object]) -> str:
    """Hₙ = SHA256(Hₙ₋₁ || canonical_eventₙ)."""

    return sha256_hex(previous_hash.encode("ascii") + canonical_json(event))


def hash_mapping(value: Mapping[str, object]) -> str:
    """SHA-256 over canonical JSON for desired/actual state evidence."""

    return sha256_hex(canonical_json(value))


@dataclass(frozen=True)
class SystemStatusEvidence:
    """Canonical evidence fields required for a System Status verification."""

    execution_id: str
    tool: str
    desired_state_hash: str
    actual_state_hash: str
    delta: float
    status: str
    timestamp: str
    readback_sha256: str | None

    def as_event(self) -> dict[str, Any]:
        return {
            "execution_id": self.execution_id,
            "tool": self.tool,
            "desired_state_hash": self.desired_state_hash,
            "actual_state_hash": self.actual_state_hash,
            "delta": self.delta,
            "status": self.status,
            "timestamp": self.timestamp,
            "readback_sha256": self.readback_sha256,
        }


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
