import { NextResponse } from "next/server";
import { Pool } from "pg";

// The current repository has no discoverable canonical web-session/role adapter.
// Fail closed rather than expose customer PII or pretend a user is an admin.
export async function GET() {
  if (!process.env.APEX_AUTH_ADAPTER_READY) {
    return NextResponse.json({
      configured: false,
      status: "BLOCKED",
      error: "AUTH_ADAPTER_REQUIRED: connect this route to Apex Hub's existing session and role provider before enabling Revenue data.",
    }, { status: 503 });
  }
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ configured:false, status:"BLOCKED", error:"DATABASE_CONFIGURATION_REQUIRED" },{status:503});
  }
  // Auth adapter integration is a hard gate: env presence alone is not user authentication.
  return NextResponse.json({
    configured:false,
    status:"BLOCKED",
    error:"AUTH_ADAPTER_CONTRACT_PENDING: no verified existing session/role implementation was found in the repository.",
  }, { status:503 });
}
