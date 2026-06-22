-- =============================================================================
-- Fix RLS on notify_signups + subscribers so the landing-page email form works
-- =============================================================================
-- The current schema defines:
--   create policy "public can insert notify_signups"
--     on public.notify_signups for insert
--     with check (true);
-- But the live database rejects anon-key inserts with:
--   "new row violates row-level security policy for table 'notify_signups'"
--
-- Cause: in Supabase, the default permissive predicate only applies to the
-- `public` role, NOT to `anon`/`authenticated` when RLS is enabled. The
-- policy needs `to anon, authenticated` explicitly.
--
-- This migration:
--   1. Drops the existing policies
--   2. Recreates them with `to anon, authenticated` so the anon key can
--      insert, but blocks selects/updates/deletes (insert-only for public).
--   3. Adds the same fix to `subscribers` for consistency.
-- =============================================================================

-- ─── notify_signups ────────────────────────────────────────────────────────

alter table public.notify_signups enable row level security;

drop policy if exists "public can insert notify_signups" on public.notify_signups;
drop policy if exists "anon can insert notify_signups" on public.notify_signups;
drop policy if exists "authenticated can insert notify_signups" on public.notify_signups;

create policy "anon can insert notify_signups"
  on public.notify_signups
  for insert
  to anon, authenticated
  with check (true);

-- Block all other operations for anon/authenticated (defense in depth).
drop policy if exists "no public select notify_signups" on public.notify_signups;
create policy "no public select notify_signups"
  on public.notify_signups
  for select
  to anon, authenticated
  using (false);

drop policy if exists "no public update notify_signups" on public.notify_signups;
create policy "no public update notify_signups"
  on public.notify_signups
  for update
  to anon, authenticated
  using (false) with check (false);

drop policy if exists "no public delete notify_signups" on public.notify_signups;
create policy "no public delete notify_signups"
  on public.notify_signups
  for delete
  to anon, authenticated
  using (false);

-- ─── subscribers ───────────────────────────────────────────────────────────

alter table public.subscribers enable row level security;

drop policy if exists "public can insert subscribers" on public.subscribers;
drop policy if exists "anon can insert subscribers" on public.subscribers;

create policy "anon can insert subscribers"
  on public.subscribers
  for insert
  to anon, authenticated
  with check (true);

drop policy if exists "no public select subscribers" on public.subscribers;
create policy "no public select subscribers"
  on public.subscribers
  for select
  to anon, authenticated
  using (false);

drop policy if exists "no public update subscribers" on public.subscribers;
create policy "no public update subscribers"
  on public.subscribers
  for update
  to anon, authenticated
  using (false) with check (false);

drop policy if exists "no public delete subscribers" on public.subscribers;
create policy "no public delete subscribers"
  on public.subscribers
  for delete
  to anon, authenticated
  using (false);
