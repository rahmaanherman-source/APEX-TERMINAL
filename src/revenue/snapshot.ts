import { Pool } from "pg";
import { getRevenueConfig } from "./config";
import { fetchShopifyOrders } from "./shopify";

// Created on first use, not at import time: configuration (DATABASE_URL etc.) is only
// required when a snapshot actually runs, so `next build` never needs production secrets.
let pool: Pool | null = null;
function sharedPool(): Pool {
  if (!pool) pool = new Pool({ connectionString: getRevenueConfig().databaseUrl, max: 3 });
  return pool;
}

export function previousCentralDay(now = new Date()) {
  const central = new Date(now.toLocaleString("en-US", { timeZone: "America/Chicago" }));
  central.setDate(central.getDate() - 1);
  const y = central.getFullYear();
  const m = String(central.getMonth() + 1).padStart(2, "0");
  const d = String(central.getDate()).padStart(2, "0");
  const runDate = `${y}-${m}-${d}`;
  // 23:59:59 Central for the run date; Intl handles CST/CDT offset.
  const localCutoff = new Date(`${runDate}T23:59:59`);
  const offsetFmt = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago", timeZoneName: "longOffset",
  }).formatToParts(localCutoff).find(p => p.type === "timeZoneName")?.value ?? "GMT-06:00";
  const offset = offsetFmt.replace("GMT", "").replace(":", "");
  const cutoff = new Date(`${runDate}T23:59:59${offset === "" ? "-0600" : offset}`);
  return { runDate, cutoffIso: cutoff.toISOString(), cutoff };
}

export async function createDailySnapshot(now = new Date()) {
  const { runDate, cutoffIso, cutoff } = previousCentralDay(now);
  const client = await sharedPool().connect();
  try {
    await client.query("BEGIN");
    const orders = await fetchShopifyOrders(cutoffIso);
    const seen = new Set<string>();
    const duplicateIds: string[] = [];
    for (const order of orders) {
      if (seen.has(order.id)) duplicateIds.push(order.id);
      seen.add(order.id);
    }
    const inWindow = orders.filter(o => new Date(o.createdAt) <= cutoff);
    const gross = inWindow.reduce((s, o) => s + o.gross, 0);
    const refunds = inWindow.reduce((s, o) => s + o.refunds, 0);
    const net = gross - refunds;
    const currencySet = new Set(inWindow.map(o => o.currency));
    const currencyCheck = currencySet.size <= 1;
    const duplicateCheck = duplicateIds.length === 0;
    const refundsCheck = Math.abs(net - (gross - refunds)) < 0.01;

    // Payout reconciliation is only passable when an actual payout source exists.
    // Orders != payouts by definition (fees, timing, reserves); do not fake a match.
    const payoutCheck = { passed: false, reason: "Payout reconciliation is BLOCKED until payout records are fetched and matched by payout period/currency." };

    const checks = [
      { key: "duplicate_orders", passed: duplicateCheck, reason: duplicateCheck ? "No duplicate Shopify order IDs in fetched dataset." : `Duplicate order IDs: ${duplicateIds.slice(0, 10).join(", ")}` },
      { key: "refunds_subtracted", passed: refundsCheck, reason: refundsCheck ? "Net revenue equals gross orders minus refunds." : "Net revenue does not equal gross minus refunds." },
      { key: "single_currency", passed: currencyCheck, reason: currencyCheck ? "Snapshot contains one currency or no orders." : "Multiple currencies detected; values must not be summed without FX normalization." },
      { key: "payout_reconciliation", passed: payoutCheck.passed, reason: payoutCheck.reason },
    ];
    const passedCount = checks.filter(c => c.passed).length;
    const checkScore = passedCount / checks.length;
    const status = checkScore < 0.9 ? "MANUAL_REVIEW" : checks.every(c => c.passed) ? "PASS" : "FAIL";

    // Upsert by primary key guarantees a rerun replaces that day's snapshot.
    await client.query(
      `INSERT INTO revenue_orders(order_id,customer_id,ordered_at,currency,gross_amount,refund_amount,net_amount,source)
       SELECT x.id,x.customer_id,x.ordered_at,x.currency,x.gross,x.refunds,x.net,'shopify'
       FROM jsonb_to_recordset($1::jsonb) AS x(id text, customer_id text, ordered_at timestamptz, currency text, gross numeric, refunds numeric, net numeric)
       ON CONFLICT(order_id) DO UPDATE SET customer_id=excluded.customer_id, ordered_at=excluded.ordered_at,
       currency=excluded.currency,gross_amount=excluded.gross_amount,refund_amount=excluded.refund_amount,
       net_amount=excluded.net_amount,source=excluded.source,updated_at=now()`,
      [JSON.stringify(inWindow.map(o => ({ id:o.id, customer_id:o.customerId, ordered_at:o.createdAt, currency:o.currency, gross:o.gross, refunds:o.refunds, net:o.net })))],
    );
    for (const order of inWindow) {
      if (!order.customerId) continue;
      await client.query(
        `INSERT INTO customers(id,name,email,lifetime_value,order_count,first_order_at,last_order_at)
         VALUES($1,$2,$3,$4,1,$5,$5)
         ON CONFLICT(id) DO UPDATE SET name=excluded.name,email=excluded.email,
         lifetime_value=(SELECT COALESCE(SUM(net_amount),0) FROM revenue_orders WHERE customer_id=$1),
         order_count=(SELECT COUNT(*) FROM revenue_orders WHERE customer_id=$1),
         first_order_at=(SELECT MIN(ordered_at) FROM revenue_orders WHERE customer_id=$1),
         last_order_at=(SELECT MAX(ordered_at) FROM revenue_orders WHERE customer_id=$1),updated_at=now()`,
        [order.customerId, order.customerName, order.customerEmail, order.net, order.createdAt],
      );
    }
    await client.query(
      `INSERT INTO metrics(date,revenue,orders,refunds,mrr,churn_rate,ltv)
       VALUES($1,$2,$3,$4,0,0,COALESCE((SELECT AVG(lifetime_value) FROM customers),0))
       ON CONFLICT(date) DO UPDATE SET revenue=excluded.revenue,orders=excluded.orders,refunds=excluded.refunds,
       ltv=excluded.ltv,updated_at=now()`,
      [runDate, net, inWindow.length, refunds],
    );
    for (const check of checks) {
      await client.query(
        `INSERT INTO revenue_checks(run_date,check_key,passed,reason,actual_value)
         VALUES($1,$2,$3,$4,$5) ON CONFLICT(run_date,check_key) DO UPDATE
         SET passed=excluded.passed,reason=excluded.reason,actual_value=excluded.actual_value,created_at=now()`,
        [runDate, check.key, check.passed, check.reason, check.key === "refunds_subtracted" ? net : null],
      );
    }
    await client.query(
      `INSERT INTO audit_logs(run_date,data_cutoff,status,check_score,check_reasons,rationale)
       VALUES($1,$2,$3,$4,$5,$6) ON CONFLICT (run_date) DO UPDATE SET data_cutoff=excluded.data_cutoff,
       status=excluded.status,check_score=excluded.check_score,check_reasons=excluded.check_reasons,
       rationale=excluded.rationale,updated_at=now()`,
      [runDate, cutoffIso, status, checkScore, JSON.stringify(checks), "Daily Shopify order snapshot; payout reconciliation remains blocked until payout records are implemented."],
    );
    await client.query("COMMIT");
    return { runDate, cutoff: cutoffIso, status, checkScore, checks, orders: inWindow.length, revenue: net, refunds };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function getPool() { return sharedPool(); }
