"""Project-scoped hard memory backed by verification evidence."""
from __future__ import annotations

from dataclasses import dataclass, asdict
from datetime import datetime, timezone
import hashlib
import json
from typing import Any, Mapping


@dataclass(frozen=True)
class MemoryFact:
    memory_id: str
    project_id: str
    claim: str
    source: str
    source_ref: str
    verified_at: str
    verification_method: str
    status: str
    content_sha256: str


def _content_hash(value: Mapping[str, Any]) -> str:
    data = json.dumps(value, sort_keys=True, separators=(",", ":"), ensure_ascii=False).encode("utf-8")
    return hashlib.sha256(data).hexdigest()


def record_verified_fact(project_id: str, evidence: Mapping[str, Any]) -> MemoryFact:
    if evidence.get("status") != "VERIFIED":
        raise ValueError("Only VERIFIED evidence may enter the hard Memory Slab")
    execution_id = str(evidence.get("execution_id", ""))
    if not project_id or not execution_id:
        raise ValueError("project_id and execution_id are required")
    now = datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")
    source_ref = execution_id
    claim = f"{evidence.get('tool', 'unknown')} execution {execution_id} verified"
    content = {"project_id": project_id, "claim": claim, "source_ref": source_ref, "evidence": dict(evidence)}
    return MemoryFact(
        memory_id=_content_hash(content)[:16],
        project_id=project_id,
        claim=claim,
        source="APEX_AUDIT_LEDGER",
        source_ref=source_ref,
        verified_at=now,
        verification_method="DETERMINISTIC_COMPARATOR",
        status="VERIFIED",
        content_sha256=_content_hash(content),
    )


def validate_slab(facts: list[MemoryFact]) -> bool:
    return all(f.status == "VERIFIED" and bool(f.content_sha256) for f in facts)
