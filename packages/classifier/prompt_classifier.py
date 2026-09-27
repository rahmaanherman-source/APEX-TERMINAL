"""Independent pre-generation media classifier.

This is a defense-in-depth gate, not the authorization authority. The capability
contract and routing policy remain mandatory even when this classifier returns SAFE.
"""

from dataclasses import dataclass


PHOTOREALISTIC_SIGNALS = frozenset({
    "photorealistic", "photo-realistic", "hyperrealistic", "hyper-realistic",
    "8k", "4k", "ultra hd", "ultra-hd", "high resolution", "high-res",
    "cinematic", "dslr", "shot on", "photograph", "realistic photo",
    "lifelike", "true to life", "ultra detailed", "hyper detailed",
})

MEDIA_VERBS = frozenset({
    "generate", "create", "render", "produce", "draw", "paint",
    "illustrate", "visualize", "depict", "show me",
})

MEDIA_NOUNS = frozenset({
    "image", "picture", "photo", "photograph", "portrait",
    "video", "animation", "clip", "footage", "scene",
    "artwork", "illustration", "rendering",
})


@dataclass(frozen=True)
class Classification:
    verdict: str
    reason: str | None
    detail: str | None = None

    @property
    def blocked(self) -> bool:
        return self.verdict == "BLOCKED"


def classify_prompt(prompt: str) -> Classification:
    normalized = prompt.casefold()

    detected_photo = sorted(s for s in PHOTOREALISTIC_SIGNALS if s in normalized)
    if detected_photo:
        return Classification(
            verdict="BLOCKED",
            reason="PHOTOREALISTIC_SIGNAL",
            detail=f"Detected: {detected_photo}",
        )

    has_media_verb = any(v in normalized for v in MEDIA_VERBS)
    has_media_noun = any(n in normalized for n in MEDIA_NOUNS)

    if has_media_verb and has_media_noun:
        return Classification(
            verdict="BLOCKED",
            reason="MEDIA_GENERATION_REQUEST",
            detail="Verb + media noun combination indicates media generation.",
        )

    return Classification(verdict="SAFE", reason=None)


def pre_generation_gate(prompt: str) -> Classification:
    """Run the independent classifier before generation is dispatched."""
    return classify_prompt(prompt)
