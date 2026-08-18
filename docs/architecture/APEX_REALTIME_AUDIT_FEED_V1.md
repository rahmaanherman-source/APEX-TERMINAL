# APEX REAL-TIME AUDIT FEED v1

## Purpose

Provide the operator with a live, evidence-backed stream of everything the Real-Time Engine is doing.

## Feed record

```json
{
  "event_id": "uuid",
  "execution_id": "uuid",
  "correlation_id": "uuid",
  "timestamp": "ISO-8601",
  "actor": "owner-or-service",
  "repository": "owner/repo",
  "project": "project-id",
  "engine": "blender|unreal|tripo|web|game|github|cloud",
  "phase": "VALIDATION|EXECUTION|VERIFICATION",
  "operation": "build|render|generate|test|deploy",
  "operational_state": "QUEUED|RUNNING|SUCCEEDED|FAILED|BLOCKED",
  "truth_state": "VERIFIED|UNVERIFIED|CONFLICTING|OUTDATED",
  "message": "human-readable event",
  "artifact_ref": null,
  "duration_ms": null,
  "retry_count": 0,
  "evidence_ref": null
}
```

## UI behavior

- New events appear from the real event stream.
- Selecting an event opens the underlying execution/evidence record.
- Failed events show the actual failure.
- Blocked events show the blocking dependency/policy.
- Verified events show the evidence that earned verification.
- No manually fabricated green status.

## Retention

The live stream is a view. The durable audit/evidence store is authoritative.

## Integration with APEX Heritage

Heritage acquisition, Truth Gate, provenance, marketplace, and vault events use the same feed contract. This lets APEX TERMINAL observe Heritage without taking ownership of Heritage's domain data.

## Integration with APEX Hub

APEX Hub remains a higher-level product/control surface. APEX TERMINAL is the developer/operator execution surface. Both consume canonical events rather than duplicating state.
