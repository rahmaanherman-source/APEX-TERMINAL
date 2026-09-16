# Universal Catalog Mapper Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a small, provider-neutral catalog mapper that ingests bulk product data, maps it to destination schemas, packages assets, and deterministically validates the result.

**Architecture:** A pure Python core owns parsing, normalization, mapping, packaging, and validation. Destination schema packs are data, not platform-specific business logic. A static single-page UI calls the core through a minimal HTTP API in a deployable reference server.

**Tech Stack:** Python 3.11+, standard library, optional openpyxl for XLSX, static HTML/CSS/JS.

**Spec:** `catalog-mapper/docs/UNIVERSAL_CATALOG_MAPPER_SPEC.md`

## Global Constraints

- Single purpose: catalog ingestion, mapping, packaging, validation.
- Never invent product data or variants.
- Images are first-class assets.
- Support 10,000+ products through streaming/chunking.
- `VERIFIED` only after deterministic validation passes.
- Destination implementations are schema packs/adapters.
- Core remains provider-neutral.

---

### Task 1: Core parser, canonical model, mapper, and validator

**Files:**
- Create: `catalog-mapper/catalog_mapper.py`
- Create: `catalog-mapper/tests/test_catalog_mapper.py`

**Interfaces:**
- `read_delimited(text: str) -> list[dict[str, str]]`
- `infer_mapping(source_headers: list[str], target_headers: list[str]) -> dict[str, str | None]`
- `canonicalize(rows: list[dict[str, str]], mapping: dict[str, str | None]) -> list[dict[str, object]]`
- `validate_records(records: list[dict[str, object]], required: list[str], allowed: dict[str, list[str]] | None = None) -> dict[str, object]`
- `generate_csv(rows: list[dict[str, object]], headers: list[str]) -> str`
- `chunk_rows(rows: list[dict[str, object]], max_bytes: int) -> list[list[dict[str, object]]]

- [ ] Write failing tests for header normalization, semantic mappings, missing required values, duplicate SKU detection, variant preservation, image fields, chunking, and round-trip CSV generation.
- [ ] Run `python -m unittest catalog-mapper/tests/test_catalog_mapper.py` and confirm failures.
- [ ] Implement minimal standard-library core.
- [ ] Run the same test command and confirm all tests pass.
- [ ] Commit with `feat: add catalog mapper core`.

### Task 2: Destination schema packs

**Files:**
- Create: `catalog-mapper/schemas/destinations.json`
- Create: `catalog-mapper/tests/test_schemas.py`

**Interfaces:**
- JSON schema pack entries with `id`, `label`, `format`, `headers`, `required`, optional `allowed`, and `max_bytes`.
- Generic CSV, Shopify CSV baseline, Amazon-template placeholder, TikTok Shop-template placeholder, WooCommerce baseline, Etsy baseline.

- [ ] Write failing tests that every pack has unique IDs and non-empty headers, and required fields exist in headers.
- [ ] Run tests and confirm failure.
- [ ] Add schema pack data without embedding invented marketplace requirements; placeholder packs explicitly say `template_required: true` when the official template must be supplied.
- [ ] Run tests and confirm pass.
- [ ] Commit with `feat: add destination schema packs`.

### Task 3: Minimal HTTP API and one-page UI

**Files:**
- Create: `catalog-mapper/server.py`
- Create: `catalog-mapper/web/index.html`
- Create: `catalog-mapper/web/app.js`
- Create: `catalog-mapper/web/styles.css`
- Create: `catalog-mapper/tests/test_server.py`

**Interfaces:**
- `GET /` serves the UI.
- `GET /api/destinations` returns schema pack metadata.
- `POST /api/map` accepts JSON `{source_csv, destination_id}` and returns mapping, validation, and generated CSV.

- [ ] Write failing API tests for destination listing and mapping a small catalog.
- [ ] Run tests and confirm failure.
- [ ] Implement the reference server using only Python stdlib `http.server` and JSON responses.
- [ ] Build the one-page UI with upload textarea, destination selector, map/validate action, results, and download button.
- [ ] Run tests and confirm pass.
- [ ] Commit with `feat: add catalog mapper web surface`.

### Task 4: Bulk limits, image manifest, and verification report

**Files:**
- Modify: `catalog-mapper/catalog_mapper.py`
- Modify: `catalog-mapper/server.py`
- Modify: `catalog-mapper/tests/test_catalog_mapper.py`
- Create: `catalog-mapper/README.md`

**Interfaces:**
- `build_package(rows, destination) -> dict[str, object]` returns generated parts, manifest, counts, and deterministic truth state.
- `validate_assets(rows) -> dict[str, object]` validates image URL fields without downloading remote assets.

- [ ] Add failing tests for 10,000-row chunking and image manifest generation.
- [ ] Run tests and confirm failure.
- [ ] Implement chunking by destination byte limit and asset manifest creation.
- [ ] Add explicit states `VERIFIED`, `FAILED`, `BLOCKED`, `UNVERIFIED`.
- [ ] Run full test suite.
- [ ] Smoke-test the HTTP server with a sample CSV.
- [ ] Commit with `feat: add bulk packaging and verification`.

### Task 5: GitHub CI

**Files:**
- Create: `catalog-mapper/.github/workflows/test.yml`

- [ ] Add a workflow running the full unittest suite on push and pull request.
- [ ] Validate YAML structure and run the local test suite before committing.
- [ ] Commit with `ci: test universal catalog mapper`.
