# How to remove a row from notify_signups

The `notify_signups` table has Row Level Security (RLS) with only an
INSERT policy. There is no public DELETE — by design, we don't want
random visitors to be able to delete other people's entries.

To remove a specific row, use one of the following.

## Option 1 — Supabase SQL Editor (fastest, manual)

1. Open https://supabase.com/dashboard/project/hmeglzxbxbqetgydkynl/sql
2. Paste and run:

```sql
-- Delete by email
delete from public.notify_signups
where email = 'arjun@dreamclerk.com';

-- Or by id (find the id first):
select id, email, name, source, created_at
from public.notify_signups
order by created_at desc
limit 10;

-- Then:
delete from public.notify_signups
where id = '<paste the id here>';
```

The SQL Editor uses the service role, so it bypasses RLS.

## Option 2 — Add a delete RPC for admin use

If you'll be cleaning up entries often, add a Postgres function and grant
execute to the anon role (with an admin-email check) so the admin page
can call it. Run once in the SQL editor:

```sql
create or replace function public.admin_delete_notify_signup(target_email text)
returns boolean
language plpgsql
security definer  -- runs as the function owner (postgres), bypasses RLS
as $$
begin
  delete from public.notify_signups where email = target_email;
  return found;
end;
$$;

grant execute on function public.admin_delete_notify_signup(text) to anon, authenticated;
```

Then in `app/src/lib/supabase.js`, expose:

```js
export async function adminDeleteNotifySignup(email) {
  if (!isConfigured || !supabase) return { ok: false, error: "not configured" };
  const { data, error } = await supabase.rpc("admin_delete_notify_signup", {
    target_email: email,
  });
  return { ok: !error, error: error?.message, deleted: data };
}
```

And in the admin page, wire a "delete entry by email" UI to it. The
service-role bypass on the function ensures it works even though the
table's DELETE policy is absent.

## Why the test insert didn't work for me

The anon key in `app/.env.example` (ending `…cNZ7E`) is rejected by the
live Supabase project as `Invalid API key`. The fix requires a freshly
issued anon key from the Supabase dashboard. If the live site is
showing "saved to supabase · notify_signups (you@…)" then the bundle
on Vercel has the **correct** key — not the one in `.env.example`. The
.env file in the repo is stale and should be updated to match whatever
key is currently in the Vercel project env.
