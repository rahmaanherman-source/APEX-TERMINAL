# APEX TERMINAL — Forensic Vision Research Sources

## Authoritative / Research Sources

1. **NIST — Digital Forensics Glossary**
   https://csrc.nist.gov/glossary/term/digital_forensics
   - Digital forensics includes identification, collection, examination, and analysis of digital evidence while preserving integrity and maintaining chain of custody.
   - NIST's definition also emphasizes validation with mathematics, validated tools, repeatability, reporting, and possible expert testimony.

2. **NIST IR 8387 — Digital Evidence Preservation: Considerations for Evidence Holders**
   https://nvlpubs.nist.gov/nistpubs/ir/2022/NIST.IR.8387.pdf
   - Documents chain-of-custody concerns for digital images/files.
   - Describes cryptographic hashes as a mechanism for detecting changes and recommends secure separate storage of hashes.

3. **NIST — Chain of Custody Glossary**
   https://csrc.nist.gov/glossary/term/chain_of_custody
   - Defines chain of custody as tracking movement of evidence through collection, safeguarding, and analysis, including handlers, dates/times, and transfer purpose.

4. **NIST SP 800-86 — Guide to Integrating Forensic Techniques into Incident Response**
   https://csrc.nist.gov/pubs/sp/800/86/final
   - Practical forensic process guidance emphasizing preservation, examination, analysis, repeatability, and limitations of scope.

5. **Computers & Security (2026) — A survey on JPEG image forensics**
   https://www.sciencedirect.com/science/article/pii/S0167404826000404
   - Covers JPEG compression detection, quantization-step estimation, DCT-based forensic features, double-compression scenarios, and generalization challenges.

6. **Neurocomputing (2025) — A review of double compression detection for digital multimedia**
   https://www.sciencedirect.com/science/article/pii/S0925231225016558
   - Reviews double-compression detection across image, audio, and video forensics and emphasizes generalization limitations.

7. **Forensic image/video analysis overview**
   https://www.sciencedirect.com/science/article/pii/S0379073816301827
   - Reviews passive forensic approaches including double compression, interpolation, copy-paste/copy-move, and noise/chromatic-aberration inconsistency analysis.

8. **2026 Benchmark — How well do open-source AI-generated image detection models work out-of-the-box?**
   https://arxiv.org/abs/2602.07814
   - Evaluates 23 pretrained detector variants across 12 datasets and 291 generators; reports substantial detector instability and generalization limits.

9. **AI-GenBench — Ongoing benchmark for AI-generated image detection**
   https://arxiv.org/abs/2504.20865
   - Uses controlled temporal evaluation to test cross-generator generalization and reproducibility.

10. **AEGIS — Benchmark for forensic analysis of AI-generated academic images**
    https://arxiv.org/abs/2604.28177
    - Demonstrates that even strong forensic systems can have limited localization/detection performance on challenging generated-image categories.

## APEX Research Interpretation Rule

These sources justify an evidence-first design, but they do not prove APEX runtime performance. Research facts enter the repository as documented engineering requirements; implementation claims enter hard project memory only after direct runtime verification.

No research paper, benchmark, model score, or vendor claim becomes a VERIFIED APEX result automatically.
