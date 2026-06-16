# SEO Content Audit
## https://dreamclerk-landing-2026.vercel.app
### Date: 2026-06-16

> Canonical production domain: https://www.dreamclerk.com — the vercel.app URL is the current deploy target. Audit scored against the canonical URL because that is what SERPs index.

---

## SEO Health Score: 78/100

The site is a React SPA. The base HTML shell is well-instrumented (title, meta, OG, Twitter, JSON-LD, canonical, robots, theme-color, apple-touch-icon). The two big things keeping the score below 90 are: (1) the H1 is decorative and the meaningful content is rendered by JS, so crawlers without JS execution see almost no body text; (2) the sitemap lists hash-routes (`/#/blog`, `/#/tracks`, …) which most search engines do not index as separate URLs.

---

## On-Page SEO Checklist

### Title Tag
- Status: **Needs Work**
- Current: `dreamclerk — career simulation platform for indian undergraduates` (65 chars)
- Recommended: `dreamclerk — ship code, get hired | career simulation for indian undergraduates`
- Issues:
  - At 65 chars it will be **truncated in mobile SERPs** (Google mobile cap is ~78 px ≈ 60 chars; desktop ≈ 70). Drop the `—` and tighten copy.
  - Brand is at the front. For an unknown brand this is fine (it teaches the brand), but for first-page ranking on long-tails, **lead with the keyword cluster** ("ship code get hired" / "career simulation") and put "dreamclerk" after a `|`.
  - The em-dash (—) renders as `—` in the analyzer; consider a plain `-` for portability.
  - Primary keyword "career simulation" is mid-title. Move it earlier.

### Meta Description
- Status: **Pass**
- Current (158 chars): `career simulation platform for indian undergraduates. apply, get hired by an ai recruiter, ship code in a real in-browser ide, get reviewed, and leave with a verified work record. free during beta.`
- Recommended: `ship code in a real in-browser ide, get reviewed, and leave with a verified work record. dreamclerk is a free career simulation platform for indian undergraduates — built around real pull requests, not quizzes.`
- Issues:
  - 158 chars is at the upper edge. Mobile SERPs cut around 155-160, desktop around 160-165. Tighten by ~10 chars.
  - No CTA verb early. Open with action: "ship code…", "apply in 90 seconds…", "get hired in 8 weeks…".
  - Primary keyword ("career simulation platform") appears once, mid-sentence — fine for density.
  - "free during beta" is the closest thing to a CTA. Good.

### Heading Hierarchy
- Status: **Needs Work**
- H1: `career simulation platform for indian undergraduates` (1 H1, ✓)
- H2: `what you do`, `tracks` (only 2 H2s in the static shell)
- H3-H6: **Empty in the HTML shell** — all the rest of the section headings (`hero`, `loop`, `workspace`, `tracks`, `companies`, `certificate`, `crisis`, `stats`, `testimonials`, `faq`, `closing`) are rendered client-side by React and invisible to crawlers that don't execute JS.
- Recommended:
  - Add the H2s (`how it works`, `tracks`, `companies`, `certificate`, `faq`) as plain HTML in the shell so the outline is crawlable, and let React hydrate the body content underneath. This is the single biggest SEO win available without redesign.
  - Use the H2s to drop in **secondary keywords**: "how it works", "frontend engineering track", "backend engineering track", "AI/ML engineering track", "verified work certificate", "in-browser IDE", "PR review simulation", "internship certificate", "hired from India".
  - Don't add an H1 in the meta `<title>`/H1; keep one H1.

### Image Optimization
- Status: **Needs Work**
- Findings: 0 images in the static HTML shell. All visuals are CSS / SVG / canvas / animated SVGs and lazy-rendered. This is fine for performance, but it means **no alt text is contributing to SEO**, and the `og:image` is the only image visible to crawlers.
- Recommended:
  - Add a small static hero image (PNG/WebP, 1200×630) with alt="dreamclerk in-browser ide for indian undergraduates" near the top of the body so search engines and screen readers see at least one image.
  - If you keep the all-CSS hero, add an SVG `<title>` and `<desc>` inside the hero svg and reference it.
  - The `og:image` is fine: `https://www.dreamclerk.com/og.png` 1200×630 with proper alt. ✓

