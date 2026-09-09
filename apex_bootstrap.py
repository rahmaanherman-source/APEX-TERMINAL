#!/usr/bin/env python3
"""APEX Bootstrap CLI: validate, start, monitor, status, stop.

This is a control-plane launcher, not a claim of production deployment. A
module becomes operational only after its readiness probe succeeds.
"""
from __future__ import annotations

import argparse
import asyncio
import json
import signal
from pathlib import Path

from breaker_box import BreakerBox
from guardrail import Guardrail
from master_router import MasterRouter, SidecarConfig, SidecarStatus
from telemetry import Telemetry
from system_health_monitor import SystemHealthMonitor


DEFAULT_CONFIG = Path("config/apex-sidecars.json")


def load_configs(path: Path) -> list[SidecarConfig]:
    if not path.exists():
        return []
    payload = json.loads(path.read_text(encoding="utf-8"))
    return [
        SidecarConfig(
            name=item["name"],
            command=item["command"],
            port=int(item["port"]),
            max_restarts=int(item.get("max_restarts", 3)),
            restart_delay=float(item.get("restart_delay", 1.0)),
            timeout=float(item.get("timeout", 3.0)),
            env=item.get("env", {}),
        )
        for item in payload.get("sidecars", [])
    ]


async def start(config_path: Path) -> int:
    telemetry = Telemetry()
    breaker = BreakerBox(telemetry)
    router = MasterRouter(telemetry, breaker)
    configs = load_configs(config_path)
    if not configs:
        print(f"BLOCKED: no sidecar configuration at {config_path}")
        return 2
    for config in configs:
        result = await router.start_sidecar(config)
        print(f"{config.name}: {result.status.value}")
        if result.status != SidecarStatus.HEALTHY:
            await router.stop_sidecar(config.name)
            return 1
    stop = asyncio.Event()
    loop = asyncio.get_running_loop()
    for sig in (signal.SIGINT, signal.SIGTERM):
        try:
            loop.add_signal_handler(sig, stop.set)
        except NotImplementedError:
            pass
    print("APEX bootstrap operational: readiness probes passed")
    while not stop.is_set():
        await router.monitor_once()
        await asyncio.sleep(5)
    for name in list(router.sidecars):
        await router.stop_sidecar(name)
    return 0


def main() -> int:
    parser = argparse.ArgumentParser(description="APEX Bootstrap Lifecycle")
    sub = parser.add_subparsers(dest="command", required=True)
    start_parser = sub.add_parser("start")
    start_parser.add_argument("--config", type=Path, default=DEFAULT_CONFIG)
    sub.add_parser("monitor")
    sub.add_parser("status")
    validate = sub.add_parser("validate")
    validate.add_argument("file", type=Path)
    args = parser.parse_args()

    if args.command == "start":
        return asyncio.run(start(args.config))
    if args.command == "validate":
        code = args.file.read_text(encoding="utf-8")
        ok, message = Guardrail().run_all_checks(code, str(args.file))
        print(message)
        return 0 if ok else 1
    telemetry = Telemetry()
    SystemHealthMonitor(telemetry).display_once()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
