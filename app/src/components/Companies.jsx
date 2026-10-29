import { useEffect, useState } from "react";

const data = [
  { code: "V01", name: "vivacity",     type: "simulated b2b saas",       seats: 12, lead: "sample lead",  live: true,  focus: "react · typescript" },
  { code: "N02", name: "nexara",       type: "simulated fintech",        seats: 8,  lead: "sample lead",    live: true,  focus: "node · postgres · k8s" },
  { code: "O03", name: "oxygon",       type: "simulated AI infrastructure",       seats: 6,  lead: "sample lead",     live: true,  focus: "pytorch · embeddings" },
  { code: "L04", name: "levanto",      type: "simulated data platform",  seats: 5,  lead: "sample lead",    live: true,  focus: "spark · dbt · airflow" },
  { code: "K05", name: "kaligo",       type: "simulated edtech",         seats: 4,  lead: "sample lead",    live: false, focus: "next · prisma" },
  { code: "F06", name: "figment",      type: "simulated consumer AI",    seats: 4,  lead: "sample lead",     live: false, focus: "react · python" },
];

export default function Companies() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setActive((i) => (i + 1) % data.length), 2200);
    return () => clearInterval(t);
  }, []);

  return (
    <section id="companies" className="section">
      <div className="wrap">
        <header className="section-head reveal">
          <div className="section-head__label">
            <span className="cmd">$ cd partners/ && ls -la</span>
            <span>practice environments</span>
          </div>
          <div className="section-head__body">
            <h2 className="section-head__title">
              six <em style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontWeight: 400 }}>simulated</em> teams. practical reviews.
            </h2>
            <p className="section-head__lede">
              These are illustrative company scenarios for practising engineering workflows. They are not claims of partnerships with real companies, real vacancies, or reviews by actual employer engineers.
            </p>
          </div>
        </header>

        <div className="cmdline reveal">
          <span className="ps1">$</span> cd <span className="arg">{data[active].name}</span> <span className="op">&amp;&amp;</span> ls
          <span className="cursor" aria-hidden="true" />
        </div>

        <table className="table reveal">
          <thead>
            <tr>
              <th>code</th>
              <th>scenario</th>
              <th>type</th>
              <th>sample slots</th>
              <th>sample role</th>
              <th>stack</th>
              <th>status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((c, i) => (
              <tr
                key={c.code}
                className={i === active ? "active" : ""}
                onMouseEnter={() => setActive(i)}
                onClick={() => setActive(i)}
                onFocus={() => setActive(i)}
                tabIndex={0}
                role="button"
                aria-pressed={i === active}
                aria-label={`Select simulated ${c.name} scenario (${c.type}, illustrative ${c.seats} slots)`}
              >
                <td className="mono" data-th="code">{c.code}</td>
                <td className="name" data-th="company">{c.name}</td>
                <td data-th="type">{c.type}</td>
                <td className="num" data-th="sample slots">{c.seats}</td>
                <td data-th="sample role">{c.lead}</td>
                <td className="muted" data-th="stack">{c.focus}</td>
                <td data-th="status">
                  <span className={"status-pill " + (c.live ? "on" : "off")}>
                    <span className="dot" />
                    {c.live ? "demo" : "preview"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
