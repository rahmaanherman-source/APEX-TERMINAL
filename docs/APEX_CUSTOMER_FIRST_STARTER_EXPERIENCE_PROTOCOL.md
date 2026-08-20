# APEX Customer-First Starter Experience Protocol v1.1

**Status:** Canonical companion rule to `APEX_VISUAL_BUILD_PRESERVATION_PROTOCOL.md`
**Scope:** APEX Hub, customer-facing commerce/storefront surfaces, AI-generated starter screens, Sketchpad visual generation, and operator workspaces.

## Core law

> **THE CUSTOMER EXPERIENCE IS THE CENTER OF THE OPERATOR WORKSPACE.**

When the owner is working inside APEX on a customer-facing product, the **middle/primary workspace must show the customer-facing experience itself**. The owner should be able to see what the customer sees without switching to a separate "customer view" just to understand the page.

The operator workspace is therefore organized as:

`LEFT/RIGHT NAVIGATION + SECONDARY OPERATOR TABS/PANELS + CUSTOMER VIEW IN THE CENTER + GABBY FLOATING ASSISTANT`

The customer-facing surface is the primary workspace. Analytics and administrative tooling are secondary workspaces.

## Customer-visible-first workspace law

For a commerce/store product, the center of the workspace shows the actual storefront/product experience:

- product imagery
- product names
- pricing/commercial information
- primary actions
- categories/discovery
- supporting product information
- the same visual hierarchy the customer receives

The operator should not have to reconstruct the customer experience from analytics or administrative screens.

> **IF THE CUSTOMER WOULD SEE IT, THE OWNER SHOULD BE ABLE TO SEE IT IN THE CENTER.**

## Operator tools are secondary

The following are **operator workspaces**, not the primary customer-facing canvas:

- Analytics
- Feed Audit
- Repository
- Integrations
- Inventory administration
- AI/system controls
- telemetry
- diagnostics
- deployment/status
- other back-office tooling

These capabilities may be opened as tabs, side panels, drawers, or attached workspaces according to the shell design, but they must not displace the customer experience by default.

They must be easy to collapse, minimize, close, reopen, and switch between.

## Edge-anchored workspace rule

The customer workspace must be attached to the application shell and viewport. It must not appear as a detached floating card surrounded by unexplained empty space.

Acceptable primary anchoring includes:

- left navigation rail
- top workspace/tab bar
- right attached inspector/tool rail
- bottom command/status bar
- full available viewport

Secondary panels may attach to the left or right side. They may collapse into tabs or rails when not needed.

The only intentionally floating persistent interaction surface in the main working experience is the **GABBY assistant interface**, because its purpose is direct conversation with the owner while the customer-facing workspace remains visible underneath.

## GABBY floating assistant law

GABBY is the exception to the no-floating-primary-screen rule.

The GABBY interaction surface may float above the workspace and must support:

- typed messages
- microphone/voice input where enabled
- conversational responses
- visual-edit commands
- direct interaction with the currently visible customer workspace
- clear minimize/collapse/close controls
- a clear reopen path

GABBY should not obscure the customer experience unnecessarily. The owner can talk to or type to GABBY while continuing to see the customer-facing screen.

The intended loop is:

`SEE CUSTOMER VIEW → TALK/TYPE TO GABBY → TARGET/REQUEST CHANGE → APPLY → RENDER → SEE RESULT`

## Customer-first starter experience

Every customer-facing build begins with a **Starter Experience**:

1. Present a complete initial layout.
2. Make the intended product/service immediately understandable.
3. Show the customer-facing content in its real visual context.
4. Give the customer a clear place to begin.
5. Let the customer describe what they want.
6. Generate the first screen from that description.
7. Render that screen as the actual working customer surface.
8. Preserve it while adding the remaining capabilities.

The first screen is not a disposable mockup. It is the initial working state of the product.

## "Describe it to us" generation flow

The starting experience should communicate naturally:

> **Describe it to us. We'll generate your first screen.**

Then:

`CUSTOMER DESCRIPTION → FIRST SCREEN → CENTER CUSTOMER VIEW → EDIT/ITERATE → VERIFY`

The generated first screen must be rendered as an actual application surface, not merely returned as an image or detached preview.

## Visual Target Index

When visual inspection/editing mode is enabled, meaningful visible targets are numbered in normal reading order:

`1  2  3  4`

`5  6  7  8`

`9 10 11 12`

The index is temporary and unobtrusive. It exists so the owner and GABBY can address the exact rendered element without ambiguity.

Examples:

- `1 — change the picture`
- `4 — move this box to the right`
- `7 — change the dropdown`
- `12 — rename this section`

After a structural change, the target map is recalculated so an old number is never silently applied to a different element.

## Sketchpad collaboration law

The Sketchpad is the visual collaboration/generation layer behind this workflow, not a replacement for the application.

`REFERENCE → SKETCHPAD/GENERATED VISUAL → TARGET → GABBY/HUMAN EDIT → CENTER CUSTOMER VIEW → COMPARE → VERIFY`

The owner can generate a visual, inspect it, point to a target, type or speak the requested change, and see the updated customer-facing result in the same workspace.

## Tabs and side workspaces

Operator workspaces should behave like deliberate browser-style workspaces where appropriate:

- active tab is obvious
- tabs retain state
- `+` opens a workspace where supported
- individual tabs can close with an obvious `X`
- secondary panels can collapse/minimize
- closed workspaces have a clear reopen path
- overflow is controlled
- mobile uses controlled horizontal tab scrolling
- the central customer workspace remains the primary destination

Do not make the owner guess whether a surface is a tab, panel, drawer, modal, or permanent navigation.

## Preservation law

This layout rule is additive and must not remove verified capabilities.

`EXISTING VERIFIED CAPABILITIES + CUSTOMER-CENTERED WORKSPACE + SECONDARY OPERATOR TABS + GABBY ASSISTANT + REQUESTED UPGRADES`

never:

`EXISTING CAPABILITIES - FUNCTIONALITY`

## Relationship to visual preservation

This document is a companion to:

`docs/APEX_VISUAL_BUILD_PRESERVATION_PROTOCOL.md`

The visual protocol remains authoritative for supplied-reference fidelity, visual regression, shell attachment, target numbering, preservation, testing, and verification. This protocol defines the customer-centered operator workspace and the intentional GABBY floating assistant exception.

## Final law

**CUSTOMER VIEW IN THE CENTER. OPERATOR TOOLS IN TABS/PANELS. GABBY FLOATS SO THE OWNER CAN TALK/TYPE WHILE SEEING THE CUSTOMER VIEW. NOTHING IMPORTANT FLOATS RANDOMLY. EVERYTHING HAS A CLEAR PLACE, IDENTITY, AND CONTROL.**
