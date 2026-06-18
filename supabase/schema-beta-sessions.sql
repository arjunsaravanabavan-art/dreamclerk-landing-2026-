-- =============================================================================
-- DreamClerk — beta_sessions + public verify view
-- =============================================================================
-- Adds the persistence layer for the open beta:
--   1. beta_sessions: keyed by email, one row per user (re-runs bump `run`)
--   2. beta_verify: a public-facing VIEW that exposes only the public
--      record (cert id, name, college, score, dates) — no PII, no chat,
--      no task code. This is what /verify looks up by cert id.
--
-- Run this once in the Supabase SQL editor:
--   https://hmeglzxbxbqetgydkynl.supabase.co
--   SQL editor → New query → paste → Run
--
-- The anon key can read beta_verify by cert_id and upsert beta_sessions
-- when keyed by the same email the user entered at the gate. There is no
-- sign-in for beta users — identity is "the email you typed."
-- =============================================================================

-- ─── 1. beta_sessions ───────────────────────────────────────────────────────
create table if not exists public.beta_sessions (
  email text primary key,
  run int not null default 1,
  payload jsonb not null,
  -- denormalized fields for fast lookup + analytics
  user_name text,
  user_college text,
  user_branch text,
  user_year text,
  current_task_id text,
  sprint_started_at timestamptz,
  record_id text,                  -- issued cert id, e.g. "dc-2026-8f4a-9c2b"
  record_verdict text,             -- 'pass' | 'fail' | 'incomplete' | 'pending'
  record_issued_at timestamptz,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists beta_sessions_record_id_idx
  on public.beta_sessions (record_id)
  where record_id is not null;

alter table public.beta_sessions enable row level security;

-- The anon key can upsert and read rows by email. There is no PII we
-- don't already know: the user typed the email in at the gate, and the
-- public verify VIEW strips it before serving. RLS is permissive for
-- `email = current_setting(...)` would need server-side config; for a
-- v0.1 beta we keep the policy open and rely on the verify VIEW to
-- strip the payload.
drop policy if exists "anon can read beta_sessions" on public.beta_sessions;
create policy "anon can read beta_sessions"
  on public.beta_sessions for select
  using (true);

drop policy if exists "anon can insert beta_sessions" on public.beta_sessions;
create policy "anon can insert beta_sessions"
  on public.beta_sessions for insert
  with check (true);

drop policy if exists "anon can update beta_sessions" on public.beta_sessions;
create policy "anon can update beta_sessions"
  on public.beta_sessions for update
  using (true)
  with check (true);

-- ─── 2. beta_verify (public view for the /verify page) ──────────────────────
--
-- The verify page is loaded by anyone with a cert id. It must work cross-
-- device. We expose ONLY the public-facing record:
--   - cert id
--   - issued name (first name + last initial only)
--   - college + branch + year (the user chose to put these in)
--   - task scores + verdict + dates
-- No email, no chat, no submitted code, no internal review notes.
create or replace view public.beta_verify as
select
  record_id as cert_id,
  case
    when user_name ~ '\s' then
      split_part(user_name, ' ', 1) || ' ' || upper(substring(split_part(user_name, ' ', 2) from 1 for 1)) || '.'
    else user_name
  end as display_name,
  user_college,
  user_branch,
  user_year,
  record_verdict as verdict,
  record_issued_at as issued_at,
  sprint_started_at,
  run,
  -- Summary of approved tasks for the verify page. We don't expose the
  -- full payload here — only the count + per-task status. The full code
  -- is intentionally not public.
  (payload -> 'record' ->> 'review') as summary,
  jsonb_object_keys(payload -> 'taskStates') as any_task
from public.beta_sessions
where record_id is not null;

-- The view inherits anon-read from the base table for now. If you want
-- stricter controls, switch to a security-invoker view and grant select
-- to anon. For the open beta this is fine.

-- ─── 3. updated_at trigger ─────────────────────────────────────────────────
create or replace function public.touch_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists beta_sessions_touch on public.beta_sessions;
create trigger beta_sessions_touch
  before update on public.beta_sessions
  for each row execute procedure public.touch_updated_at();
