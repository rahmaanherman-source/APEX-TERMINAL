"""Minimal APEX sidecar used for lifecycle integration tests and local smoke runs."""
from __future__ import annotations

import os

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


if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=int(os.getenv("PORT", "8001")), log_level="warning")
