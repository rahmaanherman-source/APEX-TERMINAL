# GODSPEED UNIFIED WORKSTATION — FULL PRODUCT SPECIFICATION

**Product:** APEX TERMINAL / GODSPEED OS UNIVERSE  
**Status:** DESIGN BASELINE — IMPLEMENTATION UNVERIFIED  
**Governing loop:** REMEMBER → REBUILD → REBOOT → VERIFY  
**Core rule:** ADD → CONNECT → UPGRADE → VERIFY. Never replace working capability merely to create a cleaner demo.

## 1. Product thesis

APEX TERMINAL is a single operator workstation that exposes the user's existing development, creative, AI, game, automation, repository, cloud, and verification capabilities through one coherent interface.

The workstation is not intended to reimplement every specialist tool. It is an orchestration shell and real-time execution plane that routes work to the correct engine and brings results, telemetry, artifacts, logs, and verification back into one place.

The user's mental model is **tabs/layers, not separate applications**: select the capability needed, operate it through its appropriate adapter, and return to the same command plane without losing project context.

## 2. Specialist capability tabs

The UI must provide first-class capability areas for:

- **APEX HUB** — ecosystem, projects, operator/business services.
- **APEX HERITAGE** — heritage archive, provenance, Truth Gate, marketplace.
- **APEX TERMINAL** — command, execution, orchestration, audit.
- **GODSPEED / GOLDENWORLD** — game/world creation and runtime workflows.
- **VISUAL CODE / CODE** — repository editing, generation, review, test, terminal workflows through a controlled development adapter.
- **BLENDER** — 3D modeling/content workflows through Blender integration, never a fake Blender clone.
- **TRIPO / 3D PROVIDERS** — optional external 3D generation providers through provider adapters.
- **UNREAL** — game/world/editor/build workflows through Unreal adapters.
- **FLUTTER** — application generation/build/test workflows through Flutter project adapters.
- **AI STUDIO / AI PROVIDERS** — prompt, generation, analysis, code assistance and model routing through secure provider boundaries.
- **GITHUB** — repositories, branches, commits, issues, PRs, CI and source evidence.
- **CLOUD** — Google Cloud, Cloudflare, DigitalOcean, AWS and other configured infrastructure targets.
- **AUTOMATION** — task, workflow and external automation integrations.
- **TRUTH GATE** — evidence-backed verification authority.

Names may be changed for branding, but capability boundaries must remain explicit.

## 3. Global shell

### Desktop

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ GODSPEED / APEX TERMINAL   PROJECT   ENVIRONMENT   SEARCH   EXECUTION STATUS │
├──────────────┬───────────────────────────────────────────────┬───────────────┤
│ CAPABILITY   │                                               │ INSPECTOR     │
│ RAIL         │              ACTIVE WORKSPACE                 │               │
│              │                                               │ Execution     │
│ Hub          │  project header                               │ Engine        │
│ Heritage     │  command / prompt                             │ State         │
│ Terminal     │  current artifact / editor / viewport        │ Evidence      │
│ Games        │                                               │ Truth Gate    │
│ Code         │                                               │ Artifacts     │
│ Blender      │                                               │               │
│ Unreal       │                                               │               │
│ Flutter      │                                               │               │
│ AI           │                                               │               │
│ Cloud        │                                               │               │
│ GitHub       │                                               │               │
│ Truth Gate   │                                               │               │
├──────────────┴───────────────────────────────────────────────┴───────────────┤
│ REAL-TIME EXECUTION / AUDIT FEED                                             │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Mobile

Use a top command/status bar, capability drawer, single active workspace, bottom inspector sheet, and persistent execution feed. Never cram the desktop layout onto a phone.

## 4. Persistent global state

Every active session maintains a project context containing:

```text
project_id
workspace_id
selected_capability
selected_engine
repository
branch
commit
environment
execution_id
correlation_id
active_artifact
truth_gate_status
operator_identity
permissions
unsaved_changes
connection_states
```

