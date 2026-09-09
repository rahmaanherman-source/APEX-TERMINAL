# APEX Creative AI Studio — Canonical Blueprint

**Standard:** APEX Verified Production Standard (AVPS)
**Target:** AVPS-Tier 5 — Sovereign Verified
**Current release authorization:** BLOCKED until repository, CI, deployment, provider, security, financial, authorization, and recovery evidence satisfies the applicable AVPS gates.

> **Governing rule:** Make it look like the highest-end creative command center and behave like a truth-governed production control plane. No fake green. No visual imitation of runtime truth. Missing evidence is never converted into success.

## 1. Purpose

APEX Creative AI Studio is a multimodal creative workspace governed by APEX truth, Gatekeeper authorization, Godspeed execution, provider verification, durable jobs, financial integrity, and evidence-bound UI state.

The Studio is not a generic administration dashboard and must not be implemented as a visual imitation of a provider console. The central creation experience should feel premium and simple to the customer while the Provider Hub and audit surfaces expose truthful operational context to authorized operators.

The implementation must preserve the canonical APEX flow:

```text
APEX Hub → Gabby → CommandBus → Godspeed → Omni / Integration Bus
→ Gatekeeper → Omni Vault → Authorized Provider
→ Read-back → Truth / Evidence → Hub
```

Godspeed is the execution layer. Gabby is the operational intelligence layer and status/orchestration authority. Gatekeeper remains the authorization boundary. Vault remains the credential authority. The Truth plane determines what can be represented as verified.

## 2. Visual system

### Foundation

- Midnight black / deep navy foundation.
- Layered black-to-navy depth.
- Subtle grid and barely visible circuit traces.
- Radial lighting blooms used sparingly for depth.
- Electric cyan as the primary signal/accent.
- Cobalt and violet for dimensional depth.
- Restrained magenta for creative activity.
- Amber for pending approval or active execution.
- Red only for confirmed risk/failure.
- Green only for evidence-backed completion.

### Surfaces

- Translucent deep-blue glass / metal panels.
- 1px cyan/blue edge highlights.
- Soft shadows.
- 18–24px radius.
- Avoid excessive blur and decorative empty space.
- Commercial creative-software density: controls, metadata, status, history, and operational context remain useful and discoverable.

### Typography

- Bold condensed display treatment for system labels.
- Clean sans-serif for controls, tables, metadata, and readable operational detail.
- Hierarchy must remain legible at desktop and mobile sizes.

### Motion

- Quiet, purposeful transitions.
- Micro-transitions target <180ms where practical.
- Loading waves, activity pulses, and chart transitions must represent actual UI state.
- Animation must never be the sole carrier of a status meaning.

### Accessibility

Every state communicated through color must also have a text label and/or icon. Focus states, keyboard access, screen-reader labels, contrast, reduced-motion behavior, and touch targets are required. The interface must remain understandable with animation disabled.

## 3. Application shell

```text
┌─────────────────────────────────────────────────────────────────────┐
│ APEX CREATIVE AI STUDIO      Search / Command      Alerts   Profile │
├──────────────┬───────────────────────────────────┬──────────────────┤
│ NAVIGATION   │ CREATION WORKSPACE                │ GABBY / CONTROL  │
│              │                                   │                  │
│ Create       │ Mode + Model selector             │ Orb state        │
│ Projects     │ Prompt / upload / reference area  │ Truth status     │
│ Assets       │ Settings drawer                   │ Queue health     │
│ Provider Hub │ Generate action rail              │ Cost estimate    │
│ History      │ Real generation canvas/results    │ Activity feed    │
│ Billing      │ Edit / vary / upscale / export    │                  │
│ Admin        │                                   │                  │
├──────────────┴───────────────────────────────────┴──────────────────┤
│ Job timeline · Provider events · Audit feed · Credits · System state│
└─────────────────────────────────────────────────────────────────────┘
```

The center creation workspace is visually dominant. The right control column is operationally dense but must not become a decorative Gabby panel. The bottom rail exposes job, provider, audit, credit, and system evidence appropriate to the user's authorization level.

## 4. Creation flow

```text
CREATE
 → Mode
 → Evidence-eligible model
 → Prompt / source asset
 → Advanced parameters
 → Credit estimate
 → Generate
 → Durable job timeline
 → Provider result
 → Evidence verification
 → Result
 → Edit / Variate / Upscale / Export
```

### Capability-driven modes

- Image generation
- Image edit
- Variations
- Upscale / enhance
- Background removal / replacement
- Image-to-image
- Image-to-video
- Audio
- Voice