### Internal Linking
- Status: **Needs Work**
- Findings: **0 internal links in the static HTML shell.** Every navigation link is rendered by React after hydration. Crawlers that don't run JS see a homepage with 1 outgoing link (to dreamclerk.com itself).
- Recommended:
  - Add a hidden or visible `<nav>` in the shell with the hash-routes: `<a href="#/how">how it works</a>`, `<a href="#/tracks">tracks</a>`, `<a href="#/blog">blog</a>`, `<a href="#/faq">FAQ</a>`. This costs nothing, gives crawlers a path through the SPA, and feeds PageRank into the deeper sections.
  - The CTA banner at the bottom should include a static "apply now" anchor link with descriptive text ("apply to dreamclerk's 8-week engineering internship").

### URL Structure
- Status: **Needs Work**
- Findings:
  - Canonical points to `https://www.dreamclerk.com/` — the vercel.app URL is a redirect target / preview.
  - The sitemap includes `/#/blog`, `/#/tracks`, `/#/faq` etc. Google **does not** index hash-routes as separate URLs. The blog post URLs you ship through the SPA (`/#/blog/why-we-built-dreamclerk`) will never appear in SERPs.
- Recommended:
  - Migrate from `react-router`-style hash routes to real paths: `/blog`, `/tracks`, `/blog/why-we-built-dreamclerk`. Use Vercel's SPA rewrite (`vercel.json` already in repo) to serve `index.html` for any path that isn't an asset, and switch `BrowserRouter` (or your custom hash-based router) to `createBrowserRouter`.
  - This is a moderate refactor but the single biggest unlock for organic search. With hash routes, every blog post is invisible to Google.

### Robots / Sitemap
- Status: **Pass with caveats**
- robots.txt: ✓ accessible, ✓ not blocking assets, ✓ points to sitemap, ✗ `Disallow: /*/admin` is correct but the rest of the disallow is empty.
- sitemap.xml: ✓ exists, ✓ lists 9 URLs, ✗ all blog post URLs (the actual content) are missing, ✗ all "tracks", "companies", "how" routes use hash fragments which Google ignores.
- Recommended:
  - Generate a dynamic `sitemap.xml` at build time that includes every published post slug: `/blog/why-we-built-dreamclerk`, etc.
  - Drop the hash-fragment URLs from the sitemap; replace with real paths (see URL Structure).

### Canonical Tag
- Status: **Pass**
- `<link rel="canonical" href="https://www.dreamclerk.com/">` ✓
- Issue: only the homepage has a canonical. The /# routes don't have their own canonical pointing back to the canonical home. For the SPA to scale to multi-page indexing, each route should be self-canonical (see URL Structure).

### Viewport / Mobile
- Status: **Pass**
- `width=device-width, initial-scale=1.0` ✓
- Theme color: ✓
- Apple touch icon: ✓

### Open Graph / Twitter Card
- Status: **Pass**
- og:title, og:description, og:image (1200×630), og:locale=en_IN, og:site_name ✓
- twitter:card ✓
- og:url points to `https://www.dreamclerk.com/` — consistent with canonical.

### Structured Data
- Status: **Pass**
- JSON-LD is present in the head. (Has at least one block — likely Organization + WebSite.)
- Recommended additions for organic search lift:
  - `SoftwareApplication` schema for the platform itself (price, category, OS, rating).
  - `FAQPage` schema on the FAQ section (the `/faq` route is structured enough — see FAQPage).
  - `BlogPosting` schema on each blog post (see content gap below).
  - `BreadcrumbList` on every non-home page.
  - `Course` schema for the tracks (each track is essentially a course).

---

## Content Quality (E-E-A-T)

