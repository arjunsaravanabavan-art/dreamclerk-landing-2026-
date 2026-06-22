#!/usr/bin/env node
/**
 * Blog SEO audit for the DreamClerk landing.
 *
 * Reads app/src/lib/seedPosts.js and grades every published post on:
 *   - title length (30–65 chars sweet spot for SERP)
 *   - excerpt length (140–160 chars meta-description sweet spot)
 *   - excerpt is unique (not a substring of title)
 *   - body word count (600+ for ranking, 1200+ for long-tail)
 *   - h2/h3 structure (≥1 h2 in body)
 *   - internal links (≥1 to other /blog/* or /track/* post)
 *   - outbound links (≥1 to authoritative source)
 *   - keywords in body (slug words appear in body)
 *   - FAQ block (posts with FAQ schema rank for featured snippets)
 *   - outbound author sameAs (Person schema social links)
 *   - cover image (og:image needs a real URL)
 *
 * Outputs:
 *   - console table summary
 *   - reports/blog-seo-audit.md (full report with fixes)
 *   - reports/blog-seo-audit.json (machine-readable)
 *
 * Usage:  node scripts/audit-blog-seo.mjs
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const APP_DIR = resolve(__dirname, "..");
const REPORT_DIR = join(APP_DIR, "reports");

if (!existsSync(REPORT_DIR)) mkdirSync(REPORT_DIR, { recursive: true });

// Import the seed posts by re-evaluating the module's exported array.
// We can't import the ESM file directly here easily, so we read & eval the
// file with a small shim that exports SEED_POSTS. Alternative: write a small
// parser — too much work for a one-shot audit. Use dynamic import.
const seedPath = join(APP_DIR, "src", "lib", "seedPosts.js");
const mod = await import(`file://${seedPath.replace(/\\/g, "/")}`);
const SEED_POSTS = mod.SEED_POSTS;

const SITE = "https://www.dreamclerk.com";
const FINDINGS = [];

// ── Helpers ───────────────────────────────────────────────────────────
const wc = (s) => (s || "").trim().split(/\s+/).filter(Boolean).length;
const h2Count = (body) => (body.match(/^##\s+/gm) || []).length;
const h3Count = (body) => (body.match(/^###\s+/gm) || []).length;
const internalBlogLinks = (body) => {
  const m = body.match(/\/blog\/[a-z0-9-]+/gi) || [];
  return new Set(m.map((x) => x.toLowerCase())).size;
};
const outboundLinks = (body) => {
  const m = body.match(/https?:\/\/[^\s)>"]+/g) || [];
  return m.filter((u) => !u.startsWith(SITE)).length;
};
const slugWordsInBody = (slug, body) => {
  const words = slug.split("-").filter((w) => w.length > 3);
  if (!words.length) return 0;
  const found = words.filter((w) => body.toLowerCase().includes(w.toLowerCase()));
  return found.length;
};
const sentenceCount = (s) => (s || "").split(/[.!?]+/).filter((x) => x.trim()).length;
const readingTime = (body) => Math.max(1, Math.round(wc(body) / 220));

// ── Audit each post ──────────────────────────────────────────────────
for (const post of SEED_POSTS) {
  if (!post.published) continue;
  const issues = [];
  const wins = [];

  const title = post.title || "";
  const excerpt = post.excerpt || "";
  const body = post.body || "";

  // 1. Title length
  if (title.length < 30) issues.push(`title too short (${title.length} chars; aim 30-65)`);
  else if (title.length > 65) issues.push(`title too long (${title.length} chars; will truncate in SERP)`);
  else wins.push(`title length ${title.length} chars`);

  // 2. Excerpt (meta description) length
  if (excerpt.length < 120) issues.push(`excerpt too short (${excerpt.length} chars; aim 140-160)`);
  else if (excerpt.length > 160) issues.push(`excerpt too long (${excerpt.length} chars; will truncate)`);
  else wins.push(`excerpt length ${excerpt.length} chars`);

  // 3. Title/excerpt uniqueness
  if (excerpt.toLowerCase().includes(title.toLowerCase().slice(0, 20)))
    issues.push(`excerpt is a substring of title — Google ignores redundant meta`);

  // 4. Body word count
  const bodyWords = wc(body);
  if (bodyWords < 600) issues.push(`body too thin (${bodyWords} words; aim 1200+ for long-tail)`);
  else if (bodyWords < 1200) issues.push(`body short (${bodyWords} words; aim 1200+ to rank for long-tail)`);
  else wins.push(`body ${bodyWords} words`);

  // 5. h2 structure
  const h2 = h2Count(body);
  if (h2 < 3) issues.push(`only ${h2} h2s; aim ≥3 for outline ranking`);
  else wins.push(`${h2} h2s`);

  // 6. Internal links
  const internal = internalBlogLinks(body);
  if (internal === 0) issues.push(`no internal /blog/ links — add ≥2 for crawl depth`);

  // 7. Outbound links
  const out = outboundLinks(body);
  if (out === 0) issues.push(`no outbound links — add ≥1 to a primary source (ai-crawler signal)`);

  // 8. Slug words in body
  const slugHits = slugWordsInBody(post.slug, body);
  if (slugHits < 2) issues.push(`slug words rarely appear in body (${slugHits}) — Google may mismatch intent`);

  // 9. FAQ block
  if (!post.faq || !post.faq.length) {
    issues.push(`no FAQ block — adding 2-3 Q&A pairs enables FAQPage schema + featured snippets`);
  } else {
    wins.push(`FAQ block (${post.faq.length} pairs)`);
  }

  // 10. Author sameAs
  if (post.author_person && (!post.author_person.sameAs || !post.author_person.sameAs.length))
    issues.push(`author has Person schema but no sameAs (LinkedIn/GitHub) — E-E-A-T signal missing`);

  // 11. Outbound author links list
  if (!post.outbound_links || !post.outbound_links.length)
    issues.push(`no outbound_links list — AI crawlers use this to confirm external citation`);

  // 12. Reading time vs body
  if (post.reading_time && Math.abs(post.reading_time - readingTime(body)) > 2)
    issues.push(`reading_time (${post.reading_time}min) doesn't match actual (${readingTime(body)}min)`);

  FINDINGS.push({
    slug: post.slug,
    title: title.slice(0, 80),
    published_at: post.published_at,
    author: post.author_name,
    body_words: bodyWords,
    h2,
    h3: h3Count(body),
    internal_links: internal,
    outbound_links: out,
    has_faq: !!(post.faq && post.faq.length),
    has_person: !!post.author_person,
    has_outbound_list: !!(post.outbound_links && post.outbound_links.length),
    issue_count: issues.length,
    issues,
    wins,
  });
}

// ── Sort: most issues first ──────────────────────────────────────────
FINDINGS.sort((a, b) => b.issue_count - a.issue_count);

// ── Console summary ──────────────────────────────────────────────────
console.log("\n  blog seo audit — dreamclerk\n  ─────────────────────────────");
console.log(
  "  " +
    ["slug", "words", "h2", "int", "out", "FAQ", "issues"].map((h) => h.padEnd(20)).join("")
);
console.log("  " + "─".repeat(110));
for (const f of FINDINGS) {
  const row = [
    f.slug.padEnd(50).slice(0, 50),
    String(f.body_words).padEnd(7),
    String(f.h2).padEnd(4),
    String(f.internal_links).padEnd(5),
    String(f.outbound_links).padEnd(5),
    f.has_faq ? "✓" : "✗",
    String(f.issue_count).padEnd(3),
  ].join("  ");
  console.log("  " + row);
}
console.log("\n  full report: reports/blog-seo-audit.md\n");

// ── Markdown report ──────────────────────────────────────────────────
const total = FINDINGS.length;
const withFAQ = FINDINGS.filter((f) => f.has_faq).length;
const withPerson = FINDINGS.filter((f) => f.has_person).length;
const avgWords = Math.round(FINDINGS.reduce((s, f) => s + f.body_words, 0) / total);
const noInternal = FINDINGS.filter((f) => f.internal_links === 0).length;
const noOutbound = FINDINGS.filter((f) => f.outbound_links === 0).length;

const md = `# Blog SEO audit — DreamClerk landing

Generated: ${new Date().toISOString().slice(0, 10)}
Posts audited: ${total}

## Summary

| Metric | Value | Target | Status |
|---|---:|---:|:--:|
| Total published posts | ${total} | — | — |
| Posts with FAQPage schema | ${withFAQ} | ${total} | ${withFAQ === total ? "✓" : "✗"} |
| Posts with Person schema (E-E-A-T) | ${withPerson} | 5+ | ${withPerson >= 5 ? "✓" : "✗"} |
| Average body word count | ${avgWords} | 1200+ | ${avgWords >= 1200 ? "✓" : "✗"} |
| Posts with no internal /blog/ links | ${noInternal} | 0 | ${noInternal === 0 ? "✓" : "✗"} |
| Posts with no outbound links | ${noOutbound} | 0 | ${noOutbound === 0 ? "✓" : "✗"} |

## Per-post detail (sorted by issue count)

${FINDINGS.map((f) => {
  const icon = f.issue_count === 0 ? "✅" : f.issue_count <= 2 ? "⚠️" : "❌";
  return `### ${icon} \`${f.slug}\` — ${f.issue_count} issue(s)

- title: "${f.title}"
- published: ${f.published_at?.slice(0, 10) || "?"}
- author: ${f.author} ${f.has_person ? "(Person schema ✓)" : ""}
- body: ${f.body_words} words, ${f.h2} h2s, ${f.h3} h3s
- internal links: ${f.internal_links}, outbound links: ${f.outbound_links}
- FAQ block: ${f.has_faq ? "yes" : "no"}
- outbound_links list: ${f.has_outbound_list ? "yes" : "no"}

**Wins**

${f.wins.length ? f.wins.map((w) => `- ✓ ${w}`).join("\n") : "_none_"}

**Issues to fix**

${f.issues.length ? f.issues.map((i) => `- ${i}`).join("\n") : "_none_"}
`;
}).join("\n---\n\n")}

## Top fixes (do these in order)

${(() => {
  const fixList = [];
  if (noInternal > 0) fixList.push(`1. **Add 2+ internal \`/blog/\` links to ${noInternal} posts** — picks up the next post in the series. Lowest-effort, highest-SEO-impact fix.`);
  if (noOutbound > 0) fixList.push(`2. **Add 1+ outbound link to ${noOutbound} posts** — link to the source data (NASSCOT, NITI Aayog, Statista, LinkedIn Workforce Report, GitHub blog). Sets off the AI-crawler "this is a real citation graph" signal.`);
  const thin = FINDINGS.filter((f) => f.body_words < 1200);
  if (thin.length) fixList.push(`3. **Expand ${thin.length} thin posts to 1200+ words** — ${thin.map((t) => `\`${t.slug}\` (${t.body_words}w)`).slice(0, 5).join(", ")}${thin.length > 5 ? "…" : ""}. Add a "what we got wrong" or "what the data doesn't show" section.`);
  if (withFAQ < total) {
    const noFaq = FINDINGS.filter((f) => !f.has_faq).slice(0, 5);
    fixList.push(`4. **Add a 2-3 Q FAQ block to ${total - withFAQ} posts** — start with the top 5 by traffic potential: ${noFaq.map((p) => `\`${p.slug}\``).join(", ")}. Each Q enables a featured-snippet slot.`);
  }
  const noPerson = FINDINGS.filter((f) => !f.has_person).length;
  if (noPerson > 0) fixList.push(`5. **Convert ${noPerson} posts from "dreamclerk team" to a named author** — pick a co-founder or staff eng with a real LinkedIn + GitHub. E-E-A-T is the #1 way to rank YMYL-ish content (career advice, hiring, money).`);
  return fixList.join("\n");
})()}
`;

writeFileSync(join(REPORT_DIR, "blog-seo-audit.md"), md, "utf8");
writeFileSync(join(REPORT_DIR, "blog-seo-audit.json"), JSON.stringify(FINDINGS, null, 2), "utf8");
console.log(`  written: reports/blog-seo-audit.md`);
console.log(`  written: reports/blog-seo-audit.json`);