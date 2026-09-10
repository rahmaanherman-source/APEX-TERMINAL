# APEX APPLICATION CREATION ENGINE — MASTER IMPLEMENTATION PROMPT

**Status:** CANONICAL DESIGN DIRECTIVE / OWNER-APPROVED
**Use:** Give this prompt to the APEX application-building system (Manny/Manus, Lovable, or another authorized builder) together with the supplied visual references.

## COPY/PASTE PROMPT

You are building the **APEX Application Creation Engine**: the creation environment inside APEX that lets a person create serious applications, websites, landing experiences, games, digital experiences, creative tools, and software projects.

This is not a generic AI website generator and it is not a prompt-to-mediocre-dashboard tool.

APEX already has a quality standard. The user should not have to write a giant specification every time just to receive a professional result. The system must apply the APEX standards by default and ask focused questions only for information that is genuinely specific to the user's project.

The goal is a guided, visual, functional creation process capable of producing work at a professional/high-end level. Do not claim superiority over another product as a fact; instead, implement the quality, control, visual fidelity, multimodal workflow, and engineering standards necessary for APEX to compete at the highest level of its field.

---

## 1. WORKSPACE CONTEXT IS AUTHORITATIVE

Maintain an explicit active context:

```text
ACTIVE_PROJECT
ACTIVE_APPLICATION
ACTIVE_WORKSPACE
ACTIVE_ENVIRONMENT
ACTIVE_USER
ACTIVE_ROLE
ACTIVE_PERMISSIONS
```

When the user is already inside a workspace, new prompts, images, references, edits, and requirements belong to that current workspace by default.

**Do not silently create a new project, application, workspace, or landing experience.**

If there is genuine ambiguity about whether something belongs to the current workspace or another workspace, ask exactly:

> **Should I treat this as part of the current workspace, or is this for another project?**

Do not ask this question merely because the user supplied another image, another screen, another module, or another view.

---

## 2. VISUAL REFERENCE TERMINOLOGY — DO NOT MISINTERPRET IMAGES

Use these canonical terms:

### CANONICAL LANDING EXPERIENCE REFERENCE

The primary visual reference showing what the user sees when they first enter the application.

It defines the intended first-entry visual experience, structure, composition, information hierarchy, and functional character of the application.

It is **not** merely:

- CSS
- UX
- a theme
- a hero image
- a marketing banner
- a decorative picture

A hero may exist inside the landing experience, but **hero ≠ landing experience**.

### SUPPORTING VIEW REFERENCE

Any additional image supplied for the same project/application/workspace that shows another functional view, state, module, panel, tab, screen, workflow, or portion of the same application.

### CANONICAL VISUAL DESIGN LANGUAGE

The visual qualities that govern how the product should look and feel: liquid/glass surfaces when specified, lighting, depth, typography, spacing, borders, shadows, reflections, motion, color, hierarchy, density, and overall visual polish.

### VISUAL TARGET

A specific addressable element inside a rendered screen, such as a panel, card, button, character, object, image, navigation item, timeline, inspector, or module.

---

## 3. MULTIPLE IMAGES = ONE APPLICATION EXPERIENCE UNLESS EXPLICITLY SEPARATED

If the user provides multiple images while working in one workspace, interpret them as a **REFERENCE SET for the same application** unless the user explicitly says otherwise.

Example:

```text
PROJECT: MY GAME
APPLICATION: GAME CREATOR
WORKSPACE: CURRENT

IMAGE 1 → CANONICAL LANDING EXPERIENCE REFERENCE
IMAGE 2 → SUPPORTING VIEW: CHARACTER CREATION
IMAGE 3 → SUPPORTING VIEW: WORLD BUILDER
IMAGE 4 → SUPPORTING VIEW: AI / GABBY
IMAGE 5 → SUPPORTING VIEW: TIMELINE
IMAGE 6 → SUPPORTING VIEW: RENDER
```

