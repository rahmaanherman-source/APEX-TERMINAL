import { OllamaAdapter } from "../adapters/OllamaAdapter";
import { Comparator } from "./math/Comparator";
import { defaultHaltController, type HaltController } from "./halt";
import { Slab, SlabState } from "./slab/SlabLifecycle";

export async function runBootstrap(halt: HaltController = defaultHaltController): Promise<SlabState> {
  const slab = new Slab({ epsilon: 0.05, latencyBaselineMs: 150 });
  const adapter = new OllamaAdapter();
  const comparator = new Comparator({ windowSize: 10, sigmaThreshold: 3, maxRatio: 1.5 });

  console.log("🔱 APEX TERMINAL: BOOTSTRAP INITIATED");
  console.log(`STATE ${SlabState.INIT}: Initializing Hardware…`);

  try {
    console.log(`STATE ${SlabState.PROBING}: Measuring Latency…`);
    const evidence = await adapter.probe();

    const comparison = comparator.verify(evidence.latencyMs);
    if (!comparison.accepted) {
      slab.state = SlabState.HALTED;
      halt.halt(`Comparator rejected latency: ${comparison.reason}`);
    }

    console.log(`STATE ${SlabState.COMPARING}: Verifying Integrity…`);
    await slab.bootstrap({ probe: async () => evidence });

    console.log(`STATE ${SlabState.COMMITTED}: System Online`);
    return slab.state;
  } catch (error) {
    slab.state = SlabState.HALTED;
    const message = error instanceof Error ? error.message : String(error);
    halt.halt(`Verification failed: ${message}`);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  void runBootstrap();
}
