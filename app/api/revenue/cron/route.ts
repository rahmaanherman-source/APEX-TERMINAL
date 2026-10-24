import { NextRequest, NextResponse } from "next/server";
import { createDailySnapshot } from "../../../../src/revenue/snapshot";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const secret = process.env.APEX_REVENUE_CRON_SECRET;
  if (!secret) return NextResponse.json({ status:"BLOCKED", error:"CRON_SECRET_NOT_CONFIGURED" },{status:503});
  const authorization = request.headers.get("authorization") || "";
  if (authorization !== `Bearer ${secret}`) return NextResponse.json({ status:"REJECTED", error:"INVALID_CRON_AUTHORIZATION" },{status:401});
  try {
    const result = await createDailySnapshot(new Date());
    return NextResponse.json({ ...result, status:result.status, execution:"COMPLETED" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "UNKNOWN_SNAPSHOT_FAILURE";
    return NextResponse.json({ status:"FAILED", error:message },{status:500});
  }
}
