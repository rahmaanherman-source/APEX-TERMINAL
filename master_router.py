"""APEX Master Router compatibility entrypoint.

The router is intentionally separate from the control-plane ``apex_core.py``:
it owns HTTP sidecar transport, while ApexOrchestrator owns lifecycle truth.
"""
from __future__ import annotations

import asyncio
import json
import logging
import os
import signal
import subprocess
import time
import urllib.error
import urllib.request
from dataclasses import dataclass, field
from enum import Enum
from typing import Dict, Optional, Sequence

from guardrails.breaker_box import BreakerBox
from guardrails.telemetry import Telemetry

logger = logging.getLogger(__name__)


class SidecarStatus(str, Enum):
    STARTING = "STARTING"
    HEALTHY = "HEALTHY"
    UNHEALTHY = "UNHEALTHY"
    QUARANTINED = "QUARANTINED"
    STOPPED = "STOPPED"


@dataclass
class SidecarConfig:
    name: str
    command: Sequence[str]
    port: int
    max_restarts: int = 3
    restart_delay: float = 1.0
    timeout: float = 3.0
    env: Dict[str, str] = field(default_factory=dict)


@dataclass
class Sidecar:
    config: SidecarConfig
    process: Optional[subprocess.Popen] = None
    status: SidecarStatus = SidecarStatus.STOPPED
    restart_count: int = 0
    last_health_check: float = 0.0
    last_error: Optional[str] = None
    pid: Optional[int] = None


