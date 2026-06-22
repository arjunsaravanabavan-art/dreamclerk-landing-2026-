// ─── BetaCall — the final landing CTA, the inversion of "apply" ─────────
//
// The old BetaCall said "Apply for the Beta" with a generic form. The new
// one says: "you're not applying for a course. you're applying for a job
// that already exists." It then shows the 5-step onboarding journey the
// user is signing up for, with the very first concrete action they'll
// take: the AI recruiter interview.
//
// The form is a single-line email + role pick. The CTA underneath is a
// promise: "if you can pass the interview, you're in."

import Section from "../Section.jsx";
import { useState } from "react";

// The 8 "roles" surfaced in the form are the company-aligned tracks — the
// same names that appear in the company logos on the landing page. We
// derive them locally rather than importing from elsewhere because the
// CTA must be self-contained: if a future rename happens in agentsData,
// the BetaCall copy doesn't break.
const TRACKS = [
  { id: "backend",  label: "backend engineering" },
  { id: "frontend", label: "frontend engineering" },
  { id: "fullstack",label: "full-stack engineering" },
  { id: "aiml",     label: "AI / ML engineering" },
  { id: "data",     label: "data science & analytics" },
  { id: "devops",   label: "devops & cloud" },
  { id: "design",   label: "UI/UX design" },
  { id: "product",  label: "product management" },
];

const JOURNEY = [
  { n: "1", t: "enter your email",  s: "we send the interview link in 30 seconds." },
  { n: "2", t: "AI recruiter interview", s: "10 min. tailored to the role. live, not a form." },
  { n: "3", t: "you're hired — or you get feedback",  s: "no application goes to waste. retry any time." },
  { n: "4", t: "day 1 at nexara",    s: "wiki, predecessor ticket, first sprint. you ship in week 1." },
  { n: "5", t: "certificate in 8 weeks", s: "blockchain-verified. recruiter scans, sees your work." },
];

export default function BetaCall() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState(TRACKS[0]?.id);
  const [sent, setSent] = useState(false);

  const submit = (e) => {
    e?.preventDefault();
    if (!email.includes("@") || !role) return;
    setSent(true);
  };

  return (
    <Section
      id="beta-call"
      command="interview --role backend-engineer"
      label="the offer"
      title="you're not applying for a course. you're applying for a job."
      lede="the first 200 students are free. pass the AI recruiter interview, and you're in. day 1, week 1, you ship."
      data-agent-section="beta-call"
    >
      <div className="dc-call">
        <div className="dc-call__journey">
          <div className="dc-call__journey-head">what happens after you submit</div>
          <ol className="dc-call__steps">
            {JOURNEY.map((j) => (
              <li key={j.n} className="dc-call__step">
                <span className="dc-call__step-n">{j.n}</span>
                <div>
                  <div className="dc-call__step-t">{j.t}</div>
                  <div className="dc-call__step-s">{j.s}</div>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="dc-call__form-wrap">
          {!sent ? (
            <form className="dc-call__form" onSubmit={submit}>
              <div className="dc-call__form-head">apply for the beta</div>
              <div className="dc-call__form-lede">2 fields. 30 seconds. no CV upload.</div>
              <div className="dc-call__form-row">
                <label htmlFor="dc-email">email</label>
                <input
                  id="dc-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@somewhere.com"
                  required
                />
              </div>
              <div className="dc-call__form-row">
                <label htmlFor="dc-role">role</label>
                <select id="dc-role" value={role} onChange={(e) => setRole(e.target.value)}>
                  {TRACKS.map((r) => <option key={r.id} value={r.id}>{r.label}</option>)}
                </select>
              </div>
              <div className="dc-call__form-note">
                you'll get the interview link in 30 seconds. takes 10 minutes.
              </div>
              <button type="submit" className="btn btn--solid dc-call__submit">
                start the interview <span className="arr">→</span>
              </button>
              <div className="dc-call__form-fineprint">
                we won't spam. we won't sell. we'll email you exactly twice: the
                interview link, then the result. if you don't pass, you get feedback.
                you can retry in 14 days.
              </div>
            </form>
          ) : (
            <div className="dc-call__sent" aria-live="polite">
              <div className="dc-call__sent-head">check your inbox</div>
              <p>we sent the interview link to <b>{email}</b>.</p>
              <p>role: <b>{TRACKS.find((r) => r.id === role)?.label}</b>.</p>
              <p className="dc-call__sent-foot">
                <em>while you wait, read the predecessor ticket in the company wiki.
                it's the kind of thing you'll face on day 1.</em>
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="dc-call__pulse">
        <span className="dot" style={{ background: "var(--ok-fill)" }} />
        <b>3,412 people</b> have already been hired. <b>200 free spots</b> left for this cohort.
      </div>
    </Section>
  );
}