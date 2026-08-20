# APEX Customer-First Starter Experience Protocol v1.0

**Status:** Canonical companion rule to `APEX_VISUAL_BUILD_PRESERVATION_PROTOCOL.md`
**Scope:** APEX Hub, customer-facing commerce/storefront surfaces, AI-generated starter screens, Sketchpad visual generation, and any separately packaged model/product that generates customer UI.

## Core law

> **THE CUSTOMER SEES THE THING FIRST.**

When a customer enters a customer-facing product, the first rendered experience is the product/customer experience itself — not analytics, feed audit, repository tooling, telemetry, operator controls, or an unexplained floating panel.

The system starts from a real, usable layout rather than an empty canvas.

## Starter experience law

Every customer-facing build begins with a **Starter Experience**:

1. Present a complete initial layout.
2. Make the intended product/service immediately understandable.
3. Show the customer-facing content in its real visual context.
4. Give the customer a clear place to begin.
5. Let the customer describe what they want.
6. Generate the first screen from that description.
7. Preserve the generated screen as the current visual working surface.
8. Add the remaining capabilities without displacing the customer experience.

The first screen is not a disposable mockup. It is the initial working state of the product.

## Commerce/store rule

For a store or merchandise product, the starter experience begins with the storefront the customer would actually shop from.

The customer should immediately see, as appropriate:

- product imagery
- product names
- pricing/commercial information
- primary actions
- categories or discovery controls
- supporting product information

Operator analytics, feed audit, inventory administration, AI controls, repository views, and system telemetry belong in their own tabs/workspaces unless the customer-facing screen explicitly requires them.

## "Describe it to us" generation flow

The customer-facing starting flow should communicate the model naturally:

> **Describe it to us. We'll generate your first screen.**

The system then:

`CUSTOMER DESCRIPTION → FIRST SCREEN → RENDERED CUSTOMER VIEW → EDIT/ITERATE → VERIFY`

The generated first screen must be rendered as an actual application surface, not merely returned as an image or detached preview.

## Separate-model rule

If the Starter Experience is packaged and sold as a separate model, assistant, generator, or product, it retains the same APEX visual laws:

- customer-facing first view
- supplied visual preservation
- functional capability preservation
- edge-anchored primary workspace
- clear tabs/panels
- explicit collapse/close/reopen controls
- Visual Target Index when inspection mode is enabled
- Sketchpad/visual iteration
- test and visual regression verification

A separate product may have its own identity, but it does not bypass these foundational interaction rules.

## Direct manipulation law

The customer/user may interact directly with visible layout objects where the product supports visual editing.

Examples include:

- moving a box/card
- resizing a section
- changing a dropdown
- changing a product image
- changing a name or label
- changing placement
- changing visibility
- opening or closing a panel
- changing the order of visible elements

The interface should make these interactions obvious. If a control is editable, the user should not have to guess that it is editable.

## Human + AI editing loop

The Sketchpad/visual editing layer supports a shared visual workspace:

`SEE → POINT → DESCRIBE → GENERATE/EDIT → RENDER → COMPARE → KEEP OR CHANGE`

The human can directly manipulate the interface. GABBY/AI can manipulate the same rendered surface through semantic target addressing.

If Visual Target Index is enabled, the user can say:

- `1 — change the picture`
- `4 — move this box to the right`
- `7 — change the dropdown`
- `12 — rename this section`

The system resolves the target against the current rendered state and changes only what was requested.

## Customer view is the reference view

When the user is designing a customer-facing product, the primary inspection view should answer:

> **"What does the customer see?"**

The operator can then open secondary workspaces for analytics, feed audit, AI, repository, integrations, or administration without replacing the customer-facing starting surface.

## No blank-canvas default

Do not default the customer to an empty, unexplained canvas when the product can provide a meaningful starter layout.

The starter layout is the first thing the system gives the customer to work with.

## Preservation law

Starter layouts are additive. They must not remove verified existing capabilities.

`EXISTING VERIFIED CAPABILITIES + STARTER EXPERIENCE + SUPPLIED VISUAL + REQUESTED UPGRADES`

never:

`EXISTING CAPABILITIES - FUNCTIONALITY`

## Relationship to the visual protocol

This document is a companion to:

`docs/APEX_VISUAL_BUILD_PRESERVATION_PROTOCOL.md`

The visual protocol controls supplied-reference fidelity, visual regression, shell attachment, tabs, panels, targeting, and preservation. This protocol adds the **customer-first starter experience and describe-to-generate flow**.

## Final law

**CUSTOMER FIRST. START WITH A REAL LAYOUT. LET THEM DESCRIBE IT. GENERATE THE FIRST SCREEN. THEN BUILD OUT THE REST WITHOUT TAKING THE CUSTOMER EXPERIENCE AWAY.**
