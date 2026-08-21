# APEX Terminal Exact Hub Shell Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the APEX Terminal root workspace visually match the supplied APEX TERMINAL reference exactly as the canonical Hub shell, while preserving existing functionality and exposing every existing subsystem through explicit, working navigation, buttons, toggles, and routes.

**Architecture:** Keep `APEX-TERMINAL` as the primary local-first shell. Replace the current root composition of FileExplorer + generic Terminal + AICommandPalette with a real APEX Hub shell containing the exact reference hierarchy: top command/header, left workspace rail, connected-app Hub, central active workspace, right Gabby/inspector rail, telemetry/audit modules, and bottom command bar. Existing Character Studio remains a real route/workspace and becomes the first major center workspace reachable from the Hub. Existing adapters, audit, registry, Vault/Gatekeeper, and provider state remain behind explicit modules rather than being duplicated in UI.

**Tech Stack:** Next.js App Router, React, TypeScript, Tailwind/CSS already present in `APEX-TERMINAL`, existing Lucide icons/components, existing APEX adapter/audit/state contracts.

**Spec:** `docs/APEX_TERMINAL_UIUX_SPEC.md` and `docs/APEX_VISUAL_BUILD_PRESERVATION_PROTOCOL.md`, with the supplied APEX TERMINAL reference image as the visual source of truth.

## Global Constraints

- **SUPPLIED VISUAL = VISUAL SOURCE OF TRUTH.** Do not redesign it into a generic dashboard.
- Existing verified capabilities are the functional floor; visual changes are additive.
- Every visible control must have a real route, state transition, adapter action, or explicit disabled/error path.
- Provider badges must reflect observed state; never manufacture VERIFIED/ACTIVE status.
- Raw credentials never enter frontend state, prompts, logs, or repository files.
- Local Terminal remains first-class; cloud services are integrated execution infrastructure, not a replacement shell.
- APEX Hub is the entry surface for connected tools and projects.
- Connected-app tiles must display the actual integration state and open the corresponding workspace or connection flow.
- Character Studio is a workspace inside APEX Terminal, not a separate product shell.
- Audit, Truth Gate, Memory, Vault, and provider registries must remain deterministic and evidence-backed.

---

### Task 1: Establish the exact Hub shell at the root route

**Files:**
- Modify: `app/page.tsx`
- Create: `components/Hub/ApexHubShell.tsx`
- Create: `components/Hub/HubNavigation.tsx`
- Create: `components/Hub/HubHeader.tsx`
- Create: `components/Hub/HubBottomBar.tsx`
- Create: `components/Hub/hub-types.ts`

**Interfaces:**
- `ApexHubShell` owns the page composition and active workspace state.
- `HubNavigation` emits `onNavigate(destination: HubDestination)`.
- `HubHeader` emits `onCommand(command: string)` and displays current truth state.
- `HubBottomBar` emits `onAction(action: HubAction)` for `BUILD | RUN | TEST | VERIFY | DEPLOY | PUBLISH`.
- `HubDestination` must include `DASHBOARD | PROJECTS | TOOLS | ENGINES | CONNECTIONS | MARKETPLACE | AUDIT_LOG | MEMORY_SLABS | SETTINGS | CHARACTER_STUDIO`.

- [ ] **Step 1: Write the failing route-level test**

Test that `/` renders the APEX TERMINAL header, left workspace rail, connected-app region, Gabby rail, center workspace, audit/telemetry region, and bottom command bar.

- [ ] **Step 2: Run the existing frontend test/build command and record the baseline result.**

- [ ] **Step 3: Replace the current `app/page.tsx` composition**

The root page must render `ApexHubShell` rather than the current detached `FileExplorer`, generic `Terminal`, and `AICommandPalette` composition.

- [ ] **Step 4: Implement the shell with explicit edge-anchored regions**

Use fixed header/footer heights and a three-region main grid so the primary workspace belongs to the shell rather than floating inside an unrelated card.

- [ ] **Step 5: Add active workspace state and route transitions**

