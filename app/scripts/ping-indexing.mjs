#!/usr/bin/env node
/**
 * Ping Google, Bing, and IndexNow after every successful build.
 *
 * Why: GSC and Bing Webmaster keep a sitemap TTL of 6-24 hours. Without a
 * ping they won't re-fetch the sitemap until then. Pinging triggers a
 * re-fetch within ~5 minutes, so new posts ship to the index the same day.
 *
 * IndexNow: free, no API key, one POST notifies every IndexNow participant
 *   (Bing, Yandex, DuckDuckGo, Seznam, Naver). DreamClerk's key is in
 *   public/indexnow-key.txt — generated once, registered by including it
 *   as a sitemap or hosting at the root.
 *
 * Bing: free, no API key, GET/POST to /ping?sitemap=<url>. Returns 200.
 *
 * Google: now deprecated sitemap ping endpoint. IndexNow covers most
 *   non-Google engines. For Google, the canonical path is GSC's sitemap
 *   UI — there is no public API. We rely on the sitemap being listed
 *   once and Googlebot fetching it.
 *
 * Required env (loaded lazily — does NOT fail build if missing):
 *   INDEXNOW_KEY: the key file content (matches public/indexnow-key.txt)
 *
 * If a network call fails we log it and exit 0 — never break the build.
 */

import { readFileSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const APP_DIR = resolve(__dirname, "..");
const DIST_DIR = join(APP_DIR, "dist");

const SITE = "https://www.dreamclerk.com";
const SITEMAP_URL = `${SITE}/sitemap.xml`;

// Read IndexNow key from either env or the public file (one source of truth)
let INDEXNOW_KEY = process.env.INDEXNOW_KEY;
if (!INDEXNOW_KEY) {
  const keyPath = join(APP_DIR, "public", "indexnow-key.txt");
  if (existsSync(keyPath)) {
    INDEXNOW_KEY = readFileSync(keyPath, "utf8").trim();
  }
}

const log = (m) => console.log(`[ping] ${m}`);
const fail = (m) => console.log(`[ping] ${m} (non-fatal)`);

// Don't fire if sitemap wasn't built
if (!existsSync(SITEMAP_URL.replace(SITE, DIST_DIR))) {
  fail(`sitemap not found at dist/sitemap.xml — skipping ping`);
  process.exit(0);
}

// ── IndexNow ────────────────────────────────────────────────────────────
// POST https://api.indexnow.org/indexnow
// Body: { host, key, keyLocation, urlList: [..] }
// Reads URLs from dist/sitemap.xml to keep this a no-config script.

async function pingIndexNow() {
  if (!INDEXNOW_KEY) {
    fail(`no INDEXNOW_KEY — skipping IndexNow. Run: openssl rand -hex 32 > public/indexnow-key.txt`);
    return;
  }
  const host = new URL(SITE).host;
  const keyLocation = `${SITE}/${INDEXNOW_KEY}.txt`;
  const sitemap = readFileSync(join(DIST_DIR, "sitemap.xml"), "utf8");
  const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

  const body = JSON.stringify({
    host,
    key: INDEXNOW_KEY,
    keyLocation,
    urlList: urls,
  });

  try {
    const res = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body,
    });
    if (res.ok || res.status === 200 || res.status === 202) {
      log(`IndexNow ✓ ${urls.length} URLs submitted (status ${res.status})`);
    } else {
      fail(`IndexNow returned ${res.status}: ${await res.text().catch(() => "")}`);
    }
  } catch (e) {
    fail(`IndexNow fetch failed: ${e.message}`);
  }
}

// ── Bing ─────────────────────────────────────────────────────────────────
// Still useful for the small subset of engines IndexNow doesn't cover
// (and for the crawl signal — every request counts). Plain GET.

async function pingBing() {
  const url = `https://www.bing.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`;
  try {
    const res = await fetch(url);
    if (res.ok) log(`Bing ✓ pinged (status ${res.status})`);
    else fail(`Bing returned ${res.status}`);
  } catch (e) {
    fail(`Bing fetch failed: ${e.message}`);
  }
}

// ── Run ──────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const skip = args.includes("--skip-ping");
if (skip) {
  log(`--skip-ping set, not pinging.`);
  process.exit(0);
}

await Promise.all([pingIndexNow(), pingBing()]);
log(`done.`);