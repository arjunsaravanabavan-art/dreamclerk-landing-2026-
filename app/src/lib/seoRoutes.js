// ─── Static SEO route data ────────────────────────────────────────────────
//
// Hardcoded SEO meta for every public route. Inlined into the static
// HTML shell (index.html) so search engines and humans see the right
// <title>, <meta>, <link rel="canonical">, and JSON-LD on the very
// first paint — before React hydrates.
//
// Why hardcoded? Because Googlebot indexes static HTML, not React state.
// If the <title> is generic, every blog post looks identical to Google.
//
// The "DC_SEO" object below is serialized into a single <script> tag in
// the HTML head and consumed by a tiny inline script that swaps the
// <title>, <meta>, and JSON-LD as soon as the document parses.

export const SITE = "https://www.dreamclerk.com";
export const DEFAULT_TITLE = "dreamclerk — a real job in your browser";
export const DEFAULT_DESC = "a real job in your browser. apply, get hired by an ai recruiter, ship code in a real in-browser ide, get reviewed, and leave with a verified work record. free during beta.";

// Each route has:
//   { title, description, keywords, path, jsonLd? }
// `path` is the URL path WITHOUT trailing slash. canonical and og:url
// are built from `${SITE}${path === "/" ? "" : path}`.

export const STATIC_ROUTES = {
  "/": {
    path: "/",
    title: DEFAULT_TITLE,
    description: "a real job in your browser. apply, get hired by an ai recruiter, ship code in a real in-browser ide, get reviewed, and leave with a verified work record. free during beta.",
    keywords: "career simulation platform, in-browser ide, online code editor, monaco editor, ai code reviewer, verified work certificate, ai recruiter, virtual internship, undergraduate internship, software engineering internship, frontend engineering track, backend engineering track, ai ml engineering, data science track, full stack engineering, ship code get hired, no more unemployment, hireable after college, fresher hiring, coding interview prep, sprint based learning, ai mentor, pr review simulation, capstone project, tech internship without degree, work record certificate, dreamclerk",
  },
  "/how": {
    path: "/how",
    title: "how it works — 8 steps, real prs, signed certificate",
    description: "the 8-step protocol. apply → interview → offer → onboard → 5 sprints of prs → capstone → review round → certificate. real prs, real reviews, real incidents.",
    keywords: "dreamclerk how it works, 8 week protocol, capstone, sprint based learning, pr review, internship timeline, indian undergraduate internship",
  },
  "/workspace": {
    path: "/workspace",
    title: "workspace — in-browser ide, terminal, docker, sql, jupyter",
    description: "8 tracks · 24 gigs · monaco editor, sandboxed terminal, kubernetes, figma canvas, tally-style ledger, tds challans, and more. the full in-browser work surface.",
    keywords: "in-browser ide, monaco editor, sandboxed terminal, kubernetes playground, figma canvas, tally ledger, gstr-1, dbt, airflow, ai ml notebook, dreamclerk workspace",
  },
  "/tracks": {
    path: "/tracks",
    title: "tracks — frontend, backend, ai/ml, data, platform, security",
    description: "6 tracks. frontend, ai/ml, backend, data, platform / sre, security. each track has an 8-sprint plan, a capstone, and a hiring partner. 1 sprint = 5–8 tickets. ship to production.",
    keywords: "engineering tracks, frontend track, backend track, ai ml track, data engineering, platform sre, application security, internship tracks india, dreamclerk tracks",
  },
  "/companies": {
    path: "/companies",
    title: "companies — 6 simulated employers, real codebases",
    description: "6 simulated companies. fintech, b2b saas, ai infra, consumer ai, data warehouse, appsec. each has a real bug to ship, a real tech lead, and a real ticket queue. pick one for sprint 1.",
    keywords: "simulated companies, internship employers, fintech, b2b saas, ai infra, consumer ai, warehouse observability, appsec, dreamclerk companies",
  },
  "/faq": {
    path: "/faq",
    title: "faq — 19 questions, no click-to-open",
    description: "19 questions about dreamclerk — basics, hiring, the ai recruiter, logistics. visible on load. no click-to-open. rubric + bias audit + cohort data all linked.",
    keywords: "dreamclerk faq, is it free, is dreamclerk a real internship, what does the certificate show, hiring partners, interview rubric",
  },
  "/blog": {
    path: "/blog",
    title: "blog — field notes from building dreamclerk",
    description: "field notes from building dreamclerk. the data, the rejects, the rubric changes. nothing polished after the fact. cohort 1, cohort 2, and the rubric that came out of them.",
    keywords: "dreamclerk blog, hiring data, cohort outcomes, bias audit, internship certificate, coding interview, in-browser ide",
  },
  "/about": {
    path: "/about",
    title: "about — the team behind dreamclerk",
    description: "founded in chennai in 2025 by ananya, raghav, and priya. bootstrapped. never charging students what they can't pay. the team page, the advisors, the press, and the funding story.",
    keywords: "dreamclerk team, dreamclerk founders, dreamclerk about, chennai startup, indian startup, career simulation founders",
  },
  "/privacy": {
    path: "/privacy",
    title: "privacy — what we collect, what we don't",
    description: "we collect email + sprint data. we don't sell, we don't share with recruiters without permission, we don't keep a payment record after the cohort ends. full text in plain english.",
    keywords: "dreamclerk privacy, gdpr, indian data protection, career simulation data",
  },
  "/terms": {
    path: "/terms",
    title: "terms — what you agree to when you sign up",
    description: "the terms of use for dreamclerk. written in plain english, governed by the laws of india, reviewed every quarter. if we change them, we email you.",
    keywords: "dreamclerk terms, terms of service, indian contract law, dpdpa",
  },
};

