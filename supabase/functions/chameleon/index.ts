import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

type ChatMessage = { role: "system" | "user" | "assistant"; content: string };
type Provider = {
  id: string;
  baseURL: string;
  keyEnv: string;
  model: string;
  timeoutMs: number;
  tier: "free" | "paid";
};

const COOLDOWN_MS = 60_000;
const MAX_MESSAGES = 40;
const MAX_MESSAGE_CHARS = 12_000;
const MAX_TOTAL_CHARS = 40_000;
const cooldownUntil = new Map<string, number>();

function env(name: string): string {
  return Deno.env.get(name)?.trim() ?? "";
}

function getAllowedOrigins(): Set<string> {
  return new Set(env("ALLOWED_ORIGINS").split(",").map((x) => x.trim()).filter(Boolean));
}

function corsHeaders(origin: string | null): Record<string, string> {
  const headers: Record<string, string> = {
    "Vary": "Origin",
    "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-client-info",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  };
  if (origin && getAllowedOrigins().has(origin)) headers["Access-Control-Allow-Origin"] = origin;
  return headers;
}

function json(body: unknown, status: number, origin: string | null): Response {
  return new Response(JSON.stringify(body), { status, headers: corsHeaders(origin) });
}

function parseMessages(value: unknown): ChatMessage[] | null {
  if (!Array.isArray(value) || value.length < 1 || value.length > MAX_MESSAGES) return null;
  let total = 0;
  const out: ChatMessage[] = [];
  for (const item of value) {
    if (!item || typeof item !== "object") return null;
    const role = (item as Record<string, unknown>).role;
    const content = (item as Record<string, unknown>).content;
    if (!["system", "user", "assistant"].includes(String(role))) return null;
    if (typeof content !== "string" || content.trim().length === 0 || content.length > MAX_MESSAGE_CHARS) return null;
    total += content.length;
    if (total > MAX_TOTAL_CHARS) return null;
    out.push({ role: role as ChatMessage["role"], content });
  }
  return out;
}

function classify(status: number, body: string): string {
  const b = body.toLowerCase();
  if (status === 429 || b.includes("rate limit") || b.includes("quota")) return "rate_limit";
  if (status === 401 || status === 403) return b.includes("gated") ? "gated_model" : "auth";
  if (status === 400 && (b.includes("context") || b.includes("maximum") || b.includes("too long"))) return "context_overflow";
  if (status === 404) return "model_missing";
  if (status === 402) return "payment_required";
  if (status >= 500) return "provider_5xx";
  return "provider_error";
}

// Keep this chain to providers exposing the OpenAI-compatible chat-completions API.
// Anthropic's native Messages API is intentionally not called through this endpoint.
function getChain(): Provider[] {
  const chain: Provider[] = [];
  const routerUrl = env("ROUTER_BASE_URL").replace(/\/+$/, "");
  if (routerUrl) chain.push({
    id: "flippy-cloud", baseURL: routerUrl, keyEnv: "ROUTER_API_KEY",
    model: env("ROUTER_MODEL") || "hybrid", timeoutMs: 8_000, tier: "free",
  });
  chain.push(
    { id: "groq", baseURL: "https://api.groq.com/openai/v1", keyEnv: "GROQ_API_KEY",
      model: env("GROQ_MODEL") || "llama-3.3-70b-versatile", timeoutMs: 12_000, tier: "free" },
    { id: "openrouter", baseURL: "https://openrouter.ai/api/v1", keyEnv: "OPENROUTER_API_KEY",
      model: env("OPENROUTER_MODEL") || "meta-llama/llama-3.3-70b-instruct:free", timeoutMs: 16_000, tier: "free" },
    { id: "nvidia-nim", baseURL: "https://integrate.api.nvidia.com/v1", keyEnv: "NVIDIA_API_KEY",
      model: env("NVIDIA_MODEL") || "meta/llama-3.3-70b-instruct", timeoutMs: 20_000, tier: "free" },
  );
  return chain;
}

async function logAudit(admin: ReturnType<typeof createClient>, actorId: string, action: string, entityId: string, metadata: Record<string, unknown>) {
  // Audit failure must not leak secrets or cause an otherwise successful provider response to be discarded.
  try {
    await admin.from("audit_logs").insert({
      actor_id: actorId, action, entity_type: "model", entity_id: entityId, metadata,
    });
  } catch {
    // Monitoring for audit-table availability belongs in deployment checks.
  }
}

