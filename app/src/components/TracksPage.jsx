import { useEffect, useState } from "react";
import SectionLabel from "./SectionLabel.jsx";
import { IconCode, IconTerminal, IconFile, IconNode, IconCheck, IconPadlock, IconStar, IconRocket, ArrowRight } from "./Svg.jsx";
import { useSEO, SEO } from "../lib/seo.js";
import { RouterLink } from "../lib/router.jsx";

/**
 * TracksPage — TRACK PICKER. completely fresh layout.
 *
 * 6 tracks, each a "track card" with:
 *  - icon, code, name
 *  - 3 live counters (salary premium %, level after, sprint velocity)
 *  - "what you'll ship" (3 cards)
 *  - "what you won't do" (1 line)
 *  - bottom nav to expand/collapse full syllabus
 *
 * Mobile-friendly: cards stack on mobile, no card-grid cramped layout.
 * Visually different from how/workspace/companies.
 */
const tracks = [
  {
    code: "F1", name: "frontend", icon: "code", color: "#2d5a87",
    salary: 12.4, level: "intern → junior", velocity: 8.4, risk: "low",
    blurb: "ship a feature, a11y pass, lighthouse 95+.",
    what: [
      "1 component, design + impl + tests + a11y",
      "1 refactor of an existing page (kill 4 waterfalls)",
      "1 capstone: full feature, design + impl + ship + post-mortem",
    ],
    wont: "no css-only tasks. every pr must include a test, a comment, a story.",
    stack: ["react", "typescript", "next.js", "css", "vitest", "playwright"],
    sprintPlan: [
      ["s1", "read 2k lines, 1-page summary"],
      ["s2", "6 small prs, 1-line to 30-line"],
      ["s3", "1 pr, 100-300 lines, 1 dimension"],
      ["s4", "1 pr, full ownership incl ui"],
      ["s5", "1 refactor, no behavior change"],
      ["s6", "1 capstone, 500-1k lines"],
      ["s7", "1 pr, you are now a reviewer"],
      ["s8", "4 mock interviews, real companies"],
    ],
  },
  {
    code: "A3", name: "ai/ml", icon: "star", color: "#7a3a8a",
    salary: 18.0, level: "intern → ml eng", velocity: 7.2, risk: "med",
    blurb: "ship a model. eval a model. ship a model behind a flag.",
    what: [
      "1 data audit, 100k records, 1-page data-card",
      "1 model, end-to-end, with eval + baseline + 3 iters",
      "1 capstone: model behind a flag, 30 days in prod, full post-mortem",
    ],
    wont: "no jupyter-only work. every model ships to staging with a kill switch.",
    stack: ["pytorch", "transformers", "embeddings", "ray", "vllm", "w&b"],
    sprintPlan: [
      ["s1", "data audit, bias/drift/gaps card"],
      ["s2", "baseline, write eval, beat heuristic"],
      ["s3", "iterate, 3 architectures, pick winner"],
      ["s4", "prod, behind flag, drift+cost+latency"],
      ["s5", "kill a feature that wins headline"],
      ["s6", "capstone, 30 days prod, post-mortem"],
      ["s7", "refactor eval pipeline to 5-min rerun"],
      ["s8", "4 mock rounds, ml+system+coding"],
    ],
  },
  {
    code: "B2", name: "backend", icon: "node", color: "#148456",
    salary: 14.6, level: "intern → swe", velocity: 8.8, risk: "med",
    blurb: "an endpoint, a rate limit, a backfill, a p1 incident.",
    what: [
      "1 endpoint, schema + tests + swagger + deploy",
      "1 observability pass: logs, traces, 4 metrics",
      "1 capstone: 1 endpoint, 500-1500 lines, 30 days prod, 1 incident handled",
    ],
    wont: "no read-only tickets. every pr must hit a real endpoint in staging.",
    stack: ["node", "go", "postgres", "redis", "kafka", "k8s"],
    sprintPlan: [
      ["s1", "read 2 endpoints, 5 failure modes"],
      ["s2", "1 endpoint, 100-200 lines, full tests"],
      ["s3", "observability, 4 metrics to 1 endpoint"],
      ["s4", "perf, profile 1 hot path, ship 1 opt"],
      ["s5", "handle 1 prod incident, postmortem"],
      ["s6", "capstone, 1 endpoint, end-to-end"],
      ["s7", "1 pr, you are now a reviewer"],
      ["s8", "4 mock rounds, system+coding"],
    ],
  },
  {
    code: "D4", name: "data", icon: "file", color: "#a64a4a",
    salary: 9.2, level: "intern → data eng", velocity: 7.6, risk: "med",
    blurb: "a dag, a dbt model, a backfill, a contract.",
    what: [
      "1 dbt model, generic + singular tests, doc the grain",
      "1 airflow dag, idempotent, backfilled, sla-asserted",
      "1 capstone: 1 data product, 30+ days in prod, 1 alert + 1 dashboard",
    ],
    wont: "no synthetic data. every dag must run against a real warehouse snapshot.",
    stack: ["dbt", "airflow", "spark", "snowflake", "looker", "great-expectations"],
    sprintPlan: [
      ["s1", "read 1 dag, top 3 sla risks"],
      ["s2", "1 dbt model, tests, doc the grain"],
      ["s3", "1 airflow dag, idempotent, backfilled"],
      ["s4", "1 real backfill, 30 days late-arriving"],
      ["s5", "1 alert + 1 dashboard, last month's breach"],
      ["s6", "capstone, 1 data product, end-to-end"],
      ["s7", "1 pr, you are now a reviewer"],
      ["s8", "4 mock rounds, sql+python+dbt+sd"],
    ],
  },
  {
    code: "P5", name: "platform", icon: "rocket", color: "#3a5a4a",
    salary: 11.7, level: "intern → sre", velocity: 8.0, risk: "high",
    blurb: "a deploy, an alert, a chaos test, a postmortem.",
    what: [
      "1 deploy pipeline refactor, faster, safer, better rollback",
      "1 chaos test that exercises a known failure mode",
      "1 capstone: 1 prod system, 1 month end-to-end, 1 incident handled",
    ],
    wont: "no click-ops. every action must be a script, a runbook, or a pr.",
    stack: ["kubernetes", "terraform", "argo", "prometheus", "loki", "grafana"],
    sprintPlan: [
      ["s1", "read 1 prod service end-to-end"],
      ["s2", "refactor the deploy pipeline"],
      ["s3", "ship alerts, last week's incident"],
      ["s4", "chaos test, known failure mode"],
      ["s5", "1 live incident, postmortem, fix"],
      ["s6", "capstone, 1 prod system, 1 month"],
      ["s7", "1 pr, you are now a reviewer"],
      ["s8", "4 mock rounds, k8s+tf+troubleshoot+sd"],
    ],
  },
  {
    code: "S6", name: "security", icon: "padlock", color: "#b48200",
    salary: 22.3, level: "intern → appsec", velocity: 6.4, risk: "high",
    blurb: "a threat model, a vuln, a fix, a rule that catches it.",
    what: [
      "1 threat model, top 10 threats, mitigations, owners",
      "1 vuln report in staging + 1 semgrep rule that would have caught it",
      "1 capstone: 1 vuln + 1 fix + 1 rule that catches the class",
    ],
    wont: "no pentests of prod. everything is in staging, with the tech-lead's permission.",
    stack: ["burp", "semgrep", "trivy", "owasp zed", "jwt-tooling", "threat-modeling"],
    sprintPlan: [
      ["s1", "read 1 codebase, top 10 threats"],
      ["s2", "fix a real authn/authz bug"],
      ["s3", "1 semgrep rule, 1 class of bugs"],
      ["s4", "scan deps, ship a fix for 1 cve"],
      ["s5", "1 threat model, peer-reviewed"],
      ["s6", "capstone, vuln+fix+rule"],
      ["s7", "1 pr, you are now a reviewer"],
      ["s8", "4 mock rounds, web+appsec+tm+sd"],
    ],
  },
];

