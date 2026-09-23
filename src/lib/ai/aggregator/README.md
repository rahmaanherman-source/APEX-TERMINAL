# APEX Aggregator Adapter

The Aggregator lane normalizes provider execution into a provider-neutral
CanonicalResult. It does not choose providers and it does not self-certify.

## Contract

ROUTER SELECTS PROVIDER -> ADAPTER EXECUTES -> READ BACK -> NORMALIZE -> VERIFIER

The adapter records provider id, task id, capability, assets, usage, timing,
and whether a read-back was actually observed.

Timeouts and bounded retries are handled here. Verification remains a separate
step and must use the capability-specific verifier.

No provider response is marked VERIFIED by this adapter alone.
