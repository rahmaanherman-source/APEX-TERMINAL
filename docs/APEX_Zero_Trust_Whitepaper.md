# APEX Zero-Trust Architecture — Bootstrap Lifecycle

> **We don't claim perfection. We claim APEX.**

## Purpose

APEX implements a zero-trust resilience boundary around executable modules. The design has three operational gates:

1. **Sanitization** — inspect source before execution; reject dangerous calls/imports, known credential patterns, syntax errors, and oversized files.
2. **Isolation** — launch each module in a separate process/session and never treat process creation as readiness.
3. **Monitoring** — probe readiness, record durable telemetry, enforce circuit breakers, and perform bounded recovery with quarantine after repeated failure.

## Canonical lifecycle

`BOOTSTRAP → INTEGRITY → SANITIZE → VERIFY → REGISTER → ISOLATE → START → PROBE → AUTHORIZE → ROUTE → MONITOR → BREAK → RECOVER → QUARANTINE → BLACK BOX → VERIFY RECOVERY → PROMOTE / ROLLBACK`

The existing `apex_core.py` remains the control-plane lifecycle authority. The bootstrap/router modules in this addition provide the Gate 1–3 runtime surfaces without replacing the canonical control plane.

## Evidence standard

APEX uses explicit evidence states. A component is not called operational merely because a process exists. A readiness probe must pass before the router marks a sidecar healthy. Runtime requests are measured, breaker decisions are recorded, and recovery is bounded.

**Governing rule:** no fake green, no blind trust, no uncontrolled recovery, no silent failure, no unverified production.

## Security boundary

The sanitization layer uses AST analysis rather than relying only on regular expressions. It rejects dangerous calls such as `eval`, `exec`, dynamic imports, `os.system`, and common subprocess execution calls, plus configured banned imports and credential patterns. The scanner never executes submitted source.

This is a source-policy gate, not a claim that static scanning makes arbitrary code safe. Production execution still requires OS/container isolation, least privilege, dependency scanning, secret management, and runtime observability.

## Failure containment

Each sidecar is launched as an independent process/session. A failed health probe marks the sidecar unhealthy; the router can restart it using exponential backoff. After the configured restart budget is exhausted, the sidecar is quarantined rather than restarted forever.

The circuit breaker independently protects request flow. Repeated request failures open the breaker; after a recovery timeout it permits a half-open test. A verified success closes the breaker.

## Telemetry

Telemetry records events and metrics as JSON Lines under `.apex/telemetry/` by default. This creates durable local evidence for starts, health results, breaker transitions, request outcomes, latency, and recovery events. The telemetry store is intentionally simple and local; production deployments may forward the same event contract to a centralized observability system.

## Local smoke test

```bash
pip install -r requirements-apex-core.txt
pytest -q tests/test_bootstrap_lifecycle.py tests/test_apex_core.py
python apex_bootstrap.py validate examples/sidecar_a.py
python apex_bootstrap.py start --config config/apex-sidecars.json
```

The bootstrap command should only be described as operational when the sidecar readiness probe succeeds. CI evidence is required before the implementation is called verified.

## Business / investor language

APEX should describe these capabilities precisely: **failure containment, bounded recovery, observable state, and evidence-backed readiness**. Avoid absolute claims such as “immune to crashes,” “zero security breaches,” or “no single point of failure” unless those claims are demonstrated by a defined threat model and production evidence.
