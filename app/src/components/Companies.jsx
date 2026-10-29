import { useEffect, useMemo, useState } from "react";
import { RouterLink } from "../lib/router.jsx";

const data = [
  { code: "V01", name: "vivacity", type: "simulated b2b saas", seats: 12, lead: "sample lead", live: true, focus: "react · typescript", industry: "B2B SaaS", roles: ["Frontend Developer", "Full-Stack Developer", "Product Analyst"] },
  { code: "N02", name: "nexara", type: "simulated fintech", seats: 8, lead: "sample lead", live: true, focus: "node · postgres · k8s", industry: "Fintech", roles: ["Backend Developer", "Platform Engineer", "Business Analyst"] },
  { code: "O03", name: "oxygon", type: "simulated AI infrastructure", seats: 6, lead: "sample lead", live: true, focus: "pytorch · embeddings", industry: "AI & Infrastructure", roles: ["AI Engineer", "Machine Learning Engineer", "Data Engineer"] },
  { code: "L04", name: "levanto", type: "simulated data platform", seats: 5, lead: "sample lead", live: false, focus: "spark · dbt · airflow", industry: "Data", roles: ["Data Analyst", "Analytics Engineer", "Data Platform Engineer"] },
  { code: "K05", name: "kaligo", type: "simulated edtech", seats: 4, lead: "sample lead", live: false, focus: "next · prisma", industry: "EdTech", roles: ["Frontend Developer", "UX Engineer", "Product Associate"] },
  { code: "F06", name: "figment", type: "simulated consumer AI", seats: 4, lead: "sample lead", live: false, focus: "react · python", industry: "Consumer AI", roles: ["AI Product Engineer", "Python Developer", "Quality Engineer"] },
];

export default function Companies() {
  const [active, setActive] = useState(0);
  const [query, setQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState(data[0].roles[0]);
  const [industry, setIndustry] = useState("all");

  useEffect(() => {
    const t = setInterval(() => setActive((i) => (i + 1) % data.length), 4200);
    return () => clearInterval(t);
  }, []);

  const industries = useMemo(() => ["all", ...new Set(data.map((c) => c.industry))], []);
  const filtered = data.filter((company) => {
    const matchesIndustry = industry === "all" || company.industry === industry;
    const haystack = [company.name, company.industry, company.type, company.focus, ...company.roles].join(" ").toLowerCase();
    return matchesIndustry && haystack.includes(query.trim().toLowerCase());
  });
  const current = data[active];

  function chooseCompany(company) {
    const index = data.findIndex((item) => item.code === company.code);
    setActive(index);
    setSelectedRole(company.roles[0]);
  }

  return (
    <section id="companies" className="section companies-section">
      <div className="wrap">
        <header className="companies-explorer-layout reveal">
          <aside className="company-role-explorer" aria-label="Interactive company and role explorer">
            <div className="company-role-explorer__top">
              <span className="cmd">$ explore --companies --roles</span>
              <span className="company-role-explorer__live"><span className="dot" /> interactive</span>
            </div>
            <label className="company-role-explorer__search">
              <span className="sr-only">Search companies, industries, or roles</span>
              <span aria-hidden="true">⌕</span>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search companies or roles..."
              />
              {query && <button type="button" onClick={() => setQuery("")} aria-label="Clear search">×</button>}
            </label>
            <label className="company-role-explorer__filter">
              <span>INDUSTRY</span>
              <select value={industry} onChange={(event) => setIndustry(event.target.value)}>
                {industries.map((item) => <option key={item} value={item}>{item === "all" ? "All industries" : item}</option>)}
              </select>
            </label>
            <div className="company-role-explorer__companies" aria-label="Matching simulated companies">
              {filtered.length ? filtered.map((company) => (
                <button
                  className={"company-role-option" + (current.code === company.code ? " is-active" : "")}
                  type="button"
                  key={company.code}
                  onClick={() => chooseCompany(company)}
                  aria-pressed={current.code === company.code}
                >
                  <span className="company-role-option__mark">{company.name.slice(0, 1)}</span>
                  <span className="company-role-option__copy">
                    <strong>{company.name}</strong>
                    <small>{company.industry}</small>
                  </span>
                  <span className="company-role-option__arrow" aria-hidden="true">↗</span>
                </button>
              )) : <p className="company-role-explorer__empty">No matches. Try another company or role.</p>}
            </div>
            <div className="company-role-explorer__roles">
              <div className="company-role-explorer__roles-head">
                <span>ROLES TO PRACTISE</span>
                <span>{current.code}</span>
              </div>
              <h3>{current.name}<span> / role tracks</span></h3>
              <div className="company-role-explorer__role-list">
                {current.roles.map((role) => (
                  <button
                    type="button"
                    className={"company-role-chip" + (selectedRole === role ? " is-active" : "")}
                    key={role}
                    onClick={() => setSelectedRole(role)}
                    aria-pressed={selectedRole === role}
                  >
                    <span>{role}</span><span aria-hidden="true">→</span>
                  </button>
                ))}
              </div>
              <div className="company-role-explorer__selected">
                <span className="company-role-explorer__selected-dot" />
                <span>Selected track</span>
                <strong>{selectedRole}</strong>
              </div>
              <RouterLink to="/companies" className="btn btn--solid company-role-explorer__cta">
                explore company profiles <span className="arr" aria-hidden="true">→</span>
              </RouterLink>
              <p className="company-role-explorer__note">Simulated practice scenarios — not live vacancies.</p>
            </div>
          </aside>

          <div className="section-head__body companies-explorer-copy">
            <div className="section-head__label">
              <span className="cmd">$ cd partners/ && ls -la</span>
              <span>where you'll work</span>
            </div>
            <h2 className="section-head__title">
              six <em style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontWeight: 400 }}>simulated</em> companies. real tracks.
            </h2>
            <p className="section-head__lede">
              Explore practice environments across SaaS, fintech, AI infrastructure, data, EdTech, and consumer AI. Select a company to see role tracks and the tools you can practise with.
            </p>
            <div className="companies-explorer-copy__stats">
              <span><strong>06</strong> company scenarios</span>
              <span><strong>18</strong> example role tracks</span>
            </div>
          </div>
        </header>

        <div className="cmdline reveal">
          <span className="ps1">$</span> cd <span className="arg">{current.name}</span> <span className="op">&amp;&amp;</span> ls
          <span className="cursor" aria-hidden="true" />
        </div>

        <table className="table reveal">
          <thead>
            <tr>
              <th>code</th><th>scenario</th><th>type</th><th>sample slots</th><th>sample role</th><th>stack</th><th>status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((company, i) => (
              <tr
                key={company.code}
                className={i === active ? "active" : ""}
                onMouseEnter={() => { setActive(i); setSelectedRole(company.roles[0]); }}
                onClick={() => chooseCompany(company)}
                onFocus={() => { setActive(i); setSelectedRole(company.roles[0]); }}
                tabIndex={0}
                role="button"
                aria-pressed={i === active}
                aria-label={`Select simulated ${company.name} scenario`}
              >
                <td className="mono" data-th="code">{company.code}</td>
                <td className="name" data-th="company">{company.name}</td>
                <td data-th="type">{company.type}</td>
                <td className="num" data-th="sample slots">{company.seats}</td>
                <td data-th="sample role">{company.roles[0]}</td>
                <td className="muted" data-th="stack">{company.focus}</td>
                <td data-th="status"><span className={"status-pill " + (company.live ? "on" : "off")}><span className="dot" />{company.live ? "demo" : "preview"}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
