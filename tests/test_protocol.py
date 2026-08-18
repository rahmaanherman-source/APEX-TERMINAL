import pytest

from core.protocol import ConnectionState, validate_canonical_state


def valid_state():
    return {
        "execution_id": "exec-1",
        "action_id": "SYSTEM_STATUS",
        "adapter": "system_status",
        "observed_at": "2026-08-18T00:00:00Z",
        "status": "OBSERVED",
        "payload": {"status": "SOVEREIGN_ONLINE", "uptime": 1.0, "version": "3.0.OMEGA", "timestamp": "2026-08-18T00:00:00Z"},
        "health_ok": True,
        "latency_ms": 10,
        "evidence": ["local"],
        "readback_sha256": "a" * 64,
    }


def test_valid_canonical_state_is_accepted():
    result = validate_canonical_state(valid_state())
    assert result.execution_id == "exec-1"
    assert result.adapter == "system_status"


def test_adapter_cannot_self_attest_verified():
    state = valid_state()
    state["status"] = ConnectionState.VERIFIED.value
    with pytest.raises(ValueError, match="cannot report VERIFIED"):
        validate_canonical_state(state)


def test_missing_evidence_is_rejected():
    state = valid_state()
    state.pop("evidence")
    with pytest.raises(ValueError, match="missing fields"):
        validate_canonical_state(state)
