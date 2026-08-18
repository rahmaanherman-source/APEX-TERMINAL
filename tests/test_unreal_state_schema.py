import json
from pathlib import Path


SCHEMA_PATH = Path(__file__).parents[1] / "core" / "schemas" / "unreal_state.schema.json"


def test_unreal_canonical_state_schema_requires_deterministic_identity_and_observation():
    schema = json.loads(SCHEMA_PATH.read_text())

    assert schema["$id"].endswith("unreal_state.schema.json")
    required = set(schema["required"])
    assert {
        "execution_id",
        "adapter",
        "engine",
        "engine_version",
        "project",
        "timestamp",
        "operation",
        "state",
        "metrics",
        "artifact",
        "health_ok",
        "latency_ms",
        "readback_sha256",
    }.issubset(required)


def test_unreal_state_does_not_allow_adapter_to_claim_verified():
    schema = json.loads(SCHEMA_PATH.read_text())
    state_props = schema["properties"]["state"]["properties"]

    assert "verification_status" not in state_props
    assert "verified" not in state_props


def test_unreal_metrics_are_observations_not_truth_decisions():
    schema = json.loads(SCHEMA_PATH.read_text())
    metric_props = schema["properties"]["metrics"]["properties"]

    for field in (
        "resolution_width",
        "resolution_height",
        "frame_rate",
        "frame_time_ms",
        "draw_calls",
        "triangles",
        "gpu_memory_mb",
    ):
        assert field in metric_props
        assert metric_props[field]["type"] in {"integer", "number"}
