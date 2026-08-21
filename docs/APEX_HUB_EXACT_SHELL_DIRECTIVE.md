# APEX HUB / TERMINAL — EXACT SHELL DIRECTIVE

**Status:** CANONICAL USER-APPROVED DESIGN DIRECTIVE  
**Scope:** APEX Hub, APEX Terminal root shell, customer/creator Hub experience, connected-app ecosystem surface, Gabby experience, and every future implementation that changes the shell.  
**Authority:** The supplied APEX reference images and the owner's explicit instruction that the shell is to be reproduced exactly.  
**Implementation status:** DESIGN LOCKED; runtime implementation remains subject to testing and verification.

## 1. NON-NEGOTIABLE VISUAL AUTHORITY

**THIS IS THE SHELL.**

The supplied APEX Hub / Terminal reference is not inspiration, a mood board, a loose design direction, or an approximate target.

It is the **visual source of truth for the APEX Hub / Terminal shell**.

When the owner says:

- exact
- mirror
- carbon copy
- exactly this
- this is the shell
- this is the Hub

the builder must interpret that literally.

### Required result

`SUPPLIED SHELL REFERENCE → EXACT APEX SHELL`

Not:

`SUPPLIED SHELL REFERENCE → SIMILAR DASHBOARD`

Not:

`SUPPLIED SHELL REFERENCE → INSPIRED REDESIGN`

Not:

`SUPPLIED SHELL REFERENCE → GENERIC SaaS UI`

## 2. SHELL AND ENGINE ARE SEPARATE CONCERNS

The shell may be redesigned/recomposed to match the supplied reference.

The underlying APEX capabilities must not be discarded merely because their current presentation changes.

Required architecture:

```text
EXACT APEX HUB / TERMINAL SHELL
                │
                ├── Gabby / AI
                ├── Projects
                ├── Character Studio
                ├── Worlds
                ├── Animation
                ├── Render
                ├── Revenue
                ├── Connections / Ecosystem
                ├── Provider Registry
                ├── Omni Vault
                ├── Gatekeeper
                ├── Audit
                ├── Truth Gate
                ├── Memory
                ├── Local Models
                └── Local Terminal
                        │
                        ▼
                EXISTING APEX SERVICES
```

**CHANGE THE SHELL. PRESERVE THE ENGINE.**

## 3. FUNCTIONALITY FLOOR

The existing working application is the functional floor.

Changing the shell must not remove:

- routes
- modules
- providers
- integrations
- actions
- buttons
- toggles
- project state
- audit
- Truth Gate
- Memory
- Vault/Gatekeeper
- Terminal
- Character Studio
- Worlds
- Animation
- Render
- Build
- Run
- Test
- Verify
- Deploy
- Publish
- Gabby
- provider state
- capability state
- local execution

If a capability exists but has no visible control in the new shell, **add the control or link**.

If a control exists but has no working action, **repair the action**.

If a capability is buried behind another surface, **expose a real route or module**.

Do not delete a capability because its existing UI does not fit the new shell.

## 4. REFERENCE: GABBY HUB

The supplied Gabby image is the authoritative visual reference for the APEX Hub identity.

Gabby is a first-class creation surface, not a decorative chatbot card.

The Hub must provide an actual chat box where the user can communicate with the AI.

The interaction model is:

`USER REQUEST → GABBY → CAPABILITY ROUTING → AUTHORIZED EXECUTION → RESULT → EVIDENCE`

Gabby must be able to operate in the context of the current project, workspace, selected object, and available capabilities.

The visual identity of Gabby must remain consistent with the supplied reference.

## 5. AVATAR / CHARACTER CREATION

The character experience must support the user's creation flow from the Hub and/or Character Studio.

The architecture must accommodate:

- avatars
- skins
- clothing
- materials
- hairstyles
- accessories
- poses
- emotes
- movement styles
- animations
- voices
- abilities
- premium variants

These are product-capable surfaces and must remain extensible for future marketplace/commerce functionality.

The shell must not imply that only one character exists.

## 6. REFERENCE: APEX TERMINAL WORKSPACE

The supplied male-character APEX Terminal image is the authoritative reference for the primary workspace shell.

Preserve the reference's information architecture and visual composition, including where applicable:

- APEX identity/header
- Gabby command/search surface
- truth/verification status
- owner/project context
- left workspace navigation
- connected-app region
- central creation workspace
- right Gabby/context rail
- project status
- engines
- system telemetry
- Foley/sound design
- AI dialogue/ADAK
- timeline/sequence
- real-time audit feed
- bottom BUILD/RUN/TEST/VERIFY/DEPLOY/PUBLISH command surface
- Truth status
- Gabby online status

The existing Character Studio remains a real workspace and must not be replaced with a screenshot, placeholder, or simplified mockup.

## 7. REFERENCE: CONNECTED-APP / PROVIDER HUB

The supplied integration reference defines the visual and information architecture for the APEX Connections / Ecosystem layer.

The provider inventory is a real workspace surface.

It must be reachable from the shell through an obvious Connections/Ecosystem control.

Provider entries may include, when present in the APEX registry:

