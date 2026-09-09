"""Independent APEX watchdog.

The watchdog is intentionally separate from the core process. It can detect
core death or stale heartbeat and emit an alert event without trusting the
core to report its own failure.
"""
from __future__ import annotations

import argparse
import os
import time
from pathlib import Path

from .black_box import BlackBoxLogger


def run_watchdog(pid: int, heartbeat_file: Path, black_box_path: Path, interval: float = 5.0, timeout: float = 15.0) -> int:
    logger = BlackBoxLogger(black_box_path)
    while True:
        process_alive = _process_alive(pid)
        heartbeat_age = time.time() - heartbeat_file.stat().st_mtime if heartbeat_file.exists() else float("inf")
        if not process_alive:
            logger.record("external-watchdog", "critical_core_exit", "FAILED", "core_process_not_running", result="ALERT")
            return 1
        if heartbeat_age > timeout:
            logger.record("external-watchdog", "critical_heartbeat_timeout", "FAILED", "core_heartbeat_stale", result="ALERT", details={"age_seconds": heartbeat_age})
            return 2
        time.sleep(interval)


def _process_alive(pid: int) -> bool:
    if pid <= 0:
        return False
    try:
        os.kill(pid, 0)
        return True
    except OSError:
        return False


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="APEX independent watchdog")
    parser.add_argument("--pid", type=int, required=True)
    parser.add_argument("--heartbeat", type=Path, default=Path(".apex/heartbeat"))
    parser.add_argument("--black-box", type=Path, default=Path(".apex/black_box.jsonl"))
    parser.add_argument("--interval", type=float, default=5.0)
    parser.add_argument("--timeout", type=float, default=15.0)
    args = parser.parse_args()
    raise SystemExit(run_watchdog(args.pid, args.heartbeat, args.black_box, args.interval, args.timeout))
