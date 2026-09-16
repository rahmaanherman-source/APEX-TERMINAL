from __future__ import annotations

import json
import os
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse

from catalog_mapper import build_package, read_delimited

ROOT = Path(__file__).resolve().parent
WEB = ROOT / "web"
SCHEMA_FILE = ROOT / "schemas" / "destinations.json"


def load_destinations() -> list[dict[str, object]]:
    return json.loads(SCHEMA_FILE.read_text(encoding="utf-8"))["destinations"]


def find_destination(destination_id: str) -> dict[str, object] | None:
    return next((d for d in load_destinations() if d["id"] == destination_id), None)


class Handler(BaseHTTPRequestHandler):
    server_version = "UniversalCatalogMapper/0.1"

    def _send(self, status: int, body: bytes, content_type: str) -> None:
        self.send_response(status)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self) -> None:
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Access-Control-Allow-Methods", "GET,POST,OPTIONS")
        self.end_headers()

    def do_GET(self) -> None:
        path = urlparse(self.path).path
        if path == "/":
            self._send(200, (WEB / "index.html").read_bytes(), "text/html; charset=utf-8")
            return
        if path == "/app.js":
            self._send(200, (WEB / "app.js").read_bytes(), "text/javascript; charset=utf-8")
            return
        if path == "/styles.css":
            self._send(200, (WEB / "styles.css").read_bytes(), "text/css; charset=utf-8")
            return
        if path == "/api/destinations":
            payload = [{k: d[k] for k in ("id", "label", "format", "template_required") if k in d} for d in load_destinations()]
            self._send(200, json.dumps(payload).encode(), "application/json")
            return
        self._send(404, b"Not found", "text/plain; charset=utf-8")

    def do_POST(self) -> None:
        path = urlparse(self.path).path
        if path != "/api/map":
            self._send(404, b"Not found", "text/plain; charset=utf-8")
            return
        try:
            length = int(self.headers.get("Content-Length", "0"))
            if length > 50_000_000:
                raise ValueError("request too large")
            payload = json.loads(self.rfile.read(length))
            source_csv = str(payload.get("source_csv", ""))
            destination_id = str(payload.get("destination_id", ""))
            destination = find_destination(destination_id)
            if not destination:
                raise ValueError("unknown destination")
            if destination.get("template_required") and payload.get("destination_template_csv"):
                template_rows = read_delimited(str(payload["destination_template_csv"]))
                headers = list(template_rows[0].keys()) if template_rows else []
                destination = {**destination, "headers": headers, "required": []}
            rows = read_delimited(source_csv)
            result = build_package(rows, destination)
            response = {k: v for k, v in result.items() if k != "parts"}
            response["parts_count"] = len(result.get("parts", []))
            response["downloads"] = result.get("parts", []) if len(result.get("parts", [])) <= 10 else []
            self._send(200, json.dumps(response).encode(), "application/json")
        except Exception as exc:
            self._send(400, json.dumps({"state": "FAILED", "error": str(exc)}).encode(), "application/json")


def run(host: str = "127.0.0.1", port: int = 8787) -> None:
    ThreadingHTTPServer((host, port), Handler).serve_forever()


if __name__ == "__main__":
    run(os.getenv("HOST", "127.0.0.1"), int(os.getenv("PORT", "8787")))
