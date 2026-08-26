import { NextRequest, NextResponse } from "next/server";
import { makeVeo, sha256 } from "../../../lib/apex/truth";

const OLLAMA_BASE = process.env.APEX_OLLAMA_URL ?? "http://127.0.0.1:11434";
const TIMEOUT_MS = 1500;

async function fetchWithTimeout(url: string, init?: RequestInit) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    return await fetch(url, { ...init, signal: controller.signal, cache: "no-store" });
  } finally {
    clearTimeout(timer);
  }
}

export async function GET() {
  const started = performance.now();
  try {
    const response = await fetchWithTimeout(`${OLLAMA_BASE}/api/tags`);
    const body = response.ok ? await response.json() : null;
    const models = Array.isArray(body?.models) ? body.models.map((m: { name?: string }) => m.name).filter(Boolean) : [];
    const operationalStatus = response.ok ? "CONNECTED" : "FAILED";
    const veo = makeVeo({
      capabilityId: "LOCAL_INFERENCE_HEALTH",
      capabilityVersion: "1.0",
      executorId: "apex-terminal-local-ai-route",
      environment: "LOCAL_WORKSTATION",
      operationalStatus,
      governanceStatus: "CANDIDATE",
      testDefinition: "GET Ollama /api/tags and observe HTTP success plus model inventory",
      rawInputFingerprint: sha256({ endpoint: `${OLLAMA_BASE}/api/tags`, method: "GET" }),
      rawOutputFingerprint: sha256(body ?? { status: response.status }),
      evidenceRef: `HTTP_${response.status}_${Math.round(performance.now() - started)}MS`,
      details: response.ok ? `Ollama reachable; ${models.length} model(s) observed.` : `Ollama returned HTTP ${response.status}.`,
    });
    return NextResponse.json({
      provider: "ollama",
      endpoint: OLLAMA_BASE,
      operationalStatus,
      governanceStatus: "CANDIDATE",
      models,
      latencyMs: Math.round(performance.now() - started),
      veo,
    }, { status: response.ok ? 200 : 503 });
  } catch (error) {
    const veo = makeVeo({
      capabilityId: "LOCAL_INFERENCE_HEALTH",
      capabilityVersion: "1.0",
      executorId: "apex-terminal-local-ai-route",
      environment: "LOCAL_WORKSTATION",
      operationalStatus: "FAILED",
      governanceStatus: "CANDIDATE",
      testDefinition: "GET Ollama /api/tags with bounded timeout",
      rawInputFingerprint: sha256({ endpoint: `${OLLAMA_BASE}/api/tags`, method: "GET" }),
      rawOutputFingerprint: sha256({ error: String(error) }),
      evidenceRef: "OLLAMA_UNREACHABLE",
      details: "Local Ollama daemon was not reachable. No simulated response was generated.",
    });
    return NextResponse.json({
      provider: "ollama",
      endpoint: OLLAMA_BASE,
      operationalStatus: "FAILED",
      governanceStatus: "CANDIDATE",
      models: [],
      veo,
    }, { status: 503 });
  }
}

export async function POST(request: NextRequest) {
  let payload: { model?: string; prompt?: string };
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!payload.model || !payload.prompt?.trim()) {
    return NextResponse.json({ error: "model and prompt are required." }, { status: 400 });
  }

  const started = performance.now();
  const input = { model: payload.model, prompt: payload.prompt, stream: false };

  try {
    const response = await fetchWithTimeout(`${OLLAMA_BASE}/api/generate`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(input),
    });
    const body = response.ok ? await response.json() : null;
    const operationalStatus = response.ok ? "CONNECTED" : "FAILED";
    const governanceStatus = response.ok && typeof body?.response === "string" ? "TESTED" : "CANDIDATE";
    const veo = makeVeo({
      capabilityId: "LOCAL_INFERENCE_EXECUTION",
      capabilityVersion: "1.0",
      executorId: "apex-terminal-local-ai-route",
      environment: "LOCAL_WORKSTATION",
      operationalStatus,
      governanceStatus,
      testDefinition: "POST Ollama /api/generate with the selected local model and read back a non-empty response",
      rawInputFingerprint: sha256(input),
      rawOutputFingerprint: sha256(body ?? { status: response.status }),
      evidenceRef: `OLLAMA_GENERATE_HTTP_${response.status}`,
      details: response.ok && typeof body?.response === "string" ? "Local inference produced a read-back response." : `Ollama returned HTTP ${response.status}.`,
    });

    return NextResponse.json({
      model: payload.model,
      response: typeof body?.response === "string" ? body.response.trim() : null,
      operationalStatus,
      governanceStatus,
      latencyMs: Math.round(performance.now() - started),
      veo,
    }, { status: response.ok ? 200 : 502 });
  } catch (error) {
    const veo = makeVeo({
      capabilityId: "LOCAL_INFERENCE_EXECUTION",
      capabilityVersion: "1.0",
      executorId: "apex-terminal-local-ai-route",
      environment: "LOCAL_WORKSTATION",
      operationalStatus: "FAILED",
      governanceStatus: "CANDIDATE",
      testDefinition: "POST Ollama /api/generate with bounded timeout",
      rawInputFingerprint: sha256(input),
      rawOutputFingerprint: sha256({ error: String(error) }),
      evidenceRef: "OLLAMA_GENERATE_UNREACHABLE",
      details: "Local inference failed. No fallback text was synthesized.",
    });
    return NextResponse.json({ operationalStatus: "FAILED", governanceStatus: "CANDIDATE", response: null, veo }, { status: 503 });
  }
}
