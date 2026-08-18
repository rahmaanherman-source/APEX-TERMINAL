# APEX TERMINAL — Forensic Vision Research Addendum

**Date:** 2026-08-18  
**Purpose:** Extend the existing Forensic Vision module with evidence-based digital-forensics and image-forensics foundations.  
**Status:** RESEARCH / IMPLEMENTATION INPUT — not a claim that every technique is currently implemented or validated.

## 1. Scientific foundation

Digital forensics is fundamentally an evidence discipline: acquisition, preservation, examination, analysis, validation, repeatability, reporting, and chain of custody matter. NIST's digital-forensics definition emphasizes preservation of integrity, validated tools, mathematical validation, repeatability, and reporting.

APEX therefore treats the original digital artifact as evidence first and analysis second.

## 2. Research-backed forensic families

The existing `FORENSIC_VISION_MODULE_SPEC.md` already defines the adapter architecture. This addendum supplies the scientific families that should populate those adapters.

### A. Acquisition and integrity

- bit-for-bit preservation where the source permits it
- SHA-256 cryptographic hashing
- file size and MIME/type verification
- acquisition timestamp and source reference
- immutable original plus separately hashed derivatives
- provenance and chain-of-custody records

NIST guidance distinguishes an image as a forensic bit-for-bit copy from an ordinary visual copy. This distinction belongs in APEX's Evidence layer.

### B. Metadata examination

Inspect, when present:

- EXIF
- XMP
- IPTC
- camera make/model
- timestamps
- GPS fields
- software/editing tags
- orientation
- embedded thumbnails
- file/container metadata

Metadata is an observation, not proof of authenticity. It can be absent, stripped, rewritten, or inconsistent.

### C. Compression and JPEG forensics

JPEG compression leaves measurable traces. Research identifies three useful families:

1. JPEG compression detection
2. JPEG quantization-step estimation
3. use of compression features for tamper detection/localization

APEX should record:

- JPEG quantization tables
- estimated quality indicators where defensible
- DCT coefficient statistics
- double-compression indicators
- aligned/non-aligned recompression indicators
- block/grid inconsistencies
- compression anomalies by region

A current 2026 survey highlights the importance of multi-compression, quality-factor dependence, and generalization limits. Therefore APEX must expose limitations rather than convert compression evidence into an absolute verdict.

### D. Copy-move / duplication analysis

Copy-move forgery duplicates a region from one part of an image into another. Established research uses block-based and keypoint-based feature extraction/matching.

APEX should support:

- candidate duplicated regions
- feature/keypoint matching
- block similarity
- geometric consistency
- transformation estimates
- anomaly overlays

The output is an observed candidate region, not an automatic declaration of fraud.

### E. Splicing / compositing

Splicing combines content from different source images. Passive forensic approaches can examine statistical and signal inconsistencies introduced by compositing.

APEX should examine, where supported:

- local noise inconsistency
- boundary artifacts
- illumination/color inconsistencies
- resampling traces
- compression mismatch
- local statistical anomalies

### F. Resampling and geometric transformation

Resizing, rotation, stretching, and related transformations can leave detectable signal patterns.

APEX should preserve both:

- detected transformation indicators
- uncertainty/limitations of the detector

### G. Pixel and residual analysis

Provide derived diagnostic views for:

- high-pass residuals
- local noise maps
- edge inconsistencies
- color-channel anomalies
- statistical residuals
- error-level-style visualizations

Important: a residual visualization is an analysis aid. It is not automatically proof of editing.

### H. Sensor/source-camera analysis

Where source material and validated methods permit, investigate sensor-pattern/noise signatures and camera-source consistency.

Do not claim camera attribution unless the method and reference data support that conclusion.

### I. AI-generated-content analysis

AI-generation detectors belong in a separate adapter family because their outputs are probabilistic and can fail under distribution shift, recompression, resizing, or newer generators.

Record:

- detector/model identity
- model version
- input hash
- score
- threshold/configuration
- calibration dataset if known
- limitations

Never translate a detector score directly into `AUTHENTIC` or `FORGED`.

### J. Document/image forensics

For screenshots, scans, forms, IDs, receipts, and other documents, support:

- OCR
- text/image consistency checks
- layout anomaly detection
- metadata examination
- compression/resampling analysis
- region-level evidence

Document analysis must remain separate from legal authenticity determinations.

## 3. Information-fusion rule

APEX should not collapse every detector into one opaque confidence score.

Represent the evidence vector explicitly:

```text
E = {
  metadata,
  compression,
  residuals,
  duplication,
  resampling,
  source_camera,
  ai_indicator,
  document_integrity,
  provenance
}
```

Then produce a transparent consistency assessment:

