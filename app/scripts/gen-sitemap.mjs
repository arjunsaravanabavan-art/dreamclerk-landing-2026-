#!/usr/bin/env node
//
// gen-sitemap.mjs — generate app/public/sitemap.xml from a single source
//
// The sitemap is built from TWO sources, in priority order:
//
//   1. Static pages — hand-curated list of marketing routes with stable
//      priority + changefreq (homepage, /how, /workspace, /tracks,
//      /companies, /faq, /about, /blog, /privacy, /terms, /feedback,
//      /contact, /verify). These don't change often.
//
//   2. SEED_POSTS — every published blog post. The blog list is the
//      single source of truth for blog URLs (see seedPosts.js). This
//      guarantees the sitemap can never drift from the public blog.
//
// Why this exists:
//   Prior versions of sitemap.xml were maintained by hand and silently
//   fell behind. After adding 5 new blog posts in June 2026, the
//   sitemap still listed only the original 21, and search engines
//   couldn't crawl the new URLs. This script re-generates the file
//   from code on every `npm run build`.
//
// Output: app/public/sitemap.xml
// The file is committed to the repo (Vite copies app/public/* into
// dist/* verbatim during build). Crawlers (Google, Bing, IndexNow)
// fetch /sitemap.xml after each deploy.

import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const APP_ROOT = join(__dirname, "..");

const SITE = "https://www.dreamclerk.com";

// Import SEED_POSTS (built from app/src/lib/seedPosts.js).
const { SEED_POSTS } = await import("../src/lib/seedPosts.js");

// Hand-curated static pages. Keep this list small and stable — only
// the marketing routes that don't change with content edits.
//   changefreq/priority are hints; crawlers mostly ignore them.
//   We follow the conventional values: home=weekly/1.0,
//   core marketing=monthly/0.9, legal=yearly/0.5, utilities=monthly/0.6.
const STATIC_PAGES = [
  { path: "/",         lastmod: "2026-06-25", changefreq: "weekly",  priority: "1.0" },
  { path: "/how",      lastmod: "2026-06-25", changefreq: "monthly", priority: "0.9" },
  { path: "/workspace",lastmod: "2026-06-25", changefreq: "monthly", priority: "0.9" },
  { path: "/tracks",   lastmod: "2026-06-25", changefreq: "monthly", priority: "0.9" },
  { path: "/companies",lastmod: "2026-06-25", changefreq: "monthly", priority: "0.9" },
  { path: "/faq",      lastmod: "2026-06-25", changefreq: "monthly", priority: "0.9" },
  { path: "/about",    lastmod: "2026-06-25", changefreq: "monthly", priority: "0.7" },
  { path: "/blog",     lastmod: "2026-06-25", changefreq: "weekly",  priority: "0.8" },
  { path: "/verify",   lastmod: "2026-06-25", changefreq: "monthly", priority: "0.6" },
  { path: "/feedback", lastmod: "2026-06-25", changefreq: "monthly", priority: "0.6" },
  { path: "/contact",  lastmod: "2026-06-25", changefreq: "yearly",  priority: "0.5" },
  { path: "/privacy",  lastmod: "2026-06-25", changefreq: "yearly",  priority: "0.5" },
  { path: "/terms",    lastmod: "2026-06-25", changefreq: "yearly",  priority: "0.5" },
];

// Blog posts: derived from SEED_POSTS, sorted newest first by published_at.
// lastmod = updated_at (falls back to published_at, then created_at).
// changefreq = "monthly" (we publish 1–2 posts/week, so weekly would
// mislead crawlers into over-fetching; monthly is honest).
const blogEntries = SEED_POSTS
  .slice()
  .sort((a, b) => {
    const da = a.published_at ? new Date(a.published_at).getTime() : 0;
    const db = b.published_at ? new Date(b.published_at).getTime() : 0;
    return db - da;
  })
  .map((p) => {
    const raw = p.updated_at || p.published_at || p.created_at;
    const lastmod = raw ? raw.slice(0, 10) : new Date().toISOString().slice(0, 10);
    return {
      path: `/blog/${p.slug}`,
      lastmod,
      changefreq: "monthly",
      priority: "0.7",
    };
  });

const all = [...STATIC_PAGES, ...blogEntries];

const xml = [
  `<?xml version="1.0" encoding="UTF-8"?>`,
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
  ...all.map(
    (u) =>
      `  <url>\n` +
      `    <loc>${SITE}${u.path}</loc>\n` +
      `    <lastmod>${u.lastmod}</lastmod>\n` +
      `    <changefreq>${u.changefreq}</changefreq>\n` +
      `    <priority>${u.priority}</priority>\n` +
      `  </url>`
  ),
  `</urlset>`,
  ``,
].join("\n");

const out = join(APP_ROOT, "public", "sitemap.xml");
writeFileSync(out, xml, "utf8");
console.log(
  `sitemap.xml: wrote ${all.length} entries (${STATIC_PAGES.length} static + ${blogEntries.length} blog)`
);