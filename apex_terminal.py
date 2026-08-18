"""Local-first APEX TERMINAL entry point.

Run with: python apex_terminal.py status
"""
from __future__ import annotations

import json
import sys

from adapters.system_status import observe_system_status
from audit.ledger import AuditLedger
from core.comparator import compare_system_status


DESIRED_SYSTEM_STATUS = {
    "required_fields": ["status", "uptime", "version", "timestamp"],
    "status_allowlist": ["SOVEREIGN_ONLINE", "DEGRADED", "OFFLINE", "UNVERIFIED"],
    "version_pattern": r"^\d+\.\d+(\.\d+)?(\.\w+)?$",
    "max_response_ms": 2000,
    "epsilon": 0.0,
    "external_health_required": True,
}


def main(argv: list[str]) -> int:
    command = (argv[1] if len(argv) > 1 else "status").lower()
    ledger = AuditLedger()

    if command != "status":
        print(json.dumps({"status": "UNVERIFIED", "reason": "COMMAND_NOT_IMPLEMENTED", "command": command}, indent=2))
        return 2

    actual = observe_system_status()
    result = compare_system_status(actual, DESIRED_SYSTEM_STATUS, actual["execution_id"])
    record = ledger.append({
        "execution_id": actual["execution_id"],
        "tool": "system_status",
        "desired_state": DESIRED_SYSTEM_STATUS,
        "actual_state": actual,
        "delta": result.get("delta"),
        "status": result.get("status"),
        "readback_sha256": actual.get("readback_sha256"),
    })
    print(json.dumps({"verification": result, "audit": {"hash": record.hash, "chain_valid": ledger.verify_chain()}}, indent=2, default=str))
    return 0 if result.get("status") == "VERIFIED" else 1


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
