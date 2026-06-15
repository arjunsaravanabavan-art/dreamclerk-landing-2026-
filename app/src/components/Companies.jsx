import { useEffect, useState } from "react";

const data = [
  { code: "V01", name: "vivacity",     type: "b2b saas",       seats: 12, lead: "karthik",  live: true,  focus: "react · typescript" },
  { code: "N02", name: "nexara",       type: "fintech",        seats: 8,  lead: "priya",    live: true,  focus: "node · postgres · k8s" },
  { code: "O03", name: "oxygon",       type: "ai infra",       seats: 6,  lead: "aman",     live: true,  focus: "pytorch · embeddings" },
  { code: "L04", name: "levanto",      type: "data platform",  seats: 5,  lead: "divya",    live: true,  focus: "spark · dbt · airflow" },
  { code: "K05", name: "kaligo",       type: "edtech",         seats: 4,  lead: "rohan",    live: false, focus: "next · prisma" },
  { code: "F06", name: "figment",      type: "consumer ai",    seats: 4,  lead: "mira",     live: false, focus: "react · python" },
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
            <span>where you'll work</span>
          </div>
          <div className="section-head__body">
            <h2 className="section-head__title">
              six companies. <em style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontWeight: 400 }}>real</em> recruiters. real reviews.
            </h2>
            <p className="section-head__lede">
              we run this with real indian startups who care about hiring junior engineers the right way. every task is one of their actual problems. every reviewer is one of their actual engineers.
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
              <th>company</th>
              <th>type</th>
              <th>live seats</th>
              <th>tech lead</th>
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
              >
                <td className="mono">{c.code}</td>
                <td className="name">{c.name}</td>
                <td>{c.type}</td>
                <td className="num">{c.seats}</td>
                <td>{c.lead}</td>
                <td className="muted">{c.focus}</td>
                <td>
                  <span className={"status-pill " + (c.live ? "on" : "off")}>
                    <span className="dot" />
                    {c.live ? "open" : "soon"}
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