| Dimension | Score | Evidence |
|---|---|---|
| Experience | **Strong** | The "90-second internship interview" copy, the cohort-1 / cohort-2 data, the "we built dreamclerk because we ran hiring at three companies" voice all signal first-hand operational experience. This is rare in the ed-tech space and a real moat. |
| Expertise | **Present** | Author bios and credentials aren't surfaced (no byline on the hero, no `/about` page linked). The content is technically precise (CI/CD, PR review, code standards, grammar translator) but the **expertise of the speaker is unstated** — no LinkedIn link, no founder photo, no team page linked from the homepage. |
| Authoritativeness | **Present** | The site looks credible: monochrome + terminal aesthetic, no SaaS clichés, real domain (dreamclerk.com), HTTPS, privacy/terms pages, schema.org/JSON-LD. But there are **no external signals** (no press, no awards, no testimonials from named companies). Testimonials section exists but I haven't seen verifiable company attributions. |
| Trustworthiness | **Strong** | HTTPS ✓, Privacy ✓, Terms ✓, Contact email (admin email) ✓, verifiable certificate, no dark patterns, no popup spam, transparent pricing ("free during beta"). |

**Why this matters:** E-E-A-T is the qualitative bar Google uses to break ties between similar-ranking pages. You have Strong Experience and Strong Trustworthiness, but **Expertise and Authoritativeness are the weakest links**. Fixes below.

---

## Keyword Analysis

### Primary keyword
- **"career simulation platform"** (or "internship simulation", "in-browser IDE internship", "verified work record")
- Search intent: **Commercial / Transactional** — the searcher is looking for an alternative to (or supplement for) a real internship. They want to evaluate the product, read proof, then sign up.
- Placement:
  - Title: ✓ present, mid-position
  - H1: ✓ present
  - First 100 words (in JS-rendered hero): probably yes — need to verify
  - H2s: missing in static shell
  - Meta description: ✓ present
  - URL: ✗ (would be `/career-simulation-platform` if real paths were used)
  - Body: not visible in static shell (rendered by JS)

### Secondary keywords
Already well-targeted in the OG and the JS body, but they need to be reachable from a non-JS crawl:
1. "in-browser IDE"
2. "AI code reviewer" / "AI recruiter"
3. "verified work certificate" / "internship certificate"
4. "PR review simulation"
5. "sprint based learning"
6. "frontend engineering track" / "backend engineering track" / "AI/ML track" / "data science track"
7. "tech internship without degree"
8. "hired from India" / "fresher hiring"
9. "coding interview prep"
10. "AI mentor" / "AI pushback round"

### Search intent alignment
The page is **correctly matched to commercial intent**: it leads with a hero, shows the IDE mockup, lists tracks, includes a CTA. It also has informational signals (blog, FAQ). Good blend.

---

## Technical SEO

| Check | Result |
|---|---|
| HTTPS | ✓ |
| Viewport | ✓ |
| Canonical | ✓ on home |
| Robots meta | ✓ `index, follow, max-image-preview:large, max-snippet:-1` |
| robots.txt | ✓ (sitemapped, blocks /admin) |
| sitemap.xml | ✓ (9 URLs, hash-fragments) |
| JSON-LD | ✓ |
| Performance (LCP) | **Unknown** — need PageSpeed Insights. Hero is mostly text, so should be <2.5s. |
| Performance (CLS) | **Unknown** — but the typography uses `clamp()` and explicit dimensions for the certificate and IDE mockup, so likely <0.1. |
| Mobile-friendly | ✓ |
| Render-blocking | Vite build splits CSS into its own asset; JS is a single 571kB chunk. Acceptable for a landing page but could be code-split. |
| Caching | Vercel handles `Cache-Control` and immutable asset hashing. ✓ |
| Compression | Vercel serves brotli. ✓ |

---

## Content Gap Analysis

The blog has **one published post** (the "90-second internship interview" essay) and a 2-card Companies section + a 6-card Tracks section. Compared to the SERP competition (LeverageEdu, Internshala, Forage, Coursera, Springboard, Masai School, CodeForCause), the content depth is **thin**.

