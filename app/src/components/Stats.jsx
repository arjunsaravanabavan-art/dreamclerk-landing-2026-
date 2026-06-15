import { useEffect, useRef, useState } from "react";

const stats = [
  { n: 1847, l: "students in queue",     s: "sprint 4 · 2026-q2" },
  { n: 24,   l: "hired this week",        s: "pre-launch beta" },
  { n: 73,   l: "interview rate",         s: "mock + company", unit: "%" },
  { n: 61,   l: "avg review score",       s: "out of 100", unit: "/100" },
  { n: 7,    l: "sprints / cohort",       s: "8 wks each" },
];

export default function Stats() {
  const ref = useRef(null);
  const [vals, setVals] = useState(stats.map(() => 0));
  const ranOnce = useRef(false);

  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && !ranOnce.current) {
            ranOnce.current = true;
            const start = performance.now();
            const dur = 1500;
            const tick = (now) => {
              const k = Math.min(1, (now - start) / dur);
              const eased = 1 - Math.pow(1 - k, 3);
              setVals(stats.map((s) => Math.round(s.n * eased)));
              if (k < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
          }
        }
      },
      { threshold: 0.3 }
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  return (
    <section id="stats" className="section section--dark section--flush-into-dark">
      <div className="wrap">
        <div className="stats reveal" ref={ref}>
          {stats.map((s, i) => (
            <div className="stat" key={s.l}>
              <div className="k">{s.l}</div>
              <div className="v">
                <span>{vals[i].toLocaleString("en-IN")}</span>
                {s.unit ? <span className="unit">{s.unit}</span> : null}
              </div>
              <div className="d">{s.s}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
