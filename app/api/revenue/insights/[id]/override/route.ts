import { NextRequest, NextResponse } from "next/server";

export async function POST(_request: NextRequest, context: { params: { id: string } }) {
  // Deliberately fail closed: this endpoint must use the existing authenticated
  // Apex Hub Admin identity and persist actor + reason before overrides are enabled.
  return NextResponse.json({
    status:"BLOCKED",
    insightId:context.params.id,
    error:"ADMIN_AUTH_AND_AUDIT_ADAPTER_REQUIRED: override was not saved.",
  },{status:503});
}
