"""Tamper-evident hash-chain ledger for APEX execution events."""

from __future__ import annotations

import hashlib
import json
from typing import Any, Mapping


GENESIS_HASH = "0" * 64


def canonical_event(event: Mapping[str, Any]) -> str:
    """Serialize an event deterministically for hashing."""
    return json.dumps(event, sort_keys=True, separators=(",", ":"), ensure_ascii=False)


def next_hash(previous_hash: str, event: Mapping[str, Any]) -> str:
    """Compute H_n = SHA256(H_(n-1) || canonical(Event_n))."""
    material = previous_hash + canonical_event(event)
    return hashlib.sha256(material.encode("utf-8")).hexdigest()


def append_event(
    previous_hash: str,
    event: Mapping[str, Any],
) -> dict[str, Any]:
    """Return an evidence record containing the event and its chain hash."""
    event_hash = next_hash(previous_hash, event)
    return {
        "previous_hash": previous_hash,
        "event": dict(event),
        "hash": event_hash,
    }
