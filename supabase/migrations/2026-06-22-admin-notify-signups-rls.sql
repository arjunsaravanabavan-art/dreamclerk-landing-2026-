-- =============================================================================
-- Add admin read-all + delete policies on public.notify_signups
-- =============================================================================
-- The `notify_signups` table captures every "notify me" click across the
-- landing site (hero, tracks, final CTA, /about, etc.). Public insert works
-- today (anon can submit with their email). The admin needs to see who's on
-- the list and remove spam / fake / unsubscribed entries.
--
-- Schema (from schema.sql:43-49):
--   id uuid pk
--   email text unique not null
--   name text
--   source text default 'modal'
--   created_at timestamptz default now()
--
-- Security model (three layers, all server-side):
--   1. RLS enabled (already true from 2026-06-19-fix-notify-signups-rls.sql).
--   2. Public anon/authenticated denied for select/update/delete
--      (already true: `no public select notify_signups` with `using (false)`).
--   3. NEW: admin can select-all and delete rows, gated on the admin
--      JWT email matching 'info@dreamclerk.com'. Same shape as the feedback
--      and subscribers admin policies.
--
-- The frontend cannot bypass this — the anon key doesn't match, only the
-- authenticated admin user's JWT does. RLS is the security boundary, not
-- the client.
--
-- Idempotent: drop-then-create. Safe to re-run.
-- =============================================================================

-- ─── admin read-all ────────────────────────────────────────────────────────
drop policy if exists "admin can read notify_signups" on public.notify_signups;
create policy "admin can read notify_signups"
  on public.notify_signups
  for select
  to authenticated
  using (auth.jwt() ->> 'email' = 'info@dreamclerk.com');

-- ─── admin delete ─────────────────────────────────────────────────────────
drop policy if exists "admin can delete notify_signups" on public.notify_signups;
create policy "admin can delete notify_signups"
  on public.notify_signups
  for delete
  to authenticated
  using (auth.jwt() ->> 'email' = 'info@dreamclerk.com');

-- Note: no admin update policy — notify_signups rows are append-only from
-- the admin's perspective. If a typo-correction is ever needed, do it via
-- the Supabase dashboard SQL editor, not the admin UI.