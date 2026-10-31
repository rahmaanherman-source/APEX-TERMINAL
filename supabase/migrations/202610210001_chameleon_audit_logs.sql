-- Chameleon audit log. Apply through Supabase migrations or SQL Editor.
-- The Edge Function writes using the service-role key; client sessions receive read-only access to their own rows.
create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references auth.users(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists audit_logs_created_at_idx
  on public.audit_logs (created_at desc);
create index if not exists audit_logs_actor_created_idx
  on public.audit_logs (actor_id, created_at desc);

alter table public.audit_logs enable row level security;

drop policy if exists "read own or admin" on public.audit_logs;
drop policy if exists "Users can read own audit rows" on public.audit_logs;
create policy "Users can read own audit rows"
  on public.audit_logs for select
  to authenticated
  using (auth.uid() = actor_id);

-- Deliberately no client INSERT/UPDATE/DELETE policy.
-- Service-role access is confined to the Edge Function secret environment.
