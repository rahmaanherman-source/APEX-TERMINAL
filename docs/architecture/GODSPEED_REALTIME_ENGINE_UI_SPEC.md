# GODSPEED REAL-TIME ENGINE — UI/UX SPECIFICATION

Status: DESIGN BASELINE / IMPLEMENTATION UNVERIFIED
Governing rule: ADD -> CONNECT -> UPGRADE -> VERIFY

## 1. Product identity

APEX TERMINAL is the operator/control plane for the Godspeed ecosystem.
It is not a generic AI dashboard and not a replacement for specialist engines.
It orchestrates existing systems and reports real execution state.

Primary responsibilities:
- Command and workflow execution
- Real-time telemetry and audit feed
- Project/repository control
- Engine routing
- Artifact and evidence tracking
- Verification and Truth Gate display

Specialist engines remain separate:
- Blender = 3D/content execution
- Unreal = game/world execution
- Tripo or other providers = optional 3D generation providers
- GitHub = canonical source control
- APEX Heritage = heritage product
- APEX Hub = ecosystem/business/operator services
- Truth Gate = verification authority

## 2. Primary layout

Desktop layout:

+--------------------------------------------------------------------------------+
| APEX TERMINAL | PROJECT | ENVIRONMENT | STATUS | SEARCH | USER                 |
+----------------+---------------------------------------------------------------+
| LEFT RAIL      | COMMAND / WORKSPACE                    | RIGHT INSPECTOR       |
|                |                                         |                      |
| Hub            | Project Header                         | Execution Details    |
| Heritage       | [RUN] [BUILD] [TEST] [VERIFY]         | Status                |
| Games          |                                         | Engine                |
| 3D / Blender   | Main Workspace                         | Inputs                |
| Unreal         |                                         | Outputs               |
| AI             |                                         | Evidence              |
| Repositories   |                                         | Verification          |
| Deployments    |                                         |                      |
| Audit Feed     |                                         |                      |
+----------------+-----------------------------------------+----------------------+
| BOTTOM: LIVE EVENT STREAM / TERMINAL / LOGS / NOTIFICATIONS / JOB QUEUE        |
+--------------------------------------------------------------------------------+

Mobile layout:
- top status bar
- collapsible left navigation
- full-width command workspace
- inspector opens as bottom sheet
- live event feed becomes a vertically stacked timeline

## 3. Visual language

- near-black base
- antique gold primary accent
- stone/ivory text
- restrained bronze/green success state
- muted crimson failure state
- blue/amber neutral execution states only when semantically meaningful
- no rainbow gradients
- no cartoon UI
- no generic SaaS cards
- no fake glowing controls

Typography:
- serif display for major system titles
- humanist sans-serif for operational UI
- monospace for commands, IDs, hashes, logs, paths, and evidence

## 4. Core navigation

PRIMARY:
- Command
- Projects
- APEX Hub
- APEX Heritage
- GoldenWorld
- Engines
- Repositories
- Deployments
- Audit Feed

SECONDARY:
- Truth Gate
- Artifacts
- Evidence
- Jobs
- Settings

CONTEXTUAL:
- Build
- Run
- Test
- Verify
- Generate
- Import
- Export
- Archive
- Repair
- Deploy

## 5. Command workspace

The main command area is a real operator console.

Input examples:
- Build GoldenWorld
- Run Heritage tests
- Generate a character in Blender
- Open APEX Heritage
- Test current branch
- Verify artifact <id>

Every command must produce:
command_id
execution_id
correlation_id
requested_at
actor
project
engine
status
truth_state
artifacts
errors
verification

## 6. Real-time state model

Operational states:
- QUEUED
- PLANNING
- AUTHORIZING
- RUNNING
- WAITING
- RETRYING
- SUCCEEDED
- FAILED
- CANCELLED
- BLOCKED

Truth states:
- OBSERVED
- FAILED
- BLOCKED

Implementation status is separate:
- IMPLEMENTED
- UNVERIFIED
- VERIFIED
- NOT COMPLETE

Never conflate operational status with truth/verification status.

## 7. Live audit feed

The bottom feed is a first-class UI surface, not decorative text.

Each event row should show:
- timestamp
- execution_id
- engine
- operation
- phase
- operational state
- truth state
- artifact ID/path when present
- duration
- retry count
- evidence link when present

Selecting an event opens the inspector at the exact event.

## 8. Engine cards

Engine cards are status/control surfaces for:

APEX HUB
APEX HERITAGE
GOLDENWORLD
BLENDER
UNREAL
TRIPO
GITHUB
CLOUD
TRUTH GATE

Card status is derived from actual runtime data.

Example:
BLENDER
CONNECTED = true
RUNNING = false
LAST_CHECK = timestamp
TRUTH = UNVERIFIED

Do not display green CONNECTED/READY unless an actual health or execution check has passed.

## 9. Artifact inspector

For any artifact:
- artifact ID
- project
- engine
- type
- path/URL
- size
- hash
- created_at
- source execution_id
- verification status
- related evidence

Actions:
- open
- download/export where permitted
- verify
- compare
- archive

## 10. Truth Gate panel

Display the actual checks:

