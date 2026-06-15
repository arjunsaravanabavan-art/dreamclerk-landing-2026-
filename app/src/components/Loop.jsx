import { useEffect, useRef } from "react";
import Section from "./Section.jsx";

const steps = [
  { n: "01", t: "apply",   d: "ai recruiter screens your profile, runs a live conversational interview. pass = hired." },
  { n: "02", t: "onboard", d: "day 1: codebase, architecture doc, slack channel, first ticket. like a real first day." },
  { n: "03", t: "ship",    d: "bug, feature, model, api, test suite — real tasks, real deadlines, real pressure." },
  { n: "04", t: "review",  d: "ai tech lead reviews every pr: correctness, security, performance, style." },
  { n: "05", t: "xp",      d: "sprint velocity, code quality, pr-merge rate, review scores — your xp ledger." },
  { n: "06", t: "promote", d: "intern → junior → mid → senior → lead. each level needs a tech interview + capstone." },
  { n: "07", t: "certify", d: "verified experience certificate backed by your actual code submissions." },
  { n: "08", t: "apply out", d: "your public work record is the resume. recruiters see code, not claims." },
];

export default function Loop() {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const cells = ref.current.querySelectorAll(".loop__step");
            cells.forEach((c, i) => setTimeout(() => c.classList.add("in"), i * 70));
            io.disconnect();
          }
        }
      },
      { threshold: 0.2 }
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  return (
    <Section
      id="how"
      command="how --steps"
      label="the protocol"
      title="eight steps. one loop. real work."
      lede="apply → onboard → ship → review → xp → promote → certify → apply out. the same loop a real company runs, compressed into 8-week sprints."
    >
      <ol className="loop" ref={ref}>
        {steps.map((s, i) => (
          <li className="loop__step" key={s.n} style={{ "--i": i }}>
            <div className="n">[{s.n}]</div>
            <div className="ic" aria-hidden="true">{s.n}</div>
            <h3>{s.t}</h3>
            <p>{s.d}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
