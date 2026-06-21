import { useEffect, useState } from "react";
import SectionLabel from "./SectionLabel.jsx";
import { ArrowRight } from "./Svg.jsx";
import { useSEO, SEO } from "../lib/seo.js";

/**
 * CompaniesPage — STACK OF COMPANY PROFILES.
 *
 * 6 company cards stacked vertically. Each card has:
 *  - colored monogram (initials in a square)
 *  - status pill (live / beta)
 *  - headline metric (engineers, mau, transactions)
 *  - "the bug you might ship" (real concrete scenario)
 *  - tech-lead quote
 *  - "what you'll do" (3 actions)
 *  - "what you won't do" (1 line)
 *  - top open tickets
 *
 * No directory tree. No sidebar. One card per company, scrollable.
 */
const companies = [
  {
    code: "nexara", name: "nexara", initial: "n", color: "#148456", status: "live",
    ind: "fintech / payment orchestration",
    head: "2m+ tx/day, 11 engineers, 30k merchants",
    headMetric: { v: "2m+", l: "tx/day" },
    arch: "go · node · postgres · kafka",
    bug: "the bug you might ship: an idempotency-key race where two parallel /capture calls with the same key both pass the dedup check on a single-bucket redis cluster. you write the test that catches it, you write the fix that prevents it.",
    lead: { name: "anika m.", role: "staff eng · ex-razorpay, ex-stripe", quote: "we don't hire on screens. we hire on whether you can write a token-replay test that actually exercises the replay, not just the expiry." },
    what: [
      "ship 1 endpoint, full schema + tests + swagger",
      "ship 1 observability pass: logs, traces, 4 metrics",
      "ship 1 capstone behind a flag, 30 days in prod, 1 incident",
    ],
    wont: "no synthetic data. every ticket hits a real payment endpoint in staging.",
    tickets: [
      "[NX-1042] add idempotency-key middleware to /capture",
      "[NX-1043] backfill ledger for failed hdfc settlements",
      "[NX-1044] rate-limit /auth/login to 30 req/min per ip",
    ],
  },
  {
    code: "vivacity", name: "vivacity", initial: "v", color: "#b48200", status: "live",
    ind: "b2b saas / logistics",
    head: "1.2m shipments/mo, 8 engineers, 200+ fleets",
    headMetric: { v: "1.2m", l: "shipments/mo" },
    arch: "react · next · postgres · tRPC",
    bug: "the bug you might ship: a server-component waterfall that adds 800ms to /dashboard on a 4G connection. you profile, you refactor, you ship under 1.8s LCP, you write a perf budget test that catches the regression.",
    lead: { name: "rahul k.", role: "sr frontend eng · ex-cred, ex-rapidash", quote: "every pr must come with an axe scan. i don't merge 7 a11y violations to ship a kanban. i merge the fix." },
    what: [
      "ship 1 component, full keyboard nav + a11y",
      "ship 1 perf refactor: kill 4 waterfalls, lighthouse 95+",
      "ship 1 capstone: full feature, design + impl + post-mortem",
    ],
    wont: "no css-only tasks. every pr must include a test, a comment, a story.",
    tickets: [
      "[VV-201] kanban drag-and-drop with full keyboard nav",
      "[VV-202] lighthouse perf budget — bring /dashboard under 1.8s lcp",
      "[VV-203] refactor /dispatch/ to server components",
    ],
  },
  {
    code: "oxygon", name: "oxygon", initial: "o", color: "#2d5a87", status: "live",
    ind: "ai infra / vector search",
    head: "4.5m+ vectors, 22 engineers, 2ms p99",
    headMetric: { v: "2ms", l: "p99" },
    arch: "go · rust · cgo · vllm · ray",
    bug: "the bug you might ship: a recall@10 drop from 0.92 to 0.87 when pq-hnsw is enabled on a 1m-vector index. you write the eval, you find the quantization error, you ship a fix that gets you back to 0.92 with 40% less memory.",
    lead: { name: "vivek s.", role: "staff eng · ex-pinecone, ex-cohere", quote: "we hire on whether you can defend a benchmark in writing. your eval, your cost, your latency. if you can't write the trade-off doc, you can't ship." },
    what: [
      "ship 1 indexer change, benchmark, ship behind a flag",
      "ship 1 chaos test: kill 1 of 3 search replicas",
      "ship 1 capstone: 1 infra component, 30 days in prod, full post-mortem",
    ],
    wont: "no jupyter-only work. every model ships to staging with a kill switch.",
    tickets: [
      "[OX-501] add pq-hnsw to the indexer, benchmark recall@10",
      "[OX-502] add tenant-scoped rate limits to the search endpoint",
      "[OX-503] write a chaos test that kills 1 of 3 search replicas",
    ],
  },
  {
    code: "figment", name: "figment", initial: "f", color: "#7a3a8a", status: "live",
    ind: "consumer ai / creative writing",
    head: "380k mau, 12m+ stories generated",
    headMetric: { v: "380k", l: "mau" },
    arch: "next · tRPC · postgres · openai · anthropic",
    bug: "the bug you might ship: a prompt regression that silently degrades output quality for 100k users before any alert fires. you write the eval that catches it, you ship the alert, you ship the rollback.",
    lead: { name: "neha p.", role: "eng lead · ex-quill, ex-medium", quote: "your prompt is your code. if you can't write the eval, you can't ship the prompt. evals are the unit tests of llm work." },
    what: [
      "ship 1 prompt + 1 eval, behind a flag",
      "ship 1 cost-cut: cache the 12 most-common prompts, save 18%",
      "ship 1 capstone: 1 user-facing feature, full lifecycle",
    ],
    wont: "no naked llm calls. every prompt is wrapped, eval'd, versioned.",
    tickets: [
      "[FG-88] add 3 streaming-sse tests to the story-generation endpoint",
      "[FG-89] write 4 eviction tests for the cache (lru, ttl, big-write)",
      "[FG-90] add a 'lock character voice' guardrail to the editor",
    ],
  },
  {
    code: "levanto", name: "levanto", initial: "l", color: "#a64a4a", status: "beta",
    ind: "data / warehouse observability",
    head: "60+ data teams, 4 engineers, 1 platform",
    headMetric: { v: "60+", l: "data teams" },
    arch: "dbt · airflow · snowflake · great-expectations",
    bug: "the bug you might ship: a missing not_null test that means a cfo decides on a column with 14% nulls. you write the test, you backfill the data, you ship the alert.",
    lead: { name: "sarah l.", role: "eng lead · ex-fivetran, ex-airbnb", quote: "data tests are not optional. if a column lands in a dashboard without a contract, the platform failed. we hire on whether you can write the contract before the data lands." },
    what: [
      "ship 1 dbt model, generic + singular tests, doc the grain",
      "ship 1 airflow dag, idempotent, backfilled, sla-asserted",
      "ship 1 capstone: 1 data product, 30+ days in prod, 1 alert + 1 dashboard",
    ],
    wont: "no synthetic data. every dag must run against a real warehouse snapshot.",
    tickets: [
      "[LV-12] dbt model: dim_experiment with 4 tests, doc the grain",
      "[LV-13] airflow dag: backfill events 2025-12 to 2026-02, idempotent",
      "[LV-14] great-expectations suite: 8 contracts, run on every pr",
    ],
  },
  {
    code: "magrana", name: "magrana", initial: "m", color: "#3a5a4a", status: "beta",
    ind: "security / saas",
    head: "200+ startups, 6 engineers, 0 prod breaches",
    headMetric: { v: "200+", l: "startups" },
    arch: "node · postgres · semgrep · trivy",
    bug: "the bug you might ship: a missing algorithm-pin on jwt.verify that lets an attacker swap to 'none' or 'HS256→RS256'. you find the 12 sites, you write the semgrep rule, you ship the fix.",
    lead: { name: "david r.", role: "eng lead · ex-snyk, ex-auth0", quote: "we hire on whether you can write a semgrep rule that catches a class of bugs, not just one instance. one-off patches don't scale." },
    what: [
      "ship 1 semgrep rule, 1 class of bugs (jwt algorithm-pin, csrf, etc)",
      "ship 1 dep-tree fix, 3 cves closed",
      "ship 1 capstone: 1 vuln report + 1 fix + 1 rule that catches the class",
    ],
    wont: "no pentests of prod. everything is in staging, with the tech-lead's permission.",
    tickets: [
      "[MG-7] semgrep rule: catch jwt-verify-without-algorithm-pinning",
      "[MG-8] trivy scan: ship a fix for the 3 known cves in the api service",
      "[MG-9] rate-limit /login to 5 req/min per ip, behind a flag",
    ],
  },
];

