# APEX Gabby ↔ Terminal Sidecar + Voice Work Mode

**Status:** DESIGN / REPO-READY SPEC  
**Owner:** APEX  
**Canonical implementation:** `rahmaanherman-source/APEX-TERMINAL`

## 1. Product decision

Build this as an **APEX Terminal capability**, not as a provider-owned application.

- **APEX-TERMINAL is the source of truth and control plane.**
- Google AI Studio is the preferred rapid-prototyping accelerator for the voice/conversation UI because AI Studio can import an existing GitHub project, build full-stack web apps, and access Gemini Live capabilities. The generated application must sync back to the canonical APEX repository.
- External model providers remain replaceable adapters.
- The terminal, sidecar, session state, verification, audit trail, and routing logic remain APEX-owned.

## 2. Exact user experience

The user works in the office with one persistent APEX workspace.

### Input modes

The composer supports BOTH:

1. **TYPE** — normal keyboard input.
2. **VOICE** — microphone input without switching away from the workspace.

Voice is not a replacement for typing.

### Work Mode

A persistent **WORK / TALK** mode controls response playback.

When enabled:

- User can speak or type.
- APEX answers normally.
- The answer is automatically spoken aloud.
- The user does NOT have to type “read that,” “say it,” or otherwise request playback.
- User can interrupt/stop playback.
- Switching back to typing does not destroy the conversation.
- Conversation remains one continuous session.

When disabled:

- Normal silent text-chat behavior.

## 3. Response discipline

APEX responses in Work Mode are intentionally tight.

### Required response order

1. **Answer the actual question.**
2. **Perform or identify the requested action/test.**
3. **Return the result.**
4. **Move on.**

Do not bury the requested answer under unrelated explanation.

For tests:

- Test the exact thing requested.
- Report PASS / FAIL / BLOCKED / UNVERIFIED.
- Give the single material reason/result.
- Do not expand into unrelated troubleshooting unless the result requires it.

Optional detail belongs behind an expandable **DETAILS** control or only when requested.

## 4. Terminal routing

The composer gets a first-class route selector:

**FEED | TERMINAL**

### FEED

The message goes to Gabby/AI normally.

### TERMINAL

The message becomes a terminal action.

The UI must show:

- command/request
- target terminal/session
- execution state
- stdout
- stderr
- exit code
- verification state

The terminal session stays alive.

The user should NOT have to:

1. leave chat,
2. open Terminal,
3. paste a command,
4. wait,
5. close Terminal,
6. return to chat,
7. paste the result.

That loop is exactly what this capability eliminates.

## 5. Persistent terminal session

The terminal is a persistent session, not a disposable popup.

Opening TERMINAL once creates/attaches to the session.

Subsequent commands reuse that session.

Terminal tabs remain available while the user works in APEX.

If the terminal process exits:

- APEX reports the session as disconnected.
- Reconnect/restart is offered.
- Conversation state is preserved.
- APEX does not pretend the terminal is still connected.

## 6. Sidecar UI

The terminal stays visually clean.

### Preferred presentation

A narrow, low-visual-weight **SIDE CAR tab/rail** sits at the edge of the APEX workspace.

Example:

```
┌──────────────────────────────────────────────────────┐
│ APEX / GABBY                              FEED TERMINAL│
│                                                      │
│                 MAIN WORKSPACE                       │
│                                                      │
│                                             ┌────────┐│
│                                             │ TERMIN ││
│                                             │ AL     ││
│                                             │  >_    ││
│                                             │        ││
│                                             │ output ││
│                                             └────────┘│
└──────────────────────────────────────────────────────┘
```

Closed state:

```
                         [ TERMINAL ▸ ]
```

Clicking the faint **TERMINAL** rail expands the sidecar.

The sidecar may also be rendered as a nested box inside the APEX workspace where that better fits the current shell.

### Rule

**Do not make the terminal itself carry the UI burden.**

The sidecar owns:

- command composer
- session selector
- terminal output
- copy
- send to chat
- clear visual output
- execution state
- verification state

The real terminal remains available underneath as the execution engine.

## 7. Chat → Terminal → Chat loop

Canonical loop:

```
USER
  ↓
GABBY
  ↓
FEED or TERMINAL ROUTE
  ↓
TERMINAL BRIDGE
  ↓
PERSISTENT PTY / WINDOWS TERMINAL
  ↓
stdout / stderr / exit code
  ↓
TRUTH GATE
  ↓
GABBY
  ↓
CHAT + optional spoken response
```

A copied command/result can move between chat and terminal with one action.

## 8. Copy/paste bridge

Any code block or terminal result gets:

- COPY
- SEND TO TERMINAL
- SEND TO CHAT

The user can therefore take something produced during the conversation and send it directly to the active terminal without leaving the conversation.