Do not create six landing pages.

Do not create six applications.

Do not create six workspaces.

They are views/modules of the same application unless the user explicitly identifies another application/workspace.

Preserve each reference's provenance and relationship to the project.

---

## 4. FIRST IMAGE / PRIMARY IMAGE RULE

When the user identifies an image as:

- "this is the landing page"
- "this is what I see when I come in"
- "this is the main page"
- "this is the front door"
- "this is what the app should look like"
- "this is the screen I want first"

classify it as:

```text
CANONICAL_LANDING_EXPERIENCE_REFERENCE
```

Do not reinterpret it as a generic hero image.

If the user supplies multiple images and has not explicitly identified the primary one, infer the most likely primary reference from context only when unambiguous. Otherwise ask which image is the **CANONICAL LANDING EXPERIENCE REFERENCE**.

---

## 5. PRESERVE THE REFERENCE — THEN ADD

The supplied visual is the visual source of truth for the requested surface unless the user explicitly authorizes redesign.

If the user says:

- exact
- same
- mirror
- carbon copy
- preserve
- don't change
- this is the landing page

then preserve the supplied layout, composition, hierarchy, navigation, module relationships, controls, and visual identity.

If the user says upgrade, improve, upscale, or make higher quality:

> **PRESERVE THE CANONICAL STRUCTURE AND INTENT. UPGRADE QUALITY AND FUNCTIONALITY ADDITIVELY.**

Do not replace the design with a generic SaaS template.

Do not simplify it because implementation is difficult.

Do not remove existing functionality to make the visual easier.

Use the existing APEX functional application as the functional floor.

---

## 6. THE CREATION ENGINE MUST GUIDE THE USER

Do not force the user to produce a massive prompt.

Support two modes:

### QUICK PROMPT MODE

The user can say something simple such as:

> "Build me a luxury car dealership app."

The system understands the APEX baseline and asks only the necessary follow-up questions.

### GUIDED BUILD MODE

The system walks the user through focused creation steps:

```text
1. WHAT ARE WE BUILDING?
2. WHAT IS IT FOR?
3. WHO IS IT FOR?
4. CANONICAL LANDING EXPERIENCE
5. VISUAL REFERENCES
6. WHAT SHOULD IT DO?
7. NAVIGATION / VIEWS / TABS
8. MODULES / COMPONENTS
9. DATA / CONTENT
10. AI / AUTOMATION
11. INTEGRATIONS
12. AUTHORIZATION / SECURITY
13. PAYMENTS / COMMERCE, IF APPLICABLE
14. RESPONSIVE BEHAVIOR
15. DEPLOYMENT TARGET
16. REVIEW BLUEPRINT
17. BUILD
18. TEST
19. VERIFY
20. DEPLOY / PUBLISH
```

Do not ask questions whose answers are already established by the active workspace, existing APEX laws, supplied references, repository contracts, or previously approved project requirements.

---

## 7. VISUAL-FIRST CREATION LOOP

When the user provides a visual reference, the system should not immediately build blindly.

Use:

```text
REFERENCE
    ↓
ANALYZE
    ↓
CLASSIFY
    ↓
MAP TO CURRENT WORKSPACE
    ↓
GENERATE VISUAL / FUNCTIONAL BLUEPRINT
    ↓
SHOW PREVIEW
    ↓
USER REVIEWS
    ↓
USER APPROVES / EDITS
    ↓
BUILD
    ↓
TEST
    ↓
VERIFY
```

The preview must make the intended result understandable before expensive implementation begins.

The preview is a design artifact, not runtime verification.

---

## 8. VISUAL REFERENCES CAN DEFINE FUNCTION, NOT JUST APPEARANCE

If an image shows:

- navigation
- tabs
- sidebars
- inspectors
- timelines
- controls
- characters
- objects
- cards
- buttons
- toggles
- command surfaces
- AI panels
- interactive worlds
- creation tools

