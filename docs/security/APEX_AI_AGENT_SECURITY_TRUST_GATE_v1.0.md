# APEX AI AGENT SECURITY & TRUST GATE
## Canonical Security Contract v1.0 — 2026-09-27

Status: DESIGN/CANONICAL — implementation and live runtime verification remain separate states.

## Purpose

This contract translates the APEX agent-security requirements into enforceable architecture. It covers custom-built agents, Gabby, provider adapters, tool use, MCP, memory, delegated actions, multi-agent workflows, generated code, runtime behavior, and evidence.

Core principle:

> Do not require the model to be perfectly trustworthy. Build the system so the model does not need to be the final security authority.

## Canonical flow

HUMAN / SYSTEM INTENT
→ AGENT IDENTITY
→ AGENCY CLASSIFICATION
→ SESSION + MEMORY GATE
→ CAPABILITY REQUEST
→ POLICY / AUTHORIZATION
→ CREDENTIAL GATE
→ INPUT TRUST GATE
→ MCP / TOOL TRUST GATE
→ SANDBOX WHEN REQUIRED
→ EXECUTE
→ RUNTIME DEFENSE
→ READ BACK
→ COMPARE
→ VERIFY
→ INDEPENDENT REVIEW WHEN REQUIRED
→ IMMUTABLE AUDIT
→ EVIDENCE / PERSISTENCE

A failed security gate produces BLOCKED or FAILED. It must never silently become VERIFIED.

## 1. Agency classification

A0 INFORMATIONAL — answers only.
A1 RECOMMENDATION — proposes actions without executing them.
A2 TOOL-ASSISTED — invokes approved tools under authorization.
A3 AUTHORIZED EXECUTION — changes systems/data.
A4 DELEGATED — acts explicitly on behalf of a human.
A5 MULTI-AGENT — delegates work to other agents.
A6 HIGH-IMPACT AUTONOMOUS — can independently cause consequential external effects.

Higher agency requires stronger authorization, containment, verification, and review.

## 2. Agent identity

Every deployed agent must have a distinct identity.

Required metadata:
- agent_id
- owner
- repository
- version
- environment
- agency_level
- capabilities
- credential references
- dependencies
- MCP/tool dependencies
- deployment reference
- last security review
- status

Agent identity is not equivalent to human identity.

## 3. Authorization

An agent cannot authorize itself, grant itself capabilities, or promote its own privilege.

Authorization evaluates at minimum:
- subject/agent
- action
- capability
- resource
- purpose
- workspace
- session
- data classification
- environment
- agency level
- delegation context

Recommended decisions:
ALLOW
DENY
REQUIRE_HUMAN
REQUIRE_REVIEW
BLOCKED

Human on-behalf-of actions must retain explicit delegation context. Delegated agents do not automatically inherit all privileges of the delegator.

## 4. Credentials and Vault

Rules:
1. Do not reuse human credentials as the default agent credential.
2. Prefer workload identity or ephemeral credentials.
3. Secrets must not be hard-coded.
4. Secrets must not be committed to repositories.
5. Secrets must not enter model memory.
6. Store credential references, not raw credentials, in APEX state.
7. Resolve secrets through the Vault/Gatekeeper boundary.
8. Rotate credentials where the provider supports it.
9. Never expose raw credentials in browser UI, prompts, logs, or readbacks.

## 5. Memory security

Memory is a separate data-access surface.

Minimum classification:
PUBLIC
WORKSPACE
USER_PRIVATE
SESSION_PRIVATE
CONFIDENTIAL
RESTRICTED
SECRET

Required metadata:
- memory_id
- workspace_id
- session_id
- principal_id
- source/provenance
- classification
- retention policy
- expiry
- share scope
- verification state

Rules:
- User A memory must not become User B memory merely because an agent remembers it.
- Session memory must have explicit retention.
- Sensitive memory requires access-control evaluation.
- Secrets never enter model memory.
- Agent output cannot promote itself to canonical memory.
- Canonical memory requires provenance and applicable review/verification.

