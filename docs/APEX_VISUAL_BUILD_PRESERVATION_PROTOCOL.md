# APEX Visual Build Preservation Protocol v1.1

**Status:** Canonical repository rule
**Scope:** Every APEX Terminal, APEX Hub, Golden World, Sketchpad, UI/UX, screenshot-driven, visual-layout, visual-regression, AI-directed visual editing, and customer-facing commerce task.

## Purpose

When the owner supplies a screenshot, reference image, sketch, mockup, screen recording, or other visual artifact, that artifact is the **visual source of truth for the requested surface** unless the owner explicitly says otherwise.

The job is to reproduce the supplied visual faithfully and then improve it **additively** where improvement is requested or where the improvement clearly preserves the supplied intent and existing capability.

The customer-visible experience is the first layer whenever the product is customer-facing. For commerce, the store/product presentation is the primary experience; analytics, feed audit, AI, repository, and operator tooling are secondary workspaces unless the requested screen explicitly calls for them.

## Absolute rule

> **ANALYZE THE SUPPLIED VISUAL FIRST. PRESERVE IT. THEN UPGRADE IT. NEVER SUBSTITUTE A DIFFERENT DESIGN.**

A visual task must not begin with a generic redesign, template, dashboard replacement, or invented interpretation.

If the owner says **exactly**, **mirror**, **same layout**, **same UI**, or equivalent language, the supplied visual is the visual ceiling and must be matched as closely as technically possible.

If the owner says **upgrade**, preserve the supplied structure, hierarchy, identity, and intent while adding capability. Do not move the product below the supplied baseline.

If the owner explicitly says **reinterpret**, **redesign**, or otherwise authorizes deviation, follow that instruction only to the stated scope.

## Required workflow for every visual task

### 1. RECEIVE

Collect every supplied visual artifact and identify which screen, state, viewport, and product it represents.

### 2. ANALYZE FIRST

Before changing code, inspect the visual for:

- page/shell hierarchy
- header and navigation placement
- left/right/bottom panels
- tab behavior
- content density
- spacing and proportions
- typography hierarchy
- borders and surfaces
- controls and interaction affordances
- status indicators
- scroll containers
- responsive transformations
- visible states and empty states
- relationship between primary and secondary modules
- customer-visible product imagery and identity

Do not infer that a visual is decorative when it may represent an actual workflow.

### 3. AUDIT THE EXISTING APPLICATION

Inspect the actual repository before implementation:

- routes
- components
- state stores
- API handlers
- integrations
- authentication
- persistence
- responsive logic
- scroll behavior
- deployment configuration
- existing tests
- existing visual-regression tests

Create or update a capability inventory.

Classify existing behavior as:

`KEEP` · `UPGRADE` · `INTEGRATE` · `REPAIR` · `UNKNOWN`

### 4. COMPARE VISUAL TO CURRENT PRODUCT

Determine the delta between the supplied visual and the current implementation.

Never solve a visual mismatch by deleting working functionality.

### 5. PRESERVE

The existing working application is the **functional floor**.

The supplied visual is the **visual ceiling** for the requested surface.

The resulting product must satisfy:

`EXISTING VERIFIED CAPABILITIES + SUPPLIED VISUAL + ADDITIVE UPGRADES`

Never:

`EXISTING CAPABILITIES - FUNCTIONALITY`

### 6. IMPLEMENT

Make the smallest safe additive change that achieves the requested visual result.

Prefer:

- stable component identity
- persistent state
- explicit layout containers
- controlled overflow
- intentional scroll restoration
- responsive transformations
- data-driven components
- reusable design tokens
- clear interaction affordances
- explicit attachment to the application shell

Avoid:

- arbitrary redesign
- destructive rewrites
- unnecessary remounts
- replacing the existing shell with a generic dashboard
- `setTimeout` scroll hacks
- fake controls
- placeholder integrations
- detached primary screens

### 7. TEST

Every visual change must test both appearance and behavior.

At minimum verify:

- desktop viewport
- tablet viewport
- mobile/iPhone-sized viewport
- navigation
- tabs
- panel open/close
- collapse/expand
- long content scrolling
- asynchronous updates
- AI streaming where applicable
- route changes
- form interactions
- buttons and toggles
- redirects/links
- existing integrations affected by the change
- customer-visible product flow where applicable

