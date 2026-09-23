import { createHash } from "node:crypto";

export type VerificationStatus = "VERIFIED" | "UNVERIFIED" | "FAILED";
export type ClaimState = "SUPPORTED" | "REFUTED" | "UNKNOWN";
export type VerificationState = VerificationStatus | "STALE" | "REQUIRES_REVALIDATION" | "REVIEW";
export type EdgeKind = "HARD" | "SOFT";

export interface VerificationRecord {
  taskId: string;
  claimId: string;
  inputHash: string;
  evidenceHash: string;
  criteriaHash: string;
  reviewHash: string;
  taskHash: string;
  dependencyHashes: string[];
  workflowRoot: string;
  verificationStatus: VerificationStatus;
  claimState: ClaimState;
  executorId: string;
  reviewerId: string;
  verificationClass: string;
  verifiedAt: string;
  ttlMs: number | null;
}

export interface DependencyEdge {
  parentId: string;
  childId: string;
  kind: EdgeKind;
}

export interface VerificationNode {
  id: string;
  version: string;
  status: VerificationState;
  record?: VerificationRecord;
  independentEvidencePaths?: string[][];
}

export function canonicalJson(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return "[" + value.map(canonicalJson).join(",") + "]";
  const obj = value as Record<string, unknown>;
  return "{" + Object.keys(obj).sort().map(k => JSON.stringify(k) + ":" + canonicalJson(obj[k])).join(",") + "}";
}

export function sha256(value: string): string {
  return "sha256:" + createHash("sha256").update(value, "utf8").digest("hex");
}

export function evidenceHash(rawMeasurements: unknown, instrument: unknown, calibration: unknown, timestamp: string): string {
  return sha256(canonicalJson({ calibration, instrument, rawMeasurements, timestamp }));
}

export function criteriaHash(criteria: unknown): string {
  return sha256(canonicalJson(criteria));
}

export function reviewHash(reviewerId: string, evHash: string, critHash: string, decision: string): string {
  return sha256(reviewerId + evHash + critHash + decision);
}

export function taskHash(inputHash: string, evHash: string, critHash: string, revHash: string, dependencyHashes: string[]): string {
  return sha256(canonicalJson({ criteriaHash: critHash, dependencyHashes: [...dependencyHashes].sort(), evidenceHash: evHash, inputHash, reviewHash: revHash }));
}

export function merkleRoot(taskHashes: string[]): string {
  if (taskHashes.length === 0) return sha256("MERKLE_EMPTY");
  let level = [...taskHashes].sort();
  while (level.length > 1) {
    const next: string[] = [];
    for (let i = 0; i < level.length; i += 2) {
      const left = level[i];
      const right = level[i + 1] ?? left;
      next.push(sha256(left + right));
    }
    level = next;
  }
  return "merkle:" + level[0].replace(/^sha256:/, "");
}

export function workflowIntegrity(records: VerificationRecord[]): string {
  return merkleRoot(records.map(r => r.taskHash));
}

export function assertReviewerSeparation(executorId: string, reviewerId: string, reviewerAuthorized: boolean): void {
  if (executorId === reviewerId) throw new Error("REVIEWER_SEPARATION_VIOLATION");
  if (!reviewerAuthorized) throw new Error("REVIEWER_CAPABILITY_UNAUTHORIZED");
}

export function invalidateFromChange(
  changedNodeId: string,
  nodes: Map<string, VerificationNode>,
  edges: DependencyEdge[],
): void {
  const children = new Map<string, DependencyEdge[]>();
  for (const edge of edges) {
    const list = children.get(edge.parentId) ?? [];
    list.push(edge);
    children.set(edge.parentId, list);
  }

  const queue = [changedNodeId];
  const visited = new Set<string>();

  const hasIndependentPath = (childId: string, excluded: string): boolean => {
    const node = nodes.get(childId);
    if (!node?.independentEvidencePaths) return false;
    return node.independentEvidencePaths.some(path => !path.includes(excluded));
  };

  while (queue.length) {
    const current = queue.shift()!;
    if (visited.has(current)) continue;
    visited.add(current);

    for (const edge of children.get(current) ?? []) {
      const child = nodes.get(edge.childId);
      if (!child) continue;

      if (edge.kind === "HARD") {
        child.status = "REQUIRES_REVALIDATION";
        queue.push(child.id);
      } else if (hasIndependentPath(child.id, changedNodeId)) {
        child.status = "REVIEW";
      } else {
        child.status = "REQUIRES_REVALIDATION";
        queue.push(child.id);
      }
    }
  }

  const changed = nodes.get(changedNodeId);
  if (changed) changed.status = "REQUIRES_REVALIDATION";
}

export function isStale(record: VerificationRecord, nowMs = Date.now()): boolean {
  if (record.ttlMs === null) return false;
  return new Date(record.verifiedAt).getTime() + record.ttlMs <= nowMs;
}

export function customerClaimAllowed(record: VerificationRecord, hardDependenciesValid: boolean, softDependenciesReviewed: boolean, tamperDetected: boolean): boolean {
  return record.verificationStatus === "VERIFIED"
    && record.claimState === "SUPPORTED"
    && hardDependenciesValid
    && softDependenciesReviewed
    && !tamperDetected
    && !isStale(record);
}
