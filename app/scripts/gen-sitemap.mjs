#!/usr/bin/env node
//
// Generate the landing site's sitemap from stable public marketing routes.
// Blog posts live in the separate DreamClerk Blog app and are listed by
// its live sitemap at /blog/sitemap.xml. Do not duplicate a stale seed list here.

import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const APP_ROOT = join(__dirname, "..");
const SITE = "https://www.dreamclerk.com";

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

function xmlEscape(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...STATIC_PAGES.map((entry) => [
    "  <url>",
    "    <loc>" + xmlEscape(new URL(entry.path, SITE).toString()) + "</loc>",
    "    <changefreq>" + entry.changefreq + "</changefreq>",
    "    <priority>" + entry.priority + "</priority>",
    "  </url>",
  ].join("\n")),
  "</urlset>",
  "",
].join("\n");

const out = join(APP_ROOT, "public", "sitemap.xml");
writeFileSync(out, xml, "utf8");
console.log("sitemap.xml: wrote " + STATIC_PAGES.length + " stable landing URLs; published articles are listed at /blog/sitemap.xml");
