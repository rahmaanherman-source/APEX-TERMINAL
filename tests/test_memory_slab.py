import pytest

from core.memory_slab import record_verified_fact, validate_slab


def test_unverified_evidence_cannot_enter_hard_memory():
    with pytest.raises(ValueError, match="Only VERIFIED"):
        record_verified_fact("APEX-TERMINAL", {"status": "UNVERIFIED", "execution_id": "x"})


def test_verified_evidence_becomes_hard_memory_fact():
    fact = record_verified_fact("APEX-TERMINAL", {"status": "VERIFIED", "execution_id": "x", "tool": "system_status"})
    assert fact.status == "VERIFIED"
    assert len(fact.content_sha256) == 64
    assert validate_slab([fact]) is True