Provenance
Acquisition
Physical bounds
Model agreement
External verification
Integrity/hash

Each check must show:
- status
- evidence reference
- timestamp
- source

Final decision:
OBSERVED / FAILED / BLOCKED

A Truth Gate decision cannot be inferred from UI color.

## 11. Repository panel

Show:
- repository
- branch
- current commit
- dirty/clean state if available
- recent commits
- tests
- build state
- deployment state

Actions:
- inspect
- test
- build
- create branch
- commit
- open pull request

No action may imply completion until its backend operation confirms success.

## 12. Project/engine workflow

BUILD workflow:
REQUEST -> PLAN -> AUTHORIZE -> EXECUTE -> COLLECT ARTIFACT -> TEST -> VERIFY -> REPORT

3D workflow:
SPEC -> PROVIDER/BLENDER -> ARTIFACT -> HASH -> VALIDATE -> REGISTER -> VERIFY

GAME workflow:
SPEC -> UNREAL/GOLDENWORLD -> BUILD -> TEST -> ARTIFACT -> VERIFY

HERITAGE workflow:
OBJECT -> ACQUISITION -> RECORD -> PROVENANCE -> AI -> TRUTH GATE -> MARKETPLACE

## 13. Interaction contract

Every visible interaction follows:
USER ACTION
-> HANDLER
-> STATE
-> API/DATA/STORAGE
-> VALIDATION
-> RESPONSE
-> UI REFRESH
-> PERSISTENCE
-> READ-BACK VERIFICATION

If backend support is unavailable:
- disable the control, or
- show BLOCKED / UNVERIFIED

Never show a successful result that was not actually produced.

## 14. Responsive behavior

Desktop:
- persistent rail
- split workspace/inspector
- bottom live feed

Tablet:
- collapsible rail
- stacked workspace/inspector
- expandable feed

Mobile:
- condensed header
- drawer navigation
- single-column workspace
- modal/bottom-sheet inspector
- live feed as timeline

## 15. AI integration boundary

AI may:
- plan
- explain
- generate code
- generate assets
- classify
- summarize
- suggest fixes

AI may not:
- fabricate execution success
- fabricate verification
- bypass Truth Gate
- expose secrets
- silently mutate protected repositories

## 16. Google AI Studio integration

Google AI Studio is an external builder/worker, not the source of truth.

Recommended flow:

APEX TERMINAL
-> generate build prompt/spec
-> optional AI Studio build/import
-> exported project/code
-> GitHub branch
-> automated tests
-> APEX audit
-> Truth Gate
-> deploy

APEX TERMINAL owns the integration contract and verification state.

## 17. Google AI Studio build prompt

Use the following prompt when importing/building the UI:

"Build the attached APEX TERMINAL interface as a production-grade operator console. Treat the existing GitHub repository as protected source. Do not delete, replace, or silently rewrite working functionality. Implement the specified layout, real command/workflow surfaces, real-time audit feed, engine status cards, repository inspector, artifact inspector, Truth Gate panel, and responsive desktop/tablet/mobile behavior. Every visible interactive element must connect to a real handler and a typed service boundary. Never fabricate runtime state, verification, repository status, health, builds, deployments, transactions, or artifacts. Use UNVERIFIED/BLOCKED/FAILED/NOT COMPLETE when evidence is missing. The UI is a control plane for existing systems including APEX Hub, APEX Heritage, GoldenWorld, Blender, Unreal, GitHub, Cloud services, and Truth Gate. Specialist engines must remain external execution engines. Add capability without breaking existing code. The acceptance contract is USER ACTION -> HANDLER -> STATE -> API/DATA/STORAGE -> VALIDATION -> RESPONSE -> UI REFRESH -> PERSISTENCE -> READ-BACK VERIFICATION. Build the premium near-black/antique-gold visual system, serious institutional typography, dense operator information, accessible controls, loading/empty/error states, keyboard support, responsive layouts, and testable interactions. Do not use generic SaaS or cartoon styling."

## 18. Data connection strategy

Source of truth hierarchy:
1. GitHub repositories for source code
2. Existing backend APIs for runtime business state
3. Existing databases/storage for durable application data
4. Execution engine adapters for Blender/Unreal/other engines
5. Event bus/audit layer for live status
6. Truth Gate for verification decisions

No browser UI should directly own privileged secrets or direct production database credentials.

## 19. First implementation slice

1. Import this repository branch into the UI builder.
2. Reproduce the terminal layout.
3. Add mock-free typed adapters with explicit UNVERIFIED state until runtime wiring exists.
4. Implement live feed rendering contract.
5. Implement engine/status cards.
6. Implement command workspace.
7. Implement repository/artifact/Truth Gate inspector views.
8. Add tests for interactions.
9. Export changes back to GitHub on a feature branch.
10. Run build and tests.

## 20. Acceptance gate

The UI is not complete because it looks correct.
It is complete only when:
- build passes
- tests pass
- every interactive control has a handler
- connected data sources are real
- persistence/read-back works where required
- error/recovery paths work
- runtime states match observed events
- no fake green exists

REMEMBER -> REBUILD -> REBOOT -> VERIFY
