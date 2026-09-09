# APEX Core Resilience Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the APEX Resilience Statute as a lifecycle-controlled core with sanitization, isolated module management, health/recovery behavior, durable Black Box evidence, and an independent watchdog.

**Architecture:** The Bootstrap Orchestrator owns explicit lifecycle states. The Sanitization Engine gates source before execution, the Black Box records durable hash-chained evidence, and sidecar/process boundaries isolate external modules. Health probes and bounded recovery determine whether components can remain operational.

**Tech Stack:** Python 3, psutil, subprocess/process isolation, AST analysis, JSONL, SHA-256, pytest.

**Spec:** `docs/law/APEX_RESILIENCE_STATUTE.md` and `docs/canonical/APEX_CORE_ARCHITECTURE.md`

## Global Constraints

- No fake GREEN/OPERATIONAL state.
- Process creation is not equivalent to health.
- Regex is supplemental; AST/policy analysis is required for dangerous-call detection.
- Security failures are observable and can quarantine a module.
- Recovery is bounded and verified before traffic restoration.
- Black Box records must not expose secrets.
- The external watchdog must not depend solely on the core it observes.

---

### Task 1: Sanitization Engine

**Files:**
- Create: `guardrails/security_filter.py`
- Test: `tests/test_apex_core.py`

- [x] Add AST-aware dangerous-call detection.
- [x] Add supplemental forbidden-text and secret detection.
- [x] Return deterministic PASS/BLOCKED/FAILED results.

### Task 2: Black Box

**Files:**
- Create: `guardrails/black_box.py`
- Test: `tests/test_apex_core.py`

- [x] Write durable structured JSONL evidence.
- [x] Flush records to disk.
- [x] Redact common secret fields.
- [x] Hash-chain records.
- [x] Verify the chain.

### Task 3: Lifecycle Orchestrator

**Files:**
- Create: `apex_core.py`
- Test: `tests/test_apex_core.py`

- [x] Define explicit lifecycle states.
- [x] Register modules with structured launch commands.
- [x] Sanitize source before launch.
- [x] Separate start from readiness probing.
- [x] Implement breaker trip, bounded recovery and quarantine.
- [x] Record lifecycle evidence.

### Task 4: Independent Watchdog

**Files:**
- Create: `guardrails/watchdog.py`

- [x] Observe core process independently.
- [x] Observe heartbeat freshness.
- [x] Record critical alerts.

### Task 5: Canonical Capture and Dependency Declaration

**Files:**
- Create: `docs/canonical/APEX_CORE_ARCHITECTURE_SESSION_CAPTURE_2026-09-09.md`
- Create: `requirements-apex-core.txt`

- [x] Preserve the session architecture and production corrections.
- [x] Declare runtime dependency.

### Verification

- [ ] Run the complete pytest suite in a real checkout.
- [ ] Run the APEX security tests.
- [ ] Run Black Box tamper verification against an intentionally modified record.
- [ ] Exercise sidecar process death and verify bounded recovery/quarantine.
- [ ] Exercise stale heartbeat and verify independent watchdog alerting.
- [ ] Verify production deployment in the target environment before calling the system production-ready.
