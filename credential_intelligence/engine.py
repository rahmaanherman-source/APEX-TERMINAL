"""Deterministic, secret-safe credential ingestion and attribution.

The engine intentionally stops before provider authentication. It can identify
likely credentials and associate them with provider/service/application
metadata, but only a later Gatekeeper-controlled probe may establish VERIFIED.
"""
from __future__ import annotations

import hashlib
import re
from dataclasses import dataclass, field
from enum import Enum
from typing import Iterable
from urllib.parse import urlparse


class TruthState(str, Enum):
    UNKNOWN = "UNKNOWN"
    UNVERIFIED = "UNVERIFIED"
    VERIFIED = "VERIFIED"
    FAILED = "FAILED"
    BLOCKED = "BLOCKED"


@dataclass(frozen=True)
class CredentialCandidate:
    candidate_id: str
    credential_type: str
    redacted_value: str
    fingerprint: str
    source_index: int
    context: str


@dataclass(frozen=True)
class Attribution:
    candidate_id: str
    provider: str | None
    service: str | None
    application: str | None
    environment: str | None
    confidence: float
    truth_state: TruthState = TruthState.UNVERIFIED
    reasons: tuple[str, ...] = field(default_factory=tuple)


class CredentialIntelligenceEngine:
    """Ingest and classify messy credential text without executing anything."""

    # Ordered from most specific to least specific to avoid generic matches
    # swallowing recognizable provider credentials.
    PATTERNS = (
        ("openai_api_key", re.compile(r"\bsk-(?:proj-)?[A-Za-z0-9_-]{16,}\b"), "openai"),
        ("github_token", re.compile(r"\b(?:ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9]{20,}\b"), "github"),
        ("slack_token", re.compile(r"\bxox[baprs]-[A-Za-z0-9-]{12,}\b"), "slack"),
        ("aws_access_key_id", re.compile(r"\bAKIA[0-9A-Z]{16}\b"), "aws"),
        ("jwt", re.compile(r"\beyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\b"), None),
    )

    PROVIDER_DOMAINS = {
        "openai.com": "openai",
        "api.openai.com": "openai",
        "github.com": "github",
        "api.github.com": "github",
        "slack.com": "slack",
        "api.slack.com": "slack",
        "stripe.com": "stripe",
        "api.stripe.com": "stripe",
        "shopify.com": "shopify",
        "myshopify.com": "shopify",
        "vercel.com": "vercel",
        "supabase.com": "supabase",
    }

    def ingest(self, text: str) -> tuple[list[CredentialCandidate], list[Attribution]]:
        candidates = self.extract_candidates(text)
        return candidates, [self.attribute(c, text) for c in candidates]

    def extract_candidates(self, text: str) -> list[CredentialCandidate]:
        found: list[tuple[int, str, str]] = []
        occupied: list[tuple[int, int]] = []
        for credential_type, pattern, _ in self.PATTERNS:
            for match in pattern.finditer(text):
                span = match.span()
                if any(span[0] < end and span[1] > start for start, end in occupied):
                    continue
                occupied.append(span)
                found.append((span[0], credential_type, match.group(0)))
        found.sort(key=lambda item: item[0])

        candidates: list[CredentialCandidate] = []
        for index, (position, credential_type, value) in enumerate(found, start=1):
            context = self._context(text, position)
            fingerprint = hashlib.sha256(value.encode("utf-8")).hexdigest()[:16]
            candidate_id = f"credential-{index:04d}"
            candidates.append(
                CredentialCandidate(
                    candidate_id=candidate_id,
                    credential_type=credential_type,
                    redacted_value=self._redact(value),
                    fingerprint=fingerprint,
                    source_index=position,
                    context=context,
                )
            )
        return candidates

    def attribute(self, candidate: CredentialCandidate, source_text: str) -> Attribution:
        provider = self._provider_for_type(candidate.credential_type)
        reasons: list[str] = []
        confidence = 0.0
        if provider:
            confidence = 0.82
            reasons.append(f"credential format matches {provider}")

        context_lower = candidate.context.lower()
        for domain, domain_provider in self.PROVIDER_DOMAINS.items():
            if domain in context_lower:
                if provider and provider != domain_provider:
                    reasons.append(f"context contains {domain}, conflicting with {provider}")
                    confidence = min(confidence, 0.45)
                else:
                    provider = domain_provider
                    confidence = min(0.97, confidence + 0.12)
                    reasons.append(f"nearby context contains {domain}")

        application = self._labeled_value(candidate.context, ("app", "application", "project", "service"))
        environment = self._environment(candidate.context)
        if application:
            confidence = min(0.99, confidence + 0.04)
            reasons.append("nearby context includes an application/project label")
        if environment:
            reasons.append(f"environment label detected: {environment}")

        if provider is None:
            confidence = 0.0
            reasons.append("no deterministic provider attribution found")

        return Attribution(
            candidate_id=candidate.candidate_id,
            provider=provider,
            service=provider,
            application=application,
            environment=environment,
            confidence=round(confidence, 2),
            reasons=tuple(reasons),
        )

    @staticmethod
    def _provider_for_type(credential_type: str) -> str | None:
        for name, _, provider in CredentialIntelligenceEngine.PATTERNS:
            if name == credential_type:
                return provider
        return None

    @staticmethod
    def _redact(value: str) -> str:
        if len(value) <= 10:
            return "[REDACTED]"
        return f"{value[:4]}…{value[-4:]}"

    @staticmethod
    def _context(text: str, position: int, radius: int = 180) -> str:
        start = max(0, position - radius)
        end = min(len(text), position + radius)
        return text[start:end].replace("\n", " ").strip()

    @staticmethod
    def _labeled_value(context: str, labels: Iterable[str]) -> str | None:
        joined = "|".join(map(re.escape, labels))
        match = re.search(rf"(?:{joined})\s*[:=\-]\s*([A-Za-z0-9][A-Za-z0-9 _./-]{{1,60}})", context, re.I)
        return match.group(1).strip() if match else None

    @staticmethod
    def _environment(context: str) -> str | None:
        match = re.search(r"\b(production|prod|staging|stage|development|dev|test|sandbox)\b", context, re.I)
        if not match:
            return None
        value = match.group(1).lower()
        return {"prod": "production", "stage": "staging", "dev": "development"}.get(value, value)

    @staticmethod
    def provider_from_url(url: str) -> str | None:
        try:
            hostname = (urlparse(url).hostname or "").lower()
        except ValueError:
            return None
        return CredentialIntelligenceEngine.PROVIDER_DOMAINS.get(hostname)
