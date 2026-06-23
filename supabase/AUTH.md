# DreamClerk — Supabase Auth

The admin route (`/#/admin`) is gated by Supabase Auth. The signed-in user's email
**must** match `VITE_ADMIN_EMAIL` for the RLS policy to allow writes to the `posts`
table. The public landing page is fully unauthenticated.

All auth flows go through `@supabase/supabase-js`. The client is created in
[`app/src/lib/supabase.js`](../app/src/lib/supabase.js).

---

## 1. What we use today (email + password)

### Setup (do this once in Supabase)

1. **Authentication → Providers → Email** — leave on (default).
2. **Authentication → Users → Add user** — create the admin account.
   - Email = the value of `VITE_ADMIN_EMAIL` (default: `info@dreamclerk.com`)
   - Password = a strong secret you store in your password manager
   - **Uncheck** "Auto Confirm User" if you want the password-confirm email flow
     to apply (we do want it auto-confirmed for the admin).
3. **Authentication → URL Configuration** — set `Site URL` to your production
   domain. Add `http://localhost:5173` and `http://localhost:5180` to the
   redirect-URL allowlist for dev.

### App code (already shipped)

The login form in `app/src/components/AdminPage.jsx` calls:

```js
import { signInAdmin } from "../lib/supabase.js";

const result = await signInAdmin(email, password);
if (!result.ok) setErr(result.error);
```

`signInAdmin` is a thin wrapper over `supabase.auth.signInWithPassword`:

```js
// app/src/lib/supabase.js
export async function signInAdmin(email, password) {
  if (!isConfigured || !supabase) {
    return { ok: false, error: "Supabase not configured. Add VITE_SUPABASE_* to .env." };
  }
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { ok: false, error: error.message };
  return { ok: true, user: data.user };
}
```

Session persists in `localStorage` (via `@supabase/supabase-js`'s default
`persistSession: true` + `autoRefreshToken: true`). The session is checked
on every page load via `supabase.auth.getSession()`.

### Why the RLS policy is email-gated

`supabase/schema.sql` declares:

```sql
create policy "admin can do anything with posts"
  on public.posts for all
  to authenticated
  using (
    (auth.jwt() ->> 'email') = current_setting('app.admin_email', true)
    or
    (auth.jwt() ->> 'email') = 'info@dreamclerk.com'
  )
  with check (
    (auth.jwt() ->> 'email') = current_setting('app.admin_email', true)
    or
    (auth.jwt() ->> 'email') = 'info@dreamclerk.com'
  );
```

The `current_setting('app.admin_email')` is set at request time by a
small `set_config()` call. In practice we just hard-code the email as a
literal in the policy — it's a one-person admin, not a multi-tenant SaaS.

---

## 2. Other Supabase auth methods you can swap in

Below are the working code snippets for **all the auth methods** Supabase
supports. Pick one if you ever want a different flow (magic link, OAuth,
phone, passkeys). The `app/src/lib/supabase.js` helpers stay the same shape
— just swap `signInWithPassword` for whichever method below.

### 2.1 Magic link (passwordless email)

Best for: low-friction admin, no password to remember.

```js
// Send the link
export async function signInAdminMagicLink(email) {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${window.location.origin}/#/admin`,
    },
  });
  return { ok: !error, error: error?.message };
}
```

Setup:
- **Authentication → URL Configuration** → add `https://yourdomain.com/#/admin`
  to the redirect-URL allowlist (the hash route is the post-login destination).
- The user gets an email, clicks the link, lands on `/#/admin` already
  signed in.

### 2.2 Google OAuth

Best for: no password at all, the admin already has Google.

```js
export async function signInAdminGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/#/admin`,
      scopes: "openid email profile",
      queryParams: { access_type: "offline", prompt: "consent" },
    },
  });
  return { ok: !error, error: error?.message };
}
```

Setup:
- **Authentication → Providers → Google** → enable, paste OAuth client ID +
  secret from Google Cloud Console.
- Add `https://YOUR_PROJECT.supabase.co/auth/v1/callback` as an authorized
  redirect URI in the Google Cloud Console.
- **Important**: the email returned by Google **must equal** `VITE_ADMIN_EMAIL`
  for the RLS policy to pass. If you sign in with a different Google account,
  reads/writes to `posts` will silently 403.

### 2.3 GitHub OAuth

Best for: developer audience. The admin's GitHub email must match.

```js
export async function signInAdminGitHub() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: { redirectTo: `${window.location.origin}/#/admin` },
  });
  return { ok: !error, error: error?.message };
}
```

Setup:
- **Authentication → Providers → GitHub** → enable, paste the OAuth App
  client ID/secret. Set the callback URL in the GitHub OAuth app to
  `https://YOUR_PROJECT.supabase.co/auth/v1/callback`.
- If the GitHub account has **email privacy on**, Supabase will get a
  null email — the RLS check `auth.jwt() ->> 'email'` will fail.
  Either turn email privacy off, or set a public email in GitHub settings.