Likewise, terminal output can be inserted into the chat context without manually changing applications.

## 9. Voice architecture

Voice should be duplex at the workspace level:

**microphone → transcription/live model → Gabby → response → speech playback**

For low-latency conversational voice, Gemini Live is a strong implementation adapter. Google currently documents Gemini Live for real-time voice/vision agents, including Gemini 3.1 Flash Live. APEX must treat it as an adapter, not as the owner of the voice architecture.

Local/on-device speech should remain an available fallback where practical.

## 10. Browser/desktop bridge

For the browser implementation:

```
Chrome/Edge Side Panel
        ↓
Extension Service Worker
        ↓
Native Messaging / localhost bridge
        ↓
APEX Terminal Bridge
        ↓
Windows Terminal / PowerShell / PTY
```

Chrome's Side Panel API is designed for persistent extension UI alongside webpages. Chrome Native Messaging provides extension-to-native-application communication through a registered native host.

The APEX bridge must remain local-first and authenticated.

## 11. Security

TERMINAL mode is privileged.

Required controls:

- explicit TERMINAL route
- local-only bridge
- authenticated local session
- command/input sanitization
- audit event before/after execution
- stdout/stderr capture
- exit-code capture
- truth verification
- kill/disconnect control
- no arbitrary webpage-origin command execution
- no secrets rendered into chat unnecessarily
- administrator privileges only when actually required

Never treat “process launched” as “task succeeded.”

## 12. Existing APEX architecture alignment

This extends the existing APEX loop:

**REMEMBER → DEFINE → EXECUTE → READ BACK → COMPARE → VERIFY → AUDIT → REMEMBER**

The terminal sidecar is an execution surface.

Gabby is the intent/router layer.

The deterministic Comparator / Truth Gate remains responsible for verification.

The existing Zero-Trust bootstrap lifecycle remains authoritative for sidecars.

## 13. Research findings — closest existing systems

No exact match was found for the complete APEX combination.

Closest components found:

- **Awal Terminal:** AI-native terminal with AI side panel and push-to-talk voice input.
- **cli-ck / Terax:** AI-native terminal workspace with native PTY, AI side panel, voice input, and multi-pane workspace.
- **Anda Bot:** local assistant architecture spanning browser side panel, terminal, files, memory, and voice.
- **ClickSay:** browser side panel, voice-first workflow, and direct local relay into Claude Code.
- **AgentLimb:** Chrome side panel + local bridge to terminal AI.
- **Chrome Side Panel + Native Messaging:** underlying browser-native primitives needed for APEX's browser-to-local-terminal bridge.

These validate individual pieces. They do NOT establish that the complete APEX FEED/TERMINAL + persistent terminal + sidecar + voice auto-readback + verification workflow is already implemented as one product.

## 14. Build decision

### Build location

**PRIMARY: APEX-TERMINAL GitHub repository.**

### Accelerator

**SECONDARY: Google AI Studio** for rapidly prototyping/refining the React voice/sidecar surface and Gemini Live adapter.

AI Studio can import GitHub projects and sync changes back to GitHub. It should therefore accelerate development without becoming the canonical owner of the APEX system.

### Not the architectural owner

Do not make Grok, Claude, Gemini, OpenAI, Lovable, Vercel, or any other provider the permanent system dependency.

Provider = adapter.

APEX = control plane.

## 15. Phase order

### Phase 1 — Core UX
- FEED / TERMINAL route selector
- persistent session
- sidecar rail
- chat ↔ terminal copy/send
- concise response mode

### Phase 2 — Voice Work Mode
- type + voice coexistence
- microphone input
- automatic response playback
- interrupt playback
- continuous session

### Phase 3 — Native desktop bridge
- Windows native host
- persistent PowerShell/PTY
- reconnect
- health/readiness probe
- audit

### Phase 4 — Truth Gate
- exact requested test
- PASS/FAIL/BLOCKED/UNVERIFIED
- result-first responses
- no fake green

### Phase 5 — Browser extension
- Chrome/Edge side panel
- native messaging
- selected text → terminal
- terminal output → chat

## 16. Acceptance test

A feature is NOT complete until this exact test passes:

1. Open APEX.
2. Open the TERMINAL sidecar.
3. Keep the terminal session alive.
4. Turn WORK/TALK mode on.
5. Ask a question by voice.
6. Receive the answer aloud without asking for playback.
7. Type the next request.
8. Send a terminal command through TERMINAL.
9. See command/output without leaving APEX.
10. Send terminal output back into chat.
11. Ask Gabby to verify the result.
12. Receive a concise PASS/FAIL/BLOCKED/UNVERIFIED result.
13. Continue working without reopening/restarting the terminal.

**That is the definition of done for this capability.**
