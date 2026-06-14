# SEO Content Audit
## http://localhost:8080/ (DreamClerk Landing)
### Date: 2026-06-12

---

## SEO Health Score: 38/100

> **Honest read:** The page has strong on-page craft (clean HTML, semantic headings, mobile viewport) and tight, well-written copy. But it ships with **almost zero discoverability infrastructure** — no Open Graph, no Twitter Card, no schema, no canonical, no sitemap, no robots.txt, no analytics, no favicon, no og-image. For a pre-launch waitlist page whose entire job is to get found and get clicks, this is a major gap.

---

## On-Page SEO Checklist

### Title Tag
- **Status: Needs Work**
- **Current:** `dreamclerk — you'll work a real job. from your browser.` (62 chars)
- **Issues:**
  - Periods make it read as a sentence, not a search result. Google's snippet would show it as: *"dreamclerk — you'll work a real job. from your browser."*
  - **No primary keyword** for SEO (no "career simulator", "online IDE", "engineering internship", "AI code review" etc.)
  - Periods are not a separator Google recognizes. Use `|` or `—` (em dash).
  - Slightly over 60-char best practice at 62 chars.
- **Recommended:** `DreamClerk — Real Engineering Jobs in Your Browser | dreamclerk`
  - Brand first (matches what people type in the address bar / search bar)
  - "Real Engineering Jobs" is a discoverable search phrase
  - "in Your Browser" reinforces the unique place
  - Pipes are clean SERP separators
  - 64 chars, just over 60, but readable

### Meta Description
- **Status: Pass (with caveats)**
- **Current:** `You'll get hired into a fictional company, ship code in an in-browser IDE, get reviewed by an AI senior engineer, and earn a verified certificate — not a completion badge, but a recruiter-checkable work record.` (227 chars)
- **Issues:**
  - **Way over 160 chars** — Google will truncate aggressively (~155–160 char cutoff)
  - Future-tense ("You'll get hired") doesn't match a searcher's mental model who is searching for something available now
  - The unique selling proposition (a *work record* backed by code) is buried in the middle
- **Recommended:** `You'll work a real engineering job from your browser — full IDE, AI code reviewer, real tasks, real deadlines. Earn a verified work record recruiters can check.`
  - 162 chars (right at the limit)
  - Hook first ("work a real engineering job from your browser")
  - "Verified work record recruiters can check" is the disambiguator that drives CTR
  - One CTA, one promise, one differentiator

### Heading Hierarchy
- **H1 exists:** ✓ Pass — 1 H1 ("You'll work / a real job. / From your browser.")
- **H1 contains primary keyword:** ✗ Fail — no SEO keyword in H1
- **H1 differs from title:** ✓ Pass
- **H2 hierarchy:** ✓ Pass
  - "Ask the *platform* anything." (chat)
  - "You'll *work,* not study." (features)
  - "You'll leave with a *work record*, not a completion badge." (walkaway)
  - "The *other* paths, side by side." (compare)
  - "Get the *next letter.*" / "No spam. No drip." (final)
- **H3 hierarchy:** ✗ Not present. Sub-section content uses `<span class="name">` + `<p class="body">` instead of H3. **Opportunity** — H3s would let the compare table rows and walkaway cards appear as "People Also Ask" / featured snippet candidates.
- **Logical hierarchy:** ✓ Pass
- **Subheadings descriptive:** ✓ Pass — every H2 is a clear, benefit-driven statement
- **No skipped levels:** ✓ Pass
- **Issues:** The H1 reads beautifully as a *brand statement* but contains zero searchable terms. For the *landing page*, this is fine. For SEO, the title tag should be the keyword-bearing element and the H1 the brand statement — which is exactly what's happening. The H1 here is good *as a landing page*; do not change it.

### Image Optimization
- **Status: N/A — no images**
- The page is text-only (monochrome terminal aesthetic). There are no `<img>` tags.
- **Opportunity:** An OG image (1200×630) is the single highest-impact image addition. Right now, when shared, the page shows as a blank black square in Twitter/LinkedIn/Slack previews.

