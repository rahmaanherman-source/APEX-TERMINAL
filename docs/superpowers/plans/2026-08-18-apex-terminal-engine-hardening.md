# APEX TERMINAL Engine Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the existing APEX TERMINAL foundation into a runnable local-first command and verification engine whose adapters report observed evidence, whose deterministic Comparator owns truth, and whose UI exposes every connected service as a simple auditable workspace tab.

**Architecture:** Preserve the existing APEX TERMINAL repository and extend it additively. GABBY/Chameleon Core translates intent; adapters execute real operations and return canonical evidence; the Comparator computes deterministic deltas; the Verify Gate assigns truth state; the audit ledger records tamper-evident evidence; the UI renders only observed state. External products remain external products and are represented through adapters rather than cloned.

**Tech Stack:** Python 3, TypeScript/React-compatible web UI, JSON contracts, SHA-256 hash chaining, local-first process discovery, provider-neutral adapter registry, GitHub Actions for CI where available.

**Spec:** `docs/GODSPEED_UNIFIED_WORKSTATION_ENGINE_SPEC.md`

## Global Constraints

- No fake green: the LLM cannot set `VERIFIED`.
- Adapter reports observations; Comparator owns verification.
- Critical verification uses `epsilon = 0` unless a contract explicitly defines another threshold.
- Missing/ambiguous evidence is `UNVERIFIED`, `BLOCKED`, or `FAILED` according to the canonical state rules; never guessed as success.
- Preserve existing backend/frontend/AI/payment/database capabilities; changes are additive.
- Connected services are workspace tabs backed by their real capability: native, remote, web, CLI, API, SDK, webhook, or MCP.
- Credentials are references/secure configuration only; secrets must not be committed, logged, or displayed unnecessarily.
- Every execution receives an `execution_id` and evidence must be traceable to it.
- Memory Slabs contain only verified project facts/evidence and are never treated as proof merely because they exist.
- Predictive observers are advisory; observed state remains the source of truth.
- Do not synchronously hash every 4K/60-FPS frame unless an explicit integrity/debug mode is enabled.

---

### Task 1: Harden the canonical adapter protocol

**Files:**
- Modify: `docs/CANONICAL_STATE_SCHEMA.md`
- Create: `core/protocol.py`
- Create: `tests/test_protocol.py`

**Interfaces:**
- Produces `ConnectionState`, `CanonicalState`, and validation helpers consumed by adapters, the Comparator, and AdapterManager.

- [ ] **Step 1: Write failing tests** for required envelope fields, valid/invalid states, and rejection of adapter-supplied `VERIFIED`.
- [ ] **Step 2: Run `pytest tests/test_protocol.py -v` and confirm failure.**
- [ ] **Step 3: Implement the canonical envelope validator and state enum.**
- [ ] **Step 4: Run the targeted test and confirm PASS.**
- [ ] **Step 5: Commit:** `feat: harden canonical adapter protocol`.

### Task 2: Make the Comparator the sole truth function

**Files:**
- Modify: `core/comparator.py`
- Modify: `tests/test_comparator.py`
- Create: `core/verification.py`

**Interfaces:**
- `compare_system_status(actual: Mapping[str, Any], desired: Mapping[str, Any], execution_id: str) -> dict[str, Any]`
- `verify_canonical_state(desired, actual, execution_id) -> VerificationResult`

- [ ] **Step 1: Add tests proving the adapter cannot manufacture `VERIFIED`, malformed evidence fails, version validation is enforced, and `epsilon=0` rejects any non-zero delta.**
- [ ] **Step 2: Run the comparator tests and confirm the new tests fail where expected.**
- [ ] **Step 3: Implement the verification boundary so adapter status is treated as observation only.**
- [ ] **Step 4: Run all comparator tests and confirm PASS.**
- [ ] **Step 5: Commit:** `feat: make comparator sole verification authority`.

### Task 3: Build the Adapter Manager lifecycle

**Files:**
- Create: `core/adapter_manager.py`
- Create: `tests/test_adapter_manager.py`
- Modify: `docs/GODSPEED_UNIFIED_WORKSTATION_ENGINE_SPEC.md`