class MasterRouter:
    def __init__(self, telemetry: Telemetry | None = None, breaker_box: BreakerBox | None = None) -> None:
        self.sidecars: dict[str, Sidecar] = {}
        self.telemetry = telemetry
        self.breaker_box = breaker_box

    async def start_sidecar(self, config: SidecarConfig) -> Sidecar:
        if config.name in self.sidecars:
            await self.stop_sidecar(config.name)
        sidecar = Sidecar(config=config, status=SidecarStatus.STARTING)
        self.sidecars[config.name] = sidecar
        env = os.environ.copy()
        env.update(config.env)
        try:
            sidecar.process = subprocess.Popen(
                list(config.command),
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL,
                text=True,
                env=env,
                start_new_session=(os.name != "nt"),
            )
            sidecar.pid = sidecar.process.pid
            self._event(config.name, "start", pid=sidecar.pid, status="STARTING")
            # Process creation is NOT health proof. Probe explicitly.
            if await self.health_check(config.name):
                sidecar.status = SidecarStatus.HEALTHY
                sidecar.restart_count = 0
                self._event(config.name, "health_ok", pid=sidecar.pid)
            else:
                sidecar.status = SidecarStatus.UNHEALTHY
                raise RuntimeError(sidecar.last_error or "readiness probe failed")
            return sidecar
        except Exception as exc:
            sidecar.status = SidecarStatus.UNHEALTHY
            sidecar.last_error = str(exc)
            self._event(config.name, "start_failed", error=str(exc))
            await self.stop_sidecar(config.name)
            sidecar.status = SidecarStatus.UNHEALTHY
            return sidecar

    async def stop_sidecar(self, name: str) -> None:
        sidecar = self.sidecars.get(name)
        if not sidecar or not sidecar.process:
            if sidecar:
                sidecar.status = SidecarStatus.STOPPED
            return
        process = sidecar.process
        try:
            if process.poll() is None:
                if os.name != "nt":
                    os.killpg(process.pid, signal.SIGTERM)
                else:
                    process.terminate()
                try:
                    process.wait(timeout=5)
                except subprocess.TimeoutExpired:
                    process.kill()
                    process.wait(timeout=2)
        finally:
            sidecar.process = None
            sidecar.pid = None
            sidecar.status = SidecarStatus.STOPPED
            self._event(name, "stop")

    async def health_check(self, name: str) -> bool:
        sidecar = self.sidecars.get(name)
        if not sidecar or not sidecar.process or sidecar.process.poll() is not None:
            if sidecar:
                sidecar.last_error = "process_not_running"
                sidecar.status = SidecarStatus.UNHEALTHY
            return False
        url = f"http://127.0.0.1:{sidecar.config.port}/health"
        try:
            def probe() -> tuple[int, str]:
                with urllib.request.urlopen(url, timeout=sidecar.config.timeout) as response:
                    return response.status, response.read().decode("utf-8")
            status, _ = await asyncio.to_thread(probe)
            sidecar.last_health_check = time.time()
            healthy = 200 <= status < 300
            if not healthy:
                sidecar.last_error = f"health_status:{status}"
            return healthy
        except (urllib.error.URLError, TimeoutError, OSError) as exc:
            sidecar.last_health_check = time.time()
            sidecar.last_error = str(exc)
            return False

    async def restart_sidecar(self, name: str) -> bool:
        sidecar = self.sidecars.get(name)
        if not sidecar or sidecar.status == SidecarStatus.QUARANTINED:
            return False
        if sidecar.restart_count >= sidecar.config.max_restarts:
            sidecar.status = SidecarStatus.QUARANTINED
            self._event(name, "quarantine", reason="max_restarts_exceeded")
            return False
        await self.stop_sidecar(name)
        sidecar.restart_count += 1
        await asyncio.sleep(sidecar.config.restart_delay * (2 ** (sidecar.restart_count - 1)))
        result = await self.start_sidecar(sidecar.config)
        if result.status != SidecarStatus.HEALTHY and sidecar.restart_count >= sidecar.config.max_restarts:
            result.status = SidecarStatus.QUARANTINED
            self._event(name, "quarantine", reason="recovery_failed")
        return result.status == SidecarStatus.HEALTHY

    async def route_request(self, name: str, request: dict) -> dict:
        sidecar = self.sidecars.get(name)
        if not sidecar:
            return {"status": 404, "error": "sidecar_not_found"}
        if sidecar.status != SidecarStatus.HEALTHY:
            return {"status": 503, "error": f"sidecar_{sidecar.status.value.lower()}", "last_error": sidecar.last_error}
        if self.breaker_box and not self.breaker_box.check_request(name):
            return {"status": 503, "error": "circuit_breaker_open"}
        started = time.perf_counter()
        body = json.dumps(request).encode("utf-8")
        req = urllib.request.Request(
            f"http://127.0.0.1:{sidecar.config.port}/process",
            data=body,
            headers={"Content-Type": "application/json"},
            method="POST",
        )
        try:
            def send() -> tuple[int, str]:
                with urllib.request.urlopen(req, timeout=sidecar.config.timeout) as response:
                    return response.status, response.read().decode("utf-8")
            status, response_body = await asyncio.to_thread(send)
            latency_ms = (time.perf_counter() - started) * 1000
            self._metric(name, "latency_ms", latency_ms)
            if 200 <= status < 300:
                if self.breaker_box:
                    self.breaker_box.record_success(name)
                self._metric(name, "request_success", 1)
                return {"status": status, "result": response_body, "latency_ms": latency_ms}
            raise RuntimeError(f"http_status:{status}")
        except Exception as exc:
            latency_ms = (time.perf_counter() - started) * 1000
            if self.breaker_box:
                self.breaker_box.record_failure(name, str(exc))
            self._metric(name, "request_error", 1, error=str(exc))
            return {"status": 500, "error": str(exc), "latency_ms": latency_ms}

    async def monitor_once(self) -> None:
        for name, sidecar in list(self.sidecars.items()):
            if sidecar.status in {SidecarStatus.STOPPED, SidecarStatus.QUARANTINED}:
                continue
            if not await self.health_check(name):
                sidecar.status = SidecarStatus.UNHEALTHY
                self._event(name, "health_failed", error=sidecar.last_error)
                await self.restart_sidecar(name)

    def _event(self, module: str, event: str, **details: object) -> None:
        if self.telemetry:
            self.telemetry.record_event(module, event, **details)

    def _metric(self, module: str, metric: str, value: float, **details: object) -> None:
        if self.telemetry:
            self.telemetry.record_metric(module, metric, value, **details)
