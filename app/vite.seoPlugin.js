// ─── Vite plugin: hardcode SEO routes into the static shell ────────────────
//
// Runs once at build time. Serializes 14 routes' SEO data + per-post
// BlogPosting JSON-LD into a <script id="__SEO_DATA__" type="application/json">
// block in <head>, plus a tiny inline IIFE that swaps <title>, <meta>,
// <link rel="canonical">, and <script type="application/ld+json"> on
// first paint based on location.pathname — before React hydrates.
//
// IMPORTANT: Vite's transformIndexHtml hook, when it returns a string,
// REPLACES the whole HTML. To inject, we must receive the html
// parameter and return html with our snippet spliced in. (Returning
// a bare string was the bug that made the previous build render blank.)

const HEAD_INJECT_TEMPLATE = `
<!-- /__SEO_DATA__ -->
<script id="__SEO_DATA__" type="application/json">__SEO_JSON__</script>
<script>
(function(){
  try {
    var data = JSON.parse(document.getElementById('__SEO_DATA__').textContent);
    var path = (location.pathname || '/').replace(/\\/$/, '') || '/';
    var r = data[path];
    if (!r) return;
    var url = 'https://www.dreamclerk.com' + (r.path === '/' ? '' : r.path);
    document.title = r.title;
    setMeta('description', r.description, true);
    setMeta('keywords', r.keywords, true);
    setLink('canonical', url);
    setMeta('og:url', url, false);
    setMeta('og:title', r.title, false);
    setMeta('og:description', r.description, false);
    setMeta('twitter:url', url, false);
    setMeta('twitter:title', r.title, false);
    setMeta('twitter:description', r.description, false);
    if (r.jsonLd) {
      var scripts = document.querySelectorAll('script[type="application/ld+json"]');
      scripts.forEach(function(s){
        try {
          var j = JSON.parse(s.textContent);
          if (j && (j['@type'] === 'BlogPosting' || j['@type'] === 'BreadcrumbList' || j['@type'] === 'FAQPage')) s.setAttribute('data-seo-replace', '1');
        } catch(e){}
      });
      r.jsonLd.forEach(function(payload){
        var s = document.createElement('script');
        s.type = 'application/ld+json';
        s.textContent = JSON.stringify(payload);
        document.head.appendChild(s);
      });
    }
  } catch (e) { /* silent */ }
  function setMeta(name, value, byName){
    if (!value) return;
    var attr = byName ? 'name' : 'property';
    var sel = byName ? 'meta[name="' + name + '"]' : 'meta[property="' + name + '"]';
    var el = document.head.querySelector(sel);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attr, name);
      document.head.appendChild(el);
    }
    el.setAttribute('content', value);
  }
  function setLink(rel, href){
    if (!href) return;
    var el = document.head.querySelector('link[rel="' + rel + '"]');
    if (!el) { el = document.createElement('link'); el.rel = rel; document.head.appendChild(el); }
    el.setAttribute('href', href);
  }
})();
</script>
<!-- /__SEO_DATA__ -->
`;

export default function seoInjectPlugin() {
  return {
    name: "dreamclerk-seo-inject",
    enforce: "pre",
    // Receive the original html and return the modified html — never
    // return a bare string (that replaces the whole file).
    transformIndexHtml(html) {
      const data = buildData();
      const json = JSON.stringify(data).replace(/</g, "\\u003c");
      const inject = HEAD_INJECT_TEMPLATE.replace("__SEO_JSON__", json);
      // Insert right before </head> so the IIFE runs after the parser
      // builds <head> but before the body paints. If </head> isn't
      // there for some reason, fall back to prepending.
      if (html.includes("</head>")) {
        return html.replace("</head>", inject + "</head>");
      }
      return inject + html;
    },
  };
}

