# Deploying DreamClerk landing to Vercel

## Required env vars

The Vite client bundle inlines `import.meta.env.VITE_*` at build time. If these
are missing, the EmailModal falls into "dev mode" (the success state shows the
dev-mode warning instead of saving to Supabase). The build will succeed, but
the live site will be silently broken.

Set both of these in **Vercel → Project Settings → Environment Variables** for
the **Production** environment:

| Name | Value | Where to find it |
|---|---|---|
| `VITE_SUPABASE_URL` | `https://hmeglzxbxbqetgydkynl.supabase.co` | Supabase project dashboard → Settings → API |
| `VITE_SUPABASE_ANON_KEY` | (the `anon` / `public` JWT for the project) | Same place, "Project API keys" → "anon" / "public" |

The URL is also committed to `vercel.json` as a `build.env` default so the
project works on first push. The key is **not** committed (it's per-project
and may rotate). Copy the current value from your local `.env` or from
Supabase Settings → API.

After changing env vars, **trigger a redeploy from the Deployments tab**.
Vercel does NOT auto-rebuild when env vars change.

## Defense-in-depth

`app/src/lib/supabase.js` hardcodes a URL fallback (the project URL is public,
not a secret) so the build never inlines `undefined` for `VITE_SUPABASE_URL`.
The anon key remains env-driven so key rotations are a deploy action, not a
code change.

## Verifying a deploy

1. Build completes with 0 errors.
2. New bundle contains the URL substring:
   ```bash
   curl -s "https://www.dreamclerk.com/assets/index-XXXX.js" | grep -c hmeglzxbxbqetgydkynl
   # expect: 2 (or more)
   ```
3. Submit a test email from the live site. Success state should read:
   `● saved to supabase · notify_signups (you@…)`
   Not the dev-mode warning.
4. Verify in Supabase SQL Editor:
   ```sql
   select id, email, source, created_at
   from public.notify_signups
   order by created_at desc
   limit 5;
   ```
