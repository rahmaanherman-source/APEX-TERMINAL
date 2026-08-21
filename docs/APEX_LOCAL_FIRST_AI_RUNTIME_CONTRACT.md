# APEX LOCAL-FIRST AI RUNTIME CONTRACT

**Status:** OWNER-APPROVED DESIGN DIRECTIVE  
**Scope:** Gabby, local model execution, model routing, Vault/Gatekeeper, desktop/mobile operation, external-provider escalation  
**Runtime status:** DESIGN LOCKED / NOT YET VERIFIED

## 1. Purpose

APEX must not become dependent on a hosted AI provider's free-generation quota, subscription quota, temporary availability, or builder session.

The APEX application owns the control plane. AI providers and local model runtimes are resources behind that control plane.

## 2. Canonical routing law

```text
USER
  ↓
APEX HUB / GABBY
  ↓
GATEKEEPER
  ↓
CAPABILITY CHECK
  ↓
LOCAL MODEL ROUTER
  ↓
LOCAL MODEL / LOCAL TOOL
  ↓
AUTHORIZED ACTION
  ↓
READ BACK
  ↓
VERIFY
  ↓
AUDIT
  ↓
GABBY RESULT
```

External escalation is a controlled fallback:

```text
LOCAL CAPABILITY AVAILABLE
        → USE LOCAL

LOCAL CAPABILITY UNAVAILABLE / INSUFFICIENT
        → CHECK APPROVED EXTERNAL CAPABILITY
        → CHECK CREDENTIAL REFERENCE
        → AUTHORIZE
        → EXECUTE
        → READ BACK
        → VERIFY
        → AUDIT
```

**Local-first is the routing default. It is not a claim that every model or capability is already installed or operational.**

## 3. Provider/model abstraction

APEX must not hard-code Gabby to Gemini, OpenAI, or any single external provider.

A model runtime adapter should expose a provider-neutral contract containing, at minimum:

- `runtime_id`
- `model_id`
- `mode` (`LOCAL` or `EXTERNAL`)
- `endpoint_ref`
- `capabilities`
- `context_window`
- `vision`
- `tool_calling`
- `streaming`
- `health_state`
- `last_observed_at`
- `evidence_ref`

No runtime is `VERIFIED` merely because it is registered.

## 4. Local model registry

The future APEX Local AI Registry should support multiple local runners without making APEX dependent on one vendor. Candidate runner adapters may include:

- local OpenAI-compatible model servers
- LM Studio or equivalent desktop model servers
- Ollama or equivalent local model servers
- llama.cpp-compatible servers
- Hugging Face local inference/serving
- other approved local runtimes discovered through capability research

The registry records what is actually observed. It does not claim that a candidate runtime is installed.

## 5. Gabby execution contract

Gabby must become a real operator rather than a keyword-response demo.

The target interaction is:

```text
Architect/User request
        ↓
Gabby conversation context
        ↓
Model inference
        ↓
Structured intent/action plan
        ↓
Capability Registry check
        ↓
Gatekeeper authorization
        ↓
Executor / adapter
        ↓
Readback
        ↓
Comparator / Truth Gate
        ↓
Audit event
        ↓
Gabby response
```

Gabby must never claim an external operation occurred unless APEX has evidence that it occurred.

## 6. Character and vision actions

The Character Studio/Gabby surface should be able to route structured actions such as:

- create character
- modify prompt
- change body proportions
- change skin/material
- change clothing/accessory
- select pose
- select movement style
- apply animation
- generate variation
- save version
- open project
- render

These actions are capabilities, not promises of implementation. Each action requires an actual executor and verification path before it can report success.

## 7. Vault/Gatekeeper boundary

Credentials remain outside Gabby's conversational memory.

Required path:

`VAULT → credentialRef → GATEKEEPER → AUTHORIZED EXECUTOR → PROVIDER → RESULT → EVIDENCE`

The frontend may display credential-reference metadata and health state. It must not expose raw production keys.

APEX Terminal may have its own local Vault space while federating with another authorized Vault. The two spaces share the Gatekeeper boundary rather than sharing raw secrets.

