from audit.ledger import AuditLedger, GENESIS_HASH, canonical_event, next_hash


def test_canonical_event_is_deterministic():
    assert canonical_event({"b": 2, "a": 1}) == '{"a":1,"b":2}'


def test_first_record_uses_genesis_hash():
    ledger = AuditLedger()
    record = ledger.append({"execution_id": "exec-1", "status": "FAILED"})
    assert record.previous_hash == GENESIS_HASH
    assert len(record.hash) == 64
    assert ledger.verify_chain() is True


def test_chain_detects_tampering():
    ledger = AuditLedger()
    ledger.append({"execution_id": "exec-1", "status": "FAILED"})
    ledger.append({"execution_id": "exec-2", "status": "VERIFIED"})
    assert ledger.verify_chain() is True
    ledger._records[0].event["status"] = "VERIFIED"  # deliberate tamper simulation
    assert ledger.verify_chain() is False


def test_hash_formula_is_stable():
    event = {"execution_id": "exec-1", "status": "FAILED"}
    assert next_hash(GENESIS_HASH, event) == next_hash(GENESIS_HASH, event)
