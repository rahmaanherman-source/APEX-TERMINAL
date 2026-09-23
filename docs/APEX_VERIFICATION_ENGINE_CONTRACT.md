# APEX VERIFICATION ENGINE — CRYPTOGRAPHIC + PHYSICS GATE CONTRACT

This document is the control-plane implementation contract for the Paper Trail verification architecture.

## Implemented source modules

- src/lib/verification/cryptographic.ts
- src/lib/verification/physicsGate.ts

## Required runtime contract

REQUEST
→ AUTHORIZATION
→ PLAN
→ EXECUTE
→ READ BACK
→ COMPARE
→ VERIFY
→ AUDIT
→ PERSIST
→ REPORT

## Cryptographic rules

1. Canonicalize structured evidence deterministically.
2. SHA-256 every evidence, criteria, review, and task record.
3. Sort dependency hashes before task hashing.
4. Build a deterministic Merkle root from sorted task hashes.
5. Persist workflow_root.
6. Recompute workflow_root during integrity checks.
7. Any mismatch is TAMPER_DETECTED.
8. Tamper detection blocks verification propagation.

## State separation

verificationStatus:
- VERIFIED
- UNVERIFIED
- FAILED

claimState:
- SUPPORTED
- REFUTED
- UNKNOWN

VERIFIED does not mean SUPPORTED.

VERIFIED + REFUTED is a successful verification outcome.

## Dependency rules

HARD:
The downstream node cannot retain validity without the parent.

SOFT:
The downstream node can retain conditional validity when a valid independent evidence path exists. Mark REVIEW when such a path exists; otherwise REQUIRES_REVALIDATION.

## Freshness

Verification records may have TTL. Expired records become STALE. STALE records cannot satisfy production execution gates.

Dependency, environment, calibration, model, methodology, and acceptance-criteria changes may invalidate records before TTL expiry.

## Reviewer separation

executor_id must not equal reviewer_id for auditable verification.

The reviewer must be authorized for the verification class.

## Physics gate

Physical-energy claims must pass a first-order physics check before expensive CAD/manufacturing work.

Thermosiphon_Physics_Model
→ HARD
Design_Release
→ HARD
Manufacturing_Files

A failed physics gate produces:
CLAIM_STATE = REFUTED
PRODUCT_STATUS = BLOCKED

## Thermosiphon result

The original passive 10-ft / 4-inch / approximately 20°C differential / 40-W claim is not accepted as a product specification.

The first-order model calculates approximately 87 Pa of buoyancy pressure under the simplified temperature/density assumptions and approximately 0.46 m³/s required flow for 40 W before real-world losses. This is a magnitude-level feasibility failure. Detailed hydraulic/thermal modeling and physical measurement are required for any redesigned claim.

## Customer propagation

Customer-facing claims require:
- verificationStatus = VERIFIED
- claimState = SUPPORTED
- all HARD dependencies valid
- required SOFT dependencies reviewed
- no tamper condition
- no required verification STALE

Otherwise customer-facing propagation is BLOCKED.

## Important implementation boundary

The source modules establish the core algorithms and contract. They do not by themselves prove that every APEX runtime path invokes these gates. Integration into the live execution/router/release pipeline remains a separate runtime verification task.

No fake-green state is permitted.