The UI may expose a polished mode shell before a capability is enabled, but an unavailable capability must remain explicitly unavailable. It must not show fabricated examples as successful output.

Model selection must be derived from the database-backed model registry and filtered by capability, authorization, administrator enablement, credential availability, and current verification evidence.

## 5. Truthful unavailable states

When a capability cannot legitimately execute, the creation surface must display the applicable evidence-bound state, including:

```text
PROVIDER CREDENTIAL REQUIRED
MODEL UNVERIFIED
CAPABILITY UNAVAILABLE
PROVIDER DEGRADED
MODEL DISABLED BY ADMIN
PENDING APPROVAL
PROVIDER UNAVAILABLE
```

The interface must not substitute fake result galleries, sample provider responses, optimistic success toasts, or hardcoded health values.

## 6. Provider Hub

The AI Model & Provider Hub is the executive-grade control plane for provider/model state.

Required provider detail includes:

- Connection/truth status.
- Evidence timestamp.
- Evidence ID or audit link.
- Safe reason code.
- Verification method.
- Verification expiry/TTL.
- Gatekeeper authorization state.
- Model and capability inventory.
- Capability availability.
- Cost/pricing metadata source.
- Quota/limit state.
- Latency and error metrics where available.
- Verification history.
- Usage and provider-event history.
- Permitted next actions.

Actions such as Verify, Discover, Test, Enable, Disable, or Audit must be governed by authorization and must create evidence/audit records where applicable.

## 7. Evidence-bound status contract

All operational UI status must originate from an evidence-bound backend contract. The canonical status set is:

```typescript
type TruthStatus =
  | "VERIFIED"
  | "UNVERIFIED"
  | "VERIFYING"
  | "CREDENTIAL_REQUIRED"
  | "PENDING_APPROVAL"
  | "UNAVAILABLE"
  | "DEGRADED"
  | "DISABLED"
  | "FAILED"
  | "REVOKED";

interface EvidenceBoundStatus {
  subjectType: "provider" | "model" | "job" | "asset" | "billing" | "deployment";
  subjectId: string;
  status: TruthStatus;
  evidenceId: string | null;
  verificationMethod: string;
  verifiedAtUtc: string | null;
  expiresAtUtc: string | null;
  requestId: string | null;
  traceId: string | null;
  reasonCode: string;
  humanSafeMessage: string;
}
```

No component may independently manufacture `Connected`, `Live`, `Ready`, `Paid`, `Completed`, or `Production`. Those labels are presentation aliases only when backed by an appropriate evidence-bound status and policy decision.

A `VERIFIED` state is time-bounded. Expired evidence transitions to a verification-required state according to policy; stale provider/model state must be demoted rather than silently retained.

## 8. Gabby Orb

Gabby is an operational intelligence orb, not an avatar or mascot.

The orb mode is driven only by real runtime state:

| Mode | Visual treatment | Trigger |
|---|---|---|
| Focus | Blue | Analysis, routing, status inspection |
| Learn | Purple | Registry discovery or evidence ingestion |
| Create | Magenta | User composing/configuring work |
| Execute | Amber | Authorized job dispatch/processing |
| Protect | Red | Confirmed security/payment/integrity/system risk |
| Success | Green | Persisted evidence confirms completion |
| Rest | Dim cyan | No active work and healthy evidence state |

Example accessible status: `Gabby: Execute — job gen_… is processing with provider evidence.`

Green Success is forbidden until persisted evidence confirms the outcome. A request being submitted is not a success event.

## 9. Functional contracts

### Generate

Creates an idempotent durable job, reserves credits according to policy, obtains a scoped Gatekeeper-approved credential lease, dispatches through Godspeed/Omni, records provider evidence, and exposes real-time status.

### Cancel

Requests provider cancellation only when supported. The UI remains in a cancellation-pending state until the provider or reconciliation process confirms the final outcome.

### Retry

Creates a governed attempt under the original job and preserves billing idempotency. It must not duplicate a settled charge or credit capture.

### Download

Authorizes user/project ownership server-side, generates a short-lived signed private-asset URL, and records an asset-access audit event.

### Model selection

Queries the database-backed registry and excludes disabled, unverified, unsupported, unavailable, unauthorized, or credential-ineligible models.

### Provider verification

Requests a Gatekeeper-approved scoped credential lease and records verification evidence. The frontend never receives or displays the provider secret.

### Provider enable/disable

Requires elevated authorization, explicit confirmation, and an append-only audit event.

### Billing

Displays ledger-derived available credits, pending reservations, subscription state, invoices, payment failures, and reconciliation state. Client-side balances are never authoritative.

