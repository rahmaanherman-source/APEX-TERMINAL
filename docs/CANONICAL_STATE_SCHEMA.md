# Canonical State Contract v1.0

Every adapter must return a canonical state envelope. Unstructured evidence is rejected as `MALFORMED_EVIDENCE`.

## Envelope

```json
{
  "execution_id": "string",
  "action_id": "string",
  "adapter": "string",
  "observed_at": "ISO-8601 timestamp",
  "status": "string",
  "payload": {},
  "health_ok": true,
  "latency_ms": 0,
  "evidence": [],
  "readback_sha256": "64-hex-or-null"
}
```

## SYSTEM_STATUS payload

Required:

- `status`: string
- `uptime`: number
- `version`: string
- `timestamp`: ISO-8601 string

Allowed status values:

`SOVEREIGN_ONLINE`, `DEGRADED`, `OFFLINE`, `UNVERIFIED`.

## Rules

1. The adapter reports observations; it never reports `VERIFIED`.
2. Missing required state is a verification failure.
3. Inability to observe reality is `UNVERIFIED` or `BLOCKED`, depending on whether the cause is observability or authorization/access.
4. The comparator owns the verification decision.
5. Evidence must be traceable to the execution ID.
