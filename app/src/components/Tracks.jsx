import { useEffect, useRef, useState } from "react";

const tracks = [
  { code: "F1", name: "frontend",            pct: 78, s: ["react", "tailwind", "vite", "accessibility"] },
  { code: "B2", name: "backend",             pct: 62, s: ["node", "postgresql", "redis", "auth"] },
  { code: "A3", name: "ai / ml",             pct: 41, s: ["python", "pytorch", "embeddings", "rag"] },
  { code: "D4", name: "data engineering",    pct: 55, s: ["sql", "spark", "dbt", "airflow"] },
  { code: "P5", name: "platform / devops",   pct: 67, s: ["docker", "k8s", "terraform", "observability"] },
  { code: "S6", name: "security",            pct: 38, s: ["appsec", "threat modeling", "owasp", "sast"] },
];

export default function Tracks() {
  const ref = useRef(null);
  const [progress, setProgress] = useState(Array(tracks.length).fill(0));

  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            // ease each card up to its target pct
            tracks.forEach((t, i) => {
              const start = performance.now();
              const dur = 1100 + i * 100;
              const tick = (now) => {
                const k = Math.min(1, (now - start) / dur);
                const eased = 1 - Math.pow(1 - k, 3);
                const cur = Math.round(t.pct * eased);
                setProgress((arr) => { const c = arr.slice(); c[i] = cur; return c; });
                if (k < 1) requestAnimationFrame(tick);
              };
              requestAnimationFrame(tick);
            });
            io.disconnect();
          }
        }
      },
      { threshold: 0.25 }
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  return (
    <section id="tracks" className="section">
      <div className="wrap">
        <header className="section-head reveal">
          <div className="section-head__label">
            <span className="cmd">$ tracks --list</span>
            <span>choose a track</span>
          </div>
          <div className="section-head__body">
            <h2 className="section-head__title">
              six tracks. one job, <em style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontWeight: 400 }}>deeply</em>.
            </h2>
            <p className="section-head__lede">
              every track is a 2-sprint build of a real company. you don't just "learn" frontend — you build the real frontend of a working startup, and a real recruiter from that startup reviews your work.
            </p>
          </div>
        </header>

        <ol className="tracks reveal" ref={ref}>
          {tracks.map((t, i) => (
            <li className="track" key={t.code} style={{ "--i": i }}>
              <div className="meta">
                <span className="idx">[{t.code}]</span>
                <span className="name">{t.name}</span>
                <span className="lvl">L1 → L4</span>
              </div>
              <div className="bar" aria-label={`${t.name} progress ${t.pct} percent`}>
                <span style={{ width: `${progress[i]}%` }} />
                <span className="n">{progress[i]}%</span>
              </div>
              <div className="stack">
                {t.s.map((k) => <span className="chip" key={k}>{k}</span>)}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
