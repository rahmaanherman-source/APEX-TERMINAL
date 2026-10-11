# APEX Character Reference Method

**Status:** DOCUMENTED; automatic 3D reconstruction and runtime enforcement are not verified.

## Core rule
Never rely on one photograph to define a character across multiple angles. Use labeled views of the same person plus genuine multi-angle photographs when available. Preserve identity; do not redesign the face or substitute a generic avatar.

## Canonical angle set
| Slot | View | Yaw | Pitch | Requirement |
|---|---|---:|---:|---|
| A | Front | 0° | 0° | Required |
| B | Three-quarter left | -45° | 0° | Required |
| C | Three-quarter right | +45° | 0° | Required |
| D | Left profile | -90° | 0° | Required |
| E | Right profile | +90° | 0° | Required |
| F | Back of head | 180° | 0° | Required for true 3D/head-shape work |
| G1 | Looking up | 0° | +20° | Supplemental |
| G2 | Looking down | 0° | -20° | Supplemental |

Yaw convention: 0° is front; negative turns toward the subject's left; positive toward the subject's right. Confirm and convert to the target tool's coordinate convention.

## Sheet status
Expected master-sheet path: `reference/character/mac-multi-angle-reference-sheet.png`. **This file was not found in the repository during verification on 2026-10-11.** The path is a target, not proof the image is committed. Do not tell builders the sheet is present until GitHub returns the file. Slots F, G1, and G2 are also missing until supplied. Never invent missing views and label them genuine photographs.

## Photos and grid
When available and approved, use about 10–20 sharp, unfiltered photographs from varied angles. Prefer even lighting, neutral expressions, visible facial features, and low perspective distortion. Keep beard, hairline, glasses, jewelry, and dental-grill choices consistent; flag conflicting references and document the canonical look.

Use a plain background, even front lighting, eye-level camera, constant distance, and consistent top-of-head-to-collarbone framing. A 3×3 grid is an alignment guide: eyes near the top third, nose near the center vertical line in front view, chin above the bottom third. These are visual guides, not measured pixel coordinates.

## Tool routing
- Multi-reference image/video generator: use the supported subset of the sheet and real photos.
- Talking-avatar/lip-sync: use one clean front image (slot A) or the vendor-required source video. Never send the grid to a tool that does not support collages.
- 3D/photogrammetry: use individual labeled images with yaw/pitch metadata and confirmed coordinate conventions.
- Digital twin: follow the vendor's recording and consent requirements; a sheet alone does not replace required source video.

## Identity and quality gate
Preserve head/facial structure, skin tone, eyes/brows, nose, lips, ears, jaw, hairline, hairstyle, facial hair, and approved distinctive details. Compare front, three-quarter, and profile outputs; reject identity drift.

## Character Studio and implementation truth
The UI exists in `app/character-studio/page.tsx` and the static visual in `visual/APEX_CHARACTER_STUDIO_EXACT.html`; the figures are placeholders, not a verified finished likeness. The machine-readable contract is `docs/character-reference-spec.json`. No verified APEX service currently reads this spec and automatically reconstructs a head or maps cameras.

## Privacy and consent
Use photographs only with permission. Do not commit private face-reference images to a public repository without explicit approval. Label each asset as genuine photo, generated supplement, placeholder, or approved canonical reference.

## Acceptance checklist
- [ ] Supplied angles are labeled and use the declared coordinate convention.
- [ ] Missing angles are marked missing, not fabricated.
- [ ] Genuine photos are included only when available and approved.
- [ ] Conflicting appearance details are resolved and recorded.
- [ ] Single-image tools receive one supported image, not an unsupported collage.
- [ ] Front, three-quarter, and profile outputs pass identity checks.
- [ ] Private references are not made public without explicit approval.
- [ ] Runtime implementation is claimed only after tests pass.
