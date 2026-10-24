import { NextResponse } from "next/server";
// Always run per request: reads live config and data, never baked in at build time.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  // Customer PII must never be served before the existing Viewer/Admin auth is verified.
  return NextResponse.json({
    status: "BLOCKED",
    error: "AUTH_ADAPTER_REQUIRED: customer data is not exposed until existing Apex Hub session/role checks are connected.",
  }, { status: 503 });
}
