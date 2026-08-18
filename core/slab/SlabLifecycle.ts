export enum SlabState {
  INIT = 0,
  PROBING = 1,
  COMPARING = 2,
  COMMITTED = 3,
  HALTED = 4,
}

export interface VerificationEvidence {
  executionId: string;
  latencyMs: number;
  readbackSha256: string;
  payload: Record<string, unknown>;
  observedAt: string;
}

export interface ApexAdapter {
  probe(): Promise<VerificationEvidence>;
}

export interface SlabOptions {
  epsilon?: number;
  latencyBaselineMs?: number;
  commit?: (evidence: VerificationEvidence) => void | Promise<void>;
}

export class SlabIntegrityError extends Error {
  public readonly delta: number;
  public readonly evidence: VerificationEvidence;

  constructor(delta: number, evidence: VerificationEvidence) {
    super(`Verification Delta Exceeded: ${delta.toFixed(4)} > epsilon`);
    this.name = "SlabIntegrityError";
    this.delta = delta;
    this.evidence = evidence;
  }
}

export class Slab {
  public state: SlabState = SlabState.INIT;
  private readonly memory = new Map<string, unknown>();
  private readonly epsilon: number;
  private readonly latencyBaselineMs: number;
  private readonly commit: (evidence: VerificationEvidence) => void | Promise<void>;

  constructor(options: SlabOptions = {}) {
    this.epsilon = options.epsilon ?? 0.05;
    this.latencyBaselineMs = options.latencyBaselineMs ?? 150;
    this.commit = options.commit ?? ((evidence) => {
      this.memory.set(evidence.executionId, evidence);
    });

    if (!Number.isFinite(this.epsilon) || this.epsilon < 0) {
      throw new RangeError("epsilon must be a finite non-negative number");
    }
    if (!Number.isFinite(this.latencyBaselineMs) || this.latencyBaselineMs <= 0) {
      throw new RangeError("latencyBaselineMs must be a finite positive number");
    }
  }

  async bootstrap(adapter: ApexAdapter): Promise<VerificationEvidence> {
    this.state = SlabState.PROBING;
    let evidence: VerificationEvidence;

    try {
      evidence = await adapter.probe();
    } catch (error) {
      this.state = SlabState.HALTED;
      throw error;
    }

    this.state = SlabState.COMPARING;
    const delta = this.calculateDelta(evidence);

    if (delta > this.epsilon) {
      this.state = SlabState.HALTED;
      throw new SlabIntegrityError(delta, evidence);
    }

    await this.commit(evidence);
    this.state = SlabState.COMMITTED;
    return evidence;
  }

  get<T>(key: string): T | undefined {
    return this.memory.get(key) as T | undefined;
  }

  private calculateDelta(evidence: VerificationEvidence): number {
    return Math.abs(evidence.latencyMs - this.latencyBaselineMs) / this.latencyBaselineMs;
  }
}
