#!/usr/bin/env node
/**
 * IndexNow ping for dreamclerk.
 *
 * One submission pings Bing, Yandex, Naver, Seznam — and Bing feeds into
 * MSN, DuckDuckGo, Yahoo, Ecosia. ~2-15 min from submission to crawl.
 *
 * Usage:
 *   node app/scripts/indexnow-ping.cjs <url> [url2] [url3] ...
 *   node app/scripts/indexnow-ping.cjs --all
 *
 * Key is in app/public/indexnow-key.txt — read it dynamically so the
 * script doesn't have to be re-edited on key rotation.
 */

const fs = require("fs");
const path = require("path");
const https = require("https");

const HOST = "api.indexnow.org";
// Pull key from the public file we already serve at /indexnow-key.txt
const keyPath = path.join(__dirname, "..", "public", "indexnow-key.txt");
const KEY = fs.readFileSync(keyPath, "utf8").trim();

function ping(urls) {
  const body = JSON.stringify({
    host: "www.dreamclerk.com",
    key: KEY,
    keyLocation: "https://www.dreamclerk.com/indexnow-key.txt",
    urlList: urls,
  });

  const req = https.request(
    {
      host: HOST,
      path: "/IndexNow",
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Content-Length": Buffer.byteLength(body),
      },
    },
    (res) => {
      let data = "";
      res.on("data", (c) => (data += c));
      res.on("end", () => {
        console.log(`status: ${res.statusCode}`);
        console.log(`body:   ${data}`);
        if (res.statusCode === 200) {
          console.log(`✓ ${urls.length} URL(s) submitted to IndexNow (Bing/Yandex/Naver/Seznam)`);
        } else {
          console.log(`✗ IndexNow rejected the submission.`);
          process.exit(1);
        }
      });
    }
  );
  req.on("error", (e) => {
    console.error(`network error: ${e.message}`);
    process.exit(1);
  });
  req.write(body);
  req.end();
}

// --- CLI ---
if (process.argv.includes("--all")) {
  // Read the live sitemap to get the canonical list.
  const https2 = require("https");
  https2.get("https://www.dreamclerk.com/sitemap.xml", (res) => {
    let xml = "";
    res.on("data", (c) => (xml += c));
    res.on("end", () => {
      const urls = [...xml.matchAll(/<loc>(https:\/\/[^<]+)<\/loc>/g)].map((m) => m[1]);
      console.log(`submitting all ${urls.length} URLs from sitemap`);
      ping(urls);
    });
  });
} else {
  const urls = process.argv.slice(2).filter((a) => a.startsWith("https://"));
  if (urls.length === 0) {
    console.log("usage:");
    console.log("  node app/scripts/indexnow-ping.cjs <url1> [url2] ...");
    console.log("  node app/scripts/indexnow-ping.cjs --all");
    process.exit(1);
  }
  console.log(`submitting ${urls.length} URL(s):`);
  urls.forEach((u) => console.log(`  - ${u}`));
  ping(urls);
}
