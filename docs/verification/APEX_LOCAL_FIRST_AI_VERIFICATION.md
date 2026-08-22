# APEX Local-First AI Verification

## Status

**Runtime verification: PENDING LOCAL WORKSTATION EXECUTION**

This document records the implementation boundary only. It does not assert that Ollama, LM Studio, or any model is installed or healthy.

## Implemented repository boundary

- `lib/apex/truth.ts` defines dual operational/governance state and VEO generation.
- `app/api/local-ai/route.ts` performs a real bounded Ollama health probe and a real local inference read-back.
- `app/api/truth/route.ts` exposes Truth Gate state without promoting HTTP health into governance verification.
- `config/local-model-registry.json` records candidate local runtimes as `UNKNOWN` / `CANDIDATE` until observed.
- `components/Terminal/Terminal.tsx` renders live Truth Gate state and refuses simulated Gabby responses.
- `components/Terminal/TerminalInput.tsx` provides the command boundary used by the Terminal.

## Required local acceptance sequence

```text
cd ~/Projects/apex-terminal
ollama run qwen2.5-coder:7b
pnpm dev
```

Then verify:

1. Terminal initially shows `TRUTH: PROBING...`, never a hard-coded green badge.
2. `/api/truth` observes the local runtime.
3. `local-ai` returns an actual model inventory or a truthful failure.
4. `gabby <instruction>` uses the local inference route only when a locally observed model exists.
5. If the local daemon is unavailable, the Terminal reports `FAILED` / `REQUIRES_LOCAL_DAEMON`; it does not synthesize a response.
6. A successful HTTP probe does not produce `GOV: VERIFIED` automatically.
7. A real inference read-back may produce governance `TESTED`; `VERIFIED` still requires the broader APEX governance/evidence gate.

## Security boundary

Raw credentials are not accepted by these routes. Provider secrets remain outside the browser/Gabby conversation state. Future external-provider actions must use a `credentialRef` through the Gatekeeper.

## Important limitation

The GitHub repository can be changed here, but the local Windows workstation, Ollama daemon, browser CORS behavior, and `pnpm dev` process cannot be truthfully claimed as executed from this conversation. Those remain an explicit local verification step.