**Interfaces:**
- `register(adapter) -> None`
- `audit(adapter_id, desired_state) -> VerificationResult`
- `execute(adapter_id, command, desired_state) -> VerificationResult`
- `get_status(adapter_id) -> ConnectionState`

- [ ] **Step 1: Write tests for registration, execution IDs, blocked adapters, failed verification, and verified transitions.**
- [ ] **Step 2: Run targeted tests and confirm failure before implementation.**
- [ ] **Step 3: Implement lifecycle orchestration: command → adapter → evidence → Comparator → Verify Gate.**
- [ ] **Step 4: Run targeted and full Python tests.**
- [ ] **Step 5: Commit:** `feat: add deterministic adapter manager`.

### Task 4: Complete SYSTEM_STATUS as the first real proof chain

**Files:**
- Modify: `adapters/system_status.py`
- Create/modify: `core/system_status_contract.json`
- Modify: `tests/test_comparator.py`
- Create: `tests/test_system_status.py`

**Interfaces:**
- Adapter returns canonical observed state only.
- The command path produces `execution_id`, readback, latency, evidence, and final verification result.

- [ ] **Step 1: Add tests for reachable status, unreachable health endpoint, malformed payload, latency failure, and successful readback.**
- [ ] **Step 2: Run tests and confirm failures identify missing behavior.**
- [ ] **Step 3: Implement the real local status probe without invented values.**
- [ ] **Step 4: Run the real system-status command locally and record the observed result.**
- [ ] **Step 5: Commit:** `feat: prove system status verification chain`.

### Task 5: Build the tamper-evident audit ledger

**Files:**
- Create: `audit/ledger.py`
- Create: `audit/canonicalize.py`
- Create: `tests/test_ledger.py`
- Modify: `docs/MEMORY_SLAB.md`

**Interfaces:**
- `canonical_event(event: Mapping[str, Any]) -> str`
- `append_event(event: Mapping[str, Any]) -> AuditRecord`
- `verify_chain(records) -> bool`

- [ ] **Step 1: Write tests for deterministic canonicalization, first hash, chained hash, and tamper detection.**
- [ ] **Step 2: Run targeted tests and confirm expected failures.**
- [ ] **Step 3: Implement `H_n = SHA256(H_(n-1) || canonical(Event_n))`.**
- [ ] **Step 4: Verify that modifying a historical event breaks chain validation.**
- [ ] **Step 5: Commit:** `feat: add tamper-evident audit ledger`.

### Task 6: Establish verified Memory Slabs per project

**Files:**
- Modify: `docs/MEMORY_SLAB.md`
- Create: `core/memory_slab.py`
- Create: `tests/test_memory_slab.py`

**Interfaces:**
- `record_verified_fact(project_id, evidence) -> MemoryFact`
- `load_project_slab(project_id) -> MemorySlab`
- `validate_slab(slab) -> bool`

- [ ] **Step 1: Test that only Comparator/Audit-backed evidence can become verified facts.**
- [ ] **Step 2: Implement project-scoped slabs with provenance and evidence references.**
- [ ] **Step 3: Test read-back and rejection of unverified facts.**
- [ ] **Step 4: Commit:** `feat: add evidence-backed project memory slabs`.

### Task 7: Build the local model registry and Gabby router

**Files:**
- Create: `core/model_registry.py`
- Create: `core/model_router.py`
- Create: `adapters/local_models.py`
- Create: `tests/test_model_registry.py`

**Interfaces:**
- `discover_runtimes() -> list[RuntimeObservation]`
- `discover_models(runtime) -> list[ModelObservation]`
- `route(intent, registry) -> ModelSelection`

- [ ] **Step 1: Add tests for no-runtime, discovered-runtime, unavailable-model, and verified-capability routing.**
- [ ] **Step 2: Implement probes for installed local runtimes such as Ollama and LM Studio only when actually detectable.**
- [ ] **Step 3: Add capability probes rather than claiming capabilities from model names alone.**
- [ ] **Step 4: Route Gabby to the best verified available local/remote model for the task; otherwise return `UNVERIFIED`/`BLOCKED`.**
- [ ] **Step 5: Commit:** `feat: add evidence-backed local model registry`.

