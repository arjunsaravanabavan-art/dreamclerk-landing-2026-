#!/usr/bin/env node
/**
 * GSC batch indexing helper.
 *
 * Google has no public API for the "Request Indexing" button. The fastest
 * path to a re-crawl is to paste each URL into the GSC URL Inspection bar
 * and click "Request Indexing" (limits: ~12 per day, 1 URL at a time).
 *
 * This script:
 *   1. Reads the freshly-built sitemap.xml
 *   2. Splits URLs into "submit today" (top 12 by priority) and "tomorrow"
 *   3. Prints them in the exact format GSC wants, with a clickable chrome
 *      of the URL + click instructions
 *
 * Usage:
 *   node scripts/gsc-batch-index.mjs
 *   node scripts/gsc-batch-index.mjs --day 1   (show first 12)
 *   node scripts/gsc-batch-index.mjs --day 2   (show next 12)
 */

import { readFileSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const APP_DIR = resolve(__dirname, "..");
const SITEMAP_PATH = join(APP_DIR, "dist", "sitemap.xml");

if (!existsSync(SITEMAP_PATH)) {
  console.error(`[gsc] ${SITEMAP_PATH} missing — run \`npm run build\` first.`);
  process.exit(1);
}

const sitemap = readFileSync(SITEMAP_PATH, "utf8");
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

// Priority order: home > main routes > blog posts (most recent first)
const PRIORITY = [
  "/", "/how", "/workspace", "/tracks", "/companies", "/faq", "/blog",
  "/about", "/founder", "/contact", "/privacy", "/terms",
];
const ranked = locs.sort((a, b) => {
  const pa = PRIORITY.indexOf(a.replace("https://www.dreamclerk.com", "")) ;
  const pb = PRIORITY.indexOf(b.replace("https://www.dreamclerk.com", ""));
  if (pa !== -1 && pb !== -1) return pa - pb;
  if (pa !== -1) return -1;
  if (pb !== -1) return 1;
  // blog posts: most recent first (we'll trust the lastmod order in sitemap)
  return 0;
});

const dayArg = (process.argv.find((a) => a.startsWith("--day")) || "--day 1")
  .split(" ")[1];
const day = parseInt(dayArg, 10) || 1;
const start = (day - 1) * 12;
const today = ranked.slice(start, start + 12);
const tomorrow = ranked.slice(start + 12, start + 24);

if (!today.length) {
  console.log(`[gsc] day ${day}: no more URLs to submit.`);
  process.exit(0);
}

console.log(`\n  GSC batch indexing — day ${day} of ${Math.ceil(ranked.length / 12)}`);
console.log(`  ───────────────────────────────────────────────────`);
console.log(`  ${today.length} URLs to submit today (Google allows ~12/day).\n`);

console.log(`  STEP-BY-STEP (for each URL below):\n`);
console.log(`     1. Open  https://search.google.com/search-console`);
console.log(`     2. Use the property selector (top-left): pick "https://www.dreamclerk.com/"`);
console.log(`     3. In the TOP BAR (URL Inspection) — see screenshot at:`);
console.log(`        search.google.com/search-console/inspect?resource_id=...`);
console.log(`     4. Paste the URL  →  press Enter`);
console.log(`     5. Click the [REQUEST INDEXING] button (green button on the result page)`);
console.log(`     6. Wait 1-2 minutes for "Indexing requested"`);
console.log(`     7. Move to the next URL\n`);

console.log(`  ─── TODAY (day ${day}) — submit these 12 URLs ───\n`);
today.forEach((u, i) => {
  const short = u.replace("https://www.dreamclerk.com", "") || "/";
  console.log(`     ${String(i + 1).padStart(2, " ")}.  ${u}`);
  console.log(`         path: ${short}`);
});
console.log("");

if (tomorrow.length) {
  console.log(`  ─── TOMORROW (day ${day + 1}) — run again with --day ${day + 1} ───\n`);
  tomorrow.forEach((u, i) => {
    const short = u.replace("https://www.dreamclerk.com", "") || "/";
    console.log(`     ${String(i + 1).padStart(2, " ")}.  ${u}`);
  });
  console.log(`\n  →  node scripts/gsc-batch-index.mjs --day ${day + 1}\n`);
}

console.log(`  ────────────────────────────────────────────────────────`);
console.log(`  TOTAL URLs: ${ranked.length} | Done so far: ${start} | Remaining: ${ranked.length - start}`);
console.log(`  Estimated full re-crawl: ${Math.ceil(ranked.length / 12)} days of manual submission.`);
console.log(`  After day 1, snippets in Google SERP will start updating within 24-48 hours.\n`);