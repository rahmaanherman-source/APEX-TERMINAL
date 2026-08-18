"""APEX adapter lifecycle and execution orchestration."""
from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Callable, Mapping
import uuid

from core.protocol import CanonicalState, ConnectionState, validate_canonical_state
from core.verification import VerificationResult, verify_canonical_state


@dataclass
class AdapterRecord:
    id: str
    name: str
    execute: Callable[[Mapping[str, Any], str], Mapping[str, Any]]
    state: ConnectionState = ConnectionState.DISCOVERED
    last_audit: float | None = None


class AdapterManager:
    """Routes commands through adapters and the independent verification gate."""

    def __init__(self) -> None:
        self._adapters: dict[str, AdapterRecord] = {}

    def register(self, adapter: AdapterRecord) -> None:
        if not adapter.id or not adapter.name:
            raise ValueError("adapter id and name are required")
        self._adapters[adapter.id] = adapter

    def get_status(self, adapter_id: str) -> ConnectionState:
        record = self._adapters.get(adapter_id)
        return record.state if record else ConnectionState.UNVERIFIED

    def execute(
        self,
        adapter_id: str,
        command: Mapping[str, Any],
        desired_state: Mapping[str, Any],
    ) -> VerificationResult:
        record = self._adapters.get(adapter_id)
        execution_id = str(uuid.uuid4())
        if record is None:
            return VerificationResult(execution_id, ConnectionState.UNVERIFIED.value, None, float(desired_state.get("epsilon", 0.0)), {"reason": "ADAPTER_NOT_FOUND"})
        try:
            raw = record.execute(command, execution_id)
            canonical = validate_canonical_state(raw)
            if canonical.execution_id != execution_id:
                record.state = ConnectionState.FAILED
                return VerificationResult(execution_id, ConnectionState.FAILED.value, None, float(desired_state.get("epsilon", 0.0)), {"reason": "EXECUTION_ID_MISMATCH"})
            result = verify_canonical_state(desired_state, raw, execution_id)
        except PermissionError as exc:
            record.state = ConnectionState.BLOCKED
            return VerificationResult(execution_id, ConnectionState.BLOCKED.value, None, float(desired_state.get("epsilon", 0.0)), {"reason": "AUTHORIZATION_REQUIRED", "detail": str(exc)})
        except (ValueError, TypeError) as exc:
            record.state = ConnectionState.FAILED
            return VerificationResult(execution_id, ConnectionState.FAILED.value, None, float(desired_state.get("epsilon", 0.0)), {"reason": "MALFORMED_EVIDENCE", "detail": str(exc)})
        except Exception as exc:  # adapter boundary: unexpected tool failure is not success
            record.state = ConnectionState.FAILED
            return VerificationResult(execution_id, ConnectionState.FAILED.value, None, float(desired_state.get("epsilon", 0.0)), {"reason": "ADAPTER_EXECUTION_FAILED", "detail": str(exc)})

        record.state = ConnectionState.VERIFIED if result.status == "VERIFIED" else ConnectionState.FAILED
        return result

    def audit(self, adapter_id: str, desired_state: Mapping[str, Any]) -> VerificationResult:
        return self.execute(adapter_id, {"action": "SYSTEM_STATUS"}, desired_state)