### 8. VISUAL REGRESSION

Compare the resulting rendered screen against the supplied reference.

Check:

- structure
- hierarchy
- panel placement
- dimensions/proportions
- typography
- spacing
- controls
- status indicators
- responsive behavior
- overall visual identity
- shell attachment
- customer-visible content

Do not call a visual task complete from source inspection alone.

### 9. VERIFY

Only report a capability as verified when the relevant test actually ran and produced evidence.

Truth states are separate:

`DISCOVERED` → `CONFIGURED` → `CONNECTED` → `TESTED` → `VERIFIED`

Operational outcomes:

`VERIFIED` · `OBSERVED` · `BLOCKED` · `FAILED` · `UNKNOWN`

A screenshot, configuration entry, HTTP 200, or visible button does not by itself prove end-to-end functionality.

### 10. REPORT

Every completed visual task must report:

1. Preserved
2. Added
3. Repaired
4. Integrated
5. Tested
6. Verified
7. Blocked
8. Failed
9. Remaining bottlenecks
10. Evidence

## Screenshot interpretation law

If the owner supplies a visual and does not explicitly authorize a different interpretation:

- do not make it "kind of similar"
- do not simplify its layout
- do not replace its navigation
- do not remove panels
- do not invent a different design system
- do not shrink the information architecture merely to make implementation easier
- do not discard supplied visual hierarchy
- do not treat the screenshot as optional inspiration

The screenshot is an instruction about the requested visual result.

## Customer-visible-first law

For any customer-facing APEX surface, especially commerce/storefront work:

> **SHOW THE CUSTOMER WHAT THE CUSTOMER CAME TO SEE FIRST.**

For merchandise/store experiences, the primary content should make the following immediately understandable:

1. product image
2. product name
3. price or relevant commercial information
4. primary action
5. supporting information as appropriate

The store/customer experience must not be displaced by operator analytics, feed audit, AI, repository, telemetry, or administrative modules merely because those modules are technically important. Those capabilities belong in their appropriate tabs/workspaces.

The visual hierarchy should follow the supplied reference and established product conventions while remaining unmistakably APEX.

## Edge-anchored primary workspace law

The primary application surface must belong to the application shell.

> **PRIMARY SCREENS DO NOT FLOAT AS UNATTACHED ISLANDS.**

A primary screen must be structurally anchored to one or more of:

- the left navigation/workspace rail
- the top header/tab/workspace bar
- the right attached inspector/details rail
- the bottom command/activity/status bar
- the available viewport edges when operating full-screen

Large unexplained empty space must not separate the primary application surface from its shell merely to create a floating-card aesthetic.

Intentional overlays are different: modals, dialogs, command palettes, and transient AI panels may float when their interaction model requires it, but they must have clear purpose and controls.

## No-guessing interaction law

Every persistent or temporary surface must communicate what it is and how it can be controlled.

If something is a tab, it must behave like a tab.

If something is a sidebar, it must behave like a sidebar.

If something is a modal, it must behave like a modal.

If something is temporary, it must have a clear way to dismiss, collapse, minimize, close, or return to the underlying workspace when applicable.

### Required controls when applicable

- tabs: active state, switch, close/X, overflow handling, and `+`/new-workspace behavior where supported
- sidebars: collapse/expand and clear identity
- dialogs/modals: clear title/purpose and close/X
- command palettes: explicit dismissal and return to the prior surface
- temporary panels: collapse/close/reopen path

Do not force the user to guess whether a surface is a tab, panel, modal, drawer, or permanent navigation element.

## Visual addressing and AI targeting law

APEX visual surfaces must be addressable by humans and by GABBY/AI without requiring vague descriptions such as "that thing over there."

When a screen contains multiple meaningful visual targets, the system may expose a **Visual Target Index** as a small, unobtrusive overlay or inspection mode.

### Target numbering

When enabled, targets are numbered in normal reading order:

**left-to-right across a row, then top-to-bottom to the next row.**

For example:

`1  2  3  4`

`5  6  7  8`

`9 10 11 12`

The numbering must be deterministic for the current rendered state. If the layout changes, the index is recalculated from the current visible target order.

### Target labels

Each target should expose, when available:

- target number
- semantic name
- component/type
- optional state
- optional action affordance

The index must not permanently obscure or distort the customer-facing design. It belongs to an inspection/AI-editing mode and may appear as small labels near the relevant targets or in an inspection layer.

### Human-AI collaboration

The owner should be able to say things such as:

> **"Target 1: change the product image."**

> **"Target 7: rename this product."**

> **"Target 12: move this panel to the right."**

GABBY/AI should resolve the numbered target to the actual rendered component and apply the requested change while preserving all other targets and capabilities.

This is the purpose of the Sketchpad/visual-generation layer: the owner can generate or inspect the visual, identify a target, and iterate directly against the rendered surface rather than translating visual intent into ambiguous prose.

### Target stability

Target IDs should remain stable during a single inspection state where possible. After structural changes, the system must recalculate and visibly indicate that the target map changed rather than silently applying an old number to a new component.

## Sketchpad visual collaboration law

The Sketchpad is a visual collaboration layer, not permission to replace the application.

The workflow is:

`REFERENCE IMAGE → SKETCHPAD/GENERATED VISUAL → VISUAL TARGET INDEX → AI/HUMAN EDIT → RENDER → COMPARE → VERIFY`

Generated images are evidence and design inputs. They do not override the existing application capability floor unless the owner explicitly authorizes the change.

The system should support an iterative loop in which the owner can point to a visual target, describe the change in the message box, regenerate or modify the visual, and immediately compare the result.

## Upgrade law

An upgrade may improve:

- accessibility
- responsiveness
- performance
- stability
- interaction behavior
- state preservation
- verification
- integration depth
- security
- maintainability
- visual targeting
- customer clarity

provided the improvement does not reduce the supplied visual identity or existing working capability.

When a change would materially alter the visual composition, stop and obtain explicit authorization rather than silently redesigning it.

## Browser-style workspace tabs

Where the requested visual includes workspace tabs, tabs are treated as **open workspaces**, not replacements for permanent navigation.

Required behavior when applicable:

- multiple workspaces can remain open
- active tab is clearly indicated
- tabs retain their state
- `+` opens a workspace
- tabs can be closed individually with an obvious close/X affordance
- tabs can be collapsed/minimized where the workspace model supports it
- closed workspaces have a clear reopen path
- overflow is controlled rather than breaking the shell
- mobile uses controlled horizontal tab scrolling
- the sidebar remains the destination/navigation layer
- tabs remain the currently opened work layer

The exact number of tabs is determined by the supplied product requirements; do not hard-code an arbitrary limit unless the product specification requires one.

## Scroll stability law

Visual work must explicitly guard against viewport jumps.

The application must not unexpectedly jump to the top when:

- switching tabs
- opening/closing panels
- changing routes
- selecting tools
- changing form values
- receiving AI output
- updating status
- receiving asynchronous data
- opening GABBY
- changing responsive layout

Root causes must be fixed rather than hidden with timing hacks.

## Repository placement

This protocol is canonical for APEX Terminal and should be referenced by visual implementation work rather than duplicated into unrelated components.

Related canonical documents:

- `docs/APEX_TERMINAL_UIUX_SPEC.md`
- `docs/GODSPEED_UNIFIED_WORKSTATION_ENGINE_SPEC.md`
- `docs/CANONICAL_STATE_SCHEMA.md`
- `config/integration-registry.json`

## Final law

**PRESERVE → ANALYZE → ADD → INTEGRATE → TEST → VERIFY → COMPOUND.**

For visual work:

**SUPPLIED VISUAL = VISUAL SOURCE OF TRUTH.**

**CUSTOMER EXPERIENCE = FIRST VIEW FOR CUSTOMER-FACING SURFACES.**

**PRIMARY SCREEN = EDGE-ANCHORED WORKSPACE, NOT A RANDOM FLOATING ISLAND.**

**EVERY PERSISTENT/TRANSIENT SURFACE = CLEAR IDENTITY + CLEAR CONTROL.**

**VISUAL TARGETS = HUMAN/AI ADDRESSABLE IN READING ORDER WHEN INSPECTION MODE IS ENABLED.**

**EXISTING VERIFIED APPLICATION = FUNCTIONAL FLOOR.**

**ONLY MOVE UP. NEVER MOVE DOWN.**
