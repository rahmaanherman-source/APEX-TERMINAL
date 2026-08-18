# Google AI Studio — APEX TERMINAL Build Prompt v1.1

Build the existing APEX TERMINAL repository into the owner's **local-first unified command workspace**. Do not create a disposable demo and do not replace working systems merely to simplify the implementation.

## Mission

APEX TERMINAL is the connector/orchestration layer between the owner's legitimate tools, accounts, repositories, local engines, cloud services, and AI models. External products remain external products. They become **tabs/modules inside one workspace** through real adapters.

The system must let the owner work locally whenever the underlying capability supports local execution, while also opening or controlling remote/web/cloud capabilities when that is the provider's actual interface.

## Non-negotiable architecture

- Preserve existing working frontend/backend/AI/payment/database capabilities and extend additively.
- GABBY / Chameleon Core translates intent, plans, routes, executes, and explains; it cannot self-verify.
- Every external capability is an adapter.
- Every adapter returns a Canonical State Object containing execution identity and evidence.
- The Comparator is deterministic and owns `VERIFIED`.
- Missing observability is `UNVERIFIED`; missing authorization/access is `BLOCKED`; observed failure is `FAILED`.
- No fake green, fake deployments, fake tests, fake data, or simulated success presented as real.
- If an integration is unavailable, build the real adapter contract and report the actual missing dependency/state. Never invent a connection.
- Predictions may assist planning/rendering but cannot produce verification.
- Credentials must be handled through secure references/environment/platform auth; never place raw secrets in source, frontend bundles, prompts, logs, or Memory Slabs.

## Core loop

`REMEMBER → DEFINE → EXECUTE → READ BACK → COMPARE → VERIFY → AUDIT → REMEMBER`

For critical deterministic checks:

`Δ = f(X,D)`

`ε = 0`

`VERIFIED iff Δ ≤ ε and all critical checks pass.`

Hash evidence-bearing artifacts with SHA-256 and record audit events with:

`H_n = SHA256(H_(n-1) || canonical(Event_n))`

Do not hash every real-time frame synchronously unless explicitly enabled as an integrity/debug mode.

## Product UX — luxury through simplicity

The UI should feel **quiet, elegant, fast, and obvious** rather than crowded or technical.

First launch:

```text
APEX TERMINAL

What are we building?
[ Ask GABBY anything… ]

[ New Project ] [ Open Project ]

Recent Projects

● SYSTEM READY
```

Workspace:

- Left: projects, workspaces, connected tools/tabs.
- Center: active project, document, code, viewport, page, or app.
- Right: inspector, evidence, artifacts, status.
- Bottom: quiet real-time execution feed.

Do not expose every capability at once. Contextually reveal advanced controls.

## Universal tab principle

Anything the owner legitimately owns, uses, publishes, or connects can appear as a workspace tab **according to its real interface**:

`NATIVE | LOCAL | REMOTE | WEB | CLI | API | SDK | WEBHOOK | MCP`

A tab is not permission to control a service. The adapter must observe authorization and capability before enabling actions.

Examples include GitHub, Vercel, Replit, Google Cloud, AWS, Azure, DigitalOcean, OpenAI, Google AI Studio, Hugging Face, Blender, Unreal Engine, Tripo, Flutter, Lovable, Base44, Bolt, Lark, Meta, Shopify, Stripe, PayPal, Supabase, Firebase, Cloudflare, Google Analytics, Figma, Canva, Notion, Linear, ClickUp, Todoist, Zapier, Workona, Clockify, Descript, Jotform, PostHog, Ramp, Outlook, SharePoint, Teams, and additional authorized providers through the generic adapter registry.

## Local AI model strategy

Discover local runtimes rather than assuming them:

- Ollama
- LM Studio
- vLLM
- other compatible local runtimes added through the registry

For each discovered model, record only observed facts:

`runtime → model → availability → capability test → latency test → task suitability`

GABBY may select the best **verified available** model for a task. If no model is verified for the requested capability, return `UNVERIFIED` or `BLOCKED` rather than guessing.

Remote AI providers remain available through adapters when the owner is authorized to use them.

## 3D / creation workspace

Provide one simple creative command surface that can route to:

`PHOTO/UPLOAD → IMAGE UNDERSTANDING → CHARACTER/OBJECT SEED → 3D ADAPTER → BLENDER/UNREAL/OTHER ENGINE → ARTIFACT → VERIFY`

Support sketch/reference upload, project assets, character metadata, scene/world placement, and artifact inspection without pretending an external 3D provider is local when it is not.

## Command surface

Desktop: `Cmd/Ctrl + K`.

Mobile/APEX Breeze: one persistent command affordance.

Primary actions:

`BUILD | RUN | TEST | VERIFY | DEPLOY | CONNECT | OPEN | SAVE | PUBLISH`

Commands must generate an execution ID and emit real telemetry.

## Error UX

Make every failure understandable in one glance:

```text
BUG
Blender did not start.

Why:
The Blender executable was not found.

Next:
Choose the Blender location.

[ Locate Blender ] [ Technical Details ]
```

Machine state remains one of:

`VERIFIED | FAILED | BLOCKED | UNVERIFIED`

Never replace those with optimistic language.

## Verification boundary

Required chain:

```text
GABBY
  ↓
COMMAND ENGINE
  ↓
ADAPTER
  ↓
CANONICAL OBSERVATION X
  ↓
COMPARATOR: Δ = f(X,D)
  ↓
VERIFY GATE
  ↓
AUDIT LEDGER
  ↓
MEMORY SLAB
  ↓
UI RESULT
```

The LLM cannot mark anything verified. The adapter cannot mark anything verified. The UI cannot mark anything verified. Only deterministic comparison over observed evidence can do it.

## Memory Slab rule

Each project has a hard verified Memory Slab. Only evidence-backed facts may enter it. Each memory record carries:

`memory_id, project_id, claim, source, source_ref, verified_at, verification_method, status, content_sha256`

Unverified conversation, generated claims, and planned capabilities do not enter the hard slab.

## First proof

Before expanding the provider surface, prove:

`SYSTEM_STATUS → real local observation → canonical state → comparator → audit record → UI result`

Then prove local model discovery. Then prove GitHub read-back. Then add other adapters one at a time.

## Definition of done

Do not stop at a mockup or architecture diagram. Produce a runnable workspace and real command surface while preserving the existing repository. Every implemented capability gets tests. Every tested capability gets evidence. Anything not proven remains clearly marked `UNVERIFIED` or `BLOCKED`.

Read and follow:

- `docs/GODSPEED_UNIFIED_WORKSTATION_ENGINE_SPEC.md`
- `docs/APEX_TERMINAL_UIUX_SPEC.md`
- `docs/CANONICAL_STATE_SCHEMA.md`
- `core/system_status_contract.json`
- `config/integration-registry.json`
- `docs/superpowers/plans/2026-08-18-apex-terminal-engine-hardening.md`
