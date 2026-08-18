# APEX TERMINAL — FORENSIC VISION SCIENCE VALIDATION

**Status:** VERIFIED RESEARCH BASELINE / IMPLEMENTATION GUIDANCE
**Scope:** Digital image/file forensics, evidence integrity, statistical interpretation
**Truth rule:** No fake green. Research evidence is not runtime verification.

## 1. Evidence Integrity

NIST describes digital forensics as the scientific identification, collection, examination, and analysis of digital evidence while preserving integrity and maintaining chain of custody. NIST guidance also emphasizes validated tools, repeatability, reporting, and appropriate authority. [NIST CSRC Digital Forensics](https://csrc.nist.gov/glossary/term/digital_forensics)

NIST IR 8387 documents that digital image/file evidence should preserve original-source information and that cryptographic hashes can detect changes to the file. It recommends storing hashes separately from the evidence object. [NIST IR 8387](https://nvlpubs.nist.gov/nistpubs/ir/2022/NIST.IR.8387.pdf)

APEX implementation consequence:

- Preserve original evidence bytes.
- Record source, acquisition/import time, operator/session reference, and provenance.
- Compute SHA-256 at intake and on read-back.
- Keep integrity hashes separate from the original evidence object where the storage architecture permits.
- Never treat a matching hash as proof of the historical authenticity or truth of the content; it proves byte-level integrity relative to the recorded digest.

## 2. Chain of Custody

NIST defines chain of custody as tracking movement of evidence through collection, safeguarding, and analysis, including who handled it, when, and why. [NIST Chain of Custody](https://csrc.nist.gov/glossary/term/chain_of_custody)

APEX implementation consequence:

`COLLECT → IDENTIFY → HASH → STORE → ANALYZE → PRESERVE → REPORT`

Every material event receives an execution ID and audit record.

## 3. JPEG / DCT Forensics

JPEG forensics can analyze compression traces, quantization parameters, and statistical patterns in DCT coefficients. Recent survey literature classifies JPEG compression detection, quantization-step estimation, and downstream applications such as tampering localization, while highlighting major limitations from recompression, quality-factor variation, heterogeneous platforms, and generalization. [Computers & Security, 2026 JPEG forensics survey](https://www.sciencedirect.com/science/article/pii/S0167404826000404)

APEX implementation consequence:

- Treat JPEG/DCT outputs as forensic observations.
- Record codec/container, quantization-related measurements, quality assumptions, and analysis parameters.
- Never interpret a double-compression indicator as standalone proof of manipulation.
- Report known recompression/generalization limitations.

## 4. Passive Image Forensics

Established passive forensic approaches include double-compression analysis, interpolation/resampling analysis, copy-paste/copy-move detection, and noise/chromatic-aberration inconsistency analysis. [PIZZARO overview](https://www.sciencedirect.com/science/article/pii/S0379073816301827)

APEX implementation consequence:

- Keep each forensic method as a separate adapter.
- Preserve intermediate outputs and hashes.
- Report each method independently before any cross-method synthesis.

## 5. AI-Generated Image Detection

Recent benchmark research shows that out-of-the-box AI-generated-image detectors can vary substantially across datasets and generators. A 2026 benchmark of 23 pretrained detector variants across 12 datasets and 291 generators found unstable rankings and major performance variation, demonstrating that there is no universal detector that can be treated as ground truth. [2026 benchmark](https://arxiv.org/abs/2602.07814)

Additional research likewise finds that generalization can degrade when detectors encounter unseen generators and stresses controlled, reproducible evaluation. [AI-GenBench](https://arxiv.org/abs/2504.20865)

APEX implementation consequence:

- Detector score = probabilistic evidence, never proof.
- Record detector identity/version, dataset assumptions when known, threshold, operating conditions, and output score.
- Require cross-method comparison and explicit limitations.
- Do not convert a detector score into `AUTHENTIC` or `FORGED` automatically.

## 6. Statistical Interpretation

Forensic outputs should distinguish:

- observation
- measurement
- algorithmic indicator
- probabilistic model output
- hypothesis
- human determination

The APEX top-level result should therefore use:

`OBSERVED`
`INCONCLUSIVE`
`BLOCKED`
`FAILED`
`UNVERIFIED`

A probabilistic score is metadata attached to the evidence packet, not the truth field.

## 7. Scientific Validity Requirements

Every forensic method integrated into APEX must document:

- method name
- algorithm/library
- version
- parameters
- input hash
- output/derived-artifact hash
- known assumptions
- quality conditions
- limitations
- false-positive/false-negative information when available
- validation dataset or benchmark when known
- reproducibility information
- runtime environment

Before a detector is promoted to a verified adapter, APEX must test it on known control material with documented expected outcomes.

## 8. Comparator Boundary

The deterministic Comparator is appropriate for exact machine-checkable properties such as:

- byte/hash equality
- schema validity
- evidence-field completeness
- expected file identity
- artifact read-back integrity
- exact metadata invariants

It is not valid to impose `epsilon = 0` on every statistical forensic interpretation merely because the system uses a deterministic comparator. Statistical forensic indicators must retain their uncertainty and calibration information.

## 9. Human Review Boundary

NIST materials emphasize scientific reliability, repeatability, preservation, and reporting. APEX therefore treats qualified human review as a separate layer for consequential forensic interpretation. Automated adapters produce evidence; they do not silently become legal or forensic authorities.

## 10. Acceptance Criteria

The Forensic Vision module may be marked runtime VERIFIED only after it has:

1. ingested a real test image;
2. preserved original bytes;
3. computed SHA-256;
4. successfully read the evidence back;
5. executed at least one real forensic method;
6. persisted the method result and parameters;
7. hashed the derived result where applicable;
8. written the audit event and chain hash;
9. demonstrated a controlled failure case;
10. demonstrated an unavailable/blocked case;
11. preserved disagreement between methods without manufacturing certainty;
12. recorded reproducibility metadata.

**Important:** this file is a research/engineering baseline. It does not itself prove that the APEX implementation has passed these runtime tests.
