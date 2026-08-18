from core.adapter_manager import AdapterManager, AdapterRecord
from core.protocol import ConnectionState

DESIRED = {
    "required_fields": ["status", "uptime", "version", "timestamp"],
    "status_allowlist": ["SOVEREIGN_ONLINE", "DEGRADED", "OFFLINE", "UNVERIFIED"],
    "version_pattern": r"^\d+\.\d+(\.\d+)?(\.\w+)?$",
    "max_response_ms": 2000,
    "epsilon": 0.0,
    "external_health_required": True,
}


def evidence(execution_id):
    return {
        "execution_id": execution_id,
        "action_id": "SYSTEM_STATUS",
        "adapter": "test",
        "observed_at": "2026-08-18T00:00:00Z",
        "status": "OBSERVED",
        "payload": {"status": "SOVEREIGN_ONLINE", "uptime": 1.0, "version": "3.0.OMEGA", "timestamp": "2026-08-18T00:00:00Z"},
        "health_ok": True,
        "latency_ms": 10,
        "evidence": ["test"],
        "readback_sha256": "a" * 64,
    }


def test_manager_only_marks_verified_after_comparator_passes():
    manager = AdapterManager()
    manager.register(AdapterRecord("test", "Test", lambda command, execution_id: evidence(execution_id)))
    result = manager.audit("test", DESIRED)
    assert result.status == "VERIFIED"
    assert manager.get_status("test") == ConnectionState.VERIFIED


def test_unknown_adapter_is_unverified():
    manager = AdapterManager()
    result = manager.audit("missing", DESIRED)
    assert result.status == "UNVERIFIED"


def test_bad_adapter_evidence_cannot_be_green():
    manager = AdapterManager()
    manager.register(AdapterRecord("bad", "Bad", lambda command, execution_id: {"status": "VERIFIED"}))
    result = manager.audit("bad", DESIRED)
    assert result.status == "FAILED"
    assert manager.get_status("bad") == ConnectionState.FAILED
