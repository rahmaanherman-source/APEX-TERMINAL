# APEX TERMINAL — Three-Pass Reference Audit

**Date:** 2026-08-22
**Repository:** `rahmaanherman-source/APEX-TERMINAL`
**Reference:** owner-supplied APEX Terminal screenshot
**Rule:** the supplied reference controls the visual shell; repository evidence controls implementation claims.

## PASS 1 — Repository / architecture

Confirmed:
- Next.js 14 application with `pnpm dev`, `pnpm build`, and `pnpm start` scripts.
- Existing `app/character-studio/page.tsx` is a real route and contains the requested CREATE / CHARACTERS / WORLDS / ANIMATION / RENDER shell, Gabby surface, engines, timeline, audit feed, and bottom pipeline controls.
- Existing `/api/truth` route performs a real bounded local Ollama probe and creates VEO evidence. It does not promote governance to VERIFIED automatically.
- Existing provider registry and APEX truth/audit foundations remain in the repository.
- `src/components/ApexTerminalMaster.tsx` is now committed as the owner-supplied master operational component.
- `app/apex/page.tsx` is now committed as a browser-ready route that surfaces the Character Studio reference implementation.

## PASS 2 — Visual / layout

The supplied screenshot establishes this hierarchy:

1. Top APEX Terminal command bar.
2. Narrow workspace rail on the far left.
3. Connected Apps column immediately beside the workspace rail.
4. Dominant 3D Creation Studio in the center.
5. Character tabs directly above the creation workspace.
6. Large primary character viewport.
7. Turnaround views and material controls attached to the viewport.
8. Gabby concierge on the right.
9. Project / engines / generation controls inside the right concierge surface.
10. Four lower modules: Foley, AI Dialogue & ADAK, Timeline / Sequence, Audit Feed.
11. Bottom execution dock with BUILD / RUN / TEST / VERIFY / DEPLOY / PUBLISH.
12. APEX identity and truthful system state anchored in the shell.

The visual target is NOT a generic dashboard. Secondary screens such as the female-character surface are supporting screens/modules and must not replace the male-character master composition.

## PASS 3 — Functional / truth audit

The following distinction is mandatory:

- A visible control is implementation evidence only when it has an actual action path.
- A configured connector is not the same as a live connection.
- A UI label is not evidence of successful execution.
- `VERIFIED` must only be emitted from an evidence-backed verification path.
- Existing working behavior must be preserved when the visual shell is changed.

Current repository gaps remain explicit:
- The root `app/page.tsx` still uses the legacy Terminal/FileExplorer/AICommandPalette composition; the exact reference shell is not yet proven as the root surface.
- The new `/apex` route is browser-ready but currently delegates to the existing Character Studio implementation, which is the closest committed visual implementation rather than a complete screenshot-for-screenshot reproduction.
- The committed `ApexTerminalMaster` contains substantial functionality, but it still requires integration into the canonical root and runtime verification.
- The supplied screenshot's exact character artwork is not currently committed as a repository asset; therefore visual fidelity of the artwork itself is NOT VERIFIED.
- The local truth route is real and evidence-backed, but external connectors still require their own runtime checks.

## Required completion sequence

1. Make the canonical root render the approved shell.
2. Add the Connected Apps column to the canonical shell using the existing registry.
3. Preserve the exact master spatial hierarchy.
4. Attach the real Character Studio controls and current working runtime paths.
5. Replace prototype-only actions with real executors where a capability exists; mark missing capabilities clearly rather than faking success.
6. Add repository-owned reference artwork/assets when supplied/authorized.
7. Run install, typecheck/build, browser render, interaction checks, and visual comparison.
8. Record evidence and only then promote statuses.

## Verdict

**DESIGN AUTHORITY:** LOCKED

**REFERENCE IMPLEMENTATION:** PRESENT

**MASTER COMPONENT:** PRESENT

**BROWSER ROUTE:** PRESENT at `/apex`

**ROOT CANONICAL SHELL:** NOT YET VERIFIED

**PIXEL/ARTWORK IDENTITY:** NOT YET VERIFIED

**FULL PRODUCT RUNTIME:** NOT YET VERIFIED

No broad claim that the repository is useless is warranted. The repository contains substantial working foundations; the remaining work is integration, visual fidelity, and evidence-backed verification.
