import Section from "./Section.jsx";

const companies = [
  { name: "nexara",          industry: "B2B SaaS",     stack: "Node · React",     sprint: "6w",  hl: true,  desc: "backend infra for logistics." },
  { name: "strato labs",     industry: "Fintech",      stack: "Python · Go",      sprint: "8w",  hl: false, desc: "payments orchestration." },
  { name: "kibo ai",         industry: "ML platform",  stack: "PyTorch · K8s",    sprint: "10w", hl: false, desc: "model serving at scale." },
  { name: "patchwork",       industry: "DevTools",     stack: "TS · Rust",        sprint: "6w",  hl: true,  desc: "code review for monorepos." },
  { name: "lumen health",    industry: "HealthTech",   stack: "FHIR · Python",    sprint: "8w",  hl: false, desc: "clinical data pipelines." },
  { name: "vela commerce",   industry: "E-commerce",   stack: "Next · Postgres",  sprint: "6w",  hl: false, desc: "headless storefront APIs." },
  { name: "northwind energy", industry: "CleanTech",   stack: "Go · Timescale",   sprint: "10w", hl: true,  desc: "grid telemetry platform." },
  { name: "greybox",         industry: "Cybersecurity", stack: "Rust · eBPF",     sprint: "8w",  hl: false, desc: "runtime threat detection." },
];

export default function Companies() {
  return (
    <Section
      id="companies"
      command="companies --list"
      label="the simulated company"
      title={<>you don't freelance. <em style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontWeight: 400 }}>you join a company.</em></>}
      lede="every sprint, you're a named engineer inside a fictional but realistic company — with a product, a tech stack, a manager, and a backlog. each one is different. the work is the work."
    >
      <div className="cos reveal">
        <div className="cos__head">
          <div>$ cd</div>
          <div>industry</div>
          <div>stack</div>
          <div>sprint</div>
          <div>ls · what you ship</div>
        </div>
        {companies.map((c) => (
          <div className={"cos__row" + (c.hl ? " hl" : "")} key={c.name}>
            <div className="cos__name">
              <span className="cos__dot" />
              <span>{c.name}</span>
            </div>
            <div className="cos__ind">{c.industry}</div>
            <div className="cos__stack">{c.stack}</div>
            <div className="cos__sprint">{c.sprint}</div>
            <div className="cos__desc">{c.desc}</div>
          </div>
        ))}
      </div>
    </Section>
  );
}
