#!/usr/bin/env python3
"""APEX Bootstrap CLI: validate, start, status, monitor, route, stop.

This is a control-plane launcher, not a claim of production deployment. A
sidecar becomes operational only after it passes the Gate 1 guardrail and its
readiness probe succeeds.

    python apex_bootstrap.py validate examples/sidecar_a.py
    python apex_bootstrap.py start                 # runs in the foreground
    python apex_bootstrap.py status                # from a second terminal
    python apex_bootstrap.py route sidecar_a "hello"
    python apex_bootstrap.py monitor               # live view, Ctrl+C to exit
    python apex_bootstrap.py stop
"""
from __future__ import annotations

import argparse
import asyncio
import json
import os
import signal
import time
import urllib.error
import urllib.request
from pathlib import Path

try:
    import psutil
except ImportError:  # pragma: no cover
    psutil = None

from breaker_box import BreakerBox
from guardrail import Guardrail
from master_router import PROJECT_ROOT, MasterRouter, SidecarConfig, SidecarStatus
from telemetry import Telemetry
from system_health_monitor import SystemHealthMonitor


DEFAULT_CONFIG = PROJECT_ROOT / "config" / "apex-sidecars.json"
RUN_DIR = PROJECT_ROOT / ".apex" / "run"
PID_FILE = RUN_DIR / "bootstrap.pid"
STATE_FILE = RUN_DIR / "state.json"
TELEMETRY_DIR = str(PROJECT_ROOT / ".apex" / "telemetry")
MONITOR_INTERVAL = 5.0


# ---------------------------------------------------------------- config

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


def sidecar_sources(config: SidecarConfig) -> list[Path]:
    """The Python files a sidecar command will execute."""
    return [PROJECT_ROOT / part for part in config.command if str(part).endswith(".py")]


def gate_one(config: SidecarConfig) -> tuple[bool, str]:
    """Gate 1: every sidecar source must pass the guardrail before it runs."""
    sources = sidecar_sources(config)
    if not sources:
        return True, "no python source to scan"
    for source in sources:
        if not source.exists():
            return False, f"missing_source:{source.relative_to(PROJECT_ROOT)}"
        ok, message = Guardrail().run_all_checks(source.read_text(encoding="utf-8"), str(source))
        if not ok:
            return False, f"{source.relative_to(PROJECT_ROOT)}: {message}"
    return True, "guardrail passed"


# ---------------------------------------------------------- run state

def read_pid() -> int | None:
    try:
        pid = int(PID_FILE.read_text(encoding="utf-8").strip())
    except (OSError, ValueError):
        return None
    return pid if pid_alive(pid) else None


def pid_alive(pid: int) -> bool:
    """True while the process is really running (an exited zombie counts as gone)."""
    try:
        os.kill(pid, 0)
    except ProcessLookupError:
        return False
    except PermissionError:
        return True
    if psutil is not None:
        try:
            return psutil.Process(pid).status() != psutil.STATUS_ZOMBIE
        except psutil.NoSuchProcess:
            return False
    return True


def write_state(router: MasterRouter) -> None:
    RUN_DIR.mkdir(parents=True, exist_ok=True)
    state = {
        "supervisor_pid": os.getpid(),
        "updated_at": time.time(),
        "sidecars": {
            name: {
                "status": sidecar.status.value,
                "pid": sidecar.pid,
                "port": sidecar.config.port,
                "restart_count": sidecar.restart_count,
                "last_error": sidecar.last_error,
                "breaker": router.breaker_box.get(name).state.name if router.breaker_box else None,
            }
            for name, sidecar in router.sidecars.items()
        },
    }
    tmp = STATE_FILE.with_suffix(".tmp")
    tmp.write_text(json.dumps(state, indent=2), encoding="utf-8")
    tmp.replace(STATE_FILE)


