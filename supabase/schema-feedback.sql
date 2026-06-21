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
-- RLS: anon can insert (the whole point of the form), no select/update/delete
-- for anon. The admin reads these from the Supabase dashboard.
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

-- Block select/update/delete for anon. Admin reads from the Supabase
-- dashboard or a service-role key.
drop policy if exists "no public select feedback" on public.feedback;
create policy "no public select feedback"
  on public.feedback for select
  to anon, authenticated
  using (false);

drop policy if exists "no public update feedback" on public.feedback;
create policy "no public update feedback"
  on public.feedback for update
  to anon, authenticated
  using (false) with check (false);

drop policy if exists "no public delete feedback" on public.feedback;
create policy "no public delete feedback"
  on public.feedback for delete
  to anon, authenticated
  using (false);
