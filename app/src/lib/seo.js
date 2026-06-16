// useSEO — per-page SEO updater.
// Updates document.title, meta description, canonical, OG, Twitter, and
// injects a JSON-LD blob for the page. Re-uses one JSON-LD script element
// (id = "dc-jsonld") so we don't leak scripts when navigating between pages.

import { useEffect } from "react";

const SITE = "https://www.dreamclerk.com";
const DEFAULT_TITLE = "dreamclerk — a real job in your browser";
const DEFAULT_DESC = "a real job in your browser. apply, get hired by an ai recruiter, ship code in a real in-browser ide, get reviewed, and leave with a verified work record. free during beta.";

const TAG = (sel) => document.head.querySelector(sel);

function setMeta(sel, attr, val) {
  let el = TAG(sel);
  if (!el) {
    el = document.createElement(sel.startsWith("meta") ? "meta" : "link");
    if (sel.startsWith("meta[name=\"")) {
      el.setAttribute("name", sel.match(/meta\[name="([^"]+)"\]/)[1]);
    }
    document.head.appendChild(el);
  }
  el.setAttribute(attr, val);
}

function setLink(sel, attr, val) {
  let el = TAG(sel);
  if (!el) {
    el = document.createElement("link");
    if (sel.startsWith("link[rel=\"")) el.setAttribute("rel", sel.match(/link\[rel="([^"]+)"\]/)[1]);
    document.head.appendChild(el);
  }
  el.setAttribute(attr, val);
}

function setJsonLd(json) {
  let el = document.getElementById("dc-jsonld-page");
  if (!el) {
    el = document.createElement("script");
    el.type = "application/ld+json";
    el.id = "dc-jsonld-page";
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(json);
}

export function useSEO({
  title,
  description = DEFAULT_DESC,
  path = "/",                 // URL path WITHOUT the leading #
  ogImage = `${SITE}/og.png`,
  type = "website",
  jsonLd = null,
  keywords = null,
} = {}) {
  useEffect(() => {
    const fullTitle = title ? `${title} — dreamclerk` : DEFAULT_TITLE;
    document.title = fullTitle;

    setMeta('meta[name="title"]', "content", fullTitle);
    setMeta('meta[name="description"]', "content", description);
    if (keywords) setMeta('meta[name="keywords"]', "content", keywords);

    const url = `${SITE}/${path === "/" ? "" : path}`;
    setLink('link[rel="canonical"]', "href", url);
    setMeta('meta[property="og:url"]', "content", url);
    setMeta('meta[property="og:title"]', "content", fullTitle);
    setMeta('meta[property="og:description"]', "content", description);
    setMeta('meta[property="og:image"]', "content", ogImage);
    setMeta('meta[property="og:type"]', "content", type);
    setMeta('meta[name="twitter:url"]', "content", url);
    setMeta('meta[name="twitter:title"]', "content", fullTitle);
    setMeta('meta[name="twitter:description"]', "content", description);
    setMeta('meta[name="twitter:image"]', "content", ogImage);

    if (jsonLd) setJsonLd(jsonLd);
    else {
      // remove the page-level jsonld when the page provides none
      const el = document.getElementById("dc-jsonld-page");
      if (el) el.remove();
    }
  }, [title, description, path, ogImage, type, keywords, jsonLd && JSON.stringify(jsonLd)]);
}

// Pre-baked JSON-LD payloads for the 5 sub-pages
export const SEO = {
  landing: {
    title: null, // uses default
    description: DEFAULT_DESC,
    path: "/",
    keywords: "career simulation platform, in-browser ide, ai recruiter, verified work record, india undergraduate internship, dreamclerk",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Course",
      "name": "dreamclerk — 8-week engineering internship, in browser",
      "description": "an 8-week, project-based, mentor-augmented engineering internship. ship real code, get reviewed, leave with a signed certificate.",
      "provider": { "@type": "Organization", "name": "dreamclerk", "sameAs": "https://www.dreamclerk.com" },
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR", "availability": "https://schema.org/InStock" },
    },
  },
  how: {
    title: "how it works",
    description: "the 8-step protocol. apply → interview → offer → onboard → 5 sprints of prs → capstone → review round → certificate. real prs, real reviews, real incidents.",
    path: "/how",
    keywords: "dreamclerk how it works, 8 week protocol, capstone, sprint based learning, pr review, internship timeline",
  },
  workspace: {
    title: "workspace",
    description: "8 tracks · 24 gigs · monaco editor, sandboxed terminal, kubernetes, figma canvas, tally-style ledger, tds challans, and more. the full in-browser work surface, with arrow-key navigation between surfaces.",
    path: "/workspace",
    keywords: "in-browser ide, monaco editor, sandboxed terminal, kubernetes playground, figma canvas, tally ledger, gstr-1, dbt, airflow, ai ml notebook",
  },
  tracks: {
    title: "tracks",
    description: "6 tracks. frontend, ai/ml, backend, data, platform / sre, security. each track has an 8-sprint plan, a capstone, and a hiring partner. 1 sprint = 5–8 tickets. ship to production.",
    path: "/tracks",
    keywords: "engineering tracks, frontend track, backend track, ai ml track, data engineering, platform sre, application security, internship tracks india",
  },
  companies: {
    title: "companies",
    description: "6 simulated companies. fintech, b2b saas, ai infra, consumer ai, data warehouse, appsec. each has a real bug to ship, a real tech lead, and a real ticket queue. pick one for sprint 1.",
    path: "/companies",
    keywords: "simulated companies, internship employers, fintech, b2b saas, ai infra, consumer ai, warehouse observability, appsec",
  },
  faq: {
    title: "faq",
    description: "19 questions about dreamclerk — basics, hiring, the ai recruiter, logistics. visible on load. no click-to-open. rubric + bias audit + cohort data all linked.",
    path: "/faq",
    keywords: "dreamclerk faq, is it free, is dreamclerk a real internship, what does the certificate show, hiring partners, interview rubric",
  },
  blog: {
    title: "blog",
    description: "field notes from building dreamclerk. the data, the rejects, the rubric changes. nothing polished after the fact.",
    path: "/blog",
    keywords: "dreamclerk blog, hiring data, cohort outcomes, bias audit, internship certificate",
  },
  blogPost: (post) => {
    // Person vs Organization author schema — picked by presence of post.author_person.
    // Older launch posts use Organization (the "dreamclerk team" voice);
    // fresher-series posts use a named Person with sameAs links.
    const authorSchema = post.author_person
      ? {
          "@type": "Person",
          name: post.author_person.name,
          url: post.author_person.sameAs && post.author_person.sameAs[0],
          sameAs: post.author_person.sameAs,
          jobTitle: post.author_person.role,
          description: post.author_person.bio,
        }
      : { "@type": "Organization", name: post.author_name || "dreamclerk team" };
    const jsonLd = [
      {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": post.title,
        "description": post.excerpt,
        "author": authorSchema,
        "publisher": {
          "@type": "Organization",
          "name": "dreamclerk",
          "logo": { "@type": "ImageObject", "url": `${SITE}/publisher-logo.png` },
        },
        "datePublished": post.published_at || post.created_at,
        "dateModified": post.updated_at || post.published_at || post.created_at,
        "mainEntityOfPage": { "@type": "WebPage", "@id": `${SITE}/blog/${post.slug}` },
        "image": post.cover_image || `${SITE}/og.png`,
        "keywords": (post.tags || []).join(", "),
        "articleSection": "engineering hiring",
        "inLanguage": "en-IN",
        "isAccessibleForFree": true,
        // Per-post outbound links → "isBasedOn" for citation trail.
        // (Schema.org: Article.isBasedOn accepts a CreativeWork array.)
        ...(post.outbound_links && post.outbound_links.length
          ? { isBasedOn: post.outbound_links.map((l) => ({ "@type": "WebPage", url: l.href, name: l.label })) }
          : {}),
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "home", "item": `${SITE}/` },
          { "@type": "ListItem", "position": 2, "name": "blog", "item": `${SITE}/blog` },
          { "@type": "ListItem", "position": 3, "name": post.title, "item": `${SITE}/blog/${post.slug}` },
        ],
      },
    ];
    // Optional FAQPage schema for posts that ship a faq[] array.
    // Renders into a <script type="application/ld+json"> via the existing
    // useSEO() jsonLd injection pipeline.
    if (post.faq && post.faq.length) {
      jsonLd.push({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": post.faq.map((f) => ({
          "@type": "Question",
          "name": f.q,
          "acceptedAnswer": { "@type": "Answer", "text": f.a },
        })),
      });
    }
    return {
      title: post.title,
      description: post.excerpt || post.title,
      path: `/blog/${post.slug}`,
      type: "article",
      jsonLd,
    };
  },
  blogList: (posts) => ({
    title: "blog",
    description: "field notes from building dreamclerk. the data, the rejects, the rubric changes. nothing polished after the fact.",
    path: "/blog",
    keywords: "dreamclerk blog, hiring data, cohort outcomes, bias audit, internship certificate, coding interview, in-browser ide",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "DreamClerk blog",
      "itemListOrder": "https://schema.org/ItemListOrderDescending",
      "itemListElement": (posts || []).map((p, i) => ({
        "@type": "ListItem",
        "position": i + 1,
        "url": `${SITE}/blog/${p.slug}`,
        "name": p.title,
      })),
    },
  }),
  faqPage: {
    title: "faq",
    description: "19 questions about dreamclerk — basics, hiring, the ai recruiter, logistics. visible on load. no click-to-open. rubric + bias audit + cohort data all linked.",
    path: "/faq",
    keywords: "dreamclerk faq, is it free, is dreamclerk a real internship, what does the certificate show, hiring partners, interview rubric",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "home", "item": `${SITE}/` },
        { "@type": "ListItem", "position": 2, "name": "faq", "item": `${SITE}/faq` },
      ],
    },
  },
  faqSchema: (questions) => ({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": questions.map((qa) => ({
      "@type": "Question",
      "name": qa.q,
      "acceptedAnswer": { "@type": "Answer", "text": qa.a },
    })),
  }),
};
