// ─── BetaPage — the orchestrator for /beta ────────────────────────────────
//
// Per BETA.md §3, the user lands on /beta (no token — beta is open). The
// page decides which sub-view to render based on session state:
//
//   1. no email captured         → EmailGate (one input, that's it)
//   2. email captured, no name   → Onboarding (3-step form)
//   3. onboarded, no sprint      → Day-1 cutscene
//   4. sprint started            → Dashboard (sprint board + manager chat)
//   5. sprint ended              → WrapUp (work record + verdict + survey)
//
// All sub-views are co-located in this file for now. v0.2 will split them
// out as they grow. Per §13.1, this entire flow must work on localhost
// before any production deploy.

import { useState } from "react";
import { useBetaSession, computeFinalVerdict } from "../lib/betaState.js";
import { BETA } from "../lib/betaData.js";
import SectionLabel from "./SectionLabel.jsx";
import { useSEO, SEO } from "../lib/seo.js";
import { RouterLink } from "../lib/router.jsx";

// ─── shared beta styles (re-used by all sub-views) ─────────────────────────
//
// Kept inline as CSS-in-JS via className. The actual CSS rules go in
// index.css under the `.beta-*` namespace. We use className + a tiny style
// shim only for one-off layout decisions.

export default function BetaPage() {
  const sessionState = useBetaSession();
  const { session } = sessionState;

  useSEO({
    ...SEO.landing,
    title: "beta · dreamclerk",
    description: "open beta. a 5-day simulated AI/ML sprint at orbit labs.",
    noindex: true, // beta pages are not for search engines (D-signed-off)
  });

  // No email → email gate.
  if (!session.user.email) {
    return <BetaEmailGate sessionState={sessionState} />;
  }

  // Email captured, no user info yet → onboarding.
  if (!session.user.name) {
    return <BetaOnboarding sessionState={sessionState} />;
  }

  // Onboarded but sprint not started → Day-1 cutscene.
  if (!session.sprintStartedAt) {
    return <BetaDay1Cutscene sessionState={sessionState} />;
  }

  // Sprint ended, all approved → WorkRecord (the verified work record).
  const verdict = computeFinalVerdict(session);
  if (verdict === "pass" || verdict === "fail" || verdict === "incomplete") {
    return <BetaWrapUp sessionState={sessionState} verdict={verdict} />;
  }

  // Otherwise → dashboard (sprint board + manager chat).
  return <BetaDashboard sessionState={sessionState} />;
}