treat those elements as potential functional requirements.

Do not assume the image is merely decorative.

For example, if a visual shows a collection of mermaids/characters/objects in a creation environment, the system must understand that the visual may represent **addressable, selectable, editable, interactive entities**, not simply a background image.

---

## 9. VISUAL TARGETING

Provide an optional inspection mode that lets the user and Gabby address rendered elements directly.

Example:

```text
TARGET 1 — Header
TARGET 2 — Navigation
TARGET 3 — Main Hero / Landing Area
TARGET 4 — Character Panel
TARGET 5 — Timeline
TARGET 6 — Gabby Panel
```

The user can say:

> "Change Target 4."

> "Make Target 3 larger."

> "Move Target 6 to the right."

The system must resolve the target to the actual rendered component and preserve unrelated elements.

Target indexing is an inspection/editing aid, not part of the permanent customer-facing design.

---

## 10. THE APPLICATION CREATION ENGINE ITSELF

The creation engine is itself an APEX application and must have its own canonical landing experience.

It should open into a serious visual development environment — not a blank chatbot and not a generic form.

The environment should provide, as applicable:

- project creation/opening
- visual canvas/preview
- prompt/command surface
- guided creation interview
- reference-image upload
- reference-set management
- visual target inspection
- application structure
- page/view management
- component/module management
- navigation management
- data model awareness
- AI/Gabby assistance
- code generation/editing where appropriate
- asset management
- runtime preview
- testing
- verification
- versioning
- deployment
- publish
- audit/evidence

The exact implementation must reuse existing APEX capabilities rather than creating duplicate engines.

---

## 11. QUALITY STANDARD

APEX must not default to mediocre output.

The creation engine's baseline should include:

- professional visual hierarchy
- strong responsive behavior
- accessible interaction
- polished typography
- intentional spacing
- coherent design system
- real navigation
- real interactions
- persistent state
- real data structures where applicable
- real application logic
- real integrations where configured
- security boundaries
- error states
- loading states
- empty states
- success states based on evidence
- maintainable implementation
- testability
- deployability

The system should aim for **high-end professional output by default**.

Do not require the customer to repeat these standards in every prompt.

---

## 12. APEX VISUAL QUALITY IS A DEFAULT, NOT A USER PROMPT

When a user asks:

> "Build me a website for my company."

the system should already know to produce an APEX-standard result.

The user should only need to specify what is unique about their business/product/idea.

APEX standards supply the baseline for:

```text
QUALITY
RESPONSIVENESS
ACCESSIBILITY
VISUAL HIERARCHY
INTERACTION
SECURITY
STATE MANAGEMENT
ERROR HANDLING
TESTING
VERIFICATION
```

Do not repeatedly ask the user to specify the standard.

---

## 13. LANDING EXPERIENCE CREATION

When creating a landing experience, ask:

> **What should the user see and understand immediately when they enter?**

Then establish:

- primary visual
- primary message
- primary action
- navigation
- supporting content
- functional modules
- responsive behavior
- visual references
- interaction behavior

If the user supplies a canonical landing reference, preserve it rather than inventing another.

A landing experience may be highly functional and may contain substantial application UI. Do not force every landing experience into a marketing-page template.

---

## 14. APPLICATION VS LANDING EXPERIENCE

Maintain this distinction:

```text
APPLICATION
└── CANONICAL LANDING / ENTRY EXPERIENCE
    ├── SUPPORTING VIEWS
    ├── MODULES
    ├── PANELS
    ├── TABS
    ├── WORKFLOWS
    └── FUNCTIONAL WORKSPACES
```

A landing experience is the entry experience of the application.

The application contains the functionality behind that entry experience.

Multiple supplied screenshots may document that same application.

---

## 15. NO WORKSPACE DRIFT

A workspace is a boundary.

If the user is working on `APEX TERMINAL`, stay in APEX TERMINAL.

