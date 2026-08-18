export interface ComparatorOptions {
  windowSize?: number;
  sigmaThreshold?: number;
  maxRatio?: number;
}

export interface ComparisonResult {
  accepted: boolean;
  latencyMs: number;
  meanMs: number;
  standardDeviationMs: number;
  zScore: number;
  ratioToMean: number;
  reason: "ACCEPTED" | "RATIO_EXCEEDED" | "SIGMA_EXCEEDED";
}

/**
 * Rolling statistical guard against transient latency spikes.
 * The comparator never mutates the slab state; it only reports evidence.
 */
export class Comparator {
  private readonly history: number[] = [];
  private readonly windowSize: number;
  private readonly sigmaThreshold: number;
  private readonly maxRatio: number;

  constructor(options: ComparatorOptions = {}) {
    this.windowSize = options.windowSize ?? 10;
    this.sigmaThreshold = options.sigmaThreshold ?? 3;
    this.maxRatio = options.maxRatio ?? 1.5;

    if (!Number.isInteger(this.windowSize) || this.windowSize < 2) {
      throw new RangeError("windowSize must be an integer >= 2");
    }
    if (!Number.isFinite(this.sigmaThreshold) || this.sigmaThreshold <= 0) {
      throw new RangeError("sigmaThreshold must be positive");
    }
    if (!Number.isFinite(this.maxRatio) || this.maxRatio <= 0) {
      throw new RangeError("maxRatio must be positive");
    }
  }

  public verify(latency: number): ComparisonResult {
    if (!Number.isFinite(latency) || latency < 0) {
      return {
        accepted: false,
        latencyMs: latency,
        meanMs: NaN,
        standardDeviationMs: NaN,
        zScore: Infinity,
        ratioToMean: Infinity,
        reason: "SIGMA_EXCEEDED",
      };
    }

    const prior = [...this.history];
    const mean = prior.length > 0 ? this.mean(prior) : latency;
    const standardDeviation = prior.length > 1 ? this.standardDeviation(prior, mean) : 0;
    const ratio = mean > 0 ? latency / mean : 1;
    const zScore = standardDeviation > 0 ? Math.abs(latency - mean) / standardDeviation : 0;

    const ratioExceeded = prior.length > 0 && ratio > this.maxRatio;
    const sigmaExceeded = prior.length > 2 && zScore > this.sigmaThreshold;
    const accepted = !ratioExceeded && !sigmaExceeded;

    this.history.push(latency);
    if (this.history.length > this.windowSize) this.history.shift();

    return {
      accepted,
      latencyMs: latency,
      meanMs: mean,
      standardDeviationMs: standardDeviation,
      zScore,
      ratioToMean: ratio,
      reason: ratioExceeded ? "RATIO_EXCEEDED" : sigmaExceeded ? "SIGMA_EXCEEDED" : "ACCEPTED",
    };
  }

  public getHistory(): readonly number[] {
    return [...this.history];
  }

  private mean(values: number[]): number {
    return values.reduce((sum, value) => sum + value, 0) / values.length;
  }

  private standardDeviation(values: number[], mean: number): number {
    const variance = values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / values.length;
    return Math.sqrt(variance);
  }
}
