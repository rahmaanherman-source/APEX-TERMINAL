# GODSPEED REAL-TIME ENGINE — INTEGRATION CONTRACT

## Canonical roles

APEX TERMINAL = command and operator plane.
APEX HUB = ecosystem/business/operator services.
APEX HERITAGE = heritage archive/marketplace product.
Truth Gate = verification authority.
GitHub = canonical source control.
GoldenWorld = game/world runtime when its repository/runtime is connected.
Blender = 3D/content execution engine when connected.
Unreal = game/world execution engine when connected.
Tripo = optional 3D generation provider behind an adapter.

## Source-of-truth rule

Do not duplicate working implementations. Discover existing capabilities first. Preserve backend, frontend, AI modules, payments, and databases. Add integration adapters around existing boundaries.

## Runtime connection graph

APEX TERMINAL
-> command/workflow service
-> authorization/policy
-> execution router
-> engine adapter
-> execution events
-> artifact collection
-> tests/validation
-> Truth Gate where applicable
-> evidence/audit record
-> GitHub/status/report

## Engine adapter interface

Each engine/provider adapter should expose equivalent typed operations such as:
- health()
- capabilities()
- start(job)
- status(execution_id)
- cancel(execution_id)
- artifacts(execution_id)
- logs(execution_id)
- verify(execution_id)

An unavailable adapter returns BLOCKED or UNVERIFIED; it never returns a fabricated success.

## Google AI Studio workflow

Google AI Studio is a build worker, not the canonical source or verifier.

1. APEX TERMINAL creates the project specification and build prompt.
2. AI Studio generates or modifies the UI/application project.
3. Project is exported/synced to a GitHub feature branch.
4. CI/build/test runs against the branch.
5. APEX audit reads actual build/test/deployment evidence.
6. Only then does the status move toward VERIFIED.

The UI builder must not be given production secrets.

## Google AI Studio prompt

Build the APEX TERMINAL production operator console from the repository specification in `docs/architecture/GODSPEED_REALTIME_ENGINE_UI_SPEC.md`. Treat existing repository code as protected. Add functionality without destructive rewrites. Connect every visible control to a typed service boundary. Build command/workflow surfaces, real-time execution feed, engine status, repository inspector, artifact inspector, Truth Gate inspector, and responsive layouts. Use real runtime data when connected and explicit UNVERIFIED/BLOCKED/FAILED/NOT COMPLETE states otherwise. No fake data, no fake verification, no fake health, no fake deployment success. Preserve existing APEX Terminal architecture. The terminal orchestrates APEX Hub, APEX Heritage, GoldenWorld, Blender, Unreal, Tripo providers, GitHub, cloud services, and Truth Gate without pretending to replace specialist engines. Every interaction follows USER ACTION -> HANDLER -> STATE -> API/DATA/STORAGE -> VALIDATION -> RESPONSE -> UI REFRESH -> PERSISTENCE -> READ-BACK VERIFICATION.

## GitHub workflow

Recommended branch:
`feature/godspeed-realtime-engine-ui`

Before merge:
- compare changes against main
- run tests/build
- inspect secrets
- verify generated files
- record evidence
- keep unresolved capabilities explicitly UNVERIFIED/BLOCKED

## Future event envelope

```json
{
  "execution_id": "uuid",
  "correlation_id": "uuid",
  "project": "APEX-HERITAGE",
  "engine": "BLENDER",
  "operation": "GENERATE_ASSET",
  "phase": "RUNNING",
  "operational_status": "RUNNING",
  "truth_status": "UNVERIFIED",
  "artifact_id": null,
  "timestamp": "ISO-8601",
  "evidence": []
}
```

## Security rules

- Never put secrets in browser code, logs, Git commits, or generated prompts.
- Use server-side adapters for privileged operations.
- Use least privilege credentials.
- Log execution metadata, not credentials.
- Verify any externally generated artifact before registration.

## Governing loop

REMEMBER -> REBUILD -> REBOOT -> VERIFY