// Blog post SEO entries — hardcoded so the static shell has the right
// <title>, <meta>, canonical, og:url, and BlogPosting JSON-LD on first
// paint, before React hydrates. The data here must match
// src/lib/seedPosts.js and supabase/seed-posts.sql.
export const BLOG_POSTS_SEO = {
  "/blog/why-we-built-dreamclerk": {
    path: "/blog/why-we-built-dreamclerk",
    title: "the 90-second internship interview that changed 14% of outcomes",
    description: "we ran a 90-second phone screen on 1,200 internship applicants. 14% got a callback. here is what we changed, and what we got wrong.",
    keywords: "interview prep, coding interview, 90 second interview, internship callback, dreamclerk founder notes, indian undergraduate hiring",
    published_at: "2026-04-12T09:00:00.000Z",
    updated_at: "2026-05-04T09:00:00.000Z",
    author: "dreamclerk team",
    reading_time: 9,
    tags: ["founder notes", "dreamclerk", "internship"],
  },
  "/blog/inside-our-bias-audit": {
    path: "/blog/inside-our-bias-audit",
    title: "inside our bias audit — the rubric, the data, the changes",
    description: "every quarter we run a bias audit on the dreamclerk interview. here is the rubric, the per-group pass-rates, and the three rubric changes we made after cohort 1.",
    keywords: "bias audit, hiring rubric, ai interview fairness, dreamclerk audit, gender gap, college tier, cohort 1 cohort 2",
    published_at: "2026-05-04T09:00:00.000Z",
    updated_at: "2026-06-10T09:00:00.000Z",
    author: "dreamclerk team",
    reading_time: 12,
    tags: ["bias audit", "hiring", "rubric", "data"],
  },
  "/blog/coding-interview-with-no-experience": {
    path: "/blog/coding-interview-with-no-experience",
    title: "how to pass a coding interview with no experience",
    description: "no internships. no github. no leetcode streak. here is the 4-step protocol we built to prep dreamclerk applicants in 6 weeks — and what the data says about it.",
    keywords: "coding interview, no experience, fresher interview, internship prep, dreamclerk protocol, indian undergraduate coding, github no experience",
    published_at: "2026-05-04T09:00:00.000Z",
    updated_at: "2026-05-04T09:00:00.000Z",
    author: "dreamclerk team",
    reading_time: 14,
    tags: ["interview", "career", "coding interview", "no experience"],
  },
  "/blog/in-browser-ide-explained": {
    path: "/blog/in-browser-ide-explained",
    title: "the in-browser ide — what it actually runs, what it can't",
    description: "monaco on top of a webcontainer. 200ms cold start. 12mb of wasm. here is the architecture, the security model, and the 3 things it cannot do.",
    keywords: "in-browser ide, monaco editor, webcontainer, wasm ide, dreamclerk ide, browser ide security, sandboxed terminal",
    published_at: "2026-06-10T09:00:00.000Z",
    updated_at: "2026-06-10T09:00:00.000Z",
    author: "dreamclerk team",
    reading_time: 8,
    tags: ["in-browser ide", "engineering", "explainers"],
  },
  "/blog/shipping-code-vs-knowing-code": {
    path: "/blog/shipping-code-vs-knowing-code",
    title: "shipping code vs knowing code — a 5-minute glossary",
    description: "the 14 terms every dreamclerk applicant should be able to use in a sentence, with a worked example for each. bookmark this. re-read it before the interview.",
    keywords: "engineering glossary, pr review, code review, postmortem, sprint, capstone, tech lead, ai tech lead, cert, cohort, dreamclerk glossary",
    published_at: "2026-06-10T09:00:00.000Z",
    updated_at: "2026-06-10T09:00:00.000Z",
    author: "dreamclerk team",
    reading_time: 6,
    tags: ["glossary", "engineering culture", "fundamentals"],
  },
  // 2026-q3 fresher / unemployment / experience series
  "/blog/fresher-unemployment-india-2026-the-numbers-and-the-fix": {
    path: "/blog/fresher-unemployment-india-2026-the-numbers-and-the-fix",
    title: "fresher unemployment in india 2026 — the numbers, the cause, and the one fix that works",
    description: "73% of indian engineering graduates are unemployed a year after college. we break down the 2026 numbers, the four reasons companies reject freshers, and the one fix that is actually moving the needle.",
    keywords: "fresher unemployment india 2026, indian graduate unemployment, fresher jobs india, why freshers can't get jobs, shipped code portfolio, dreamclerk fresher",
    published_at: "2026-06-16T09:00:00.000Z",
    updated_at: "2026-06-16T09:00:00.000Z",
    author: "dreamclerk team",
    reading_time: 9,
    tags: ["fresher", "unemployment", "india", "hiring"],
  },
  "/blog/the-2-year-experience-trap": {
    path: "/blog/the-2-year-experience-trap",
    title: "the 2-year experience trap — why the requirement exists, and what it actually buys",
    description: "85% of indian tech JDs ask for 2+ years experience. only 12% of applicants have it. the gap is structural, not preference. here is where the rule came from, what it actually filters, and the 3 ways to get past it without lying.",
    keywords: "2 year experience required, experience trap, fresher hiring, no experience job, indian tech jd, experience filter, dreamclerk career",
    published_at: "2026-06-19T09:00:00.000Z",
    updated_at: "2026-06-19T09:00:00.000Z",
    author: "dreamclerk team",
    reading_time: 8,
    tags: ["experience", "hiring", "job descriptions", "tax"],
  },
  "/blog/how-to-get-hired-as-a-fresher-with-no-internship-and-no-network": {
    path: "/blog/how-to-get-hired-as-a-fresher-with-no-internship-and-no-network",
    title: "how to get hired as a fresher with no internship and no network — a 6-week playbook",
    description: "no internship. no github. no alumni network. no tier-1 college. here is the exact 6-week protocol that 187 dreamclerk applicants used to go from 14% interview rate to 31%, with the calendar, the artifact list, and the rejection log included.",
    keywords: "how to get hired as a fresher, fresher with no internship, fresher with no experience, 6 week interview prep, dreamclerk protocol, shipped code fresher",
    published_at: "2026-06-22T09:00:00.000Z",
    updated_at: "2026-06-22T09:00:00.000Z",
    author: "dreamclerk team",
    reading_time: 11,
    tags: ["fresher", "playbook", "career", "no network"],
  },
  "/blog/why-2-years-experience-required-is-a-tax": {
    path: "/blog/why-2-years-experience-required-is-a-tax",
    title: "why \"2 years experience required\" is a tax on your future engineering team",
    description: "a hiring manager writes. the rule is a fossil. the 88% of applicants you filter out includes most of the engineers you would have wanted to hire. here is the data, the math, and the 4-step replacement.",
    keywords: "2 years experience hiring manager, resume filter, no experience filter, talent acquisition india, hiring without resume, dreamclerk hiring manager",
    published_at: "2026-06-25T09:00:00.000Z",
    updated_at: "2026-06-25T09:00:00.000Z",
    author: "dreamclerk team",
    reading_time: 7,
    tags: ["hiring manager", "experience", "team", "talent"],
  },
  "/blog/the-resume-is-dead-three-signals": {
    path: "/blog/the-resume-is-dead-three-signals",
    title: "the resume is dead — 3 signals that actually predict a good hire in 2026",
    description: "the resume predicts 6-month retention at r=0.12. three other signals predict it at r=0.40, r=0.38, and r=0.34. here is what they are, why they work, and how to build all three in 90 days without a tier-1 college or a brand-name internship.",
    keywords: "resume is dead, hiring signals 2026, public cert work, pushback record, postmortem write up, dreamclerk signals, no resume hire",
    published_at: "2026-06-28T09:00:00.000Z",
    updated_at: "2026-06-28T09:00:00.000Z",
    author: "dreamclerk team",
    reading_time: 8,
    tags: ["resume", "hiring signals", "hiring", "career"],
  },
  // 2026-q3 wave 2 — "after the resume is dead, what now?" — 8 posts
  "/blog/the-2026-pr-review-is-async-and-warm": {
    path: "/blog/the-2026-pr-review-is-async-and-warm",
    title: "the 2026 pr review is async-first and warm — here's what that means",
    description: "the 24h pr was a fossil from a 2014 office culture. the 2026 pr is async-first, written, and has a warm handoff. here is the playbook, the data, and the 4 things you have to stop doing in your engineering org.",
    keywords: "pr review 2026, async code review, warm handoff, 24 hour pr fossil, in-browser ide, dreamclerk engineering culture",
    published_at: "2026-06-29T09:00:00.000Z",
    updated_at: "2026-06-29T09:00:00.000Z",
    author: "dreamclerk team",
    reading_time: 10,
    tags: ["pr review", "engineering culture", "async", "process"],
  },
  "/blog/the-dual-path-review-engine": {
    path: "/blog/the-dual-path-review-engine",
    title: "the dual-path review engine — claude haiku on top of a deterministic regex, with a safety net",
    description: "we wrap our deterministic regex engine with a claude haiku call. the haiku is constrained to the same rubric. if the call fails, the regex returns the verdict. here is the architecture, the contract, the quota, and why both paths are kept.",
    keywords: "dual path review engine, claude haiku, deterministic regex, ai review rubric, dreamclerk review, rubric drift, ai safety net",
    published_at: "2026-07-01T09:00:00.000Z",
    updated_at: "2026-07-01T09:00:00.000Z",
    author: "dreamclerk team",
    reading_time: 12,
    tags: ["ai", "review", "engineering", "claude", "rubric"],
  },
  "/blog/the-intern-cheat-sheet-for-the-pushback-round": {
    path: "/blog/the-intern-cheat-sheet-for-the-pushback-round",
    title: "the intern cheat sheet for the pushback round — how to prep, run, and recover",
    description: "the pushback round is the part of the dreamclerk interview with the highest correlation to cohort retention. here is how to prep, how to run one with a peer, and the 4 sentences that will save you when you are losing.",
    keywords: "pushback round, dreamclerk interview, intern prep, structured disagreement, 4 sentences recovery, interview rubric, fresher interview",
    published_at: "2026-07-03T09:00:00.000Z",
    updated_at: "2026-07-03T09:00:00.000Z",
    author: "dreamclerk team",
    reading_time: 9,
    tags: ["interview", "pushback", "career", "fresher", "playbook"],
  },
  "/blog/why-we-stopped-using-take-home-projects": {
    path: "/blog/why-we-stopped-using-take-home-projects",
    title: "why we stopped using take-home projects — the data showing they're anti-correlated with the job",
    description: "6-hour take-home projects are the most expensive, least predictive signal in 2026 hiring. the data: r=-0.04 with on-the-job performance, r=0.31 with AI-assistance. here is what we replaced them with, and the 90-second alternative that works.",
    keywords: "take home projects, 6 hour take home, 90 second exercise, anti-correlated, ai assisted take home, dreamclerk interview, replace take home",
    published_at: "2026-07-06T09:00:00.000Z",
    updated_at: "2026-07-06T09:00:00.000Z",
    author: "dreamclerk team",
    reading_time: 8,
    tags: ["interview", "take-home", "rubric", "hiring", "ai"],
  },
  "/blog/the-cost-of-a-bad-junior-hire-is-not-the-onboarding": {
    path: "/blog/the-cost-of-a-bad-junior-hire-is-not-the-onboarding",
    title: "the cost of a bad junior hire is not the onboarding — it's the 6 months of attention after",
    description: "we ran the numbers on 47 bad junior hires across 12 indian mid-size startups in 2024–25. the onboarding is 18 LPA. the 6 months after is 38 LPA. here is the breakdown, the math, and the 4 questions that would have caught 41 of the 47.",
    keywords: "cost of bad hire, junior engineer cost, 4 questions interview, pushback round, 90 second answer, LPA cost india, dreamclerk hiring manager",
    published_at: "2026-07-08T09:00:00.000Z",
    updated_at: "2026-07-08T09:00:00.000Z",
    author: "dreamclerk team",
    reading_time: 9,
    tags: ["hiring", "roi", "engineering", "cost", "junior"],
  },
  "/blog/building-the-in-browser-ide-a-postmortem": {
    path: "/blog/building-the-in-browser-ide-a-postmortem",
    title: "building the in-browser ide — a postmortem of the 4.2s cold-start regression",
    description: "we shipped a regression in june 2026 that made the in-browser ide cold-start 4.2s instead of 200ms. here is the postmortem: timeline, contributing factors, root cause, what went well, follow-ups. dated, blameless, public.",
    keywords: "in-browser ide postmortem, webcontainer regression, bundle size 1.4mb, side effect import, perf benchmark ci, dreamclerk ide incident",
    published_at: "2026-07-10T09:00:00.000Z",
    updated_at: "2026-07-10T09:00:00.000Z",
    author: "dreamclerk team",
    reading_time: 11,
    tags: ["postmortem", "engineering", "in-browser ide", "webcontainer"],
  },
  "/blog/india-it-services-the-fresher-pipeline-is-broken-and-it-is-not-the-colleges-fault": {
    path: "/blog/india-it-services-the-fresher-pipeline-is-broken-and-it-is-not-the-colleges-fault",
    title: "india it services — the fresher pipeline is broken, and it's not the colleges' fault",
    description: "TCS, infosys, wipro, and hcl hired 1.4 L freshers in fy24, then 87,000 in fy25. the 84% drop is not a market correction. it is a structural break. here is the data, the three causes, and what the colleges cannot fix because the cause is in the buyer.",
    keywords: "tcs fresher hiring, infosys fresher, wipro fresher, hcl fresher, indian it services fresher, l1 work, genai fresher displacement, dreamclerk india",
    published_at: "2026-07-13T09:00:00.000Z",
    updated_at: "2026-07-13T09:00:00.000Z",
    author: "dreamclerk team",
    reading_time: 10,
    tags: ["india", "it services", "fresher", "hiring", "industry"],
  },
  "/blog/what-a-good-postmortem-looks-like": {
    path: "/blog/what-a-good-postmortem-looks-like",
    title: "what a good postmortem looks like — a worked example, with the 5 sections, in 30 minutes",
    description: "a good postmortem takes 30 minutes to write. it has 5 sections. it is blameless. it is dated. it has follow-ups that are assigned and dated. here is the worked example, the template, and the 3 sentences you should never write in one.",
    keywords: "good postmortem template, blameless postmortem, 5 sections postmortem, postmortem follow ups, dreamclerk cohort, 30 minute postmortem",
    published_at: "2026-07-15T09:00:00.000Z",
    updated_at: "2026-07-15T09:00:00.000Z",
    author: "dreamclerk team",
    reading_time: 8,
    tags: ["postmortem", "engineering culture", "template", "incident"],
  },
  // 2026-q3 wave 3 — first 90 days, pip signals, off-campus channels
  "/blog/the-first-90-days-at-your-first-tech-job": {
    path: "/blog/the-first-90-days-at-your-first-tech-job",
    title: "the first 90 days at your first tech job — week 1, week 4, week 12",
    description: "the first 90 days decide whether you pass probation or get pip'd. here is the one thing to do in week 1, week 4, and week 12 — the protocol that took us 18 months to learn and 12 minutes to read.",
    keywords: "first 90 days software engineer india, what to do in first week at tech job, new joiner checklist developer, week 1 pr, 30 60 90 doc, dreamclerk fresher",
    published_at: "2026-07-22T09:00:00.000Z",
    updated_at: "2026-07-22T09:00:00.000Z",
    author: "dreamclerk team",
    reading_time: 11,
    tags: ["fresher", "first job", "hiring", "india"],
  },
  "/blog/6-pip-signals-and-how-to-flip-4-in-30-days": {
    path: "/blog/6-pip-signals-and-how-to-flip-4-in-30-days",
    title: "6 signals your manager uses to decide your pip — and how to flip 4 of them in 30 days",
    description: "pip decisions are not made in pip meetings. they are made 6–8 weeks earlier, from 6 observable signals. here is the list, which 4 are flip-able in 30 days, which 2 are structural, and the one sentence that gets you a re-rating.",
    keywords: "pip signs software engineer, performance improvement plan india it, how to avoid pip, pr velocity trend, missed standup pattern, dreamclerk fresher",
    published_at: "2026-07-25T09:00:00.000Z",
    updated_at: "2026-07-25T09:00:00.000Z",
    author: "dreamclerk team",
    reading_time: 12,
    tags: ["fresher", "pip", "manager", "hiring", "india"],
  },
  "/blog/off-campus-hiring-2026-the-7-channels-that-still-work": {
    path: "/blog/off-campus-hiring-2026-the-7-channels-that-still-work",
    title: "off-campus hiring 2026 — the 7 channels that still work (and the 4 that don't)",
    description: "78% of indian tech hiring is off-campus in 2026. of the 11 channels freshers use, 7 still work and 4 are dead time. here is the data, the 7 ranked by signal-to-noise, and the one we have never seen anyone fail.",
    keywords: "off campus hiring 2026, how to get a job without college placement, fresher off campus, cold email engineer pattern, linkedin outbound freshers, dreamclerk fresher",
    published_at: "2026-07-28T09:00:00.000Z",
    updated_at: "2026-07-28T09:00:00.000Z",
    author: "dreamclerk team",
    reading_time: 10,
    tags: ["fresher", "off-campus", "hiring", "india", "channels"],
  },
};

