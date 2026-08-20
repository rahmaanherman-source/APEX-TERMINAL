# Canonical State Contract v2.0

Every adapter returns observations through a canonical state envelope. Unstructured evidence is rejected as `MALFORMED_EVIDENCE`.

## Core law

**Lifecycle is not truth.**

A provider can be `CONNECTED` while its truth state is still `UNKNOWN`. A provider can be `TESTED` and still fail the verification contract. Registration never creates a green state.

## Envelope

```json
{
  "execution_id": "string",
  "action_id": "string",
  "adapter": "string",
  "provider": "string",
  "observed_at": "ISO-8601 timestamp",
  "lifecycle_state": "DISCOVERED | AVAILABLE | INSTALLED | CONFIGURED | CONNECTED | TESTED",
  "truth_state": "VERIFIED | OBSERVED | BLOCKED | FAILED | UNKNOWN",
  "payload": {},
  "health_ok": true,
  "latency_ms": 0,
  "evidence": [],
  "readback_sha256": "64-hex-or-null"
}
```

## Lifecycle states

- `DISCOVERED` — APEX found or registered a candidate provider/resource.
- `AVAILABLE` — The provider is known to be reachable/available in principle, but no owner-specific connection is established.
- `INSTALLED` — A local executable/package/tool was observed.
- `CONFIGURED` — Required configuration references are present, but live connection is not yet proven.
- `CONNECTED` — A real adapter path authenticated or otherwise established a connection.
- `TESTED` — A capability-specific probe completed and produced read-back evidence.

## Truth states

- `VERIFIED` — The deterministic verification contract passed with sufficient evidence.
- `OBSERVED` — The asset exists and was observed, but the full verification contract has not passed.
- `BLOCKED` — Verification cannot proceed because required authorization/configuration/access is unavailable.
- `FAILED` — A required probe or comparison failed.
- `UNKNOWN` — No sufficient probe has established truth.

## Rules

1. Adapters report observations; they never assign `VERIFIED`.
2. The Comparator and Verify Gate own the verification decision.
3. Missing required evidence prevents verification.
4. Inability to observe reality is `UNKNOWN` or `BLOCKED`, depending on whether the cause is observability or authorization/access.
5. Evidence must be traceable to `execution_id`.
6. A provider registration is never evidence of connection.
7. HTTP 200 is never sufficient by itself to prove a complete business or application capability.
8. Production revenue must remain distinguishable from sandbox/test activity.
9. Credentials are represented by secure references only; raw secrets never enter this envelope.
10. External providers remain authoritative for their own underlying records; APEX verifies observed claims against provider read-back.
