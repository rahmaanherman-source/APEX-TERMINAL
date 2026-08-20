import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
REGISTRY_PATH = ROOT / "config" / "integration-registry.json"

REQUIRED_PROVIDER_IDS = {
    "shopify",
    "stripe",
    "paypal",
    "printify",
    "analytics",
    "crm",
    "email",
    "fulfillment",
    "slack",
    "microsoft-teams",
    "outlook",
    "sharepoint",
    "onedrive",
    "notion",
    "linear",
    "clickup",
    "atlassian",
}


def load_registry():
    return json.loads(REGISTRY_PATH.read_text(encoding="utf-8"))


def test_registry_contains_required_business_and_work_integrations():
    registry = load_registry()
    provider_ids = {provider["id"] for provider in registry["providers"]}
    assert REQUIRED_PROVIDER_IDS <= provider_ids


def test_registry_separates_lifecycle_from_truth_state():
    registry = load_registry()
    assert registry["lifecycle_states"] == [
        "DISCOVERED",
        "AVAILABLE",
        "INSTALLED",
        "CONFIGURED",
        "CONNECTED",
        "TESTED",
    ]
    assert registry["truth_states"] == [
        "VERIFIED",
        "OBSERVED",
        "BLOCKED",
        "FAILED",
        "UNKNOWN",
    ]


def test_new_integrations_are_not_marked_verified_by_registration():
    registry = load_registry()
    required = {provider["id"] for provider in registry["providers"]} & REQUIRED_PROVIDER_IDS
    for provider in registry["providers"]:
        if provider["id"] in required:
            assert provider["initial_truth_state"] in {"UNKNOWN", "BLOCKED"}
            assert provider["initial_lifecycle_state"] == "DISCOVERED"


def test_credentials_are_references_only():
    registry = load_registry()
    serialized = json.dumps(registry).lower()
    forbidden = ["sk_live_", "sk_test_", "password=", "api_key=", "secret="]
    assert not any(token in serialized for token in forbidden)
