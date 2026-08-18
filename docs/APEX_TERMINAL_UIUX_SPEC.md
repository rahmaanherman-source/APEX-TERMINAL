# APEX TERMINAL UI/UX Specification v1.0

## Product feeling

**Luxury through restraint:** clear hierarchy, generous spacing, quiet motion, strong typography, minimal chrome, and immediate feedback.

The default surface must feel simple even when the underlying engine is sophisticated.

## First launch

```text
APEX TERMINAL

What are we building?

[ Ask GABBY anything… ]

[ New Project ]   [ Open Project ]

Recent Projects
  APEX HUB
  APEX HERITAGE
  GODSPEED
  GOLDEN WORLD

● SYSTEM READY
```

## Workspace

Desktop has three functional regions:

- **Left:** workspace, projects, connected tools
- **Center:** active project/tool/document
- **Right:** inspector, status, evidence, artifacts
- **Bottom:** quiet real-time activity feed

Do not expose every capability simultaneously. Advanced controls appear contextually.

## Tabs

Everything the owner legitimately connects can become a tab. A tab can be `NATIVE`, `CONNECTED`, `REMOTE`, `WEB`, `CLI`, `API`, `SDK`, `WEBHOOK`, or `MCP` backed. The UI must display the actual connection type.

## Command surface

Desktop: `Cmd/Ctrl + K`.

Mobile: one persistent command affordance.

Examples: `build`, `connect github`, `open blender`, `verify deployment`, `run flutter`, `inspect unreal`, `audit repository`, `show failures`.

## GABBY boundary

GABBY / Chameleon Core is the translator/operator. It may interpret intent, plan, route, execute, explain, and monitor. It may not declare its own success or alter comparator outcomes.

## Status language

Use plain language first:

```text
BUG
Blender did not start.

Why:
The Blender executable was not found.

Next:
Choose the Blender location.

[ Locate Blender ]
[ Technical Details ]
```

System states remain machine-readable: `VERIFIED`, `FAILED`, `BLOCKED`, `UNVERIFIED`.

## Primary actions

Keep labels short:

`BUILD`, `RUN`, `TEST`, `VERIFY`, `DEPLOY`, `CONNECT`, `OPEN`, `SAVE`, `PUBLISH`.

Every action has resting, hover, pressed, loading, success, failed, and disabled states.

## Visual language

Default palette: near-black, warm white, soft gray, restrained gold accent. Gold is an accent, not the entire interface.

Avoid neon overload, excessive glass effects, giant cards, decorative gradients, and constant animation.

## Motion

Motion communicates state: subtle fade, short slide, press feedback, progress transitions, and status transitions. It must never obscure function.

## Mobile / APEX Breeze

Breeze is the mobile operator surface, not a shrunken desktop dashboard. Prioritize command, projects, GABBY, build, test, verify, deploy, and logs.

## Security UX

Use platform authentication and secure credential references. Never expose raw API keys in frontend code, prompts, logs, or UI.
