import { NextResponse } from "next/server";
import { makeVeo, normalizeOllamaStatus, sha256 } from "@/lib/apex/truth";

const baseUrl = process.env.APEX_OLLAMA_URL ?? "http://127.0.0.1:11434";
const timeoutMs = 1500;

export async function GET() {
  const started = performance.now();
  const input = { endpoint: `${baseUrl}/api/tags`, method: "GET" };
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    const response = await fetch(input.endpoint, { signal: controller.signal, cache: "no-store" }).finally(() => clearTimeout(timeout));
    const body = response.ok ? await response.json() : null;
    const models = Array.isArray(body?.models) ? body.models.map((model: { name?: unknown }) => typeof model.name === "string" ? model.name : null).filter((name): name is string => Boolean(name)) : [];
    const operationalStatus = normalizeOllamaStatus(response.ok);
    const veo = makeVeo({ capabilityId: "APEX_TRUTH_GATE_LOCAL_AI", capabilityVersion: "1.0", executorId: "apex-terminal-truth-route", environment: "LOCAL_WORKSTATION", operationalStatus, governanceStatus: "CANDIDATE", testDefinition: "GET Ollama /api/tags and read back model inventory", rawInputFingerprint: sha256(input), rawOutputFingerprint: sha256(body ?? { status: response.status }), evidenceRef: `OLLAMA_TAGS_HTTP_${response.status}`, details: response.ok ? `Ollama reachable; ${models.length} model(s) observed.` : `Ollama returned HTTP ${response.status}.` });
    return NextResponse.json({ checkedAt: veo.timestamp, truth: { operationalStatus, governanceStatus: veo.governanceStatus, verificationId: veo.verificationId, evidenceRef: veo.evidenceRef }, localAI: { endpoint: baseUrl, operationalStatus, governanceStatus: veo.governanceStatus, models }, veo, latencyMs: Math.round(performance.now() - started), rule: "HTTP health does not auto-promote governance to VERIFIED." }, { status: response.ok ? 200 : 503 });
  } catch (error) {
    const veo = makeVeo({ capabilityId: "APEX_TRUTH_GATE_LOCAL_AI", capabilityVersion: "1.0", executorId: "apex-terminal-truth-route", environment: "LOCAL_WORKSTATION", operationalStatus: "FAILED", governanceStatus: "CANDIDATE", testDefinition: "GET Ollama /api/tags with bounded timeout", rawInputFingerprint: sha256(input), rawOutputFingerprint: sha256({ error: String(error) }), evidenceRef: "OLLAMA_UNREACHABLE", details: "Local Ollama daemon was not reachable. No simulated response was generated." });
    return NextResponse.json({ checkedAt: veo.timestamp, truth: { operationalStatus: "FAILED", governanceStatus: "CANDIDATE", verificationId: veo.verificationId, evidenceRef: veo.evidenceRef }, localAI: { endpoint: baseUrl, operationalStatus: "FAILED", governanceStatus: "CANDIDATE", models: [] }, veo, latencyMs: Math.round(performance.now() - started), rule: "HTTP health does not auto-promote governance to VERIFIED." }, { status: 503 });
  }
}