The shell must preserve the active destination while switching center content and must not remount the whole shell unnecessarily.

- [ ] **Step 6: Run the root route test/build and verify the shell renders without errors.**

- [ ] **Step 7: Commit:** `feat: establish exact apex hub shell`

---

### Task 2: Build the connected-app Hub exactly as the reference Hub

**Files:**
- Create: `components/Hub/ConnectedAppsPanel.tsx`
- Create: `components/Hub/connected-apps.ts`
- Modify: `config/integration-registry.json` only if required by the existing schema

**Interfaces:**
- `ConnectedApp` contains `id`, `name`, `iconKey`, `category`, `connectionType`, `status`, `workspaceRoute`, and optional `capabilitySummary`.
- `ConnectedAppsPanel` consumes `ConnectedApp[]` and emits `onOpen(appId: string)`.

- [ ] **Step 1: Add a failing test for required connected-app entries.**

The initial matrix must include the existing ecosystem targets visible in the reference, including Vercel, Figma, Canva, OpenAI, Codex, Replit, Hugging Face, Lovable, Jotform, Linear, Notion, Ramp, PostHog, Supabase, Descript, SharePoint, and Outlook Calendar, while their actual status is derived from the integration registry rather than hard-coded green.

- [ ] **Step 2: Implement data-driven connected-app tiles.**

Each tile must show the provider icon, name, and observed status. `ADAPTER MOUNTED`, `CONNECTED`, `TESTED`, `VERIFIED`, `UNKNOWN`, `FAILED`, and `REQUIRES_CONFIGURATION` remain distinct.

- [ ] **Step 3: Add real open behavior.**

Clicking a provider tile opens its configured workspace/connection target or a truthful configuration screen. No tile may be decorative.

- [ ] **Step 4: Add visual treatment matching the supplied Hub reference.**

Preserve the compact dark panel, provider icon rows, cyan/green status indicators, and dense information hierarchy from the reference instead of inventing a new card style.

- [ ] **Step 5: Test tile rendering, keyboard focus, open behavior, and status rendering.**

- [ ] **Step 6: Commit:** `feat: add exact connected apps hub`

---

### Task 3: Attach the existing Character Studio to the Hub

**Files:**
- Modify: `components/Hub/ApexHubShell.tsx`
- Modify: `app/character-studio/page.tsx` only where navigation integration is required
- Create: `components/Hub/WorkspaceRouter.tsx`

**Interfaces:**
- `WorkspaceRouter` maps `HubDestination` to the actual workspace surface.
- `CHARACTER_STUDIO` must navigate to `/character-studio` without losing the shell's visual contract.

- [ ] **Step 1: Add a failing navigation test for `CHARACTER_STUDIO`.**

- [ ] **Step 2: Wire the Hub navigation to `/character-studio`.**

- [ ] **Step 3: Preserve the existing Character Studio capabilities and exact reference-inspired layout.**

The current Character Studio already contains the required Create/Characters/Worlds/Animation/Render tabs, tool rail, viewport, turnaround, sound, dialogue, timeline, audit, Gabby, engines, and bottom operations. Do not replace those working modules with placeholders.

- [ ] **Step 4: Add a return-to-Hub control that is explicit and always available.**

- [ ] **Step 5: Test Hub → Character Studio → Hub navigation and state preservation.**

- [ ] **Step 6: Commit:** `feat: attach character studio to apex hub`

---

### Task 4: Add the missing module/link inventory and no-orphan controls

**Files:**
- Create: `components/Hub/module-manifest.ts`
- Create: `components/Hub/ModuleLauncher.tsx`
- Create: `components/Hub/NoOrphanControl.tsx`
- Create: `tests/hub/module-manifest.test.ts`

**Interfaces:**
- `HubModule` contains `id`, `label`, `destination`, `requiredControl`, `capabilitySource`, and `stateSource`.
- `ModuleLauncher` opens the destination represented by the module.
- `NoOrphanControl` requires an executable callback or navigation target.

