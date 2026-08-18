import { randomUUID } from "node:crypto";
import { readbackSha256 } from "../core/slab/crypto";
import type { ApexAdapter, VerificationEvidence } from "../core/slab/SlabLifecycle";

export interface OllamaAdapterOptions {
  baseUrl?: string;
  fetchImpl?: typeof fetch;
}

export class OllamaAdapter implements ApexAdapter {
  private readonly baseUrl: string;
  private readonly fetchImpl: typeof fetch;

  constructor(options: OllamaAdapterOptions = {}) {
    this.baseUrl = (options.baseUrl ?? process.env.OLLAMA_HOST ?? "http://127.0.0.1:11434").replace(/\/$/, "");
    this.fetchImpl = options.fetchImpl ?? fetch;
  }

  async probe(): Promise<VerificationEvidence> {
    const executionId = randomUUID();
    const started = performance.now();
    const response = await this.fetchImpl(`${this.baseUrl}/api/tags`, {
      method: "GET",
      headers: { accept: "application/json" },
    });
    const latencyMs = performance.now() - started;

    if (!response.ok) {
      throw new Error(`Ollama probe failed with HTTP ${response.status}`);
    }

    const payload = (await response.json()) as Record<string, unknown>;
    const readbackSha256 = await readbackSha256(payload);

    return {
      executionId,
      latencyMs,
      readbackSha256,
      payload: {
        provider: "ollama",
        endpoint: this.baseUrl,
        ...payload,
      },
      observedAt: new Date().toISOString(),
    };
  }
}
