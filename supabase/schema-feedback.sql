-- =============================================================================
-- DreamClerk — feedback table
-- =============================================================================
-- Anonymous feedback from the /feedback page. Three fields:
--   email      — optional, so users can stay anon if they want
--   category   — short tag (bug | idea | content | other) for triage
--   message    — free text, capped to 4 KB
--   source     — where the form was submitted from (e.g. 'feedback-page',
--                'blog-post-<slug>') so we can see which surface drives
--                the most signal
--
-- Run this once in the Supabase SQL editor:
--   1. https://hmeglzxbxbqetgydkynl.supabase.co
--   2. SQL editor → New query → paste → Run
--
-- RLS:
--   anon can insert (the whole point of the form)
--   anon cannot select/update/delete (read or tamper)
--   authenticated = gated by email match to VITE_ADMIN_EMAIL
--     (info@dreamclerk.com) — that single admin can read + delete.
-- =============================================================================

create table if not exists public.feedback (
  id uuid primary key default gen_random_uuid(),
  email text,
  category text not null default 'other',
  message text not null,
  source text default 'feedback-page',
  user_agent text,
  created_at timestamptz not null default now()
);

create index if not exists feedback_created_at_idx
  on public.feedback (created_at desc);

create index if not exists feedback_category_idx
  on public.feedback (category);

alter table public.feedback enable row level security;

-- Anon can insert (the public form on /feedback)
drop policy if exists "anon can insert feedback" on public.feedback;
create policy "anon can insert feedback"
  on public.feedback for insert
  to anon, authenticated
  with check (
    -- 4 KB ceiling on the message so a bored attacker can't fill the
    -- table with 1 MB rows
    length(message) <= 4096
  );

-- Anon cannot read or tamper. Admin read/delete are granted below.
drop policy if exists "anon cannot select feedback" on public.feedback;
create policy "anon cannot select feedback"
  on public.feedback for select
  to anon
  using (false);

drop policy if exists "anon cannot update feedback" on public.feedback;
create policy "anon cannot update feedback"
  on public.feedback for update
  to anon
  using (false) with check (false);

drop policy if exists "anon cannot delete feedback" on public.feedback;
create policy "anon cannot delete feedback"
  on public.feedback for delete
  to anon
  using (false);

-- Admin (single user, gated by email) can read all feedback for the
-- /admin dashboard tab. Email hardcoded to match the rest of the schema.
drop policy if exists "admin can read feedback" on public.feedback;
create policy "admin can read feedback"
  on public.feedback for select
  to authenticated
  using (auth.jwt() ->> 'email' = 'info@dreamclerk.com');

-- Admin can delete feedback rows (spam cleanup from the dashboard).
drop policy if exists "admin can delete feedback" on public.feedback;
create policy "admin can delete feedback"
  on public.feedback for delete
  to authenticated
  using (auth.jwt() ->> 'email' = 'info@dreamclerk.com');
