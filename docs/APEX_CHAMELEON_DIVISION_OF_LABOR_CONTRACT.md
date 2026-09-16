# APEX CHAMELEON™ — Division of Labor Contract

**Status:** Canonical operating contract  
**Purpose:** Coordinate multiple AI/build agents as one production line.  
**Repository:** APEX-TERMINAL

## 1. Core Law

APEX Chameleon is a **division-of-labor protocol**, not a collection of isolated assistants.

Every agent receives the shared mission, shared repository context, shared constraints, and shared definition of done. Each agent owns a specific station in the production line.

**We do not stop the line to rediscover work another station already owns.**

The work moves:

**INTAKE → STATION A → STATION B → STATION C → TEST → RELEASE**

Each station adds its required piece, preserves what previous stations produced, and passes the complete package forward.

## 2. Shared Goal

All agents work toward the same outcome:

- inspect existing work first
- reuse existing code and architecture
- perform the work assigned to their station
- inspect adjacent work enough to preserve interfaces
- fix safe, obvious defects in their lane
- test their work
- pass evidence forward
- do not claim completion without evidence
- do not block the production line with unnecessary approval questions

## 3. No-Reset Rule

An agent MUST NOT:

- restart the project from zero
- replace working architecture merely because it prefers another pattern
- duplicate an existing subsystem
- remove another station's work without a technical reason
- ask the user to re-explain information already present in the repository
- turn every implementation detail into a user approval request

If a decision is safely inferable from the repository and contract, **make the decision and continue**.

If a genuine cross-boundary dependency exists, document it and continue with everything else that can safely be completed.

## 4. Station Ownership

### Station A — FRONTEND / VISUAL / UX

**Primary agent:** Grok or another designated frontend agent.

Owns:

- visual design system
- layout
- responsive behavior
- interaction design
- frontend components
- upload/drop experience
- mapping-review interface
- validation interface
- progress states
- generated-file interface
- accessibility and frontend polish

Does NOT own:

- backend architecture
- database authority
- secrets
- AI-processing architecture
- canonical data rules
- destination validation authority

### Station B — APPLICATION ENGINE / AI / DATA

**Primary agent:** Google AI Studio / Gemini or another designated application-engine agent.

Owns:

- ingestion
- parsing
- normalization
- canonical product model
- AI field mapping
- destination schema adapters
- variant preservation
- image/asset processing
- CSV/XLSX generation
- bulk/chunk processing
- deterministic validation
- reconciliation
- API contracts
- server-side secrets
- authorization
- application tests
- performance and reliability

Does NOT own:

- unilateral visual redesign
- removal of frontend behavior that satisfies the contract
- replacing the frontend design system merely by preference

### Station C — REPOSITORY / INTEGRATION / RELEASE

**Primary authority:** GitHub repository and CI.

Owns:

- source-of-truth code history
- branch integrity
- integration
- automated tests
- build verification
- merge/release readiness
- preservation of changes from every station

No provider is the permanent owner of APEX.

Grok, Gemini, Base44, Cloudflare, Vercel, Firebase, Supabase, or any other provider is an implementation tool unless explicitly designated otherwise.

## 5. Shared Contract

All stations communicate through explicit interfaces:

- files
- APIs
- types/interfaces
- schema definitions
- tests
- documented contracts

The frontend consumes the application contract.

The application engine serves the application contract.

Neither side needs to continuously ask the user what the other side already specifies.

## 6. GitHub Rule

GitHub is the shared workbench and source of truth.

Every agent must:

1. Pull/inspect current repository state.
2. Identify existing relevant implementation.
3. Reuse before recreating.
4. Make scoped changes.
5. Test.
6. Record meaningful changes.
7. Leave the repository in a state another station can continue from.

## 7. Chameleon Handoff

Every handoff contains:

**INPUT**
- what was received

**WORK**
- what this station changed

**CONTRACT**
- interfaces another station must preserve

**TEST EVIDENCE**
- what was actually tested

**REMAINING**
- only genuine unresolved dependencies

The handoff must not become a new planning meeting.

## 8. Autonomous Execution Rule

The user should not have to approve routine engineering decisions repeatedly.

Agents should:

**Inspect → Decide within lane → Build → Test → Fix → Retest → Handoff**

Ask only when:

- the requested behavior is genuinely ambiguous AND
- choosing incorrectly could materially change the product, security, data, cost, or user intent.

Otherwise continue.

## 9. Truth Gate

A generated artifact is not VERIFIED merely because it exists.

Verification requires evidence appropriate to the artifact.

For application code:

- build succeeds
- relevant tests pass
- critical paths are exercised
- known errors are resolved or explicitly recorded

For catalog output:

- schema validation passes
- source/output counts reconcile
- variants reconcile
- required fields pass
- duplicate/conflicting identifiers are detected
- assets are accounted for

## 10. Scope Discipline

Universal Catalog Mapper has one product purpose:

> **Transform a source product catalog into a validated destination-ready catalog package.**

Do not add unrelated:

- CRM
- accounting
- marketing automation
- social management
- storefront builder
- unrelated analytics
- unrelated AI tools
- unnecessary dashboards

A useful feature must directly improve catalog ingestion, mapping, validation, generation, delivery, or the user experience of those functions.

## 11. Security Rule

Security is a shared responsibility.

Any agent that touches a security boundary must:

- keep secrets server-side
- never expose API keys in frontend code
- validate uploads
- enforce file/payload limits
- prevent path traversal
- avoid executing uploaded files
- enforce authorization where required
- use least privilege
- avoid logging secrets
- test failure paths

## 12. Performance Rule

The system must be designed for real bulk work.

10,000 products is a normal supported workload, not an exceptional demonstration.

Use:

- chunking
- streaming where appropriate
- bounded memory
- retryable jobs
- progress reporting
- deterministic processing

Do not add infrastructure merely for theoretical scale.

## 13. Provider Cooperation Rule

Different AI providers are allowed to specialize.

One provider may be better at visual generation.
Another may be better at application engineering.
Another may be useful for research.

That is not fragmentation.

**APEX Chameleon turns specialization into a production line.**

Each agent knows:

> **This is my station. This is your station. We share the same box. Put your piece in, preserve the pieces already there, and pass the box forward.**

## 14. Definition of Done

A feature is complete only when:

1. The correct station implemented it.
2. Existing compatible work was preserved.
3. Interfaces are coherent.
4. Tests/build were run.
5. Failures were fixed where safely possible.
6. Remaining blockers are explicit.
7. No unsupported completion claim is made.

---

**APEX CHAMELEON™**

**One mission. One repository. Specialized stations. Continuous handoff. No unnecessary stops.**
