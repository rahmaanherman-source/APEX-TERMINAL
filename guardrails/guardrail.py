"""APEX Guardrail — initial Python syntax validation gate.

Canonical source captured from the APEX Guardrail System design supplied by MAC.
This gate checks Python syntax only; it is not a complete security, dependency,
correctness, or production-readiness check.
"""

import ast


def validate_code(code_string):
    try:
        ast.parse(code_string)
        return True, "System Stable: Code is clean."
    except SyntaxError as e:
        return False, f"System Alert: Short circuit detected at {e.lineno}"


if __name__ == "__main__":
    import argparse
    from pathlib import Path

    parser = argparse.ArgumentParser(description="Validate Python syntax before entry into an APEX system.")
    parser.add_argument("file", help="Python file to validate")
    args = parser.parse_args()

    source = Path(args.file).read_text(encoding="utf-8")
    ok, message = validate_code(source)
    print(message)
    raise SystemExit(0 if ok else 1)
