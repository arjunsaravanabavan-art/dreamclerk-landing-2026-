// ─── Inversion — the marketing inversion of the whole pitch ─────────────
//
// The standard pitch: "learn skills → get a job."
// The actual reality:  "you need experience to get experience."
//
// The inversion: "you've already done the work. we just need to prove it."
//
// This section is the center of the landing. It re-frames the platform
// not as a "course" but as a verification + conversion service for the
// work people are already doing (or want to be doing). It maps the 6
// steps of the DreamClerk loop to the actual artifacts that get produced.
//
// The visual is a 2-column "claim → artifact" table that the user can
// scan in 5 seconds.

import Section from "../Section.jsx";

const ROWS = [
  {
    claim: "you've done the work — for free, in side projects, in late nights.",
    artifact: "verified sprint log + PR diff + AI review scores",
    color: "var(--ok-fill)",
  },
  {
    claim: "you've applied — 47 times, no callback.",
    artifact: "a blockchain-signed certificate a recruiter can scan",
    color: "#5b8cff",
  },
  {
    claim: "you've been told you need 2 years.",
    artifact: "a work record, dated, role-titled, peer-reviewed",
    color: "#f0b94c",
  },
  {
    claim: "you've taken courses, done bootcamps, built 30 projects.",
    artifact: "a single verified line: 'hired as junior backend at nexara, 8 weeks, sprint velocity 4.2'",
    color: "#d97aff",
  },
  {
    claim: "you've done the loop a recruiter skips.",
    artifact: "the loop, recorded: applied, onboarded, shipped, reviewed, certified",
    color: "var(--ink)",
  },
  {
    claim: "you're a fresher. the market treats that as a tax.",
    artifact: "we treat that as a starting line.",
    color: "var(--ok-fill)",
  },
];

export default function Inversion() {
  return (
    <Section
      id="inversion"
      command="frame --inverted"
      label="the inversion"
      title="we're not a course. we're proof you did the work."
      lede="the old pitch was 'learn skills, get a job.' we invert it. you've already done the work — you just don't have the artifact. we make the artifact. in 8 weeks."
      data-agent-section="inversion"
    >
      <div className="dc-inv">
        <div className="dc-inv__col dc-inv__col--claim">
          <div className="dc-inv__head">what you've already done</div>
          {ROWS.map((r, i) => (
            <div key={i} className="dc-inv__row dc-inv__row--claim">
              <span className="dc-inv__dot" style={{ background: r.color }} />
              <span>{r.claim}</span>
            </div>
          ))}
        </div>
        <div className="dc-inv__arrow" aria-hidden="true">
          <span>→</span>
        </div>
        <div className="dc-inv__col dc-inv__col--art">
          <div className="dc-inv__head">what you walk away with</div>
          {ROWS.map((r, i) => (
            <div key={i} className="dc-inv__row dc-inv__row--art">
              <span className="dc-inv__dot" style={{ background: r.color }} />
              <span><b>{r.artifact}</b></span>
            </div>
          ))}
        </div>
      </div>

      <div className="dc-inv__close">
        <p>
          you don't watch videos. you don't take quizzes. you get hired into a
          simulated company, do real work, and walk away with proof. <em>the
          first 200 students are free.</em>
        </p>
        <button className="btn btn--solid dc-inv__cta" data-open-modal="apply">
          know the beta <span className="arr">→</span>
        </button>
      </div>
    </Section>
  );
}