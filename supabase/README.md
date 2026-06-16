# Supabase — DreamClerk

Run in this order in the Supabase SQL editor:

1. **`schema.sql`** — tables, RLS policies, RPCs (idempotent end-to-end).
2. **`fix-waitlist-count.sql`** — only if you have a legacy `waitlist_count`
   table without an `id` column. Safe to skip on a fresh project.
3. **`seed.sql`** — first blog post ("why we built dreamclerk").
4. **`seed-jobs-unemployment.sql`** — second post ("India graduate
   unemployment 2026").

After that:

- Authentication → Users → Add user. Email = `VITE_ADMIN_EMAIL`.
- Project Settings → API → copy URL + anon key into Vercel env.

## Auth

See **`AUTH.md`** for the full breakdown of the email + password flow
and snippets for magic link, Google, GitHub, phone, and passkey auth.

## Public evidence / marketing content

- **`seo-blog-jobs-unemployment.md`** — the SEO post source (markdown).
- **`seo-blog-jobs-unemployment-meta.html`** — `<head>` meta tags, OG,
  Twitter, JSON-LD (Article + FAQPage + BreadcrumbList), and a
  non-intrusive Google Ads bottom-banner with 7-day dismiss cookie.
  Drop the whole block into the post page's `<head>`.
