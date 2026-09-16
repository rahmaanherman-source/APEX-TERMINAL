# APEX FileForge

**Universal catalog-to-destination file builder.**

FileForge has one primary job: take a real structured product catalog, map it to the selected destination schema, validate it, and produce a destination-ready file/package.

## V1 destination
- Shopify

## Planned adapters
- Amazon
- TikTok Shop
- Syncee
- Other destinations with a documented import schema

## Core flow
UPLOAD → DESTINATION → MAP → VALIDATE → BUILD → DOWNLOAD

## Rules
- Never invent product facts.
- Distinguish source data, user-provided data, AI analysis, and estimates.
- Never report VERIFIED without deterministic validation evidence.
- Preserve products, variants, sizes, colors, prices, SKUs, identifiers, descriptions, inventory, and image references where present.
- Report missing or invalid fields instead of silently fabricating them.
- Support large catalogs and show progress plus a realistic ETA.
- Organize artifacts alphabetically, date-first, versioned, and traceable.
- Keep the core provider-neutral; AI providers are replaceable.
