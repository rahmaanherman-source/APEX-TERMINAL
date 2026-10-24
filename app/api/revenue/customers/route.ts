import { NextResponse } from "next/server";
export async function GET() {
  // Customer PII must never be served before the existing Viewer/Admin auth is verified.
  return NextResponse.json({
    status: "BLOCKED",
    error: "AUTH_ADAPTER_REQUIRED: customer data is not exposed until existing Apex Hub session/role checks are connected.",
  }, { status: 503 });
}
