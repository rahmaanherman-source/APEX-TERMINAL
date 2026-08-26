import { NextResponse } from "next/server";
import { makeVeo, sha256 } from "../../../lib/apex/truth";

const LOCAL_AI_URL = "http://127.0.0.1:11434";
const TIMEOUT_MS = 1500;

async function boundedFetch(url: string, init?: RequestInit) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    return await fetch(url, { ...init, signal: controller.signal, cache: "no-store" });
  } finally {
    clearTimeout(timer);
  }
}

export async function GET() {
  const checkedAt = new Date().toISOString();
  let operationalStatus: "UNKNOWN" | "CONNECTED" | "FAILED" = "UNKNOWN";
  let governanceStatus: "CANDIDATE" | "TESTED" = "CANDIDATE";
  let models: string[] = [];
  let details = "Local runtime was not yet observed.";
  let evidenceRef = "NO_EVIDENCE";
  let outputFingerprint: string | null = null;

  try {
    const response = await boundedFetch(`${LOCAL_AI_URL}/api/tags`);
    const body = response.ok ? await response.json() : null;
    models = Array.isArray(body?.models) ? body.models.map((m: { name?: string }) => m.name).filter(Boolean) : [];
    operationalStatus = response.ok ? "CONNECTED" : "FAILED";
    details = response.ok ? `Ollama health probe succeeded; ${models.length} model(s) observed.` : `Ollama health probe returned HTTP ${response.status}.`;
    evidenceRef = `OLLAMA_TAGS_HTTP_${response.status}`;
    outputFingerprint = sha256(body ?? { status: response.status });
  } catch (error) {
    operationalStatus = "FAILED";
    details = "Ollama local daemon is unreachable. The UI must remain non-green.";
    evidenceRef = "OLLAMA_UNREACHABLE";
    outputFingerprint = sha256({ error: String(error) });
  }

  const veo = makeVeo({
    capabilityId: "APEX_TRUTH_GATE_LOCAL_AI",
    capabilityVersion: "1.0",
    executorId: "apex-terminal-truth-route",
    environment: "LOCAL_WORKSTATION",
    operationalStatus,
    governanceStatus,
    testDefinition: "Probe local Ollama health without promoting operational state to governance verification",
    rawInputFingerprint: sha256({ endpoint: `${LOCAL_AI_URL}/api/tags`, method: "GET" }),
    rawOutputFingerprint: outputFingerprint,
    evidenceRef,
    details,
  });

  return NextResponse.json({
    checkedAt,
    truth: {
      operationalStatus,
      governanceStatus,
      verificationId: veo.verificationId,
      evidenceRef: veo.evidenceRef,
    },
    localAI: {
      endpoint: LOCAL_AI_URL,
      operationalStatus,
      governanceStatus,
      models,
    },
    veo,
    rule: "HTTP health does not auto-promote governance to VERIFIED.",
  }, { status: operationalStatus === "CONNECTED" ? 200 : 503 });
}