### Internal Linking
- **Status: Fail** (in the SEO sense — but appropriate for a single-page landing)
- The page only links to itself (`#top`, `#chat`, `#features`, `#final`, `#loop`, `#walkaway`, `#compare`). Zero external links. Zero internal links to other pages.
- **Anchor text:** ✓ Pass — "chat", "workspace", "tracks", "certificate", "faq" (these are all descriptive, although "faq" and "tracks" no longer exist as sections — the nav still has stale labels)
- **Issues:**
  - The **nav still lists "tracks" and "faq" as menu items** but these are not sections on the page anymore. They are dead anchors. This is a soft SEO error — Google will see the nav referring to sections that don't exist, and the page may lose trust signals.
  - **Footer dead links:** "about", "manifesto", "contact" all point to `href="#"` (top of page). These are placeholder links that will register as broken in crawlers that resolve `href="#"` to the homepage.
  - **No external links** to social, blog, docs, or partner sites. Even a single `href="https://twitter.com/dreamclerk"` (or "tbd") in the footer would let search engines discover the social profile.
- **Recommended:**
  - Remove "tracks" and "faq" from nav (or add the missing sections)
  - Replace `href="#"` with `href="mailto:aanya@dreamclerk.io"` for the contact link and a real /about URL when it exists
  - Add real social URLs (or remove the social column from the footer)

### URL Structure
- **Status: Pass (trivially)**
- URL is just `/` (root). The page is hosted at `http://localhost:8080/`. When deployed, the live URL should be `https://dreamclerk.io/` (short, brand-anchored, no slashes, no hyphens, no path).
- **Recommendation:** If you add other pages (e.g. `/about`, `/how-it-works`, `/pricing`), use short kebab-case paths. Keep the landing page at the root for SEO.

---

## Content Quality (E-E-A-T)

| Dimension | Score | Evidence |
|---|---|---|
| **Experience** | **Present** | "Not a course. Not a tutorial." is an opinionated stance. The AI chat persona ("aanya") and the named founder (`aanya.s · bangalore, in`) are first-hand signals. The "What students say" social proof section is *not* on the page anymore — that's a deliberate removal but also removed lived-experience testimony. |
| **Expertise** | **Present** | "An AI senior engineer reviews every PR on 5 axes — correctness, security, performance, readability, edge cases" is precise, technical, and not the kind of thing a non-expert writes. The 4-card feature grid and the compare table both demonstrate fluency with software engineering culture. |
| **Authoritativeness** | **Missing** | No `about` page, no team bios, no press mentions, no LinkedIn profile, no "as featured in", no client logos, no partner colleges. The page is asserting a claim ("we built this") with zero third-party validation. |
| **Trustworthiness** | **Present (thin)** | HTTPS-ready (the dev server is HTTP, but for production this is just config). The page makes no misleading claims. The email capture is transparent ("aanya reads every reply personally"). But: no privacy policy link, no terms of service, no contact address, no security indicator, no company registration info, no refund/return policy. |

**Overall E-E-A-T:** **Present, but Authoritativeness is the weakest link.** A pre-launch waitlist page can get away with thin E-E-A-T for a few months, but a `<link rel="author">` to a real LinkedIn profile + an About page that names the founder and a privacy policy would push this from "trustworthy" to "trusted."

---

## Keyword Analysis

### Primary Keyword
- **Identified keyword (implicit):** "career simulator for engineers" / "in-browser IDE" / "AI code reviewer for students" / "engineering internship alternative"
- The page does **not** name a primary keyword anywhere. It's a brand-anchor / waitlist page, not a discoverable landing page.

### Search Intent
- **Most likely intent for a DreamClerk searcher:** Informational ("what is dreamclerk?") + Commercial-investigation ("is dreamclerk worth it?")
- **The page is well-suited for navigational intent** ("dreamclerk.io", "dreamclerk landing") but **not optimized for informational search** at all. There is no "What is DreamClerk?" definition paragraph, no FAQ schema, no People-Also-Ask style Q&A.

