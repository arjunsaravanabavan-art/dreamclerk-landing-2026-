const stats = [
  { n: "1,847", l: "students in queue", s: "/ sprint 4" },
  { n: "24",    l: "hired this week",    s: "/ pre-launch beta" },
  { n: "73",    l: "% interview rate",   s: "/ mock + company" },
  { n: "61",    l: "avg review score",   s: "/ out of 100" },
  { n: "7",     l: "sprints / cohort",   s: "/ 8 wks each" },
];

export default function Stats() {
  return (
    <section id="stats" className="sec">
      <div className="wrap">
        <div className="stats reveal">
          {stats.map((s) => (
            <div className="stat" key={s.l}>
              <div className="num">{s.n}</div>
              <div className="lbl">{s.l}</div>
              <div className="sub">{s.s}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
