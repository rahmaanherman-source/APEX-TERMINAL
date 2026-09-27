# APEX MCP TRUST GATEWAY
## Architecture Contract v1.0 — 2026-09-27

Status: DESIGN/CANONICAL — gateway runtime is not claimed operational by this document.

## Purpose

Provide a security boundary between APEX agents and MCP servers.

Default rule:

AGENT → ARBITRARY MCP = DENIED

Authorized flow:

AGENT → APEX MCP TRUST GATEWAY → TRUST/POLICY CHECK → APPROVED MCP → TOOL

## Responsibilities

1. Discover MCP servers.
2. Register server identity.
3. Record owner/source/version.
4. Enumerate exposed capabilities.
5. Apply allowlists.
6. Authenticate where required.
7. Authorize each tool/action.
8. Validate inputs and outputs.
9. Isolate credentials.
10. Apply rate limits.
11. Monitor runtime behavior.
12. Record immutable audit events.
13. Support revocation.
14. Track stale security reviews.
15. Prevent unauthorized server substitution.

## Trust states

UNKNOWN
UNTRUSTED
DISCOVERED
REGISTERED
REVIEW_REQUIRED
AUTHORIZED
ACTIVE
STALE
REVOKED
BLOCKED
COMPROMISED

## Server record

Required:
- mcp_server_id
- name
- owner
- source
- version
- endpoint
- capabilities
- authentication_mode
- credential_ref
- workspace_scope
- allowed_agents
- security_review
- last_tested_at
- status

Do not store raw credentials in the server record.

## Curated catalogs

Curated MCP catalogs are discovery inputs only.

Catalog entry:
CURATED ≠ TRUSTED ≠ AUTHORIZED

APEX must perform its own policy and security evaluation before use.

## Runtime enforcement

The gateway must block:
- unregistered server
- revoked server
- unauthorized tool
- unauthorized capability
- invalid credential
- policy violation
- disallowed destination
- configured rate-limit violation

## Verification

Successful MCP connectivity is not proof of security.

Gateway states must distinguish:
CONNECTED
CAPABILITY_PROBED
TESTED
AUTHORIZED
PRODUCTION_READY

## Audit

Record:
- server selected
- authorization decision
- tool requested
- policy applied
- credential reference
- execution result
- blocked attempts
- anomalies
- revocation
- security review state

## Security principle

The model may request a tool.

The model does not decide whether the tool is trusted.

The gateway decides.