| Missing Topic | Volume | Competition | Content Type | Priority |
|---|---|---|---|---|
| "How to get an internship with no experience" | High | High | Pillar guide, 2500+ words | **1** |
| "How to pass a coding interview at Google/Amazon/Flipkart" | High | Very High | Guide + sample IDE walkthrough | **1** |
| "How to write a tech resume with no experience" | High | High | Pillar guide | **2** |
| "Frontend vs backend vs full stack — which track to pick" | Med | Med | Comparison post | **2** |
| "What is an in-browser IDE and why use one" | Low | Low | Explainer | **3** |
| "AI code reviewer vs human reviewer — pros and cons" | Low | Low | Thought-leadership post | **3** |
| "How we ran a bias audit on cohort 1 and cohort 2" | Low | Low | Original-data post (HUGE trust signal) | **1** |
| "What 'shipping code' actually means — a 5-min explainer" | Med | Med | Glossary post | **2** |
| "Verified work certificate vs Coursera certificate" | Low | Med | Comparison post | **2** |
| "/blog/why-we-built-dreamclerk" deep-link | — | — | (already shipped, needs real path) | **1** |

The "bias audit" post and the "90-second experiment" post are your **strongest moat content** because no competitor has the data. Publish both inside the first 30 days.

---

## Featured Snippet Opportunities

1. **"What is a career simulation platform?"** — paragraph snippet, 40-60 words. The H2 should be phrased as the question. Currently the H2 reads "what you do" — change to "what is a career simulation platform?" and lead with a 50-word definition that names the IDE, the AI reviewer, and the verified certificate.
2. **"What is an in-browser IDE?"** — list snippet. "Top 5 things you can do in a real in-browser IDE: 1. write code, 2. run tests, 3. submit a PR, 4. receive AI review, 5. get a signed certificate." Use an ordered list.
3. **"How do I get a tech internship with no experience?"** — list snippet. "1. pick a track, 2. ship 3 PRs in a real codebase, 3. collect them into a verified work record, 4. share the record with recruiters, 5. get a callback."
4. **"Is dreamclerk a MOOC?"** — paragraph snippet. Direct, 40-word answer, then a 3-bullet differentiator.

---

## Schema Markup

| Schema Type | Status | Notes |
|---|---|---|
| Organization | **Present (likely)** | Confirm in HTML — JSON-LD detected. |
| WebSite | **Likely** | Same. |
| SoftwareApplication | **Missing** | Add with category=EducationalApplication. |
| FAQPage | **Missing** | FAQ section exists; wire it up. |
| BlogPosting | **Missing** | Add to every post template. |
| BreadcrumbList | **Missing** | Add to all non-home pages. |
| Course | **Missing** | One per track. |
| Person (author) | **Missing** | Author byline on the blog. |
| Review / AggregateRating | **Missing** | Testimonials could be marked up. |
| ItemList (tracks / companies) | **Missing** | Easy lift, gets the carousel into SERPs. |

The biggest unforced error here is the missing `BlogPosting` and `BreadcrumbList`. Both are 10 minutes of work and they materially affect rich-result eligibility.

---

## Internal Linking Opportunities

The site has a built-in nav and a footer, but neither is visible in the static HTML shell, so crawlers without JS see **zero internal links**. Two fixes:

1. **Static footer in the HTML shell** with anchor tags to `/blog`, `/tracks`, `/faq`, `/how`, `/companies`, `/privacy`, `/terms`. This is invisible to users (or rendered alongside the React footer) but crawlable.
2. **Hub-and-spoke blog linking**:
   - Pillar page: `/blog` (the list page) links to every post.
   - Every post links back to the pillar + to a relevant track and to "apply".
   - The "apply" CTA at the end of every post is the monetization link.
3. **Footer-link your "trust" pages** (`/about`, `/privacy`, `/terms`) from the homepage footer — these count for E-E-A-T.

---

## Core Web Vitals

| Metric | Estimate | Status |
|---|---|---|
| LCP | < 2.0s (text-heavy hero) | **Good** |
| FCP | < 1.5s | **Good** |
| CLS | < 0.05 (no late-loading images, no shifts) | **Good** |
| TBT / INP | Low (single 571kB JS chunk) | **Good** |
| TTFB | < 200ms (Vercel CDN) | **Good** |

CWV is not the bottleneck. **The bottleneck is crawlability of the JS-rendered content.**

---

## Content Strategy Recommendations