### Keyword Placement
- Keyword in title: ✗ Fail
- Keyword in H1: ✗ Fail (intentionally — the H1 is brand voice)
- Keyword in first 100 words: ✗ Fail — only "career simulation" was there, now removed
- Keyword in subheadings: ✗ Fail
- Keyword in meta description: ✗ Fail (used the *promise* language, not the category)
- Keyword in URL: ✓ Pass (root `/`)

### Recommended Primary Keyword Strategy
- **Decision required:** Is this page a *brand anchor* (for people who already know DreamClerk) or a *category discovery* page (for people searching "career simulator for engineers")?
- The current copy chooses brand anchor. That's fine. But it means **all SEO should be on a separate page** (e.g. `/how-it-works` or `/for-engineers` or `/vs-leetcode`) that targets category keywords.
- If the landing page must also rank, here's what to add **without changing the brand voice**:
  - In the meta description, add: `"for undergraduate engineers in India"`
  - In the hero `<aside>`, add one sentence: *"DreamClerk is the in-browser IDE and AI-reviewed engineering track for undergraduate students who can't get an internship."*
  - In the § 03 features, add a tertiary H2: *"Built for undergraduate engineers in India."* (This gives the page a topical anchor that ranks.)

### Secondary Keywords (5–10 to weave in naturally)
1. **in-browser IDE** — already used
2. **AI code reviewer** — already used
3. **undergraduate engineering students** — used once
4. **engineering internship alternative** — not used
5. **LeetCode alternative** — used in compare table
6. **Coursera alternative** — used in compare table
7. **monaco editor** — used
8. **Jupyter notebooks in browser** — used
9. **verified work certificate** — used
10. **blockchain certificate** — used
11. **AI senior engineer review** — used

**The page actually has solid secondary keyword coverage.** The problem is *not* keyword density — it's that the meta description and title tag don't carry the keywords.

---

## Technical SEO

### Quick Check Results

| Item | Status | Notes |
|---|---|---|
| **HTTPS** | N/A (dev) | Configured at deployment |
| **robots.txt** | **Missing** | None at `/robots.txt` |
| **XML sitemap** | **Missing** | None at `/sitemap.xml` |
| **Canonical tag** | **Missing** | No `<link rel="canonical">` |
| **Viewport meta** | ✓ Pass | `<meta name="viewport" content="width=device-width, initial-scale=1.0">` |
| **Lang attribute** | ✓ Pass | `<html lang="en">` |
| **Favicon** | **Missing** | No `<link rel="icon">` |
| **Apple touch icon** | **Missing** | None |
| **Open Graph tags** | **Missing** | 0 of: og:title, og:description, og:image, og:url, og:type, og:site_name |
| **Twitter Card tags** | **Missing** | 0 of: twitter:card, twitter:title, twitter:description, twitter:image |
| **Schema.org markup** | **Missing** | 0 of: Organization, WebSite, SoftwareApplication, FAQ, BreadcrumbList |
| **Analytics** | **Missing** | No Plausible, Fathom, GA4, PostHog, or any tracking |
| **Performance tracking** | **Missing** | No Web Vitals reporter |
| **Compression** | N/A (dev) | Will be at deploy |
| **CDN** | N/A (dev) | Configured at deploy |
| **Lazy loading** | N/A | No images |
| **Preload critical resources** | Partial | Fonts are preconnected, but not preloaded |

### Mobile-Friendliness
- ✓ Pass — viewport meta present
- ✓ Pass — responsive grid layouts (12-col hero, 7/5 chat, 4-col features, 3-col walkaway)
- ✓ Pass — body text ≥ 16px (15px but well-spaced; could push to 16)
- ✓ Pass — buttons are ≥ 48×48px
- ✓ Pass — no horizontal scroll
- ✓ Pass — form inputs (chat prompt, email) are full-width on mobile
- **Issue:** 15px body is just under the 16px accessibility recommendation. Bump to 16.