### Audit Feed

Supports filtering by request ID, trace ID, provider, model, job, project, user, severity, and truth state, subject to authorization.

## 10. Security boundaries

- Provider credentials are sourced only through Omni Vault/Gatekeeper.
- Frontend code never receives raw provider secrets.
- Ordinary administrators do not receive raw provider secrets.
- Credential requests are scoped by provider, project, environment, action, permissions, and user/role policy.
- Credential lease, approval, use, revoke, and close events are auditable.
- Server-side object authorization is mandatory for projects, assets, jobs, provider actions, and billing records.
- Private assets require authorized signed access.
- Rate limits must consider user, tenant, IP, route, model, provider, and cost exposure.
- Webhook verification must use provider-specific documented raw-request signature rules.
- Secrets must not be emitted to logs, audit records, browser state, URLs, source maps, or client telemetry.

## 11. Execution architecture

```text
Experience Plane
      ↓
API / Command Boundary
      ↓
CommandBus
      ↓
GODSPEED execution
      ↓
Omni / Integration Bus
      ↓
Gatekeeper policy decision
      ↓
Vault scoped credential lease
      ↓
Provider adapter
      ↓
Webhook / bounded reconciliation
      ↓
Truth + Evidence
      ↓
Audit / Ledger / UI
```

Long-running generation work must be durable and asynchronous. Synchronous web requests must not be treated as the generation execution engine. Client job states are never authoritative.

## 12. Financial integrity

The commercial path requires:

- Immutable double-entry credit ledger.
- Reservation before provider dispatch.
- Capture only according to provider outcome and recorded pricing policy.
- Explicit cancellation, timeout, failure, and refund behavior.
- Unique provider event IDs.
- Duplicate, delayed, out-of-order, and replay-safe webhook handling.
- Reconciliation between payment events, provider usage, generation jobs, assets, and internal credits.
- Elevated authorization and immutable audit for financial/admin operations.

## 13. Component contract

The canonical UI component family includes:

```text
AppShell
TopCommandBar
GlobalSearch
NotificationCenter
LeftNav
CreationModePicker
ModelRegistrySelector
PromptComposer
ReferenceAssetPicker
GenerationSettingsDrawer
CreditCostPreview
GenerationJobTimeline
ResultCanvas
AssetInspector
ProjectExplorer
ProviderOverviewGrid
ProviderDetailPanel
ModelRegistryTable
GatekeeperRequestDrawer
ProviderHealthChart
UsageCostChart
CreditLedgerPanel
WebhookFailureQueue
AuditFeed
GabbyOrb
SystemHealthStrip
AdminActionApprovalModal
```

Components should consume shared status, authorization, loading, error, empty, offline, and evidence contracts rather than inventing local conventions.

## 14. AVPS production gates

Creative AI Studio is governed by the APEX Verified Production Standard.

### Source integrity

Protected source control, required CI, dependency lockfiles, secret scanning, SBOM, signed artifacts, provenance, and release traceability.

### Application security

ASVS-based verification, server-side object authorization, secure session/authentication controls, security headers, CSRF/CORS policy where applicable, input/upload/media validation, signed private asset access, and rate limiting.

### Provider integrity

Vault/Gatekeeper credential control, provider adapter contracts, real provider verification, TTL-based model registry truth, capability/cost/quota metadata, provider-specific reliability controls, and replay-safe webhook verification.

### Financial integrity

Immutable ledger, reservations, capture/refund policy, unique provider/payment events, reconciliation, and elevated audited financial controls.

### Reliability

Durable jobs/state, transactional outbox where required, queue/database/storage/provider/webhook probes, bounded retries, jitter/backoff, deadlines, concurrency controls, DLQ handling, circuit breakers, backup/restore testing, and recovery exercises.

### Operational readiness

On-call ownership, severity/runbooks, dashboards, tested alerts, rollback/migration safety, disaster-recovery exercises, applicable privacy/retention/deletion/export controls, and least-privilege administration.

## 15. Minimum commercial vertical slice

The first production authorization path is:

```text
Authenticated user
 → authorized project
 → dynamically verified image model
 → Gatekeeper-approved credential lease
 → durable generation job
 → credit reservation
 → real provider request
 → signature-verified webhook OR bounded reconciliation
 → provider result
 → validated private asset
 → authorized signed download
 → credit capture/refund
 → immutable audit/evidence chain
 → truthful Hub status
```

If this path cannot pass in a real controlled environment, advanced multimodal capabilities remain unavailable rather than simulated.

## 16. Release evidence certificate

Every release must produce a machine-generated certificate containing:

