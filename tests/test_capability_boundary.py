import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from packages.classifier.prompt_classifier import classify_prompt
from packages.gateway.routing_policy import TargetTool, route_request


CONTRACT = {
    "capabilities": {
        "allowed": [
            {"name": "generate_text", "tool": "llm.completion"},
            {"name": "generate_code", "tool": "codegen.write"},
            {"name": "generate_diagram", "tool": "mermaid.render"},
            {"name": "generate_ascii", "tool": "ascii.art"},
            {"name": "read_file", "tool": "fs.read"},
            {"name": "search_web", "tool": "search.query"},
        ],
        "forbidden": [
            "generate_image", "generate_video", "generate_audio",
            "render.photorealistic", "image.edit", "video.edit",
            "media.upscale", "media.enhance",
        ],
    },
    "enforcement": {"default_action": "DENY", "on_violation": "BLOCK_AND_AUDIT"},
}


def test_image_generation_blocked_by_classifier():
    result = classify_prompt("Generate a photorealistic image of a sunset")
    assert result.blocked
    assert result.reason == "PHOTOREALISTIC_SIGNAL"


def test_video_generation_blocked_by_classifier():
    result = classify_prompt("Create a video of a cat playing piano")
    assert result.blocked
    assert result.reason == "MEDIA_GENERATION_REQUEST"


def test_tool_not_in_contract_blocked():
    result = route_request(
        object(),
        CONTRACT,
        TargetTool("image.generate", "generate_image", "image_generation"),
    )
    assert result.blocked
    assert result.reason == "FORBIDDEN_TOOL_CLASS"


def test_forbidden_name_blocked_even_if_class_is_misclassified():
    result = route_request(
        object(),
        CONTRACT,
        TargetTool("image.generate", "generate_image", "text_generation"),
    )
    assert result.blocked
    assert result.reason == "FORBIDDEN_TOOL_CLASS"


def test_undeclared_tool_is_blocked():
    result = route_request(
        object(),
        CONTRACT,
        TargetTool("secret.tool", "secret_capability", "text_generation"),
    )
    assert result.blocked
    assert result.reason == "TOOL_NOT_IN_CONTRACT"


def test_code_generation_allowed():
    result = route_request(
        object(),
        CONTRACT,
        TargetTool("codegen.write", "generate_code", "code_generation"),
    )
    assert not result.blocked
    assert result.action == "ALLOW"


def test_text_request_is_safe_for_classifier():
    result = classify_prompt("Write a Python function to sort a list")
    assert result.verdict == "SAFE"
