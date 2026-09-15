# APEX CHAMELEON TAB — BUILD PROMPT

## Mission

Upgrade the existing APEX-TERMINAL repository into the **APEX Chameleon Tab**: one persistent workspace control that lets the operator route an input to **FEED** (Gabby conversation) or **TERMINAL** (the local execution bridge) without leaving the workspace.

This is an additive implementation. Do not replace, reset, redesign away, or delete the existing APEX engine.

## Canonical architecture

APEX-TERMINAL remains the source of truth and control plane.

```
USER (TYPE or VOICE)
        ↓
CHAMELEON ROUTER
        ↓
   ┌────┴────┐
 FEED      TERMINAL
   ↓           ↓
GABBY      LOCAL BRIDGE
              ↓
       persistent PTY /
       PowerShell / shell
              ↓
       stdout / stderr /
          exit code
              ↓
        TRUTH GATE
              ↓
        GABBY READBACK
```

External AI providers are adapters. Do not make Google, Gemini, Claude, Grok, OpenAI, Vercel, Lovable, or any other provider the permanent owner of the control plane.

## 1. Chameleon composer

Add a compact route control directly beside/inside the main composer:

**FEED | TERMINAL**

Also support a compact **CHAMELEON** label/icon when space is limited.

### FEED
Normal Gabby conversation.

### TERMINAL
The input is routed to the active local terminal session through the existing APEX Terminal Bridge.

The user must not have to:
- leave the APEX workspace;
- open another terminal window;
- copy/paste manually;
- close the terminal;
- return to chat;
- paste the result back.

## 2. Persistent terminal sidecar

The terminal is a **sidecar**, not the main page.

Closed:
`[ TERMINAL ▸ ]`

Open:
- narrow right-side panel or nested panel;
- dark, low-glare visual treatment;
- terminal session state;
- command input;
- output;
- stdout;
- stderr;
- exit code;
- verification state;
- COPY;
- SEND TO CHAT;
- CLEAR;
- RECONNECT.

The underlying terminal process stays alive while the user works.

Do not create disposable terminal popups for every command.

## 3. Chameleon detection

The router should inspect the local environment and select the appropriate execution adapter:

- Windows PowerShell 7 (`pwsh.exe`) when available;
- Windows PowerShell 5.1 (`powershell.exe`) otherwise;
- Windows Terminal (`wt.exe`) for visible terminal presentation when available;
- future adapters for bash/zsh/Linux/macOS without changing the Chameleon UI.

Display the detected target truthfully:

`WINDOWS / POWERSHELL 7`

or

`WINDOWS / POWERSHELL 5.1`

Never claim a runtime exists until it is actually detected.

## 4. Type + voice together

The same conversation session must support both:

- TYPE
- VOICE

Add a persistent **WORK / TALK** toggle.

When WORK/TALK is ON:
1. User may type or speak.
2. Gabby answers.
3. The answer is automatically spoken aloud.
4. User can interrupt playback.
5. Typing remains available.
6. The session does not reset when switching input modes.

When OFF:
- normal silent text-chat behavior.

Do not require the user to say “read that” or “say it.”

## 5. Response discipline

For normal work:

1. Answer the exact question.
2. Perform or identify the requested action.
3. Give the result.
4. Move on.

For tests:

`PASS | FAIL | BLOCKED | UNVERIFIED`

Then one material reason/result.

Do not bury the answer in unrelated explanation. Put optional detail behind DETAILS.

## 6. Code/result bridge

Every code block and terminal result should expose:

- COPY
- SEND TO TERMINAL
- SEND TO CHAT

Sending to terminal must use the authenticated local APEX bridge.

Sending to chat must preserve the command/result as session context.

## 7. Security requirements

TERMINAL is a privileged route.

Required:
- localhost-only bridge;
- authenticated local session/token;
- no arbitrary webpage-origin execution;
- command sanitization/policy checks;
- audit event before execution;
- audit event after execution;
- stdout/stderr capture;
- exit-code capture;
- explicit timeout/resource limits for non-interactive EXEC;
- kill/disconnect;
- no raw secrets in chat or logs;
- administrator privileges only when actually required.

Never equate process creation with success.

Never display VERIFIED unless the deterministic Truth Gate has evidence.

## 8. Preserve existing APEX controls

Keep and integrate the existing:

`REMEMBER → DEFINE → EXECUTE → READ BACK → COMPARE → VERIFY → AUDIT → REMEMBER`

Use the existing sidecar lifecycle, Comparator, audit ledger, telemetry, and bridge instead of creating parallel truth systems.

## 9. Dark APEX visual language

The operator workspace must be dark and easy on the eyes:

- near-black base;
- warm white text;
- soft gray secondary text;
- restrained gold accent;
- subtle borders;
- minimal glow;
- no bright white cards;
- no neon overload;
- no giant decorative cards;
- no unnecessary animation.

Gabby must remain visually legible and must not be hidden behind the sidecar.

## 10. Do not break the current repository

Before changing code:

1. Inspect the existing repository structure.
2. Reuse existing components/routes/contracts.
3. Inspect the existing terminal bridge.
4. Inspect the existing voice/sidecar specification.
5. Inspect current tests.
6. Extend additively.
7. Do not delete working capability just to simplify the UI.

## 11. Required implementation surfaces

At minimum:

- Chameleon route state;
- persistent terminal session state;
- sidecar open/close state;
- detected shell/runtime state;
- bridge health state;
- command execution state;
- stdout/stderr/exit-code rendering;
- FEED ↔ TERMINAL routing;
- WORK/TALK state;
- voice playback interface;
- copy/send actions;
- reconnect/disconnect;
- audit events;
- deterministic result status.

## 12. Acceptance test

Do not call this complete until the implementation can demonstrate:

1. Open APEX.
2. Open TERMINAL sidecar.
3. Establish a persistent local terminal session.
4. Confirm the detected shell/runtime.
5. Turn WORK/TALK on.
6. Ask Gabby a question by voice.
7. Hear the answer automatically.
8. Type the next request.
9. Switch to TERMINAL.
10. Send a PowerShell command.
11. See stdout/stderr/exit code in the sidecar.
12. Send the result back to chat.
13. Ask Gabby to verify it.
14. Receive PASS/FAIL/BLOCKED/UNVERIFIED based on observed evidence.
15. Continue with another command without reopening the terminal.
16. Switch back to FEED without losing the conversation.
17. Switch voice/typing without creating a new session.

## 13. Build behavior

Work directly in the existing repository.

Run the project's existing tests/build checks.

Fix actual failures.

Do not fabricate successful test results.

When finished, report only:
- files changed;
- tests/build actually run;
- PASS/FAIL/BLOCKED/UNVERIFIED;
- remaining blockers.

The finished result should feel like one APEX workstation, not a chat page plus a separate terminal application.
