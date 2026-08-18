import { strict as assert } from "node:assert";
import test from "node:test";
import { Comparator } from "../core/math/Comparator";
import { Slab, SlabIntegrityError, SlabState, type VerificationEvidence } from "../core/slab/SlabLifecycle";
import { toSlabUiState } from "../core/slab/uiState";

const evidence = (latencyMs: number): VerificationEvidence => ({
  executionId: "test-exec",
  latencyMs,
  readbackSha256: "a".repeat(64),
  payload: { source: "test" },
  observedAt: "2026-08-18T00:00:00.000Z",
});

test("slab commits evidence inside epsilon", async () => {
  const slab = new Slab({ epsilon: 0.05, latencyBaselineMs: 150 });
  const observed = evidence(150);
  const result = await slab.bootstrap({ probe: async () => observed });

  assert.equal(slab.state, SlabState.COMMITTED);
  assert.deepEqual(result, observed);
});

test("slab halts when delta exceeds epsilon", async () => {
  const slab = new Slab({ epsilon: 0.05, latencyBaselineMs: 150 });

  await assert.rejects(
    slab.bootstrap({ probe: async () => evidence(240) }),
    (error: unknown) => {
      assert.ok(error instanceof SlabIntegrityError);
      assert.equal(slab.state, SlabState.HALTED);
      assert.ok(error.delta > 0.05);
      return true;
    },
  );
});

test("comparator rejects a 1.5x latency spike after history exists", () => {
  const comparator = new Comparator({ windowSize: 10, maxRatio: 1.5, sigmaThreshold: 3 });
  for (const latency of [100, 101, 99, 100]) comparator.verify(latency);

  const result = comparator.verify(160);
  assert.equal(result.accepted, false);
  assert.equal(result.reason, "RATIO_EXCEEDED");
});

test("ui never labels HALTED as online", () => {
  const state = toSlabUiState(SlabState.HALTED);
  assert.equal(state.severity, "critical");
  assert.match(state.label, /CRITICAL ERROR/);
});
