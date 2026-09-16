# Universal Catalog Mapper

Single-purpose bulk catalog mapper: source catalog → destination schema → assets → validation → export.

## Run

```bash
cd catalog-mapper
python server.py
```

Open `http://127.0.0.1:8787`.

## Test

From the repository root:

```bash
python -m unittest discover -s catalog-mapper/tests -v
```

## Destination templates

Some platforms require an official, category-specific template. Those destinations are intentionally marked `template_required` rather than guessing fields. Paste/provide the official template and the mapper can use its headers as the output contract.

## Current boundary

This component does not publish into stores by itself. Its core result is a validated import package. Direct APIs/uploads can be added as destination adapters without changing the core mapper.
