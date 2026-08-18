"""First real APEX adapter: observe local process/runtime status.

This adapter reports observations only. Verification remains in core.comparator.
"""

from __future__ import annotations

import hashlib
import json
import platform
import time
from datetime import datetime, timezone
import uuid


VERSION = "0.1.0"
_START = time.monotonic()


def _sha256(value: object) -> str:
    data = json.dumps(value, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return hashlib.sha256(data).hexdigest()


def observe_system_status() -> dict:
    execution_id = str(uuid.uuid4())
    started = time.perf_counter()

    payload = {
        "status": "SOVEREIGN_ONLINE",
        "uptime": round(time.monotonic() - _START, 3),
        "version": VERSION,
        "timestamp": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
        "platform": platform.platform(),
        "python": platform.python_version(),
    }

    latency_ms = round((time.perf_counter() - started) * 1000, 3)

    return {
        "execution_id": execution_id,
        "action_id": "SYSTEM_STATUS",
        "adapter": "system_status",
        "observed_at": payload["timestamp"],
        "status": "OBSERVED",
        "payload": payload,
        "health_ok": True,
        "latency_ms": latency_ms,
        "evidence": ["local_runtime_observation"],
        "readback_sha256": _sha256(payload),
    }
