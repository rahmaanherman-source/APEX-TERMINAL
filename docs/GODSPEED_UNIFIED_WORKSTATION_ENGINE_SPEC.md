# GODSPEED Unified Workstation Engine Specification v1.0

**APEX TERMINAL ENGINE** — local-first orchestration, real-time execution, deterministic verification.

## Status model

`DECLARED → ADAPTER_PRESENT → CONFIGURED → RUNNING → TESTED → VERIFIED`

Failure states are explicit: `FAILED`, `BLOCKED`, `UNVERIFIED`.

**No fake green:** the LLM cannot set `VERIFIED`. Only deterministic verification over observed state can do so.

## Core loop

`REMEMBER → DEFINE → EXECUTE → READ BACK → COMPARE → VERIFY → AUDIT → REMEMBER`

## Architecture

```text
USER / PRINCIPAL
      │ Desired State D
      ▼
GABBY / CHAMELEON CORE
      │ Action A
      ▼
COMMAND ENGINE
      │
      ▼
REAL-TIME BUS
      │
      ▼
ADAPTER REGISTRY
      │
      ├── Local / Terminal
      ├── GitHub
      ├── Vercel / Replit
      ├── Google Cloud / AWS / Azure / DigitalOcean
      ├── Blender / Unreal / Tripo
      ├── Flutter
      └── AI providers
      │ Actual State X + evidence
      ▼
DETERMINISTIC COMPARATOR
      │ Δ = f(X,D)
      ▼
VERIFY GATE
   ┌──┴────────────┐
   │               │
 Δ ≤ ε           Δ > ε
   │               │
VERIFIED        FAILED
   │               │
   └──────┬────────┘
          ▼
IMMUTABLE AUDIT LEDGER
```

## Verification contract

For critical deterministic checks:

```text
ε = 0

VERIFIED  iff Δ ≤ ε and all critical checks pass
FAILED    iff Δ > ε or a critical check fails
BLOCKED   iff authorization or required adapter access is unavailable
UNVERIFIED iff reality cannot be observed sufficiently to decide
```

Prediction is advisory. A predictive observer, including a Kalman-style state estimator, may forecast `P`, but **prediction is never truth**. Truth is observed state `X` compared with desired state `D`.

## Artifact integrity

Artifacts may be hashed with SHA-256 and recorded in the audit ledger. Hashing is mandatory for evidence-bearing artifacts and stored outputs, but must not be placed synchronously in the 60-FPS render path unless explicitly selected as an integrity/debug mode.

## UX principle

The engine may be deeply technical internally while the default UI remains simple. Errors use:

1. What happened
2. Why
3. What to do next
4. Technical details on demand

## Integration principle

APEX does not clone or replace connected products. It provides adapters and a common workspace. A connected service may appear as a native, remote, web, CLI, API, SDK, webhook, or MCP-backed tab depending on its actual capabilities.

## Acceptance criteria

The first verified chain is:

`SYSTEM STATUS → real readback → comparator → audit record → UI result`

No feature is marked verified without observable evidence.
