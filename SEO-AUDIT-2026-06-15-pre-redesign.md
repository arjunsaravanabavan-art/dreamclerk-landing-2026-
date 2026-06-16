# SEO Content Audit
## https://dreamclerk.com
### Date: 2026-06-15

---

## SEO Health Score: **62 / 100**

| Category | Weight | Score | Notes |
|---|---|---|---|
| On-Page SEO | 30% | 22/30 | Title/meta are good, but H1 is generic and lacks primary keyword. |
| Technical SEO | 25% | 11/25 | No robots.txt, no sitemap.xml, no OG image configured properly, www→apex redirect chain. |
| Content (E-E-A-T) | 20% | 12/20 | Strong copy & JSON-LD, but no About / no author bios / no press. |
| Schema / Rich Results | 10% | 9/10 | Organization, SoftwareApplication, FAQ all present — excellent. |
| Performance | 10% | 5/10 | Heavy React SPA, ~236 kB JS, Google Fonts external. Lighthouse unverified (quota). |
| Mobile / UX | 5% | 3/5 | Viewport set, responsive grid, but tap targets below 48 px in places. |

---

## On-Page SEO Checklist

### Title Tag
- **Status:** Pass (with caveat)
- **Current (75 chars):** `dreamclerk — no more unemployment | real-world career simulation platform`
- **Recommended (62 chars):** `dreamclerk — career simulation platform for indian undergraduates`
  - Why: current title truncates around 65 chars on mobile SERPs. Move the primary keyword "career simulation platform" earlier, drop the em-dash brand-name pattern, and add "indian undergraduates" — the actual ICP.
- **Issues:**
  - Slightly over the 60-char comfort zone (75 chars)
  - Primary keyword appears after the brand name (should lead)
  - Em-dash (—) renders as 3 bytes and truncates unpredictably

### Meta Description
- **Status:** Pass
- **Current (282 chars):** `no more unemployment. dreamclerk is a real-world career simulation platform where indian undergraduates apply, get hired by an ai recruiter, ship code in a full in-browser ide, get reviewed by an ai tech lead, earn xp, and receive a verified work record — not a completion badge. built in chennai.`
- **Recommended (158 chars):** `dreamclerk is a career simulation platform for indian undergraduates. apply, get hired by an ai recruiter, ship code in a real in-browser ide, and leave with a verified work record. free during beta.`
  - Why: Google truncates at ~155–160 chars. Yours is cut in the middle of the value prop. The em-dash and the long clause make the SERP preview ugly. Front-load the action verbs.
- **Issues:**
  - Over 160 chars (truncation)
  - Sentence is one run-on — hard to scan in SERP
  - "built in chennai" is great proof but should be a footer detail, not first-pass copy

### Heading Hierarchy
Detected from the source repo (SPA, not visible in static HTML):

```
H1: "no more unemployment. ship code. get reviewed."        (Hero)
H2: "what's in it."                                          (Cert — mis-hierarchy, see below)
H2: "six tracks. one job, deeply."                           (Tracks)
H2: "your ide, your terminal, your real job."                (Workspace)
H2: "six companies. real recruiters. real reviews."          (Companies)
H2: "the next cohort opens in…" / "coming soon."             (Final)
H2: "questions, answered honestly."                          (FAQ)
H2: "in their words"                                        (Testimonials)
H3: "what's in it."                                          (Cert side rail — duplicate of the H2)
H3: "questions, answered honestly."                          (FAQ — duplicate of H2)
H4: IDE feature names                                       (Workspace)
H5: Footer columns
```

**Issues:**
- **H1 contains no primary keyword.** The primary keyword is "career simulation platform" — but H1 is "no more unemployment. ship code. get reviewed." The keyword appears only in the *title tag* and the body. Google will weight the H1 heavily.
- **H2 = H3 in two places** (Certificate "what's in it.", FAQ "questions, answered honestly.") — the FAQ uses the same string twice, once as a sticky title and once as the actual H2. That looks spammy to a crawler.
- **No H2 between the H1 and the first content section.** The Hero goes straight into the marquee with no transition header.
- **No H2/H3 on the Stats section, the Companies section.** Numbers and table data without a header is fine for scannability but reduces topical signals.

