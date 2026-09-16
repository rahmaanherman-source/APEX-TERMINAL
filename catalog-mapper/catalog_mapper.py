from __future__ import annotations

import csv
import io
import re
from typing import Iterable


TRUTH_STATES = {"VERIFIED", "FAILED", "BLOCKED", "UNVERIFIED"}

ALIASES = {
    "title": {"title", "product title", "name", "product name", "item name"},
    "description": {"description", "product description", "body", "details"},
    "sku": {"sku", "seller sku", "product sku", "variant sku"},
    "price": {"price", "sale price", "retail price", "selling price"},
    "cost": {"cost", "cost price", "wholesale price", "unit cost"},
    "inventory": {"inventory", "quantity", "stock", "stock qty", "inventory quantity"},
    "size": {"size", "option1 value", "option 1 value", "variant size"},
    "color": {"color", "colour", "option2 value", "option 2 value", "variant color"},
    "category": {"category", "product category", "type", "product type"},
    "image_url": {"image", "image url", "image_url", "image src", "image source", "main image"},
    "image_urls": {"images", "image urls", "image_urls", "additional images", "additional image urls"},
}


def normalize_header(value: str) -> str:
    return re.sub(r"\s+", " ", value.strip().lower().replace("_", " ").replace("-", " "))


def read_delimited(text: str) -> list[dict[str, str]]:
    sample = text[:4096]
    dialect = csv.Sniffer().sniff(sample) if sample.strip() else csv.excel
    return list(csv.DictReader(io.StringIO(text), dialect=dialect))


def infer_mapping(source_headers: list[str], target_headers: list[str]) -> dict[str, str | None]:
    normalized = {normalize_header(h): h for h in source_headers}
    mapping: dict[str, str | None] = {}
    for target in target_headers:
        nt = normalize_header(target)
        if nt in normalized:
            mapping[target] = normalized[nt]
            continue
        key = next((k for k, aliases in ALIASES.items() if nt == k or nt in aliases), None)
        candidate = None
        if key:
            for alias in {key, *ALIASES[key]}:
                if alias in normalized:
                    candidate = normalized[alias]
                    break
        if candidate is None:
            for nh, original in normalized.items():
                if nt and (nt in nh or nh in nt):
                    candidate = original
                    break
        mapping[target] = candidate
    return mapping


def _split_images(value: str | None) -> list[str]:
    if not value:
        return []
    parts = re.split(r"\s*[|;]\s*", value.strip())
    return [p for p in parts if p]


def canonicalize(rows: list[dict[str, str]], mapping: dict[str, str | None]) -> list[dict[str, object]]:
    out: list[dict[str, object]] = []
    for row in rows:
        item: dict[str, object] = {}
        for target, source in mapping.items():
            item[target] = (row.get(source, "").strip() if source else "")
        image_value = str(item.get("image_url", ""))
        more_images = str(item.get("image_urls", ""))
        images = _split_images(image_value) + _split_images(more_images)
        item["images"] = images
        out.append(item)
    return out


def validate_assets(records: list[dict[str, object]]) -> dict[str, object]:
    problems: list[dict[str, object]] = []
    for idx, record in enumerate(records, start=2):
        urls = record.get("images") or []
        for url in urls if isinstance(urls, list) else []:
            if not re.match(r"^(https?://|/|data:image/)", str(url), flags=re.I):
                problems.append({"row": idx, "field": "images", "reason": "invalid image reference", "value": url})
    return {"ok": not problems, "problems": problems}


def validate_records(records: list[dict[str, object]], required: list[str], allowed: dict[str, list[str]] | None = None) -> dict[str, object]:
    problems: list[dict[str, object]] = []
    seen_skus: dict[str, int] = {}
    for idx, record in enumerate(records, start=2):
        for field in required:
            if not str(record.get(field, "")).strip() and not (field == "images" and record.get(field)):
                problems.append({"row": idx, "field": field, "reason": "required value missing"})
        sku = str(record.get("sku", "")).strip()
        if sku:
            if sku in seen_skus:
                problems.append({"row": idx, "field": "sku", "reason": "duplicate SKU", "value": sku, "first_row": seen_skus[sku]})
            else:
                seen_skus[sku] = idx
        for field, allowed_values in (allowed or {}).items():
            value = str(record.get(field, "")).strip()
            if value and value not in allowed_values:
                problems.append({"row": idx, "field": field, "reason": "value not allowed", "value": value})
    asset_result = validate_assets(records)
    problems.extend(asset_result["problems"])
    state = "VERIFIED" if not problems else "FAILED"
    return {"state": state, "ok": not problems, "count": len(records), "problems": problems}


def generate_csv(rows: list[dict[str, object]], headers: list[str]) -> str:
    buffer = io.StringIO()
    writer = csv.DictWriter(buffer, fieldnames=headers, extrasaction="ignore", lineterminator="\n")
    writer.writeheader()
    for row in rows:
        writer.writerow({h: row.get(h, "") for h in headers})
    return buffer.getvalue()


def chunk_rows(rows: list[dict[str, object]], max_bytes: int) -> list[list[dict[str, object]]]:
    if max_bytes <= 0:
        raise ValueError("max_bytes must be positive")
    chunks: list[list[dict[str, object]]] = []
    current: list[dict[str, object]] = []
    for row in rows:
        probe = current + [row]
        payload = generate_csv(probe, list(row.keys()))
        if current and len(payload.encode("utf-8")) > max_bytes:
            chunks.append(current)
            current = [row]
        else:
            current = probe
    if current:
        chunks.append(current)
    return chunks


def build_package(rows: list[dict[str, str]], destination: dict[str, object]) -> dict[str, object]:
    headers = list(destination["headers"])
    mapping = infer_mapping(list(rows[0].keys()) if rows else [], headers)
    canonical = canonicalize(rows, mapping)
    validation = validate_records(canonical, list(destination.get("required", [])), destination.get("allowed"))
    generated = generate_csv(canonical, headers)
    max_bytes = int(destination.get("max_bytes") or 15_000_000)
    parts = chunk_rows(canonical, max_bytes)
    outputs = [generate_csv(part, headers) for part in parts]
    return {
        "state": validation["state"] if validation["state"] in TRUTH_STATES else "UNVERIFIED",
        "mapping": mapping,
        "validation": validation,
        "generated_csv": generated,
        "parts": outputs,
        "counts": {"products": len(canonical), "output_parts": len(outputs)},
        "asset_manifest": [{"row": i + 2, "images": record.get("images", [])} for i, record in enumerate(canonical)],
    }
