# Chameleon Router Hardening

Status: **implementation added; deployment and live provider checks remain unverified until run in the target Supabase project**.

## Files added

- `supabase/functions/chameleon/index.ts` — authenticated Supabase Edge Function, bounded request validation, provider timeouts, cooldowns, CORS allowlist, provider fallback, and metadata-only audit logging.
- `integrations/gabby/chameleon.ts` — optional local-first client with a 700 ms local probe and bounded local request; local failure falls back to the cloud function.
- `supabase/migrations/202610210001_chameleon_audit_logs.sql` — audit table, indexes, RLS, and no client write policy.
- This document — setup and operational acceptance checks.

## Important integration note

The client imports `../../lib/supabaseClient` from the proposed `integrations/gabby/` location. If the existing app's Supabase client is elsewhere, update that one import to the canonical existing client before building. Do not create a second Supabase client or duplicate credentials.

## Required Supabase Edge Function secrets

Set these through Supabase Dashboard → Edge Functions → Secrets (or the Supabase CLI). Never commit values into Git:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ALLOWED_ORIGINS` — comma-separated exact origins, e.g. `https://gabby.apexlifeglobal.com,https://apexlifeglobal.com`
- `GROQ_API_KEY`
- `OPENROUTER_API_KEY`
- `NVIDIA_API_KEY`
- Optional: `ROUTER_BASE_URL`, `ROUTER_API_KEY`, `ROUTER_MODEL`, `GROQ_MODEL`, `OPENROUTER_MODEL`, `NVIDIA_MODEL`, `APP_PUBLIC_URL`, `APP_NAME`

Only configure provider secrets for providers you have permission to use. The router skips missing keys. Provider models and free-tier availability change; verify model access with live smoke tests. The default chain includes only OpenAI-compatible chat-completions endpoints. Anthropic is intentionally omitted until a dedicated native Messages API adapter is implemented.

## Security corrections from the supplied draft

1. Requires a valid Supabase user JWT before routing; rejects missing or invalid sessions.
2. Uses an exact origin allowlist and handles OPTIONS preflight.
3. Validates JSON shape, roles, per-message size, total size, and message count.
4. Adds bounded timeouts and always clears timers.
5. Does not store prompts or provider keys in audit metadata.
6. Does not assume Anthropic's native API is OpenAI-compatible.
7. Keeps service-role credentials server-side; do not expose them in frontend environment variables.
8. Returns a classified 503 with attempt trail when the chain is exhausted instead of hanging.

## Deploy checklist

1. Revoke any provider keys that were exposed in files, chat exports, shell history, or repositories. Generate replacements and update only the secret store.
2. Inspect the existing Supabase project and migrations before applying the audit SQL; if an `audit_logs` table already exists, reconcile schema changes rather than blindly replacing production data.
3. Set the secrets above and verify each configured provider/model is enabled for the account.
4. Deploy: `supabase functions deploy chameleon`.
5. Ensure the function's JWT verification setting remains enabled. The handler also verifies the user token explicitly.
6. Wire the existing Gabby chat action to `chameleonChat(messages)` after fixing the Supabase-client import path.
7. Configure `VITE_CHAMELEON_LOCAL_BASE_URL` only if the local OpenAI-compatible runtime is reachable from the browser. Browser CORS and HTTPS mixed-content policies can prevent localhost access; cloud fallback is expected.
8. Run smoke tests and inspect Supabase function logs and `audit_logs`.

## Acceptance checks

- Unauthenticated POST → 401.
- Invalid/expired JWT → 401.
- Disallowed browser origin → 403.
- OPTIONS preflight from an allowed origin → 204 with CORS headers.
- Malformed JSON or invalid messages → 400.
- One provider with a deliberately invalid test key → attempt recorded and next provider attempted.
- All providers unavailable → 503 with classified trail.
- Successful call → 200 with `served_by`, `latency_ms`, `rerouted`, and `trail`.
- Audit records contain provider IDs, timing, and classifications only; never prompts or secrets.

## Operational truth

A Git commit is not a deployment. These files are **not live** until they are deployed to the intended Supabase project and the client is wired into the actual app. Do not label the runtime globally ready or verified until the acceptance checks pass against real configured providers and the production origin.
