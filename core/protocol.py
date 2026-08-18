"""Canonical APEX adapter protocol and evidence validation.

Adapters observe reality. They never assign VERIFIED. The Comparator owns truth.
"""
from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime
from enum import Enum
from typing import Any, Mapping
import re


class ConnectionState(str, Enum):
    DISCOVERED = "DISCOVERED"
    AVAILABLE = "AVAILABLE"
    AUTHORIZED = "AUTHORIZED"
    CONNECTED = "CONNECTED"
    RUNNING = "RUNNING"
    TESTED = "TESTED"
    VERIFIED = "VERIFIED"
    BLOCKED = "BLOCKED"
    FAILED = "FAILED"
    UNVERIFIED = "UNVERIFIED"


_HEX64 = re.compile(r"^[0-9a-fA-F]{64}$")


@dataclass(frozen=True)
class CanonicalState:
    execution_id: str
    action_id: str
    adapter: str
    observed_at: str
    status: str
    payload: Mapping[str, Any]
    health_ok: bool
    latency_ms: float
    evidence: tuple[Any, ...]
    readback_sha256: str | None

    @classmethod
    def from_mapping(cls, value: Mapping[str, Any]) -> "CanonicalState":
        required = {
            "execution_id", "action_id", "adapter", "observed_at", "status",
            "payload", "health_ok", "latency_ms", "evidence", "readback_sha256",
        }
        missing = sorted(required - set(value.keys()))
        if missing:
            raise ValueError(f"MALFORMED_EVIDENCE: missing fields: {','.join(missing)}")
        execution_id = value["execution_id"]
        if not isinstance(execution_id, str) or not execution_id.strip():
            raise ValueError("MALFORMED_EVIDENCE: invalid execution_id")
        if value["status"] == ConnectionState.VERIFIED.value:
            raise ValueError("MALFORMED_EVIDENCE: adapter cannot report VERIFIED")
        if not isinstance(value["payload"], Mapping):
            raise ValueError("MALFORMED_EVIDENCE: payload must be an object")
        if not isinstance(value["health_ok"], bool):
            raise ValueError("MALFORMED_EVIDENCE: health_ok must be boolean")
        if not isinstance(value["latency_ms"], (int, float)) or isinstance(value["latency_ms"], bool):
            raise ValueError("MALFORMED_EVIDENCE: latency_ms must be numeric")
        if not isinstance(value["evidence"], (list, tuple)):
            raise ValueError("MALFORMED_EVIDENCE: evidence must be an array")
        digest = value["readback_sha256"]
        if digest is not None and (not isinstance(digest, str) or not _HEX64.fullmatch(digest)):
            raise ValueError("MALFORMED_EVIDENCE: invalid readback_sha256")
        try:
            datetime.fromisoformat(str(value["observed_at"]).replace("Z", "+00:00"))
        except ValueError as exc:
            raise ValueError("MALFORMED_EVIDENCE: invalid observed_at") from exc
        return cls(
            execution_id=execution_id,
            action_id=str(value["action_id"]),
            adapter=str(value["adapter"]),
            observed_at=str(value["observed_at"]),
            status=str(value["status"]),
            payload=dict(value["payload"]),
            health_ok=value["health_ok"],
            latency_ms=float(value["latency_ms"]),
            evidence=tuple(value["evidence"]),
            readback_sha256=digest,
        )


def validate_canonical_state(value: Mapping[str, Any]) -> CanonicalState:
    return CanonicalState.from_mapping(value)
