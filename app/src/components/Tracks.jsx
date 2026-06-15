const tracks = [
  {
    n: "F1", name: "frontend engineering", lvl: "intern → lead",
    bar: "▰▰▰▰▱", prog: 4,
    bullets: [
      "static html/css & ui bug fixes",
      "react components & state mgmt",
      "feature ownership & a11y audits",
      "design system architecture",
      "tech roadmap & hiring bar",
    ],
    stack: ["react", "next.js", "typescript", "tailwind", "jest", "lighthouse", "figma"],
  },
  {
    n: "B2", name: "backend engineering", lvl: "intern → lead",
    bar: "▰▰▰▰▱", prog: 4,
    bullets: [
      "rest endpoints & failing tests",
      "crud apis & jwt auth",
      "services, caching, rate limit",
      "distributed architecture",
      "api contracts & slas",
    ],
    stack: ["node", "python", "java", "postgresql", "redis", "docker", "graphql"],
  },
  {
    n: "A3", name: "ai / ml engineering", lvl: "intern → lead",
    bar: "▰▰▰▱▱", prog: 3,
    bullets: [
      "notebooks, eda, viz",
      "train & evaluate classifiers",
      "feature eng + mlflow pipelines",
      "deploy + monitor + a/b test",
      "ml strategy & governance",
    ],
    stack: ["pytorch", "tensorflow", "huggingface", "pandas", "mlflow", "fastapi"],
  },
  {
    n: "D4", name: "data science & analytics", lvl: "intern → lead",
    bar: "▰▰▰▱▱", prog: 3,
    bullets: [
      "sql queries & basic charts",
      "stats + kpi dashboards",
      "predictive models & a/b",
      "experimentation frameworks",
      "analytics org & bi ownership",
    ],
    stack: ["sql", "python", "pandas", "tableau", "airflow", "dbt", "looker"],
  },
  {
    n: "P5", name: "devops & platform", lvl: "intern → lead",
    bar: "▰▰▰▰▱", prog: 4,
    bullets: [
      "ci/cd pipelines & logs",
      "docker & k8s basics",
      "infra-as-code, observability",
      "multi-region architecture",
      "platform strategy & slas",
    ],
    stack: ["docker", "kubernetes", "terraform", "aws", "github actions", "prometheus"],
  },
  {
    n: "S6", name: "security & compliance", lvl: "intern → lead",
    bar: "▰▰▱▱▱", prog: 2,
    bullets: [
      "owasp top 10 walkthrough",
      "sast/dast, dependency audit",
      "threat models & sso/saml",
      "compliance pipelines (soc2)",
      "security org & risk register",
    ],
    stack: ["burp", "snyk", "oauth2", "saml", "vault", "gcp-iam", "policies-as-code"],
  },
];

function Bar({ prog, total = 5 }) {
  const filled = "▰".repeat(prog);
  const empty = "▱".repeat(total - prog);
  return (
    <span className="track__bar" aria-label={`progress ${prog} of ${total}`}>
      <span className="ok">{filled}</span><span className="empty">{empty}</span>
    </span>
  );
}

export default function Tracks() {
  return (
    <section id="tracks" className="section">
      <div className="wrap">
        <header className="section-head reveal">
          <div className="section-head__label">
            <span className="cmd">$ tracks --list</span>
            <span>the role tracks</span>
          </div>
          <div className="section-head__body">
            <h2 className="section-head__title">six tracks. six paths. one workspace.</h2>
            <p className="section-head__lede">
              pick the path that matches the job you want. each track takes you from intern to lead, with a promotion interview and capstone at every level.
            </p>
          </div>
        </header>

        <div className="tracks reveal">
          {tracks.map((t) => (
            <article className="track" key={t.n}>
              <div className="track__head">
                <span className="idx">[{t.n}]</span>
                <span>5 levels</span>
              </div>
              <h3 className="track__title">{t.name}</h3>
              <div className="track__lvl">track: <b>{t.lvl}</b></div>
              <Bar prog={t.prog} />
              <ul className="track__list">
                {t.bullets.map((b) => <li key={b}>{b}</li>)}
              </ul>
              <div className="track__stack">
                {t.stack.map((s) => <span key={s}>{s}</span>)}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
