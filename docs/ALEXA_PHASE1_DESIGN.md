# APEX HERITAGE — Alexa Phase 1

Status: DESIGN ARTIFACT / NOT RUNTIME-VERIFIED

## Purpose

Define the first Alexa integration as a thin voice adapter over the existing APEX Heritage API. Alexa is not a second truth source. It requests live APEX state and reports the state returned by the APEX verification boundary.

## Architecture

```text
Alexa
  -> APEX Heritage Skill
  -> Lambda adapter
  -> APEX API
  -> Truth Gate / Comparator
  -> evidence + audit
  -> Lambda response
  -> Alexa
```

## Allowed truth states

`OBSERVED | FAILED | BLOCKED | UNVERIFIED | INCONCLUSIVE | NOT_CONNECTED`

The skill must not convert any of these into an unsupported authenticity claim.

## Repository artifacts

- `skill-package/interactionModels/custom/en-US.json`
- `skill-package/lambda/src/index.ts`

## Important implementation correction

Alexa response directives belong under `response.directives`; they are not the value of `response.outputSpeech`. The implementation therefore keeps speech and directives separate. Alexa's official response contract requires `version` and `response`, and documents directives as a response-level array. citeturn0search0turn0search1

APL is optional for Phase 1 and should be added as a real `Alexa.Presentation.APL.RenderDocument` directive with an APL document and data source when Echo Show visuals are implemented. citeturn0search3turn0search5turn0search6

## Security boundary

`APEX_API_KEY` is an environment secret. It must never be committed to Git, returned by the skill, or embedded in the interaction model.

## Verification boundary

Repository files prove that the design/code artifact exists. They do not prove that an Alexa skill is deployed, that Lambda is reachable, that the APEX API is reachable, or that a Truth Gate has returned live evidence. Those remain UNVERIFIED until runtime tests produce evidence.

## ASK CLI

The official Alexa documentation supports `ask configure` for linking ASK CLI with Amazon Developer/AWS credentials. citeturn0search10

## Acceptance tests

1. Interaction model validates.
2. Lambda package typechecks/builds.
3. Lambda returns valid Alexa response JSON.
4. Missing APEX endpoint returns NOT_CONNECTED.
5. API failure returns FAILED rather than success.
6. Truth Gate BLOCKED remains BLOCKED.
7. Truth Gate OBSERVED remains OBSERVED.
8. No response is labeled VERIFIED unless the underlying APEX verification contract explicitly supplies that verified state.
9. End-to-end test is performed against a real deployed endpoint before claiming runtime verification.
