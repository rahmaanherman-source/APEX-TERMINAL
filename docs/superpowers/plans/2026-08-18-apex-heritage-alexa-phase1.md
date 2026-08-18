# Apex Heritage Alexa Phase 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a real Apex Heritage Alexa voice integration boundary that routes Alexa requests to the existing APEX API/Truth Gate without introducing fake data or bypassing deterministic verification.

**Architecture:** Alexa is an external presentation/voice adapter. The skill handler validates the request, creates an execution ID, calls the configured Apex Heritage API, validates the returned canonical state, and renders only truthful states. Alexa never becomes a second source of truth. Existing Terminal, Slab, Comparator, audit, AI, payment, and database systems remain preserved; this phase adds only the voice boundary and its tests.

**Tech Stack:** TypeScript, Node.js/AWS Lambda-compatible handler, Alexa request/response JSON contracts, Zod for runtime schema validation, existing APEX deterministic verification conventions, Jest/Vitest-compatible test runner already used by the repository.

**Spec:** `docs/superpowers/specs/2026-08-18-apex-heritage-alexa-phase1-design.md`

## Global Constraints

- No fake data, mock success, fabricated provenance, or invented Truth Gate status.
- Alexa can expose only `OBSERVED`, `FAILED`, `BLOCKED`, `UNVERIFIED`, or `NOT_CONNECTED` from the real backend contract.
- The LLM/Gabby is never the verifier and cannot override Comparator or Truth Gate results.
- Every request receives an execution ID and retains it through API response, verification, and audit evidence.
- Existing backend/frontend/AI/payment/database behavior is preserved; this phase adds an adapter boundary.
- Secrets are environment/config references only; credentials and tokens are never committed.
- A backend/API failure is a truthful `NOT_CONNECTED` or `BLOCKED` result, never a success fallback.
- Alexa-specific code must remain isolated from core verification logic.

---

### Task 1: Define the Alexa canonical contracts

**Files:**
- Create: `integrations/alexa/contracts.ts`
- Create: `integrations/alexa/README.md`
- Test: `tests/alexa/contracts.test.ts`

**Interfaces:**
- Consumes: Alexa request envelope and Apex Heritage canonical result.
- Produces: `AlexaExecutionRequest`, `ApexTruthState`, `ApexHeritageResult`, and `AlexaResponseEnvelope`.

- [ ] **Step 1: Write failing tests for accepted and rejected canonical states**

```ts
expect(parseTruthState("OBSERVED")).toBe("OBSERVED");
expect(() => parseTruthState("PROBABLY_OK")).toThrow();
expect(() => parseTruthState("GREEN")).toThrow();
```

- [ ] **Step 2: Run the focused test and confirm failure**

Run: `npm test -- tests/alexa/contracts.test.ts`
Expected: FAIL because the Alexa contract module does not exist.

- [ ] **Step 3: Implement strict contracts with Zod**

```ts
export const TruthState = z.enum([
  "OBSERVED",
  "FAILED",
  "BLOCKED",
  "UNVERIFIED",
  "NOT_CONNECTED",
]);

export const ApexHeritageResult = z.object({
  executionId: z.string().min(1),
  state: TruthState,
  reason: z.string().min(1),
  evidence: z.record(z.unknown()).default({}),
  observedAt: z.string().datetime(),
});
```

- [ ] **Step 4: Run focused tests and confirm pass**

Run: `npm test -- tests/alexa/contracts.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add integrations/alexa/contracts.ts integrations/alexa/README.md tests/alexa/contracts.test.ts
git commit -m "feat: define Alexa canonical truth contracts"
```

### Task 2: Build the Apex Heritage API adapter

**Files:**
- Create: `integrations/alexa/ApexHeritageAdapter.ts`
- Create: `integrations/alexa/config.ts`
- Test: `tests/alexa/ApexHeritageAdapter.test.ts`

**Interfaces:**
- Consumes: intent name, slots, API base URL, and runtime fetch.
- Produces: validated `ApexHeritageResult` with the original execution ID preserved.

- [ ] **Step 1: Write failing tests for successful API response and unreachable API**

```ts
const response = await adapter.execute({
  intent: "SearchHeritage",
  slots: { query: "textiles" },
  executionId: "exec-1",
});
expect(response.state).toBe("OBSERVED");
expect(response.executionId).toBe("exec-1");

fetchMock.mockRejectedValueOnce(new Error("network down"));
await expect(adapter.execute(request)).resolves.toMatchObject({
  state: "NOT_CONNECTED",
});
```

- [ ] **Step 2: Run focused tests and confirm failure**

Run: `npm test -- tests/alexa/ApexHeritageAdapter.test.ts`
Expected: FAIL because the adapter does not exist.

- [ ] **Step 3: Implement real HTTP adapter**

