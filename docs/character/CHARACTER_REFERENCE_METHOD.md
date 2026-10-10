# APEX Character Reference Method
## Canonical method for identity-consistent AI avatars

**Purpose:** Preserve one real person's identity across generated images, video, animation, camera angles, and commercial content. This method is the source of truth for builders working on the APEX Character Studio. Do not replace it with a generic avatar workflow.

## Core principle

Give the model multiple views of the **same person**. A single portrait is not enough to reliably preserve identity when the head turns, the camera moves, or the scene changes. Use a deliberate angle set plus any genuine photographs available from different angles. Treat all references as evidence for one identity—not as separate people or alternative designs.

## Reference set

Create a separate, clearly labeled image for each view:

1. Front (0°)
2. Left three-quarter (approximately 45°)
3. Right three-quarter (approximately 45°)
4. Left profile (90°)
5. Right profile (90°)
6. Back of head / rear view (180°), when hairstyle or head shape matters

Add more views when a task needs them: slightly above or below eye level, expression references, or full-body front/side/back views. Keep one angle per image when possible. A combined turnaround sheet is useful for reference and review, but provide individual crops to tools that expect one image at a time.

## Real-photo references

When genuine photographs of the person exist, include multiple photos from different angles. Prefer sharp, evenly lit, unfiltered images with visible facial features and consistent appearance. Include neutral expressions first; add expressions separately when useful. Avoid sunglasses, extreme perspective, heavy beauty filters, and images where another person obscures the face.

Do not invent missing angles and then describe them as real photographs. Generated angle views may supplement the set, but label them as generated references and verify them against genuine photos.

## Identity lock: details to preserve

Across every render, check and preserve:
- Overall facial structure and head shape
- Skin tone and natural skin characteristics
- Eye shape, spacing, brows, nose, lips, ears, and jaw
- Hairline, hairstyle, facial hair, and hair texture
- Body proportions and recognizable silhouette, when full-body views are used
- Distinctive features and accessories explicitly chosen for the canonical look

Keep appearance choices consistent across assets. If a detail differs between references (for example, facial hair, jewelry, or a dental grill), flag the conflict and choose a documented canonical version rather than silently mixing versions.

## Workflow for builders

1. **Collect:** Gather the approved photos and angle references for the same subject.
2. **Label:** Name each file by subject and view (for example, `mac_front.jpg`, `mac_left_3q.jpg`, `mac_right_profile.jpg`). Store consented source photos securely.
3. **Inspect:** Check image quality, lighting, occlusion, and contradictions before generation.
4. **Select:** Choose the reference(s) accepted by the target tool. Use individual images when it accepts only one reference; use the full set when it supports multiple references.
5. **Generate:** Request the same identity across all angles and scenes. Do not ask for a new face or a redesign.
6. **Compare:** Check output against the canonical references at front, three-quarter, and profile views. Reject identity drift.
7. **Correct:** Adjust prompts or references and regenerate. Do not hide a mismatch by calling it “close enough.”
8. **Approve:** Keep only approved versions as canonical references and record changes.

## Tool-specific handling

- **Single-face talking-avatar / lip-sync tools:** Use a single clean, front-facing portrait or the tool's required source video. Do not feed a collage unless the tool explicitly supports collages.
- **Image-to-video tools:** Supply the angle references the tool supports. If only one reference is supported, select the clearest view for that shot.
- **3D character workflows:** Use the multi-view set to guide modeling and review. A 2D sheet is reference material; it is not itself a rigged 3D model.
- **Commercial production:** Reuse the approved identity asset and voice/delivery profile. Generate new scenes and scripts without changing the subject's identity.

## Privacy, consent, and provenance

Use photographs only with appropriate permission. Keep source images and identity assets in approved storage. Do not expose private source photos in public repository history unless the owner explicitly approves. This document describes the method; it does not claim that the actual photo sheet, a trained avatar, a rigged model, or a live production integration has already been added.

## APEX Character Studio integration

The existing studio UI includes an Orthographic Turnaround panel in `app/character-studio/page.tsx`, with a corresponding static visual in `visual/APEX_CHARACTER_STUDIO_EXACT.html`. Those screens currently represent the workflow visually; placeholder figures are not the owner's finished likeness.

Future implementation should connect this method to the existing Character Studio and its asset manifest, preserve existing architecture, and clearly distinguish placeholder assets from verified reference assets.

## Acceptance checklist

- [ ] Six core angles are represented or explicitly marked unavailable.
- [ ] Multiple genuine photos are included when available and approved.
- [ ] Each image has a clear subject and angle label.
- [ ] Conflicting appearance details are resolved and documented.
- [ ] Single-image tools receive an individual face image, not an unsupported collage.
- [ ] Output identity is checked at front, three-quarter, and profile views.
- [ ] Placeholder/generated references are not misrepresented as real photos.
- [ ] The canonical references and this method are discoverable from the existing Character Studio.
