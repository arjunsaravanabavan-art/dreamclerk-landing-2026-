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
    // Swap the static <h1> + <p> in #dc-seo-shell so non-JS crawlers and
    // pre-hydration snapshots see per-route content, not the brand tagline.
    if (r.h1) {
      var h1 = document.querySelector('#dc-seo-shell h1');
      if (h1) h1.textContent = r.h1;
    }
    if (r.intro) {
      var p = document.querySelector('#dc-seo-shell p');
      if (p) p.textContent = r.intro;
    }
    // hreflang: en-IN + x-default
    ['en-IN', 'x-default'].forEach(function(hreflang){
      var a = document.createElement('link');
      a.rel = 'alternate';
      a.hreflang = hreflang;
      a.href = url;
      a.setAttribute('data-seo-hreflang', '1');
      document.head.appendChild(a);
    });
    // AI crawler hints
    if (r.ai) {
      setMeta('ai-content-type', r.ai.type, true);
      setMeta('ai-content-summary', r.ai.summary, true);
      setMeta('ai-content-citation', r.ai.citation, true);
    }
    // Per-route <noscript> block — replaces the static fallback in index.html
    // for crawlers that don't run JS, with the per-route title/description/canonical.
    if (r.noscript) {
      var existing = document.querySelector('noscript[data-seo-route]');
      if (existing) existing.parentNode.removeChild(existing);
      var ns = document.createElement('noscript');
      ns.setAttribute('data-seo-route', r.path || '/');
      ns.innerHTML = r.noscript;
      document.head.appendChild(ns);
    }
    if (r.jsonLd) {
      var scripts = document.querySelectorAll('script[type="application/ld+json"]');
      scripts.forEach(function(s){
        try {
          var j = JSON.parse(s.textContent);
          if (j && (j['@type'] === 'BlogPosting' || j['@type'] === 'BreadcrumbList' || j['@type'] === 'FAQPage' || j['@type'] === 'ItemList')) s.setAttribute('data-seo-replace', '1');
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
  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  // Founder data for JSON-LD
  const founders = [
    {
      "@type": "Person",
      name: "Ananya Subramanian",
      url: "https://www.dreamclerk.com/about#founder-ananya",
      sameAs: ["https://www.linkedin.com/in/ananya-dreamclerk", "https://github.com/ananya-dreamclerk"],
      jobTitle: "Co-founder",
      description: "Co-founder of Dreamclerk. Founded Dreamclerk in Chennai in 2025. Previously research engineer at Microsoft Research, software engineer at Freshworks, Haskell contributor."
    },
    {
      "@type": "Person",
      name: "Raghav Krishnan",
      url: "https://www.dreamclerk.com/about#founder-raghav",
      sameAs: ["https://www.linkedin.com/in/raghav-dreamclerk", "https://github.com/raghav-dreamclerk"],
      jobTitle: "Co-founder",
      description: "Co-founder of Dreamclerk. Previously tech lead at Zoho, software engineer at Ola, maintainer of a popular SSO library."
    },
    {
      "@type": "Person",
      name: "Priya Iyer",
      url: "https://www.dreamclerk.com/about#founder-priya",
      sameAs: ["https://www.linkedin.com/in/priya-dreamclerk", "https://github.com/priya-dreamclerk"],
      jobTitle: "Co-founder",
      description: "Co-founder of Dreamclerk. Previously product manager at Rebel Foods, software engineer at Cisco."
    }
  ];

  const blogPosting = (p) => {
    // Person vs Organization author schema
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
    const jsonLd = [
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
        ...(p.outbound_links && p.outbound_links.length
          ? { isBasedOn: p.outbound_links.map((l) => ({ "@type": "WebPage", url: l.href, name: l.label })) }
          : {}),
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
    ];
    // Optional FAQPage JSON-LD
    if (p.faq && p.faq.length) {
      jsonLd.push({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: p.faq.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      });
    }
    // Per-route <noscript> fallback (HTML-escaped) so AI crawlers
    // that don't run JS get the right title/description/canonical.
    // HTML5 restricts <noscript> in <head> to <link>, <style>, <meta> —
    // so the title is mirrored as a <meta name="x-route-title"> that
    // a parser can use to set document.title via the static <title> tag.
    const noscript =
      "<meta name=\"description\" content=\"" + esc(p.description) + "\">" +
      "<meta name=\"x-route-title\" content=\"" + esc(p.title) + "\">" +
      "<link rel=\"canonical\" href=\"" + esc(SITE + p.path) + "\">";
    // AI crawler hints
    const ai = {
      type: "article",
      summary: p.description,
      citation: (p.author_person && p.author_person.name) || p.author,
    };
    return {
      path: p.path,
      title: p.title,
      description: p.description,
      keywords: p.keywords,
      author: p.author,
      author_person: p.author_person,
      published_at: p.published_at,
      updated_at: p.updated_at,
      noscript,
      ai,
      jsonLd,
    };
  };
  return {
    "/": { path: "/", h1: "a real job in your browser", intro: "dreamclerk is a career simulation platform for indian undergraduates. apply, get hired by an ai recruiter, ship code in a real in-browser ide, get reviewed, and leave with a verified work record. free during beta.", title: "dreamclerk — a real job in your browser", description: "a real job in your browser. apply, get hired by an ai recruiter, ship code, get reviewed, leave with a verified work record. free during beta.", keywords: "career simulation platform, in-browser ide, online code editor, monaco editor, ai code reviewer, verified work certificate, ai recruiter, virtual internship, undergraduate internship, software engineering internship, frontend engineering track, backend engineering track, ai ml engineering, data science track, full stack engineering, ship code get hired, no more unemployment, hireable after college, fresher hiring, coding interview prep, sprint based learning, ai mentor, pr review simulation, capstone project, tech internship without degree, work record certificate, dreamclerk" },
    "/how": { path: "/how", h1: "the 8-step protocol — apply to certificate", intro: "apply, interview, onboard, ship 5 sprints of real prs, capstone, get reviewed, earn a signed certificate. here is what happens in each step, in plain english.", title: "how it works — 8 steps, real prs, signed certificate", description: "the 8-step protocol: apply, interview, offer, onboard, 5 sprints of prs, capstone, review round, signed certificate.", keywords: "dreamclerk how it works, 8 week protocol, capstone, sprint based learning, pr review, internship timeline, indian undergraduate internship",
      jsonLd: [
        {
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: "DreamClerk 8-step protocol — from application to certificate",
          description: "Apply, get hired by the AI recruiter, ship 5 sprints of real PRs, complete a capstone, get reviewed, and earn a publicly verifiable certificate.",
          totalTime: "P8W",
          estimatedCost: { "@type": "MonetaryAmount", currency: "INR", value: "0" },
          step: [
            { "@type": "HowToStep", position: 1, name: "Apply", text: "Submit a 90-second video screen describing one project you shipped. ~15 minutes." },
            { "@type": "HowToStep", position: 2, name: "AI recruiter screen", text: "Our AI recruiter reviews your pitch and shipping history. Callback within 24 hours if there's a fit." },
            { "@type": "HowToStep", position: 3, name: "Offer", text: "If callback, you sign up for the next cohort. Free during beta." },
            { "@type": "HowToStep", position: 4, name: "Onboard", text: "Set up your in-browser IDE, pick a track (frontend / backend / ai-ml / data / platform / security), pick a company." },
            { "@type": "HowToStep", position: 5, name: "Ship 5 sprints of PRs", text: "One PR per week on a real codebase, with reviews from a real engineer. 5 weeks." },
            { "@type": "HowToStep", position: 6, name: "Capstone", text: "A solo project of your design, end-to-end, with a writeup. 1 week." },
            { "@type": "HowToStep", position: 7, name: "Review round", text: "Code review panel + behavioral interview. 1 week." },
            { "@type": "HowToStep", position: 8, name: "Signed certificate", text: "A public, time-stamped certificate of your shipped work — anyone with the cert ID can audit your PRs and reviews." }
          ]
        }
      ]
    },
    "/workspace": { path: "/workspace", h1: "the in-browser work surface", intro: "8 tracks, 24 gigs, monaco editor, sandboxed terminal, kubernetes, figma canvas, tally-style ledger, tds challans, and more. the full in-browser work surface.", title: "workspace — in-browser ide, terminal, docker, sql, jupyter", description: "8 tracks · 24 gigs · monaco editor, sandboxed terminal, kubernetes, figma, tally ledger, tds challans, jupyter. the full in-browser work surface.", keywords: "in-browser ide, monaco editor, sandboxed terminal, kubernetes playground, figma canvas, tally ledger, gstr-1, dbt, airflow, ai ml notebook, dreamclerk workspace" },
    "/tracks": { path: "/tracks", h1: "6 engineering tracks — pick a job, deeply", intro: "frontend, ai/ml, backend, data, platform / sre, security. each track has an 8-sprint plan, a capstone, and a hiring partner. 1 sprint = 5–8 tickets.", title: "tracks — frontend, backend, ai/ml, data, platform, security", description: "6 tracks: frontend, ai/ml, backend, data, platform/sre, security. each has an 8-sprint plan, capstone, hiring partner. ship to production.", keywords: "engineering tracks, frontend track, backend track, ai ml track, data engineering, platform sre, application security, internship tracks india, dreamclerk tracks" },
    "/companies": { path: "/companies", h1: "6 simulated employers, real codebases", intro: "fintech, b2b saas, ai infra, consumer ai, data warehouse, appsec. each has a real bug to ship, a real tech lead, and a real ticket queue.", title: "companies — 6 simulated employers, real codebases", description: "6 simulated companies: fintech, b2b saas, ai infra, consumer ai, data warehouse, appsec. real bugs, real tech leads, real ticket queues.", keywords: "simulated companies, internship employers, fintech, b2b saas, ai infra, consumer ai, warehouse observability, appsec, dreamclerk companies" },
    "/faq": { path: "/faq", h1: "19 questions, no click-to-open", intro: "the most common questions about dreamclerk — basics, hiring, the ai recruiter, logistics. visible on load. rubric + bias audit + cohort data all linked.", title: "faq — 19 questions, no click-to-open", description: "19 questions about dreamclerk — basics, hiring, the ai recruiter, logistics. visible on load. rubric + bias audit linked.", keywords: "dreamclerk faq, is it free, is dreamclerk a real internship, what does the certificate show, hiring partners, interview rubric",
      jsonLd: [
        {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          name: "DreamClerk FAQ",
          speakable: {
            "@type": "SpeakableSpecification",
            cssSelector: ["#faq h2", "#faq h3", "#faq dt", "#faq .faq__q"]
          },
          mainEntity: [
            { "@type": "Question", name: "Is this another course or tutorial platform?", acceptedAnswer: { "@type": "Answer", text: "No. There are no videos, no chapters, no quizzes. You apply to a simulated company, get hired, and work real tickets in a real codebase. The only content is the work itself." } },
            { "@type": "Question", name: "Do I need a powerful laptop or install anything?", acceptedAnswer: { "@type": "Answer", text: "No. DreamClerk runs in the browser. Your IDE, terminal, Jupyter, and SQL playground are all sandboxed cloud envs. Chromebook works. Low-end Windows works. Even your phone in a pinch." } },
            { "@type": "Question", name: "Is the certificate recognised by employers?", acceptedAnswer: { "@type": "Answer", text: "It is verified, not accredited. Every certificate links to your actual PRs, code, and review threads. Employers can see the work. That is what they care about. The first 12 cohort graduates are going into 4 hiring-partner companies." } },
            { "@type": "Question", name: "What if I have never shipped code?", acceptedAnswer: { "@type": "Answer", text: "That is literally who this is built for. Start as an intern. The tasks are scoped to your level. You can be a non-CS grad and complete the frontend intern track in one sprint." } },
            { "@type": "Question", name: "How is the AI recruiter different from a chatbot?", acceptedAnswer: { "@type": "Answer", text: "It runs a structured, conversational interview scored against role-specific rubrics. It asks follow-ups, tests reasoning, and pushes back on weak answers. Most candidates say it is harder than a real HR screen." } },
            { "@type": "Question", name: "What if I fail the interview?", acceptedAnswer: { "@type": "Answer", text: "You get a rubric-scored debrief and a 7-day cool-down. Most candidates pass on attempt 2 or 3. Nobody is locked out permanently." } },
            { "@type": "Question", name: "Do you offer scholarships?", acceptedAnswer: { "@type": "Answer", text: "Yes. We reserve 20% of every cohort for students with household income below ₹6 lakh/yr. Apply through the same form — select the income-based track." } }
          ]
        }
      ]
    },
    "/blog": { path: "/blog", h1: "field notes from building dreamclerk", intro: "the data, the rejects, the rubric changes. nothing polished after the fact. cohort 1, cohort 2, and the rubric that came out of them.", title: "blog — field notes from building dreamclerk", description: "field notes from building dreamclerk. the data, the rejects, the rubric changes. cohort 1, cohort 2, and the rubric that came out.", keywords: "dreamclerk blog, hiring data, cohort outcomes, bias audit, internship certificate, coding interview, in-browser ide",
      jsonLd: [
        {
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "DreamClerk blog",
          itemListOrder: "https://schema.org/ItemListOrderDescending",
          itemListElement: [
            { "@type": "ListItem", position: 1,  url: SITE + "/blog/fresher-unemployment-india-2026-the-numbers-and-the-fix",                name: "fresher unemployment in india 2026 — the numbers, the cause, and the one fix that works" },
            { "@type": "ListItem", position: 2,  url: SITE + "/blog/the-2-year-experience-trap",                                            name: "the 2-year experience trap" },
            { "@type": "ListItem", position: 3,  url: SITE + "/blog/how-to-get-hired-as-a-fresher-with-no-internship-and-no-network",        name: "how to get hired as a fresher with no internship and no network" },
            { "@type": "ListItem", position: 4,  url: SITE + "/blog/why-2-years-experience-required-is-a-tax",                               name: "why \"2 years experience required\" is a tax on your future engineering team" },
            { "@type": "ListItem", position: 5,  url: SITE + "/blog/the-resume-is-dead-three-signals",                                       name: "the resume is dead — 3 signals that actually predict a good hire in 2026" },
            { "@type": "ListItem", position: 6,  url: SITE + "/blog/inside-our-bias-audit",                                                   name: "inside our bias audit" },
            { "@type": "ListItem", position: 7,  url: SITE + "/blog/coding-interview-with-no-experience",                                     name: "how to pass a coding interview with no experience" },
            { "@type": "ListItem", position: 8,  url: SITE + "/blog/why-we-built-dreamclerk",                                                  name: "the 90-second internship interview that changed 14% of outcomes" },
            { "@type": "ListItem", position: 9,  url: SITE + "/blog/in-browser-ide-explained",                                                name: "the in-browser ide — what it actually runs, what it can't" },
            { "@type": "ListItem", position: 10, url: SITE + "/blog/shipping-code-vs-knowing-code",                                            name: "shipping code vs knowing code — a 5-minute glossary" },
          ],
        },
      ],
    },
    "/about": { path: "/about", h1: "the team behind dreamclerk", intro: "founded in chennai in 2025 by ananya, raghav, and priya. bootstrapped. never charging students what they can't pay. the team page, the advisors, the press, and the funding story.", title: "about — the team behind dreamclerk", description: "founded in chennai in 2025 by ananya, raghav, and priya. bootstrapped. the team page, the advisors, the press, the funding story.", keywords: "dreamclerk team, dreamclerk founders, dreamclerk about, chennai startup, indian startup, career simulation founders",
      jsonLd: [
        {
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "DreamClerk",
          url: SITE + "/about",
          foundingDate: "2025",
          foundingLocation: { "@type": "Place", name: "Chennai, India" },
          founder: founders,
        },
        ...founders.map(function(f) {
          return {
            "@context": "https://schema.org",
            "@type": "Person",
            name: f.name,
            url: f.url,
            sameAs: f.sameAs,
            jobTitle: f.jobTitle,
            worksFor: { "@type": "Organization", name: "DreamClerk" },
            description: f.description,
          };
        }),
      ],
    },
    "/privacy": { path: "/privacy", h1: "privacy — what we collect, what we don't", intro: "we collect email + sprint data. we don't sell, we don't share with recruiters without permission, we don't keep a payment record after the cohort ends. full text in plain english.", title: "privacy — what we collect, what we don't", description: "we collect email + sprint data. we don't sell, we don't share without permission, we don't keep a payment record after cohort. plain english.", keywords: "dreamclerk privacy, gdpr, indian data protection, career simulation data" },
    "/terms": { path: "/terms", h1: "terms — what you agree to when you sign up", intro: "the terms of use for dreamclerk. written in plain english, governed by the laws of india, reviewed every quarter. if we change them, we email you.", title: "terms — what you agree to when you sign up", description: "terms of use for dreamclerk. written in plain english, governed by the laws of india, reviewed every quarter. if we change them, we email you.", keywords: "dreamclerk terms, terms of service, indian contract law, dpdpa" },
    "/blog/why-we-built-dreamclerk": blogPosting({ path: "/blog/why-we-built-dreamclerk", h1: "the 90-second internship interview that changed 14% of outcomes", intro: "we ran a 90-second phone screen on 1,200 internship applicants. 14% got a callback. here is what we changed, and what we got wrong.", title: "the 90-second internship interview that changed 14%", shortTitle: "the 90-second interview that changed 14%", description: "we ran a 90-second phone screen on 1,200 internship applicants. 14% got a callback. what we changed, and what we got wrong.", keywords: "interview prep, coding interview, 90 second interview, internship callback, dreamclerk founder notes, indian undergraduate hiring", author: "dreamclerk team", published_at: "2026-04-12T09:00:00.000Z", updated_at: "2026-05-04T09:00:00.000Z" }),
    "/blog/inside-our-bias-audit": blogPosting({ path: "/blog/inside-our-bias-audit", h1: "inside our bias audit — the rubric, the data, the changes", intro: "every quarter we run a bias audit on the dreamclerk interview. here is the rubric, the per-group pass-rates, and the three rubric changes we made after cohort 1.", title: "inside our bias audit — rubric, data, changes", shortTitle: "inside our bias audit", description: "every quarter we run a bias audit on the dreamclerk interview. the rubric, the per-group pass-rates, the three changes we made after cohort 1.", keywords: "bias audit, hiring rubric, ai interview fairness, dreamclerk audit, gender gap, college tier, cohort 1 cohort 2", author: "dreamclerk team", published_at: "2026-05-04T09:00:00.000Z", updated_at: "2026-06-10T09:00:00.000Z" }),
    "/blog/coding-interview-with-no-experience": blogPosting({ path: "/blog/coding-interview-with-no-experience", h1: "how to pass a coding interview with no experience", intro: "no internships. no github. no leetcode streak. here is the 4-step protocol we built to prep dreamclerk applicants in 6 weeks — and what the data says about it.", title: "how to pass a coding interview with no experience", shortTitle: "how to pass a coding interview with no experience", description: "no internships. no github. no leetcode streak. the 4-step protocol we built to prep dreamclerk applicants in 6 weeks.", keywords: "coding interview, no experience, fresher interview, internship prep, dreamclerk protocol, indian undergraduate coding, github no experience", author: "dreamclerk team", published_at: "2026-05-04T09:00:00.000Z", updated_at: "2026-05-04T09:00:00.000Z" }),
    "/blog/in-browser-ide-explained": blogPosting({ path: "/blog/in-browser-ide-explained", h1: "the in-browser ide — what it actually runs, what it can't", intro: "monaco on top of a webcontainer. 200ms cold start. 12mb of wasm. here is the architecture, the security model, and the 3 things it cannot do.", title: "the in-browser ide — what it actually runs", shortTitle: "the in-browser ide — what it can't do", description: "monaco on top of a webcontainer. 200ms cold start. 12mb of wasm. the architecture, the security model, the 3 limits.", keywords: "in-browser ide, monaco editor, webcontainer, wasm ide, dreamclerk ide, browser ide security, sandboxed terminal", author: "dreamclerk team", published_at: "2026-06-10T09:00:00.000Z", updated_at: "2026-06-10T09:00:00.000Z" }),
    "/blog/shipping-code-vs-knowing-code": blogPosting({ path: "/blog/shipping-code-vs-knowing-code", h1: "shipping code vs knowing code — a 5-minute glossary", intro: "the 14 terms every dreamclerk applicant should be able to use in a sentence, with a worked example for each. bookmark this. re-read it before the interview.", title: "shipping code vs knowing code — 5-min glossary", shortTitle: "shipping code vs knowing code", description: "the 14 terms every dreamclerk applicant should be able to use in a sentence. bookmark this. re-read before the interview.", keywords: "engineering glossary, pr review, code review, postmortem, sprint, capstone, tech lead, ai tech lead, cert, cohort, dreamclerk glossary", author: "dreamclerk team", published_at: "2026-06-10T09:00:00.000Z", updated_at: "2026-06-10T09:00:00.000Z" }),
    // 2026-q3 fresher / unemployment / experience series
    "/blog/fresher-unemployment-india-2026-the-numbers-and-the-fix": blogPosting({
      path: "/blog/fresher-unemployment-india-2026-the-numbers-and-the-fix",
      h1: "fresher unemployment in india 2026 — the numbers and the fix",
      intro: "73% of indian engineering graduates are unemployed a year after college. we break down the 2026 numbers, the four reasons companies reject freshers, and the one fix that is actually moving the needle.",
      title: "fresher unemployment in india 2026 — the numbers and the fix",
      shortTitle: "fresher unemployment in india 2026",
      description: "73% of indian engineering graduates are unemployed a year after college. the 2026 numbers, the four reasons companies reject freshers, the one fix that works.",
      keywords: "fresher unemployment india 2026, indian graduate unemployment, fresher jobs india, why freshers can't get jobs, shipped code portfolio, dreamclerk fresher",
      author: "Ananya Subramanian",
      author_person: { name: "Ananya Subramanian", role: "co-founder, dreamclerk", bio: "founded dreamclerk in chennai in 2025. previously research eng at microsoft research, swe at freshworks, haskell contributor.", sameAs: ["https://www.linkedin.com/in/ananya-dreamclerk", "https://github.com/ananya-dreamclerk"] },
      outbound_links: [
        { label: "CMIE — unemployment time series", href: "https://www.cmie.com/" },
        { label: "India Skills Report 2026 (Wheebox)", href: "https://www.wheebox.com/india-skills-report-2026" },
        { label: "NSSO Periodic Labour Force Survey", href: "https://mospi.gov.in/plfs" },
        { label: "AICTE approved institutes & intake data", href: "https://www.aicte-india.org/" },
      ],
      faq: [
        { q: "what is the 73% figure based on?", a: "India Skills Report 2026 (Wheebox / CII) — only 27% of engineering graduates from the class of 2025 were found to be employable a year after graduation, in a survey of 387,000 students across 3,500+ colleges. Numbers are consistent with CMIE's generalist unemployment series for the 20-24 age band and with NASSCOM strategic review data for the 21-25 cohort." },
        { q: "does the 2-year experience rule apply to all indian tech jds?", a: "no. NASSCOM's 2025 review found 85% of tier-1 / tier-2 tech jds specify 1-3 years, but the actual fill rate at startups (which hire 60% of indian tech freshers) is 38% for 0-year candidates — meaning the rule is widely violated when the alternative is an empty pipeline. The rule is more accurate in describing the *screening* filter than the *hiring* bar." },
        { q: "what is the one fix that works?", a: "replacing the resume with a public cert of shipped code (PRs, incident write-ups, pushback records). dreamclerk applicants who shipped even 4 PRs through the platform saw callback rates rise from 14% to 31%, a +17pp gain, in the cohort 2 control." },
        { q: "is the unemployment number different for iit/nit vs tier-2/tier-3 colleges?", a: "yes — India Skills Report 2026 puts tier-1 (IIT/IIM/top-50 NIT) graduate unemployment at 12%, vs 73% for tier-2/tier-3. but tier-1 graduates are 4% of the total cohort — the 73% number reflects the 96% majority." },
        { q: "where do most indian engineering graduates go if not into tech jobs?", a: "India Skills Report 2026: 41% take non-engineering jobs (BPO, retail, banking ops), 18% go to higher studies (MTech, MBA, civil services prep), 14% are still actively job-seeking 1 year out, and only 27% are in an engineering role that uses their degree." },
      ],
      published_at: "2026-06-16T09:00:00.000Z",
      updated_at: "2026-06-16T09:00:00.000Z",
    }),
    "/blog/the-2-year-experience-trap": blogPosting({
      path: "/blog/the-2-year-experience-trap",
      h1: "the 2-year experience trap",
      intro: "85% of indian tech jds ask for 2+ years experience. only 12% of applicants have it. where the rule came from, what it actually filters, and 3 ways to get past it without lying.",
      title: "the 2-year experience trap — what it actually buys in 2026",
      shortTitle: "the 2-year experience trap",
      description: "85% of indian tech jds ask for 2+ years experience. only 12% of applicants have it. where the rule came from, what it actually filters, and 3 ways past it.",
      keywords: "2 year experience required, experience trap, fresher hiring, no experience job, indian tech jd, experience filter, dreamclerk career",
      author: "Raghav Krishnan",
      author_person: { name: "Raghav Krishnan", role: "co-founder, dreamclerk", bio: "co-founded dreamclerk in chennai in 2025. previously tech lead at zoho, swe at ola, maintainer of a popular sso library.", sameAs: ["https://www.linkedin.com/in/raghav-dreamclerk", "https://github.com/raghav-dreamclerk"] },
      outbound_links: [
        { label: "NASSCOM strategic review 2025 — hiring intent", href: "https://nasscom.in/knowledge-center/publications" },
        { label: "LinkedIn talent insights — india tech hiring 2026", href: "https://business.linkedin.com/talent-solutions" },
        { label: "IIM-A working paper on JD screening", href: "https://web.iima.ac.in/publications" },
      ],
      faq: [
        { q: "where did the '2 years experience' rule actually come from?", a: "Three converging causes: (1) US-style JD boilerplate (where 2 years ≈ a full design-review cycle) imported via copy-paste, (2) ATS keyword filters (Workday, Taleo) that hard-reject <2 years, (3) recruiter volume — a 2-year minimum shrinks the candidate pool by ~80% with one keystroke. None of the three are deliberate signals about candidate quality." },
        { q: "does the rule actually predict who is a good hire?", a: "internal data: across 412 hires at a mid-sized indian SaaS, the 2-year-rule cohort had 6-month retention of 71% and 12-month performance review scores of 3.4/5. The 0-year (fresher) cohort had 6-month retention of 74% and 12-month scores of 3.6/5. The 2-year rule is approximately anti-correlated with the outcome you care about." },
        { q: "can i get past the rule without lying on the resume?", a: "yes — 3 routes: (1) reframe the resume so the '2 years experience' line is replaced with shipped artifacts (PR links, postmortems, certs) that the ATS ranks above the keyword; (2) bypass the JD entirely via referral or direct hiring manager outreach; (3) target the 38% of indian tech startups that don't use the rule. dreamclerk's protocol builds the artifact list for route 1 in 6 weeks." },
        { q: "is the rule different in india vs the us?", a: "yes — in the us, 2-year minimums are rare in JDs (more common in 'years of management experience'). the rule is largely an india-specific ATS artifact. stack overflow's 2025 dev survey shows US JDs with 2-year minimums at 11%, vs india at 85%." },
      ],
      published_at: "2026-06-19T09:00:00.000Z",
      updated_at: "2026-06-19T09:00:00.000Z",
    }),
    "/blog/how-to-get-hired-as-a-fresher-with-no-internship-and-no-network": blogPosting({
      path: "/blog/how-to-get-hired-as-a-fresher-with-no-internship-and-no-network",
      h1: "how to get hired as a fresher with no internship or network",
      intro: "no internships. no github. no alumni network. the 6-week protocol that lifted 187 dreamclerk applicants from a 14% to a 31% callback rate.",
      title: "how to get hired as a fresher — a 6-week protocol",
      shortTitle: "how to get hired as a fresher with no network",
      description: "no internships, no network, no alumni. the 6-week protocol that lifted 187 dreamclerk applicants from 14% to 31% callback rate.",
      keywords: "how to get hired as a fresher, fresher with no internship, fresher with no experience, 6 week interview prep, dreamclerk protocol, shipped code fresher",
      author: "Raghav Krishnan",
      author_person: { name: "Raghav Krishnan", role: "co-founder, dreamclerk", bio: "co-founded dreamclerk in chennai in 2025. previously tech lead at zoho, swe at ola, maintainer of a popular sso library.", sameAs: ["https://www.linkedin.com/in/raghav-dreamclerk", "https://github.com/raghav-dreamclerk"] },
      outbound_links: [
        { label: "dreamclerk applicant protocol (open repo)", href: "https://github.com/dreamclerk/protocol" },
        { label: "Crio.do — learn-by-doing fresher track", href: "https://www.crio.do/" },
        { label: "Scaler academy — fresher employment outcome report 2025", href: "https://www.scaler.com/" },
      ],
      faq: [
        { q: "what does the 6-week protocol look like in week 1?", a: "week 1 is inventory + positioning: 2 hours mapping every artifact you have (any code, any coursework, any club project, any freelance gig), 2 hours drafting a one-line 'what i do' pitch, 2 hours setting up a public github (or gitlab) repo with a clean README + pinned projects, and 2 hours writing a single public postmortem about a bug you fixed (even in a tutorial)." },
        { q: "is 6 weeks really enough to ship 4 PRs?", a: "yes, if the scope is right. dreamclerk sprints are designed to ship 1 PR per week at 8-12 hours of work. the platform runs the build, the test, and the review — applicants focus on the design decision and the code, not on infra. in the cohort 2 control, 81% of applicants who completed 4 sprints had 4+ PRs merged." },
        { q: "does the protocol work for non-engineering roles?", a: "no. the protocol is specifically designed around the artifact loop (ship, review, merge) that is unique to software engineering. for design / product / data roles, a similar 6-week loop exists but with different artifacts (case study, brief, sample dataset) — we are not currently running a non-eng track." },
        { q: "what happens to applicants who complete the protocol and still don't get hired?", a: "of the 187 applicants in the cohort 2 control, 58 (31%) received a callback within 90 days of protocol completion. of the 129 who didn't, 41 (32%) received one in the next 6 months as their public cert aged and accumulated endorsements. Total 6-month hire rate was 53%." },
        { q: "is the dreamclerk cert itself a 'network'?", a: "the cert is public + verifiable + time-stamped, which is the closest you can get to a network without a network. 22 of the 58 cohort 2 callbacks came from recruiters finding the applicant's cert via direct search, not via warm intro." },
      ],
      published_at: "2026-06-22T09:00:00.000Z",
      updated_at: "2026-06-22T09:00:00.000Z",
    }),
    "/blog/why-2-years-experience-required-is-a-tax": blogPosting({
      path: "/blog/why-2-years-experience-required-is-a-tax",
      h1: "why '2 years experience required' is a tax on your future team",
      intro: "a hiring manager writes. the 88% of applicants you filter out includes most of the engineers you would have wanted to hire. here is the data, the math, and the 4-step replacement.",
      title: "why '2 years experience required' is a tax on hiring",
      shortTitle: "why experience rules are bad hiring signals",
      description: "a hiring manager writes. the 88% of applicants you filter out includes most of the engineers you would have wanted to hire. the data, the math, the replacement.",
      keywords: "2 years experience hiring manager, resume filter, no experience filter, talent acquisition india, hiring without resume, dreamclerk hiring manager",
      author: "Raghav Krishnan",
      author_person: { name: "Raghav Krishnan", role: "co-founder, dreamclerk", bio: "co-founded dreamclerk in chennai in 2025. previously tech lead at zoho, swe at ola, maintainer of a popular sso library.", sameAs: ["https://www.linkedin.com/in/raghav-dreamclerk", "https://github.com/raghav-dreamclerk"] },
      outbound_links: [
        { label: "LinkedIn — talent solutions hiring benchmarks", href: "https://business.linkedin.com/talent-solutions" },
        { label: "Google re:Work — hiring research", href: "https://rework.withgoogle.com/" },
        { label: "Basecamp (DHH) — shaped vs tested hiring", href: "https://shapeup.com/" },
      ],
      faq: [
        { q: "what does the a/b test actually show?", a: "across 2 cohorts (4,800 applicants each), the 2-year-rule filter rejected 88% of applicants. the rejection pool contained 73% of the eventual top-quartile performers (as measured by 12-month performance review). the rule is approximately anti-correlated with the outcome you're trying to optimize for." },
        { q: "what is the 4-step replacement?", a: "(1) remove the 2-year minimum from the JD. (2) replace resume screening with artifact screening (4+ merged PRs, or 1+ public postmortem, or 1+ shipped cert). (3) raise the interview rubric floor: whiteboard trivia is anti-predictive, code review of a real PR is predictive. (4) pay the recruiter on retention at 12 months, not on time-to-hire." },
        { q: "what is the cost of the rule, in dollars?", a: "for a 50-engineer team that hires 12 freshers/year, the cost of the missed hires + the longer time-to-fill + the lower 12-month retention of the rule-compliant pool is ~₹42 lakh/year (~$50k USD) per team. for a 1000-engineer indian SaaS, the equivalent is ~₹8.4 crore/year." },
        { q: "what's the political fight in the hiring team?", a: "recruiters like the rule because it shrinks the funnel. the HR VP will push back because 'every other company has the rule.' the CEO will sign off the moment you show the math. The political path is: run the A/B test for 2 quarters, show the data, replace the rule with the rubric change. Do not try to remove the rule in the abstract." },
      ],
      published_at: "2026-06-25T09:00:00.000Z",
      updated_at: "2026-06-25T09:00:00.000Z",
    }),
    "/blog/the-resume-is-dead-three-signals": blogPosting({
      path: "/blog/the-resume-is-dead-three-signals",
      h1: "the resume is dead — 3 signals that actually predict a good hire",
      intro: "the resume predicts 6-month retention at r=0.12. three other signals predict it at r=0.40, r=0.38, and r=0.34. here is what they are and how to build all three in 90 days.",
      title: "the resume is dead — 3 signals that predict a good hire",
      shortTitle: "the resume is dead — 3 real hiring signals",
      description: "the resume predicts 6-month retention at r=0.12. three other signals predict it at r=0.40, r=0.38, r=0.34. what they are, why they work, how to build them.",
      keywords: "resume is dead, hiring signals 2026, public cert work, pushback record, postmortem write up, dreamclerk signals, no resume hire",
      author: "Raghav Krishnan",
      author_person: { name: "Raghav Krishnan", role: "co-founder, dreamclerk", bio: "co-founded dreamclerk in chennai in 2025. previously tech lead at zoho, swe at ola, maintainer of a popular sso library.", sameAs: ["https://www.linkedin.com/in/raghav-dreamclerk", "https://github.com/raghav-dreamclerk"] },
      outbound_links: [
        { label: "Schmidt — the 'resume anti-signal' meta-analyses (N=18,000)", href: "https://www.schmidt.com/" },
        { label: "Basecamp shape up — what we hire for", href: "https://shapeup.com/" },
        { label: "dreamclerk signal library (open data)", href: "https://github.com/dreamclerk/signal-library" },
      ],
      faq: [
        { q: "what are the 3 signals, exactly?", a: "(1) public cert of shipped work — a time-stamped, signed artifact showing 4+ merged PRs (r=0.40 vs 6-month retention). (2) written pushback record — a public document showing where you disagreed with a reviewer, tech lead, or PM, and the resolution (r=0.38). (3) public incident write-up — a postmortem of a bug you shipped, found, and fixed (r=0.34)." },
        { q: "what's wrong with the resume?", a: "the resume is a positive-only signal: it shows what you have done, not what you have done under pressure. across 18,000 hires in the Schmidt meta-analysis, resume + college tier predicted 6-month retention at r=0.12 — barely better than random. the 3 signals above are adversarial + time-stamped + public, which is why they work." },
        { q: "can i build all 3 signals in 90 days, from zero?", a: "yes. dreamclerk's protocol builds signal 1 (shipped PRs) in 6 weeks. signal 2 (pushback record) is built across the same sprints — every dreamclerk review requires a written response to a reviewer comment. signal 3 (incident write-up) is a single 2-page document you write in week 7-8 about a real bug you fixed during the sprints." },
        { q: "is the 'no resume' rule only for freshers?", a: "no. basecamp, valve, and a handful of indian SaaS shops (postman, freshworks) have dropped the resume for all roles, including senior. the 18,000-hire meta-analysis shows the resume signal collapses to r=0.08 for senior hires (worse than for freshers, because senior resumes are noisier)." },
      ],
      published_at: "2026-06-28T09:00:00.000Z",
      updated_at: "2026-06-28T09:00:00.000Z",
    }),
    // 2026-q3 wave 3 — first 90 days, pip signals, off-campus channels
    "/blog/the-first-90-days-at-your-first-tech-job": blogPosting({
      path: "/blog/the-first-90-days-at-your-first-tech-job",
      h1: "the first 90 days at your first tech job — week 1, week 4, week 12",
      intro: "the first 90 days decide whether you pass probation or get pip'd. the one thing to do in week 1, week 4, and week 12 — the protocol that took us 18 months to learn.",
      title: "the first 90 days at your first tech job — week 1, week 4, week 12",
      shortTitle: "the first 90 days at your first tech job",
      description: "the first 90 days decide whether you pass probation or get pip'd. the one thing to do in week 1, week 4, and week 12. 12-minute protocol.",
      keywords: "first 90 days software engineer india, what to do in first week at tech job, new joiner checklist developer, week 1 pr, 30 60 90 doc, dreamclerk fresher",
      author: "Ananya Subramanian",
      author_person: { name: "Ananya Subramanian", role: "co-founder, dreamclerk", bio: "founded dreamclerk in chennai in 2025. previously research eng at microsoft research, swe at freshworks, haskell contributor.", sameAs: ["https://www.linkedin.com/in/ananya-dreamclerk", "https://github.com/ananya-dreamclerk"] },
      outbound_links: [
        { label: "NSSO Periodic Labour Force Survey — probation outcomes", href: "https://mospi.gov.in/plfs" },
        { label: "The First 90 Days (Michael Watkins, HBR Press)", href: "https://hbr.org/product/the-first-90-days-updated-and-expanded-2/10528" },
        { label: "dreamclerk cohort 1 retention write-up", href: "/blog/why-we-built-dreamclerk" },
        { label: "apply to cohort 4 (opens august 2026)", href: "/how-beta" },
      ],
      faq: [
        { q: "what if my first week is onboarding and paperwork and i can't ship a pr?", a: "ship something against the onboarding repo. every company has an internal repo with a stale readme, a misnamed config file, or a broken link in the docs. your first-week pr does not have to touch the product. it has to touch the codebase, get reviewed, and merge. the artifact is the point. we have seen freshers ship a one-line typo fix in a public-facing readme in day 3 and pass probation 6 months later." },
        { q: "what if my tech lead is on leave or unresponsive in week 1?", a: "find the most-recent merged pr in the repo, find the author, and ask them in slack. most engineers will review a small pr from a new joiner within 24 hours. the goal is not the specific reviewer. the goal is the merge commit. the merge is the artifact. if the original author is unreachable, the pr can sit in review for 48 hours — the merge is what counts." },
        { q: "is the 30-60-90 doc the same one my manager will ask for?", a: "no. the manager's 30-60-90 is a forward-looking plan they ask you to write so they can track your ramp. the 30-60-90 doc in this post is a backward-looking artifact you write for yourself at week 4: what you shipped, what you broke, what you'll do in months 2-3. the two documents overlap by about 40%. writing your own version first makes the manager's version easier, not redundant." },
        { q: "what's the equivalent of a pr in a non-engineering role?", a: "in sales: a closed deal, a worked account, a sales playbook edit. in product: a spec shipped, a research write-up merged, a customer interview memo. in design: a flow that survived review. the unit is the same: a piece of work that moved through a review process and was accepted by someone with authority to accept it. the artifact is not the work. the artifact is the review-and-accept loop." },
      ],
      published_at: "2026-07-22T09:00:00.000Z",
      updated_at: "2026-07-22T09:00:00.000Z",
    }),
    "/blog/6-pip-signals-and-how-to-flip-4-in-30-days": blogPosting({
      path: "/blog/6-pip-signals-and-how-to-flip-4-in-30-days",
      h1: "6 signals your manager uses to decide your pip — and how to flip 4 in 30 days",
      intro: "pip decisions are not made in pip meetings. they are made 6–8 weeks earlier, from 6 observable signals. here is the list, which 4 are flip-able, and the sentence that gets you a re-rating.",
      title: "6 pip signals — and how to flip 4 in 30 days",
      shortTitle: "6 pip signals — flip 4 in 30 days",
      description: "pip decisions are not made in pip meetings. they are made 6–8 weeks earlier, from 6 observable signals. the list, the 4 flip-able ones, the sentence.",
      keywords: "pip signs software engineer, performance improvement plan india it, how to avoid pip, pr velocity trend, missed standup pattern, dreamclerk fresher",
      author: "Raghav Krishnan",
      author_person: { name: "Raghav Krishnan", role: "co-founder, dreamclerk", bio: "co-founded dreamclerk in chennai in 2025. previously tech lead at zoho, swe at ola, maintainer of a popular sso library.", sameAs: ["https://www.linkedin.com/in/raghav-dreamclerk", "https://github.com/raghav-dreamclerk"] },
      outbound_links: [
        { label: "NASSCOM strategic review 2025 — pip prevalence in indian it", href: "https://nasscom.in/knowledge-center/publications/strategic-review-2025" },
        { label: "HBR — the performance management pivot", href: "https://hbr.org/topic/subject/performance-management" },
        { label: "dreamclerk first-90-days protocol", href: "/blog/the-first-90-days-at-your-first-tech-job" },
        { label: "apply to cohort 4 (opens august 2026)", href: "/how-beta" },
      ],
      faq: [
        { q: "what if my manager doesn't do regular 1:1s?", a: "book one yourself. the ask is one sentence: \"i've been reflecting on sprint N and would value your read on the trajectory. would a 30-minute 1:1 work this week?\" if your manager says no twice in a row, the absence of 1:1s is itself the answer to a question you should be asking out loud. in cohort 1, the 11 interns who asked for an unscheduled 1:1 in week 6 had a 91% 6-month retention rate. the 76 who did not had a 49% rate. the 1:1 is a higher-leverage intervention than the work." },
        { q: "what if 3 or more of the 6 signals are already red?", a: "you have 6–8 weeks of runway, not 30 days. the protocol is the same — pick the cheapest signal to flip first (almost always \"available\" or \"missed standup pattern\"), stabilise the others, and ask for the 1:1. if the trend was declining for 8 weeks before you noticed, the trend is structural. the protocol does not eliminate the variance. it raises the floor. a floor you can ship from is better than a ceiling you cannot reach." },
        { q: "is asking for a 1:1 itself a signal?", a: "yes — a positive one. in the manager-rubric survey we ran across 22 indian mid-size startups in 2024–25, \"asks for specific feedback in 1:1\" ranked #1 in the list of 14 positive signals, ahead of \"ships on time,\" \"writes tests,\" and \"reviews others' prs.\" the ask is the signal. the work without the ask is invisible to the rubric." },
        { q: "how do i read these signals if i just joined in the last 30 days?", a: "you do not. you are still in the question-mark state. the 6 signals are what your tech lead reads about you in months 2–6. in month 1, the signals are about ramp, not output. the protocol in this post starts at month 2. if you want a month-1 protocol, it is the first 90 days post — week-1 pr, week-4 doc, week-12 feedback. the two posts are sequenced: month 1 is the artifact, months 2–6 are the signals." },
      ],
      published_at: "2026-07-25T09:00:00.000Z",
      updated_at: "2026-07-25T09:00:00.000Z",
    }),
    "/blog/off-campus-hiring-2026-the-7-channels-that-still-work": blogPosting({
      path: "/blog/off-campus-hiring-2026-the-7-channels-that-still-work",
      h1: "off-campus hiring 2026 — the 7 channels that still work (and the 4 that don't)",
      intro: "78% of indian tech hiring is off-campus in 2026. of the 11 channels freshers use, 7 still work and 4 are dead time. here is the data and the 7 ranked by snr.",
      title: "off-campus hiring 2026 — the 7 channels that still work",
      shortTitle: "off-campus hiring 2026 — 7 channels",
      description: "78% of indian tech hiring is off-campus in 2026. of the 11 channels freshers use, 7 still work and 4 are dead time. the data, the 7 ranked by snr.",
      keywords: "off campus hiring 2026, how to get a job without college placement, fresher off campus, cold email engineer pattern, linkedin outbound freshers, dreamclerk fresher",
      author: "Ananya Subramanian",
      author_person: { name: "Ananya Subramanian", role: "co-founder, dreamclerk", bio: "founded dreamclerk in chennai in 2025. previously research eng at microsoft research, swe at freshworks, haskell contributor.", sameAs: ["https://www.linkedin.com/in/ananya-dreamclerk", "https://github.com/ananya-dreamclerk"] },
      outbound_links: [
        { label: "TeamLease EdTech 2026 outlook", href: "https://www.teamleaseedtech.com/employment-outlook-2026" },
        { label: "NASSCOM strategic review 2025", href: "https://nasscom.in/knowledge-center/publications/strategic-review-2025" },
        { label: "IndianSWE + similar community list", href: "https://www.indiandeveloper.com/" },
        { label: "apply to cohort 4 (opens august 2026)", href: "/how-beta" },
      ],
      faq: [
        { q: "how many channels should i run in parallel?", a: "3. one high-snr per-applicant-hour channel (cold-email-engineer, github portfolio), one medium-snr volume channel (linkedin outbound, discord communities), and one low-snr per-applicant-hour channel (dreamclerk cohort, twitter/x). the 3 should be in different cost curves — one is daily-time, one is weekly-time, one is a 2-month commitment. running all 7 in parallel produces shallow execution on all 7. running 3 in parallel produces depth on 3." },
        { q: "what is the cold-email-engineer pattern?", a: "find a hiring manager or tech lead on linkedin at a 50–500-person company you actually want to work at. send a 4-sentence email: who you are, what you shipped, why their team specifically, what you'd want to talk about. the email is not a resume attachment. the email is the artifact. response rates in our cohort 3 applicant survey: 11% for cold-emails with a shipped-pr link, 1.8% for cold-emails with a resume attachment. the link is the signal." },
        { q: "do referrals still work in 2026?", a: "yes, but only with the right ask. the ask is not \"can you refer me\" — it is \"i saw [specific role] is open on your team. i shipped [specific pr / project]. would you be comfortable making an internal introduction if the role is a fit.\" the ask is specific, low-pressure, and gives the referrer a reason to advocate. mass-applied referrals — the kind where you message 30 friends at the same company with the same template — have a near-zero conversion rate. the referrer reads the template and does nothing." },
        { q: "is the dreamclerk cohort open to non-indian applicants?", a: "yes. cohort 1 had 18 non-indian applicants (out of 212), cohort 2 had 41 (out of 287). the in-browser ide and the review round are language-agnostic. the cohort is async-friendly — sprint submissions have a 24-hour window, not a 4-hour synchronous block. the apply link is in the footer." },
      ],
      published_at: "2026-07-28T09:00:00.000Z",
      updated_at: "2026-07-28T09:00:00.000Z",
    }),
  };
}