## 6. External content and prompt injection

External content is data, not authority.

Treat as UNTRUSTED_EXTERNAL_CONTENT unless independently authorized:
- email
- web pages
- PDFs
- documents
- customer messages
- OCR
- images
- database fields
- MCP responses
- tool output

A retrieved instruction does not automatically become:
- a system instruction
- an authorization
- a capability grant
- a policy change
- a deployment command

The enforcement boundary must exist outside the model.

## 7. MCP trust gateway

Direct agent → arbitrary MCP access is prohibited by default.

Canonical lifecycle:

DISCOVERED
→ REGISTERED
→ OWNER_IDENTIFIED
→ CAPABILITIES_ENUMERATED
→ SOURCE/VERSION_RECORDED
→ SECURITY_REVIEW
→ SANDBOX_TEST
→ AUTHORIZED
→ ACTIVE

Security states:
UNKNOWN
UNTRUSTED
REVIEW_REQUIRED
AUTHORIZED
BLOCKED
REVOKED
STALE
COMPROMISED

A curated MCP catalog is a discovery aid, not an authorization grant.

The APEX MCP Trust Gateway must enforce:
- identity
- server allowlist
- capability/tool allowlist
- authentication
- authorization
- input/output policy
- rate limits
- credential isolation
- version/trust state
- audit
- revocation
- behavioral monitoring

## 8. Tool and provider trust

Provider availability does not imply provider trust.

Provider lifecycle:
DISCOVERED
→ AVAILABLE
→ INSTALLED
→ CONFIGURED
→ CONNECTED
→ CAPABILITY_PROBED
→ TESTED
→ PRODUCTION_READY

A provider response is not VERIFIED merely because the provider returned HTTP success or content.

## 9. Logical policy enforcement

Human-oriented policy text is insufficient for autonomous agents.

Where feasible, convert policy into technical controls such as ABAC/PBAC:
- allowed resource
- allowed action
- allowed purpose
- allowed fields
- environment
- session
- principal
- agency level
- data classification

Example:
A support agent may read order status but not payment-card data.

## 10. Data loss prevention

Data classification must follow data through:
DATABASE → CONTEXT → MODEL → TOOL ARGUMENT → OUTPUT → MEMORY → ARTIFACT

AI agents can exfiltrate through text, code, images, audio, video, tool calls, API calls, memory, and MCP. Traditional DLP remains useful but is not sufficient by itself.

Minimize data supplied to agents and validate classification before external actions.

## 11. Runtime defense

Separate three responsibilities:

POLICY ENGINE — Is this action allowed?
RUNTIME DEFENSE — Is this behavior expected/suspicious?
VERIFIER — Did the requested result actually occur?

Runtime signals should include:
- prompt-injection indicators
- jailbreak indicators
- unauthorized tool selection
- MCP violations
- unusual API destinations
- unusual data access
- privilege escalation
- credential anomalies
- unusual action volume
- intent drift
- behavioral drift

Behavioral detection may produce false positives. Do not treat an anomaly detector as proof of maliciousness without evidence.

## 12. Intent drift

Compare observed execution against authorized intent.

Example:
REQUEST: create Shopify product.
EXPECTED: catalog read + product creation.
OBSERVED: catalog read + product creation + customer-data extraction + payment-setting modification.

Result:
INTENT_DRIFT_DETECTED

Policy may:
BLOCK
REQUIRE_HUMAN
or ALLOW_WITH_AUDIT

Unexpected behavior must not silently become accepted behavior.

## 13. Multi-agent segregation of duties

Agent A cannot automatically transfer its privileges to Agent B.

Delegation flow:
AGENT A
→ DELEGATION REQUEST
→ AUTHORIZATION ENGINE
→ CAPABILITY SUBSET
→ AGENT B