function TrackIcon({ name }) {
  const iconMap = { code: IconCode, terminal: IconTerminal, node: IconNode, file: IconFile, check: IconCheck, rocket: IconRocket, star: IconStar, padlock: IconPadlock };
  const Icon = iconMap[name] || IconCode;
  return <Icon width={32} height={32} color="var(--ok)" />;
}

function VelocityBar({ v, max = 10 }) {
  return (
    <div className="tk3__vbar" aria-label={`velocity ${v} of ${max}`}>
      {Array.from({ length: max }).map((_, i) => (
        <span key={i} className={`tk3__vbar-cell ${i < v ? "is-on" : ""}`} />
      ))}
    </div>
  );
}

function RiskMeter({ r }) {
  const map = { low: [1, 0, 0], med: [1, 1, 0], high: [1, 1, 1] };
  const cells = map[r] || [0, 0, 0];
  return (
    <div className="tk3__risk" aria-label={`risk: ${r}`}>
      {cells.map((on, i) => <span key={i} className={`tk3__risk-cell ${on ? "is-on" : ""}`} />)}
    </div>
  );
}

export default function TracksPage() {
  const [expanded, setExpanded] = useState(null);
  useEffect(() => { document.title = "tracks — dreamclerk"; }, []);
  useSEO(SEO.tracks);

  return (
    <section className="section tk3" id="tracks">
      <div className="wrap tk3__wrap">
        <SectionLabel status="ok">$ tracks --list</SectionLabel>

        <header className="tk3__head">
          <h1 className="tk3__h1">6 tracks. 8 weeks. ship to prod.</h1>
          <p className="tk3__sub">every track ships to production. every track graduates to the same certificate. you can switch at sprint end.</p>
        </header>

        <div className="tk3__list">
          {tracks.map((t) => {
            const isOpen = expanded === t.code;
            return (
              <article
                key={t.code}
                className={`tk3__track ${isOpen ? "is-open" : ""}`}
                style={{ "--track-color": t.color }}
              >
                <header className="tk3__track-head">
                  <div className="tk3__track-id">
                    <div className="tk3__track-icon">
                      <TrackIcon name={t.icon} />
                    </div>
                    <div>
                      <div className="tk3__track-code">[{t.code}]</div>
                      <h2 className="tk3__track-name">{t.name}</h2>
                    </div>
                  </div>
                  <div className="tk3__track-stats">
                    <div className="tk3__stat">
                      <span className="tk3__stat-n">+{t.salary}%</span>
                      <span className="tk3__stat-l">salary</span>
                    </div>
                    <div className="tk3__stat">
                      <span className="tk3__stat-n">{t.level.split("→ ")[1]}</span>
                      <span className="tk3__stat-l">level after</span>
                    </div>
                    <div className="tk3__stat">
                      <span className="tk3__stat-n">{t.velocity} / 10</span>
                      <span className="tk3__stat-l">velocity</span>
                      <VelocityBar v={Math.round(t.velocity)} />
                    </div>
                    <div className="tk3__stat">
                      <span className="tk3__stat-n">{t.risk}</span>
                      <span className="tk3__stat-l">risk</span>
                      <RiskMeter r={t.risk} />
                    </div>
                  </div>
                </header>

                <p className="tk3__track-blurb">{t.blurb}</p>

                <div className="tk3__track-3col">
                  <div className="tk3__col">
                    <span className="tk3__col-h">$ what you'll ship</span>
                    <ul className="tk3__ship">
                      {t.what.map((w, i) => (
                        <li key={i}><ArrowRight width={12} height={12} color="var(--ok)" /><span>{w}</span></li>
                      ))}
                    </ul>
                  </div>
                  <div className="tk3__col">
                    <span className="tk3__col-h">$ what you won't do</span>
                    <p className="tk3__wont">{t.wont}</p>
                  </div>
                  <div className="tk3__col">
                    <span className="tk3__col-h">$ stack</span>
                    <ul className="tk3__stack">
                      {t.stack.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {isOpen && (
                  <div className="tk3__plan">
                    <span className="tk3__plan-h">$ 8-sprint plan</span>
                    <ol className="tk3__plan-list">
                      {t.sprintPlan.map(([n, what]) => (
                        <li key={n} className="tk3__plan-row">
                          <span className="tk3__plan-n">[{n}]</span>
                          <span className="tk3__plan-txt">{what}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}

                <button
                  className="tk3__track-toggle"
                  onClick={() => setExpanded(isOpen ? null : t.code)}
                >
                  {isOpen ? "↑ collapse 8-sprint plan" : "↓ expand 8-sprint plan"}
                </button>
              </article>
            );
          })}
        </div>

        <div className="tk3__cta">
          <a className="btn btn--solid" href="#" data-open-modal data-open-source="tracks-cta">
            notify me <span className="arr" aria-hidden="true">→</span>
          </a>
          <p className="tk3__cta-note">free during 2026-q2 beta · 1,847 in queue · you can switch at sprint end</p>
        </div>

        <p className="legal__back">
          <RouterLink to="/">← back to dreamclerk</RouterLink>
        </p>
      </div>
    </section>
  );
}