"""Tamper-evident append-only audit ledger for APEX execution events."""
from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timezone
import hashlib
import json
from typing import Any, Mapping

GENESIS_HASH = "0" * 64


def canonical_event(event: Mapping[str, Any]) -> str:
    """Serialize an event deterministically for hashing."""
    return json.dumps(event, sort_keys=True, separators=(",", ":"), ensure_ascii=False)


def next_hash(previous_hash: str, event: Mapping[str, Any]) -> str:
    """Compute H_n = SHA256(H_(n-1) || canonical(Event_n))."""
    return hashlib.sha256((previous_hash + canonical_event(event)).encode("utf-8")).hexdigest()


def append_event(previous_hash: str, event: Mapping[str, Any]) -> dict[str, Any]:
    """Return an evidence record containing the event and its chain hash."""
    return {"previous_hash": previous_hash, "event": dict(event), "hash": next_hash(previous_hash, event)}


@dataclass(frozen=True)
class AuditRecord:
    sequence: int
    previous_hash: str
    event: Mapping[str, Any]
    hash: str


class AuditLedger:
    """In-memory ledger primitive; persistence can wrap this contract later."""

    def __init__(self) -> None:
        self._records: list[AuditRecord] = []

    def append(self, event: Mapping[str, Any]) -> AuditRecord:
        enriched = dict(event)
        enriched.setdefault("timestamp", datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"))
        previous = self._records[-1].hash if self._records else GENESIS_HASH
        record = AuditRecord(len(self._records), previous, enriched, next_hash(previous, enriched))
        self._records.append(record)
        return record

    def records(self) -> tuple[AuditRecord, ...]:
        return tuple(self._records)

    def verify_chain(self) -> bool:
        previous = GENESIS_HASH
        for index, record in enumerate(self._records):
            if record.sequence != index or record.previous_hash != previous:
                return False
            if next_hash(record.previous_hash, record.event) != record.hash:
                return False
            previous = record.hash
        return True
