import type { CapabilityId, ProviderResult, Verification, WorkspaceContext } from "@apex/core";

export interface ApexJob {
  taskId: string;
  capabilityId: CapabilityId;
  payload: Record<string, unknown>;
  timeoutMs?: number;
  maxAttempts?: number;
}

export interface ProviderUsage {
  inputTokens?: number;
  outputTokens?: number;
  totalTokens?: number;
  durationMs?: number;
  estimatedCost?: number;
}

export interface ProviderExecution {
  providerId: string;
  raw: unknown;
  assetUris?: string[];
  providerJobId?: string;
  usage?: ProviderUsage;
}

export interface CanonicalResult {
  capabilityId: CapabilityId;
  providerId: string;
  taskId: string;
  status: "SUCCEEDED" | "FAILED" | "BLOCKED" | "UNVERIFIED";
  output: unknown;
  assetUris: string[];
  usage: ProviderUsage;
  providerJobId?: string;
  evidence: { readBackObserved: boolean; normalizedAt: string };
  error?: { code: string; message: string };
}

export interface AggregatorProvider {
  id: string;
  execute(job: ApexJob, ctx: WorkspaceContext): Promise<ProviderExecution>;
}

export interface AggregatorAdapterOptions {
  executeProvider: (provider: AggregatorProvider, job: ApexJob, ctx: WorkspaceContext) => Promise<ProviderExecution>;
  now?: () => Date;
}

export class AggregatorAdapter {
  readonly id = "aggregator";

  constructor(private readonly options: AggregatorAdapterOptions) {}

  async execute(job: ApexJob, provider: AggregatorProvider, ctx: WorkspaceContext): Promise<CanonicalResult> {
    const attempts = Math.max(1, Math.min(job.maxAttempts ?? 3, 5));
    const started = this.options.now?.() ?? new Date();
    let lastError: unknown;

    for (let attempt = 1; attempt <= attempts; attempt += 1) {
      try {
        const execution = await withTimeout(
          this.options.executeProvider(provider, job, ctx),
          job.timeoutMs ?? 120_000,
        );
        const finished = this.options.now?.() ?? new Date();
        return {
          capabilityId: job.capabilityId,
          providerId: execution.providerId || provider.id,
          taskId: job.taskId,
          status: "SUCCEEDED",
          output: execution.raw,
          assetUris: execution.assetUris ?? [],
          usage: {
            ...(execution.usage ?? {}),
            durationMs: execution.usage?.durationMs ?? Math.max(0, finished.getTime() - started.getTime()),
          },
          providerJobId: execution.providerJobId,
          evidence: { readBackObserved: true, normalizedAt: finished.toISOString() },
        };
      } catch (error) {
        lastError = error;
        if (attempt < attempts) await backoff(attempt);
      }
    }

    return {
      capabilityId: job.capabilityId,
      providerId: provider.id,
      taskId: job.taskId,
      status: "FAILED",
      output: null,
      assetUris: [],
      usage: {},
      evidence: { readBackObserved: false, normalizedAt: (this.options.now?.() ?? new Date()).toISOString() },
      error: {
        code: "AGGREGATOR_PROVIDER_EXECUTION_FAILED",
        message: lastError instanceof Error ? lastError.message : String(lastError ?? "unknown provider error"),
      },
    };
  }

  toProviderResult(result: CanonicalResult): ProviderResult {
    return {
      raw: result.output,
      assetUris: result.assetUris,
      providerJobId: result.providerJobId,
      costActual: result.usage.estimatedCost,
    };
  }

  async verify(
    result: CanonicalResult,
    ctx: WorkspaceContext,
    verifier: (providerResult: ProviderResult, ctx: WorkspaceContext) => Promise<Verification>,
  ): Promise<Verification> {
    if (result.status !== "SUCCEEDED" || !result.evidence.readBackObserved) {
      return {
        passed: false,
        status: "UNVERIFIED",
        claimState: "UNKNOWN",
        checks: [{ name: "read_back_observed", passed: false, detail: "No observed provider read-back." }],
        evidence: { canonicalResult: result },
      };
    }
    return verifier(this.toProviderResult(result), ctx);
  }
}

function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("AGGREGATOR_TIMEOUT")), timeoutMs);
    promise.then(v => { clearTimeout(timer); resolve(v); }, e => { clearTimeout(timer); reject(e); });
  });
}

async function backoff(attempt: number): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, Math.min(1000 * 2 ** (attempt - 1), 5000)));
}
