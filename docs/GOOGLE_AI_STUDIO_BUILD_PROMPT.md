# Google AI Studio — APEX TERMINAL Build Prompt

Build the existing APEX TERMINAL repository as a **local-first unified development workspace**, not as a clone of any provider.

## Non-negotiable architecture

- Preserve existing working frontend/backend and extend additively.
- GABBY / Chameleon Core translates intent and routes work; it cannot self-verify.
- Every external capability is an adapter.
- Every adapter returns a Canonical State Object.
- The Comparator is deterministic and owns `VERIFIED`.
- Missing observability is `UNVERIFIED`; missing authorization is `BLOCKED`; actual failure is `FAILED`.
- No fake green, fake deployments, fake tests, or simulated success presented as real.
- Predictions may assist planning/rendering but cannot produce verification.

## Product UX

Make the surface luxurious through restraint: simple first screen, excellent typography, spacing, hierarchy, subtle motion, restrained gold accent, minimal controls. Hide advanced engineering until requested.

Primary command surface: `Cmd/Ctrl+K` desktop and a single command affordance on mobile.

Primary actions: `BUILD`, `RUN`, `TEST`, `VERIFY`, `DEPLOY`, `CONNECT`, `OPEN`, `SAVE`, `PUBLISH`.

Errors use: **WHAT HAPPENED → WHY → NEXT → TECHNICAL DETAILS**.

Everything the owner legitimately connects can appear as a workspace tab according to its actual capability: native, remote, web, CLI, API, SDK, webhook, or MCP-backed.

## Integration targets

Prepare provider-neutral adapters for GitHub, Vercel, Replit, Google Cloud, AWS, Azure, DigitalOcean, OpenAI, Google AI Studio, Blender, Unreal Engine, Tripo, Flutter, Lovable, Base44, Bolt, Lark, Meta, Shopify, Stripe, Supabase, Firebase, Cloudflare, and other authorized services through generic REST, GraphQL, OAuth, CLI, SDK, webhook, and MCP interfaces where supported.

Do not claim an integration exists until it has actually been connected and tested.

## Verification loop

`REMEMBER → DEFINE → EXECUTE → READ BACK → COMPARE → VERIFY → AUDIT → REMEMBER`

For critical deterministic checks:

`Δ = f(X,D)`

`ε = 0`

`VERIFIED iff Δ ≤ ε and all critical checks pass.`

Hash evidence-bearing artifacts with SHA-256 and record the chain event using:

`H_n = SHA256(H_(n-1) || canonical(Event_n))`

Do not hash every real-time frame synchronously unless explicitly enabled as an integrity/debug mode.

## First proof

Implement and test:

`SYSTEM_STATUS → real local observation → comparator → audit event → UI result`

Then expand adapters one by one.

## Definition of done

Do not stop at a mockup. Produce a runnable workspace, real command surface, real adapter contract, deterministic comparator, audit layer, project/tab model, credential-reference architecture, and automated tests. Anything not implemented must be labeled clearly. Anything not proven remains `UNVERIFIED`.

Read and follow:

- `docs/GODSPEED_UNIFIED_WORKSTATION_ENGINE_SPEC.md`
- `docs/APEX_TERMINAL_UIUX_SPEC.md`
- `docs/CANONICAL_STATE_SCHEMA.md`
- `core/system_status_contract.json`
- `config/integration-registry.json`
