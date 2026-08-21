# Google AI Studio — APEX TERMINAL Build Prompt

Build the existing APEX TERMINAL repository as a **local-first unified development workspace**, not as a clone of any provider.

## NON-NEGOTIABLE: THE SUPPLIED APEX TERMINAL IMAGE IS THE VISUAL MASTER

The supplied APEX TERMINAL reference image is the **exact canonical Hub shell**. Do not reinterpret, modernize, simplify, approximate, or redesign it.

The implementation must reproduce the reference information architecture and visual hierarchy as the root `/` workspace:

- APEX TERMINAL header and command/Gabby bar
- left WORKSPACE rail
- CONNECTED APPS provider panel with recognizable provider icons
- central active workspace
- right CONCIERGE: GABBY rail
- project status / engines region
- lower telemetry, command, timeline/audit information surfaces
- bottom BUILD / RUN / TEST / VERIFY / DEPLOY / PUBLISH command bar

**REFERENCE IMAGE = VISUAL SOURCE OF TRUTH.**

Change the **shell**, not the product capabilities.

Existing working modules remain intact and are mounted inside this shell. Do not replace working Character Studio, Terminal, provider adapters, audit, registry, memory, or Vault capabilities with mockups merely to achieve the visual.

If a capability is missing from the shell, add the required button, toggle, route, module launcher, or status surface. Every visible control must have a real action path, route, state transition, adapter call, or truthful unavailable/error state.

### Carbon-copy rule

Do not use language such as “similar”, “inspired by”, “same general layout”, or “APEX-style”. The requested result is the supplied reference composition reproduced as closely as the source permits.

Preserve:

- panel geometry
- region placement
- information density
- spacing hierarchy
- dark surfaces
- cyan/blue system accents
- green evidence/status accents
- typography hierarchy
- icon scale
- navigation placement
- right-side Gabby surface
- bottom command surface
- connected-app presentation

Only make responsive adaptations when required by viewport size; do not change the desktop information architecture.

## PLAN → EXECUTE → VERIFY

Before changing the repository:

1. Inspect the existing repository and identify reusable modules.
2. Write a concise implementation plan.
3. Execute the plan against the existing repository.
4. Preserve working capabilities.
5. Add missing routes/controls/modules.
6. Run TypeScript/build/tests.
7. Compare the rendered result against the supplied visual reference.
8. Correct structural visual deltas.
9. Run the full verification loop again.
10. Do not claim `VERIFIED` unless actual evidence exists.

Do not stop after generating JSX/HTML. Render and inspect the actual application.

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

The Hub is the first screen. Advanced engineering is reachable from the visible rails and modules without leaving the APEX shell.

Primary command surface: `Cmd/Ctrl+K` desktop and a single command affordance on mobile.

Primary actions: `BUILD`, `RUN`, `TEST`, `VERIFY`, `DEPLOY`, `CONNECT`, `OPEN`, `SAVE`, `PUBLISH`.

Errors use: **WHAT HAPPENED → WHY → NEXT → TECHNICAL DETAILS**.

Everything the owner legitimately connects can appear as a workspace tab according to its actual capability: native, remote, web, CLI, API, SDK, webhook, or MCP-backed.

## Connected Apps Hub

The root Hub must represent the connected-app ecosystem visible in the reference, including when available:

Vercel, Figma, Canva, OpenAI, Codex, Replit, Hugging Face, Lovable, Jotform, Linear, Notion, Ramp, PostHog, Supabase, Descript, SharePoint, Outlook Calendar.

Provider icons are visual identifiers only. Provider status must come from the integration registry / real capability probe. Registration never implies connection or verification.

## Local Terminal

The local Terminal remains first-class and must be reachable directly from the Hub. Reuse the existing Terminal component/executor rather than creating a second simulated terminal.

## Omni Vault

The Hub exposes the local Omni Vault boundary. Raw credential values must never be rendered in the Hub, Gabby context, audit feed, prompts, or repository files. Use credential references and Gatekeeper-controlled execution.

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

Do not stop at a mockup. Produce a runnable workspace, exact Hub shell, real command surface, real adapter contract, deterministic comparator, audit layer, project/tab model, credential-reference architecture, and automated tests. Anything not implemented must be labeled clearly. Anything not proven remains `UNVERIFIED`.

Read and follow:

- `docs/GODSPEED_UNIFIED_WORKSTATION_ENGINE_SPEC.md`
- `docs/APEX_TERMINAL_UIUX_SPEC.md`
- `docs/CANONICAL_STATE_SCHEMA.md`
- `docs/APEX_VISUAL_BUILD_PRESERVATION_PROTOCOL.md`
- `core/system_status_contract.json`
- `config/integration-registry.json`