Agent-to-agent collaboration must preserve:
- distinct identity
- distinct authorization
- least privilege
- delegation provenance
- auditability
- segregation of duties

High-impact operations should not permit a chain of agents to approve their own privilege escalation.

## 14. Generated-code sandbox

AI-generated or AI-selected code must execute in a sandbox before production release where risk warrants.

Pipeline:
GENERATE
→ SANDBOX
→ BUILD
→ TEST
→ SECURITY CHECK
→ READ BACK
→ POLICY/HUMAN RELEASE
→ DEPLOY

Sandbox controls should constrain:
filesystem
network
credentials
process execution
host access
production APIs
deployment credentials

## 15. Security testing

APEX agent security testing must include:

AUTHORIZATION
- unauthorized capability
- privilege escalation
- credential reuse
- delegation abuse

MEMORY
- cross-user leakage
- retention failure
- unauthorized retrieval
- memory poisoning

INPUT
- indirect prompt injection
- malicious documents
- malicious email
- hostile web content
- poisoned MCP responses

TOOLS/MCP
- unauthorized tool
- unauthorized MCP
- wrong MCP selection
- parameter manipulation
- tool privilege escalation

MULTI-AGENT
- privilege inheritance
- unauthorized delegation
- collusion scenarios
- segregation-of-duties violations

RUNTIME
- intent drift
- behavioral drift
- unexpected API access
- unusual data access
- abnormal execution sequence

Testing should combine deterministic tests, peer review/maker-checker review, and automated adversarial testing.

## 16. Verification and review

Execution does not equal verification.

The executor cannot be the sole authority that approves its own result.

Where independent review is required:
executor_id != reviewer_id

Verification states:
VERIFIED
UNVERIFIED
FAILED
BLOCKED
STALE

Claim states:
SUPPORTED
REFUTED
UNKNOWN
CLAIMED

VERIFIED + REFUTED is valid and means the verification process verified that the claim failed.

## 17. Audit

Security-relevant events must be recorded in the append-only audit chain.

Events include:
- agent registered
- authorization granted/denied
- capability requested
- credential issued/retrieved
- MCP authorized/revoked
- job queued/started/completed/failed
- memory accessed/written/expired
- prompt injection detected
- intent drift detected
- runtime anomaly detected
- verification recorded/stale
- review signed/rejected
- edge invalidated
- workflow rooted
- artifact saved

Audit records must be tamper-evident and chained.

## 18. Security invariants

1. Agent cannot authorize itself.
2. Agent cannot grant itself capabilities.
3. Agent identity is distinct from human identity.
4. Human credentials are not default agent credentials.
5. Credentials are never stored in model memory.
6. Secrets are never committed to source control.
7. External content cannot become trusted instructions merely by retrieval.
8. MCP availability does not imply MCP trust.
9. Delegated agents do not automatically inherit all delegator privileges.
10. Agent output cannot self-promote to canonical truth.
11. Execution does not equal verification.
12. Verification does not equal authorization.
13. Security events are auditable.
14. Security evidence is tamper-evident.
15. Higher agency requires stronger controls.
16. Unexpected behavior cannot silently become accepted behavior.

## 19. Security metrics

Track:
- unauthorized attempts
- blocked actions
- prompt-injection detections
- memory-isolation violations
- MCP policy violations
- privilege-escalation attempts
- intent-drift events
- credential anomalies
- security-test failures
- mean time to remediate
- agents without owners
- agents with stale security reviews
- unregistered MCP servers
- unverified high-impact actions

Security control bypass rate:
attempted policy violations / total policy enforcement events

## 20. Evidence rule

Documentation, source code, registration, or configuration does not prove runtime security.

A control is:
DOCUMENTED when specified.
IMPLEMENTED when code exists.
TESTED when a real test executed.
OBSERVED when runtime evidence exists.
VERIFIED when the applicable APEX verification gate passes.

Never mark a security control GREEN without evidence.
