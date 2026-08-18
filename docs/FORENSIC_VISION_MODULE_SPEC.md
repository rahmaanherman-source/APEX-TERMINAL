# APEX TERMINAL — Forensic Vision Module Specification

**Status:** DECLARED / IMPLEMENTATION TARGET  
**Truth rule:** No fake green. No forensic conclusion without evidence and qualified human review.

## 1. Purpose

Add a provider-neutral **Forensic Vision** workspace to APEX TERMINAL for evidence-preserving visual analysis. The module is an analysis and triage aid, not an autonomous authority on authenticity, identity, criminality, or legal admissibility.

Recent research and tooling show useful components for image forensics, including metadata analysis, compression/error-level analysis, pixel/noise analysis, manipulation detection, anomaly maps, OCR/document analysis, and forensic vision-language models. These should be integrated as replaceable adapters rather than treated as a single oracle.

## 2. Core Pipeline

```text
IMPORT / CAPTURE
      ↓
ORIGINAL PRESERVATION
      ↓
SHA-256 + METADATA
      ↓
NORMALIZATION COPY
      ↓
FORENSIC ANALYSIS ADAPTERS
      ├── EXIF / XMP / IPTC
      ├── JPEG / compression analysis
      ├── ELA / residual analysis
      ├── noise / sensor-pattern analysis
      ├── copy-move / duplication analysis
      ├── resampling / scaling indicators
      ├── AI-generated-content indicators
      ├── OCR / document integrity analysis
      ├── visual anomaly maps
      └── optional forensic VLM
      ↓
EVIDENCE PACKET
      ↓
COMPARATOR / CONSISTENCY CHECK
      ↓
AUDIT LEDGER
      ↓
HUMAN REVIEW
      ↓
REPORT
```

## 3. Evidence Preservation

The original input is immutable from the module's perspective.

Record at intake:

- `evidence_id`
- `execution_id`
- original filename
- MIME type
- byte length
- SHA-256
- capture/import timestamp
- available filesystem metadata
- source reference
- EXIF/XMP/IPTC metadata when present

Never overwrite the original evidence object during enhancement or reconstruction. All derived images receive their own artifact IDs and hashes.

## 4. Analysis Adapters

Each detector is an APEX adapter with the normal lifecycle:

`DISCOVERED → AVAILABLE → AUTHORIZED → CONNECTED → RUNNING → TESTED → VERIFIED`

or `BLOCKED / FAILED / UNVERIFIED`.

Candidate adapter families:

- `metadata_forensics`
- `compression_forensics`
- `pixel_residuals`
- `noise_analysis`
- `copy_move_detection`
- `resampling_detection`
- `ai_generation_detection`
- `ocr_document_forensics`
- `visual_anomaly_map`
- `forensic_vlm`

Use open/local models where practical. Provider/model identity, version, parameters, and runtime must be recorded whenever available.

## 5. Canonical Forensic Result

```json
{
  "evidence_id": "...",
  "execution_id": "...",
  "adapter_id": "...",
  "analysis_type": "compression_forensics",
  "input_sha256": "...",
  "model_or_algorithm": "...",
  "model_version": "...",
  "parameters": {},
  "observations": [],
  "anomaly_regions": [],
  "derived_artifact_sha256": "...",
  "status": "OBSERVED",
  "limitations": [],
  "timestamp": "..."
}
```

`OBSERVED` means the adapter observed a measurable result. It does **not** mean that the image is proven authentic or forged.

## 6. No-Fake-Green Truth Gate

The module must never convert a detector score into an absolute forensic verdict automatically.

Allowed top-level states:

- `OBSERVED` — measurable evidence was produced.
- `INCONCLUSIVE` — evidence is insufficient or conflicting.
- `BLOCKED` — required access/runtime is unavailable.
- `FAILED` — analysis execution failed.
- `UNVERIFIED` — evidence exists but its integrity/chain cannot yet be verified.

A probabilistic detector confidence is metadata, not truth.

## 7. Multi-Method Agreement

Where multiple independent methods are available, show their observations separately and calculate a transparent agreement summary. Do not hide disagreement behind a single confidence number.

Example:

```text
EXIF: observed metadata inconsistency
COMPRESSION: no significant anomaly observed
PIXEL RESIDUAL: anomaly region observed
AI DETECTOR: elevated synthetic-content score

OVERALL: INCONCLUSIVE
REASON: independent methods disagree
```

## 8. Visual Workspace

APEX TERMINAL should provide:

- original image viewer
- zoom/pan
- side-by-side comparison
- overlay mode
- heatmap/anomaly map
- metadata panel
- pixel/residual views
- crop/region selection
- measurement tools
- before/after derived-artifact comparison
- evidence timeline
- audit/evidence panel

The UI should remain simple: **Analyze**, **Compare**, **Evidence**, **Report**. Advanced diagnostics remain expandable.

## 9. Chain of Custody / Audit

Every analysis creates an audit event containing:

```text
execution_id
previous_hash
current_hash
evidence_id
input_sha256
adapter_id
algorithm/model
parameters_hash
result_hash
timestamp
operator/session reference
status
```

Derived artifacts never replace source evidence.

## 10. Report Generation

Reports must distinguish:

1. source facts
2. measured observations
3. algorithmic indicators
4. model outputs
5. conflicts/limitations
6. human-review notes
7. final human determination, if supplied by an authorized reviewer

Never write `AUTHENTIC`, `FORGED`, `IDENTIFIED`, or `COURT-ADMISSIBLE` as an automated fact unless the product later implements a separately validated workflow whose legal/forensic authority is explicitly established.

## 11. Research Targets

APEX should evaluate, not blindly copy, relevant approaches such as:

- multi-method image forensics suites
- forensic vision-language models
- anomaly-scoring methods such as VAAS
- document-forensics models such as DocShield
- open-source image-forensics tooling

Model and library licenses must be checked before bundling or redistribution.

## 12. Integration With APEX Memory Slabs

Verified facts about the evidence workflow may enter the project Memory Slab:

```text
INPUT HASH
→ ANALYSIS RECORD
→ RESULT HASH
→ AUDIT EVENT
→ HUMAN REVIEW
→ VERIFIED MEMORY
```

Raw evidence stays in the evidence store. Memory stores provenance and verified conclusions/references, not an uncontrolled copy of every artifact.

## 13. Acceptance Tests

The module is not VERIFIED until it can:

- ingest a real image
- preserve the original bytes
- calculate and read back SHA-256
- extract available metadata
- execute at least one real forensic analysis adapter
- persist the analysis result
- hash the derived artifact/result
- write an audit event
- display the evidence chain
- correctly report an intentionally malformed or unavailable analysis as FAILED/BLOCKED/UNVERIFIED
- preserve conflicting detector results without manufacturing certainty

**Final rule:** forensic vision is an evidence-analysis capability. APEX TERMINAL proves what its tools actually observed; it does not manufacture certainty where the evidence does not support it.