function buildData() {
  // Mirrors src/lib/seoRoutes.js. Hardcoded so the build never fails
  // if that module is broken. Keep in sync with seedPosts.js.
  const SITE = "https://www.dreamclerk.com";
  const blogPosting = (p) => ({
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
        author: { "@type": "Organization", name: p.author },
        publisher: {
          "@type": "Organization",
          name: "dreamclerk",
          logo: { "@type": "ImageObject", url: SITE + "/logo.svg" },
        },
        datePublished: p.published_at,
        dateModified: p.updated_at || p.published_at,
        mainEntityOfPage: { "@type": "WebPage", "@id": SITE + p.path },
        image: SITE + "/og.png",
        keywords: p.keywords,
        articleSection: "engineering hiring",
        inLanguage: "en-IN",
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
  });
  return {
    "/": { path: "/", title: "dreamclerk — career simulation platform for indian undergraduates", description: "career simulation platform for indian undergraduates. apply, get hired by an ai recruiter, ship code in a real in-browser ide, get reviewed, and leave with a verified work record. free during beta.", keywords: "career simulation platform, in-browser ide, online code editor, monaco editor, ai code reviewer, verified work certificate, ai recruiter, virtual internship, undergraduate internship, software engineering internship, frontend engineering track, backend engineering track, ai ml engineering, data science track, full stack engineering, ship code get hired, no more unemployment, hireable after college, fresher hiring, coding interview prep, sprint based learning, ai mentor, pr review simulation, capstone project, tech internship without degree, work record certificate, dreamclerk" },
    "/how": { path: "/how", title: "how it works — 8 steps, real prs, signed certificate", description: "the 8-step protocol. apply → interview → offer → onboard → 5 sprints of prs → capstone → review round → certificate. real prs, real reviews, real incidents.", keywords: "dreamclerk how it works, 8 week protocol, capstone, sprint based learning, pr review, internship timeline, indian undergraduate internship" },
    "/workspace": { path: "/workspace", title: "workspace — in-browser ide, terminal, docker, sql, jupyter", description: "8 tracks · 24 gigs · monaco editor, sandboxed terminal, kubernetes, figma canvas, tally-style ledger, tds challans, and more. the full in-browser work surface.", keywords: "in-browser ide, monaco editor, sandboxed terminal, kubernetes playground, figma canvas, tally ledger, gstr-1, dbt, airflow, ai ml notebook, dreamclerk workspace" },
    "/tracks": { path: "/tracks", title: "tracks — frontend, backend, ai/ml, data, platform, security", description: "6 tracks. frontend, ai/ml, backend, data, platform / sre, security. each track has an 8-sprint plan, a capstone, and a hiring partner. 1 sprint = 5–8 tickets. ship to production.", keywords: "engineering tracks, frontend track, backend track, ai ml track, data engineering, platform sre, application security, internship tracks india, dreamclerk tracks" },
    "/companies": { path: "/companies", title: "companies — 6 simulated employers, real codebases", description: "6 simulated companies. fintech, b2b saas, ai infra, consumer ai, data warehouse, appsec. each has a real bug to ship, a real tech lead, and a real ticket queue. pick one for sprint 1.", keywords: "simulated companies, internship employers, fintech, b2b saas, ai infra, consumer ai, warehouse observability, appsec, dreamclerk companies" },
    "/faq": { path: "/faq", title: "faq — 19 questions, no click-to-open", description: "19 questions about dreamclerk — basics, hiring, the ai recruiter, logistics. visible on load. no click-to-open. rubric + bias audit + cohort data all linked.", keywords: "dreamclerk faq, is it free, is dreamclerk a real internship, what does the certificate show, hiring partners, interview rubric" },
    "/blog": { path: "/blog", title: "blog — field notes from building dreamclerk", description: "field notes from building dreamclerk. the data, the rejects, the rubric changes. nothing polished after the fact. cohort 1, cohort 2, and the rubric that came out of them.", keywords: "dreamclerk blog, hiring data, cohort outcomes, bias audit, internship certificate, coding interview, in-browser ide" },
    "/about": { path: "/about", title: "about — the team behind dreamclerk", description: "founded in chennai in 2025 by ananya, raghav, and priya. bootstrapped. never charging students what they can't pay. the team page, the advisors, the press, and the funding story.", keywords: "dreamclerk team, dreamclerk founders, dreamclerk about, chennai startup, indian startup, career simulation founders" },
    "/privacy": { path: "/privacy", title: "privacy — what we collect, what we don't", description: "we collect email + sprint data. we don't sell, we don't share with recruiters without permission, we don't keep a payment record after the cohort ends. full text in plain english.", keywords: "dreamclerk privacy, gdpr, indian data protection, career simulation data" },
    "/terms": { path: "/terms", title: "terms — what you agree to when you sign up", description: "the terms of use for dreamclerk. written in plain english, governed by the laws of india, reviewed every quarter. if we change them, we email you.", keywords: "dreamclerk terms, terms of service, indian contract law, dpdpa" },
    "/blog/why-we-built-dreamclerk": blogPosting({ path: "/blog/why-we-built-dreamclerk", title: "the 90-second internship interview that changed 14% of outcomes", description: "we ran a 90-second phone screen on 1,200 internship applicants. 14% got a callback. here is what we changed, and what we got wrong.", keywords: "interview prep, coding interview, 90 second interview, internship callback, dreamclerk founder notes, indian undergraduate hiring", author: "dreamclerk team", published_at: "2026-04-12T09:00:00.000Z", updated_at: "2026-05-04T09:00:00.000Z" }),
    "/blog/inside-our-bias-audit": blogPosting({ path: "/blog/inside-our-bias-audit", title: "inside our bias audit — the rubric, the data, the changes", description: "every quarter we run a bias audit on the dreamclerk interview. here is the rubric, the per-group pass-rates, and the three rubric changes we made after cohort 1.", keywords: "bias audit, hiring rubric, ai interview fairness, dreamclerk audit, gender gap, college tier, cohort 1 cohort 2", author: "dreamclerk team", published_at: "2026-05-04T09:00:00.000Z", updated_at: "2026-06-10T09:00:00.000Z" }),
    "/blog/coding-interview-with-no-experience": blogPosting({ path: "/blog/coding-interview-with-no-experience", title: "how to pass a coding interview with no experience", description: "no internships. no github. no leetcode streak. here is the 4-step protocol we built to prep dreamclerk applicants in 6 weeks — and what the data says about it.", keywords: "coding interview, no experience, fresher interview, internship prep, dreamclerk protocol, indian undergraduate coding, github no experience", author: "dreamclerk team", published_at: "2026-05-04T09:00:00.000Z", updated_at: "2026-05-04T09:00:00.000Z" }),
    "/blog/in-browser-ide-explained": blogPosting({ path: "/blog/in-browser-ide-explained", title: "the in-browser ide — what it actually runs, what it can't", description: "monaco on top of a webcontainer. 200ms cold start. 12mb of wasm. here is the architecture, the security model, and the 3 things it cannot do.", keywords: "in-browser ide, monaco editor, webcontainer, wasm ide, dreamclerk ide, browser ide security, sandboxed terminal", author: "dreamclerk team", published_at: "2026-06-10T09:00:00.000Z", updated_at: "2026-06-10T09:00:00.000Z" }),
    "/blog/shipping-code-vs-knowing-code": blogPosting({ path: "/blog/shipping-code-vs-knowing-code", title: "shipping code vs knowing code — a 5-minute glossary", description: "the 14 terms every dreamclerk applicant should be able to use in a sentence, with a worked example for each. bookmark this. re-read it before the interview.", keywords: "engineering glossary, pr review, code review, postmortem, sprint, capstone, tech lead, ai tech lead, cert, cohort, dreamclerk glossary", author: "dreamclerk team", published_at: "2026-06-10T09:00:00.000Z", updated_at: "2026-06-10T09:00:00.000Z" }),
  };
}
