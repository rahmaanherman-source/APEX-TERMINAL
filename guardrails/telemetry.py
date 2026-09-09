"""APEX persistent telemetry ledger for resilience runtime evidence."""
from __future__ import annotations

import json
import time
from dataclasses import asdict, dataclass, field
from pathlib import Path
from threading import Lock
from typing import Any


@dataclass(frozen=True)
class Metric:
    timestamp: float
    module_id: str
    metric_type: str
    value: float
    details: dict[str, Any] = field(default_factory=dict)


@dataclass(frozen=True)
class Event:
    timestamp: float
    module_id: str
    event_type: str
    details: dict[str, Any] = field(default_factory=dict)


class Telemetry:
    """Append-only-on-disk evidence store with bounded in-memory views."""

    def __init__(self, storage_path: str = ".apex/telemetry") -> None:
        self.storage_path = Path(storage_path)
        self.storage_path.mkdir(parents=True, exist_ok=True)
        self._metrics_path = self.storage_path / "metrics.jsonl"
        self._events_path = self.storage_path / "events.jsonl"
        self.metrics: list[Metric] = []
        self.events: list[Event] = []
        self.process_metrics: dict[str, dict[str, float]] = {}
        self._lock = Lock()

    def record_metric(self, module_id: str, metric_type: str, value: float, **details: Any) -> Metric:
        metric = Metric(time.time(), module_id, metric_type, float(value), details)
        with self._lock:
            self.metrics.append(metric)
            self.metrics = self.metrics[-5000:]
            with self._metrics_path.open("a", encoding="utf-8") as handle:
                handle.write(json.dumps(asdict(metric), sort_keys=True) + "\n")
        return metric

    def record_event(self, module_id: str, event_type: str, **details: Any) -> Event:
        event = Event(time.time(), module_id, event_type, details)
        with self._lock:
            self.events.append(event)
            self.events = self.events[-5000:]
            with self._events_path.open("a", encoding="utf-8") as handle:
                handle.write(json.dumps(asdict(event), sort_keys=True) + "\n")
        return event

    def get_health_status(self, module_id: str) -> str:
        events = [event for event in self.events if event.module_id == module_id]
        if not events:
            return "UNKNOWN"
        for event in reversed(events):
            if event.event_type == "quarantine":
                return "QUARANTINED"
            if event.event_type in {"start_failed", "health_failed", "recovery_failed"}:
                return "UNHEALTHY"
            if event.event_type in {"health_ok", "recovery_verified", "authorized"}:
                return "HEALTHY"
        return "UNKNOWN"

    def dashboard_data(self) -> dict[str, Any]:
        modules = {m.module_id for m in self.metrics} | {e.module_id for e in self.events}
        return {
            "metrics": [asdict(m) for m in self.metrics[-100:]],
            "events": [asdict(e) for e in self.events[-100:]],
            "process_metrics": self.process_metrics,
            "health_status": {module: self.get_health_status(module) for module in sorted(modules)},
        }

    def alerts(self) -> list[dict[str, Any]]:
        return [
            {"type": "QUARANTINE", "module_id": module, "message": f"Sidecar {module} is QUARANTINED"}
            for module, status in self.dashboard_data()["health_status"].items()
            if status == "QUARANTINED"
        ]
