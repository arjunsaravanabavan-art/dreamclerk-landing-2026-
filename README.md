# DreamClerk Landing

A single-page React app for the DreamClerk career-simulation platform. Vite + React + Tailwind, hash-routed, deployed to Vercel.

## Stack

- React 18 + Vite 8 (rolldown)
- Tailwind / hand-written CSS
- Framer Motion
- Hash router (no server, no SSR)
- Supabase (posts + admin + notify signups)

## Local dev

```bash
cd app
npm install
npm run build      # one-shot build to ./dist
npm run dev        # vite dev server
npm run preview    # serves the build on http://localhost:5180/
```

## Routes (hash router)

| Route | File | Notes |
|---|---|---|
| `#/` | `LandingPage` in `App.jsx` | full 13-section landing |
| `#/how` | `HowItWorksPage.jsx` | scroll-driven 8-beat timeline (real artifacts, real persona arc) |
| `#/workspace` | `WorkspacePage.jsx` | track-filtered, 8 categories × 3 gigs = 24 mock surfaces |
| `#/tracks` | `TracksPage.jsx` | single-column track cards with stat meters |
| `#/companies` | `CompaniesPage.jsx` | single-column company profiles |
| `#/faq` | `FAQPage.jsx` | visible-on-load man page, 19 questions, 4 groups |
| `#/blog` | `BlogListPage.jsx` | public blog index |
| `#/blog/:slug` | `BlogPostPage.jsx` | public post (rendered from markdown) |
| `#/admin` | `AdminPage.jsx` → `AdminDashboard.jsx` | internal: list posts, create/edit/delete |
| `#/about` `#/privacy` `#/terms` | `About.jsx` `Privacy.jsx` `Terms.jsx` | legal pages |

## Supabase

Backend lives in `supabase/`. The app talks to Supabase via `@supabase/supabase-js` in `app/src/lib/supabase.js`.

### 1. Create the schema

Go to your Supabase project → SQL editor → New query → paste `supabase/schema.sql` → Run.

This creates:

- `subscribers` table (legacy, used for the homepage waitlist counter)
- `notify_signups` table (the "get notified" form on the landing page)
- `posts` table (blog — public read of `published = true`, authed read/write for the admin email)
- `waitlist_count` table + 2 RPCs (`get_waitlist_count`, `bump_waitlist_count`)
- All RLS policies

### 2. Create the admin user

Supabase → Authentication → Users → Add user → set the email to the value of `VITE_ADMIN_EMAIL` (default: `admin@dreamclerk.com`) → set a password → User.

### 3. Seed the first blog post

In the Supabase SQL editor, paste `supabase/seed.sql` → Run. This inserts the post "why we built dreamclerk" with `published = true` so it shows up on `/#/blog` immediately.

Alternatively, paste the fields from `supabase/seedPost.json` into the new-post form at `/#/admin` after signing in.

### 4. Configure env

Copy `app/.env.example` to `app/.env` and fill in:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY_HERE
VITE_ADMIN_EMAIL=admin@yourdomain.com
```

The anon key is public — it's safe to commit. RLS protects all writes.

### 5. Restart `npm run dev` / `npm run preview`

The client reads env at build time. A rebuild is required after changing `.env`.

## File map

```
app/
├── index.html                    ← primary SEO, JSON-LD, fonts
├── .env                          ← VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, VITE_ADMIN_EMAIL
├── public/
│   ├── robots.txt
│   ├── sitemap.xml
│   ├── favicon-*.png
│   ├── og.png
│   └── logo.svg
├── src/
│   ├── main.jsx
│   ├── App.jsx                   ← router + landing-page composition
│   ├── index.css                 ← all design tokens, components, sub-pages
│   ├── lib/
│   │   ├── supabase.js           ← @supabase/supabase-js client + helpers
│   │   ├── markdown.jsx          ← tiny safe markdown renderer (h2/h3/ul/ol/quote/code/hr/link/bold/italic)
│   │   ├── trackData.js          ← 24 gigs across 8 tracks (code, canvas, ledger surfaces)
│   │   └── seo.js                ← useSEO() per-page updater + SEO payload table
│   └── components/
│       ├── Nav.jsx               ← top nav with status pill
│       ├── Hero.jsx              ← terminal-style hero
│       ├── Mentions.jsx          ← press-quotes marquee (added 2026-06)
│       ├── Marquee.jsx           ← colleges marquee
│       ├── Loop.jsx              ← 8-step protocol summary
│       ├── Workspace.jsx         ← landing-page workspace section
│       ├── Tracks.jsx
│       ├── Companies.jsx
│       ├── Certificate.jsx
│       ├── Stats.jsx
│       ├── Testimonials.jsx
│       ├── FAQ.jsx
│       ├── Final.jsx
│       ├── Footer.jsx
│       ├── EmailModal.jsx        ← "get notified" modal → supabase
│       ├── About.jsx / Privacy.jsx / Terms.jsx
│       ├── HowItWorksPage.jsx    ← long-form sub-pages (route-driven)
│       ├── WorkspacePage.jsx
│       ├── TracksPage.jsx
│       ├── CompaniesPage.jsx
│       ├── FAQPage.jsx
│       ├── BlogListPage.jsx
│       ├── BlogPostPage.jsx
│       ├── AdminPage.jsx         ← auth gate
│       ├── AdminDashboard.jsx    ← post list
│       ├── PostEditor.jsx        ← markdown editor + live preview
│       ├── SectionLabel.jsx
│       ├── Svg.jsx                ← inline SVG icon library
│       └── useReveal.js          ← scroll-reveal hook
supabase/
├── schema.sql                    ← run once to create tables + RLS
├── seed.sql                      ← run after schema.sql to add the first post
└── seedPost.json                 ← paste into the admin editor instead of running seed.sql
```

## Per-page SEO

`useSEO({...})` is called in every route component. It updates `document.title`, meta description, canonical, OG, Twitter, and injects one JSON-LD script (`#dc-jsonld-page`). The 3 static JSON-LD blocks in `index.html` (Organization, WebSite, SoftwareApplication, FAQPage) stay loaded on every page.

Admin is `noindex, nofollow` — the useEffect adds it on mount and restores the default on unmount.

## Deploy (Vercel)

```bash
vercel --prod
```

The project root is the repo root. Vite's `outDir` is `app/dist`, but the `vercel.json` rewrites the build to the correct location. The site is served as a static SPA — no server-side rendering.

## Notes

- The site is **monochrome** by design. Black `#0a0a0a` on paper `#f4f1ea`. Status semantics only inside terminal contexts.
- The `get-notified` form writes to `notify_signups`; the homepage counter reads from `waitlist_count`. The two are separate tables so the counter can be bumped once-per-visitor-per-day even if the user doesn't fill the form.
- The 6 mention quotes in `Mentions.jsx` are illustrative — swap for real coverage as it lands.
- The 4 "live" companies (vivacity, nexara, oxygon, figment) are real published companies whose names are referenced in dreamclerk's public material. The 2 "beta" companies (levanto, magrana) are illustrative. The 6 are presented as simulated internship partners in the same fictional universe as the product.
