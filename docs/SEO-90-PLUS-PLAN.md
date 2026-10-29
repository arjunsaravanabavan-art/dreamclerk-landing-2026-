# DreamClerk SEO 90+ Improvement Plan

Date: 2026-10-29
Repository: `arjunsaravanabavan-art/dreamclerk-landing-2026-`
Target: improve technical and on-page SEO, then verify with production measurements.

## Scope and scoring rules

A 90+ target is an acceptance goal, not a guaranteed ranking or score before testing. Track technical SEO, on-page quality, crawl/indexability, performance, and content quality separately. Do not treat rankings, traffic, or indexing as guaranteed outcomes.

## Changes in this branch

- Updated homepage title to: `DreamClerk | Project-Based Internships for Freshers`
- Updated homepage meta description to: `Build job-ready experience with DreamClerk. Work on practical projects, get AI-guided feedback, build your portfolio, and earn a verifiable work record. Explore the platform.`
- Kept the existing `www` canonical convention; verify that the apex hostname permanently redirects to `www` before changing host policy.
- This branch intentionally does not modify structured-data claims, URL routing, robots rules, or sitemap behavior without production validation.

## P0 — Technical blockers

- [ ] Confirm apex and www resolve to one preferred hostname with a single-hop permanent redirect.
- [ ] Verify homepage canonical, OG URL, Twitter URL, sitemap URLs, and internal links use the preferred hostname.
- [ ] Fetch live `/robots.txt`, `/sitemap.xml`, and `/feed.xml`; confirm status, content type, and valid XML/RSS. Remove sitemap declarations for endpoints that do not exist.
- [ ] Verify each key route returns its own prerendered HTML with a unique title, description, canonical, and indexable main content.
- [ ] Check for accidental `noindex`, blocked resources, soft 404s, redirect chains, broken internal links, and sitemap URLs returning non-200 responses.
- [ ] Validate structured data; remove inaccurate, unsupported, or non-visible claims and any review/rating markup without genuine qualifying evidence.

## P1 — Landing-page quality

- [ ] Confirm one clear H1 describing the product and intended audience.
- [ ] Ensure the first viewport explains what DreamClerk is, who it helps, what users do, and what outcome they can reasonably expect.
- [ ] Use descriptive H2s for workflow, tracks, proof of work, FAQs, and calls to action.
- [ ] Add contextual internal links from relevant blog posts to matching conversion pages; avoid generic or repetitive anchors.
- [ ] Audit image alt text, dimensions, responsive sizing, lazy-loading below the fold, and social preview image availability.
- [ ] Treat the meta keywords tag as optional; it is not a meaningful Google ranking lever.

## P1 — Performance and accessibility

- [ ] Run PageSpeed Insights / Lighthouse on mobile and desktop for the homepage and key landing pages.
- [ ] Target Core Web Vitals at the 75th percentile: LCP <= 2.5 s, INP <= 200 ms, CLS <= 0.1.
- [ ] Reduce render-blocking fonts/scripts, unnecessary JavaScript on the marketing shell, and oversized hero assets.
- [ ] Test keyboard navigation, accessible names, contrast, focus states, and heading order.

## P2 — Content and growth (weeks 2–4)

- [ ] Map one primary intent to each landing page; consolidate overlapping pages targeting the same query.
- [ ] Build content clusters around project-based internships, fresher portfolio/proof of work, and browser-based practical work.
- [ ] Ensure every article is accurate, original, dated appropriately, and links to a relevant product page.
- [ ] Support quantitative claims with evidence and distinguish learning tracks from confirmed vacancies, employer partnerships, and guaranteed employment.
- [ ] Review Search Console queries monthly; prioritize pages with high impressions but low CTR and queries where the page does not fully satisfy intent.

## Validation and release gates

- [ ] Build succeeds.
- [ ] Lint/tests pass where configured.
- [ ] Validate sitemap XML and JSON-LD with appropriate validators.
- [ ] Crawl production routes after deploy and compare response codes, canonical URLs, titles, descriptions, and indexability.
- [ ] Record actual mobile/desktop Lighthouse scores and Search Console baseline.
- [ ] Merge only after review; then verify production deployment and repeat smoke tests.

## Reporting template

| Metric | Baseline | Target | Evidence |
|---|---:|---:|---|
| Technical/on-page audit score | To measure | >= 90/100 | Dated crawl and checklist |
| Mobile Lighthouse SEO | To measure | 100 where feasible | Lighthouse report |
| Mobile performance | To measure | Improve against baseline | PageSpeed Insights |
| Valid sitemap URLs | To measure | 100% intended URLs | Sitemap crawl |
| Key pages with unique canonical/title/description | To measure | 100% | Production crawl |
| Indexed important pages | Search Console required | Improve against baseline | URL Inspection/indexing report |
| Organic clicks and non-branded impressions | Search Console required | Trend up over 28–90 days | Search Console export |

## Important limitation

A source-code change alone does not establish a 90+ SEO score. Production responses, performance measurements, and Search Console data are required to verify the result. SEO scores from different tools are not interchangeable.
