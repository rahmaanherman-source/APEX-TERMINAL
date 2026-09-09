# APEX CORE ARCHITECTURE

**Status:** CANONICAL IMPLEMENTATION ARCHITECTURE

## Purpose

This document turns the APEX Resilience Statute into an implementable lifecycle architecture. The design treats the APEX Core as a control plane for trusted execution, isolated modules, health, recovery, and evidence.

## Core Components

- Bootstrap Orchestrator
- Sanitization & Verification Engine
- Black Box Logger
- Breaker Box
- Sidecar Isolation Boundary
- Health/Telemetry Monitor
- Authorization/Policy Gate
- External Watchdog
- Promotion/Rollback Controller

## Control Loop

```text
BOOTSTRAP
  ↓
INTEGRITY
  ↓
SANITIZE
  ↓
VERIFY
  ↓
REGISTER
  ↓
ISOLATE
  ↓
START
  ↓
PROBE
  ↓
AUTHORIZE
  ↓
ROUTE
  ↓
MONITOR
  ↓
BREAK
  ↓
RECOVER
  ↓
QUARANTINE
  ↓
BLACK BOX
  ↓
VERIFY RECOVERY
  ↓
PROMOTE / ROLLBACK
```

## Trust Contract

A component is eligible for execution only when the applicable policy gates are satisfied. Trust is continuously conditioned on:

`IDENTITY + POLICY + INTEGRITY + ISOLATION + HEALTH + AUTHORIZATION + OBSERVABILITY`

## Bootstrap Contract

The orchestrator must not transition directly from BOOTING to OPERATIONAL. Startup establishes a process; readiness probes establish health; policy establishes authorization.

Required startup sequence:

1. Establish runtime directories and configuration.
2. Validate configuration and environment assumptions.
3. Initialize Black Box and audit chain.
4. Initialize security policy.
5. Validate registered components.
6. Prepare isolation boundaries.
7. Start eligible components.
8. Run liveness/readiness probes.
9. Register verified health state.
10. Start continuous monitoring.
11. Enter OPERATIONAL only when required capabilities are verified.

## Fault Contract

A fault must produce an observable state transition. The system should:

1. record the fault;
2. stop routing unsafe traffic;
3. trip the applicable breaker;
4. isolate the affected component;
5. attempt bounded recovery when policy permits;
6. re-probe the component;
7. restore traffic only after verification;
8. quarantine after retry exhaustion or security violation;
9. preserve evidence for post-incident analysis.

## Security Contract

Regex checks are a supplementary detection layer, not the complete security boundary. The Sanitization Engine should combine source parsing/AST analysis, dangerous-call detection, secret detection, dependency policy, artifact integrity, and explicit execution policy.

The system must never claim that a sanitizer guarantees immunity from all malicious code.

## Isolation Contract

The core must not depend on directory naming alone for isolation. Production isolation should use operating-system process boundaries and, where appropriate, containers/sandboxing with least-privilege filesystem, network and process permissions.

## Black Box Contract

Black Box events must be structured, durable, timestamped, correlated, and protected from accidental secret leakage. Where tamper evidence is required, events should be hash chained and periodically anchored to an independent durable store.

## Watchdog Contract

The external watchdog is intentionally independent of the process it observes. It monitors core heartbeat, process existence, critical events, missing telemetry, and restart storms. A failed core must not be the sole witness of its own failure.

## Production Truth

This architecture is production-oriented. Production readiness is a verification result, not a slogan. Deployment promotion requires passing the repository's applicable tests, security checks, operational checks, configuration checks, and environment-specific acceptance criteria.
