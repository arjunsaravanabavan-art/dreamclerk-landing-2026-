-- ─── seed feedback (run in Supabase SQL editor) ────────────────────────────
--
-- 3 demo feedback rows so the admin feedback tab renders with content
-- on first load, instead of an empty table. Useful for screenshots
-- and for the founder's own check.
--
-- All three are submitted as if by anonymous users (no email). The
-- "anonymous@local" marker on the first one is just a visual tag —
-- there is no FK, and the real schema allows null emails.
--
-- Idempotent: re-running is safe. The ON CONFLICT clause is keyed
-- on (id) so we re-insert the same deterministic UUIDs; if a row
-- with the same id already exists, it is updated.

insert into public.feedback (id, email, category, message, source, created_at)
values
  (
    '11111111-1111-1111-1111-111111111111',
    null,
    'bug',
    'the apply form accepted my email with a trailing space. i did not notice until i saw the confirmation land in spam. maybe strip whitespace before validating?',
    'feedback-page',
    now() - interval '4 days'
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    'anonymous@local',
    'idea',
    'would love a dark mode for the certificate page. i screenshot the cert to send to my parents and it burns their eyes in the morning. monochrome dark is fine, just not paper.',
    'feedback-page',
    now() - interval '2 days'
  ),
  (
    '33333333-3333-3333-3333-333333333333',
    null,
    'story',
    'got my first callback from a company that uses dreamclerk-style interviews. the prompt was "tell me about a piece of code you would rewrite" and i had practiced it because of your blog post. that single post probably changed my application. thanks.',
    'feedback-page',
    now() - interval '6 hours'
  )
on conflict (id) do update
  set
    email      = excluded.email,
    category   = excluded.category,
    message    = excluded.message,
    source     = excluded.source,
    created_at = excluded.created_at;

-- Reset the demo rows to a known ordering for repeatable screenshots:
--   bug      → 4 days ago
--   idea     → 2 days ago
--   story    → 6 hours ago
-- The on-conflict update above handles re-runs.