### 2.4 Phone (SMS OTP)

Best for: international admins. Twilio integration in Supabase.

```js
// step 1 — request the OTP
export async function startPhoneSignIn(phone) {
  const { error } = await supabase.auth.signInWithOtp({ phone });
  return { ok: !error, error: error?.message };
}

// step 2 — verify
export async function verifyPhoneOtp(phone, token) {
  const { data, error } = await supabase.auth.verifyOtp({
    phone, token, type: "sms",
  });
  if (error) return { ok: false, error: error.message };
  return { ok: true, user: data.user };
}
```

Setup:
- **Authentication → Providers → Phone** → enable, paste Twilio credentials.
- The phone is the user's unique identifier — there is no "email" claim
  in the JWT for phone auth, so the RLS policy has to be reworked to
  check `auth.jwt() ->> 'phone'` instead of `email`. We don't ship
  this by default.

### 2.5 Passkeys (WebAuthn)

Best for: the strongest possible auth — no password, no email round-trip,
phishing-resistant. New in Supabase as of 2025.

```js
// step 1 — start the passkey enrollment / sign-in
const { data, error } = await supabase.auth.signInWithWebAuthn({
  options: { prompt: "Sign in to DreamClerk admin" },
});
// data.challenge is the assertion the browser needs

// step 2 — after the browser returns the assertion
const { data: session, error: e2 } =
  await supabase.auth.verifyWebAuthn({ assertion });
```

Setup:
- **Authentication → Sign In / Up → Passkeys** → enable.
- Requires HTTPS in production.
- The passkey's "user handle" is the user's UUID — RLS works the same
  way as password auth, since the JWT still has an `email` (or doesn't,
  if you sign in with a passkey for the first time; in that case the
  email is null and you'll need to relax the RLS check).

### 2.6 Sign out

The same regardless of method:

```js
export async function signOutAdmin() {
  await supabase.auth.signOut();
  // supabase.auth.onAuthStateChange fires with session=null
}
```

### 2.7 Get the current session

```js
const { data: { session } } = await supabase.auth.getSession();
if (session?.user?.email === import.meta.env.VITE_ADMIN_EMAIL) {
  // … show admin UI
}
```

### 2.8 Subscribe to auth state

```js
const { data: { subscription } } = supabase.auth.onAuthStateChange(
  (event, session) => {
    if (event === "SIGNED_IN") console.log("signed in", session.user.email);
    if (event === "SIGNED_OUT") console.log("signed out");
  }
);
// later
subscription.unsubscribe();
```

---

## 3. RLS cheatsheet

The `posts` table has three policies, defined in `supabase/schema.sql`:

| Policy | Role | Action | Predicate |
|---|---|---|---|
| `public can read published posts` | `anon`, `authenticated` | `select` | `published = true` |
| `authenticated can read all posts` | `authenticated` | `select` | always true (admin sees drafts) |
| `admin can write posts` | `authenticated` | `all` (insert/update/delete) | `auth.jwt() ->> 'email' = VITE_ADMIN_EMAIL` |

`subscribers` and `notify_signups` are **insert-only for the public**,
**read-only for the service role**. RLS blocks the anon key from reading
other people's emails.

If you swap the auth method and the JWT no longer carries the expected
`email` claim, you must update the RLS policy accordingly. Common
substitutions:

- `auth.jwt() ->> 'phone'` for phone auth
- `auth.uid()` for any authed user (drop the email check)
- a hard-coded service-role key for the server-side renderer

---

## 4. Local dev — test the full flow

```bash
# 1. apply the schema
psql "$DATABASE_URL" -f supabase/schema.sql
psql "$DATABASE_URL" -f supabase/seed.sql   # adds the first blog post

# 2. set env
cp app/.env.example app/.env
# fill in VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, VITE_ADMIN_EMAIL

# 3. run
cd app && npm run dev
# open http://localhost:5173/#/admin
# sign in with the email + password you set in step 1
```

The login form is on `/#/admin` directly — no separate `/admin/login` route
is needed because the login form **is** the gate. If you're signed in, the
form disappears and the dashboard shows up instead. On a 401, the form
re-renders with the error inline.

---

## 5. Production checklist

- [ ] Service-role key is **not** in any frontend env var. Only anon key
      is shipped to the client.
- [ ] `Site URL` in Supabase is set to the production domain.
- [ ] `VITE_ADMIN_EMAIL` is set in Vercel env vars (Production).
- [ ] The admin user's email is verified in Supabase Auth.
- [ ] `posts` RLS policy is verified to deny reads to anon, deny writes
      to non-admin authenticated users. Smoke test:
      ```sql
      -- as anon
      set role anon;
      select * from posts;          -- should return only published=true
      insert into posts ...;       -- should 401 / RLS error
      ```
- [ ] Email-link and OAuth providers (if enabled) have the right
      redirect URLs in both Supabase **and** the OAuth provider console.
- [ ] The Google Ads banner (if shipped) loads **only** on idle, never
      above-the-fold, never as an interstitial.
