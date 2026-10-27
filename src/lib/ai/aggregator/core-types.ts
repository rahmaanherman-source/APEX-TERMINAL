// Local definitions of the shared APEX core types used by the aggregator.
// They were previously imported from "@apex/core", a package that does not exist
// in this repo, which broke `next build` during the type-check step.

export type CapabilityId = string;

export interface WorkspaceContext {
  workspaceId?: string;
  userId?: string;
  [key: string]: unknown;
}

export interface ProviderResult {
  raw: unknown;
  assetUris: string[];
  providerJobId?: string;
  costActual?: number;
}

export interface VerificationCheck {
  name: string;
  passed: boolean;
  detail?: string;
}

export interface Verification {
  passed: boolean;
  status: "VERIFIED" | "UNVERIFIED" | "FAILED" | "BLOCKED";
  claimState: "TRUE" | "FALSE" | "UNKNOWN";
  checks: VerificationCheck[];
  evidence?: Record<string, unknown>;
}
