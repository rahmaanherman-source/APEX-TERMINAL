from core.model_registry import ModelObservation, RuntimeObservation, discover_models


def test_unavailable_runtime_never_claims_models():
    runtime = RuntimeObservation("Ollama", "ollama", "OFFLINE", detail="EXECUTABLE_NOT_FOUND")
    assert discover_models(runtime) == []


def test_model_observation_defaults_to_unverified_capability():
    model = ModelObservation("example", "Ollama", "DISCOVERED")
    assert model.capabilities == ()
    assert model.latency_ms is None