Switching tabs must preserve this context unless the user explicitly changes it.

## 5. Command plane

Primary commands:

- BUILD
- RUN
- TEST
- VERIFY
- DEPLOY
- GENERATE
- IMPORT
- EXPORT
- ARCHIVE
- AUDIT
- REPAIR
- OPEN
- STOP / CANCEL

Every command produces an `execution_id` and `correlation_id` before execution begins.

Command lifecycle:

```text
USER COMMAND
  ↓
AUTHORIZATION
  ↓
PLAN / ROUTE
  ↓
ADAPTER
  ↓
SPECIALIST ENGINE
  ↓
ARTIFACT / RESULT
  ↓
VALIDATION
  ↓
TRUTH GATE WHEN REQUIRED
  ↓
PERSIST EVENT + EVIDENCE
  ↓
REAL-TIME UI UPDATE
  ↓
READ-BACK
```

## 6. Real-time engine

The real-time engine is an event-driven orchestration layer, not an animation system.

Minimum event envelope:

```json
{
  "event_id": "evt_*",
  "execution_id": "exec_*",
  "correlation_id": "corr_*",
  "timestamp": "ISO-8601",
  "source": "terminal|hub|heritage|blender|unreal|flutter|github|cloud|truth_gate",
  "operation": "BUILD",
  "phase": "validation",
  "state": "RUNNING",
  "truth_state": "UNVERIFIED",
  "message": "Human-readable event",
  "artifact_ids": [],
  "evidence_ids": [],
  "error": null
}
```

Supported operational states:

`QUEUED`, `RUNNING`, `SUCCEEDED`, `FAILED`, `CANCELLED`, `BLOCKED`.

Supported truth states:

`VERIFIED`, `UNVERIFIED`, `BLOCKED`, `FAILED`.

These two state systems must never be conflated.

## 7. Audit feed

The feed is the primary proof surface.

Each row must be expandable and show:

- time
- execution ID
- source engine
- command
- phase
- operational state
- truth state
- duration
- artifact
- evidence
- error/recovery information

Filters:

- project
- engine
- state
- truth state
- date/time
- execution ID

Search must query actual persisted events where a backend is connected. Local mock data must be explicitly marked as demo/test data and never presented as production telemetry.

## 8. Code / Visual Code capability

The Code tab provides a controlled development workspace around the existing repository.

Required functions:

- repository selection
- branch selection
- file tree
- editor surface
- search
- terminal command surface
- diff viewer
- test runner
- build runner
- commit preparation
- PR preparation
- execution logs

The UI may resemble an integrated development environment, but it must not claim that a command ran unless an actual execution result exists.

All privileged Git operations occur through an authenticated backend/connector boundary, not arbitrary browser-side credentials.

## 9. Blender adapter

APEX TERMINAL controls Blender; it does not pretend to be Blender.

Required adapter contract:

```text
open_project
run_script
import_asset
export_asset
render
validate_scene
collect_artifacts
collect_logs
```

Example:

```text
TERMINAL: BUILD CHARACTER
→ Blender Adapter
→ Blender execution
→ .blend/.fbx/.glb
→ hash
→ validation
→ artifact registry
→ audit event
```

## 10. Unreal adapter

Required contract:

```text
open_project
generate_content
import_asset
run_editor_task
package_build
run_tests
collect_logs
collect_artifacts
```

The Terminal controls Unreal project operations; it does not replace the Unreal editor/runtime.

## 11. Tripo / external 3D provider adapter

Tripo must be treated as an optional provider, not hardcoded into the core engine.

Provider interface:

```text
generate_3d
get_job
get_result
cancel_job
validate_result
import_to_project
```

Provider credentials remain server-side.

If a provider is not connected, the UI must show `UNVERIFIED` or `BLOCKED`, never `CONNECTED`.

## 12. Flutter adapter

Flutter capability provides project-level workflows:

```text
inspect_project
run_analyze
run_test
run_build
run_device
collect_logs
collect_artifacts
```

The Terminal can orchestrate Flutter, but Flutter remains the application framework.

## 13. AI provider layer

AI is a capability provider, not the authority for runtime truth.

The AI layer can:

- generate code
- explain code
- propose architecture
- create assets/prompts
- classify and summarize
- plan execution
- diagnose failures
- propose repairs

It cannot silently mark a build, deployment, provenance record, payment, or Truth Gate decision as verified.

Provider routing should be abstracted so models can be added/replaced without rewriting the workstation.

## 14. GitHub integration

GitHub is canonical source control.

The Terminal should surface:

- repository
- branch
- commit
- status
- diff
- issues
- PRs
- CI status
- release/deployment evidence

Source-control actions must produce auditable events.

## 15. Cloud integration

Cloud adapters must expose capability, not raw credentials.

Targets may include:

- Google Cloud
- Cloudflare
- DigitalOcean
- AWS
- Vercel
- other configured providers

Required common operations:

```text
status
logs
deploy
rollback
health
artifacts
configuration_reference
```

Credentials belong in the secure backend/vault boundary. Never embed secrets in client bundles, localStorage, logs, HTML, screenshots or AI prompts.

## 16. APEX Heritage integration

Heritage remains its own application and data domain.

Terminal provides orchestration and visibility:

```text
Object
→ Acquisition
→ Record
→ Provenance
→ AI Interpretation
→ Truth Gate
→ Marketplace
```

Every visible Heritage verification state must be backed by actual evidence.

## 17. Truth Gate integration

Truth Gate is authoritative for verification decisions.

Required display separation:

```text
OBSERVATION
INFERENCE
EVIDENCE
VALIDATION CHECKS
DECISION
```

Decision values:

- OBSERVED
- FAILED
- BLOCKED

Insufficient evidence must result in BLOCKED, not a best-effort green state.

## 18. GoldenWorld integration

GoldenWorld is the game/world capability layer.

Terminal should orchestrate:

- project inspection
- asset generation/import
- Blender workflows
- Unreal workflows
- builds
- tests
- world/content jobs
- artifact registration

Existing GoldenWorld code remains authoritative for its implemented capabilities.

## 19. Artifact registry

Every meaningful generated output receives:

```text
artifact_id
execution_id
project_id
engine
provider
path/reference
content_type
hash
created_at
validation_state
truth_state
parent_artifacts
```

Artifacts must be traceable backward to the execution that created them.

## 20. Capability registry

The Terminal needs a machine-readable registry describing what is actually available.

Example:

```json
{
  "capability": "blender",
  "declared": true,
  "adapter_present": true,
  "configured": false,
  "runtime_verified": false,
  "status": "UNVERIFIED",
  "last_verified_at": null
}
```

This prevents declarations such as `enabled: true` from being mistaken for proven runtime capability.

## 21. Universal interaction contract

Every interactive element follows:

```text
CLICK / INPUT
↓
HANDLER
↓
STATE UPDATE
↓
API / ENGINE / STORE
↓
VALIDATION
↓
RESPONSE
↓
UI UPDATE
↓
PERSISTENCE
↓
READ-BACK
```

Buttons that cannot complete this path must be disabled, hidden, or marked `UNVERIFIED/BLOCKED`.

## 22. Persistence

The workstation should persist:

- projects
- workspace layout
- recent executions
- events
- artifact references
- user preferences
- connection metadata
- audit records

Use the existing repository persistence architecture after audit. Do not add a second database merely because a new framework makes it convenient.

## 23. Security

- Zero-trust authorization.
- Least privilege per adapter.
- Server-side secrets only.
- TLS.
- Audit every privileged operation.
- Correlate external jobs with execution IDs.
- Never expose provider keys to the browser.
- Never allow AI-generated commands to bypass authorization.
- Require explicit approval for destructive operations.

## 24. UI design language

The workstation should feel like a serious professional command system: museum/institutional restraint combined with modern engineering tooling.

