# APEX Desktop Vault — Settled Architecture Report

> **Status: ARCHITECTURE SETTLED — IMPLEMENTATION TO FOLLOW EVIDENCE GATES**
>
> This document settles the intended architecture for the APEX local Desktop Vault, Gatekeeper, credential organization, URL organization, and five-person operating team.

## 1. Decision

Yes. The APEX Vault can be built as a **local-first desktop security application** whose primary job is to protect, organize, resolve, and audit credentials and connection metadata on the user's own computer.

The Vault is not a general-purpose password dump and it is not a cloud database pretending to be local. Its core responsibility is:

**STORE → CLASSIFY → PROTECT → AUTHORIZE → RESOLVE JUST-IN-TIME → HAND OFF → READ BACK → AUDIT**

The desktop application becomes the local security boundary. **Gatekeeper remains the authorization/control boundary.** APEX applications and executors do not receive unrestricted access to the Vault.

## 2. Critical biometric rule

A person's existing desktop biometric system can be used as an **unlock/authentication factor** where the operating system provides a supported secure credential API.

APEX should **not collect, copy, or maintain raw fingerprints, face scans, or biometric templates**. The operating system's secure authentication mechanism should answer whether the authorized local user successfully authenticated. APEX then unlocks the appropriate encrypted key material for the authorized session.

Conceptually:

`USER → OS BIOMETRIC / SECURE AUTH → LOCAL VAULT UNLOCK → GATEKEEPER → AUTHORIZED ACTION`

The biometric is therefore an **authentication signal**, not a secret that APEX stores.

## 3. Desktop Vault responsibilities

The Vault stores encrypted records such as:

- API keys
- OAuth refresh/access credentials where policy permits local storage
- service tokens
- SSH credentials and references
- webhook secrets
- signing credentials/references
- provider/project identifiers
- environment labels
- URLs and endpoints
- login/connection metadata
- scopes and permission metadata
- credential ownership
- expiration/rotation dates
- verification state
- last successful read-back
- source/provenance
- audit references

### Never expose secrets merely because a user can see a record

The default UI shows metadata first. Secret material is resolved only for an authorized operation and only at the execution boundary.

## 4. Gatekeeper relationship

The canonical path remains:

`APEX APP → GABBY / COMMAND → VAULT credentialRef → GATEKEEPER → AUTHORIZED EXECUTOR → PROVIDER → RESULT → EVIDENCE → TRUTH GATE`

Gatekeeper validates:

- local user identity/session
- credential reference
- provider
- project/environment
- requested action
- permission
- scope
- authorization policy
- credential status
- expiration/rotation requirements
- execution destination

Only after those checks should the actual secret be resolved.

The Vault therefore **does not become an unrestricted credential dispenser**.

## 5. URL + credential organization

The user's idea of a mailbox/box is adopted as the organizing metaphor, but the implementation should be structured data rather than an actual email mailbox.

### APEX Vault Box

Each connection is represented as a **Vault Box** containing:

```text
VAULT BOX
├── Identity
│   ├── Name
│   ├── Provider
│   ├── Owner
│   └── Team access
├── Connection
│   ├── URL
│   ├── Endpoint
│   ├── Environment
│   └── Project
├── Credential
│   ├── Type
│   ├── Credential reference
│   ├── Scope
│   └── Expiration
├── Verification
│   ├── Connection state
│   ├── Capability state
│   ├── Last read-back
│   └── Truth state
├── Operations
│   ├── Last used
│   ├── Rotation history
│   └── Audit history
└── Policy
    ├── Allowed users
    ├── Allowed applications
    ├── Allowed actions
    └── Allowed environments
```

Examples of boxes:

- `GitHub / APEX-TERMINAL / Production`
- `Vercel / APEX Hub / Production`
- `Stripe / APEX Payments / Production`
- `Shopify / Store / Production`
- `Supabase / APEX / Production`
- `OpenAI / APEX Gabby / Production`

A single provider may therefore have multiple boxes rather than one ambiguous credential record.

## 6. Five-person team model

The initial application can support **five named team members** immediately.

Each person receives an individual local identity and authorization profile. Access is policy-driven; nobody shares another person's master credential.

Example roles:

| Role | Primary responsibility | Secret access |
|---|---|---|
| Owner | System authority / final approval | Policy-controlled |
| Gatekeeper Admin | Authorization + connection policy | Policy-controlled |
| Operator | Approved execution workflows | Just-in-time only |
| Builder | Development/integration work | Environment-scoped |
| Auditor | Verification/evidence review | Metadata + approved evidence |

The exact names can be assigned later, but the **five-seat architecture is fixed as the initial team capacity**.

## 7. Local-first key architecture

The Vault should use layered encryption rather than relying on a plain local database.

Recommended structure:

`OS Secure Credential / Keychain`
→ protects
`Vault Master Key`
→ protects
`encrypted Vault database`
→ contains
`credential records + encrypted secret material`

Where the platform supports a hardware-backed secure enclave/keystore, APEX should use it through the operating system API rather than implementing its own biometric storage.

### Session behavior

1. User opens APEX Vault.
2. OS authentication is requested.
3. Successful authentication authorizes local Vault unlock.
4. Vault decrypts only the required key material.
5. Gatekeeper evaluates the requested operation.
6. Authorized executor receives the minimum required secret for the shortest practical lifetime.
7. Secret material is not displayed or copied unless explicitly authorized.
8. Operation produces read-back evidence.
9. Session/key material is cleared or locked when the policy requires it.

