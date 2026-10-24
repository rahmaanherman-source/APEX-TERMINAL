import { NextResponse } from "next/server";
// Always run per request: reads live config and data, never baked in at build time.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  // Fail closed until the existing Apex Hub auth adapter can prove the caller is Admin.
  return NextResponse.json({
    status: "BLOCKED",
    error: "ADMIN_AUTH_REQUIRED: manual sync is disabled until the existing Apex Hub role adapter is wired and tested.",
  }, { status: 503 });
}