Use:

- near-black surfaces
- antique-gold accents
- stone/ivory text
- restrained bronze-green success
- muted crimson failure
- clear typography hierarchy
- dense but readable information
- subtle motion tied to real state changes

Avoid:

- childish cards
- rainbow gradients
- fake glowing AI gimmicks
- oversized bubbly buttons
- generic SaaS templates
- decorative controls with no function

## 25. Tab behavior

Tabs are capability contexts, not separate applications.

Switching tabs:

- preserves project context
- preserves execution context
- preserves unsaved state where supported
- updates the active adapter
- updates inspector content
- records navigation events where appropriate

A user should be able to move:

`Code → Blender → Unreal → Flutter → Heritage → Truth Gate → GitHub`

without leaving the operator shell.

## 26. Failure and recovery

Every integration needs explicit:

- loading
- empty
- unavailable
- unauthorized
- timeout
- failed
- retrying
- cancelled
- blocked

No spinner may represent an unknown state forever.

Failures must preserve execution IDs and error evidence.

## 27. Testing requirements

Minimum test classes:

- unit
- integration
- adapter contract
- end-to-end
- persistence/read-back
- authorization
- failure/recovery
- responsive UI
- accessibility
- regression

Critical acceptance test:

```text
Select capability
→ execute real action
→ receive real event
→ observe actual state
→ inspect artifact/log
→ read back persisted result
→ verify evidence
```

## 28. Implementation order

### Phase 0 — Audit
Inventory existing Terminal source and preserve working systems.

### Phase 1 — Shell
Build global navigation, project context, inspector and feed.

### Phase 2 — Execution bus
Introduce execution IDs, event envelopes, real-time telemetry and persistence.

### Phase 3 — Adapters
Connect GitHub, Code, Blender, Unreal, Flutter, AI and cloud boundaries.

### Phase 4 — Ecosystem
Connect Hub, Heritage, GoldenWorld and Truth Gate.

### Phase 5 — Artifact/evidence
Implement artifact registry, hashes, evidence references and audit read-back.

### Phase 6 — Verification
Run interaction and integration tests. Anything not proven remains UNVERIFIED/BLOCKED.

### Phase 7 — Production hardening
Performance, accessibility, security, recovery, deployment and regression verification.

## 29. Definition of done

A feature is COMPLETE only when:

1. It has a real handler.
2. It reaches the intended service/engine/store.
3. Validation runs.
4. Success and failure states are real.
5. UI reflects the returned state.
6. Persistence survives reload where required.
7. Read-back confirms the expected result.
8. Evidence exists.
9. Tests pass.
10. No fake-green state remains.

## 30. Final architecture

```text
                         GODSPEED OS UNIVERSE
                                  │
                         ┌────────▼────────┐
                         │  APEX TERMINAL  │
                         │ UNIFIED WORKSTATION│
                         └────────┬────────┘
                                  │
                         REAL-TIME EXECUTION BUS
                                  │
       ┌──────────┬──────────┬────┼────┬──────────┬──────────┐
       ▼          ▼          ▼    ▼    ▼          ▼          ▼
     CODE      BLENDER    UNREAL FLUTTER  AI     CLOUD     GITHUB
       │          │          │    │    │          │          │
       └──────────┴──────────┴────┼────┴──────────┴──────────┘
                                  ▼
                         ┌────────────────┐
                         │  APEX ECOSYSTEM│
                         ├────────────────┤
                         │ HUB            │
                         │ HERITAGE       │
                         │ GOLDENWORLD    │
                         │ TRUTH GATE     │
                         └───────┬────────┘
                                 ▼
                         ARTIFACT + EVIDENCE
                                 │
                                 ▼
                         AUDIT / VERIFICATION
                                 │
                                 ▼
                  REMEMBER → REBUILD → REBOOT → VERIFY
```

**This specification is additive. It does not authorize deletion or replacement of existing working code.**