```text
AGREEMENT
CONFLICT
INSUFFICIENT_EVIDENCE
UNAVAILABLE
```

A detector disagreement must remain visible.

## 4. Comparator integration

For each measurable expected property `D_i` and observed property `X_i`:

```text
Δ_i = distance(D_i, X_i)
Δ_total = Σ w_i Δ_i
```

Weights must be declared by the analysis specification and must not be secretly changed by the LLM.

For exact integrity checks such as source-byte hashing:

```text
ε = 0
```

For statistical forensic indicators, do **not** pretend that `ε = 0` creates scientific certainty. Statistical detectors require validated thresholds, calibration, known operating conditions, and documented error characteristics.

Therefore APEX uses two distinct gates:

```text
INTEGRITY GATE
    exact / deterministic

FORENSIC INTERPRETATION GATE
    evidence + calibration + limitations + human review
```

## 5. Chain of custody

Every evidence item should maintain:

```text
Evidence ID
↓
Original SHA-256
↓
Acquisition metadata
↓
Analysis execution IDs
↓
Derived artifact hashes
↓
Audit-chain hashes
↓
Reviewer annotations
↓
Report hash
```

No derived artifact replaces the original.

## 6. Reproducibility requirements

Every forensic run should record enough information to repeat it:

- exact input hash
- adapter version
- algorithm/model version
- runtime/environment where practical
- parameters
- thresholds
- random seed where applicable
- dependency versions where practical
- output hashes
- execution timestamp

If the same input and deterministic configuration cannot reproduce a result, APEX must record that limitation.

## 7. Scientific status vocabulary

Use these states:

- `OBSERVED` — a measurable observation was produced.
- `SUPPORTED` — multiple validated observations support an interpretation under stated conditions.
- `CONFLICTING` — relevant observations disagree.
- `INCONCLUSIVE` — evidence is insufficient for the requested determination.
- `BLOCKED` — required tool/data/access unavailable.
- `FAILED` — execution failed.
- `UNVERIFIED` — evidence integrity or provenance has not been established.

Avoid using `AUTHENTIC` or `FORGED` as automatic machine truth states.

## 8. Research limitations that are part of the product

The research literature shows important limitations: detector performance can degrade outside laboratory conditions, multi-compression complicates inference, datasets and evaluation methods are not always standardized, and relatively few authentication techniques are broadly accessible and independently validated.

APEX must therefore display detector limitations alongside results.

This is a feature, not a weakness: the system proves what was observed and preserves uncertainty where science requires it.

## 9. APEX Forensic Vision build order

```text
1. Evidence intake + preservation
2. SHA-256 + metadata
3. JPEG/compression analysis
4. residual/noise analysis
5. copy-move analysis
6. resampling analysis
7. OCR/document analysis
8. AI-generation indicator adapters
9. source-camera methods where validated data exists
10. multi-method evidence board
11. Comparator integration
12. audit-chain integration
13. reproducible forensic report
14. human-review workflow
```

Each stage must pass the APEX lifecycle:

```text
DECLARED
→ ADAPTER PRESENT
→ CONFIGURED
→ RUNNING
→ TESTED
→ VERIFIED
```

No stage is marked VERIFIED merely because its code exists.

## 10. Research references

- NIST digital-forensics terminology and evidence principles: https://csrc.nist.gov/glossary/term/digital_forensics
- NIST IR 8387, Digital Evidence and Forensic Science: https://nvlpubs.nist.gov/nistpubs/ir/2022/NIST.IR.8387.pdf
- *A survey on JPEG image forensics: Exploring key advances and persistent challenges in compression and quantization analysis*, Computers & Security, 2026: https://www.sciencedirect.com/science/article/pii/S0167404826000404
- *A review of digital image forensics*, Computers & Electrical Engineering, 2020: https://www.sciencedirect.com/science/article/pii/S0045790620305401
- *Passive detection of copy-move forgery in digital images: State-of-the-art*, Forensic Science International, 2013: https://www.sciencedirect.com/science/article/pii/S0379073813002971
- *Digital image integrity – a survey of protection and verification techniques*, Digital Signal Processing, 2017: https://www.sciencedirect.com/science/article/abs/pii/S1051200417301938
- *Fool me once: A systematic review of techniques to authenticate digital artefacts*, Forensic Science International: Digital Investigation, 2023: https://www.sciencedirect.com/science/article/pii/S2666281723000173

## Final engineering rule

APEX TERMINAL does not claim that a forensic detector is infallible.

It builds a scientific evidence pipeline:

```text
PRESERVE
→ MEASURE
→ ANALYZE
→ CROSS-CHECK
→ HASH
→ AUDIT
→ REPRODUCE
→ HUMAN REVIEW
→ REPORT
```

**No fake green. No manufactured certainty. Evidence first.**
