#!/usr/bin/env node
//
// Generate the production sitemap from public routes and the live published-posts table.
// Production must have the public Supabase anon key so the sitemap cannot silently
// drift behind the content database. Preview/local builds may use bundled seed posts.

import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const APP_ROOT = join(__dirname, "..");
const SITE = "https://www.dreamclerk.com";
const SUPABASE_URL =
  process.env.VITE_SUPABASE_URL || "https://hmeglzxbxbqetgydkynl.supabase.co";
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

const STATIC_PAGES = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/how", changefreq: "monthly", priority: "0.9" },
  { path: "/workspace", changefreq: "monthly", priority: "0.9" },
  { path: "/tracks", changefreq: "monthly", priority: "0.9" },
  { path: "/companies", changefreq: "monthly", priority: "0.9" },
  { path: "/faq", changefreq: "monthly", priority: "0.9" },
  { path: "/about", changefreq: "monthly", priority: "0.7" },
  { path: "/blog", changefreq: "weekly", priority: "0.8" },
  { path: "/verify", changefreq: "monthly", priority: "0.6" },
  { path: "/feedback", changefreq: "monthly", priority: "0.6" },
  { path: "/contact", changefreq: "yearly", priority: "0.5" },
  { path: "/privacy", changefreq: "yearly", priority: "0.5" },
  { path: "/terms", changefreq: "yearly", priority: "0.5" },
];

function validSlug(value) {
  return typeof value === "string" &&
    value.trim().length > 0 &&
    value.length <= 200 &&
    !value.includes("/") &&
    !value.includes("\\");
}

function xmlEscape(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

async function getPublishedPosts() {
  if (!SUPABASE_ANON_KEY) {
    if (process.env.VERCEL_ENV === "production") {
      throw new Error(
        "VITE_SUPABASE_ANON_KEY is required for the production sitemap to include every live published post.",
      );
    }
    console.warn("VITE_SUPABASE_ANON_KEY missing; using bundled seed posts for this non-production build.");
    const { SEED_POSTS } = await import("../src/lib/seedPosts.js");
    return SEED_POSTS.filter((post) => post.published !== false && validSlug(post.slug));
  }

  const posts = [];
  const pageSize = 1000;
  for (let offset = 0; ; offset += pageSize) {
    const url = new URL("/rest/v1/posts", SUPABASE_URL);
    url.searchParams.set("select", "slug,published_at,updated_at,created_at");
    url.searchParams.set("published", "eq.true");
    url.searchParams.set("order", "published_at.desc.nullslast");
    url.searchParams.set("limit", String(pageSize));
    url.searchParams.set("offset", String(offset));

    const response = await fetch(url, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        Accept: "application/json",
      },
      signal: AbortSignal.timeout(15000),
    });
    if (!response.ok) {
      const detail = (await response.text()).slice(0, 500);
      throw new Error(`Unable to fetch published posts for sitemap (${response.status}): ${detail}`);
    }

    const batch = await response.json();
    if (!Array.isArray(batch)) throw new Error("Supabase sitemap query returned an unexpected response.");
    posts.push(...batch.filter((post) => validSlug(post.slug)));
    if (batch.length < pageSize) break;
  }

  const unique = new Map();
  for (const post of posts) {
    if (!unique.has(post.slug)) unique.set(post.slug, post);
  }
  return [...unique.values()];
}

const posts = await getPublishedPosts();
const blogEntries = posts.map((post) => {
  const lastmod = post.updated_at || post.published_at || post.created_at;
  return {
    path: `/blog/${encodeURIComponent(post.slug)}`,
    ...(lastmod && !Number.isNaN(Date.parse(lastmod))
      ? { lastmod: new Date(lastmod).toISOString().slice(0, 10) }
      : {}),
    changefreq: "monthly",
    priority: "0.7",
  };
});

const entries = [...STATIC_PAGES, ...blogEntries];
const seen = new Set();
const uniqueEntries = entries.filter((entry) => {
  if (seen.has(entry.path)) return false;
  seen.add(entry.path);
  return true;
});

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...uniqueEntries.map((entry) => [
    "  <url>",
    `    <loc>${xmlEscape(new URL(entry.path, SITE).toString())}</loc>`,
    ...(entry.lastmod ? [`    <lastmod>${entry.lastmod}</lastmod>`] : []),
    `    <changefreq>${entry.changefreq}</changefreq>`,
    `    <priority>${entry.priority}</priority>`,
    "  </url>",
  ].join("\n")),
  "</urlset>",
  "",
].join("\n");

const out = join(APP_ROOT, "public", "sitemap.xml");
writeFileSync(out, xml, "utf8");
console.log(`sitemap.xml: wrote ${uniqueEntries.length} unique URLs (${STATIC_PAGES.length} static + ${blogEntries.length} published blog posts)`);
