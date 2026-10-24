-- APEX Hub Revenue: append-only audit evidence + replaceable daily snapshots.
-- Apply through the existing Postgres migration runner. No credentials belong here.
CREATE TABLE IF NOT EXISTS metrics (
  date date PRIMARY KEY,
  mrr numeric(14,2) NOT NULL DEFAULT 0,
  churn_rate numeric(8,5) NOT NULL DEFAULT 0,
  ltv numeric(14,2) NOT NULL DEFAULT 0,
  revenue numeric(14,2) NOT NULL DEFAULT 0,
  orders integer NOT NULL DEFAULT 0,
  refunds numeric(14,2) NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS customers (
  id text PRIMARY KEY,
  name text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  lifetime_value numeric(14,2) NOT NULL DEFAULT 0,
  order_count integer NOT NULL DEFAULT 0,
  first_order_at timestamptz,
  last_order_at timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS customers_email_lower_idx ON customers (lower(email));
CREATE INDEX IF NOT EXISTS customers_ltv_desc_idx ON customers (lifetime_value DESC);

CREATE TABLE IF NOT EXISTS revenue_orders (
  order_id text PRIMARY KEY,
  customer_id text,
  ordered_at timestamptz NOT NULL,
  currency text NOT NULL,
  gross_amount numeric(14,2) NOT NULL,
  refund_amount numeric(14,2) NOT NULL DEFAULT 0,
  net_amount numeric(14,2) NOT NULL,
  payout_reference text,
  source text NOT NULL DEFAULT 'shopify',
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS revenue_orders_ordered_at_idx ON revenue_orders (ordered_at);

CREATE TABLE IF NOT EXISTS revenue_checks (
  check_id bigserial PRIMARY KEY,
  run_date date NOT NULL,
  check_key text NOT NULL,
  passed boolean NOT NULL,
  reason text NOT NULL,
  expected_value numeric(16,2),
  actual_value numeric(16,2),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (run_date, check_key)
);

CREATE TABLE IF NOT EXISTS audit_logs (
  log_id bigserial PRIMARY KEY,
  run_date date NOT NULL,
  data_cutoff timestamptz NOT NULL,
  status text NOT NULL CHECK (status IN ('PASS','FAIL','MANUAL_REVIEW','BLOCKED')),
  check_score numeric(3,2) NOT NULL CHECK (check_score >= 0 AND check_score <= 1),
  check_reasons jsonb NOT NULL DEFAULT '[]'::jsonb,
  rationale text NOT NULL DEFAULT '',
  is_manually_overridden boolean NOT NULL DEFAULT false,
  overridden_by text,
  override_reason text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS audit_logs_run_date_unique_idx ON audit_logs (run_date);
CREATE INDEX IF NOT EXISTS audit_logs_run_date_idx ON audit_logs (run_date DESC);

-- Insight overrides are audited as decisions, never as edits to the source metrics.
CREATE TABLE IF NOT EXISTS revenue_insights (
  insight_id text PRIMARY KEY,
  run_date date NOT NULL,
  title text NOT NULL,
  rationale text NOT NULL,
  check_score numeric(3,2) NOT NULL CHECK (check_score >= 0 AND check_score <= 1),
  checks jsonb NOT NULL DEFAULT '[]'::jsonb,
  status text NOT NULL DEFAULT 'OPEN' CHECK (status IN ('OPEN','ACCEPTED','REJECTED','OVERRIDDEN')),
  override_reason text,
  overridden_by text,
  updated_at timestamptz NOT NULL DEFAULT now()
);
