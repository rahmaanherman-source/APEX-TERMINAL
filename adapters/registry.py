"""Provider-neutral integration registry.

Registry entries describe how a provider may be reached. Runtime state is
always discovered/audited separately; declarations never imply connection.
"""
from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any
import json
from pathlib import Path


@dataclass(frozen=True)
class ProviderManifest:
    id: str
    modes: tuple[str, ...]
    capabilities: tuple[str, ...] = ()
    metadata: dict[str, Any] = field(default_factory=dict)


class ProviderRegistry:
    def __init__(self) -> None:
        self._providers: dict[str, ProviderManifest] = {}

    def register(self, manifest: ProviderManifest) -> None:
        self._providers[manifest.id] = manifest

    def get(self, provider_id: str) -> ProviderManifest | None:
        return self._providers.get(provider_id)

    def ids(self) -> tuple[str, ...]:
        return tuple(sorted(self._providers))

    def snapshot(self) -> list[dict[str, Any]]:
        return [
            {"id": p.id, "modes": list(p.modes), "capabilities": list(p.capabilities), "metadata": p.metadata}
            for p in self._providers.values()
        ]


def load_registry(path: str | Path) -> ProviderRegistry:
    raw = json.loads(Path(path).read_text(encoding="utf-8"))
    registry = ProviderRegistry()
    for provider in raw.get("providers", []):
        registry.register(ProviderManifest(
            id=provider["id"],
            modes=tuple(provider.get("modes", [])),
            capabilities=tuple(provider.get("capabilities", [])),
            metadata={k: v for k, v in provider.items() if k not in {"id", "modes", "capabilities"}},
        ))
    return registry