def read_state() -> dict | None:
    try:
        return json.loads(STATE_FILE.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return None


def clear_run_files() -> None:
    for path in (PID_FILE, STATE_FILE):
        try:
            path.unlink()
        except FileNotFoundError:
            pass


# ------------------------------------------------------------ commands

async def start(config_path: Path) -> int:
    running = read_pid()
    if running:
        print(f"BLOCKED: APEX is already running (pid {running}). Use 'stop' first.")
        return 2
    configs = load_configs(config_path)
    if not configs:
        print(f"BLOCKED: no sidecar configuration at {config_path}")
        return 2

    telemetry = Telemetry(TELEMETRY_DIR)
    breaker = BreakerBox(telemetry)
    router = MasterRouter(telemetry, breaker)

    print("Gate 1 · sanitization")
    for config in configs:
        ok, message = gate_one(config)
        telemetry.record_event(config.name, "gate1_pass" if ok else "gate1_blocked", detail=message)
        print(f"  {config.name}: {'PASS' if ok else 'BLOCKED'} ({message})")
        if not ok:
            return 1

    RUN_DIR.mkdir(parents=True, exist_ok=True)
    PID_FILE.write_text(str(os.getpid()), encoding="utf-8")

    print("Gate 2 · isolated start + readiness probe")
    try:
        for config in configs:
            result = await router.start_sidecar(config)
            print(f"  {config.name}: {result.status.value} (pid {result.pid}, port {config.port})")
            if result.status != SidecarStatus.HEALTHY:
                print(f"  reason: {result.last_error}")
                for name in list(router.sidecars):
                    await router.stop_sidecar(name)
                return 1
        write_state(router)

        stop = asyncio.Event()
        loop = asyncio.get_running_loop()
        for sig in (signal.SIGINT, signal.SIGTERM):
            try:
                loop.add_signal_handler(sig, stop.set)
            except NotImplementedError:
                pass

        print("Gate 3 · monitoring every 5s (Ctrl+C or 'stop' to shut down)")
        print("APEX bootstrap operational: readiness probes passed")
        while not stop.is_set():
            try:
                await asyncio.wait_for(stop.wait(), timeout=MONITOR_INTERVAL)
            except asyncio.TimeoutError:
                pass
            if stop.is_set():
                break
            await router.monitor_once()
            write_state(router)

        print("Shutting down sidecars...")
        for name in list(router.sidecars):
            await router.stop_sidecar(name)
        print("APEX stopped cleanly")
        return 0
    finally:
        clear_run_files()


def stop() -> int:
    pid = read_pid()
    if not pid:
        clear_run_files()
        print("APEX is not running")
        return 0
    os.kill(pid, signal.SIGTERM)
    deadline = time.monotonic() + 15
    while time.monotonic() < deadline:
        if not pid_alive(pid):
            print(f"APEX stopped (pid {pid})")
            return 0
        time.sleep(0.2)
    print(f"FAILED: APEX (pid {pid}) did not stop within 15s")
    return 1


def status() -> int:
    pid = read_pid()
    state = read_state()
    if not pid or not state:
        print("APEX is not running")
        SystemHealthMonitor(Telemetry(TELEMETRY_DIR)).display_once()
        return 3
    age = time.time() - state.get("updated_at", 0)
    print(f"APEX running · supervisor pid {pid} · state {age:.0f}s old")
    for name, info in state["sidecars"].items():
        print(
            f"  {name}: {info['status']} · pid {info['pid']} · port {info['port']}"
            f" · restarts {info['restart_count']} · breaker {info['breaker']}"
            + (f" · last error: {info['last_error']}" if info["status"] != "HEALTHY" and info["last_error"] else "")
        )
    return 0 if all(info["status"] == "HEALTHY" for info in state["sidecars"].values()) else 1


def route(name: str, text: str) -> int:
    state = read_state()
    if not read_pid() or not state:
        print("BLOCKED: APEX is not running")
        return 2
    info = state["sidecars"].get(name)
    if not info:
        print(f"BLOCKED: no sidecar named {name}")
        return 2
    if info["status"] != "HEALTHY":
        print(f"BLOCKED: {name} is {info['status']}")
        return 2
    body = json.dumps({"input": text}).encode("utf-8")
    req = urllib.request.Request(
        f"http://127.0.0.1:{info['port']}/process",
        data=body,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    started = time.perf_counter()
    try:
        with urllib.request.urlopen(req, timeout=5) as response:
            payload = response.read().decode("utf-8")
            print(f"{response.status} {payload} ({(time.perf_counter() - started) * 1000:.0f} ms)")
            return 0
    except (urllib.error.URLError, OSError) as exc:
        print(f"FAILED: {exc}")
        return 1


def main() -> int:
    parser = argparse.ArgumentParser(description="APEX Bootstrap Lifecycle")
    sub = parser.add_subparsers(dest="command", required=True)
    start_parser = sub.add_parser("start", help="start all sidecars (foreground)")
    start_parser.add_argument("--config", type=Path, default=DEFAULT_CONFIG)
    sub.add_parser("stop", help="stop a running APEX supervisor")
    sub.add_parser("status", help="show live sidecar status")
    monitor = sub.add_parser("monitor", help="live health view")
    monitor.add_argument("--once", action="store_true", help="print one snapshot and exit")
    route_parser = sub.add_parser("route", help="send a test request to a sidecar")
    route_parser.add_argument("name")
    route_parser.add_argument("text")
    validate = sub.add_parser("validate", help="run the Gate 1 guardrail on a file")
    validate.add_argument("file", type=Path)
    args = parser.parse_args()

    if args.command == "start":
        return asyncio.run(start(args.config))
    if args.command == "stop":
        return stop()
    if args.command == "status":
        return status()
    if args.command == "route":
        return route(args.name, args.text)
    if args.command == "validate":
        code = args.file.read_text(encoding="utf-8")
        ok, message = Guardrail().run_all_checks(code, str(args.file))
        print(("PASS " if ok else "BLOCKED ") + message)
        return 0 if ok else 1
    monitor_view = SystemHealthMonitor(Telemetry(TELEMETRY_DIR))
    if args.once:
        monitor_view.display_once()
        return 0
    try:
        while True:
            monitor_view.telemetry.reload()
            print("\033[2J\033[H", end="")
            monitor_view.display_once()
            time.sleep(2)
    except KeyboardInterrupt:
        return 0


if __name__ == "__main__":
    raise SystemExit(main())
