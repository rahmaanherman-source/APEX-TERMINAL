# APEX Build Law — Repair Before Expansion

**Fix the existing action before adding another action.** Working behavior plus executable evidence is the completion standard.

Inspect first; snapshot first; make only the requested repair; preserve working behavior; run the real build/tests; revert on regression rather than fixing forward blindly.

Evidence: `DOCUMENTED` → `SCAFFOLDED` → `RUNNABLE` → `BENCHMARKED` → `VERIFIED`; failure: `BLOCKED` | `UNVERIFIED`.

Never report green without evidence. Record defects, repairs, tests, commands, preserved behavior, and blockers.

Repair the real bottleneck before expanding surface area.
