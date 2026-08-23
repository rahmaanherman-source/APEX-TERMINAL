# APEX 2026 Connector + Sketchpad Expansion

## Purpose

This document records newly supplied implementation requirements and the exact repository locations where they belong. It does not promote provider support, registry membership, SDK presence, or configuration into VERIFIED status.

## Newly added implementation

### Google AI Studio / Gemini

Implementation:
- `src/connectors/google-ai-studio.ts`

Contract:
- Uses `@google/genai` Interactions API.
- Reads `GEMINI_API_KEY` or `GOOGLE_API_KEY` from the server environment.
- Missing credentials return `NOT_CONFIGURED`.
- A credential does not itself produce `CONNECTED` or `HEALTHY`.
- `ping()` performs a real inference request and requires non-empty readback before returning `HEALTHY`.
- Request failures return `FAILED` through the probe result and are never converted into green status.

The dependency is not yet installed merely by adding this adapter. The existing repository currently contains the older `@google/generative-ai` dependency in `package.json`; upgrading/installing `@google/genai` is a separate dependency change that must be verified in the repository build.

## Existing connector registry

`config/integration-registry.json` already contains `google-ai-studio` as an AI provider. That registry entry means APEX knows the capability exists; it does **not** mean the provider is connected or tested. The registry itself explicitly states that registration never implies connection, testing, or verification.

## Still required — not claimed complete

### Stripe MCP

Required implementation locations:
- connector registry: `config/integration-registry.json`
- new server-side adapter: `src/connectors/stripe-mcp.ts`
- provider-specific verification evidence: under the existing verification/evidence contract

Do not mark Stripe MCP CONNECTED until a real supported connection/capability probe succeeds.

### Shopify UCP

Required implementation locations:
- connector registry: `config/integration-registry.json`
- new server-side adapter: `src/connectors/shopify-ucp.ts`
- provider-specific verification evidence: under the existing verification/evidence contract

Do not mark Shopify UCP CONNECTED until a real supported connection/capability probe succeeds.

### Unified Sketchpad

Required implementation area:
- existing APEX Terminal workspace/application shell
- existing reference and visual-preservation specifications

Required capabilities:
- addressable workspace regions
- drag/reorder
- resize
- add/remove supported regions
- scripted/configurable regions
- virtualization for large collections (target 200+ items)
- persistence of layout state

This remains an implementation target until the repository contains the actual runtime behavior and automated/browser verification proving it.

## Truth rule

Use the following distinction everywhere:

`SUPPORTED != CONFIGURED != CONNECTED != HEALTHY != FUNCTIONALLY VERIFIED != PRODUCTION READY`

Provider registry membership and installed SDKs are capability evidence only. They are not runtime evidence.
