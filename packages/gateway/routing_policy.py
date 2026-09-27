"""APEX routing policy: every tool dispatch is deny-by-default.

This module deliberately contains no model/provider selection logic. The caller
supplies the resolved target tool; the policy only authorizes or blocks it.
"""

from dataclasses import dataclass
from typing import Any, Callable, Mapping


FORBIDDEN_TOOL_CLASSES = frozenset({
    "image_generation",
    "video_generation",
    "audio_generation",
    "image_editing",
    "video_editing",
    "media_upscaling",
    "media_enhancement",
})


@dataclass(frozen=True)
class TargetTool:
    id: str
    name: str
    class_name: str


@dataclass(frozen=True)
class Decision:
    action: str
    reason: str | None = None
    message: str | None = None
    tool: TargetTool | None = None

    @property
    def blocked(self) -> bool:
        return self.action == "BLOCK"


def _allowed_names(contract: Mapping[str, Any]) -> set[str]:
    allowed = contract.get("capabilities", {}).get("allowed", [])
    return {item["name"] for item in allowed}


def route_request(
    request: Any,
    capability_contract: Mapping[str, Any],
    target_tool: TargetTool,
    audit: Callable[[str, dict[str, Any]], None] | None = None,
) -> Decision:
    """Authorize one already-resolved target tool. Never bypass the contract."""
    emit = audit or (lambda _event, _payload: None)
    allowed = _allowed_names(capability_contract)
    forbidden = set(
        capability_contract.get("capabilities", {}).get("forbidden", [])
    )

    if target_tool.class_name in FORBIDDEN_TOOL_CLASSES or target_tool.name in forbidden:
        emit("ROUTING_BLOCKED", {
            "reason": "FORBIDDEN_TOOL_CLASS",
            "tool": target_tool.id,
            "class": target_tool.class_name,
            "request_id": getattr(request, "id", None),
        })
        return Decision(
            action="BLOCK",
            reason="FORBIDDEN_TOOL_CLASS",
            message="This system does not generate images, videos, or media.",
        )

    if target_tool.name not in allowed:
        emit("ROUTING_BLOCKED", {
            "reason": "TOOL_NOT_IN_CONTRACT",
            "tool": target_tool.id,
            "request_id": getattr(request, "id", None),
        })
        return Decision(
            action="BLOCK",
            reason="TOOL_NOT_IN_CONTRACT",
            message="Requested capability is not authorized.",
        )

    return Decision(action="ALLOW", tool=target_tool)
