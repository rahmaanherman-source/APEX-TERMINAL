# APEX Hub Revenue Tab — Build Status

**Target:** integrated route `/revenue` in the existing APEX Terminal / APEX 365 owner hub. No separate app.

## Added on this branch

- `app/revenue/page.tsx`: Revenue workspace with Overview, Data Integrity, Customers, and Insight Solver tabs; responsive cards; palette and dark/light controls; truthful empty/blocked states.
- `app/revenue/revenue.css`: responsive theme styling and six named palettes.
- `database/migrations/20261024_revenue.sql`: daily metrics, customers, source orders, check evidence, audit log and insight tables.
- `src/revenue/config.ts`: server-only environment configuration contract.
- `src/revenue/shopify.ts`: read-only Shopify Admin GraphQL orders adapter.
- `src/revenue/snapshot.ts`: daily snapshot and check pipeline draft.
- `app/api/revenue/*`: endpoints fail closed while the existing auth adapter is not integrated.

## Truth status

- UI source: **DOCUMENTED / IMPLEMENTED IN BRANCH; NOT BUILD-VERIFIED**.
- Shopify read adapter: **IMPLEMENTED IN BRANCH; NOT LIVE-CONNECTED**.
- Postgres migration: **IMPLEMENTED IN BRANCH; NOT APPLIED**.
- Nightly scheduler: **NOT YET CONFIGURED**.
- Existing login and role integration: **BLOCKED**. Repository search did not find a verifiable canonical web session/role adapter. Do not expose customer data or enable admin sync until it is located and connected.
- Payout reconciliation: **BLOCKED / NOT IMPLEMENTED**. Order totals cannot be truthfully claimed to match payouts until payout data is fetched and reconciled by currency and payout period.
- MRR/churn: **NOT COMPUTED**. Current schema defaults these to zero; this is not a measured zero and UI labels indicate subscription classification is required.
- Stripe: optional and not connected by this change.
- Insight generation/overrides: UI shell is present, but server persistence endpoints and actual trend detector remain to be implemented after auth and verified data.
- Automated tests/build: **NOT RUN** through the GitHub connector.

## Required secrets (never commit their values)

- `DATABASE_URL`
- `SHOPIFY_STORE_DOMAIN`
- `SHOPIFY_ADMIN_ACCESS_TOKEN` with read-only order/customer/transaction access only
- optional `STRIPE_SECRET_KEY`, only if Stripe is connected
- existing Apex Hub auth/session integration, which must be code-backed (not an env-flag pretending authentication exists)

## Next implementation gates

1. Find and reuse the canonical Apex Hub login/session/role service.
2. Finish payout API ingestion and currency/payout-period reconciliation.
3. Correct cutoff/date handling with timezone tests; use a timezone-aware library or explicit tested Central cutoff helper.
4. Wire overview/customer/sync/override endpoints to the existing auth service and Postgres.
5. Configure the scheduler for 03:00 America/Chicago with the fixed prior-day 23:59:59 Central cutoff.
6. Add integration tests for idempotent reruns, DST transitions, duplicates, refund subtraction, payout reconciliation, viewer/admin permissions, and audit overrides.
7. Run lint, typecheck, tests, build, and live read-only Shopify verification before calling this operational.
