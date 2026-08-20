#!/usr/bin/env python3
"""Validate the provider-neutral APEX integration registry."""

import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
REGISTRY = ROOT / "config" / "integration-registry.json"


def validate() -> None:
    data = json.loads(REGISTRY.read_text(encoding="utf-8"))

    lifecycle = data["lifecycle_states"]
    truth = data["truth_states"]
    providers = data["providers"]

    assert lifecycle == [
        "DISCOVERED",
        "AVAILABLE",
        "INSTALLED",
        "CONFIGURED",
        "CONNECTED",
        "TESTED",
    ]
    assert truth == ["VERIFIED", "OBSERVED", "BLOCKED", "FAILED", "UNKNOWN"]

    ids = [provider["id"] for provider in providers]
    assert len(ids) == len(set(ids)), "provider IDs must be unique"

    for provider in providers:
        assert provider["id"]
        assert provider["category"]
        assert provider["modes"]
        if "initial_truth_state" in provider:
            assert provider["initial_truth_state"] in {"UNKNOWN", "BLOCKED"}
        if "initial_lifecycle_state" in provider:
            assert provider["initial_lifecycle_state"] == "DISCOVERED"

    serialized = json.dumps(data).lower()
    for forbidden in ("sk_live_", "sk_test_", "password=", "api_key=", "secret="):
        assert forbidden not in serialized, f"raw secret-like value found: {forbidden}"


if __name__ == "__main__":
    validate()
    print("APEX integration registry: VALID")