### Task 8: Create the provider-neutral integration registry

**Files:**
- Modify: `config/integration-registry.json`
- Create: `adapters/registry.py`
- Create: `tests/test_integration_registry.py`

**Interfaces:**
- `register_provider(manifest) -> None`
- `discover_provider(provider_id) -> Observation`
- `audit_provider(provider_id) -> VerificationResult`

**Provider families:** GitHub, Vercel, Replit, Google Cloud, AWS, Azure, DigitalOcean, Shopify, Stripe, PayPal, Supabase, OpenAI, Google AI/Gemini, Hugging Face, Blender, Unreal, Tripo, Flutter, Lovable, Base44, Bolt, Figma, Canva, Meta, Microsoft, Google Analytics, and other services added through manifests.

- [ ] **Step 1: Add registry tests proving unknown providers remain `DISCOVERED`/`UNVERIFIED` rather than green.**
- [ ] **Step 2: Define provider manifests without embedding secrets.**
- [ ] **Step 3: Implement adapter discovery and capability declarations.**
- [ ] **Step 4: Verify one provider at a time using real credentials supplied by the owner.**
- [ ] **Step 5: Commit:** `feat: add provider-neutral integration registry`.

### Task 9: Build the simple luxury terminal UI

**Files:**
- Modify: `docs/APEX_TERMINAL_UIUX_SPEC.md`
- Create: `ui/` application shell using the repository's established web stack
- Create: `tests/ui/` for state-rendering behavior

**Interfaces:**
- `TerminalState` consumes real adapter/comparator/audit events.
- UI never invents service state.

- [ ] **Step 1: Test rendering for VERIFIED, FAILED, BLOCKED, and UNVERIFIED.**
- [ ] **Step 2: Implement the minimal shell: workspace tabs, Gabby command bar, active workspace, artifact/evidence panel, and bottom telemetry.**
- [ ] **Step 3: Implement the human-readable error format: what happened → why → next action → technical details on demand.**
- [ ] **Step 4: Verify keyboard/touch navigation and responsive local use.**
- [ ] **Step 5: Commit:** `feat: add simple evidence-driven terminal UI`.

### Task 10: Add real-time bus and execution telemetry

**Files:**
- Create: `core/bus.py`
- Create: `core/execution.py`
- Create: `tests/test_bus.py`
- Modify: UI telemetry components

**Interfaces:**
- `publish(topic, message) -> execution_id`
- `subscribe(topic, handler) -> None`
- `execute_command(command_packet) -> VerificationResult`

- [ ] **Step 1: Test command/evidence/audit event ordering and execution ID continuity.**
- [ ] **Step 2: Implement deterministic in-process bus first; add remote transport only behind the same contract.**
- [ ] **Step 3: Surface live execution events in the UI without claiming success before verification.**
- [ ] **Step 4: Commit:** `feat: add execution bus and telemetry`.

### Task 11: Add 3D adapters as real capability bridges

**Files:**
- Create: `adapters/blender.py`
- Create: `adapters/unreal.py`
- Create: `adapters/tripo.py`
- Create: `tests/test_3d_adapters.py`
- Modify: `config/integration-registry.json`

- [ ] **Step 1: Add tests for unavailable tools, successful invocation, artifact capture, and failed verification.**
- [ ] **Step 2: Implement Blender process/CLI discovery and controlled execution.**
- [ ] **Step 3: Implement Unreal project/tool discovery and controlled editor/command-line execution.**
- [ ] **Step 4: Implement Tripo as an API adapter only when credentials/access are supplied; otherwise report `BLOCKED` or `UNVERIFIED`.**
- [ ] **Step 5: Verify the first real 3D artifact chain and record hashes/metadata.**
- [ ] **Step 6: Commit:** `feat: add verified 3d engine adapters`.

### Task 12: Add artifact integrity and 4K verification tooling

**Files:**
- Create: `core/artifacts.py`
- Create: `core/media_verify.py`
- Create: `tests/test_artifacts.py`

