from pathlib import Path

from apex_core import ApexOrchestrator, LifecycleState, ModuleSpec
from guardrails.black_box import BlackBoxLogger
from guardrails.security_filter import SecurityFilter


def test_security_filter_blocks_dangerous_calls():
    result = SecurityFilter().scan_text("import os\nos.system('echo no')")
    assert result.allowed is False
    assert any("os.system" in finding for finding in result.findings)


def test_security_filter_accepts_safe_syntax():
    result = SecurityFilter().scan_text("value = 2 + 2\nprint(value)")
    assert result.allowed is True
    assert result.status == "PASS"


def test_black_box_chain_round_trip(tmp_path: Path):
    log = BlackBoxLogger(tmp_path / "black_box.jsonl")
    log.record("test", "started", "STARTING", "unit_test")
    log.record_metric("test", "cpu_percent", 12.5)
    assert log.verify_chain() is True


def test_orchestrator_does_not_mark_unprobed_module_operational(tmp_path: Path):
    core = ApexOrchestrator(str(tmp_path / ".apex"))
    core.register(ModuleSpec(name="missing", command=["python", "missing.py"]))
    assert core.modules["missing"].state == LifecycleState.INITIALIZING


def test_module_source_is_gated_before_launch(tmp_path: Path):
    source = tmp_path / "module.py"
    source.write_text("import os\nos.system('bad')", encoding="utf-8")
    core = ApexOrchestrator(str(tmp_path / ".apex"))
    core.register(ModuleSpec(name="blocked", command=["python", str(source)], source_path=source))
    try:
        core.start_module("blocked")
    except PermissionError:
        pass
    assert core.modules["blocked"].state == LifecycleState.QUARANTINED