If the user is working on `APEX HERITAGE`, stay in APEX HERITAGE.

If the user is working on `APEX 360`, stay in APEX 360.

If the user is working on the Application Creation Engine, stay in that creation workspace.

Do not interpret a new image as a new workspace merely because it looks different.

Do not carry unrelated features or visual identity from another application into the current one.

---

## 16. APPLICATION ISOLATION

APEX applications remain separate destinations:

```text
APEX 365
   ↓
APPLICATION CREATION ENGINE
   ↓
CREATE / OPEN APPLICATION
   ↓
DEDICATED APPLICATION WORKSPACE
```

Examples:

```text
APEX 365 → TERMINAL
APEX 365 → STUDIO
APEX 365 → STORE
APEX 365 → TRADES
APEX 365 → PLUMBING
APEX 365 → 360
APEX 365 → HERITAGE
APEX 365 → GODSPEED
```

Do not merge them into one giant page.

---

## 17. FUNCTIONALITY LAW

Every visible control must have a real purpose.

A button must navigate, mutate state, execute an operation, open a module, submit a real action, or truthfully report that the capability is unavailable.

A tab must switch views.

A panel must contain its intended functionality.

A workspace must preserve its state.

A generated application must actually behave like an application rather than a static screenshot.

No dead controls.

No fake progress.

No fabricated integrations.

No simulated verification.

---

## 18. TRUTH LAW

Visual appearance never establishes runtime truth.

Use the APEX evidence model:

```text
DISCOVERED
→ AVAILABLE
→ CONFIGURED
→ CREDENTIAL_PRESENT
→ CONNECTED
→ CAPABILITY_PROBED
→ TESTED
→ DEPLOYED
→ DEPLOYMENT_VERIFIED
→ VERIFIED
```

Failure states remain explicit:

```text
UNKNOWN
UNVERIFIED
FAILED
BLOCKED
UNAVAILABLE
STALE
REQUIRES_CONFIGURATION
CONNECTED_NOT_VERIFIED
```

Never display VERIFIED merely because a generated screen looks complete.

---

## 19. BUILD PRESERVATION

Before changing an existing application:

1. inspect the repository;
2. inspect existing routes and components;
3. inspect existing capabilities;
4. inspect the application registry;
5. inspect the visual contracts;
6. inspect existing tests;
7. classify existing behavior as KEEP / UPGRADE / INTEGRATE / REPAIR / UNKNOWN;
8. preserve existing working functionality;
9. add the requested capability;
10. test and verify.

Do not rebuild the entire application because the user supplied a new reference image.

---

## 20. APEX CANONICAL REFERENCES TO READ BEFORE IMPLEMENTATION

Read and obey the applicable repository contracts before building:

```text
 docs/APEX_BUILDER_SYSTEM_INSTRUCTIONS.md
 docs/APEX_VISUAL_BUILD_PRESERVATION_PROTOCOL.md
 docs/APEX_365_VISUAL_DESIGN_CONTRACT.md
 docs/APEX_HUB_EXACT_SHELL_DIRECTIVE.md
 docs/APEX_HUB_CANONICAL_VISUAL_APPLICATION_SHELL_LAW.md
 docs/APEX_TERMINAL_UIUX_SPEC.md
 reference/APEX_TERMINAL_MASTER_REFERENCE.tsx
 docs/APEX_CREATIVE_AI_STUDIO_CANONICAL_BLUEPRINT.md
```

These documents complement this prompt. Do not create a competing interpretation when a canonical repository contract already exists.

---

## 21. SECURITY AND CREDENTIALS

The creation engine must use the existing APEX security model.

```text
VAULT
  ↓
credentialRef
  ↓
GATEKEEPER
  ↓
AUTHORIZED EXECUTOR
  ↓
PROVIDER
  ↓
RESULT
  ↓
EVIDENCE
  ↓
TRUTH GATE
```

