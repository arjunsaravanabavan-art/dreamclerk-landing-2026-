// ─── Workflow — 8-step loop with explicit ARTIFACTS at each step ────────
//
// The old landing had an 8-step loop but no concrete artifacts. New
// version: every step shows what the user PRODUCES, not just what they DO.
//
// This is the section that makes the inversion concrete. Each step is
// "<verb> → <artifact>". Recruiters scan this section in 10 seconds and
// understand exactly what the user walks away with.

import Section from "../Section.jsx";

const STEPS = [
  { n: "01", verb: "register",   d: "enter your email + education. no experience needed to sign up — that's the whole point.",   art: "account",                        artType: "metadata" },
  { n: "02", verb: "apply",      d: "AI recruiter screens your profile, runs a live conversational interview. pass = hired.",  art: "interview transcript + score",  artType: "doc" },
  { n: "03", verb: "onboard",    d: "Day 1: company wiki, architecture, predecessor ticket, your first ticket.",             art: "artifact pack (5 pages)",       artType: "doc" },
  { n: "04", verb: "ship",       d: "real work: bug, feature, model, API, test suite. real deadlines. real pressure.",         art: "3 PR diffs + test files",       artType: "code" },
  { n: "05", verb: "review",     d: "AI tech lead reviews every PR: correctness, security, performance, style.",              art: "4-axis review + reviewer note", artType: "doc" },
  { n: "06", verb: "promote",    d: "intern → junior → mid → senior → lead. each level needs an interview + capstone.",       art: "level record + capstone",       artType: "doc" },
  { n: "07", verb: "certify",    d: "blockchain-verified experience certificate. recruiter scans QR, sees your work.",          art: "cert ID + public verify URL",   artType: "verify" },
  { n: "08", verb: "apply out",  d: "your public work record is the resume. recruiters see code, not claims.",                  art: "portfolio + linkedin + cv",     artType: "verify" },
];

const ART_TYPE_META = {
  metadata: { label: "metadata", color: "var(--ink)" },
  doc:      { label: "doc",      color: "#5b8cff" },
  code:     { label: "code",     color: "#f0b94c" },
  verify:   { label: "verified", color: "var(--ok-fill)" },
};

export default function Workflow() {
  return (
    <Section
      id="workflow"
      command="how --artifacts"
      label="the protocol"
      title="eight steps. one loop. a portfolio at the end."
      lede="apply → onboard → ship → review → promote → certify → apply out. every step produces an artifact a recruiter can see."
      data-agent-section="workflow"
    >
      <ol className="dc-workflow">
        {STEPS.map((s, i) => {
          const meta = ART_TYPE_META[s.artType] || ART_TYPE_META.metadata;
          return (
            <li key={s.n} className="dc-workflow__step" style={{ "--i": i }}>
              <div className="dc-workflow__head">
                <span className="dc-workflow__n">{s.n}</span>
                <h3 className="dc-workflow__verb">{s.verb}</h3>
                <span className="dc-workflow__type" style={{ color: meta.color, borderColor: meta.color }}>
                  {meta.label}
                </span>
              </div>
              <p className="dc-workflow__d">{s.d}</p>
              <div className="dc-workflow__art">
                <span className="dc-workflow__art-arrow" aria-hidden="true">→</span>
                <span className="dc-workflow__art-label">artifact:</span>
                <code>{s.art}</code>
              </div>
            </li>
          );
        })}
      </ol>
      <div className="dc-workflow__close">
        <p>
          by sprint 3, your work record looks more like a real engineer's first
          6 months than a fresh graduate's resume. the difference is verification —
          every claim on your CV is backed by a diff, a review, and a date.
        </p>
      </div>
    </Section>
  );
}