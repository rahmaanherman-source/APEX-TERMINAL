# APEX Character Reference Method

**Owner:** Mac (Rahmann Herman)
**Status:** DOCUMENTED. This is the method. No runtime enforces it yet.
**Applies to:** every image, video, avatar and 3D tool that renders Mac or any APEX character.

## Why this exists

AI generators guess what they cannot see. If you give one a single front-facing photo, it invents the side of the head, the ears, the jawline and the beard edge, and the likeness drifts every time the head turns.

This method stops that by giving the model every side of the face up front, along with a fixed grid and known camera angles, so it maps the face instead of guessing.

## The rule

**Never generate a character from one photo.** Always feed the full reference set below.

## 1. The reference set

| Slot | View | Head turn (yaw) | Required |
|---|---|---|---|
| A | Front | 0° | Yes |
| B | Three-quarter left | -45° | Yes |
| C | Three-quarter right | +45° | Yes |
| D | Profile left | -90° | Yes |
| E | Profile right | +90° | Yes |
| F | Back of head | 180° | For 3D only |
| G | Looking up / looking down | pitch ±20° | Recommended |

Current master sheet: [`reference/character/mac-multi-angle-reference-sheet.png`](../reference/character/mac-multi-angle-reference-sheet.png). It covers slots A–E.

## 2. Real photos on top of the sheet

The sheet is the map. Real photos are the proof. Add as many real photos as you have, from different angles, so the model sees true skin texture, beard density and lighting.

- 10–20 real photos is a strong set.
- Use a mix of angles, not 20 front selfies.
- Use the same look in every photo: beard length, grill or no grill, glasses or none. If the look varies, the model blends the versions.

## 3. Shoot to a grid

The grid gives every image the same scale and placement, so angles can be compared and measured.

- Plain dark background and even lighting from the front.
- Camera at eye level, the same distance for every shot.
- Use a 3×3 grid overlay in the camera app:
  - eyes on the top third line
  - nose on the center vertical line for the front view
  - chin above the bottom third line
- Same framing for every slot: top of the head to the collarbone.
- Shoot the angles in order, A through G, and name the files by slot (`A_front.jpg`, `B_34_left.jpg`, and so on).

## 4. 3D mapping: angles as numbers

Every slot has a fixed yaw and pitch (see the [spec](character-reference-spec.json)). Because each photo is tagged with the angle it was taken from, a 3D tool or photogrammetry pipeline can place the cameras around the head and solve the shape. That is the "3D calculator": known camera angles plus grid-aligned photos in, mapped head out.

What is real today and what is not:
- **Real:** the sheet, the angle table, the grid rules, and tools that accept multi-image references.
- **Not built yet:** an APEX service that reads this spec and runs reconstruction automatically. The Character Studio turnaround panel (`app/character-studio/page.tsx`) is a UI layout with placeholder figures only.

## 5. Which input goes to which tool

| Tool type | What to give it |
|---|---|
| Image or video generators with reference inputs | The full sheet plus the real photos |
| Talking-avatar and lip-sync tools | Slot A cropped alone, or a 1–2 minute talking-to-camera video |
| 3D or photogrammetry tools | Every slot as a separate image, tagged with its yaw and pitch |

**Never upload the grid sheet to a lip-sync tool.** It will animate the collage.

## 6. Check before you publish

- Compare the output against slot A and one profile slot.
- Check the beard line, ear shape, head shape and teeth (grill or not).
- If it drifts, add more real photos from the angle that failed. Don't just re-roll.
