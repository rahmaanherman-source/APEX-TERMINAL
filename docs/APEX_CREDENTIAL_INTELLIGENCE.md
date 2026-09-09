# APEX Credential Intelligence & Attribution Engine

## Purpose

This component is the focused credential-ingestion layer for the APEX local Vault. It is designed for messy real-world input such as a Notes dump containing many keys, tokens, URLs, labels, and credentials that may be adjacent or incorrectly labeled.

It does **not** assume that formatting or human labels are authoritative.

## Pipeline

`INGEST → SEPARATE → RECOGNIZE → ATTRIBUTE → RECONCILE → VERIFY → ORGANIZE`

- **Ingest:** accept pasted or imported text.
- **Separate:** identify individual credential candidates even when entries touch.
- **Recognize:** classify known credential formats.
- **Attribute:** infer provider/service from credential format and nearby context such as domains and labels.
- **Reconcile:** match candidates to existing Vault Box metadata (integration point to the Vault).
- **Verify:** remain UNVERIFIED until a Gatekeeper-authorized provider probe produces evidence.
- **Organize:** persist the credential reference in the correct Vault Box after policy approval.

## Truth boundary

Recognition is not verification. A high-confidence attribution means only that the available evidence strongly identifies the likely provider. It does not prove that the credential is valid, active, owned by the expected account, or authorized for an application.

The canonical execution path remains:

`Vault → credentialRef → Gatekeeper → Authorized Executor → Provider → Result → Evidence → Truth Gate`

## Secret handling

The engine returns only redacted values and short non-reversible fingerprints. It does not log or persist raw credential material. Provider authentication is intentionally outside this module.

## Current implementation

`credential_intelligence/engine.py` provides deterministic first-pass extraction and attribution for common provider credential formats, nearby provider URLs, application/project labels, and environment labels. It is deliberately provider-readback neutral so Gatekeeper remains the authorization boundary.

This is the focused component to reuse alongside the existing APEX Vault/Bootstrap architecture rather than creating a second Vault system.