- [ ] **Step 1: Test SHA-256 read-back, metadata capture, and artifact identity.**
- [ ] **Step 2: Implement artifact registration with file hash, size, MIME/container, duration/frame metadata where applicable.**
- [ ] **Step 3: Add optional perceptual-hash checks for visual artifacts.**
- [ ] **Step 4: Keep hashing out of the 60-FPS critical render path unless integrity/debug mode is explicitly enabled.**
- [ ] **Step 5: Commit:** `feat: add artifact integrity verification`.

### Task 13: Add cloud and source-control adapters

**Files:**
- Create: `adapters/github.py`
- Create: `adapters/vercel.py`
- Create: `adapters/cloud.py`
- Create: `tests/test_cloud_adapters.py`

- [ ] **Step 1: Test authentication-missing behavior and safe credential handling.**
- [ ] **Step 2: Implement GitHub repository read-back and commit observation.**
- [ ] **Step 3: Implement Vercel project/deployment observation.**
- [ ] **Step 4: Implement provider-neutral cloud job/storage observation for GCP/AWS/Azure/DigitalOcean.**
- [ ] **Step 5: Verify each provider only with actual owner credentials and record evidence.**
- [ ] **Step 6: Commit:** `feat: add source and cloud adapters`.

### Task 14: Add payment and business-service adapters

**Files:**
- Create: `adapters/stripe.py`
- Create: `adapters/paypal.py`
- Create: `adapters/shopify.py`
- Create: `tests/test_business_adapters.py`

- [ ] **Step 1: Test no-credential and unauthorized states.**
- [ ] **Step 2: Implement safe account/project metadata verification without exposing secrets.**
- [ ] **Step 3: Implement read-only verification first; write actions require explicit command authorization and a successful preflight.**
- [ ] **Step 4: Verify actual connected accounts when credentials are available.**
- [ ] **Step 5: Commit:** `feat: add business-service adapters`.

### Task 15: Add Google AI Studio build contract

**Files:**
- Modify: `docs/GOOGLE_AI_STUDIO_BUILD_PROMPT.md`
- Create: `docs/APEX_TERMINAL_GOOGLE_AI_STUDIO_HANDOFF.md`

- [ ] **Step 1: Make the build prompt explicitly consume repository specs rather than inventing architecture.**
- [ ] **Step 2: Require Google AI Studio output to preserve adapter/comparator/audit contracts.**
- [ ] **Step 3: Require generated UI to map only to real repository capabilities.**
- [ ] **Step 4: Commit:** `docs: lock Google AI Studio handoff contract`.

### Task 16: Continuous verification and CI

**Files:**
- Create: `.github/workflows/apex-verification.yml`
- Create: `scripts/verify_apex.py`
- Modify: `README.md`

- [ ] **Step 1: Add CI tests for comparator, protocol, ledger, model registry, and adapter contracts.**
- [ ] **Step 2: Add a machine-readable verification report.**
- [ ] **Step 3: Fail CI on tests that regress the no-fake-green invariant.**
- [ ] **Step 4: Update README with exact commands and truth-state semantics.**
- [ ] **Step 5: Commit:** `ci: enforce Apex verification gates`.

### Task 17: Final first-proof run

**Files:**
- No new source files unless a failing test requires one.

- [ ] **Step 1: Run the complete Python test suite.**
- [ ] **Step 2: Run the real `SYSTEM_STATUS` operation.**
- [ ] **Step 3: Read back the audit ledger and verify the hash chain.**
- [ ] **Step 4: Confirm the UI displays the exact observed result.**
- [ ] **Step 5: Record only successful evidence-backed facts in the project Memory Slab.**
- [ ] **Step 6: Commit:** `chore: record first end-to-end verification evidence`.

## Verification Standard

The project is never globally marked VERIFIED merely because files exist. Each capability is independently classified as `DISCOVERED`, `AVAILABLE`, `AUTHORIZED`, `CONNECTED`, `RUNNING`, `TESTED`, `VERIFIED`, `BLOCKED`, `FAILED`, or `UNVERIFIED`. The UI, Memory Slab, and audit ledger must derive their state from observed execution evidence.

## Expected immediate result

After the first execution batch, the repository should have a working local verification core even if external providers are unavailable. Missing credentials, missing binaries, or unavailable services are recorded explicitly and do not block the local core from being tested.
