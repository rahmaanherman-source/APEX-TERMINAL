# Apex Heritage Alexa Phase 1 Design

## Status

Approved for implementation after the user explicitly said `GO`.

## Objective

Add Alexa as a presentation/voice adapter to APEX Heritage while preserving the existing APEX Terminal verification architecture. Alexa is never a source of truth. It receives canonical results from the existing backend/Truth Gate and renders them without inference.

## Architectural Boundary

```text
USER VOICE
   ↓
ALEXA SKILL
   ↓
APEX ALEXA HANDLER
   ↓
APEX HERITAGE ADAPTER
   ↓
REAL APEX HERITAGE API
   ↓
TRUTH GATE / EXISTING VERIFICATION
   ↓
CANONICAL RESULT
   ↓
AUDIT EVIDENCE
   ↓
ALEXA RESPONSE
```

The Terminal remains the orchestration/control plane. Alexa is an external adapter, not a replacement for the Terminal or Heritage backend.

## Truth Contract

The only externally exposed truth states are:

- `OBSERVED`
- `FAILED`
- `BLOCKED`
- `UNVERIFIED`
- `NOT_CONNECTED`

There is no `PROBABLY_OK`, `SUCCESS` shortcut, or LLM-generated verification state.

## Execution Identity

Every Alexa request receives an `executionId` before an external call. The ID follows the request through API execution, result validation, audit evidence, and user response.

## Canonical Result

```ts
interface ApexHeritageResult {
  executionId: string;
  state: "OBSERVED" | "FAILED" | "BLOCKED" | "UNVERIFIED" | "NOT_CONNECTED";
  reason: string;
  evidence: Record<string, unknown>;
  observedAt: string;
}
```

A malformed backend response is rejected rather than repaired by inference.

## Supported Phase 1 Intents

1. `SearchHeritage`
2. `CheckTruthStatus`
3. `CheckProvenance`
4. `BrowseMarketplace`
5. `CheckCollection`
6. `CheckUploadHistory`

The interaction model also supports standard Help/Stop/Cancel behavior.

## Truthful Voice Rendering

Examples:

```text
OBSERVED:
"Record APEX-011 is OBSERVED. Execution ID e1."

BLOCKED:
"Record APEX-011 is BLOCKED. Reason: provenance chain incomplete. Execution ID e1."

UNVERIFIED:
"The record could not be verified. Status is UNVERIFIED. Execution ID e1."

NOT_CONNECTED:
"Apex Heritage is not connected right now. Status is NOT_CONNECTED. Execution ID e1."
```

Alexa may summarize evidence, but it may not upgrade a state or invent a reason.

## API Adapter

The adapter calls a configured real endpoint using `APEX_HERITAGE_API_URL`. It returns `NOT_CONNECTED` when the endpoint cannot be reached, `BLOCKED` for authorization denial, and `FAILED` for other HTTP failures. A successful HTTP response is not itself a Truth Gate pass; the response must satisfy the canonical schema and contain the backend's actual truth state.

## Audit Binding

Every result creates an audit event containing:

```text
executionId
intent
requestSha256
responseSha256
state
reason
timestamp
```

Canonical JSON serialization is required before SHA-256 hashing. Credentials and authorization headers are excluded from the audit payload.

## Deployment Boundary

Phase 1 produces deployment-ready Alexa source and an importable interaction model. It does not claim Alexa Developer Console publication, AWS deployment, or live API connectivity unless those actions are actually performed and evidenced.

## Testing Strategy

- Contract tests reject unsupported truth states and malformed evidence.
- Adapter tests cover success, HTTP denial, HTTP failure, malformed response, and unreachable API.
- Handler tests cover all supported intents and every truth state.
- Interaction-model tests ensure intent names match the handler.
- Audit tests verify deterministic hashing and execution-ID preservation.
- Repository verification runs focused tests, typecheck, and build.
- Real integration verification uses the configured Apex Heritage endpoint only; no production evidence is supplied by fixtures.

## Non-Goals

This phase does not implement Smart Home, Works with Alexa certification, Echo Show APL, Alexa for Business/Hospitality, physical-device control, or replacement of existing APEX Terminal/Heritage systems. Those are separate projects gated by their actual prerequisites.

## Acceptance Rule

If any required dependency is unavailable, the system reports the exact blocked/unverified state. The project never turns an unavailable dependency into a green success.
