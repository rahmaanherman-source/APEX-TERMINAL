from __future__ import annotations

import asyncio
import json
import sys
from pathlib import Path

from breaker_box import BreakerBox, BreakerState
from guardrail import Guardrail
from guardrails.telemetry import Telemetry
from master_router import MasterRouter, SidecarConfig, SidecarStatus


def test_guardrail_blocks_dangerous_calls_and_accepts_safe_code(tmp_path: Path):
    safe = "def hello():\n    return 'ok'\n"
    unsafe = "import os\nos.system('echo nope')\n"
    assert Guardrail().run_all_checks(safe)[0] is True
    assert Guardrail().run_all_checks(unsafe)[0] is False


def test_breaker_opens_after_threshold(tmp_path: Path):
    telemetry = Telemetry(str(tmp_path / "telemetry"))
    breaker = BreakerBox(telemetry)
    for _ in range(3):
        breaker.record_failure("x")
    assert breaker.get("x").state == BreakerState.OPEN
    assert breaker.check_request("x") is False


def test_sidecar_start_probe_route_and_stop(tmp_path: Path):
    async def scenario():
        telemetry = Telemetry(str(tmp_path / "telemetry"))
        router = MasterRouter(telemetry, BreakerBox(telemetry))
        config = SidecarConfig(
            name="test_sidecar",
            command=[sys.executable, "examples/sidecar_a.py"],
            port=18991,
        )
        try:
            sidecar = await router.start_sidecar(config)
            assert sidecar.status == SidecarStatus.HEALTHY
            response = await router.route_request("test_sidecar", {"input": "APEX"})
            assert response["status"] == 200
            assert "APEX" in response["result"]
        finally:
            await router.stop_sidecar("test_sidecar")
            assert router.sidecars["test_sidecar"].status == SidecarStatus.STOPPED

    asyncio.run(scenario())
