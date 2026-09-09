"""APEX terminal health view over the persistent telemetry layer."""
from __future__ import annotations

import time

try:
    import psutil
except ImportError:  # pragma: no cover
    psutil = None

from telemetry import Telemetry


class SystemHealthMonitor:
    def __init__(self, telemetry: Telemetry) -> None:
        self.telemetry = telemetry
        self.running = False

    def snapshot(self) -> dict:
        system = {}
        if psutil:
            system = {
                "cpu_percent": psutil.cpu_percent(interval=0.1),
                "memory_percent": psutil.virtual_memory().percent,
                "disk_percent": psutil.disk_usage("/").percent,
            }
        return {"system": system, **self.telemetry.dashboard_data(), "alerts": self.telemetry.alerts()}

    def display_once(self) -> None:
        data = self.snapshot()
        print("APEX SYSTEM HEALTH")
        print("=" * 60)
        if data["system"]:
            print("SYSTEM:", data["system"])
        print("SIDECARS:")
        for module, status in data["health_status"].items():
            print(f"  {module}: {status}")
        print("RECENT EVENTS:")
        for event in data["events"][-5:]:
            stamp = time.strftime("%H:%M:%S", time.localtime(event["timestamp"]))
            print(f"  [{stamp}] {event['module_id']}: {event['event_type']}")
        if data["alerts"]:
            print("ALERTS:")
            for alert in data["alerts"]:
                print(f"  {alert['message']}")

    def start(self, interval_seconds: float = 2.0) -> None:
        self.running = True
        try:
            while self.running:
                self.display_once()
                time.sleep(interval_seconds)
        except KeyboardInterrupt:
            self.running = False
