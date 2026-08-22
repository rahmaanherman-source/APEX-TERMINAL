import { createHash, randomUUID } from "node:crypto";

export type OperationalStatus = "UNKNOWN" | "CHECKING" | "CONFIGURED" | "CONNECTED" | "FAILED";
export type GovernanceStatus = "RESEARCHED" | "CANDIDATE" | "TESTED" | "APPROVED" | "VERIFIED" | "REJECTED";

export interface VEO {
  verificationId: string;
  capabilityId: string;
  capabilityVersion: string;
  timestamp: string;
  executorId: string;
  environment: string;
  operationalStatus: OperationalStatus;
  governanceStatus: GovernanceStatus;
  testDefinition: string;
  rawInputFingerprint: string | null;
  rawOutputFingerprint: string | null;
  evidenceRef: string;
  details: string;
}

export function sha256(value: unknown): string {
  return createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

export function makeVeo(input: Omit<VEO, "verificationId" | "timestamp">): VEO {
  const timestamp = new Date().toISOString();
  return {
    ...input,
    verificationId: `VEO-${timestamp.replace(/[-:.TZ]/g, "").slice(0, 14)}-${randomUUID().slice(0, 8)}`,
    timestamp,
  };
}

export function normalizeOllamaStatus(ok: boolean): OperationalStatus {
  return ok ? "CONNECTED" : "FAILED";
}