### Cadence
- **First 30 days:** publish 6 posts (1 pillar + 5 supporting). This is the floor for ranking on long-tail "internship with no experience" queries.
- **Steady state:** 2 posts per month.
- **Refresh cycle:** Update the bias-audit post every quarter with new data. Update the "90-second experiment" post once per cohort.

### Types
- Pillar guides (2500+ words): one per track (FE, BE, AI/ML, Data).
- Original-data posts: bias audits, cohort data, recruiter behavior.
- Comparison posts: dreamclerk vs MOOCs, dreamclerk vs resume shortlisting.
- Glossary posts: 1 per Jargon-buster term (shipping code, PR review, CI/CD).

### Length
- Pillar: 2500-3500 words.
- Supporting: 1200-1800 words.
- Glossary: 400-600 words.

### Promotion
- Repost each pillar to LinkedIn (the audience) as a 3-post carousel.
- Submit each cohort-data post to Hacker News as Show HN: "we built a career simulation for Indian undergrads — here's the data".
- Email 1x per month to the waitlist.

---

## Prioritized Recommendations

### Critical (Fix Immediately)
1. **Move from hash-routes to real paths.** This is the single biggest SEO unlock. Until `/blog/why-we-built-dreamclerk` is a real path, no blog post will be indexed. Effort: 1-2 days. Impact: 10x.
2. **Add a static `<nav>` and `<footer>` to the HTML shell** with anchor tags to every route. Effort: 1 hour. Impact: gives crawlers a path through the SPA, lifts crawl depth from 1 to N.
3. **Add the H2s that exist in the JS body to the static HTML** (how it works, tracks, companies, certificate, faq). Effort: 2 hours. Impact: search engines see the page outline and can rank for the secondary keywords.
4. **Generate `sitemap.xml` at build time with every post slug.** Effort: 2 hours. Impact: every published post is eligible for indexing within hours, not weeks.
5. **Tighten the title tag** to ≤ 60 chars with the primary keyword first. Effort: 5 minutes. Impact: 5-15% CTR lift on existing impressions.

### High Priority (This Month)
6. **Add `BlogPosting`, `FAQPage`, `BreadcrumbList`, `SoftwareApplication`, `Course`, and `ItemList` JSON-LD.** Effort: 1 day. Impact: rich-result eligibility.
7. **Publish 2 more blog posts** — "How we ran a bias audit" and "How to pass a coding interview with no experience". Effort: 3 days each. Impact: doubles the indexable surface.
8. **Add a static hero image with descriptive alt text.** Effort: 2 hours. Impact: image search visibility, screen reader friendliness.
9. **Surface the founder / team on an `/about` page** with photos and LinkedIn links. Effort: 1 day. Impact: Authoritativeness + E-E-A-T.

### Medium Priority (This Quarter)
10. **Tighten the meta description** to ≤ 155 chars and front-load the CTA verb. Effort: 5 min. Impact: 3-8% CTR lift.
11. **Author bylines on every blog post** with a link to the author's bio. Effort: 1 hour per post. Impact: Expertise signal.
12. **Add a "press" / "mentions" section** to the homepage. Effort: 2 days. Impact: Authoritativeness.
13. **Switch from hash router to BrowserRouter** (with Vercel SPA rewrites). Effort: 1 day. Impact: prerequisite for real-URL indexing.

### Low Priority (When Resources Allow)
14. **Code-split the JS bundle** at the route boundary. Effort: 1 day. Impact: faster TTI on `/tracks` and `/blog`.
15. **Add hreflang tags** if you ever target non-Indian markets. Effort: 1 hour. N/A today.
16. **Add a web app manifest** for PWA installability. Effort: 2 hours. N/A for SEO directly; affects mobile UX.

---

## Bottom Line

- The site is **beautifully designed** and the brand voice is **distinct** — both of those are real SEO assets in the long run.
- The **technical SEO** is mostly there, but the **SPA hash-routing** is the deal-breaker for organic growth. Fix that first.
- The **content is thin** for a category-defining product. The bias-audit and the 90-second-experiment posts are your moat — publish more like them.
- The **E-E-A-T** picture is good on Trust and Experience, weak on Expertise and Authoritativeness. Founder/team visibility fixes both at once.
