-- APEX TERMINAL — WORKSPACE SCHEMA SKELETON
-- Canonical data contracts for the exact root shell.
-- Extend existing database models; do not duplicate existing tables.

create table if not exists apex_workspace_state (
  id uuid primary key,
  owner_id uuid not null,
  active_project_id uuid,
  truth_state text not null check (truth_state in (
    'DOCUMENTED','CONFIGURED','CONNECTED','RUNNABLE','TESTED','VERIFIED',
    'NOT_CONFIGURED','CREDENTIAL_REQUIRED','PERMISSION_REQUIRED',
    'SERVICE_UNAVAILABLE','EXECUTION_FAILED','BLOCKED'
  )),
  gabby_online boolean not null default false,
  updated_at timestamptz not null default now()
);

create table if not exists apex_workspace_regions (
  id uuid primary key,
  workspace_id uuid not null references apex_workspace_state(id) on delete cascade,
  region_key text not null,
  position_key text not null,
  visible boolean not null default true,
  state_json jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique(workspace_id, region_key)
);

create table if not exists apex_workspace_actions (
  id uuid primary key,
  workspace_id uuid not null references apex_workspace_state(id) on delete cascade,
  action_key text not null,
  route text,
  capability_key text,
  authorization_state text not null default 'UNKNOWN',
  execution_state text not null default 'NOT_RUN',
  evidence_ref text,
  audit_event_id uuid,
  updated_at timestamptz not null default now(),
  unique(workspace_id, action_key)
);

create table if not exists apex_provider_runtime_state (
  id uuid primary key,
  provider_key text not null,
  adapter_key text,
  state text not null check (state in (
    'DOCUMENTED','CONFIGURED','CONNECTED','RUNNABLE','TESTED','VERIFIED',
    'NOT_CONFIGURED','CREDENTIAL_REQUIRED','PERMISSION_REQUIRED',
    'SERVICE_UNAVAILABLE','EXECUTION_FAILED','BLOCKED'
  )),
  capability_json jsonb not null default '{}'::jsonb,
  evidence_ref text,
  last_checked_at timestamptz,
  unique(provider_key, adapter_key)
);

create table if not exists apex_realtime_audit_event (
  id uuid primary key,
  workspace_id uuid references apex_workspace_state(id) on delete set null,
  event_time timestamptz not null default now(),
  actor text not null,
  action_key text,
  event_type text not null,
  result_state text not null,
  evidence_json jsonb not null default '{}'::jsonb,
  previous_hash text,
  event_hash text
);

create index if not exists idx_apex_workspace_regions_workspace on apex_workspace_regions(workspace_id);
create index if not exists idx_apex_workspace_actions_workspace on apex_workspace_actions(workspace_id);
create index if not exists idx_apex_provider_runtime_state_provider on apex_provider_runtime_state(provider_key);
create index if not exists idx_apex_realtime_audit_event_time on apex_realtime_audit_event(event_time desc);

-- Required root region keys:
-- workspace, connected_apps, creation_studio, gabby, engines,
-- system_status, foley_sound_design, ai_dialogue_adak,
-- timeline_sequence, audit_feed, command_bar,
-- apex_realtime_engine, truth_status, gabby_status

-- Required command keys:
-- build, run, test, verify, deploy, publish

-- SECURITY LAW: raw provider credentials MUST NOT be stored in these tables.
-- Store credential references only; resolve through the existing Vault/Gatekeeper path.