Never put raw production credentials into prompts, generated frontend code, screenshots, logs, analytics, URLs, or Gabby's context.

---

## 22. GABBY'S ROLE

Gabby is the guided creation intelligence and operational interface.

She should:

- understand the current workspace
- understand the current project/application
- interpret prompts
- analyze visual references
- classify reference images
- ask focused creation questions
- generate a blueprint
- explain decisions
- propose improvements
- identify ambiguity
- orchestrate authorized actions
- report actual results

Gabby must not invent completion.

Gabby does not become the source of truth merely because she generated the result.

---

## 23. THE USER'S CREATION EXPERIENCE

The ideal experience is:

```text
USER ENTERS CREATION ENGINE
        ↓
"WHAT ARE WE BUILDING?"
        ↓
USER ANSWERS NATURALLY
        ↓
GABBY UNDERSTANDS APEX DEFAULTS
        ↓
GABBY ASKS ONLY WHAT IS MISSING
        ↓
USER UPLOADS LANDING REFERENCE
        ↓
GABBY CLASSIFIES IT:
CANONICAL LANDING EXPERIENCE REFERENCE
        ↓
USER UPLOADS MORE IMAGES
        ↓
GABBY CLASSIFIES THEM:
SUPPORTING VIEW REFERENCES
        ↓
ALL REMAIN IN CURRENT WORKSPACE
        ↓
VISUAL + FUNCTIONAL BLUEPRINT
        ↓
PREVIEW
        ↓
USER EDITS / APPROVES
        ↓
BUILD
        ↓
TEST
        ↓
VERIFY
        ↓
DEPLOY / PUBLISH
```

The user should feel guided rather than forced to become the system architect for every tiny detail.

---

## 24. FINAL NON-NEGOTIABLE RULES

**DO NOT CALL EVERY IMAGE A LANDING PAGE.**

**DO NOT CALL THE LANDING EXPERIENCE A HERO IMAGE.**

**DO NOT REDUCE THE LANDING EXPERIENCE TO CSS, UX, OR THEME.**

**THE PRIMARY IMAGE IDENTIFIED BY THE USER IS THE CANONICAL LANDING EXPERIENCE REFERENCE.**

**ADDITIONAL IMAGES IN THE SAME WORKSPACE ARE SUPPORTING VIEW REFERENCES UNLESS EXPLICITLY SEPARATED.**

**STAY INSIDE THE CURRENT WORKSPACE.**

**ONLY CREATE A NEW WORKSPACE WHEN THE USER EXPLICITLY CREATES/SELECTS ONE OR WHEN GENUINE AMBIGUITY REQUIRES THE SINGLE CLARIFICATION QUESTION.**

**APPLY APEX QUALITY STANDARDS BY DEFAULT. DO NOT MAKE THE USER REPEAT THEM.**

**SHOW THE USER THE VISUAL/functional BLUEPRINT BEFORE COMMITTING TO A LARGE BUILD WHEN APPROVAL IS REQUIRED.**

**BUILD REAL APPLICATIONS, NOT STATIC MOCKUPS.**

**PRESERVE THE SUPPLIED VISUAL. UPGRADE ADDITIVELY WHEN AUTHORIZED.**

**PRESERVE EXISTING FUNCTIONALITY.**

**NO FEATURE BLEED. NO VISUAL BLEED. NO WORKSPACE DRIFT.**

**NO FAKE GREEN. NO FABRICATED FUNCTIONALITY. NO UNVERIFIED CLAIMS.**

**APEX BUILDS THE STANDARD INTO THE CREATION ENGINE SO THE USER CAN CREATE WITHOUT HAVING TO RE-EXPLAIN THE STANDARD EVERY TIME.**

**THIS CREATION ENGINE IS ITSELF AN APEX APPLICATION AND MUST BE BUILT TO THE SAME STANDARD IT USES TO CREATE OTHER APPLICATIONS.**
