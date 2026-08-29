# APEX UI REGRESSION RATCHET LAW

**STATUS: LOCKED — APEX-WIDE GOVERNANCE REFERENCE**

A frozen, approved, verified UI or interaction state is a **minimum acceptable baseline**. A freeze/watermark/reference marker means: **THIS VERSION WAS ACCEPTED. THIS IS THE FLOOR.**

Future work may move the system upward — equal or better — but may not silently move it downward.

## Rules

- A newer commit is not automatically better.
- A redesign is not automatically an upgrade.
- A successful build is not proof of UI acceptance.
- Existing working functionality is protected.
- The canonical Gabby/orb and established navigation are protected by their approved baseline.
- Secondary controls may not be enlarged or repositioned in ways that obscure the established workspace.
- Clipping, drift, collapse, bounce, unintended movement, missing tabs, missing controls, or replacement of real capabilities with mocks are regressions.

When regression is detected: **STOP → identify baseline → compare → identify root cause → restore → resume only with an equal-or-better change.**

A baseline moves only through explicit owner approval, documented comparison, functional verification, visual comparison, interaction checks, and versioning. Keep the old baseline recoverable.

Distinguish:
`BASELINE APPROVED` · `IMPLEMENTED` · `DEPLOYED` · `LIVE` · `VERIFIED`

This is governance, not another application. It applies APEX-wide and is intended to be referenced from the future standalone `apex-integrated-rule` repository.

> **A freeze is a floor, not a ceiling. We can go higher. We cannot go lower.**

**GODSPEED.**
