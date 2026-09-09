"""Tests for messy credential ingestion and attribution."""
from credential_intelligence import CredentialIntelligenceEngine, TruthState


def test_ingests_adjacent_mixed_credentials_without_requiring_labels():
    text = "OpenAI production key sk-proj-ABCDEFGHIJKLMNOP1234 next github ghp_abcdefghijklmnopqrstuvwxyz1234567890"
    candidates, attributions = CredentialIntelligenceEngine().ingest(text)
    assert len(candidates) == 2
    assert {c.credential_type for c in candidates} == {"openai_api_key", "github_token"}
    assert {a.provider for a in attributions} == {"openai", "github"}
    assert all(a.truth_state == TruthState.UNVERIFIED for a in attributions)


def test_context_can_reconcile_provider_from_nearby_url():
    text = "Gabby production https://api.openai.com/v1 key sk-ABCDEFGHIJKLMNOP1234567890"
    candidates, attributions = CredentialIntelligenceEngine().ingest(text)
    assert len(candidates) == 1
    assert attributions[0].provider == "openai"
    assert attributions[0].environment == "production"
    assert attributions[0].confidence >= 0.8


def test_unknown_credential_does_not_get_false_provider_attribution():
    text = "mystery credential abcdefghijklmnopqrstuvwxyz1234567890"
    candidates, attributions = CredentialIntelligenceEngine().ingest(text)
    assert candidates == []
    assert attributions == []


def test_fingerprint_is_secret_safe_and_stable():
    engine = CredentialIntelligenceEngine()
    text = "sk-ABCDEFGHIJKLMNOP1234567890"
    first = engine.extract_candidates(text)[0]
    second = engine.extract_candidates(text)[0]
    assert first.fingerprint == second.fingerprint
    assert "ABCDEFGHIJKLMNOP" not in first.fingerprint
    assert first.redacted_value != "sk-ABCDEFGHIJKLMNOP1234567890"
