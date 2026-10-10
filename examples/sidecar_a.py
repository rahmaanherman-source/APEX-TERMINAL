"""Minimal APEX sidecar used for lifecycle integration tests and local smoke runs.

It passes the APEX Gate 1 guardrail on purpose: no `os`, no `subprocess`,
no dynamic execution. The port comes from the command line.
"""
from __future__ import annotations

import argparse

from fastapi import FastAPI
from pydantic import BaseModel
import uvicorn

app = FastAPI(title="APEX Sidecar A")


class ProcessRequest(BaseModel):
    input: str = "no input"


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/process")
async def process(payload: ProcessRequest) -> dict[str, str]:
    return {"result": f"Processed: {payload.input}"}


def parse_port(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="APEX Sidecar A")
    parser.add_argument("--port", type=int, default=8001)
    return parser.parse_args(argv).port


if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=parse_port(), log_level="warning")
