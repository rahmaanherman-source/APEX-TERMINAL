# APEX GODSPEED — OMNI MASTER SPECIFICATION

Status: additive, non-destructive architecture layer over the canonical APEX Terminal.
Date: 2026-08-09

## Mission
APEX is the owner-controlled universal operating workspace for commerce, media, music, pages, marketing, AI, developer operations, and connected services. The canonical catalog is the single source of product truth. UI is a view/control surface; heavy work executes in durable background workflows. The first 2,000-product run is validation, never a ceiling.

## Non-negotiable rules
- Additive only. Never delete, reset, replace, or duplicate canonical systems.
- Owner is final authority for spend, publication, production changes, destructive actions, credential authorization, and live campaign launch.
- Prefer free/included capabilities first. Display paid cost before execution.
- Never silently truncate. Report REQUESTED / PROCESSABLE / LIMITING FACTOR / EVIDENCE.
- Catalog capacity and channel capacity are independent.
- Truth states remain distinct: EXISTS -> CONNECTED -> AUTHORIZED -> FUNCTIONAL -> LIVE -> SERVING -> PERFORMING -> PROFITABLE.
- One Catalog, Vault, Queue Engine, Gabby, Terminal, Truth/Audit layer, and Cost Governor.
- Secrets never enter prompts, chat history, frontend state, logs, analytics, or generated source code.

## Universal execution contract
Every engine implements: Initialize -> Configure -> Validate -> Authorize -> Plan -> Execute -> Verify -> Monitor -> Report -> Recover -> Persist -> Notify -> Learn -> Shutdown. Every execution receives a correlation ID and produces structured telemetry, audit state, cost state, and recoverable job state.

## Universal catalog
Canonical Product Record contains identity, source provenance, variants, price, cost, inventory, shipping, market restrictions, brand, identifiers, media, enrichment, channel mappings, and truth states. Quantity is computed dynamically from source availability, APEX infrastructure, database/storage capacity, destination quotas, provider rate limits, plan limits, and verified cost.

UI: virtualized list, server-side search/filter, pagination/cursors, incremental loading, bulk approval, job progress, and no full-catalog browser load.

## Durable queue engine
Use durable, idempotent, chunked work units with concurrency/back-pressure, exponential backoff and jitter, persistent checkpoints/cursors, dead-letter queue, cancellation/resume, provider rate-limit awareness, crash recovery, job dependencies, progress counters, and concurrent independent jobs without blocking catalog reads.

## Shopify
Prefer GraphQL bulk operations for large jobs. Runtime-discover and verify applicable shop/API limits; never treat a provider limit as a universal APEX ceiling. Track bulk operation IDs, JSONL result handling, polling/completion, partial data, idempotency, per-shop concurrency, quotas, and destination publication truth. The 2,000 validation batch must scale later without code changes.

## Google Hub
Expose authorized Google capabilities through the Service Registry: AI Studio/Gemini, Gmail, Drive, Docs, Sheets, Calendar, Analytics, Business Profile, Merchant Center, Google Ads, YouTube, and other available Google APIs. Use provider capabilities rather than duplicating provider interfaces.

## Local / on-device model mesh
APEX supports local model endpoints and native device AI as first-class providers. Provider classes include local HTTP/OpenAI-compatible endpoints (Ollama, llama.cpp servers, LM Studio or equivalent), desktop inference, Android AICore/Gemini Nano through a secure companion bridge, Apple Foundation Models through an eligible iOS/macOS companion bridge, and other authorized runtimes discovered by Service Registry.

The phone is not assumed to expose arbitrary model APIs to a web backend. A secure device bridge advertises model metadata, capabilities, health, context limits, privacy class, battery/thermal state where available, and local/remote execution. Routing prefers local/free inference for suitable low-risk, privacy-sensitive, repetitive, or offline work; stronger cloud models are selected when local capability is insufficient. Never silently move private data from local to cloud. Record provider/model and routing reason in telemetry. Allow owner pinning.

## Google Merchant / Ads truth isolation
Merchant Truth and Advertising Truth are separate. Merchant: APEX Product -> Merchant ProductInput -> processed Product -> eligibility/issues/serving. Advertising: APEX Video -> Google Ads Asset -> PMax AssetGroup -> policy -> serving -> performance. A Merchant video link is not an Ads asset, and a generated video is not automatically approved or serving.

