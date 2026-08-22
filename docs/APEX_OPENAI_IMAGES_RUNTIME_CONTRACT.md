# APEX Terminal — OpenAI Images Runtime Contract

**Status:** Source-ingested integration contract
**Canonical reference:** `Apex-Hub/docs/canonical/APEX_OPENAI_IMAGES_API_REFERENCE_2026-08-22.md`

## Runtime responsibility

APEX Terminal may orchestrate approved OpenAI image generation/editing capabilities through the governed runtime. It must not present documentation-only capability as live execution.

Supported candidate routes from the canonical reference:

- `POST /images/generations` — image generation
- `POST /images/edits` — image editing/reference/masking
- `POST /images/variations` — legacy DALL-E 2 variation path

## Runtime ladder

```text
REQUEST
→ CAPABILITY CHECK
→ AUTHORIZATION
→ PROVIDER CALL
→ ARTIFACT RETURN
→ READ-BACK / VALIDATION
→ RUNTIME STATUS
→ VERSION / PROVENANCE
```

## Character Studio

The Character Studio may use image generation, reference images, masked edits, transparent outputs, and streaming previews where the corresponding capability is configured and tested.

A generated image is an artifact. It is not automatically a verified character state or production-ready asset.

## Streaming

When streaming is configured, handle:

- `image_generation.partial_image`
- `image_generation.completed`
- `image_edit.partial_image`
- `image_edit.completed`

Partial output is preview state, not final verification.

## No-fake-green

Terminal UI must distinguish:

`DOCUMENTED → CONFIGURED → CONNECTED → EXECUTED → TESTED → VERIFIED`

Never display `VERIFIED` solely because the API documentation exists.