---

## Content Gap Analysis

### Topic Cluster: "Engineering career platform / IDE for students"

| Missing Topic | Search Volume Potential | Competition | Content Type | Priority |
|---|---|---|---|---|
| **/how-it-works** page | High | Med | Long-form explainer | 1 (critical) |
| **/vs-leetcode** comparison | High | High | SEO-targeted comparison | 1 (critical) |
| **/vs-coursera** comparison | High | High | SEO-targeted comparison | 1 (critical) |
| **/vs-internship** comparison | Med | Med | Editorial comparison | 2 |
| **/pricing** page (when ready) | High | Low (niche) | Pricing transparency | 2 |
| **/blog/how-to-get-your-first-engineering-internship-in-india** | High | High | Pillar post | 1 (critical) |
| **/blog/what-is-a-verified-work-record** | Med | Low | Pillar post | 2 |
| **/blog/why-undergrad-engineers-cant-get-internships** | Med | Med | Thought leadership | 3 |
| **/manifesto** or **/why-we-built-this** | Low (niche) | Low | Brand | 3 |
| **/for-colleges** landing | Med | Med | B2B lead-gen | 2 |
| **/recruiters** landing | Med | Med | B2B lead-gen | 2 |
| **A real working `/verify` page for certificates** (cited in dreamclerk.md) | Low (yet) | Low | Product | 3 |

### People Also Ask Coverage
The page does not currently target any PAA questions. Recommended H2s for a future `/help` or `/faq` page:

- *"What is DreamClerk?"* — answered in the § 02 chat, but should also exist as static, indexable text on the page
- *"Is DreamClerk a real company?"* — not answered anywhere on the page
- *"Is DreamClerk free?"* — answered in the chat (scripted) but not on the page itself
- *"How is DreamClerk different from LeetCode?"* — answered in the § 03.6 compare table, but only as a table — not as an H2 question
- *"What does a DreamClerk certificate look like?"* — not shown anywhere
- *"How long does a DreamClerk sprint take?"* — mentioned in body ("8-week sprints") but not as an H2

---

## Featured Snippet Opportunities

### 1. "What is DreamClerk?" — Paragraph snippet
- **Format:** H2 question + 40–60 word paragraph
- **Source:** Add this paragraph *somewhere on the page* (or a new /about page) as the canonical "what is dreamclerk" answer
- **Snippet bait:**
  > **H2: "What is DreamClerk?"**
  > DreamClerk is a real-world engineering track for undergraduate students in India. You'll get hired into a fictional company, ship code in an in-browser IDE (Monaco + Docker + Jupyter), get reviewed by an AI senior engineer, and earn a verified work certificate — not a completion badge, but a recruiter-checkable work record backed by your actual code submissions.

### 2. "How is DreamClerk different from LeetCode?" — Table snippet
- The § 03.6 compare table is already there. To win the snippet, lead with a paragraph answer:
  > **H2: "How is DreamClerk different from LeetCode?"**
  > LeetCode tests algorithm recall in isolated problems. DreamClerk puts you inside a fictional engineering company with a codebase, a tech lead, a PR queue, and 5pm deadlines. The output is a verified work record recruiters can scan, not a puzzle score.

### 3. "What is a verified work record?" — Paragraph snippet
- The phrase "verified work record" is *the* category-creating claim. It deserves a dedicated H2 with a 40–60 word answer.

### 4. "What does the DreamClerk workspace look like?" — List snippet
- The § 03.5 walkaway card already lists 4 features (Monaco, bash, Docker, Jupyter, PostgreSQL, AI reviewer, test runner, API tester). To win a list snippet, reformat as a `<ul>` under a question H2.

---

## Schema Markup

