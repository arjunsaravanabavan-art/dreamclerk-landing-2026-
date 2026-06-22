#!/usr/bin/env node
/**
 * Inject cross-links + outbound links into blog posts that lack them.
 *
 * One-shot seeder run by the SEO audit script. Mutates seedPosts.js in-place
 * to add:
 *   1. A "## related posts" block at the bottom of the body, linking to 2-3
 *      siblings in the same series (other /blog/* posts).
 *   2. For posts with zero outbound_links, a small outbound_links list with
 *      authoritative sources.
 *
 * Reads the current audit report (reports/blog-seo-audit.json) to know which
 * posts to skip (those with internal_links ≥2 OR outbound_links ≥1).
 *
 * Idempotent: bails if "## related posts" already in body.
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const APP_DIR = resolve(__dirname, "..");
const SEED_PATH = join(APP_DIR, "src", "lib", "seedPosts.js");
const REPORT_PATH = join(APP_DIR, "reports", "blog-seo-audit.json");

if (!existsSync(REPORT_PATH)) {
  console.error(`[inject] ${REPORT_PATH} missing — run audit-blog-seo.mjs first.`);
  process.exit(1);
}
const audit = JSON.parse(readFileSync(REPORT_PATH, "utf8"));

// Map slug -> related slugs. Series-aware so links go to siblings.
const SERIES = {
  "why-we-built-dreamclerk": ["inside-our-bias-audit", "coding-interview-with-no-experience"],
  "inside-our-bias-audit": ["why-we-built-dreamclerk", "coding-interview-with-no-experience"],
  "coding-interview-with-no-experience": ["why-we-built-dreamclerk", "in-browser-ide-explained", "shipping-code-vs-knowing-code"],
  "in-browser-ide-explained": ["shipping-code-vs-knowing-code", "building-the-in-browser-ide-a-postmortem"],
  "shipping-code-vs-knowing-code": ["in-browser-ide-explained", "why-we-built-dreamclerk"],
  "fresher-unemployment-india-2026-the-numbers-and-the-fix": ["the-2-year-experience-trap", "how-to-get-hired-as-a-fresher-with-no-internship-and-no-network", "the-resume-is-dead-three-signals"],
  "the-2-year-experience-trap": ["fresher-unemployment-india-2026-the-numbers-and-the-fix", "why-2-years-experience-required-is-a-tax", "the-resume-is-dead-three-signals"],
  "how-to-get-hired-as-a-fresher-with-no-internship-and-no-network": ["fresher-unemployment-india-2026-the-numbers-and-the-fix", "the-first-90-days-at-your-first-tech-job", "6-pip-signals-and-how-to-flip-4-in-30-days"],
  "why-2-years-experience-required-is-a-tax": ["the-2-year-experience-trap", "the-resume-is-dead-three-signals", "why-we-stopped-using-take-home-projects"],
  "the-resume-is-dead-three-signals": ["fresher-unemployment-india-2026-the-numbers-and-the-fix", "the-2-year-experience-trap", "the-first-90-days-at-your-first-tech-job"],
  "the-2026-pr-review-is-async-and-warm": ["the-dual-path-review-engine", "building-the-in-browser-ide-a-postmortem", "what-a-good-postmortem-looks-like"],
  "the-dual-path-review-engine": ["the-2026-pr-review-is-async-and-warm", "building-the-in-browser-ide-a-postmortem", "in-browser-ide-explained"],
  "the-intern-cheat-sheet-for-the-pushback-round": ["coding-interview-with-no-experience", "why-2-years-experience-required-is-a-tax", "the-resume-is-dead-three-signals"],
  "why-we-stopped-using-take-home-projects": ["the-intern-cheat-sheet-for-the-pushback-round", "why-2-years-experience-required-is-a-tax", "coding-interview-with-no-experience"],
  "the-cost-of-a-bad-junior-hire-is-not-the-onboarding": ["why-2-years-experience-required-is-a-tax", "the-first-90-days-at-your-first-tech-job", "6-pip-signals-and-how-to-flip-4-in-30-days"],
  "building-the-in-browser-ide-a-postmortem": ["in-browser-ide-explained", "the-2026-pr-review-is-async-and-warm", "the-dual-path-review-engine"],
  "india-it-services-the-fresher-pipeline-is-broken-and-it-is-not-the-colleges-fault": ["fresher-unemployment-india-2026-the-numbers-and-the-fix", "the-2-year-experience-trap", "off-campus-hiring-2026-the-7-channels-that-still-work"],
  "what-a-good-postmortem-looks-like": ["building-the-in-browser-ide-a-postmortem", "the-2026-pr-review-is-async-and-warm"],
  "the-first-90-days-at-your-first-tech-job": ["6-pip-signals-and-how-to-flip-4-in-30-days", "how-to-get-hired-as-a-fresher-with-no-internship-and-no-network", "the-resume-is-dead-three-signals"],
  "6-pip-signals-and-how-to-flip-4-in-30-days": ["the-first-90-days-at-your-first-tech-job", "the-resume-is-dead-three-signals", "off-campus-hiring-2026-the-7-channels-that-still-work"],
  "off-campus-hiring-2026-the-7-channels-that-still-work": ["fresher-unemployment-india-2026-the-numbers-and-the-fix", "how-to-get-hired-as-a-fresher-with-no-internship-and-no-network", "the-first-90-days-at-your-first-tech-job"],
};

// Authoritative outbound sources per topic slug. One per post keeps the fix minimal.
const OUTBOUND = {
  "why-we-built-dreamclerk": [
    { label: "the dreamclerk cohort 2 bias audit", href: "https://www.dreamclerk.com/blog/inside-our-bias-audit" },
    { label: "HBR — structured interviews (research)", href: "https://hbr.org/2016/04/structured-interviews-theyre-not-all-the-same" },
  ],
  "the-2026-pr-review-is-async-and-warm": [
    { label: "GitHub — code review guidelines", href: "https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/reviewing-changes-in-pull-requests/about-pull-request-reviews" },
    { label: "Google engineering practices — code review", href: "https://google.github.io/eng-practices/review/" },
    { label: "Phabricator — async review (Mozilla)", href: "https://mozillascience.github.io/codeReview/review-perf.html" },
  ],
  "the-dual-path-review-engine": [
    { label: "Anthropic — Claude Haiku model card", href: "https://docs.anthropic.com/en/docs/about-claude/models" },
    { label: "AWS — deterministic vs non-deterministic systems", href: "https://aws.amazon.com/blogs/architecture/architecting-for-resilience-in-the-cloud/" },
  ],
  "why-we-stopped-using-take-home-projects": [
    { label: "Triplebyte — why take-homes are broken", href: "https://triplebyte.com/blog/why-take-home-tests-are-bad-for-everyone" },
    { label: "GitLab — async interview handbook", href: "https://about.gitlab.com/handbook/hiring/interviewing/" },
  ],
  "the-cost-of-a-bad-junior-hire-is-not-the-onboarding": [
    { label: "HBR — the cost of a bad hire (research)", href: "https://hbr.org/2013/04/why-corporations-cant-spot-their-best-talent" },
    { label: "LinkedIn — talent insights benchmarks", href: "https://business.linkedin.com/talent-solutions" },
  ],
  "india-it-services-the-fresher-pipeline-is-broken-and-it-is-not-the-colleges-fault": [
    { label: "NASSCOM strategic review 2025", href: "https://nasscom.in/knowledge-center/publications" },
    { label: "TeamLease EdTech employment outlook", href: "https://www.teamleaseedtech.com/" },
    { label: "CMIE — unemployment time series", href: "https://www.cmie.com/" },
  ],
  "what-a-good-postmortem-looks-like": [
    { label: "Etsy — Debriefing culture (Deborah Kong)", href: "https://www.etsy.com/codeascraft/debriefing-culture" },
    { label: "Google SRE book — postmortem culture (free)", href: "https://sre.google/sre-book/postmortem-culture/" },
  ],
  "inside-our-bias-audit": [
    { label: "HBR — structured interviews research", href: "https://hbr.org/2016/04/structured-interviews-theyre-not-all-the-same" },
    { label: "Anthropic — fairness in ai review", href: "https://docs.anthropic.com/en/docs/build-with-claude/test-evaluate" },
  ],
  "in-browser-ide-explained": [
    { label: "StackBlitz — webcontainers architecture", href: "https://blog.stackblitz.com/posts/introducing-webcontainers/" },
    { label: "VS Code — monaco editor", href: "https://microsoft.github.io/monaco-editor/" },
  ],
  "shipping-code-vs-knowing-code": [
    { label: "Google — eng practices glossary", href: "https://google.github.io/eng-practices/" },
    { label: "GitHub — code review guide", href: "https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/reviewing-changes-in-pull-requests" },
  ],
};

// ── Process seedPosts.js line-by-line ───────────────────────────────
let src = readFileSync(SEED_PATH, "utf8");

let mutated = 0;
for (const f of audit) {
  // Skip posts that already have enough links
  if (f.internal_links >= 2 && f.outbound_links >= 1) continue;
  if (f.internal_links >= 2 && !OUTBOUND[f.slug]) continue;

  const relatedSlugs = SERIES[f.slug] || [];

  // Build the "## related posts" block
  if (f.internal_links < 2 && relatedSlugs.length) {
    const block =
      "\n\n## related posts\n\n" +
      relatedSlugs
        .slice(0, 3)
        .map((s) => `- [${s.replace(/-/g, " ")}](/blog/${s})`)
        .join("\n") +
      "\n";

    // Insert right before the trailing "`.trim()," of the body literal
    // For seedPosts.js the bodies end with `.trim(),`. We anchor on the slug
    // to be precise.
    const slugAnchor = `slug: "${f.slug}"`;
    const slugIdx = src.indexOf(slugAnchor);
    if (slugIdx === -1) {
      console.log(`[inject] ! ${f.slug} — slug anchor not found`);
      continue;
    }
    // Find the matching "`.trim()," after the slug
    const searchFrom = slugIdx;
    const trimIdx = src.indexOf("`.trim(),", searchFrom);
    if (trimIdx === -1) {
      console.log(`[inject] ! ${f.slug} — trim marker not found`);
      continue;
    }

    // Idempotent check: is "## related posts" already in the body? We
    // search inside the slice between the slug and the trim marker.
    const slice = src.slice(slugIdx, trimIdx);
    if (slice.includes("## related posts")) {
      console.log(`[inject] - ${f.slug} — already has related-posts block, skipping`);
    } else {
      src = src.slice(0, trimIdx) + block + src.slice(trimIdx);
      mutated += 1;
      console.log(`[inject] + ${f.slug} — added related-posts block (${relatedSlugs.length} links)`);
    }
  }

  // Outbound links: insert outbound_links array before the body: ` block.
  if (f.outbound_links === 0 && OUTBOUND[f.slug]) {
    const linksArr = OUTBOUND[f.slug];
    const arrStr = "    outbound_links: [\n" +
      linksArr.map((l) => `      { label: ${JSON.stringify(l.label)}, href: ${JSON.stringify(l.href)} },`).join("\n") + "\n    ],\n";
    const slugAnchor = `slug: "${f.slug}"`;
    const slugIdx = src.indexOf(slugAnchor);
    if (slugIdx === -1) continue;
    const searchFrom = slugIdx;
    // Find body: ` marker
    const bodyAnchor = src.indexOf("body: `", searchFrom);
    if (bodyAnchor === -1) continue;
    // Find the closing `,` of the previous property (faq / reading_time / etc.)
    // Easiest: insert right before "body: `"
    const slice = src.slice(slugIdx, bodyAnchor);
    if (slice.includes("outbound_links:")) {
      console.log(`[inject] - ${f.slug} — already has outbound_links`);
    } else {
      src = src.slice(0, bodyAnchor) + arrStr + "    " + src.slice(bodyAnchor);
      mutated += 1;
      console.log(`[inject] + ${f.slug} — added ${linksArr.length} outbound_links`);
    }
  }
}

writeFileSync(SEED_PATH, src, "utf8");
console.log(`[inject] done — ${mutated} mutations written.`);