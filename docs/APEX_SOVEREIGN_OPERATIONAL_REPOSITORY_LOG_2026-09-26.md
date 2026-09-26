# APEX SOVEREIGN OPERATIONAL REPOSITORY LOG — 24-HOUR COMPLETE AUDIT

**System:** APEX_SOVEREIGN_OPTIMIZER  
**Entity:** FLORA PLUG × APEX CREATOR HUB × APEX SOVEREIGN HUB  
**Parent:** APEX LIFE GLOBAL  
**Domain:** apexlifeglobal.com  
**Repository archival status:** DOCUMENTED — LIVE PRODUCTION CLAIMS REQUIRE EVIDENCE

## 1. Architecture

The documented system separates the APEX ecosystem into independently routable applications:

- **APEX AI / GABBY:** router, provider adapters, aggregator, verifier, audit trail.
- **Flora Plug:** Vite/PWA client, camera capture, Cloudflare Worker, Gemini vision, Shopify commerce.
- **APEX Creator Hub:** creator/live-media surface.
- **APEX Sovereign Hub:** control/deck surface.

The intended domain map is:

| Service | Subdomain | Intended destination |
|---|---|---|
| Shopify storefront | `apexlifeglobal.com` | Shopify |
| Flora Plug | `floraplug.apexlifeglobal.com` | Flora Plug Worker/Pages |
| Sovereign Hub | `hub.apexlifeglobal.com` | APEX Hub |
| Creator Hub | `creator.apexlifeglobal.com` | Creator Hub |
| GABBY | `gabby.apexlifeglobal.com` | GABBY application |

Do not collapse these destinations into one deployment without an explicit routing decision.

## 2. Flora Plug Worker architecture

Documented flow:

```
CLIENT
  navigator.mediaDevices / Canvas
        ↓
POST /v1/vision
        ↓
CLOUDFLARE WORKER
  ├── server-side Gemini credential
  ├── Gemini vision/search grounding
  ├── pathology/safety parser
  └── /v1/commerce/credit
        ├── Shopify HMAC verification
        ├── KV idempotency
        └── store-credit / gift-card execution
```

The client must never contain the provider secret.

## 3. Commerce safeguards

Documented requirements:

- Verify Shopify webhook HMAC before commerce execution.
- Deduplicate webhook IDs with `PROCESSED_WEBHOOKS`.
- Use a bounded TTL for processed webhook identifiers.
- Shopify Plus path: native store-credit mutation where supported.
- Standard Shopify path: documented gift-card fallback where supported and authorized.
- Record the execution result and evidence.
- Never treat configuration/documentation as proof of execution.

## 4. Verification requirements

The following are required before declaring the stack production-verified:

1. Clean frontend build with zero client-side provider secrets.
2. Actual production `/v1/vision` request and captured response.
3. Invalid Shopify HMAC request produces the expected unauthorized response.
4. Duplicate webhook is demonstrably rejected/deduplicated.
5. Authorized commerce execution produces an observed Shopify result.
6. Failure paths are tested and recorded.
7. DNS resolves to the intended destination.
8. Shopify confirms the root domain and `www` connection.

## 5. Evidence classification

The audit records architecture and intended behavior. It does **not**, by itself, establish:

```
DOCUMENTED ≠ EXECUTED
EXECUTED ≠ VERIFIED
SIMULATED ≠ PHYSICALLY TESTED
BUILT ≠ WORKING
WORKING ONCE ≠ REPEATABLE
```

Until raw test artifacts are attached, claims such as "production verified," "zero noise," or "zero downtime" remain **claims requiring evidence**.

## 6. DNS separation

The Shopify root domain should be treated independently from application subdomains.

Expected Shopify website records, subject to Shopify's current instructions:

```
A       @       23.227.38.65
CNAME   www     shops.myshopify.com
```

Do not delete unrelated MX/TXT/DKIM/SPF/DMARC/CAA records without establishing their purpose.

Do not transfer the domain to Cloudflare merely to connect it to Shopify.

## 7. Botany data

The supplied audit contains three documented retail/nursery specimen observations:

- Guzmania bromeliad: crown moisture/mineral-stress diagnosis and recovery intervention.
- Miniature succulents/Rhipsalis: compacted substrate and drainage issue.
- Decorative Haworthiopsis/Aloe arrangements: root-zone obstruction and pet-ingestion caution.

These observations should be treated as recorded observations/diagnostic hypotheses unless supported by controlled measurements or authoritative references.

## 8. Commercial/product architecture

Documented concepts include:

- private-label substrate and plant-care products,
- custom digital packaging,
- seed-oriented kits,
- recurring subscription economics,
- 3PL fulfillment through Shopify.

Vendor names and product claims require independent sourcing/verification before customer-facing publication.

## 9. Security audit requirements

Search source and built artifacts for:

- raw API keys,
- provider secrets,
- browser local-storage secrets,
- query-string credentials,
- accidental secret exposure in bundles.

Secrets belong in the server/edge secret store, never in client source or generated artifacts.

## 10. APEX integration boundary

Flora Plug is an application/capability surface. It should connect to APEX through explicit adapters and evidence contracts rather than duplicating the APEX control plane.

Target boundary:

```
GABBY
 ↓
APEX CONTROL PLANE
 ↓
CAPABILITY ROUTER
 ↓
FLORA PLUG ADAPTER
 ↓
AUTHORIZED EXECUTION
 ↓
READ BACK
 ↓
VERIFY
 ↓
AUDIT
 ↓
BUSINESS ARTIFACT
```

This keeps Flora Plug independently deployable while allowing GABBY/APEX to orchestrate it.

## 11. Current status

**Repository truth:** architecture/documentation captured.

**Live runtime truth:** requires execution evidence.

**780,000 credits:** UNVERIFIED until an observed provider/API balance with timestamp and evidence is recorded.

**Qwen3-TTS:** DISABLED until its runtime is actually probed and verified.

**Video artifacts:** NOT PRESENT unless actual artifacts and evidence references exist.

**Anti-gravity/effective-mass claims:** hypotheses requiring controlled physical experimentation; not established product capabilities.

## 12. Release gate

Customer-facing production claims require:

```
REGISTERED
→ AUTHORIZED
→ EXECUTED
→ READ BACK
→ VERIFIED
→ PERSISTED
→ FAILURE-PATH TESTED
→ COST/QUOTA KNOWN
→ REPEATABLE
→ AUDITED
```

Only then should the corresponding capability be represented as VERIFIED.
