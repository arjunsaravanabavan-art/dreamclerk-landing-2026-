const stats = [
  { n: 1847, l: "students in queue",     s: "sprint 4 · 2026-q2" },
  { n: 24,   l: "hired this week",        s: "pre-launch beta" },
  { n: 73,   l: "% interview rate",       s: "mock + company", unit: "%" },
  { n: 61,   l: "avg review score",       s: "out of 100", unit: "/100" },
  { n: 7,    l: "sprints / cohort",       s: "8 wks each" },
];

export default function Stats() {
  return (
    <section id="stats" className="section section--dark section--flush-into-dark">
      <div className="wrap">
        <div className="stats reveal">
          {stats.map((s) => (
            <div className="stat" key={s.l}>
              <div className="k">{s.l}</div>
              <div className="v">
                <span data-counter={s.n}>0</span>{s.unit ? <span className="unit">{s.unit}</span> : null}
              </div>
              <div className="d">{s.s}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
