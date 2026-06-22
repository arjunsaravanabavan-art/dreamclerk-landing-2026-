# GSC Re-Indexing — step-by-step with visual guide

**What you need to do**: re-submit your URLs to Google so the SERP snippets (titles + descriptions) update from the old "Monetize Your College Experience" cache to the current "a real job in your browser" copy.

**Tool**: Google Search Console (`https://search.google.com/search-console`)

**Limit**: Google allows ~12 URL indexing requests per day, one at a time. Plan: 3 days for the 34 sitemap URLs.

---

## Where to paste the URL — the URL Inspection bar

After you log in to GSC, you'll see this layout. The URL Inspection bar is the **long input field at the very top of the page**, above all navigation:

```
┌────────────────────────────────────────────────────────────────────┐
│ 🔍 DreamClerk ▼                                                    │  ← property selector
├────────────────────────────────────────────────────────────────────┤
│ 🔎 [ https://www.dreamclerk.com/                       ] [Enter]  │  ← THIS is where you paste
├────────────────────────────────────────────────────────────────────┤
│  Overview  URL Inspection  Performance  Indexing  ...             │  ← navigation tabs
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  Dashboard cards go here                                           │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

**The URL Inspection bar is:**
- At the **top of the page** (above the tabs)
- The **placeholder text** says `Inspect any URL in "https://www.dreamclerk.com/"`
- The property selector chip on the left (with your site name) confirms which property you'll index against — leave it on `https://www.dreamclerk.com/`

**Common confusion**: the GSC page also has a left sidebar with "URL Inspection" as a nav item. **That's NOT the input bar** — clicking it just opens the right-side panel. You want the **input field at the top of the page**.

---

## What happens after you paste a URL

After you press Enter, GSC shows the inspection result page:

```
┌────────────────────────────────────────────────────────────────────┐
│  https://www.dreamclerk.com/                                       │  ← the URL you just inspected
│  ─────────────────────────────────────────────────────             │
│  Coverage     Discovery     Indexing     Crawl     Mobile Usability│  ← status pills
│  ✅ indexed                                                       │
│                                                                    │
│  [ REQUEST INDEXING ]    ← green button, top right                 │
└────────────────────────────────────────────────────────────────────┘
```

Click the **green `REQUEST INDEXING`** button (top-right of the inspection result).

GSC will then say `Indexing requested` for ~1 minute, then `Crawled` (if Google already had it) or `Crawled - not indexed` (rare for a site you own).

**Repeat for all 12 URLs today.** Move to the next URL by pasting it in the same top bar.

---

## Today's batch (12 URLs, in priority order)

Run this command to print today's batch:

```bash
node scripts/gsc-batch-index.mjs --day 1
```

| # | URL | Priority |
|---|---|---|
| 1 | `https://www.dreamclerk.com/` | highest — homepage |
| 2 | `https://www.dreamclerk.com/how` | main page |
| 3 | `https://www.dreamclerk.com/workspace` | main page |
| 4 | `https://www.dreamclerk.com/tracks` | main page |
| 5 | `https://www.dreamclerk.com/companies` | main page |
| 6 | `https://www.dreamclerk.com/faq` | main page |
| 7 | `https://www.dreamclerk.com/blog` | main page |
| 8 | `https://www.dreamclerk.com/about` | main page |
| 9 | `https://www.dreamclerk.com/contact` | main page |
| 10 | `https://www.dreamclerk.com/privacy` | main page |
| 11 | `https://www.dreamclerk.com/terms` | main page |
| 12 | `https://www.dreamclerk.com/blog/why-we-built-dreamclerk` | top blog post |

Tomorrow:
```bash
node scripts/gsc-batch-index.mjs --day 2
```

---

## After 3 days of submissions

Within **24-48 hours** of the first batch, search Google for `dreamclerk` and you'll see updated snippets:

| Old (current SERP cache) | New (after re-index) |
|---|---|
| "About Us - Dreamclerk - Monetize Your College Experience" | "**a real job in your browser — dreamclerk**" |
| "An AI-powered data marketplace where students can share their college experiences" | "**a real job in your browser. apply, get hired by an ai recruiter, ship code in a real in-browser ide, get reviewed, and leave with a verified work record. free during beta.**" |

The old copy is gone from your code — the snippets will catch up.

---

## Backup: if Request Indexing button is greyed out

Google sometimes disables Request Indexing for a property if:
- The URL is **not in your sitemap** (it is — we just rebuilt)
- The URL is **not the canonical version** (canonical is set correctly on every page)
- You've **exceeded the 12/day limit** (wait until tomorrow)
- The URL is **blocked by robots.txt** (yours isn't — check `https://www.dreamclerk.com/robots.txt`)

If it's greyed out, the URL is already considered "fresh" by Google (last crawl < 24h old). You can skip and move to the next.
