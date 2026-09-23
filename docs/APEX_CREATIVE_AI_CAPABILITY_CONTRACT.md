# APEX Creative AI Capability Contract

## Purpose

Creative AI is modeled as a set of testable capabilities behind replaceable provider adapters. A provider is never the architecture.

## Capability families

- IMAGE_GENERATION
- IMAGE_EDITING
- IMAGE_TEXT_RENDERING
- IMAGE_ANALYSIS
- IMAGE_TO_VIDEO
- VIDEO_GENERATION
- VIDEO_ANALYSIS
- TTS
- VOICE_STYLE
- VOICE_CLONING
- 3D_GENERATION
- 3D_INTERACTIVE_EXPERIENCE

## Create versus Edit

CREATE starts from a prompt/specification.

EDIT requires an explicit source asset and a mutation contract. The implementation records what should change and what should remain stable.

Example:

    {
      "operation": "EDIT",
      "source_asset": "asset-ref",
      "instruction": "change the subject",
      "preserve": ["composition", "lighting", "perspective", "background"]
    }

A newly generated image is not automatically considered an edit of the source.

## Text-bearing visual verification

When an output contains important text:

1. Generate the asset.
2. Extract visible text with OCR/text analysis.
3. Compare against requested text.
4. Check spelling, accents, numbers, labels, names, and language.
5. Perform visual review.
6. Record VERIFIED, REVIEW, or FAILED.

Visual plausibility alone cannot produce VERIFIED.

## Media transformation

Image-to-video and video generation use the same adapter contract but add media validation:

- container/codec
- dimensions
- duration
- playback
- requested scene/motion
- audio where applicable
- provenance

## Voice

TTS and expressive voice generation expose structured controls such as:

- language
- voice reference/profile
- style
- emotion
- intensity
- delivery
- timing

Voice cloning requires explicit authorization and provider-specific consent controls.

## Canonical result

Every adapter returns a canonical result containing:

- capability
- provider
- operation
- status
- output reference
- evidence reference
- timestamp

Adapter output is evidence. The deterministic Comparator and Verify Gate own VERIFIED.

## Provider substitution

The provider endpoint may change without changing the APEX capability contract:

APEX Capability -> Adapter -> Provider

This keeps the UI, routing, audit trail, and verification layer provider-independent.

## Truth boundary

Registration is not connection.

Connection is not testing.

Testing is not verification.

A provider or promotional claim about credits, pricing, model quality, or availability remains unverified until APEX has current evidence.