// ─── BetaEmailGate — first screen for the open beta ──────────────────────
//
// One field: email. Used as the session id. We never send anything to it —
// the copy is honest about that. The user moves to the existing onboarding
// form (3 steps) immediately after.
function BetaEmailGate({ sessionState }) {
  const { session, patchUser } = sessionState;
  const [email, setEmail] = useState(session.user.email || "");
  const [touched, setTouched] = useState(false);

  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const submit = (e) => {
    e?.preventDefault();
    if (!valid) {
      setTouched(true);
      return;
    }
    patchUser({ email: email.trim().toLowerCase() });
  };

  return (
    <main className="beta-shell">
      <SectionLabel status="active">open beta · orbit labs · cohort 1</SectionLabel>
      <div className="beta-card">
        <h1 className="beta-h1">a 5-day simulated AI/ML internship.</h1>
        <p className="beta-p">
          dreamclerk runs in partnership with{" "}
          <a className="beta-link" href="https://orbitlabs.in" target="_blank" rel="noreferrer">orbit labs</a>,
          a 14-person AI/ML research lab. you take on an AI/ML engineering
          intern role for 5 days, ship 4 tasks, and get a verified work
          record — public, permanent, signed by an actual human.
        </p>

        <h2 className="beta-h2">what's tested</h2>
        <ol className="beta-betalist">
          <li><strong>root-cause thinking.</strong> diagnose a sentiment-model drift. the obvious answer is usually wrong.</li>
          <li><strong>model craft.</strong> fine-tune distilbert on an imbalanced dataset. ship the tokenizer with the model.</li>
          <li><strong>productionisation.</strong> wrap the model in a fastapi endpoint, load it once at startup, measure p95.</li>
          <li><strong>data discipline.</strong> audit the training pipeline for label leakage. the subtle one is in target encoding.</li>
        </ol>

        <h2 className="beta-h2">how it works</h2>
        <ul className="beta-betalist">
          <li>5 days, your local timezone. manager checks in 9 AM + 6 PM local.</li>
          <li>free re-runs if you fail a task (per D5).</li>
          <li>verified work record on your linkedin, signed by the founder.</li>
        </ul>

        <h2 className="beta-h2">what this is not</h2>
        <ul className="beta-betalist">
          <li>not a course. not a certificate mill. it's a simulated job, with simulated deadlines and a simulated tech lead.</li>
          <li>not a job placement. the verified work record is performance evidence, not an offer.</li>
        </ul>

        <form className="beta-form" onSubmit={submit}>
          <h2 className="beta-h2">enter your email to start</h2>
          <p className="beta-p beta-p--small">
            your email is your session id — it's how we keep your sprint, your
            submissions, and your work record tied together. we don't email you
            anything, ever. no magic links, no newsletters, no "welcome to the
            beta."
          </p>
          <label className="beta-field">
            <span className="beta-label">email</span>
            <input
              className="beta-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setTouched(true)}
              placeholder="you@college.edu"
              autoFocus
              autoComplete="email"
              inputMode="email"
              aria-invalid={touched && !valid}
            />
            {touched && !valid ? (
              <span className="beta-hint beta-hint--err">that doesn't look like an email. try again.</span>
            ) : null}
          </label>
          <div className="beta-row beta-row--end">
            <RouterLink to="/" className="beta-btn beta-btn--ghost">← back to home</RouterLink>
            <button className="beta-btn beta-btn--primary" type="submit" disabled={!valid}>
              continue →
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

// ─── BetaOnboarding — 3-step form per §3 Day 1 ─────────────────────────────
function BetaOnboarding({ sessionState }) {
  const { session, patchUser } = sessionState;
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: session.user.name || "",
    college: session.user.college || "",
    year: session.user.year || "",
    branch: session.user.branch || "",
    why: "",
  });
  const [skills, setSkills] = useState({ ...session.user.skills });

  const next = () => setStep((s) => Math.min(2, s + 1));
  const prev = () => setStep((s) => Math.max(0, s - 1));

  const submit = () => {
    patchUser({ ...form, why: form.why, skills });
  };

  return (
    <main className="beta-shell">
      <SectionLabel status="active">$ dreamclerk --apply --role aiml-intern --company orbit-labs</SectionLabel>
      <div className="beta-card">
        <h1 className="beta-h1">welcome to orbit labs.</h1>
        <p className="beta-p">three steps. ~3 minutes. we read every response.</p>

        <div className="beta-stepper" role="tablist" aria-label="onboarding steps">
          {[0, 1, 2].map((i) => (
            <div key={i} className={`beta-step ${i === step ? "is-active" : ""} ${i < step ? "is-done" : ""}`}>
              <span className="beta-step-n">[{String(i + 1).padStart(2, "0")}]</span>
              <span className="beta-step-t">{["about you", "why this", "your skills"][i]}</span>
            </div>
          ))}
        </div>

        {step === 0 && (
          <div className="beta-form">
            <label className="beta-field">
              <span className="beta-label">name</span>
              <input
                className="beta-input"
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Priya M."
                autoFocus
              />
            </label>
            <label className="beta-field">
              <span className="beta-label">college</span>
              <input
                className="beta-input"
                type="text"
                value={form.college}
                onChange={(e) => setForm({ ...form, college: e.target.value })}
                placeholder="Anna University"
              />
            </label>
            <div className="beta-row">
              <label className="beta-field beta-field--half">
                <span className="beta-label">year</span>
                <select
                  className="beta-input"
                  value={form.year}
                  onChange={(e) => setForm({ ...form, year: e.target.value })}
                >
                  <option value="">—</option>
                  <option>1st year</option>
                  <option>2nd year</option>
                  <option>3rd year</option>
                  <option>4th year</option>
                </select>
              </label>
              <label className="beta-field beta-field--half">
                <span className="beta-label">branch</span>
                <input
                  className="beta-input"
                  type="text"
                  value={form.branch}
                  onChange={(e) => setForm({ ...form, branch: e.target.value })}
                  placeholder="B.Tech CS"
                />
              </label>
            </div>
            <div className="beta-row beta-row--end">
              <button
                className="beta-btn"
                onClick={next}
                disabled={!form.name || !form.college || !form.year || !form.branch}
              >
                next →
              </button>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="beta-form">
            <label className="beta-field">
              <span className="beta-label">why this?</span>
              <textarea
                className="beta-input beta-textarea"
                value={form.why}
                onChange={(e) => setForm({ ...form, why: e.target.value })}
                placeholder="in 2-3 sentences, why do you want to do a 5-day ML sprint at orbit labs?"
                rows={5}
                autoFocus
              />
              <span className="beta-hint">arjun reads every response. there's no wrong answer.</span>
            </label>
            <div className="beta-row beta-row--end">
              <button className="beta-btn beta-btn--ghost" onClick={prev}>← back</button>
              <button className="beta-btn" onClick={next} disabled={form.why.length < 20}>
                next →
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="beta-form">
            <p className="beta-p beta-p--small">
              rate your honest skill level. no right answer.
            </p>
            {[
              ["python", "Python"],
              ["numpyPandas", "NumPy / Pandas"],
              ["sklearn", "scikit-learn"],
              ["pytorch", "PyTorch / Transformers"],
            ].map(([k, label]) => (
              <div key={k} className="beta-skill">
                <span className="beta-skill-label">{label}</span>
                <input
                  className="beta-skill-range"
                  type="range"
                  min="1"
                  max="10"
                  value={skills[k]}
                  onChange={(e) => setSkills({ ...skills, [k]: Number(e.target.value) })}
                />
                <span className="beta-skill-v">{skills[k]}</span>
              </div>
            ))}
            <div className="beta-row beta-row--end">
              <button className="beta-btn beta-btn--ghost" onClick={prev}>← back</button>
              <button className="beta-btn" onClick={submit}>enter orbit labs →</button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

// ─── BetaDay1Cutscene — last gate before sprint starts ─────────────────────
function BetaDay1Cutscene({ sessionState }) {
  const { session, startSprint } = sessionState;
  return (
    <main className="beta-shell">
      <SectionLabel status="active">day 1 · orbit labs · welcome</SectionLabel>
      <div className="beta-card">
        <pre className="beta-terminal">{`
  ┌──────────────────────────────────────────────────────┐
  │  ORBIT LABS · WIKI / ABOUT                           │
  │                                                      │
  │  ${BETA.company.wiki.about.split(". ").slice(0, 2).join(". ")}.
  │
  │  culture:                                            │
  │  ${BETA.company.wiki.culture.slice(0, 3).map((c) => "• " + c).join("\n  │  ")}
  │                                                      │
  │  tools: ${BETA.company.wiki.tools.join(" · ")}
  └──────────────────────────────────────────────────────┘
        `.trim()}</pre>

        <h2 className="beta-h2">hi {session.user.name.split(" ")[0]}.</h2>
        <p className="beta-p">
          your 5-day sprint starts when you click the button below. the clock
          is in <code className="beta-code">{session.user.timezone}</code> (your
          local time). anjali will check in at 9 AM and 6 PM local. vikram
          reviews submissions in &lt;5 min during work hours.
        </p>

        <div className="beta-callout">
          <strong>read this before you start:</strong>{" "}
          sprint ends 5 days from now at 11:59 PM your-local. if you fail a
          task, you can re-run the whole sprint for free (per D5). the goal
          is to finish, not to finish fast.
        </div>

        <div className="beta-row beta-row--end">
          <button className="beta-btn beta-btn--primary" onClick={startSprint}>
            start sprint ↵
          </button>
        </div>
      </div>
    </main>
  );
}

// ─── BetaWrapUp — sprint ended, show verdict + record + survey ────────────
function BetaWrapUp({ sessionState, verdict }) {
  const { session, patch, startNewRun } = sessionState;
  const finalVerdict = verdict;

  return (
    <main className="beta-shell">
      <SectionLabel status={finalVerdict === "pass" ? "active" : "error"}>
        sprint · {finalVerdict === "pass" ? "complete · pass" : finalVerdict === "fail" ? "complete · fail" : "ended · incomplete"}
      </SectionLabel>
      <div className="beta-card">
        <h1 className="beta-h1">
          {finalVerdict === "pass"
            ? "you shipped it."
            : finalVerdict === "fail"
            ? "you finished — but not all of it shipped."
            : "sprint ended."}
        </h1>
        <p className="beta-p">
          {finalVerdict === "pass"
            ? "4/4 tasks approved by vikram. arjun is reviewing your submissions now. your work record will be issued within 24h."
            : finalVerdict === "fail"
            ? "you submitted all 4 but not all were approved. per D5, you can re-run the whole sprint for free."
            : "the sprint clock ran out. you can re-run for free."}
        </p>

        {finalVerdict === "pass" ? (
          <BetaRecordView session={session} />
        ) : (
          <div className="beta-row">
            <button className="beta-btn beta-btn--primary" onClick={startNewRun}>
              re-run sprint (free)
            </button>
            <RouterLink to="/" className="beta-btn beta-btn--ghost">back to home</RouterLink>
          </div>
        )}

        {finalVerdict === "pass" && <BetaSurvey sessionState={sessionState} />}
      </div>
    </main>
  );
}

// ─── BetaRecordView — the verified work record ─────────────────────────────
function BetaRecordView({ session }) {
  // Per D7: share-before-issuance is allowed. The URL is public, with a
  // "verdict pending" tag that updates in place. The cert id is what we
  // surface in the URL — the verify page looks the record up by it on
  // Supabase so the link works cross-device.
  const certId = session.record.id || `${session.token}-${session.run}`;
  const recordUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/verify/${certId}`;
  const verdictTag = session.record.verdict === "pass" ? "verified" : "verdict pending";

  const copy = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(recordUrl);
    }
  };

  return (
    <div className="beta-record">
      <pre className="beta-terminal">{`
$ verify --record ${certId}

  Applicant:    ${session.user.name}
  College:      ${session.user.college}, ${session.user.branch}, ${session.user.year}
  Company:      Orbit Labs (simulated)
  Role:         AI/ML Engineering Intern
  Sprint:       5 days
  Tasks:        ${Object.values(session.taskStates).filter((t) => t.status === "approved").length}/4 approved
  Tech Lead:    ${BETA.personas.techLead.name} (scripted, AI-assisted review)
  Reviewer:     ${BETA.reviewer.name} (${BETA.reviewer.title})
  Review:       ${session.record.review || "— (founder review in progress)"}
  Verdict:      ${verdictTag}
  Issued:       ${session.record.issuedAt ? new Date(session.record.issuedAt).toISOString().slice(0, 10) : "—"}
  Verify:       ${recordUrl}
      `.trim()}</pre>

      <div className="beta-row">
        <button className="beta-btn" onClick={copy}>copy share link</button>
        <a className="beta-btn beta-btn--ghost" href={recordUrl} target="_blank" rel="noreferrer">
          open public page ↗
        </a>
      </div>

      <p className="beta-p beta-p--small">
        share on linkedin with <code className="beta-code">#DreamClerkBeta</code>. per D8, the cohort is public.
      </p>
    </div>
  );
}

// ─── BetaSurvey — in-app CSAT + exit interview booking ─────────────────────
function BetaSurvey({ sessionState }) {
  const { session, patch } = sessionState;
  const [csat, setCsat] = useState(session.survey.csat);
  const [booked, setBooked] = useState(session.survey.exitInterviewBooked);

  const submitCsat = (n) => {
    setCsat(n);
    patch({ survey: { ...session.survey, csat: n } });
  };
  const book = () => {
    setBooked(true);
    patch({ survey: { ...session.survey, exitInterviewBooked: true } });
  };

  return (
    <div className="beta-survey">
      <h3 className="beta-h3">one last thing</h3>
      <p className="beta-p">how did this feel? (1 = game, 10 = real job)</p>
      <div className="beta-csat" role="radiogroup" aria-label="csat 1-10">
        {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            role="radio"
            aria-checked={csat === n}
            className={`beta-csat-btn ${csat === n ? "is-active" : ""}`}
            onClick={() => submitCsat(n)}
          >
            {n}
          </button>
        ))}
      </div>
      {csat != null && (
        <div className="beta-survey-row">
          <p className="beta-p">book your 15-min exit interview with arjun.</p>
          {!booked ? (
            <button className="beta-btn" onClick={book}>book slot →</button>
          ) : (
            <p className="beta-p beta-p--small">booked. arjun will email you a calendar link within 24h.</p>
          )}
        </div>
      )}
    </div>
  );
}

// ─── BetaDashboard, BetaTaskWorkspace, BetaManagerChat, BetaSprintBoard ────
//
// Imported from separate files to keep this orchestrator readable. v0.2
// will co-locate with their data layer.

import BetaDashboard from "./beta/BetaDashboard.jsx";