- GitHub
- Vercel
- Figma
- Canva
- OpenAI
- Codex
- Replit
- Hugging Face
- Lovable
- Jotform
- Linear
- Notion
- Ramp
- PostHog
- Supabase
- Descript
- SharePoint
- Outlook Calendar
- Stripe
- Shopify
- Cloudflare
- Google Cloud
- BigQuery
- Vertex AI
- Cloud Run
- PayPal
- Printify
- Google Workspace
- Email
- other approved APEX providers

Provider status must come from the real Provider Registry/adapter state.

The UI must never turn a provider green merely because its name appears in the registry.

## 8. CONNECTIONS / ECOSYSTEM DRAWER

Connections/Ecosystem should be an obvious persistent shell control that opens a real attached panel/drawer/workspace.

Example behavior:

```text
MAIN APEX HUB
        │
        └── CONNECTIONS / ECOSYSTEM
                  │
                  ▼
          PROVIDER INVENTORY
                  │
                  ├── GitHub
                  ├── Vercel
                  ├── Figma
                  ├── Canva
                  ├── OpenAI
                  ├── Codex
                  ├── Lovable
                  ├── Hugging Face
                  ├── Stripe
                  ├── Shopify
                  ├── Supabase
                  └── ...
```

Selecting a provider must open its real provider detail/configuration/workspace path.

Closing the panel must return the user to the same workspace without destroying project/context state.

## 9. OMNI VAULT / LOCAL-FIRST

The shell must expose the local-first APEX security/runtime surfaces without exposing secrets.

The intended path remains:

`VAULT → credentialRef → GATEKEEPER → AUTHORIZED EXECUTOR → PROVIDER → RESULT → EVIDENCE → TRUTH GATE`

The UI may display:

- Vault health
- credential reference count
- provider configuration state
- authorization state
- evidence state

The UI must never display raw production credentials.

## 10. LOCAL TERMINAL

The local Terminal remains a first-class APEX capability.

The new shell must provide an obvious route/drawer/control to reach the existing local Terminal.

Do not create a second terminal engine merely to make the shell look complete.

Reuse the existing local Terminal implementation and execution path.

## 11. NO-ORPHAN-CONTROL LAW

Every visible interactive control must have one of these real outcomes:

1. navigation
2. state transition
3. adapter execution
4. workspace open/close
5. configuration flow
6. truthful disabled state
7. truthful error state

A visible control that does nothing is a defect.

A visible status that is not backed by evidence is a defect.

## 12. TRUTH / NO-FAKE-GREEN

The shell is not permitted to manufacture completion states.

Examples:

`ADAPTER MOUNTED ≠ CONNECTED`

`CONNECTED ≠ VERIFIED`

`PROMPT SUBMITTED ≠ GENERATION COMPLETE`

`BUTTON CLICKED ≠ DEPLOYMENT SUCCESS`

`REPOSITORY FILE EXISTS ≠ RUNTIME VERIFIED`

Only actual execution/readback/evidence may produce VERIFIED.

## 13. VISUAL + FUNCTIONAL ACCEPTANCE

The implementation is not accepted merely because it looks close.

It must satisfy both:

### Visual

- supplied shell structure reproduced
- navigation hierarchy preserved
- panel placement preserved
- visual density preserved
- typography hierarchy preserved
- controls placed in the supplied information architecture
- Gabby identity preserved
- connected-app ecosystem represented
- responsive behavior preserves the information architecture

### Functional

- every existing capability remains reachable
- every visible control has a real path
- Character Studio remains functional
- Gabby remains functional
- Connections/Ecosystem opens
- provider details open
- Terminal remains usable
- Vault/Gatekeeper remains protected
- Audit remains available
- Memory remains available
- Truth Gate remains available
- Build/Run/Test/Verify/Deploy/Publish remain available
- project state survives shell navigation
- no fake-green states are introduced

## 14. FUTURE BUILDER INSTRUCTION

Any future builder, AI, agent, developer, contractor, or integration worker must read this file before modifying the APEX Hub / Terminal shell.

If another document conflicts with this directive on the requested shell's visual composition, this directive controls the visual requirement unless the owner explicitly changes it.

Do not ask the owner to repeatedly explain that the supplied shell is exact.

Do not return a "kind of similar" shell and call the task complete.

Do not simplify the shell because a simpler implementation is easier.

Do not remove functionality to make the visual match.

Do not replace the supplied visual with a generic dashboard.

## 15. PERMANENT APEX SHELL LAW

> **THIS IS THE SHELL.**
>
> **THE SUPPLIED REFERENCE IS THE VISUAL SOURCE OF TRUTH.**
>
> **THE EXISTING APPLICATION IS THE FUNCTIONAL FLOOR.**
>
> **CHANGE THE SHELL WITHOUT LOSING THE ENGINE.**
>
> **IF A CAPABILITY IS MISSING FROM THE SHELL, ADD THE CONTROL OR LINK.**
>
> **IF A CONTROL IS PRESENT BUT DOES NOT WORK, REPAIR IT.**
>
> **DO NOT RETURN AN APPROXIMATION. RETURN THE EXACT MIRROR WITH ALL FUNCTIONALITY.**
>
> **VERIFY THE RESULT BEFORE CLAIMING COMPLETION.**