function CoLogo({ name, color, initial, size = "lg" }) {
  return (
    <div className={`co3__logo co3__logo--${size}`} style={{ borderColor: color }}>
      <span style={{ color }}>{initial}</span>
    </div>
  );
}

export default function CompaniesPage() {
  useEffect(() => { document.title = "companies — dreamclerk"; }, []);
  useSEO(SEO.companies);

  return (
    <section className="section co3" id="companies">
      <div className="wrap co3__wrap">
        <SectionLabel status="ok">$ companies --list</SectionLabel>

        <header className="co3__head">
          <h1 className="co3__h1">6 simulated companies.</h1>
          <p className="co3__sub">your company is your sandbox. real code, real prs, real postmortems. pick one for sprint 1 — switch at sprint end if you want.</p>
        </header>

        <div className="co3__list">
          {companies.map((c) => (
            <article
              key={c.code}
              className="co3__company"
              style={{ "--co-color": c.color }}
            >
              <header className="co3__co-head">
                <div className="co3__co-id">
                  <CoLogo name={c.name} color={c.color} initial={c.initial} />
                  <div className="co3__co-titles">
                    <span className="co3__co-prompt">$ cd {c.code}/</span>
                    <h2 className="co3__co-name">{c.name}/</h2>
                    <span className="co3__co-ind">{c.ind}</span>
                  </div>
                </div>
                <div className="co3__co-status">
                  <span className={`co3__pill co3__pill--${c.status}`}>{c.status}</span>
                </div>
              </header>

              <div className="co3__co-headline">
                <span className="co3__co-headline-v">{c.headMetric.v}</span>
                <span className="co3__co-headline-l">{c.headMetric.l}</span>
                <span className="co3__co-headline-txt">{c.head}</span>
              </div>

              <div className="co3__co-bug">
                <span className="co3__bug-h">$ the bug you might ship</span>
                <p className="co3__bug-txt">{c.bug}</p>
              </div>

              <div className="co3__co-lead">
                <div className="co3__lead-id">
                  <div className="co3__lead-avatar" style={{ borderColor: c.color }}>{c.lead.name.split(" ")[0][0]}{c.lead.name.split(" ")[1][0]}</div>
                  <div>
                    <div className="co3__lead-name">{c.lead.name}</div>
                    <div className="co3__lead-role">{c.lead.role}</div>
                  </div>
                </div>
                <blockquote className="co3__lead-quote">"{c.lead.quote}"</blockquote>
              </div>

              <div className="co3__co-2col">
                <div>
                  <span className="co3__col-h">$ what you'll do</span>
                  <ul className="co3__what">
                    {c.what.map((w, i) => (
                      <li key={i}><ArrowRight width={12} height={12} color="var(--ok)" /><span>{w}</span></li>
                    ))}
                  </ul>
                </div>
                <div>
                  <span className="co3__col-h">$ what you won't do</span>
                  <p className="co3__wont">{c.wont}</p>
                </div>
              </div>

              <div className="co3__co-tickets">
                <span className="co3__col-h">$ top open tickets</span>
                <ol className="co3__ticket-list">
                  {c.tickets.map((t, i) => (
                    <li key={i}><code>{t}</code></li>
                  ))}
                </ol>
              </div>
            </article>
          ))}
        </div>

        <div className="co3__cta">
          <a className="btn btn--solid" href="#" data-open-modal data-open-source="companies-cta">
            notify me <span className="arr" aria-hidden="true">→</span>
          </a>
          <p className="co3__cta-note">free during 2026-q2 beta · 1,847 in queue · company chosen after offer</p>
        </div>

        <p className="legal__back">
          <a href="/">← back to dreamclerk</a>
        </p>
      </div>
    </section>
  );
}