```ts
export interface HeritageRequest {
  intent: string;
  slots: Record<string, string | undefined>;
  executionId: string;
}

export class ApexHeritageAdapter {
  constructor(private readonly baseUrl: string, private readonly fetchImpl: typeof fetch = fetch) {}

  async execute(request: HeritageRequest): Promise<ApexHeritageResult> {
    try {
      const response = await this.fetchImpl(`${this.baseUrl}/api/alexa/execute`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        return {
          executionId: request.executionId,
          state: response.status === 403 ? "BLOCKED" : "FAILED",
          reason: `APEX_API_HTTP_${response.status}`,
          evidence: {},
          observedAt: new Date().toISOString(),
        };
      }

      return ApexHeritageResult.parse(await response.json());
    } catch {
      return {
        executionId: request.executionId,
        state: "NOT_CONNECTED",
        reason: "APEX_API_UNREACHABLE",
        evidence: {},
        observedAt: new Date().toISOString(),
      };
    }
  }
}
```

- [ ] **Step 4: Run tests and confirm pass**

Run: `npm test -- tests/alexa/ApexHeritageAdapter.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add integrations/alexa/ApexHeritageAdapter.ts integrations/alexa/config.ts tests/alexa/ApexHeritageAdapter.test.ts
git commit -m "feat: add Apex Heritage Alexa API adapter"
```

### Task 3: Implement Alexa intent routing and truthful responses

**Files:**
- Create: `integrations/alexa/handler.ts`
- Create: `integrations/alexa/response.ts`
- Test: `tests/alexa/handler.test.ts`

**Interfaces:**
- Consumes: Alexa request JSON.
- Produces: Alexa-compatible response JSON plus execution ID and truthful status wording.

- [ ] **Step 1: Write failing tests for each supported intent**

```ts
for (const intent of [
  "SearchHeritage",
  "CheckTruthStatus",
  "CheckProvenance",
  "BrowseMarketplace",
  "CheckCollection",
  "CheckUploadHistory",
]) {
  const response = await handler(alexaRequest(intent));
  expect(response.version).toBe("1.0");
}
```

- [ ] **Step 2: Add failure-state tests**

```ts
expect(renderTruthfulResponse({
  executionId: "e1",
  state: "BLOCKED",
  reason: "PROVENANCE_INCOMPLETE",
  evidence: {},
  observedAt: new Date().toISOString(),
})).toContain("BLOCKED");
```

- [ ] **Step 3: Implement routing without self-verification**

```ts
export async function handler(event: AlexaEvent): Promise<AlexaResponse> {
  const executionId = crypto.randomUUID();
  const intent = extractIntent(event);
  const slots = extractSlots(event);
  const result = await heritageAdapter.execute({ intent, slots, executionId });
  return toAlexaResponse(result);
}
```

The renderer must map states directly and must never infer `OBSERVED` from text, confidence, HTTP 200 alone, or an LLM response.

- [ ] **Step 4: Run handler tests**

Run: `npm test -- tests/alexa/handler.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add integrations/alexa/handler.ts integrations/alexa/response.ts tests/alexa/handler.test.ts
git commit -m "feat: add truthful Apex Heritage Alexa intents"
```

### Task 4: Add the Phase 1 Alexa interaction model

**Files:**
- Create: `integrations/alexa/interaction-model/en-US.json`
- Create: `integrations/alexa/interaction-model/README.md`
- Test: `tests/alexa/interaction-model.test.ts`

**Interfaces:**
- Consumes: handler intent names.
- Produces: Alexa Developer Console importable interaction model.

- [ ] **Step 1: Write failing validation test**

```ts
const model = loadInteractionModel();
expect(model.interactionModel.languageModel.intents.map(i => i.name)).toEqual(
  expect.arrayContaining([
    "SearchHeritage",
    "CheckTruthStatus",
    "CheckProvenance",
    "BrowseMarketplace",
    "CheckCollection",
    "CheckUploadHistory",
  ]),
);
```

- [ ] **Step 2: Run validation and confirm failure**

Run: `npm test -- tests/alexa/interaction-model.test.ts`
Expected: FAIL because the interaction model is absent.

- [ ] **Step 3: Create the complete model**

The model must include invocation name `apex heritage`, the six intents above, required slots for record IDs/search queries where applicable, Help, Stop, Cancel, and built-in fallback handling. It must not contain unsupported claims about authenticity.

- [ ] **Step 4: Run validation**

Run: `npm test -- tests/alexa/interaction-model.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add integrations/alexa/interaction-model tests/alexa/interaction-model.test.ts
git commit -m "feat: add Apex Heritage Alexa interaction model"
```

### Task 5: Bind Alexa execution to APEX audit evidence

**Files:**
- Modify: `integrations/alexa/handler.ts`
- Create: `integrations/alexa/audit.ts`
- Test: `tests/alexa/audit.test.ts`

**Interfaces:**
- Consumes: `ApexHeritageResult` and execution ID.
- Produces: append-only Alexa audit event containing request hash, response hash, state, timestamp, and execution ID.

- [ ] **Step 1: Write failing audit tests**

