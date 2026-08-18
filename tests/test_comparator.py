from core.comparator import FAILED, VERIFIED, compare_system_status


DESIRED = {
    "required_fields": ["status", "uptime", "version", "timestamp"],
    "status_allowlist": ["SOVEREIGN_ONLINE", "DEGRADED", "OFFLINE", "UNVERIFIED"],
    "version_pattern": r"^\d+\.\d+(\.\d+)?(\.\w+)?$",
    "max_response_ms": 2000,
    "epsilon": 0.0,
    "external_health_required": True,
}


def canonical_actual(latency_ms=100):
    return {
        "execution_id": "exec-1",
        "action_id": "SYSTEM_STATUS",
        "adapter": "system_status",
        "observed_at": "2026-08-18T00:00:00Z",
        "status": "OBSERVED",
        "payload": {
            "status": "SOVEREIGN_ONLINE",
            "uptime": 10.0,
            "version": "3.0.0.OMEGA",
            "timestamp": "2026-08-18T00:00:00Z",
        },
        "health_ok": True,
        "latency_ms": latency_ms,
        "evidence": ["test"],
        "readback_sha256": "a" * 64,
    }


def test_system_status_verified_when_observed_state_matches_contract():
    result = compare_system_status(canonical_actual(), DESIRED, "exec-1")
    assert result["status"] == VERIFIED
    assert result["delta"] == 0.0


def test_system_status_fails_when_latency_exceeds_budget():
    result = compare_system_status(canonical_actual(2200), DESIRED, "exec-1")
    assert result["status"] == FAILED
    assert result["delta"] > 0


def test_malformed_evidence_never_becomes_green():
    result = compare_system_status({"payload": {}}, DESIRED, "exec-3")
    assert result["status"] == FAILED
    assert result["reason"] == "MALFORMED_EVIDENCE"
