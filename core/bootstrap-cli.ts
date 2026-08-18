import { runBootstrap } from "./bootstrap";

void runBootstrap().catch((error: unknown) => {
  console.error("❌ BOOTSTRAP FAILED:", error instanceof Error ? error.message : String(error));
  process.exit(1);
});