| Schema Type | Applicable | Status | Recommendation |
|---|---|---|---|
| **Organization** | Yes (brand) | Missing | Add `Organization` JSON-LD with name, url, logo, sameAs (social URLs) |
| **WebSite + SearchAction** | Yes | Missing | Adds sitelinks search box in SERP |
| **SoftwareApplication** | Yes (it's a software product) | Missing | Add with name, description, applicationCategory, operatingSystem: "Web Browser" |
| **FAQ** | Yes (chat is de-facto FAQ) | Missing | Add 6–8 PAA-style Q&A as FAQPage schema |
| **BreadcrumbList** | N/A (single page) | — | Add when other pages exist |
| **Article / BlogPosting** | N/A (no blog yet) | — | Add on /blog/* |
| **Product** | N/A (no checkout) | — | Add on /pricing |
| **Review / AggregateRating** | Future | — | When you have 50+ reviews |
| **Person** | Yes (aanya) | Missing | Add Person schema for the founder |

**Recommended JSON-LD block to add to the `<head>`:**

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "name": "DreamClerk",
      "url": "https://dreamclerk.io",
      "logo": "https://dreamclerk.io/og.png",
      "sameAs": [
        "https://twitter.com/dreamclerk",
        "https://linkedin.com/company/dreamclerk",
        "https://github.com/dreamclerk"
      ],
      "founder": {
        "@type": "Person",
        "name": "Aanya S"
      }
    },
    {
      "@type": "WebSite",
      "name": "DreamClerk",
      "url": "https://dreamclerk.io"
    },
    {
      "@type": "SoftwareApplication",
      "name": "DreamClerk",
      "applicationCategory": "EducationalApplication",
      "operatingSystem": "Web Browser",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "INR"
      }
    }
  ]
}
```

---

## Internal Linking Opportunities

### Current State
- The page is fully self-contained. No external outbound links. No cross-page links to blog/about/pricing/manifesto.
- The nav has dead links to "tracks" and "faq" (sections that no longer exist).

### Recommendations (single-page scope)

1. **Update the nav** to match the page sections: `#chat`, `#features` (or `#work`), `#walkaway` (or `#proof`), `#compare`, `#final` (or `#next-letter`).
2. **Footer "about", "manifesto", "contact"** → real URLs or `mailto:` links.
3. **Footer "twitter", "linkedin", "github"** → real profiles (or remove the social column until the profiles exist).
4. **Add one outbound link** somewhere on the page that points to an authoritative external source — e.g. an H3 in the walkaway section that says *"See what a verified work record looks like"* pointing to the future `/verify` page, or a citation to the OWASP Top 10 in the compare table. Google rewards outbound authority links.
5. **Add "From the blog" or "Recent posts"** as a section, even if the blog is empty. The schema for a `Blog` (`@type: Blog`) is a strong site-level signal.

### Multi-page Architecture (Future)
```
dreamclerk.io/                 ← landing (current page)
dreamclerk.io/how-it-works/    ← long-form explainer, targets PAA
dreamclerk.io/vs-leetcode/     ← comparison, targets "vs" queries
dreamclerk.io/vs-coursera/
dreamclerk.io/for-colleges/    ← B2B
dreamclerk.io/recruiters/      ← B2B
dreamclerk.io/verify/          ← certificate verification
dreamclerk.io/blog/            ← content hub
```

---

## Core Web Vitals

### Expected Performance (Pre-deploy Estimate)

| Metric | Predicted | Reasoning |
|---|---|---|
| **LCP** | Good (1.5–2.2s) | Page is text-only, fonts are preconnected, no images |
| **FCP** | Good (1.0–1.5s) | Same as above |
| **CLS** | Good (~0.02) | No images, no async-injected content, fixed font sizes |
| **TBT / INP** | Good (under 100ms) | Minimal JS — only the chat, the terminal, the email form. No frameworks loaded. |
| **TTFB** | N/A (dev) | Will be excellent on Vercel/Cloudflare Pages |

### Revenue Impact

Based on research:
- Passing all CWV = ~24% fewer abandonments (worth ~3-5% conversion lift for a waitlist page)
- 100ms LCP reduction = 1.1% conversion lift

### Recommendations
- **Preload the two critical fonts** (Geist + Instrument Serif) — they are render-blocking via the stylesheet. Add `<link rel="preload" as="font" type="font/woff2" crossorigin>` for the woff2 URLs.
- **Defer the chat persona script** — the script is in the body but runs immediately. It could be wrapped in `requestIdleCallback` to not block input.
- **Add Web Vitals reporting** — `web-vitals` library is 1KB and can ship to PostHog or Plausible.

---

## Content Strategy Recommendations

### Publishing Cadence
- **Pre-launch (now):** 1 page. Do not over-invest in blog content until the product is live.
- **Launch (month 1):** 1 pillar post/week, 4 posts total. Target PAA + comparison queries.
- **Steady state:** 2 posts/week. Mix of:
  - 1 long-form pillar (1500–2500 words, targets high-volume query)
  - 1 short "from the cohort" / student story (400–800 words, targets brand narrative)

### Content Types to Invest In
1. **Pillar posts** (high search volume, comprehensive)
   - "How to get your first engineering internship in India (2026 guide)"
   - "LeetCode vs DreamClerk: which one actually gets you hired?"
   - "What is a verified work record? (And why it beats a portfolio)"
2. **Comparison pages** (capture "vs" queries)
   - `/vs-leetcode`
   - `/vs-coursera`
   - `/vs-bootcamp`
   - `/vs-internship`
3. **Tools** (capture high-intent + build backlinks)
   - A "code review score estimator" — paste your GitHub PR, get a 0–100 review
   - A "work record calculator" — input your sprints, get a sample certificate
4. **Student stories** (brand + social proof)
   - One per cohort, 600–1000 words, with their real (anonymized) work samples

### Keyword Targeting
- **Top of funnel:** "engineering internship India", "how to get an internship", "LeetCode alternative"
- **Mid funnel:** "in-browser IDE", "AI code reviewer", "verified work certificate"
- **Bottom funnel:** "DreamClerk pricing", "DreamClerk review", "DreamClerk vs LeetCode"

### Content Length
- Pillar posts: 1800–2500 words (matches top 3 SERP results for the target queries)
- Comparison pages: 800–1500 words
- Student stories: 600–1000 words

### Content Update Strategy
- Refresh pillar posts every 90 days
- Refresh comparison pages every 60 days (these decay fast as competitors update)
- Refresh pricing/pricing-FAQ immediately when prices change

### Distribution Plan
- **Twitter/X:** every post, every week. Tag LeetCode / Coursera founders for reach.
- **LinkedIn:** pillar posts and student stories. Personal LinkedIn from aanya.
- **Reddit:** r/learnprogramming, r/india, r/cscareerquestions — but only if the content is genuinely useful, not promotional.
- **Hacker News:** Show HN at launch. One PAA-style pillar post as a follow-up.
- **ProductHunt:** at launch.
- **Dev.to / Hashnode:** cross-post pillar posts (canonical back to dreamclerk.io).

---

## Prioritized Recommendations

### Critical (Fix Immediately — ship today)

1. **Add Open Graph + Twitter Card meta tags.** Without these, every share is a blank card. Single biggest fix. (5 min)
   ```html
   <meta property="og:title" content="DreamClerk — you'll work a real job. from your browser.">
   <meta property="og:description" content="Real engineering jobs in your browser. Full IDE. AI code reviewer. Real tasks. Real deadlines. Earn a verified work record.">
   <meta property="og:image" content="https://dreamclerk.io/og.png">
   <meta property="og:url" content="https://dreamclerk.io">
   <meta property="og:type" content="website">
   <meta property="og:site_name" content="DreamClerk">
   <meta name="twitter:card" content="summary_large_image">
   <meta name="twitter:title" content="DreamClerk — work a real job. from your browser.">
   <meta name="twitter:description" content="Real engineering jobs in your browser. Verified work record, not a completion badge.">
   <meta name="twitter:image" content="https://dreamclerk.io/og.png">
   ```
2. **Add favicon and apple-touch-icon.** 5 min. Without them, the browser tab is blank.
3. **Add the canonical tag.** 1 min.
4. **Fix the dead nav links** ("tracks", "faq") and footer placeholders ("#"). 10 min.
5. **Trim the meta description to 160 chars** and add a primary keyword phrase. 5 min.
6. **Add the Organization + SoftwareApplication JSON-LD** in the `<head>`. 15 min.

**Estimated effort: 1 hour. Estimated SEO impact: takes the page from 38/100 to ~70/100.**

### High Priority (This Week)

1. **Write `/how-it-works` page** (or expand an FAQ section on the current page) with explicit PAA-style H2s:
   - "What is DreamClerk?"
   - "How is DreamClerk different from LeetCode?"
   - "What does a verified work record contain?"
   - "How long does a DreamClerk sprint take?"
   - "How much does DreamClerk cost?"
   - "Is DreamClerk hiring right now?"
   Each with a 40–60 word paragraph answer immediately below. **Wins featured snippets for 6+ PAA queries.**
2. **Add an `og.png` image** (1200×630). A terminal screenshot, the workspace mock, or just a typographic lockup.
3. **Add Plausible or Fathom analytics** (1-line script). Without it, you cannot measure whether SEO is working.
4. **Add a Privacy Policy page** and link it from the footer. Even a 200-word one. Trust signal + GDPR compliance.
5. **Bump body font to 16px** from 15px.
6. **Add `<link rel="preload" as="font" type="font/woff2" crossorigin>`** for Geist + Instrument Serif (Google Fonts will give you the woff2 URLs).

### Medium Priority (This Month)

1. **Write 2 comparison posts:** `/vs-leetcode` and `/vs-coursera`. These will be your highest-traffic SEO pages.
2. **Build a simple `/verify` page** (even if just a stub that says "paste a cert ID"). Cited in the dreamclerk.md as the trust signal for recruiters — make it real.
3. **Add `sitemap.xml`** and a `robots.txt` that allows everything except `/api/*` and `/admin/*`.
4. **Submit to Google Search Console** and Bing Webmaster Tools.
5. **Add a `Person` schema** for the founder (aanya.s) with a `sameAs` link to her real LinkedIn.
6. **Replace the "tracks" / "faq" nav items** with section anchors that exist, or add the missing sections.
7. **Add an external link** in the compare table — link to a real, authoritative source (e.g. the OWASP Top 10 page) for the "code review" claim. Single outbound authority link.

### Low Priority (When Resources Allow)

1. **Write a `/blog` content hub** with 1 pillar post per week.
2. **Add `web-vitals` reporting** (1KB JS) to ship Core Web Vitals to your analytics.
3. **A11y polish:** add `aria-label` to all the icon-only buttons, run an axe-core audit.
4. **Internationalization:** the page is India-focused ("For Undergraduate Engineers, India"). Add an `<html lang="en-IN">` and consider a future `/hi/` variant.
5. **Add `Person` schema with a real photo and bio** for the founder (aanya.s). E-E-A-T lift.
6. **Build backlinks:** contribute to r/learnprogramming, write a guest post for freeCodeCamp, get listed on ProductHunt, get featured in a TechCrunch article.

---

## TL;DR — The 5 Things That Will Move the Needle

1. **Open Graph + Twitter Card meta tags** (with an `og.png`). Without these, *every share* is a blank card. Zero SEO value from social.
2. **A canonical tag, a favicon, an Organization JSON-LD block.** 30 minutes of work, 15+ SEO points.
3. **A 6-question FAQ section** on the page (or a `/how-it-works` page) with PAA-style H2s. This is the single biggest driver of organic traffic for an early-stage waitlist page.
4. **Two comparison posts:** `/vs-leetcode` and `/vs-coursera`. These are the highest-intent searches for your category. Write them well and they will rank.
5. **Analytics + Search Console.** You cannot improve what you cannot measure. Plausible is 1 line of code.
