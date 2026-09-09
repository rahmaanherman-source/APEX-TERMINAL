"""APEX Guardrail Gate 1 compatibility entrypoint."""
from __future__ import annotations

import ast
import re
from pathlib import Path
from typing import Tuple

from guardrails.security_filter import SecurityFilter


class Guardrail:
    """Composes sanitization, secret detection, and syntax validation."""

    secret_patterns = (
        re.compile(r"\bsk-[A-Za-z0-9]{20,}\b"),
        re.compile(r"\bAKIA[0-9A-Z]{16}\b"),
        re.compile(r"\bgh[pousr]_[A-Za-z0-9_]{20,}\b"),
        re.compile(r"\bxox[baprs]-[A-Za-z0-9-]{20,}\b"),
        re.compile(r"(?i)\b(password|api[_-]?key|secret)\s*=\s*['\"][^'\"]+['\"]"),
    )

    def __init__(self) -> None:
        self.security_filter = SecurityFilter()

    def scan_secrets(self, code: str) -> Tuple[bool, str]:
        for pattern in self.secret_patterns:
            if pattern.search(code):
                return False, f"potential_secret:{pattern.pattern}"
        return True, "no secrets detected"

    def validate_syntax(self, code: str) -> Tuple[bool, str]:
        try:
            ast.parse(code)
            return True, "syntax valid"
        except SyntaxError as exc:
            return False, f"syntax_error:line={exc.lineno}: {exc.msg}"

    def run_all_checks(self, code: str, file_path: str = "") -> Tuple[bool, str]:
        checks = [
            ("security", self.security_filter.scan_text(code)),
            ("secrets", self.scan_secrets(code)),
            ("syntax", self.validate_syntax(code)),
        ]
        if file_path:
            path = Path(file_path)
            if path.exists() and path.stat().st_size > self.security_filter.max_file_size:
                return False, f"file_size_exceeded:{path.stat().st_size}"
        messages = []
        for name, result in checks:
            if hasattr(result, "allowed"):
                ok = result.allowed
                message = ";".join(result.findings) if result.findings else result.status
            else:
                ok, message = result
            messages.append(f"{name}={message}")
            if not ok:
                return False, "guardrail_blocked:" + " | ".join(messages)
        return True, " | ".join(messages)


if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("file")
    args = parser.parse_args()
    code = Path(args.file).read_text(encoding="utf-8")
    ok, message = Guardrail().run_all_checks(code, args.file)
    print(message)
    raise SystemExit(0 if ok else 1)
