# APEX Repository Execution Mode

This document is the local APEX_BUILDER_OS reference for working on the APEX/Godspeed repository.

## Operating Mode

Use the current repository as the source of truth. Inspect the existing repository before making changes, preserve working functionality, identify existing capabilities, and do not create duplicates.

The required lifecycle is:

**REMEMBER → DEFINE → EXECUTE → READ BACK → COMPARE → VERIFY → AUDIT → REMEMBER**

Use this implementation loop:

1. Inspect the repository structure, framework, package manager, entry points, components, backend services, environment configuration, tests, and integrations.
2. Create a concise plan covering files, dependencies, architecture, provider integrations, Vault/Gatekeeper boundaries, tests, and verification.
3. Implement the plan directly in the repository.
4. Read back the resulting files and compare them against the requested behavior.
5. Install dependencies only when required.
6. Run typecheck, lint, tests, and the production build where available.
7. Start the application and test critical user flows.
8. Test provider failures, missing credentials, and Vault/Gatekeeper boundaries.
9. Fix failures and repeat verification.

## Product Scope

APEX Terminal may include:

- APEX Terminal shell
- 3D Creation Studio
- Character, World, Animation, and Render workflows
- Gabby
- Truth Gate
- Audit Log
- Capability Registry
- Provider Registry
- Vault
- Gatekeeper
- Provider adapters and execution paths
- Persistence, testing, and deployment configuration

## Security Rules

Raw keys, passwords, tokens, and credentials must never enter React state, prompts, logs, screenshots, Git, generated frontend code, or the integration registry.

Use this boundary:

**Vault → credentialRef → Gatekeeper → provider executor**

Provider adapters must expose explicit contracts and honest lifecycle states:

- Adapter mounted does not mean connected.
- Connected does not mean verified.
- Verified requires actual evidence from a real check or execution.

## Truthfulness Rules

Do not fabricate API responses, telemetry, deployment success, provider connections, AI execution, 8K rendering, autonomous-agent activity, or any other green status. Registration alone never implies connection, testing, or verification. Report blocked and failed states explicitly.

## Required Final Report

Report only the actual repository state:

```text
IMPLEMENTED:
...

TESTED:
...

VERIFIED:
...

FAILED:
...

BLOCKED:
...

NEXT EXECUTION:
...
```

Do not claim completion until the repository passes the relevant verification steps.

## Local-First Policy

Keep the working source code in the local project directory. Prefer local and open-source or included tools over paid cloud services. Treat cloud integrations as optional. Never purchase, subscribe, upgrade, deploy, force-push, reset Git, delete the project, overwrite unrelated files, or expose credentials without explicit approval.

## Naming

Prefer human-readable names such as APEX, APEX Engine, Godspeed, Store, Website, Backend, Frontend, Local Development, and Archive. Do not rename existing files blindly; inspect and recommend safe naming first.