## 8. Local does not mean invisible

The Vault remains auditable.

Every sensitive operation should create an evidence record containing metadata such as:

- who requested it
- what application requested it
- what Vault Box was referenced
- what action was requested
- what authorization decision occurred
- when it occurred
- which environment was targeted
- whether the provider responded
- what verification/read-back occurred
- resulting Truth state

The audit record should not contain the raw secret.

## 9. URL organizer / connection directory

The desktop Vault should also function as APEX's **connection directory**.

A URL is never just a URL. APEX should associate it with:

`URL → provider → service → project → environment → credentialRef → permissions → verification → truth`

This allows the user to search by:

- service
- provider
- project
- environment
- URL
- credential type
- team member
- status
- expiration
- verification state
- application

This directly supports Bolt Connect's requirement that the system know **what provider, project, credential type, scope, and permissions** a connection actually needs.

## 10. Connection lifecycle

A Vault Box should move through explicit states:

`DISCOVERED → CONFIGURED → CREDENTIAL_PRESENT → CAPABILITY_PROBED → CONNECTED → TESTED → VERIFIED`

Failures must remain visible:

`BLOCKED / UNAVAILABLE / REQUIRES_CONFIGURATION / CONNECTED_NOT_VERIFIED / STALE / FAILED`

APEX must never convert “credential exists” into “service works.”

## 11. Desktop application shape

The first app should be deliberately focused.

### Primary navigation

```text
APEX VAULT

[ BOXES ] [ CONNECTIONS ] [ CREDENTIALS ] [ TEAM ] [ AUDIT ] [ SETTINGS ]

                 VAULT BOXES

 Search........................................

 ┌────────────────────────────────────────────┐
 │ GitHub · APEX-TERMINAL                     │
 │ URL  github.com/...                         │
 │ Production · VERIFIED                      │
 ├────────────────────────────────────────────┤
 │ Vercel · APEX Hub                           │
 │ URL  vercel.com/...                         │
 │ Production · CONNECTED                     │
 ├────────────────────────────────────────────┤
 │ Stripe · APEX Payments                      │
 │ URL  dashboard.stripe.com/...               │
 │ Production · REQUIRES_CONFIGURATION        │
 └────────────────────────────────────────────┘
```

Selecting a box reveals metadata and permitted actions. Secret values remain protected behind Gatekeeper authorization.

## 12. What this replaces

The purpose is to eliminate scattered credential handling across:

- browser notes
- text files
- random desktop folders
- environment-variable sprawl
- screenshots
- email messages
- copied tokens
- undocumented URLs
- team-member personal credential stores

APEX creates **one organized local security workspace** for the connections that APEX itself is authorized to operate.

## 13. What this does NOT mean

The Vault does not mean:

- APEX stores everyone's biometric data.
- Every employee can see every secret.
- A credential's presence proves connectivity.
- Local storage automatically makes a system secure.
- A desktop copy should be silently synchronized to arbitrary cloud storage.
- Gatekeeper can be bypassed by directly opening the Vault database.

The security model is intentionally the opposite: **local, encrypted, individually authorized, least-privilege, observable, and evidence-backed.**

## 14. Implementation boundary

The first implementation should be a **desktop Vault application**, not a full APEX replacement.

Recommended components:

```text
APEX VAULT DESKTOP
│
├── Local UI
├── OS Authentication Adapter
├── Vault Encryption Layer
├── Vault Box Database
├── Credential Resolver
├── Gatekeeper Client
├── URL / Connection Organizer
├── Five-Member Team Policy
├── Audit Ledger
└── Truth / Verification Reader
```

The application communicates with the existing APEX control plane through explicit interfaces. It does not duplicate the canonical CommandBus, Truth Gate, or lifecycle authority.

## 15. Security acceptance tests

Before calling the Vault production-ready, the implementation must demonstrate at minimum:

1. Unauthorized user cannot unlock the Vault.
2. Biometric authentication is delegated to the OS/platform secure authentication facility.
3. Raw biometric data is never persisted by APEX.
4. Vault database contents are encrypted at rest.
5. Individual users have distinct authorization policies.
6. Five team identities can be provisioned.
7. A user cannot retrieve a credential outside their allowed scope.
8. A credential reference can be resolved without exposing the secret to the UI.
9. Gatekeeper can deny an otherwise existing credential.
10. URL/provider/project/environment metadata remains searchable without decrypting every secret.
11. Credential use creates an audit event without storing the raw secret in the audit record.
12. A connection is not marked VERIFIED until an actual provider read-back succeeds.
13. Expired/stale credentials are visibly flagged.
14. Locking the Vault invalidates the active secret-access session.
15. A failed provider operation produces FAILED/UNAVAILABLE evidence rather than fake green.

## 16. Product decision

**SETTLED:** APEX should build the Vault as a **local desktop security and connection-organizing application**, using the computer's existing secure biometric authentication as an unlock factor, with Gatekeeper controlling authorization and just-in-time credential release.

The organizing object is the **Vault Box**: one structured, searchable container for a provider/service/project/environment, its URL/endpoints, credential reference, permissions, verification state, and audit history.

The first deployment target supports **five individual team identities**.

The Vault is local-first, encrypted, least-privilege, auditable, and connected to the existing APEX verification architecture.

## 17. Governing principle

**The Vault stores the authority. Gatekeeper decides whether authority may be used. The executor performs the action. The provider answers. The Truth Gate decides what actually happened.**

That is the architecture.

---

**APEX — We don't claim perfection. We claim APEX.**
