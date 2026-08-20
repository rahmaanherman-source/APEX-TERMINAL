# APEX Visual Build Preservation Protocol v1.0

**Status:** Canonical repository rule
**Scope:** Every APEX Terminal, APEX Hub, Golden World, Sketchpad, UI/UX, screenshot-driven, visual-layout, or visual-regression task.

## Purpose

When the owner supplies a screenshot, reference image, sketch, mockup, screen recording, or other visual artifact, that artifact is the **visual source of truth for the requested surface** unless the owner explicitly says otherwise.

The job is to reproduce the supplied visual faithfully and then improve it **additively** where improvement is requested or where the improvement clearly preserves the supplied intent and existing capability.

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

Avoid:

- arbitrary redesign
- destructive rewrites
- unnecessary remounts
- replacing the existing shell with a generic dashboard
- `setTimeout` scroll hacks
- fake controls
- placeholder integrations

### 7. TEST

Every visual change must test both appearance and behavior.

At minimum verify:

- desktop viewport
- tablet viewport
- mobile/iPhone-sized viewport
- navigation
- tabs
- panel open/close
- long content scrolling
- asynchronous updates
- AI streaming where applicable
- route changes
- form interactions
- buttons and toggles
- redirects/links
- existing integrations affected by the change

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

provided the improvement does not reduce the supplied visual identity or existing working capability.

When a change would materially alter the visual composition, stop and obtain explicit authorization rather than silently redesigning it.

## Browser-style workspace tabs

Where the requested visual includes workspace tabs, tabs are treated as **open workspaces**, not replacements for permanent navigation.

Required behavior when applicable:

- multiple workspaces can remain open
- active tab is clearly indicated
- tabs retain their state
- `+` opens a workspace
- tabs can be closed individually
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

**EXISTING VERIFIED APPLICATION = FUNCTIONAL FLOOR.**

**ONLY MOVE UP. NEVER MOVE DOWN.**
