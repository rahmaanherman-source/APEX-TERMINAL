import { NextResponse } from "next/server";
export async function POST() {
  // Fail closed until the existing Apex Hub auth adapter can prove the caller is Admin.
  return NextResponse.json({
    status: "BLOCKED",
    error: "ADMIN_AUTH_REQUIRED: manual sync is disabled until the existing Apex Hub role adapter is wired and tested.",
  }, { status: 503 });
}
