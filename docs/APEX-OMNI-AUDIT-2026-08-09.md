# APEX OMNI ARCHITECTURE AUDIT — 2026-08-09

## Scope audited

This audit is based on the connected GitHub workspace and the architecture supplied by the owner in this session.

Audited repositories:
- `rahmaanherman-source/APEX-TERMINAL`
- `rahmaanherman-source/Apex-Omni-Vaulta`

The audit does not claim that external provider accounts, private deployments, Shopify stores, Google accounts, Stripe accounts, or local phone models are already connected unless live evidence exists.

## Executive finding

APEX has moved from a collection of projects toward a unified operating-platform architecture. The strongest canonical foundation is the APEX-TERMINAL repository: its documented structure already includes terminal, AI, agents, memory, prompts, plugins, extensions, GitHub, cloud, Stripe, databases, vault, logs, workspace, projects, templates, settings, and assets. Its latest documented upgrade establishes a unified execution lifecycle, engine contract, event-driven direction, shared services, AI orchestration, developer workspace, observability, security, workflow, plugin, canonical-model, and governance requirements.

Apex-Omni-Vaulta is a complementary workspace/link-vault surface. Its README currently contains a large collection of ecosystem links and a static Omni Vault implementation. It should remain a presentation/navigation layer rather than become a second canonical control plane.

## Architecture decision

Canonical control plane: APEX-TERMINAL.

Presentation/navigation layer: APEX Omni Vault.

Canonical product data: Universal APEX Catalog.

Canonical secrets: Vault/Gatekeeper.

Canonical asynchronous execution: Queue/Workflow Engine.

Canonical AI routing: Provider/Model Router.

Canonical operational truth: Truth + Telemetry + Audit.

Canonical owner authority: Owner Gate.

## What was upgraded in this session

1. Universal Catalog rules: no artificial ceiling, dynamic processability calculation, explicit requested/processable/limiting-factor evidence, and source/channel independence.
2. Durable queue architecture: chunking, idempotency, retries, backoff, dead-letter, checkpoints, crash recovery, concurrency, and back-pressure.
3. Shopify bulk path: runtime quota discovery, bulk-operation tracking, JSONL handling, per-shop governors, and destination-specific truth.
4. Google Hub: unified access to authorized Google capabilities through Service Registry.
5. Merchant/Ads truth isolation: Merchant product/video truth is explicitly separate from Google Ads asset/PMax truth.
6. Video Engine: versioned immutable media assets and background generation.
7. Promoter: market intelligence, campaign preparation, financial proposal, owner money gate, measurement, and optimization.
8. Financial engine: contribution math separates sales, product cost, shipping, payment fees, platform fees, advertising spend, and verified costs.
9. Concierge: exact service/account/deep-link resolution rather than generic tutorials, with verification before opening destinations.
10. Brand Engine: persistent versioned brand library.
11. Page Studio: conversational full-stack page generation inside APEX.
12. Music/Social Hub: direct links, release preparation, campaign assets, and provider-state tracking.
13. Service Registry: account aliases, authorization, capabilities, billing, health, quotas, deep links, and stop/disconnect controls.
14. Local Model Mesh: local endpoints and eligible device-native AI are first-class providers with explicit routing and privacy state.
15. Cost Governor: free/included-first routing and paid-execution visibility.
16. Truth/Telemetry/Audit: explicit separation of operational states and evidence.

## Current evidence vs. architecture intent

### Evidence in repository
- APEX-TERMINAL exists and is TypeScript-oriented.
- The repository contains the documented Terminal v1/full bootstrap architecture.
- The latest recorded Terminal commit establishes the unified execution standard and lifecycle.
- Apex-Omni-Vaulta exists as a separate public repository and contains the Omni Vault/navigation concept.

### Architecture specified but still requiring live proof
- Real 2,000-product Shopify import/publish run.
- Real Merchant API submission and processed-product evidence.
- Real Google Ads PMax asset/serving evidence.
- Real Stripe checkout/webhook/reconciliation dry run.
- Real deep-link resolution against each connected provider/account.
- Real local-phone model bridge and model health telemetry.
- Real background worker durability under crash/restart.
- Real capacity measurement under provider throttling.

## Immediate implementation order

### Gate 1 — Repo foundation
Keep the additive specification on the audit branch until reviewed. Do not overwrite existing architecture.

### Gate 2 — Service Registry + Vault references
Make every provider a capability record. Store only credential references in application state.

### Gate 3 — Provider/Model Router
Add local-device, local-server, and cloud model adapters behind one interface.

### Gate 4 — Catalog + Queue proof
Run a controlled 2,000-item import and record complete reconciliation evidence.

### Gate 5 — Shopify publication proof
Publish only after source/catalog validation and owner approval. Record Shopify operation IDs and outcomes.

### Gate 6 — Google Merchant proof
Submit and independently verify processed product state/issues.

### Gate 7 — Promoter money gate
Generate campaign proposals only. No spend until owner approval.

### Gate 8 — Concierge
Populate verified deep links by provider/account and expose one-click destinations in the workspace.

### Gate 9 — Omni Workspace
Make Gmail, Drive, Calendar, Shopify, Stripe, Google, music, social, GitHub, deployments, and frequently used services one-click surfaces without copying secrets into the UI.

## Definition of completion for the first revenue validation

The system must produce an auditable report showing:

REQUESTED
PROCESSABLE
IMPORTED
VALIDATED
PUBLISHED
FAILED
RETRIED
DEAD-LETTERED
PROVIDER ERRORS
DESTINATION STATE
DURATION
COST
RECONCILIATION

No green status is allowed without evidence.

## Final tone / identity

APEX should be described as an owner-controlled commerce + creative + developer operating system, not merely a product importer, chatbot, dashboard, or link page. Its differentiator is the combination of canonical truth, durable execution, provider independence, deep-link concierge, local/cloud AI routing, owner-controlled money gates, and a single operational workspace.
