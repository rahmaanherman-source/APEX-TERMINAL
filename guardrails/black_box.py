"""APEX Black Box: durable, structured, hash-chained operational evidence."""
from __future__ import annotations

import hashlib
import json
import os
import threading
import time
import uuid
from pathlib import Path
from typing import Any, Dict, Optional


class BlackBoxLogger:
    """Append-only JSONL evidence log with a tamper-evident hash chain."""

    def __init__(self, path: Path) -> None:
        self.path = Path(path)
        self.path.parent.mkdir(parents=True, exist_ok=True)
        self._lock = threading.Lock()
        self._previous_hash = self._recover_last_hash()

    def _recover_last_hash(self) -> str:
        if not self.path.exists():
            return "0" * 64
        last = ""
        try:
            with self.path.open("r", encoding="utf-8") as handle:
                for line in handle:
                    if line.strip():
                        last = line
            if last:
                return json.loads(last)["record_hash"]
        except (OSError, json.JSONDecodeError, KeyError):
            return "0" * 64
        return "0" * 64

    @staticmethod
    def _redact(value: Any) -> Any:
        if isinstance(value, dict):
            return {k: ("[REDACTED]" if any(x in k.lower() for x in ("secret", "token", "password", "api_key", "authorization")) else BlackBoxLogger._redact(v)) for k, v in value.items()}
        if isinstance(value, list):
            return [BlackBoxLogger._redact(v) for v in value]
        if isinstance(value, str) and len(value) > 4096:
            return value[:4096] + "...[TRUNCATED]"
        return value

    def record(self, component: str, event_type: str, lifecycle_state: str, reason: str, result: str = "RECORDED", details: Optional[Dict[str, Any]] = None, **kwargs: Any) -> str:
        # kwargs is intentionally accepted for compatibility with earlier APEX
        # event producers while keeping the canonical event fields explicit.
        payload = {
            "event_id": str(uuid.uuid4()),
            "timestamp": time.time(),
            "component": component,
            "event_type": event_type,
            "lifecycle_state": lifecycle_state,
            "reason": reason,
            "result": result,
            "details": self._redact(details or {}),
        }
        if kwargs:
            payload["details"].update(self._redact(kwargs))
        with self._lock:
            canonical = json.dumps({**payload, "previous_hash": self._previous_hash}, sort_keys=True, separators=(",", ":"))
            record_hash = hashlib.sha256(canonical.encode("utf-8")).hexdigest()
            payload["previous_hash"] = self._previous_hash
            payload["record_hash"] = record_hash
            with self.path.open("a", encoding="utf-8") as handle:
                handle.write(json.dumps(payload, sort_keys=True, separators=(",", ":")) + "\n")
                handle.flush()
                os.fsync(handle.fileno())
            self._previous_hash = record_hash
        return payload["event_id"]

    def record_metric(self, component: str, metric: str, value: float) -> str:
        return self.record(component, "metric", "MONITORING", metric, details={"metric": metric, "value": value})

    def verify_chain(self) -> bool:
        previous = "0" * 64
        try:
            with self.path.open("r", encoding="utf-8") as handle:
                for line in handle:
                    record = json.loads(line)
                    expected = record.pop("record_hash")
                    if record.get("previous_hash") != previous:
                        return False
                    canonical = json.dumps(record, sort_keys=True, separators=(",", ":"))
                    actual = hashlib.sha256(canonical.encode("utf-8")).hexdigest()
                    if actual != expected:
                        return False
                    previous = expected
        except (OSError, json.JSONDecodeError, KeyError):
            return False
        return True