// Build a BlogPosting JSON-LD payload from the post SEO data.
export function blogPostingJsonLd(post) {
  const url = `${SITE}${post.path}`;
  return [
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": post.title,
      "description": post.description,
      "author": { "@type": "Organization", "name": post.author },
      "publisher": {
        "@type": "Organization",
        "name": "dreamclerk",
        "logo": { "@type": "ImageObject", "url": `${SITE}/logo.svg` },
      },
      "datePublished": post.published_at,
      "dateModified": post.updated_at || post.published_at,
      "mainEntityOfPage": { "@type": "WebPage", "@id": url },
      "image": `${SITE}/og.png`,
      "keywords": post.keywords,
      "articleSection": "engineering hiring",
      "inLanguage": "en-IN",
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "home", "item": `${SITE}/` },
        { "@type": "ListItem", "position": 2, "name": "blog", "item": `${SITE}/blog` },
        { "@type": "ListItem", "position": 3, "name": post.title, "item": url },
      ],
    },
  ];
}

// Build a per-route meta + JSON-LD payload.
export function routePayload(path) {
  if (BLOG_POSTS_SEO[path]) {
    return {
      route: BLOG_POSTS_SEO[path],
      jsonLd: blogPostingJsonLd(BLOG_POSTS_SEO[path]),
    };
  }
  const r = STATIC_ROUTES[path];
  if (r) {
    return { route: r, jsonLd: null };
  }
  return null;
}
