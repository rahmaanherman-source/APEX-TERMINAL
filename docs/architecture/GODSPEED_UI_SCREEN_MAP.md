# GODSPEED APEX TERMINAL — SCREEN MAP

## Screen 01 — Command Center
- Global status header
- Project selector
- Environment selector
- Main command input
- Quick actions: Build / Run / Test / Verify / Deploy
- Active executions
- Live feed preview

## Screen 02 — Execution Workspace
- Execution header
- Command/request
- Planner steps
- Live logs
- Engine status
- Artifacts
- Verification status
- Cancel/retry controls

## Screen 03 — Audit Feed
- Chronological event stream
- Search/filter by project, engine, status, execution ID
- Event detail inspector
- Evidence references
- Failure/retry history

## Screen 04 — Engines
- APEX Hub
- APEX Heritage
- GoldenWorld
- Blender
- Unreal
- Tripo
- GitHub
- Cloud
- Truth Gate

Each card exposes only actions supported by the actual adapter.

## Screen 05 — Repositories
- Repository list
- Branch
- Commit
- Working status
- CI status
- Build/test result
- Deployment result
- Open repository
- Create branch
- Build/test
- Pull request boundary

## Screen 06 — Artifact Registry
- Artifact search
- Artifact details
- Hash
- Source execution
- Engine
- Type
- Path/URL
- Verification
- Related evidence

## Screen 07 — Truth Gate
- Observation panel
- Inference panel
- Provenance panel
- Acquisition panel
- Physical bounds
- Model agreement
- External verification
- Integrity/hash checks
- Final decision

## Screen 08 — Projects
- Project overview
- Repository links
- Active jobs
- Artifact counts
- Deployment state
- Recent events
- Health

## Screen 09 — Settings / Integrations
- GitHub
- Cloud providers
- AI providers
- Storage
- Payment providers
- Engine adapters
- Notification channels
- Security policy

Secrets should be configured through secure server-side credential stores, never rendered in the UI.

## Layout principles

Desktop:
- 240–280px navigation rail
- flexible center workspace
- 320–380px inspector
- 180–260px live feed footer

Tablet:
- 72px compact navigation rail
- full center workspace
- inspector as drawer
- feed as expandable panel

Mobile:
- top command/status bar
- drawer navigation
- single workspace column
- inspector as bottom sheet
- feed as timeline

## State principles

Every screen supports:
- loading
- empty
- ready
- error
- blocked
- unverified
- verified where evidence exists

Never hide an error behind a successful visual state.
