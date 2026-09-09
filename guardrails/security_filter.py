"""APEX Sanitization Chamber.

Gate 1 is a pre-execution policy boundary. Regex is supplemental; AST
inspection catches dangerous calls/imports that text matching can miss.
Submitted source is never executed by this module.
"""
from __future__ import annotations

import ast
import re
from dataclasses import dataclass, field
from pathlib import Path
from typing import List


@dataclass(frozen=True)
class ScanResult:
    allowed: bool
    status: str
    findings: List[str] = field(default_factory=list)


class SecurityFilter:
    """Deterministic pre-execution source policy gate."""

    max_file_size = 10 * 1024 * 1024
    forbidden_text_patterns = (
        re.compile(r"\brm\s+-rf\b", re.IGNORECASE),
    )
    forbidden_calls = {"eval", "exec", "compile", "__import__"}
    forbidden_attributes = {
        ("os", "system"), ("os", "popen"),
        ("subprocess", "run"), ("subprocess", "Popen"),
        ("subprocess", "call"), ("subprocess", "check_call"),
        ("subprocess", "check_output"),
    }
    banned_imports = {"os", "subprocess", "pickle", "ctypes", "platform"}
    secret_patterns = (
        re.compile(r"\bsk-[A-Za-z0-9]{20,}\b"),
        re.compile(r"\bAKIA[0-9A-Z]{16}\b"),
        re.compile(r"\bgh[pousr]_[A-Za-z0-9_]{20,}\b"),
        re.compile(r"\bxox[baprs]-[A-Za-z0-9-]{20,}\b"),
    )

    def scan_text(self, raw_code: str) -> ScanResult:
        findings: list[str] = []
        for pattern in self.forbidden_text_patterns:
            if pattern.search(raw_code):
                findings.append(f"forbidden_text:{pattern.pattern}")
        for pattern in self.secret_patterns:
            if pattern.search(raw_code):
                findings.append("potential_secret_detected")
        try:
            tree = ast.parse(raw_code)
        except SyntaxError as exc:
            return ScanResult(False, "FAILED", [f"syntax_error:{exc.msg}:{exc.lineno}"])

        for node in ast.walk(tree):
            if isinstance(node, ast.Call):
                if isinstance(node.func, ast.Name) and node.func.id in self.forbidden_calls:
                    findings.append(f"forbidden_call:{node.func.id}")
                if isinstance(node.func, ast.Attribute) and isinstance(node.func.value, ast.Name):
                    pair = (node.func.value.id, node.func.attr)
                    if pair in self.forbidden_attributes:
                        findings.append(f"forbidden_call:{pair[0]}.{pair[1]}")
            elif isinstance(node, ast.Import):
                for alias in node.names:
                    if alias.name.split(".")[0] in self.banned_imports:
                        findings.append(f"forbidden_import:{alias.name}")
            elif isinstance(node, ast.ImportFrom):
                root = (node.module or "").split(".")[0]
                if root in self.banned_imports:
                    findings.append(f"forbidden_import:{node.module}")

        return ScanResult(not findings, "PASS" if not findings else "BLOCKED", sorted(set(findings)))

    def scan_file(self, path: Path) -> ScanResult:
        try:
            if path.stat().st_size > self.max_file_size:
                return ScanResult(False, "BLOCKED", [f"file_size_exceeded:{path.stat().st_size}"])
            return self.scan_text(path.read_text(encoding="utf-8"))
        except OSError as exc:
            return ScanResult(False, "FAILED", [f"read_error:{exc}"])
