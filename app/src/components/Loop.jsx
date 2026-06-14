import Section from "./Section.jsx";

const steps = [
  { n: "/01", t: "apply",   d: "ai recruiter screens your profile, runs a live conversational interview. pass = hired." },
  { n: "/02", t: "onboard", d: "day 1: codebase, architecture doc, slack channel, first ticket. like a real first day." },
  { n: "/03", t: "ship",    d: "bug, feature, model, api, test suite — real tasks, real deadlines, real pressure." },
  { n: "/04", t: "review",  d: "ai tech lead reviews every pr: correctness, security, performance, style." },
  { n: "/05", t: "xp",      d: "sprint velocity, code quality, pr-merge rate, review scores — your xp ledger." },
  { n: "/06", t: "promote", d: "intern → junior → mid → senior → lead. each level needs a tech interview + capstone." },
  { n: "/07", t: "certify", d: "verified experience certificate backed by your actual code submissions." },
];

export default function Loop() {
  return (
    <Section
      id="how"
      eyebrow="05 · the protocol"
      title="seven steps. one loop. real work."
      intro="apply → onboard → ship → review → xp → promote → certify. the same loop a real company runs, compressed into 8-week sprints."
    >
      <ol className="loop reveal">
        {steps.map((s) => (
          <li className="loop-step" key={s.n}>
            <div className="n">{s.n}</div>
            <div className="ic">{s.n.replace("/", "")}</div>
            <h3>{s.t}</h3>
            <p>{s.d}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
