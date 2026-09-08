# APEX TERMINAL — EXACT WORKSPACE CONTRACT

**Status:** LOCKED / CANONICAL
**Purpose:** Prevent any builder, agent, developer, or future implementation from reducing the supplied APEX Terminal reference to an approximate dashboard.

## 1. SOURCE OF TRUTH

The supplied APEX Terminal reference image is the exact visual and information-architecture source of truth for the root workspace.

DO NOT reinterpret it.
DO NOT redesign it.
DO NOT simplify it.
DO NOT replace it with a generic SaaS dashboard.
DO NOT remove panels because they are difficult to implement.

The implementation must reproduce the same workspace composition and preserve the existing APEX functional floor.

## 2. ROOT WORKSPACE — REQUIRED REGIONS

```text
APEX TERMINAL ROOT
├── HEADER
│   ├── APEX TERMINAL identity
│   ├── GABBY command/search input
│   ├── Truth / verification state
│   └── Owner / project context
│
├── LEFT: WORKSPACE
│   ├── Dashboard
│   ├── Projects
│   ├── Tools
│   ├── Engines
│   ├── Connections
│   ├── Marketplace
│   ├── Audit Log
│   ├── Memory Slabs
│   └── Settings
│
├── LEFT-CENTER: CONNECTED APPS
│   └── Provider inventory from the real registry
│
├── CENTER: 3D CREATION STUDIO
│   ├── Create
│   ├── Characters
│   ├── Worlds
│   ├── Animation
│   ├── Render
│   ├── Sculpt
│   ├── Model
│   ├── Texture
│   ├── Rig
│   ├── Animate
│   ├── Light
│   └── Render
│
├── RIGHT: CONCIERGE GABBY
│   ├── New Project
│   ├── Open Project
│   ├── Current Project
│   └── Project verification/status
│
├── RIGHT-CENTER: ENGINES
│   ├── APEX Engine
│   ├── APEX Render
│   ├── Physics
│   ├── Audio Engine
│   ├── AI Generation
│   └── World Builder
│
├── LOWER LEFT: SYSTEM STATUS
│   ├── CPU
│   ├── GPU
│   ├── RAM
│   ├── VRAM
│   └── Network
│
├── LOWER CENTER-LEFT: FOLEY & SOUND DESIGN
│
├── LOWER CENTER: AI DIALOGUE & ADAK
│
├── LOWER CENTER-RIGHT: TIMELINE / SEQUENCE
│   ├── Video
│   ├── Dialogue
│   ├── Foley
│   ├── Music
│   └── SFX
│
├── RIGHT LOWER: AUDIT FEED (REAL-TIME)
│   └── timestamped evidence events
│
└── BOTTOM COMMAND BAR
    ├── BUILD
    ├── RUN
    ├── TEST
    ├── VERIFY
    ├── DEPLOY
    ├── PUBLISH
    ├── APEX REAL-TIME ENGINE
    ├── Truth status
    └── Gabby online status
```

## 3. UNDER-DASHBOARD ARCHITECTURE

The root shell is the front door. Everything else is reached through its workspace navigation. Do not create competing root dashboards.

```text
DASHBOARD
├── Projects
├── Tools
├── Engines
├── Connections / Ecosystem
├── Marketplace
├── Audit Log
├── Memory Slabs
├── Settings
├── Revenue
├── Gabby
├── Character Studio
├── Worlds
├── Animation
├── Render
├── Terminal
├── Vault / Gatekeeper
├── Truth Gate
└── Provider Registry
```

## 4. FUNCTIONAL CONTRACT

Every visible control must resolve to a real outcome:

`CONTROL → ROUTE → AUTH → PERMISSION → CAPABILITY → EXECUTION → READBACK → EVIDENCE → AUDIT → UI STATE`

Allowed outcomes:
- navigation
- state transition
- real adapter execution
- workspace open/close
- configuration flow
- truthful disabled state
- truthful error state

A decorative control with no outcome is a defect.

## 5. TRUTH CONTRACT

```text
DOCUMENTED → CONFIGURED → CONNECTED → RUNNABLE → TESTED → VERIFIED
```

Never skip a state. Never manufacture VERIFIED.

`REGISTERED ≠ CONNECTED`
`CONNECTED ≠ EXECUTED`
`EXECUTED ≠ VERIFIED`
`CLICKED ≠ SUCCESS`

## 6. PRESERVATION LAW

The current APEX application is the functional floor. Existing routes, services, providers, memory, audit, Truth Gate, Vault/Gatekeeper, Terminal, Character Studio, Worlds, Animation, Render, Gabby, Build, Run, Test, Verify, Deploy, and Publish capabilities must remain reachable.

**CHANGE THE SHELL WITHOUT LOSING THE ENGINE.**

Reuse first. Extend second. Generate last.

## 7. ACCEPTANCE GATE

The shell is not complete until:

1. The reference composition is reproduced.
2. All required regions exist in their assigned positions.
3. Existing functionality remains reachable.
4. Every visible control has a real path or truthful disabled/error state.
5. Gabby operates through the real orchestration path.
6. Provider status comes from real adapter/registry state.
7. Audit events contain real timestamps and evidence.
8. Build, Run, Test, Verify, Deploy, and Publish expose truthful state.
9. Browser, API, database, and runtime tests pass where configured.
10. A second 365° review finds no missing, broken, duplicated, disconnected, or unverified primary capability.

**NO APPROXIMATION. NO FAKE GREEN. NO UNVERIFIED COMPLETION.**