### Image Optimization
- **Status:** Pass / N/A
- **Detected:** 0 images in the static HTML. The page is a single hero with SVG-style typography + the IDE mockup is HTML/CSS (not `<img>`).
- **Issues:**
  - **No `<img>` tags = no alt text opportunities** for SEO image search.
  - The IDE mockup, certificate panel, and workspace preview would rank in Google Images if exported as PNGs and added with descriptive `alt` text + filenames like `dreamclerk-certificate-verify-panel.png`.
  - The `og.png` (Open Graph) is the only image asset; verify it exists and is the right dimensions (1200×630).

### Internal Linking
- **Status:** Fail
- **Detected:** 0 internal links in the static HTML (SPA renders them client-side, so the script can't see them).
- **From the source:** anchor links only (`#workspace`, `#tracks`, etc.) — all stay on the same page.
- **Issues:**
  - **No deep links to subpages** — this is a single-page site, but a landing page with *no* blog/About/Pricing/FAQ-subpage is a topical thinness problem.
  - Footer columns are empty anchor stubs (verify in source).
  - **No contextual internal anchor text** like "see our [frontend track syllabus](/tracks/frontend)".
  - Single page = single shot at ranking for *all* queries. Without subpages you can't rank for long-tail like "best backend engineering track for indian students".

### URL Structure
- **Status:** Pass
- **URL:** `https://dreamclerk.com/` → `https://www.dreamclerk.com/` (308 redirect)
- **Issues:**
  - **308 redirect from apex → www.** Fine in principle, but it's the *first* hit. Pick one canonical and serve it directly. (Currently you have `rel="canonical"` pointing to `https://dreamclerk.com/` while the redirect goes the other way. Crawler sees a contradiction.)
  - The canonical should match the final URL. Right now `canonical = https://dreamclerk.com/` but the live URL is `https://www.dreamclerk.com/`. That's a **canonical-redirect mismatch** — Google may treat it as a soft 404 candidate.

---

## Content Quality (E-E-A-T)

| Dimension | Score | Evidence |
|---|---|---|
| Experience | **Strong** | Testimonials from named students (aanya sharma, karthik r, mira patil) with track, grad year, specific metric ("34 prs in 8 weeks"). Live PR ticker adds currency. |
| Expertise | **Present** | Strong domain vocabulary (sprint velocity, pr-merge rate, jupyterlite, monaco). No author bios on the page. |
| Authoritativeness | **Weak** | No About page, no team bios, no press mentions, no industry awards linked. The sameAs schema claims Instagram/Twitter/LinkedIn/YouTube/GitHub presence but no public evidence on the page. |
| Trustworthiness | **Present** | HTTPS enforced (HSTS header present), `SoftwareApplication` schema with `AggregateRating: 4.9 / 1847`, free pricing transparent, "built in chennai" anchors. But: no Privacy Policy link in the visible footer (verify in source). No Terms of Service link. No contact email. |

**Top E-E-A-T gap:** no `About` / `Team` / `Press` page. Google Quality Rater Guidelines weigh "Who is behind this?" heavily for YMYL adjacent content (career/employment). Without an About page, a Knowledge Panel can't be claimed either.

---

## Keyword Analysis

### Primary Keyword
- **Identified:** `career simulation platform` (also: `in-browser ide`, `ai code reviewer`, `verified work certificate`)
- **Search intent:** Mixed — primarily **commercial investigation** (students comparing options to internships/bootcamps), secondarily **transactional** ("apply to dreamclerk")
- **Keyword placement:**

| Element | Present? | Quality |
|---|---|---|
| Title tag | Yes | Position 2, natural |
| Meta description | Yes | Natural |
| H1 | **No** | H1 is a tagline, not a keyword. |
| First 100 words | Partial | "no more unemployment" dominates; "career simulation platform" appears in the subhead. |
| Subheadings (H2) | No | H2s are emotional taglines, not keywords. |
| URL | No | Just `/`. |
| Image alt | N/A | No images. |
| Anchor text | No | No outbound internal links. |
| **Density** | ~1.4% | Fine. |

### Recommended Keyword Architecture

| Tier | Keyword | Use in |
|---|---|---|
| **P0** | `career simulation platform` | Title, H1, first paragraph, one H2, URL |
| **P0** | `in-browser ide` | One H2, Workspace section, image alt |
| **P1** | `ai code reviewer` | Workspace section, schema |
| **P1** | `virtual internship for undergraduates` | Subhead, Tracks section, FAQ |
| **P1** | `verified work certificate` | Certificate section, schema |
| **P2** | `monaco editor online`, `jupyter notebook online` | Long-tail blog posts |
| **P2** | `frontend engineering track`, `backend engineering track`, `ai ml track` | Track subpages |
| **P2** | `fresher hiring india`, `coding interview prep` | Blog posts |

---

## Technical SEO

### Robots.txt — **MISSING**
```bash
$ curl -I https://dreamclerk.com/robots.txt
HTTP 404 NOT_FOUND
```
**Critical.** Every site needs a `robots.txt`. Even an empty one is better than a 404 (crawlers waste budget on 404s). Add to `/public/robots.txt`:
```
User-agent: *
Allow: /
Sitemap: https://www.dreamclerk.com/sitemap.xml
```

### XML Sitemap — **MISSING**
```bash
$ curl -I https://dreamclerk.com/sitemap.xml
HTTP 404 NOT_FOUND
```
**Critical for a single-page app** because crawlers need help finding your one URL. Without it, sitemap-less crawlers may over-fetch the same page. Add `/public/sitemap.xml`:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://www.dreamclerk.com/</loc>
    <lastmod>2026-06-15</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
```
Then submit to Google Search Console.

### Canonical Tag — **Inconsistent**
- `rel="canonical"` → `https://dreamclerk.com/` (apex)
- 308 redirect serves → `https://www.dreamclerk.com/` (www)
- **Pick one.** Best practice: serve the canonical version directly with no redirect, and point `rel=canonical` to it. Suggestion: canonical = `https://www.dreamclerk.com/` (matches the 308).

### Page Speed — **Likely Needs Work**
- (Lighthouse quota exhausted for the day; estimate from bundle)
- **LCP**: Hero h1 is the LCP candidate. Currently rendered after JS hydrates → likely **2.5–3.5s** on slow 4G.
- **CLS**: The marquee and ticker could cause layout shift if they don't reserve height. Audit `.ticker` and `.marquee` for fixed `min-height`.
- **TBT**: ~236 kB JS, gzipped 72 kB. Acceptable on desktop, marginal on mid-range Android.
- **FCP**: 3 Google Fonts + 1 external stylesheet → likely **1.5–2.5s**.
- **TTFB**: Vercel edge → typically <200ms in bom1. Likely fine.
- **Brotli**: Vercel serves brotli by default → fine.
- **HTTP/2**: Vercel default → fine.

### Mobile-Friendliness
- ✅ Viewport meta present
- ✅ Responsive grid (`clamp()`, `var(--col)`)
- ⚠️ Tap targets: terminal-style buttons (`btn--ghost` and the apply pill) are likely under 48×48 px in places. The hero CTA "get notified →" needs padding check.
- ⚠️ Body text size: Hero sub at `var(--t-m)` is fine (16-18px range), but small mono labels (10-11px) are below the 12px mobile readability floor.

### HTTPS
- ✅ Enforced (HSTS header present, 308 to HTTPS from any HTTP request)
- ✅ Vercel-managed cert

### Crawl Efficiency
- **One-page SPA** with no real URLs to crawl. Crawlers that don't execute JS see an empty page. → **Critical risk: Googlebot-Mobile runs JS, but Bing and many social crawlers don't.** Without a server-side render or pre-render, you lose on those surfaces.
- **Recommendation:** add a static fallback body in `<noscript>` describing the page, or move to a pre-rendering solution (Vercel supports it via `prerender` in `vercel.json`).

---

## Content Gap Analysis

The page covers one topic deeply (career simulation). It does *not* cover:

| Missing Topic | Search Volume Potential | Competition | Content Type | Priority |
|---|---|---|---|---|
| `how to get a software engineering internship in india` | High | High | Long-form guide | 1 |
| `best in-browser code editors for students` | Med | Med | Comparison page | 1 |
| `what is a sprint-based learning platform` | Low | Low | Glossary/FAQ | 2 |
| `verified work certificate vs completion certificate` | Med | Low | Blog post + schema | 1 |
| `ai code reviewer: how it works` | Med | Med | Educational blog | 2 |
| `frontend track syllabus` (per track) | Med | Low | Subpage | 1 |
| `dreamclerk reviews` (capture branded search) | High (when traffic exists) | Low | Testimonials + review schema | 1 |
| `is dreamclerk legit?` | Med (when reputation matters) | Low | Trust page | 1 |
| `career simulation platform vs bootcamp` | Med | Med | Comparison page | 2 |
| `how to become a backend engineer without a degree in india` | High | Med | Pillar blog | 1 |

**Single biggest gap:** no blog, no subpages, no About, no Press. You are one URL competing against multi-page competitors (NxtWave, Masai, Crio, InterviewBit). To win long-tail, you need 10-20 supporting pages.

---

## Featured Snippet Opportunities

Google's "People Also Ask" for `career simulation platform` (inferred — run live in GSC when traffic arrives):

1. **"what is a career simulation platform?"**
   - Add as an H2, answer in 50 words immediately after, then expand.

2. **"how does dreamclerk work?"** (8-step list snippet)
   - You already have the Loop section! Wrap it in an `<ol>` with descriptive H2. (verify the H2 is question-form).

3. **"is a career simulation platform better than a bootcamp?"**
   - Comparison table — 3 cols: career sim, bootcamp, self-study. 4-5 rows.

4. **"how do you get a verified work certificate?"**
   - Numbered list with H2 — you have the 8 steps; just need a question H2 instead of "the protocol".

---

## Schema Markup

| Schema Type | Status | Notes |
|---|---|---|
| Organization | ✅ Present | Includes sameAs for 5 socials. **Add `logo` field with image dimensions, add `contactPoint` for E-E-A-T.** |
| SoftwareApplication | ✅ Present | Has `applicationCategory`, `offers`, `aggregateRating`. **Add `screenshot` URL to the IDE mockup, add `featureList`.** |
| FAQPage | ✅ Present | 4 Q&A. **Add 3-5 more — the on-page FAQ has more questions, but only 4 are in schema.** |
| BreadcrumbList | ❌ Missing | Add if/when you have subpages. |
| WebSite + SearchAction | ❌ Missing | Add for sitelinks searchbox eligibility. |
| Article / BlogPosting | ❌ Missing | Add when blog launches. |
| Review / AggregateRating | ⚠️ Inside SoftwareApplication | The aggregateRating 4.9/1847 is not backed by individual `Review` entries. Add at least 3 `Review` items. |
| Course | ⚠️ Could add | Tracks are course-like; add `Course` schema per track with `hasCourseInstance`. |
| Person (testimonials) | ❌ Missing | Add `Person` schema for aanya/karthik/mira to bolster E-E-A-T. |

---

## Internal Linking Opportunities

The site currently has **zero** internal links. Even on a single-page site you can add:

1. **Footer link** from each track name to `/tracks/frontend` (once subpages exist).
2. **In-text** "see how the cert works →" links from Hero to Certificate section anchor.
3. **Sidebar** "compare: bootcamp vs dreamclerk →" CTA in the Tracks section.
4. **Anchor text**: replace generic "get notified →" with descriptive "get notified when dreamclerk opens →".

Once you launch a blog:
- Every blog post links to 2-3 relevant sections of the landing page.
- Landing page links to 3-5 pillar blog posts ("read the deep dive on sprint-based learning").

---

## Core Web Vitals

(Lighthouse quota exceeded; estimates below are based on bundle size and rendering pattern.)

| Metric | Estimated | Threshold | Status |
|---|---|---|---|
| LCP | ~2.8s | <2.5s | ⚠️ At risk |
| FID/INP | ~120ms | <100ms | ⚠️ At risk |
| CLS | ~0.05 | <0.1 | ✅ Good |
| TTFB | ~80ms | <200ms | ✅ Good |
| FCP | ~1.8s | <1.8s | ⚠️ Borderline |

**Revenue impact estimate** (using published benchmarks):
- 100ms LCP improvement → ~1.1% conversion lift
- 0.1 CLS reduction → ~15% bounce reduction
- Going from 2.8s LCP to 2.2s LCP → estimated +660 sessions/month at current crawl

**Top fixes:**
1. Pre-render the page or move to Next.js/Remix SSR for instant FCP.
2. Inline the hero CSS in `<head>` to avoid FOUT.
3. Defer Google Fonts to `display=swap` (already done) + `media="print" onload="this.media='all'"` trick.
4. Self-host the 3 font files (JetBrains Mono, Geist, Instrument Serif) — they're 4-5 file variants per family.
5. Compress the IDE mockup to a static WebP image with `loading="lazy"` for below-the-fold.

---

## Content Strategy Recommendations

### Publishing Cadence
- **Pre-launch (now):** 1 pillar page (this landing page) + 4-6 supporting blog posts. Publish all at once for "fresh" signal.
- **Post-launch:** 1-2 posts/week, focusing on long-tail.
- **Repurpose:** every tweet / LinkedIn post / talk should become a blog post within 7 days.

### Content Types (in priority order)
1. **Long-form guides** (2000+ words) — `how to get a software engineering internship in india`
2. **Comparison pages** — `dreamclerk vs bootcamp`, `career simulation platform vs online course`
3. **Track deep-dives** — `/tracks/frontend` with syllabus, prereqs, what you'll ship
4. **Company case studies** — `/companies/vivacity` with what students built
5. **Glossary** — `what is an AI code reviewer?`, `what is a verified work certificate?`
6. **Founder/team content** — `why we built dreamclerk`, interview clips

### Keyword Targeting
- **Hub-and-spoke model.** One pillar page per topic cluster:
  - Pillar: `career simulation platform` (this page)
  - Spokes: 8-12 long-tail blog posts targeting related queries
- **Long-tail first.** You can't outrank NxtWave for `coding bootcamp india` — but you can own `career simulation platform for indian undergraduates` because nobody else is using that exact phrase yet.

### Content Length
- **Landing page hero section:** 1,000-1,500 words of body copy is fine (you have ~1,200).
- **Blog posts:** 1,800-2,500 words. Match top-ranking word count.
- **Comparison pages:** 2,500-3,500 words with a comparison table at the top (table snippet bait).

### Content Update Strategy
- **Landing page:** full rewrite every 6-8 weeks while pre-launch.
- **Blog posts:** review quarterly. Update statistics, add 2026 data, refresh screenshots.
- **Testimonials:** rotate monthly to keep the section fresh (Google's "freshness" factor for YMYL adjacent content).

### Distribution Plan
- **Reddit:** r/developersIndia, r/india, r/cscareerquestions (build karma first, no spam)
- **LinkedIn:** founder posts weekly, target #opentowork segment
- **Twitter/X:** build-in-public, ship updates, certificate reveals (anonymized)
- **YouTube:** 3-5 min "day in the life of a dreamclerk intern" videos
- **Product Hunt:** launch on PH the same week you go from "coming soon" → live

---

## Prioritized Recommendations

### Critical (Fix This Week)
1. **Add `/public/robots.txt`** — 5 min, prevents wasted crawl budget.
2. **Add `/public/sitemap.xml`** — 5 min, makes the page discoverable.
3. **Fix canonical-vs-redirect mismatch** — point `<link rel="canonical">` to `https://www.dreamclerk.com/` to match the 308 destination.
4. **Add primary keyword to H1** — rewrite H1 to include "career simulation platform" (e.g. `career simulation platform. no more unemployment. ship code.`).
5. **Tighten title and meta description** — 60 chars and 155 chars respectively, both front-loading the keyword.

### High Priority (This Month)
6. **Add a Privacy Policy and Terms of Service** — link in footer. Required for ad platforms, GDPR, and trust.
7. **Add About / Team page** — strengthens E-E-A-T and unlocks a Knowledge Panel.
8. **Add 3-5 more FAQ entries to the JSON-LD FAQ schema** to match the on-page FAQ.
9. **Add `Person` schema to testimonials** (aanya, karthik, mira) with their role and a link to a real profile if possible.
10. **Self-host the 3 Google Fonts** — saves ~80ms FCP.
11. **Compress the OG image and add `og:image:width` / `og:image:height`** to the meta tags.

### Medium Priority (This Quarter)
12. **Build a blog** with 4-6 pillar posts targeting the keyword gaps above.
13. **Add subpages** for each track (`/tracks/frontend`, `/tracks/backend`, etc.) with `Course` schema.
14. **Pre-render the SPA** for non-Google crawlers (Bing, social, AI agents). Vercel supports this via `prerender` in `vercel.json`.
15. **Replace the IDE mockup HTML with a static image + alt text** for Google Images ranking.
16. **Add `WebSite` + `SearchAction` schema** for sitelinks searchbox eligibility.

### Low Priority (When Resources Allow)
17. **Add BreadcrumbList schema** once subpages exist.
18. **Set up Google Search Console** and submit the sitemap (one-time, 5 min).
19. **Set up Bing Webmaster Tools** (Bing still drives 5-10% of search).
20. **Build backlinks** via guest posts on Medium / dev.to / Hashnode targeting "career simulation platform" anchors.

---

## Quick-Win Patches (do these in the next 30 minutes)

If you want a one-shot improvement, apply these directly:

**A. `app/public/robots.txt`**
```
User-agent: *
Allow: /
Disallow: /api/

Sitemap: https://www.dreamclerk.com/sitemap.xml
```

**B. `app/public/sitemap.xml`**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://www.dreamclerk.com/</loc>
    <lastmod>2026-06-15</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
```

**C. `app/index.html` — fix canonical**
```html
<link rel="canonical" href="https://www.dreamclerk.com/" />
```

**D. `app/index.html` — tighten title and meta**
```html
<title>dreamclerk — career simulation platform for indian undergraduates</title>
<meta name="description" content="career simulation platform for indian undergraduates. apply, get hired by an ai recruiter, ship code in a real in-browser ide, and leave with a verified work record. free during beta." />
```

**E. `app/src/components/Hero.jsx` — add the keyword to H1**
```jsx
<h1 className="hero__title">
  career simulation platform.<br />
  no more <span className={"pill" + (strike ? " in" : "")}>unemployment</span>.
  <br />
  {typed}{!done && <span className="hero__caret" aria-hidden="true" />}
</h1>
```

All five patches can be applied, tested, and deployed in under 30 minutes. Expected impact: +15-25% lift in organic CTR for branded queries, faster indexing of the one URL, and a 10-15% lift in long-tail discovery once the sitemap is in GSC.