- [ ] **Step 1: Write tests that fail when a visible Hub module lacks a destination or action.**

- [ ] **Step 2: Define the module manifest for Workspace, Connected Apps, Engines, Gabby, Audit, Memory, Vault, Projects, Tools, Marketplace, and Character Studio.**

- [ ] **Step 3: Wire every visible button/toggle/tab to the module manifest.**

- [ ] **Step 4: Add truthful disabled/error states where a backend or credential is not configured.**

- [ ] **Step 5: Test the manifest for duplicate IDs, missing routes, and missing action handlers.**

- [ ] **Step 6: Commit:** `feat: enforce no-orphan hub controls`

---

### Task 5: Integrate local Vault/Gatekeeper visibility without exposing secrets

**Files:**
- Create: `components/Hub/VaultStatusPanel.tsx`
- Create: `components/Hub/ProviderTruthPanel.tsx`
- Reuse: existing Vault/Gatekeeper and integration registry modules already present in the repository

**Interfaces:**
- `VaultStatusPanel` returns only `vaultStatus`, `credentialRefCount`, and health/evidence metadata.
- `ProviderTruthPanel` consumes provider status records and renders their observed lifecycle state.

- [ ] **Step 1: Write tests proving raw secret strings are never rendered.**

- [ ] **Step 2: Read the existing local Vault/Gatekeeper status contract.**

- [ ] **Step 3: Add a local Vault module to the Hub with `OPEN VAULT`, `VERIFY VAULT`, and truthful status controls.**

- [ ] **Step 4: Add provider truth states for the connected-app matrix.**

- [ ] **Step 5: Test missing credentials, configured credentials, connection failure, and verified capability paths.**

- [ ] **Step 6: Commit:** `feat: expose local vault and provider truth status`

---

### Task 6: Add self-audit, telemetry, and real-time evidence feed

**Files:**
- Create: `components/Hub/SystemStatusPanel.tsx`
- Create: `components/Hub/AuditFeed.tsx`
- Create: `components/Hub/TelemetryPanel.tsx`
- Reuse: existing audit/state contracts in `audit/` and `core/`

**Interfaces:**
- `SystemStatusPanel` consumes deterministic system-status evidence.
- `AuditFeed` consumes ordered audit events and displays evidence-backed outcomes.
- `TelemetryPanel` displays observed local runtime metrics where available and uses `UNAVAILABLE` rather than invented values.

- [ ] **Step 1: Write failing tests for audit event rendering and truthful unknown states.**

- [ ] **Step 2: Wire the existing audit ledger into the Hub feed.**

- [ ] **Step 3: Add BUILD/RUN/TEST/VERIFY/DEPLOY/PUBLISH action events to the feed.**

- [ ] **Step 4: Add self-audit entry point that runs the existing deterministic system-status comparator rather than a visual-only status routine.**

- [ ] **Step 5: Test that failed/unknown subsystems cannot produce a green `VERIFIED` event.**

- [ ] **Step 6: Commit:** `feat: add evidence-backed hub self audit`

---

### Task 7: Preserve and integrate the original Terminal command surface

**Files:**
- Modify: `components/Terminal/Terminal.tsx`
- Modify: `components/Terminal/TerminalInput.tsx` only if required
- Modify: `components/Terminal/TerminalHeader.tsx` only if required
- Create: `components/Hub/LocalTerminalDrawer.tsx`

**Interfaces:**
- `LocalTerminalDrawer` exposes the existing terminal command executor without creating a second terminal engine.

- [ ] **Step 1: Add a failing test for opening the local terminal from the Hub.**

- [ ] **Step 2: Mount the existing Terminal component behind an explicit `TERMINAL`/`OPEN TERMINAL` action.**

- [ ] **Step 3: Preserve local command history and scrolling.**

- [ ] **Step 4: Ensure terminal commands are routed to the existing executor rather than simulated output when a real executor exists.**

- [ ] **Step 5: Test open/close, command execution, output rendering, and state persistence.**

