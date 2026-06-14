const tracks = [
  {
    n: "T-01",
    name: "frontend engineering",
    lvls: ["intern", "junior", "mid", "senior", "lead"],
    bullets: ["static html/css & ui bug fixes", "react components & state mgmt", "feature ownership & a11y audits", "design system architecture", "tech roadmap & hiring bar"],
    stack: ["react", "next.js", "typescript", "tailwind", "jest", "lighthouse", "figma"],
  },
  {
    n: "T-02",
    name: "backend engineering",
    lvls: ["intern", "junior", "mid", "senior", "lead"],
    bullets: ["rest endpoints & failing tests", "crud apis & jwt auth", "services, caching, rate limit", "distributed architecture", "api contracts & slas"],
    stack: ["node", "python", "java", "postgresql", "redis", "docker", "graphql"],
  },
  {
    n: "T-03",
    name: "ai / ml engineering",
    lvls: ["intern", "junior", "mid", "senior", "lead"],
    bullets: ["notebooks, eda, viz", "train & evaluate classifiers", "feature eng + mlflow pipelines", "deploy + monitor + a/b test", "ml strategy & governance"],
    stack: ["pytorch", "tensorflow", "huggingface", "pandas", "mlflow", "fastapi"],
  },
  {
    n: "T-04",
    name: "data science & analytics",
    lvls: ["intern", "junior", "mid", "senior", "lead"],
    bullets: ["sql queries & basic charts", "stats + kpi dashboards", "predictive models & a/b", "experimentation frameworks", "analytics org & bi ownership"],
    stack: ["sql", "python", "pandas", "tableau", "airflow", "dbt", "looker"],
  },
  {
    n: "T-05",
    name: "devops & platform",
    lvls: ["intern", "junior", "mid", "senior", "lead"],
    bullets: ["ci/cd pipelines & logs", "docker & k8s basics", "infra-as-code, observability", "multi-region architecture", "platform strategy & slas"],
    stack: ["docker", "kubernetes", "terraform", "aws", "github actions", "prometheus"],
  },
];

export default function Tracks() {
  return (
    <section id="tracks">
      <div className="wrap">
        <div className="section-head reveal">
          <div>
            <div className="label">07 · the role tracks</div>
          </div>
          <div>
            <h2>five tracks. five paths. one workspace.</h2>
            <p className="lede">
              pick the path that matches the job you want. each track takes you from intern to lead, with a promotion interview and capstone at every level.
            </p>
          </div>
        </div>

        <div className="tracks reveal">
          {tracks.map((t) => (
            <article className="track" key={t.n}>
              <div className="h">
                <span className="n">{t.n}</span>
                <span className="chip" style={{ padding: "2px 8px", fontSize: 10 }}>5 levels</span>
              </div>
              <h3>{t.name}</h3>
              <div className="lvl">
                {t.lvls.map((l, i) => (
                  <span key={l}>{l}{i < t.lvls.length - 1 ? " → " : ""}</span>
                ))}
              </div>
              <ul>
                {t.bullets.map((b) => <li key={b}>{b}</li>)}
              </ul>
              <div className="stack">
                {t.stack.map((s) => <span key={s}>{s}</span>)}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
