# GODSPEED REPOSITORY CONNECTION MAP

Status: DESIGN BASELINE / RUNTIME UNVERIFIED

## Purpose

This document tells a UI builder or integration agent how the APEX repositories fit together without merging repositories or duplicating their responsibilities.

## Core repositories

| Repository | Role | Connection to Terminal |
|---|---|---|
| `APEX-TERMINAL` | Command/control plane | Canonical operator UI and orchestration boundary |
| `Apex-Hub` | Hub / ecosystem services | API/service adapter |
| `Apex-Heritage-` | Heritage archive + marketplace | Product module adapter |
| `Truth-Gate-` | Verification authority | Verification adapter |
| `Apex-Forensic-Vision` | Forensic imaging / analysis | Analysis adapter |
| `Apex-Bridge` | Integration/bridge capability | Routing/integration adapter where source audit supports it |
| `Apex-Omni-Vaulta` | Storage/vault candidate | Storage adapter where source audit supports it |
| `Apex-Gabby-` | AI/operator capability | AI/agent adapter where source audit supports it |
| `Apex-Studio-OS-` | Studio/product tooling | Build/content adapter where source audit supports it |
| `Apex-Sentinel` | Security/monitoring candidate | Health/security adapter where source audit supports it |
| `Apex-Steward-` | Governance/stewardship candidate | Governance adapter where source audit supports it |

## Required integration behavior

The terminal should discover repository capabilities rather than assume them.

For each repository:
1. identify current branch and commit
2. identify declared runtime/build system
3. identify exposed APIs/services
4. identify tests/health checks
5. identify artifacts/output contracts
6. record capability status
7. expose actions only when an actual adapter exists

## Status model

`DISCOVERED` -> repository/source found
`IMPLEMENTED` -> capability exists in source
`CONNECTED` -> adapter is wired
`RUNNING` -> runtime execution observed
`TESTED` -> test evidence exists
`VERIFIED` -> test/runtime evidence proves the claim
`UNVERIFIED` -> insufficient evidence
`BLOCKED` -> dependency unavailable
`FAILED` -> attempted and failed
`NOT COMPLETE` -> required capability absent

## GoldenWorld boundary

The supplied GoldenWorld tree and runtime are treated as an external execution system until a GitHub repository/runtime connection is independently established. Do not create a duplicate GoldenWorld implementation inside APEX-TERMINAL.

## Specialist engine boundary

Blender and Unreal are execution engines. The Terminal should call them through adapters and consume their status, logs, artifacts, and verification evidence. The Terminal does not impersonate the engine.

Tripo is an optional provider and remains UNVERIFIED until a real provider adapter and runtime credential/configuration boundary are established.

## UI builder connection

A UI builder such as Google AI Studio should receive:
- this map
- `GODSPEED_REALTIME_ENGINE_UI_SPEC.md`
- `GODSPEED_REALTIME_ENGINE_INTEGRATION.md`

The UI builder should work against a GitHub feature branch, never directly rewrite the canonical main branch.

## Data flow

UI -> Terminal API -> adapter -> target repository/service -> real result -> event -> audit feed -> verifier -> UI

Do not make the browser directly call privileged GitHub, database, Stripe, cloud, Blender, Unreal, or storage credentials.

## Merge rule

No repository-to-repository source merge is required merely to integrate systems. Prefer API/adapter/event boundaries. Merge source only when an audited, tested capability requires a shared library and the change is explicitly reviewed.