## Video Engine
Generate demo, lifestyle, feature, and promotional product videos in background jobs. Store every asset as a versioned immutable media record. Track source, generator, model, prompt/version, input assets, output, validation, policy, publication targets, serving, and performance. Never overwrite approved production assets.

## Brand Engine
Persistent versioned Brand Library for logos, colors, fonts, templates, product/merch concepts, campaign language, images, videos, characters, and reusable design rules. Approved assets are never overwritten.

## Page Studio
Conversational full-stack page creation inside APEX using Catalog, Brand, Media, Music, Commerce, Terminal, Vault references, Truth, and deployment services. Generated pages have preview, draft, approval, deployment, health, rollback, and domain-routing states.

## Concierge / Deep-Link Engine
Resolution rule: if APEX can identify the exact service/account/page required, open that exact destination instead of giving generic navigation instructions. Flow: PROBLEM -> SERVICE -> ACCOUNT -> VERIFIED DESTINATION -> OPEN -> GABBY ASSISTS -> OWNER/API ACTION -> VERIFY. Support billing, verification, policy, DNS, domains, payment methods, API configuration, webhooks, Merchant, Ads, Shopify, Stripe, music distribution, and social accounts where supported. Never invent an unverified deep link.

## Promoter
Loop: Catalog -> Research -> Brand -> Creative -> Market Intelligence -> Merchant -> Campaign Proposal -> Owner Gate -> Publication -> Measurement -> Optimization. Keyword intelligence uses real data. Campaign creation, serving, and profitability remain distinct.

Money gate: GROSS SALES - PRODUCT COST - SHIPPING - PAYMENT FEES - APEX PLATFORM FEE - AD SPEND - OTHER VERIFIED COSTS = NET CONTRIBUTION. No approval = no advertising spend. Platform fee is configurable and owner-controlled; 5% is an initial configuration, not a hard-coded permanent rule.

## Music / Social
Provide one-click service registry links and workflows for MACMusicOfficial.com, UnitedMasters, Spotify, Apple Music, SoundCloud, YouTube, TikTok, Instagram, Facebook, Pandora, BandLab, and other authorized destinations. Where no supported official API exists, APEX prepares the package and tracks owner submission rather than pretending automation exists.

## Account / Service Registry
Each service stores service ID, provider, account alias, workspace/tenant, authorization state, credential reference (never secret value), capability map, verified deep links, health, billing state, plan/quota state, last verification, and stop/disconnect controls. Frequently used services are one-click accessible.

## Vault
Vault is canonical secure credential storage. Gabby receives capability-scoped credential references through the Gatekeeper and does not memorize or display secrets. Provider adapters obtain secrets only at execution time and only when authorized.

## Financial / checkout
Support Stripe checkout, Connect where applicable, webhooks, reconciliation, orders, products, inventory, and analytics. Advertising spend is never revenue. Fee changes require owner authorization.

## Truth / Telemetry / Audit
Every important action records actor, service/account, command/workflow, correlation ID, input reference/hash, authorization result, execution state, provider response, cost, timing, errors/retries, and final truth state. Never collapse these states into one green check.

## Cost Governor
Prefer included/free capabilities. Before paid execution, calculate estimated cost and show scope, reason, and value. Enforce budgets and owner gates.

## Omni workspace
Top-level workspace: GABBY | TERMINAL | CATALOG | COMMERCE | GOOGLE | PROMOTER | BRAND | MEDIA | PAGES | CHARACTER | MUSIC | SOCIAL | SERVICES | VAULT | QUEUES | TRUTH | TELEMETRY | AUDIT | COST.

APEX remains the control plane; provider sites remain provider control surfaces.

## Validation target
Phase 0 proves a 2,000-product run end-to-end without browser overload or silent loss. Evidence must include source, requested, accepted, processed, published, failed, retry, dead-letter, provider errors, destination state, duration, limiting factors, and reconciliation. Then repeat larger quantities without code changes.

## Definition of done
APEX is complete only when it can execute, verify, recover, audit, and explain a real workflow end-to-end while preserving owner control and canonical truth.