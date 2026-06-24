-- =============================================================================
-- Add admin read-all + delete policies on public.subscribers (the waitlist)
-- =============================================================================
-- The legacy `subscribers` table is the email capture for the landing-page
-- waitlist counter on the homepage. Public insert works today (anon can
-- submit). The admin needs to see who's on the list and remove spam / fake /
-- unsubscribed entries.
--
-- Security model (three layers, all server-side):
--   1. RLS enabled (already true from 2026-06-19-fix-notify-signups-rls.sql).
--   2. Public anon/authenticated denied for select/update/delete
--      (already true: `no public select subscribers` with `using (false)`).
--   3. NEW: admin can select-all and delete rows, gated on the admin
--      JWT email matching the hardcoded admin email. Same shape as the
--      feedback admin policy.
--
-- The frontend cannot bypass this — the anon key doesn't match, only the
-- authenticated admin user's JWT does. RLS is the security boundary, not
-- the client.
--
-- Idempotent: drop-then-create. Safe to re-run.
-- =============================================================================

-- ─── admin read-all ────────────────────────────────────────────────────────
drop policy if exists "admin can read subscribers" on public.subscribers;
create policy "admin can read subscribers"
  on public.subscribers
  for select
  to authenticated
  using (auth.jwt() ->> 'email' = 'info@dreamclerk.com');

-- ─── admin delete ─────────────────────────────────────────────────────────
drop policy if exists "admin can delete subscribers" on public.subscribers;
create policy "admin can delete subscribers"
  on public.subscribers
  for delete
  to authenticated
  using (auth.jwt() ->> 'email' = 'info@dreamclerk.com');

-- Note: no admin update policy — subscribers rows are append-only from the
-- admin's perspective. If a typo-correction is ever needed, do it via the
-- Supabase dashboard SQL editor, not the admin UI.