```text
Release version
Full Git SHA
Artifact digest
SBOM digest
SLSA provenance reference/digest
Database migration revision
Environment
Approval authority
UTC issued timestamp
Build status
Type-check status
Unit status
Integration status
E2E status
Security status
Authorization-matrix status
Webhook duplicate/replay status
Billing reconciliation status
Backup/restore status
Provider verification status
Final status: VERIFIED FOR <environment> OR BLOCKED — <evidence-backed reason>
```

The certificate must be generated from CI/runtime evidence. Manually authored production claims do not qualify as release evidence.

## 17. Implementation discipline

1. Preserve existing canonical APEX implementations.
2. Reconcile the App Builder output created on September 9, 2026 against the repository rather than rebuilding duplicate surfaces.
3. Search for existing Creative/Character Studio routes and shared infrastructure before adding components.
4. Keep application boundaries strict; do not create feature or visual bleed into Trades, Plumbing, 360, Hub, Vault, or other products unless an explicit shared contract requires it.
5. Do not introduce mock providers, fake balances, fake jobs, fake health, or decorative success states into production paths.
6. Label missing integrations as unavailable/unverified and record the evidence gap.
7. Treat CI/deployment/provider output as evidence only after it is actually observed and retained.
8. Before claiming a tier, reconcile source, build, runtime, deployment, security, provider, financial, and recovery evidence.

## 18. Current repository evidence boundary

This document is the canonical design/build contract. It is not itself evidence that every described subsystem exists or is production-ready.

At the time this document is committed, repository work already contains real APEX TERMINAL verification/control-plane foundations, including the Zero-Trust Bootstrap lifecycle and Credential Intelligence. Those foundations must be reused where their contracts apply. Creative AI Studio implementation status must be independently reconciled against the actual repository and runtime evidence before AVPS promotion.

The absence of a required implementation is an evidence gap, not permission to claim success.

## 19. Builder directive

```text
BUILD APEX CREATIVE AI STUDIO AS A FULL-STACK, EVIDENCE-GOVERNED
MULTIMODAL CREATIVE PLATFORM.

VISUAL TARGET:
Create a premium near-black creative command center with midnight navy depth,
electric cyan signal accents, glass-metal panels, dense professional controls,
subtle grid/circuit texture, responsive desktop workspace, and mobile-first
adaptation. Do not create a generic dashboard.

FUNCTIONAL TARGET:
Every screen, button, status label, chart, provider, model, job, asset,
credit balance, billing event, and audit record must be connected to real
backend data. No hardcoded generations, fake balances, placeholder provider
health, fake green statuses, mock checkout, or dead buttons.

CONTROL PLANE:
Make AI Model & Provider Hub the central control plane. Render providers and
models from a database-backed registry. Use evidence-bound states:
VERIFIED, VERIFYING, CREDENTIAL_REQUIRED, PENDING_APPROVAL, UNVERIFIED,
UNAVAILABLE, DEGRADED, DISABLED, FAILED, REVOKED.

SECRETS:
Use Omni Vault and Gatekeeper only. The frontend and ordinary admins never
receive provider credentials. Provider actions request scoped credential access,
record approval/denial and audit events, and display only non-secret references.

CREATION:
Implement Image, Edit, Variate, Upscale, Background, Image-to-Image, Video,
Audio, and Voice as capability-driven modes. Dynamically show only models
authorized, enabled, and verified for the selected mode. If a provider
credential or capability is missing, show the truthful unavailable state.

GABBY:
Use the Gabby Orb as an operational status system, not an avatar. Bind each
mode to verified runtime events. Green Success appears only after persisted
evidence confirms completion. Red Protect appears only for confirmed risk.

QUALITY:
Implement responsive mobile and desktop layouts, keyboard access, focus states,
screen-reader labels, loading/empty/error/retry/offline states, server-side
authorization, signed asset downloads, idempotent jobs and billing, append-only
redacted audit records, signature-verified webhooks, real-time updates,
provider health, queue health, and observability.

Never declare a system connected, working, or production-ready without stored,
time-bound verification evidence.
```

## 20. Governing completion rule

**APEX Creative AI Studio is not complete because the interface looks complete.**

It is complete only when the applicable AVPS evidence gates pass and the real vertical slice produces retained evidence from authorization through execution, provider outcome, asset access, billing, audit, reconciliation, and truthful UI state.

Until then:

```text
PRODUCTION AUTHORIZATION: BLOCKED

Reason: required evidence is incomplete.

Next promotion condition:
Observed, retained, reconciled evidence must satisfy the applicable AVPS gates.
```
