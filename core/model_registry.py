"""Evidence-backed local model/runtime discovery."""
from __future__ import annotations

from dataclasses import dataclass, asdict
import shutil
import subprocess
from typing import Any


@dataclass(frozen=True)
class RuntimeObservation:
    provider: str
    executable: str
    status: str
    version: str | None = None
    detail: str | None = None


@dataclass(frozen=True)
class ModelObservation:
    name: str
    provider: str
    status: str
    capabilities: tuple[str, ...] = ()
    latency_ms: float | None = None


def _probe(executable: str, args: list[str], provider: str) -> RuntimeObservation:
    path = shutil.which(executable)
    if not path:
        return RuntimeObservation(provider, executable, "OFFLINE", detail="EXECUTABLE_NOT_FOUND")
    try:
        result = subprocess.run([path, *args], capture_output=True, text=True, timeout=3, check=False)
        output = (result.stdout or result.stderr).strip().splitlines()
        version = output[0] if output else None
        status = "READY" if result.returncode == 0 else "UNVERIFIED"
        return RuntimeObservation(provider, path, status, version=version)
    except (OSError, subprocess.SubprocessError) as exc:
        return RuntimeObservation(provider, path, "UNVERIFIED", detail=str(exc))


def discover_runtimes() -> list[RuntimeObservation]:
    return [
        _probe("ollama", ["--version"], "Ollama"),
        _probe("lmstudio", ["--version"], "LMStudio"),
        _probe("vllm", ["--version"], "vLLM"),
    ]


def discover_models(runtime: RuntimeObservation) -> list[ModelObservation]:
    if runtime.status != "READY":
        return []
    if runtime.provider == "Ollama":
        try:
            path = shutil.which(runtime.executable) or "ollama"
            result = subprocess.run([path, "list"], capture_output=True, text=True, timeout=5, check=False)
            if result.returncode != 0:
                return []
            rows = [line.split() for line in result.stdout.splitlines()[1:] if line.strip()]
            return [ModelObservation(row[0], "Ollama", "DISCOVERED") for row in rows if row]
        except (OSError, subprocess.SubprocessError):
            return []
    return []


def registry_snapshot() -> dict[str, Any]:
    runtimes = discover_runtimes()
    models = [model for runtime in runtimes for model in discover_models(runtime)]
    return {
        "runtimes": [asdict(item) for item in runtimes],
        "models": [asdict(item) for item in models],
    }
