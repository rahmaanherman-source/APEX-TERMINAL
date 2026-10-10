"""End-to-end checks for the APEX Zero-Trust bootstrap lifecycle.

These start real sidecar processes on local ports, kill them, and read the
telemetry ledger back from disk, the way an operator would.
"""
from __future__ import annotations

import asyncio
import json
import signal
import subprocess
import sys
import time
import urllib.request
from pathlib import Path

import pytest

from breaker_box import BreakerBox
from guardrails.telemetry import Telemetry
from master_router import MasterRouter, SidecarConfig, SidecarStatus

ROOT = Path(__file__).resolve().parents[1]


def sidecar(port: int, name: str = "e2e") -> SidecarConfig:
    return SidecarConfig(
        name=name,
        command=["python", "examples/sidecar_a.py", "--port", str(port)],
        port=port,
        max_restarts=2,
        restart_delay=0.1,
        timeout=8.0,
    )


def test_example_sidecar_passes_gate_one():
    from guardrail import Guardrail

    code = (ROOT / "examples" / "sidecar_a.py").read_text(encoding="utf-8")
    ok, message = Guardrail().run_all_checks(code)
    assert ok, message


def test_crashed_sidecar_is_restarted_and_serves_again(tmp_path: Path):
    async def scenario():
        telemetry = Telemetry(str(tmp_path / "telemetry"))
        router = MasterRouter(telemetry, BreakerBox(telemetry))
        try:
            first = await router.start_sidecar(sidecar(18992))
            assert first.status == SidecarStatus.HEALTHY
            first.process.kill()
            first.process.wait(timeout=5)

            await router.monitor_once()
            recovered = router.sidecars["e2e"]
            assert recovered.status == SidecarStatus.HEALTHY
            assert recovered.pid != first.pid
            assert recovered.restart_count == 1

            response = await router.route_request("e2e", {"input": "after crash"})
            assert response["status"] == 200
            assert "after crash" in response["result"]
        finally:
            await router.stop_sidecar("e2e")

    asyncio.run(scenario())


def test_stable_sidecar_earns_back_its_restart_budget(tmp_path: Path):
    async def scenario():
        telemetry = Telemetry(str(tmp_path / "telemetry"))
        router = MasterRouter(telemetry, BreakerBox(telemetry))
        router.stable_checks = 2
        try:
            first = await router.start_sidecar(sidecar(18993))
            first.process.kill()
            first.process.wait(timeout=5)
            await router.monitor_once()
            assert router.sidecars["e2e"].restart_count == 1
            await router.monitor_once()
            await router.monitor_once()
            assert router.sidecars["e2e"].restart_count == 0
        finally:
            await router.stop_sidecar("e2e")

    asyncio.run(scenario())


def test_crash_looping_sidecar_is_quarantined(tmp_path: Path):
    async def scenario():
        telemetry = Telemetry(str(tmp_path / "telemetry"))
        router = MasterRouter(telemetry, BreakerBox(telemetry))
        broken = SidecarConfig(
            name="broken",
            command=[sys.executable, "-c", "pass"],  # exits immediately, never healthy
            port=18994,
            max_restarts=2,
            restart_delay=0.01,
            timeout=0.5,
        )
        await router.start_sidecar(broken)
        router.sidecars["broken"].status = SidecarStatus.UNHEALTHY
        for _ in range(4):
            await router.monitor_once()
        assert router.sidecars["broken"].status == SidecarStatus.QUARANTINED
        response = await router.route_request("broken", {"input": "x"})
        assert response["status"] == 503

    asyncio.run(scenario())
    reloaded = Telemetry(str(tmp_path / "telemetry"))
    assert reloaded.get_health_status("broken") == "QUARANTINED"


def test_telemetry_is_readable_from_a_second_process(tmp_path: Path):
    writer = Telemetry(str(tmp_path / "telemetry"))
    writer.record_event("sidecar_x", "health_ok")
    reader = Telemetry(str(tmp_path / "telemetry"))
    assert reader.get_health_status("sidecar_x") == "HEALTHY"


def test_cli_start_status_route_stop(tmp_path: Path):
    """The operator flow from the README, as separate processes."""
    config = tmp_path / "sidecars.json"
    config.write_text(json.dumps({"sidecars": [{
        "name": "cli_sidecar",
        "command": ["python", "examples/sidecar_a.py", "--port", "18995"],
        "port": 18995,
        "timeout": 8.0,
    }]}), encoding="utf-8")

    def cli(*args: str) -> subprocess.CompletedProcess:
        return subprocess.run([sys.executable, "apex_bootstrap.py", *args],
                              cwd=ROOT, capture_output=True, text=True, timeout=30)

    if cli("status").returncode != 3:
        pytest.skip("another APEX supervisor is already running in this checkout")

    supervisor = subprocess.Popen([sys.executable, "apex_bootstrap.py", "start", "--config", str(config)],
                                  cwd=ROOT, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True)
    try:
        deadline = time.monotonic() + 20
        while time.monotonic() < deadline and cli("status").returncode != 0:
            time.sleep(0.3)
        status = cli("status")
        assert status.returncode == 0, status.stdout
        assert "cli_sidecar: HEALTHY" in status.stdout

        routed = cli("route", "cli_sidecar", "hello")
        assert routed.returncode == 0, routed.stdout
        assert "Processed: hello" in routed.stdout

        stopped = cli("stop")
        assert stopped.returncode == 0, stopped.stdout
        supervisor.wait(timeout=20)
        assert supervisor.returncode == 0
        assert cli("status").returncode == 3
        with pytest.raises(OSError):
            urllib.request.urlopen("http://127.0.0.1:18995/health", timeout=1)
    finally:
        if supervisor.poll() is None:
            supervisor.send_signal(signal.SIGTERM)
            supervisor.wait(timeout=20)
