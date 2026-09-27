# APEX CAPABILITY BOUNDARY

The media-generation restriction is enforced as a **deny-by-default capability boundary**.

## Enforcement order

REQUEST
→ PRE-GENERATION CLASSIFIER
→ ROUTING POLICY
→ CAPABILITY CONTRACT
→ EXECUTE

Every tool call must independently pass authorization. A model response cannot override the contract.

## Security law

- Anything not explicitly allowed is DENIED.
- Forbidden media capabilities remain blocked even if a resolver misclassifies the tool.
- The classifier is defense-in-depth; it does not replace authorization.
- No fallback or provider substitution may bypass a blocked capability.
- MCP servers are not trusted merely because they are discoverable; they require registration and authorization.
- Documentation is not runtime evidence. Tests must execute before a control is marked TESTED or VERIFIED.

## Output surface

The contract currently permits:
- text generation
- code generation
- diagrams
- ASCII
- local file reads
- web search

The contract explicitly forbids image/video/audio generation and media editing/upscaling/enhancement.

This policy is additive to the broader APEX provider registry: provider availability does not grant an agent capability. Runtime authorization must enforce this boundary.
