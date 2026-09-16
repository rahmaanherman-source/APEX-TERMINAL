# APEX FileForge Build Specification

## Product
A focused web/local application for transforming product catalogs into exact destination-ready files.

## Front page
1. Drop/upload file
2. Choose destination
3. Build My File
4. Live progress
5. Validation result
6. Download output

## Supported source types
CSV, XLSX, JSON, XML, ZIP, supplier exports, marketplace exports, and structured feeds where a parser is available.

## Shopify V1
The validator must implement the currently documented Shopify product CSV constraints used by the application. Do not hard-code assumptions that are not represented in the destination schema/configuration.

Validate at minimum:
- required headers/field names
- UTF-8 encoding
- product/variant relationships
- SKU consistency
- option/variant completeness
- price/inventory values
- image references
- duplicate records
- malformed rows
- file size/chunk requirements
- unmapped source columns

## Truth model
Every output field should be traceable to:
- source value
- deterministic transformation
- user-supplied value
- AI-assisted mapping decision
- unavailable/missing state

AI may map fields and explain ambiguity. AI may not invent factual merchandise data.

## Large jobs
For 10,000+ records:
- stream/chunk processing where practical
- expose records processed
- expose percentage
- expose phase
- expose warnings/errors
- calculate an ETA from observed throughput
- label ETA as an estimate
- never claim the process is stuck merely because a phase is slow

## Artifact naming
Use:
YYYY-MM-DD_Destination_Artifact_vNNN.ext

Job folders:
YYYY-MM-DD/Destination/JOB-######/

Artifact categories:
INPUT, IMAGES, MAPPINGS, RESEARCH, VALIDATION, OUTPUT, REPORT

Sort displayed lists alphabetically unless chronological ordering is explicitly more useful.

## Acceptance
A job is VERIFIED only after:
1. source parsed successfully
2. mapping completed
3. validation completed
4. required errors resolved or explicitly accepted where supported
5. destination file generated
6. output re-read and structurally validated
7. evidence recorded
