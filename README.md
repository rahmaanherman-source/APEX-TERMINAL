# APEX TERMINAL ENGINE

**GODSPEED / APEX — Unified local-first command and verification workspace.**

APEX TERMINAL is the orchestration layer for the tools and services its owner legitimately connects. It does not clone or replace Blender, Unreal, Flutter, GitHub, cloud platforms, AI providers, or other external products. It provides one workspace, one command surface, adapter contracts, project context, artifact tracking, and deterministic verification.

## Core loop

**REMEMBER → DEFINE → EXECUTE → READ BACK → COMPARE → VERIFY → AUDIT → REMEMBER**

GABBY / Chameleon Core translates intent and operates tools. The deterministic Comparator decides verification. The audit ledger records evidence. **No fake green.**

## Current foundation

- Unified workstation engine specification
- Luxury/simple UI/UX specification
- Canonical adapter state contract
- Deterministic SYSTEM_STATUS comparator
- First local system-status adapter
- SHA-256 tamper-evident audit-chain primitive
- Provider-neutral integration registry
- Deterministic Slab lifecycle: `INIT → PROBING → COMPARING → COMMITTED | HALTED`
- High-resolution `performance.now()` latency measurement
- `crypto.subtle` SHA-256 readback integrity evidence
- Rolling latency comparator with ratio and 3-sigma guards
- Explicit Node process halt boundary for failed bootstrap verification
- Honest UI state mapping with no green state before commit
- Automated TypeScript typecheck and Slab lifecycle tests

## Slab lifecycle

The Slab is the execution context for a single bootstrap observation. It does not infer truth from an LLM. A real adapter produces evidence, the Comparator evaluates it, and only a successful deterministic comparison permits `COMMITTED`.

```text
INIT
  ↓
PROBING  ← real adapter I/O + performance.now()
  ↓
COMPARING ← epsilon + rolling statistical guard
  ├── pass → COMMITTED → UI: System Online
  └── fail → HALTED → process exit(1) at the Node boundary
```

`HALTED` is terminal for that bootstrap attempt. The process-level halt is injected behind a `HaltController` so tests can verify failure behavior without terminating the test runner.

## Integration philosophy

Connected services become workspace tabs according to their actual capabilities: native, remote, web, CLI, API, SDK, webhook, or MCP-backed. A service is not reported as connected or verified until the connection is actually observed and tested.

## Key documents

- `docs/GODSPEED_UNIFIED_WORKSTATION_ENGINE_SPEC.md`
- `docs/APEX_TERMINAL_UIUX_SPEC.md`
- `docs/CANONICAL_STATE_SCHEMA.md`
- `core/system_status_contract.json`
- `config/integration-registry.json`

## Truth states

`VERIFIED` · `FAILED` · `BLOCKED` · `UNVERIFIED`

If the system cannot observe reality sufficiently to decide, it does not guess.

## Development

Install dependencies, then run:

```bash
npm run typecheck
npm run test:slab
```

The existing application and repository structure are preserved. New capability is additive and must be tested before being called verified.