async function callProvider(p: Provider, messages: ChatMessage[]) {
  const key = env(p.keyEnv);
  if (!key) throw { provider: p.id, reason: "missing_key", status: 0 };
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), p.timeoutMs);
  const started = performance.now();
  try {
    const response = await fetch(`${p.baseURL}/chat/completions`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${key}`,
        "Content-Type": "application/json",
        ...(p.id === "openrouter" && env("APP_PUBLIC_URL") ? { "HTTP-Referer": env("APP_PUBLIC_URL") } : {}),
        ...(p.id === "openrouter" && env("APP_NAME") ? { "X-Title": env("APP_NAME") } : {}),
      },
      body: JSON.stringify({ model: p.model, messages, max_tokens: 1024, stream: false }),
      signal: controller.signal,
    });
    const text = await response.text();
    if (!response.ok) throw { provider: p.id, reason: classify(response.status, text), status: response.status };
    let payload: any;
    try { payload = JSON.parse(text); } catch { throw { provider: p.id, reason: "invalid_json", status: response.status }; }
    const content = payload?.choices?.[0]?.message?.content;
    if (typeof content !== "string" || !content.trim()) throw { provider: p.id, reason: "empty_completion", status: response.status };
    return {
      content,
      latency_ms: Math.round(performance.now() - started),
      tokens_out: Number.isFinite(payload?.usage?.completion_tokens) ? payload.usage.completion_tokens : null,
    };
  } catch (error) {
    if (error && typeof error === "object" && "provider" in error) throw error;
    if (error instanceof DOMException && error.name === "AbortError") throw { provider: p.id, reason: "timeout", status: 0 };
    throw { provider: p.id, reason: "network_error", status: 0 };
  } finally {
    clearTimeout(timer);
  }
}

serve(async (req) => {
  const origin = req.headers.get("Origin");
  const allowed = getAllowedOrigins();
  if (origin && !allowed.has(origin)) return json({ error: "origin_not_allowed" }, 403, null);
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders(origin) });
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405, origin);

  const supabaseUrl = env("SUPABASE_URL");
  const serviceRoleKey = env("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceRoleKey) return json({ error: "server_not_configured" }, 500, origin);

  const authorization = req.headers.get("Authorization") ?? "";
  const match = authorization.match(/^Bearer\s+(.+)$/i);
  if (!match) return json({ error: "authentication_required" }, 401, origin);

  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data: userData, error: userError } = await admin.auth.getUser(match[1]);
  if (userError || !userData.user) return json({ error: "invalid_session" }, 401, origin);

  let body: unknown;
  try {
    const length = Number(req.headers.get("content-length") ?? 0);
    if (length > 200_000) return json({ error: "request_too_large" }, 413, origin);
    body = await req.json();
  } catch {
    return json({ error: "invalid_json" }, 400, origin);
  }
  const messages = parseMessages((body as Record<string, unknown> | null)?.messages);
  if (!messages) return json({ error: "invalid_messages", hint: "Send 1–40 messages, each with a supported role and non-empty text." }, 400, origin);

  const attempts: Array<{ provider: string; reason: string; status: number }> = [];
  for (const provider of getChain()) {
    const until = cooldownUntil.get(provider.id) ?? 0;
    if (Date.now() < until) {
      attempts.push({ provider: provider.id, reason: "cooldown", status: 0 });
      continue;
    }
    try {
      const result = await callProvider(provider, messages);
      await logAudit(admin, userData.user.id, "ai.call.completed", provider.id, {
        latency_ms: result.latency_ms, reroute_count: attempts.length,
        reroute_trail: attempts, tokens_out: result.tokens_out, tier: provider.tier,
      });
      return json({
        content: result.content, served_by: provider.id,
        latency_ms: result.latency_ms, rerouted: attempts.length > 0, trail: attempts,
      }, 200, origin);
    } catch (error) {
      const failure = error as { provider?: string; reason?: string; status?: number };
      const reason = failure.reason ?? "unknown";
      const status = failure.status ?? 0;
      attempts.push({ provider: provider.id, reason, status });
      if (["rate_limit", "gated_model", "auth", "payment_required", "provider_5xx", "timeout", "network_error"].includes(reason)) {
        cooldownUntil.set(provider.id, Date.now() + COOLDOWN_MS);
      }
    }
  }

  try {
    await admin.from("audit_logs").insert({
      actor_id: userData.user.id, action: "ai.call.exhausted", entity_type: "chain",
      entity_id: "chameleon", metadata: { trail: attempts },
    });
  } catch { /* Surface the provider exhaustion even if the audit store is temporarily unavailable. */ }
  return json({ error: "chameleon_exhausted", trail: attempts, hint: "All configured providers failed or are unavailable. Check provider secrets, quotas, model access, and network health." }, 503, origin);
});