```ts
const event = createAlexaAuditEvent(result);
expect(event.executionId).toBe(result.executionId);
expect(event.status).toBe(result.state);
expect(event.responseSha256).toMatch(/^[a-f0-9]{64}$/);
```

- [ ] **Step 2: Implement canonical JSON hashing**

Use deterministic key ordering before SHA-256. Do not hash JavaScript object stringification whose property order can change through future refactors.

- [ ] **Step 3: Reject missing evidence for claimed verification**

```ts
if (result.state === "OBSERVED" && !result.evidence) {
  throw new Error("OBSERVED result requires evidence");
}
```

- [ ] **Step 4: Run audit tests**

Run: `npm test -- tests/alexa/audit.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add integrations/alexa/handler.ts integrations/alexa/audit.ts tests/alexa/audit.test.ts
git commit -m "feat: bind Alexa results to APEX audit evidence"
```

### Task 6: Add configuration and deployment documentation without claiming deployment

**Files:**
- Create: `integrations/alexa/.env.example`
- Create: `integrations/alexa/deploy.md`
- Modify: `README.md`
- Test: `tests/alexa/config.test.ts`

**Interfaces:**
- Consumes: environment configuration.
- Produces: deployment-ready package instructions and a deterministic configuration check.

- [ ] **Step 1: Write failing configuration tests**

```ts
expect(parseConfig({ APEX_HERITAGE_API_URL: "https://example.invalid" }).apiUrl)
  .toBe("https://example.invalid");
expect(() => parseConfig({})).toThrow("APEX_HERITAGE_API_URL");
```

- [ ] **Step 2: Implement configuration validation**

Required: `APEX_HERITAGE_API_URL`. Optional: `APEX_ALEXA_APP_ID` for deployment-time validation. No secrets are stored in the repository.

- [ ] **Step 3: Document Lambda deployment and Alexa Developer Console import**

Documentation must explicitly distinguish generated/deployment-ready code from an actually deployed skill. It must include the commands to run local tests and the exact evidence required before calling the skill connected.

- [ ] **Step 4: Run the configuration test**

Run: `npm test -- tests/alexa/config.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add integrations/alexa/.env.example integrations/alexa/deploy.md README.md tests/alexa/config.test.ts
git commit -m "docs: define Alexa Phase 1 deployment boundary"
```

### Task 7: Run repository-wide verification and update the truth board

**Files:**
- Create: `docs/verification/APEX_ALEXA_PHASE1_TRUTH_BOARD.md`
- Modify: `docs/superpowers/plans/2026-08-18-apex-heritage-alexa-phase1.md`

**Interfaces:**
- Consumes: test results, typecheck/build results, and real API/skill evidence.
- Produces: explicit VERIFIED/UNVERIFIED/BLOCKED/FAILED truth record.

- [ ] **Step 1: Run focused Alexa tests**

Run: `npm test -- tests/alexa`
Expected: all Alexa tests PASS.

- [ ] **Step 2: Run typecheck**

Run: `npm run typecheck`
Expected: PASS. Any existing unrelated failure remains explicitly listed as an existing blocker rather than being hidden.

- [ ] **Step 3: Run build**

Run: `npm run build`
Expected: PASS for the existing Terminal build.

- [ ] **Step 4: Verify the real API boundary**

Run the integration test only with a real configured `APEX_HERITAGE_API_URL`. If the endpoint is unreachable, record `NOT_CONNECTED`; do not substitute fixtures as production evidence.

- [ ] **Step 5: Write the truth board**

Record exact commit SHA, test commands, results, API endpoint identity without secrets, execution IDs, and any blocked prerequisites. Do not mark Alexa deployed or VERIFIED solely because source code exists.

- [ ] **Step 6: Commit verification evidence**

```bash
git add docs/verification/APEX_ALEXA_PHASE1_TRUTH_BOARD.md docs/superpowers/plans/2026-08-18-apex-heritage-alexa-phase1.md
git commit -m "verify: record Apex Heritage Alexa Phase 1 truth board"
```

---

## Acceptance Criteria

Phase 1 is **VERIFIED** only if all of the following are evidenced:

1. The Alexa interaction model validates and maps to implemented handler intents.
2. Alexa requests receive unique execution IDs.
3. The handler calls the real Apex Heritage API boundary.
4. Canonical state validation rejects malformed evidence.
5. `OBSERVED` is emitted only when the backend/Truth Gate actually returns it with evidence.
6. `FAILED`, `BLOCKED`, `UNVERIFIED`, and `NOT_CONNECTED` remain truthful and visible to the user.
7. Alexa results are bound to deterministic audit evidence and SHA-256 hashes.
8. Focused tests, typecheck, and build pass.
9. Any unavailable external prerequisite is explicitly marked `UNVERIFIED`, `BLOCKED`, or `NOT_CONNECTED`.
10. No source file, credential, mock success, or documentation claims a deployment that has not actually occurred.

The loop remains:

```text
REMEMBER → REBUILD → REBOOT → VERIFY → UPGRADE
```
