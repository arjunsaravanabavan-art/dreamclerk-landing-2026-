import Section from "./Section.jsx";

const companies = [
  { name: "Nexara",     industry: "B2B SaaS",       stack: "Node · React",   sprint: "6w",  hl: true,  desc: "Backend infra for logistics." },
  { name: "Strato Labs", industry: "Fintech",       stack: "Python · Go",    sprint: "8w",  hl: false, desc: "Payments orchestration." },
  { name: "Kibo AI",    industry: "ML Platform",   stack: "PyTorch · K8s",  sprint: "10w", hl: false, desc: "Model serving at scale." },
  { name: "Patchwork",  industry: "DevTools",      stack: "TS · Rust",      sprint: "6w",  hl: true,  desc: "Code review for monorepos." },
  { name: "Lumen Health", industry: "HealthTech",  stack: "FHIR · Python",  sprint: "8w",  hl: false, desc: "Clinical data pipelines." },
  { name: "Vela Commerce", industry: "E-commerce", stack: "Next · Postgres", sprint: "6w", hl: false, desc: "Headless storefront APIs." },
  { name: "Northwind Energy", industry: "CleanTech", stack: "Go · Timescale", sprint: "10w", hl: true, desc: "Grid telemetry platform." },
  { name: "Greybox",   industry: "Cybersecurity",  stack: "Rust · eBPF",    sprint: "8w",  hl: false, desc: "Runtime threat detection." },
];

export default function Companies() {
  return (
    <Section
      id="companies"
      eyebrow="§ 03 — The Company"
      title={<>You don't freelance. <em>You join a company.</em></>}
      intro="Every sprint, you're a named engineer inside a fictional but realistic company — with a product, a tech stack, a manager, and a backlog. Each one is different. The work is the work."
    >
      <div className="cos">
        <div className="cos-head">
          <div>Company</div>
          <div>Industry</div>
          <div>Stack</div>
          <div>Sprint</div>
          <div>Focus</div>
        </div>
        {companies.map((c) => (
          <div className={`cos-row${c.hl ? " hl" : ""}`} key={c.name}>
            <div className="cos-name">
              <span className="cos-dot" />
              <span>{c.name}</span>
            </div>
            <div className="cos-ind">{c.industry}</div>
            <div className="cos-stack">{c.stack}</div>
            <div className="cos-sprint">{c.sprint}</div>
            <div className="cos-desc">{c.desc}</div>
          </div>
        ))}
      </div>
    </Section>
  );
}
