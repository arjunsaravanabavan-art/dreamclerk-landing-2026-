#!/usr/bin/env node
/**
 * Prerender static HTML for every public route.
 *
 * Why: the site is a Vite SPA and Vercel's `/(.*) → /index.html` rewrite
 * serves the same shell HTML for every URL. Googlebot sees the same
 * <title>, <meta>, <link rel="canonical"> for /blog/post-x and /blog/post-y,
 * flags the sitemap as "appears to be HTML", and de-dupes every route to
 * the homepage. The IIFE in dist/index.html does swap SEO tags client-side,
 * but Googlebot's first read is the static HTML, and a non-JS crawler
 * (many AI crawlers, social-card unfurlers, RSS readers) never sees the
 * swap at all.
 *
 * What this does: for each path in the buildData() map (mirrored from
 * src/lib/seoRoutes.js), writes dist/<path>/index.html with the per-route
 * <title>, <meta>, <link rel="canonical">, og:*, twitter:*, and JSON-LD
 * already baked in. The SPA bundle still loads + hydrates for the React
 * view, but crawlers see the right content on the very first byte.
 *
 * Must run AFTER `vite build` — it reads dist/index.html and writes
 * dist/<route>/index.html siblings. Vercel's static-file lookup beats
 * the catch-all rewrite, so each route is served as its own HTML.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const APP_DIR = resolve(__dirname, "..");
const DIST_DIR = join(APP_DIR, "dist");
const INDEX_HTML = join(DIST_DIR, "index.html");

const SITE = "https://www.dreamclerk.com";

const esc = (s) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

// ── SEO data, mirrored from src/lib/seoRoutes.js + vite.seoPlugin.js ─────
// Keep in sync. The IIFE in index.html also reads this, so if you change
// it here, change it there. (One source of truth would be a refactor
// that imports the same module from the plugin and the prerender — kept
// separate for now to avoid a build-time circular import.)

const blogPosting = (p) => {
  const authorSchema = p.author_person
    ? {
        "@type": "Person",
        name: p.author_person.name,
        url: p.author_person.sameAs && p.author_person.sameAs[0],
        sameAs: p.author_person.sameAs,
        jobTitle: p.author_person.role,
        description: p.author_person.bio,
      }
    : { "@type": "Organization", name: p.author };
  return {
    path: p.path,
    title: p.title,
    description: p.description,
    keywords: p.keywords,
    author: p.author,
    published_at: p.published_at,
    updated_at: p.updated_at,
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: p.title,
        description: p.description,
        author: authorSchema,
        publisher: {
          "@type": "Organization",
          name: "dreamclerk",
          logo: { "@type": "ImageObject", url: SITE + "/publisher-logo.png" },
        },
        datePublished: p.published_at,
        dateModified: p.updated_at || p.published_at,
        mainEntityOfPage: { "@type": "WebPage", "@id": SITE + p.path },
        image: SITE + "/og.png",
        keywords: p.keywords,
        articleSection: "engineering hiring",
        inLanguage: "en-IN",
        isAccessibleForFree: true,
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "home", item: SITE + "/" },
          { "@type": "ListItem", position: 2, name: "blog", item: SITE + "/blog" },
          { "@type": "ListItem", position: 3, name: p.title, item: SITE + p.path },
        ],
      },
    ],
  };
};

const ROUTES = {
  "/": {
    path: "/",
    title: "dreamclerk — a real job in your browser",
    description: "a real job in your browser. apply, get hired by an ai recruiter, ship code in a real in-browser ide, get reviewed, and leave with a verified work record. free during beta.",
    keywords: "career simulation platform, in-browser ide, online code editor, monaco editor, ai code reviewer, verified work certificate, ai recruiter, virtual internship, undergraduate internship, software engineering internship, frontend engineering track, backend engineering track, ai ml engineering, data science track, full stack engineering, ship code get hired, no more unemployment, hireable after college, fresher hiring, coding interview prep, sprint based learning, ai mentor, pr review simulation, capstone project, tech internship without degree, work record certificate, dreamclerk",
  },
  "/how": { path: "/how", title: "how it works — 8 steps, real prs, signed certificate", description: "the 8-step protocol: apply, interview, offer, onboard, 5 sprints of prs, capstone, review round, signed certificate.", keywords: "dreamclerk how it works, 8 week protocol, capstone, sprint based learning, pr review, internship timeline, indian undergraduate internship" },
  "/workspace": { path: "/workspace", title: "workspace — in-browser ide, terminal, docker, sql, jupyter", description: "8 tracks · 24 gigs · monaco editor, sandboxed terminal, kubernetes, figma, tally ledger, tds challans, jupyter. the full in-browser work surface.", keywords: "in-browser ide, monaco editor, sandboxed terminal, kubernetes playground, figma canvas, tally ledger, gstr-1, dbt, airflow, ai ml notebook, dreamclerk workspace" },
  "/tracks": { path: "/tracks", title: "tracks — frontend, backend, ai/ml, data, platform, security", description: "6 tracks: frontend, ai/ml, backend, data, platform/sre, security. each has an 8-sprint plan, capstone, hiring partner. ship to production.", keywords: "engineering tracks, frontend track, backend track, ai ml track, data engineering, platform sre, application security, internship tracks india, dreamclerk tracks" },
  "/companies": { path: "/companies", title: "companies — 6 simulated employers, real codebases", description: "6 simulated companies: fintech, b2b saas, ai infra, consumer ai, data warehouse, appsec. real bugs, real tech leads, real ticket queues.", keywords: "simulated companies, internship employers, fintech, b2b saas, ai infra, consumer ai, warehouse observability, appsec, dreamclerk companies" },
  "/faq": { path: "/faq", title: "faq — 19 questions, no click-to-open", description: "19 questions about dreamclerk — basics, hiring, the ai recruiter, logistics. visible on load. rubric + bias audit linked.", keywords: "dreamclerk faq, is it free, is it a real internship, what does the certificate show, hiring partners, interview rubric" },
  "/blog": { path: "/blog", title: "blog — field notes from building dreamclerk", description: "field notes from building dreamclerk. the data, the rejects, the rubric changes. cohort 1, cohort 2, and the rubric that came out.", keywords: "dreamclerk blog, hiring data, cohort outcomes, bias audit, internship certificate, coding interview, in-browser ide" },
  "/about": { path: "/about", title: "about — the team behind dreamclerk", description: "founded in chennai in 2025 by ananya, raghav, and priya. bootstrapped. the team page, the advisors, the press, and the funding story.", keywords: "dreamclerk team, dreamclerk founders, dreamclerk about, chennai startup, indian startup, career simulation founders" },
  "/privacy": { path: "/privacy", title: "privacy — what we collect, what we don't", description: "we collect email + sprint data. we don't sell, we don't share without permission, we don't keep a payment record after cohort. plain english.", keywords: "dreamclerk privacy, gdpr, indian data protection, career simulation data" },
  "/terms": { path: "/terms", title: "terms — what you agree to when you sign up", description: "terms of use for dreamclerk. written in plain english, governed by the laws of india, reviewed every quarter. if we change them, we email you.", keywords: "dreamclerk terms, terms of service, indian contract law, dpdpa" },
  "/blog/why-we-built-dreamclerk": blogPosting({ path: "/blog/why-we-built-dreamclerk", title: "the 90-second internship interview that changed 14% of outcomes", description: "we ran a 90-second phone screen on 1,200 internship applicants. 14% got a callback. what we changed, and what we got wrong.", keywords: "interview prep, coding interview, 90 second interview, internship callback, dreamclerk founder notes, indian undergraduate hiring", author: "dreamclerk team", published_at: "2026-04-12T09:00:00.000Z", updated_at: "2026-05-04T09:00:00.000Z" }),
  "/blog/inside-our-bias-audit": blogPosting({ path: "/blog/inside-our-bias-audit", title: "inside our bias audit — rubric, data, changes", description: "every quarter we run a bias audit on the dreamclerk interview. the rubric, the per-group pass-rates, the three changes we made after cohort 1.", keywords: "bias audit, hiring rubric, ai interview fairness, dreamclerk audit, gender gap, college tier, cohort 1 cohort 2", author: "dreamclerk team", published_at: "2026-05-04T09:00:00.000Z", updated_at: "2026-06-10T09:00:00.000Z" }),
  "/blog/coding-interview-with-no-experience": blogPosting({ path: "/blog/coding-interview-with-no-experience", title: "how to pass a coding interview with no experience", description: "no internships. no github. no leetcode streak. the 4-step protocol we built to prep dreamclerk applicants in 6 weeks.", keywords: "coding interview, no experience, fresher interview, internship prep, dreamclerk protocol, indian undergraduate coding, github no experience", author: "dreamclerk team", published_at: "2026-05-04T09:00:00.000Z", updated_at: "2026-05-04T09:00:00.000Z" }),
  "/blog/in-browser-ide-explained": blogPosting({ path: "/blog/in-browser-ide-explained", title: "the in-browser ide — what it actually runs", description: "monaco on top of a webcontainer. 200ms cold start. 12mb of wasm. the architecture, the security model, the 3 limits.", keywords: "in-browser ide, monaco editor, webcontainer, wasm ide, dreamclerk ide, browser ide security, sandboxed terminal", author: "dreamclerk team", published_at: "2026-06-10T09:00:00.000Z", updated_at: "2026-06-10T09:00:00.000Z" }),
  "/blog/shipping-code-vs-knowing-code": blogPosting({ path: "/blog/shipping-code-vs-knowing-code", title: "shipping code vs knowing code — 5-min glossary", description: "the 14 terms every dreamclerk applicant should be able to use in a sentence. bookmark this. re-read before the interview.", keywords: "engineering glossary, pr review, code review, postmortem, sprint, capstone, tech lead, ai tech lead, cert, cohort, dreamclerk glossary", author: "dreamclerk team", published_at: "2026-06-10T09:00:00.000Z", updated_at: "2026-06-10T09:00:00.000Z" }),
  "/blog/fresher-unemployment-india-2026-the-numbers-and-the-fix": blogPosting({ path: "/blog/fresher-unemployment-india-2026-the-numbers-and-the-fix", title: "fresher unemployment in india 2026 — the numbers and the fix", description: "73% of indian engineering graduates are unemployed a year after college. the 2026 numbers, the four reasons companies reject freshers, the one fix that works.", keywords: "fresher unemployment india 2026, indian graduate unemployment, fresher jobs india, why freshers can't get jobs, shipped code portfolio, dreamclerk fresher", author: "Ananya Subramanian", published_at: "2026-06-16T09:00:00.000Z", updated_at: "2026-06-16T09:00:00.000Z" }),
  "/blog/the-2-year-experience-trap": blogPosting({ path: "/blog/the-2-year-experience-trap", title: "the 2-year experience trap — what it actually buys in 2026", description: "85% of indian tech jds ask for 2+ years experience. only 12% of applicants have it. where the rule came from, what it actually filters, and 3 ways past it.", keywords: "2 year experience required, experience trap, fresher hiring, no experience job, indian tech jd, experience filter, dreamclerk career", author: "Raghav Krishnan", published_at: "2026-06-19T09:00:00.000Z", updated_at: "2026-06-19T09:00:00.000Z" }),
  "/blog/how-to-get-hired-as-a-fresher-with-no-internship-and-no-network": blogPosting({ path: "/blog/how-to-get-hired-as-a-fresher-with-no-internship-and-no-network", title: "how to get hired as a fresher — a 6-week protocol", description: "no internships, no network, no alumni. the 6-week protocol that lifted 187 dreamclerk applicants from 14% to 31% callback rate.", keywords: "how to get hired as a fresher, fresher with no internship, fresher with no experience, 6 week interview prep, dreamclerk protocol, shipped code fresher", author: "Raghav Krishnan", published_at: "2026-06-22T09:00:00.000Z", updated_at: "2026-06-22T09:00:00.000Z" }),
  "/blog/why-2-years-experience-required-is-a-tax": blogPosting({ path: "/blog/why-2-years-experience-required-is-a-tax", title: "why \"2 years experience required\" is a tax on your future engineering team", description: "a hiring manager writes. the rule is a fossil. the 88% of applicants you filter out includes most of the engineers you would have wanted to hire.", keywords: "2 years experience hiring manager, resume filter, no experience filter, talent acquisition india, hiring without resume, dreamclerk hiring manager", author: "Raghav Krishnan", published_at: "2026-06-25T09:00:00.000Z", updated_at: "2026-06-25T09:00:00.000Z" }),
  "/blog/the-resume-is-dead-three-signals": blogPosting({ path: "/blog/the-resume-is-dead-three-signals", title: "the resume is dead — 3 signals that actually predict a good hire in 2026", description: "the resume predicts 6-month retention at r=0.12. three other signals predict it at r=0.40, r=0.38, and r=0.34.", keywords: "resume is dead, hiring signals 2026, public cert work, pushback record, postmortem write up, dreamclerk signals, no resume hire", author: "Ananya Subramanian", published_at: "2026-06-28T09:00:00.000Z", updated_at: "2026-06-28T09:00:00.000Z" }),
  "/blog/the-2026-pr-review-is-async-and-warm": blogPosting({ path: "/blog/the-2026-pr-review-is-async-and-warm", title: "the 2026 pr review is async-first and warm", description: "the 24h pr was a fossil from a 2014 office culture. the 2026 pr is async-first, written, and has a warm handoff.", keywords: "pr review 2026, async code review, warm handoff, 24 hour pr fossil, in-browser ide, dreamclerk engineering culture", author: "Priya Iyer", published_at: "2026-06-29T09:00:00.000Z", updated_at: "2026-06-29T09:00:00.000Z" }),
  "/blog/the-dual-path-review-engine": blogPosting({ path: "/blog/the-dual-path-review-engine", title: "the dual-path review engine — claude haiku on top of a deterministic regex", description: "we wrap our deterministic regex engine with a claude haiku call. the haiku is constrained to the same rubric. if the call fails, the regex returns the verdict.", keywords: "dual path review engine, claude haiku, deterministic regex, ai review rubric, dreamclerk review, rubric drift, ai safety net", author: "Priya Iyer", published_at: "2026-07-01T09:00:00.000Z", updated_at: "2026-07-01T09:00:00.000Z" }),
  "/blog/the-intern-cheat-sheet-for-the-pushback-round": blogPosting({ path: "/blog/the-intern-cheat-sheet-for-the-pushback-round", title: "the intern cheat sheet for the pushback round", description: "the pushback round is the part of the dreamclerk interview with the highest correlation to cohort retention. here is how to prep, run, and recover.", keywords: "pushback round, dreamclerk interview, intern prep, structured disagreement, 4 sentences recovery, interview rubric, fresher interview", author: "Ananya Subramanian", published_at: "2026-07-03T09:00:00.000Z", updated_at: "2026-07-03T09:00:00.000Z" }),
  "/blog/why-we-stopped-using-take-home-projects": blogPosting({ path: "/blog/why-we-stopped-using-take-home-projects", title: "why we stopped using take-home projects", description: "6-hour take-home projects are the most expensive, least predictive signal in 2026 hiring. r=-0.04 with on-the-job performance, r=0.31 with AI-assistance.", keywords: "take home projects, 6 hour take home, 90 second exercise, anti-correlated, ai assisted take home, dreamclerk interview, replace take home", author: "Priya Iyer", published_at: "2026-07-06T09:00:00.000Z", updated_at: "2026-07-06T09:00:00.000Z" }),
  "/blog/the-cost-of-a-bad-junior-hire-is-not-the-onboarding": blogPosting({ path: "/blog/the-cost-of-a-bad-junior-hire-is-not-the-onboarding", title: "the cost of a bad junior hire is not the onboarding", description: "we ran the numbers on 47 bad junior hires across 12 indian mid-size startups in 2024–25. the onboarding is 18 LPA. the 6 months after is 38 LPA.", keywords: "cost of bad hire, junior engineer cost, 4 questions interview, pushback round, 90 second answer, LPA cost india, dreamclerk hiring manager", author: "Raghav Krishnan", published_at: "2026-07-08T09:00:00.000Z", updated_at: "2026-07-08T09:00:00.000Z" }),
  "/blog/building-the-in-browser-ide-a-postmortem": blogPosting({ path: "/blog/building-the-in-browser-ide-a-postmortem", title: "building the in-browser ide — a postmortem of the 4.2s cold-start regression", description: "we shipped a regression in june 2026 that made the in-browser ide cold-start 4.2s instead of 200ms. timeline, contributing factors, root cause, follow-ups.", keywords: "in-browser ide postmortem, webcontainer regression, bundle size 1.4mb, side effect import, perf benchmark ci, dreamclerk ide incident", author: "Priya Iyer", published_at: "2026-07-10T09:00:00.000Z", updated_at: "2026-07-10T09:00:00.000Z" }),
  "/blog/india-it-services-the-fresher-pipeline-is-broken-and-it-is-not-the-colleges-fault": blogPosting({ path: "/blog/india-it-services-the-fresher-pipeline-is-broken-and-it-is-not-the-colleges-fault", title: "india it services — the fresher pipeline is broken, and it is not the college's fault", description: "the indian it services sector hired 410,000 freshers in fy24 and 192,000 in fy25. the 53% drop is not a story about graduate quality — it is about a hiring model that is no longer paying for itself.", keywords: "india it services fresher, fresher pipeline, tcs infosys hiring drop, it services college, dreamclerk fresher", author: "Ananya Subramanian", published_at: "2026-07-13T09:00:00.000Z", updated_at: "2026-07-13T09:00:00.000Z" }),
  "/blog/what-a-good-postmortem-looks-like": blogPosting({ path: "/blog/what-a-good-postmortem-looks-like", title: "what a good postmortem looks like", description: "a postmortem is not a confession and not a victory lap. it is a dated, blameless, public record of what happened, why, and what changes. here is the template, the 5 sections, and a worked example.", keywords: "postmortem template, blameless postmortem, incident write up, dreamclerk postmortem, engineering culture, public postmortem", author: "Priya Iyer", published_at: "2026-07-15T09:00:00.000Z", updated_at: "2026-07-15T09:00:00.000Z" }),
  "/blog/the-first-90-days-at-your-first-tech-job": blogPosting({ path: "/blog/the-first-90-days-at-your-first-tech-job", title: "the first 90 days at your first tech job", description: "the 12 things we wish we had known in week 1 of our first tech job. grouped by week, with the exact artifact to ship and the exact question to ask in each.", keywords: "first 90 days tech job, junior engineer first job, first tech job india, fresher week 1, dreamclerk alumni, onboarding", author: "Ananya Subramanian", published_at: "2026-07-22T09:00:00.000Z", updated_at: "2026-07-22T09:00:00.000Z" }),
  "/blog/6-pip-signals-and-how-to-flip-4-in-30-days": blogPosting({ path: "/blog/6-pip-signals-and-how-to-flip-4-in-30-days", title: "6 pip signals and how to flip 4 in 30 days", description: "we tracked 96 freshers in their first 90 days. 18 went on a pip. here are the 6 signals that predicted it, and the 4 of them that you can flip inside a single sprint.", keywords: "pip signals, performance improvement plan, junior engineer pip, first 90 days, dreamclerk career, fresher pip", author: "Raghav Krishnan", published_at: "2026-07-25T09:00:00.000Z", updated_at: "2026-07-25T09:00:00.000Z" }),
  "/blog/off-campus-hiring-2026-the-7-channels-that-still-work": blogPosting({ path: "/blog/off-campus-hiring-2026-the-7-channels-that-still-work", title: "off-campus hiring 2026 — the 7 channels that still work", description: "the 7 channels that produced 187 offers for dreamclerk alumni in 2024–25, ranked by callback rate, time-to-offer, and salary median. with the channel-by-channel artifact list and the 3 to skip.", keywords: "off campus hiring 2026, fresher hiring channels, dreamclerk alumni, callback rate, time to offer, salary median, no tier 1 college", author: "Ananya Subramanian", published_at: "2026-07-28T09:00:00.000Z", updated_at: "2026-07-28T09:00:00.000Z" }),
};

// ── Build the per-route HTML by surgical substitution into dist/index.html ──
// We do NOT regenerate index.html from scratch — we keep the React bundle,
// the stylesheets, the JSON-LD scripts, and the head structure intact.
// We only swap: <title>, <meta name="description">, <link rel="canonical">,
// og:url/og:title/og:description, twitter:url/twitter:title/twitter:description,
// and inject any per-route JSON-LD before </head>.

function renderRouteHtml(template, route) {
  const url = SITE + (route.path === "/" ? "" : route.path);
  let html = template;

  // <title>
  html = html.replace(
    /<title>[\s\S]*?<\/title>/,
    `<title>${esc(route.title)}</title>`
  );

  // <meta name="title">
  html = html.replace(
    /<meta name="title" content="[^"]*"\s*\/?>/,
    `<meta name="title" content="${esc(route.title)}" />`
  );

  // <meta name="description">
  html = html.replace(
    /<meta name="description" content="[^"]*"\s*\/?>/,
    `<meta name="description" content="${esc(route.description)}" />`
  );

  // <meta name="keywords">
  if (route.keywords) {
    html = html.replace(
      /<meta name="keywords" content="[^"]*"\s*\/?>/,
      `<meta name="keywords" content="${esc(route.keywords)}" />`
    );
  }

  // <link rel="canonical">
  html = html.replace(
    /<link rel="canonical" href="[^"]*"\s*\/?>/,
    `<link rel="canonical" href="${esc(url)}" />`
  );

  // <link rel="alternate" hreflang="en-IN" ...>
  html = html.replace(
    /<link rel="alternate" hreflang="en-IN" href="[^"]*"\s*\/?>/,
    `<link rel="alternate" hreflang="en-IN" href="${esc(url)}" />`
  );
  html = html.replace(
    /<link rel="alternate" hreflang="x-default" href="[^"]*"\s*\/?>/,
    `<link rel="alternate" hreflang="x-default" href="${esc(url)}" />`
  );

  // <meta property="og:url">
  html = html.replace(
    /<meta property="og:url" content="[^"]*"\s*\/?>/,
    `<meta property="og:url" content="${esc(url)}" />`
  );
  html = html.replace(
    /<meta property="og:title" content="[^"]*"\s*\/?>/,
    `<meta property="og:title" content="${esc(route.title)}" />`
  );
  html = html.replace(
    /<meta property="og:description" content="[^"]*"\s*\/?>/,
    `<meta property="og:description" content="${esc(route.description)}" />`
  );

  // <meta name="twitter:url">
  html = html.replace(
    /<meta name="twitter:url" content="[^"]*"\s*\/?>/,
    `<meta name="twitter:url" content="${esc(url)}" />`
  );
  html = html.replace(
    /<meta name="twitter:title" content="[^"]*"\s*\/?>/,
    `<meta name="twitter:title" content="${esc(route.title)}" />`
  );
  html = html.replace(
    /<meta name="twitter:description" content="[^"]*"\s*\/?>/,
    `<meta name="twitter:description" content="${esc(route.description)}" />`
  );

  // <noscript> fallback — swap the static one for the per-route one
  const noscriptHtml =
    `<noscript data-seo-route="${esc(route.path)}">\n` +
    `      <meta name="description" content="${esc(route.description)}">\n` +
    `      <meta name="x-route-title" content="${esc(route.title)}">\n` +
    `      <link rel="canonical" href="${esc(url)}">\n` +
    `    </noscript>`;
  html = html.replace(
    /<noscript data-seo-route="[^"]*">[\s\S]*?<\/noscript>/,
    noscriptHtml
  );

  // Per-route JSON-LD
  if (route.jsonLd && route.jsonLd.length) {
    const blocks = route.jsonLd
      .map(
        (j) =>
          `\n    <script type="application/ld+json">\n${JSON.stringify(j, null, 2)}\n    </script>`
      )
      .join("");
    html = html.replace("</head>", blocks + "\n  </head>");
  }

  return html;
}

// ── Run ────────────────────────────────────────────────────────────────────
if (!existsSync(INDEX_HTML)) {
  console.error(`prerender: ${INDEX_HTML} not found — run \`npm run build\` first.`);
  process.exit(1);
}

const template = readFileSync(INDEX_HTML, "utf8");
let written = 0;
for (const [path, route] of Object.entries(ROUTES)) {
  const outDir = join(DIST_DIR, path === "/" ? "" : path);
  const outFile = join(outDir || DIST_DIR, "index.html");
  mkdirSync(outDir || DIST_DIR, { recursive: true });
  const html = renderRouteHtml(template, route);
  writeFileSync(outFile, html, "utf8");
  written += 1;
  console.log(`prerender ✓ ${path} → ${outFile.replace(DIST_DIR + "\\", "").replace(DIST_DIR + "/", "")}`);
}
console.log(`prerender: wrote ${written} route(s).`);