## 8. Phone + computer topology

The intended multi-device pattern is:

```text
                 APEX HUB
              /            \
         PHONE              COMPUTER
           │                    │
       UI / CLIENT        LOCAL MODEL RUNTIMES
           │                    │
           └──── AUTHORIZED LOCAL NETWORK ────┘
                         │
                    GATEKEEPER
                         │
                    APEX SERVICES
```

A phone may act as the APEX client while a more capable local computer provides model inference. The exact network, authentication, TLS, discovery, and offline behavior must be implemented and tested before being marked verified.

## 9. External providers remain useful

External providers are not discarded. They become escalation resources for capabilities that are:

- unavailable locally
- materially stronger externally
- required by a provider-specific API/service
- authorized by the user's routing policy

The APEX router must preserve the reason for escalation and the provider used so the audit can explain why an external resource was selected.

## 10. Cost-control behavior

A hosted provider reaching a free quota must not stop APEX's entire workflow.

Example:

```text
Google AI Studio free generation limit reached
        ↓
APEX observes provider limitation
        ↓
Route to available local model
        ↓
Continue work locally
```

If the local model cannot perform the requested capability, APEX may present an external escalation path with a truthful cost/provider state rather than silently consuming paid resources.

## 11. Truth states

The local AI subsystem must distinguish at least:

- `DISCOVERED`
- `AVAILABLE`
- `RUNNING`
- `HEALTHY`
- `CAPABILITY_PROBED`
- `TESTED`
- `VERIFIED`
- `FAILED`
- `BLOCKED`
- `UNAVAILABLE`
- `UNKNOWN`

A model being downloaded, registered, selected, or visible in a UI is not equivalent to verified execution.

## 12. Required repository implementation

The next implementation should create a real module set similar to:

```text
components/AI/
  GabbyConsole.tsx
  LocalModelPanel.tsx
  ModelRouterStatus.tsx
  ProviderEscalationPanel.tsx

core/ai/
  model-types.ts
  model-registry.ts
  model-router.ts
  action-schema.ts
  capability-router.ts

adapters/ai/
  local/
    openai-compatible.ts
    lm-studio.ts
    ollama.ts
    llama-cpp.ts
    huggingface-local.ts

config/
  local-model-registry.json

tests/ai/
  model-router.test.ts
  no-external-when-local-available.test.ts
  gabby-action-contract.test.ts
  secret-boundary.test.ts

docs/verification/
  APEX_LOCAL_FIRST_AI_VERIFICATION.md
```

Adapters should only be implemented where a real supported runtime can be tested. Candidate adapters must remain `UNKNOWN` or `UNAVAILABLE` until observed.

## 13. Non-negotiable acceptance criteria

1. APEX can represent multiple local model runtimes.
2. APEX can select a local model before considering an external provider.
3. A local model can be health-checked through an actual adapter.
4. Gabby can send a request through the model abstraction rather than hard-coded keyword branches.
5. Structured actions can be routed to APEX capabilities.
6. Gatekeeper authorization occurs before protected external operations.
7. Readback/evidence is required before success is reported.
8. A hosted-provider quota failure does not automatically terminate the APEX workflow.
9. Raw credentials never enter Gabby chat state, frontend logs, or repository files.
10. Phone-to-computer local operation is not called verified until a real runtime test proves it.
11. External escalation is visible and auditable.
12. No fake-green state is introduced by model registration or routing.

## 14. Permanent rule

> **APEX OWNS THE CONTROL PLANE.**
>
> **LOCAL FIRST.**
>
> **EXTERNAL ONLY WHEN REQUIRED, AUTHORIZED, AND AVAILABLE.**
>
> **A PROVIDER LIMIT MUST NOT BECOME AN APEX LIMIT.**
>
> **GABBY MUST OPERATE THROUGH REAL CAPABILITIES, NOT PRETEND TO HAVE EXECUTED THEM.**
>
> **VERIFY BEFORE CLAIMING SUCCESS.**