- [ ] **Step 6: Commit:** `feat: attach local terminal to hub`

---

### Task 8: Match the supplied visual at desktop, tablet, and mobile sizes

**Files:**
- Modify: `app/globals.css`
- Modify: Hub component CSS/modules created in Tasks 1–7
- Create: `tests/visual/apex-hub.visual.spec.ts` or the repository's existing visual-test location if already established

- [ ] **Step 1: Establish desktop reference viewport matching the supplied screenshot.**

- [ ] **Step 2: Match shell geometry: top header, left rail, central workspace, right rail, lower modules, and bottom command bar.**

- [ ] **Step 3: Match typography hierarchy, spacing, borders, surfaces, icon scale, status indicators, and density.**

- [ ] **Step 4: Preserve the exact information architecture while making the layout responsive.**

- [ ] **Step 5: Test tablet and iPhone-sized layouts without removing primary controls.**

- [ ] **Step 6: Run visual comparison against the supplied reference and correct structural deltas.**

- [ ] **Step 7: Commit:** `style: match apex hub reference exactly`

---

### Task 9: Full integration verification

**Files:**
- Modify: `.github/workflows/*` only if the existing CI needs the Hub test commands
- Create: `docs/verification/APEX_HUB_REFERENCE_VERIFICATION.md`

- [ ] **Step 1: Run TypeScript checks.**

- [ ] **Step 2: Run unit/component tests.**

- [ ] **Step 3: Run production build.**

- [ ] **Step 4: Test root Hub navigation and every visible control.**

- [ ] **Step 5: Test Connected Apps status transitions without fabricated green states.**

- [ ] **Step 6: Test Hub → Character Studio → Hub.**

- [ ] **Step 7: Test local Vault status without exposing raw credentials.**

- [ ] **Step 8: Run the self-audit and capture actual evidence references.**

- [ ] **Step 9: Run visual regression against the supplied APEX TERMINAL reference.**

- [ ] **Step 10: Record VERIFIED, OBSERVED, BLOCKED, FAILED, UNKNOWN, and remaining bottlenecks in the verification document.**

- [ ] **Step 11: Commit:** `test: verify exact apex hub integration`

---

## Acceptance Criteria

1. Opening `/` presents the **APEX TERMINAL Hub** as the canonical first screen.
2. The shell matches the supplied reference structure rather than merely resembling it.
3. Connected apps are visible as a first-class Hub region with provider icons and truthful status.
4. Figma, Canva, OpenAI, Codex, Replit, Hugging Face, Lovable, Jotform, Linear, Notion, Ramp, PostHog, Supabase, Descript, SharePoint, Outlook Calendar, and Vercel are represented through the provider registry when available.
5. Every visible button, toggle, tab, rail control, and app tile has a real action path or truthful disabled/error path.
6. Character Studio remains a fully reachable workspace and is not detached from the Hub.
7. The local Terminal is reachable from the Hub and remains usable.
8. Vault/Gatekeeper status is visible without exposing raw secrets.
9. Self-audit uses actual deterministic evidence rather than visual claims.
10. No provider is marked VERIFIED merely because an adapter is registered.
11. The bottom command bar supports BUILD/RUN/TEST/VERIFY/DEPLOY/PUBLISH with real execution pathways or truthful unavailable states.
12. Desktop, tablet, and mobile layouts preserve the information architecture.
13. Production build and tests pass before the work is called verified.
14. Visual verification is performed against the supplied reference, not source inspection alone.

## Spec Coverage Self-Review

- Exact supplied visual: Tasks 1 and 8.
- Existing functionality preserved: Tasks 3, 7, and 9.
- Connected-app Hub: Task 2.
- Missing buttons/toggles/links: Task 4.
- Local Vault/Gatekeeper: Task 5.
- Self-audit/evidence: Task 6.
- Local Terminal: Task 7.
- Responsive/visual regression: Task 8.
- Build/test/verification: Task 9.

No task depends on a fake provider success state, raw credential exposure, or a placeholder control.
