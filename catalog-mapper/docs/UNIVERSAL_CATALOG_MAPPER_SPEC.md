# Universal Catalog Mapper — Product Specification

## Goal
A single-purpose web application that turns structured product catalogs into destination-specific, validated import packages.

## Boundary
The application does only four things: ingest a catalog, map fields to a destination schema, package product/assets data, and validate the generated output. No storefront builder, CRM, marketing suite, inventory management dashboard, or unrelated features.

## Inputs
CSV, XLSX, XML, JSON, supplier exports, and store exports when readable.

## Canonical product data
Preserve title, description, SKU, cost, price, inventory, variants, options such as size/color, identifiers, categories, tags, shipping fields, images, multiple-image ordering, image URLs, and destination-required fields.

## Destination model
Destinations are schema packs/adapters. The application must not assume Shopify is the canonical platform. A destination pack can describe CSV/XLSX headers, required fields, allowed values, variant rules, image rules, and file-size/batch limits. Initial packs: generic CSV, Shopify CSV, Amazon-template placeholder, TikTok Shop-template placeholder, WooCommerce CSV, Etsy CSV.

## AI boundary
AI is used only to identify source fields, normalize labels, suggest semantic mappings, and explain uncertain mappings. AI cannot invent product data. Unresolved required mappings remain UNVERIFIED/BLOCKED.

## Assets
Images are first-class data. The engine preserves image URLs/files and order, and writes an asset manifest so destination adapters can produce the structure the target expects.

## Verification
The validator compares source records, canonical records, and generated destination records. It must flag missing required fields, duplicate SKUs, missing variants, invalid values, missing/broken image references, and schema violations. VERIFIED is permitted only after deterministic validation passes.

## Bulk
Support 10,000+ products through streaming/chunked processing and destination-specific output splitting. Do not assume one giant output file is acceptable.

## Delivery
The core result is a downloadable validated package. Direct destination APIs/uploads are optional adapters and never required for the core engine.

## UI
One focused page: upload/connect source → choose destination → map → validate → generate → download/send.

## Portability
The core engine is provider-neutral and can be deployed behind any compatible web runtime. GitHub is source control, not a runtime dependency.
