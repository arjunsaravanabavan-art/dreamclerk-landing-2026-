// ─── HowBetaPage — "/how-beta": how the deterministic review engine works ──
//
// Per BETA.md §2 + §5: the open beta is reviewed by a deterministic engine
// (a fixed rubric of signals, applied the same way to every submission).
// This page is the "read before you start" explainer. It covers:
//
//   1. The 4 evaluation axes (the engine's rubric, 100 points total).
//   2. The 4 task briefs + the acceptance signal the engine checks for.
//   3. What the engine is (deterministic, signal-based, explicit).
//   4. What the engine is NOT (an LLM judge, a real code review, a hire/fire
//      signal). v0.1 is honest about the limits.
//   5. The 3 review outcomes (approve / reject-with-note / flag-for-founder).
//
// Linked from the beta page header, the cert verify page, and the FAQ.
// Noindex is OK — this is for beta participants, not search traffic.

import SectionLabel from "./SectionLabel.jsx";
import { BETA } from "../lib/betaData.js";
import { useSEO, SEO } from "../lib/seo.js";
import { RouterLink } from "../lib/router.jsx";

const AXES = [
  {
    n: "01", name: "comprehension under pressure",
    weight: 30, color: "red",
    blurb: "can you read a brief, find the actual ask, and not panic when the data is wrong?",
    signals: [
      "cites the data card / brief before touching code",
      "distinguishes 'what the brief asks' from 'what i'd do unprompted'",
      "names the wrong assumption out loud before correcting it",
    ],
    exampleReject: "T1: 'drift is in the vocab' — didn't read the data card, missed the pseudo-label smoking gun.",
  },
  {
    n: "02", name: "shipped and measured",
    weight: 30, color: "amber",
    blurb: "did the work land? does the artefact show real numbers, not vibes?",
    signals: [
      "produces a runnable artefact, not just a description of one",
      "includes measured numbers (F1, p95, accuracy) with the test setup",
      "artifacts are reproducible: a teammate could re-run and get the same result",
    ],
    exampleReject: "T3: 'p95 looks fine' with no load test file in the submission.",
  },
  {
    n: "03", name: "defensive thinking",
    weight: 25, color: "amber",
    blurb: "did you check the second-order failure modes, or only the happy path?",
    signals: [
      "explicitly tests the failure case (bad input, missing file, cold start)",
      "mentions what you'd do if the data was bigger / noisier / adversarial",
      "writes the assumption that, if wrong, breaks the result",
    ],
    exampleReject: "T2: F1 = 0.91 average, but class 'other' at 0.62 — guessing on the rare class.",
  },
  {
    n: "04", name: "trade-off articulation",
    weight: 15, color: "red",
    blurb: "can you name what you gave up to win, and why that was the right call?",
    signals: [
      "writes the trade-off out loud (e.g. 'i chose X over Y because Z')",
      "names the cost of the simpler path you didn't take",
      "writes the next experiment you'd run with 1 more day",
    ],
    exampleReject: "T4: 'i fixed the leakage' with no F1 before/after, no story for why the fix changed the number.",
  },
];

const OUTCOMES = [
  { tag: "approved", who: "engine + founder", what: "shipped. move to next task.", color: "active" },
  { tag: "rejected", who: "engine", what: "1-2 specific signals failed. re-submit with the note addressed.", color: "warning" },
  { tag: "flagged", who: "founder", what: "engine says approved but founder (Arjun) overrides — borderline case, off-rubric concern, or a great answer that deserves a note.", color: "error" },
];

export default function HowBetaPage() {
  useSEO({
    ...SEO.landing,
    title: "how the beta review engine works · dreamclerk",
    description: "the rubric, the signals, the honest limits. read this before you start the 5-day sprint.",
    noindex: true,
  });

  return (
    <main className="hb-shell">
      <SectionLabel status="active">$ man dreamclerk --review</SectionLabel>
      <h1 className="hb-h1">how the review engine works</h1>
      <p className="hb-lede">
        your sprint is reviewed by a deterministic engine. that word — deterministic — is
        the whole pitch. every submission hits the same 4-axis rubric, the same signals,
        the same pass/reject logic. there is no LLM deciding your verdict in a black box.
        the founder (Arjun) reviews the borderline cases personally, but the engine does
        the bulk of the work and it does it the same way for every applicant.
      </p>
      <p className="hb-p">
        this page is the manual. read it before you start, keep it open while you work,
        and you'll know exactly what "pass" means on day 5. <em>why this matters</em>:
        the cert is the artefact recruiters read. we can't write a cert that says "the
        reviewer felt good about it" — it has to be defensible.
      </p>

      {/* ─── 1. THE 4 AXES ─────────────────────────────────────────────── */}
      <SectionLabel status="active">/ 1. the 4 axes (100 points total)</SectionLabel>
      <p className="hb-p">
        the engine scores you on 4 axes. the weights are not equal. comprehension and
        shipping are worth twice as much as articulation. this is a deliberate choice:
        we can teach trade-off writing. we can't teach someone to read the data card
        before they touch the data.
      </p>
      <ul className="hb-axes">
        {AXES.map((a) => (
          <li key={a.n} className={`hb-axis hb-axis--${a.color}`}>
            <div className="hb-axis-head">
              <span className="hb-axis-n mono">[{a.n}]</span>
              <span className="hb-axis-name">{a.name}</span>
              <span className="hb-axis-weight mono">{a.weight} pts</span>
            </div>
            <p className="hb-axis-blurb">{a.blurb}</p>
            <div className="hb-axis-cols">
              <div className="hb-axis-col">
                <h4 className="hb-h4">signals the engine looks for</h4>
                <ul className="hb-ul">
                  {a.signals.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
              <div className="hb-axis-col">
                <h4 className="hb-h4">an example reject</h4>
                <p className="hb-reject">{a.exampleReject}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* ─── 2. THE 4 TASK BRIEFS + ACCEPTANCE SIGNALS ─────────────────── */}
      <SectionLabel status="active">/ 2. the 4 task briefs + acceptance signals</SectionLabel>
      <p className="hb-p">
        each task has a brief, a set of attached files, and an acceptance signal — the
        specific thing the engine checks before it will pass you. the briefs below are
        the actual briefs you'll see. the acceptance list is what the engine applies.
      </p>
      <ol className="hb-tasks">
        {BETA.tasks.map((t) => (
          <li key={t.id} className="hb-task">
            <div className="hb-task-head">
              <span className="hb-task-n mono">[{t.n}]</span>
              <span className="hb-task-title">{t.title}</span>
              <span className="hb-task-xp mono">+{t.xp} xp</span>
              <span className="hb-task-type mono">{t.type}</span>
            </div>
            <p className="hb-task-brief">{t.brief}</p>
            <div className="hb-task-cols">
              <div className="hb-task-col">
                <h4 className="hb-h4">attached</h4>
                <ul className="hb-ul hb-ul--mono">
                  {t.attached.map((a, i) => <li key={i}>{a}</li>)}
                </ul>
              </div>
              <div className="hb-task-col">
                <h4 className="hb-h4">acceptance signal</h4>
                <ul className="hb-ul">
                  {t.acceptance.map((a, i) => <li key={i}>{a}</li>)}
                </ul>
              </div>
            </div>
            <details className="hb-task-hints">
              <summary>hints (read if stuck)</summary>
              <ul className="hb-ul">
                {t.hints.map((h, i) => <li key={i}>{h}</li>)}
              </ul>
            </details>
          </li>
        ))}
      </ol>

      {/* ─── 3. WHAT THE ENGINE IS ─────────────────────────────────────── */}
      <SectionLabel status="active">/ 3. what the engine is</SectionLabel>
      <ul className="hb-is">
        <li><strong>deterministic.</strong> same input → same score. the engine does not have a "mood" on a tuesday afternoon.</li>
        <li><strong>signal-based.</strong> it reads your submission and looks for specific phrases, files, numbers, or structure. if the signal is there, the rubric fires.</li>
        <li><strong>explicit.</strong> every signal is named on this page. nothing hidden. if you read the rubric you know how to pass.</li>
        <li><strong>fast.</strong> the engine returns in seconds. no waiting on a human review queue.</li>
        <li><strong>overridable.</strong> the founder can mark a pass as <em>flagged</em> if the engine says yes but the answer is off-rubric. this is rare, and the reason is in your record.</li>
        <li><strong>defensible.</strong> when a recruiter asks "why did this person pass?", we can answer in 1 sentence per axis.</li>
      </ul>

      {/* ─── 4. WHAT THE ENGINE ISN'T ─────────────────────────────────── */}
      <SectionLabel status="warning">/ 4. what the engine is not (honest limits)</SectionLabel>
      <p className="hb-p">
        we will not oversell the engine. v0.1 is intentionally narrow. if you finish the
        sprint and the cert says "pass", here is what the cert is and is not claiming.
      </p>
      <ul className="hb-isnt">
        <li><strong>not an LLM judge.</strong> there is no GPT reading your code and "feeling" it. the engine is a fixed rubric. a sophisticated regex on a good day.</li>
        <li><strong>not a real code review.</strong> the engine does not run your code, does not check for runtime bugs, does not read test coverage. it reads the artefacts you submit.</li>
        <li><strong>not a hire/fire signal.</strong> passing the beta cert does not mean you'll be hired at a partner company. it means you cleared a 4-task simulated sprint and wrote a defensible postmortem.</li>
        <li><strong>not cheating-proof.</strong> v0.1 trusts you to do the work. we will not implement plagiarism detection in the open beta — the cohort is 50 people and we are reviewing borderline cases personally.</li>
        <li><strong>not a substitute for a portfolio.</strong> if you have a github with real PRs, link that. the cert is one signal among many. it is the <em>first</em> signal because it is fast, public, and defensible.</li>
        <li><strong>not finished.</strong> v0.1 is a 5-day sprint with 4 tasks. v0.2 adds a capstone, a review-of-peers round, and a real interview round. the engine will get smarter. the rubric above will not get harder.</li>
      </ul>

      {/* ─── 5. THE 3 OUTCOMES ────────────────────────────────────────── */}
      <SectionLabel status="active">/ 5. the 3 review outcomes</SectionLabel>
      <p className="hb-p">
        every submission lands in one of three buckets. the engine is not opaque. you
        will see which bucket you're in, and (if rejected) the specific signal that
        failed. you can re-submit until you pass — there is no penalty.
      </p>
      <table className="hb-table">
        <thead>
          <tr><th>outcome</th><th>decider</th><th>what happens</th></tr>
        </thead>
        <tbody>
          {OUTCOMES.map((o) => (
            <tr key={o.tag}>
              <td><span className={`hb-tag hb-tag--${o.color}`}>{o.tag}</span></td>
              <td>{o.who}</td>
              <td>{o.what}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ─── FOOTER CTA ───────────────────────────────────────────────── */}
      <SectionLabel status="active">/ ready?</SectionLabel>
      <div className="hb-cta">
        <p className="hb-p">
          read the manual, take the sprint, earn the cert. the cert URL is shareable
          from day 1 — your record updates in place as you progress.
        </p>
        <div className="hb-cta-row">
          <RouterLink to="/beta" className="hb-btn">start the 5-day sprint</RouterLink>
          <RouterLink to="/" className="hb-btn hb-btn--ghost">back to home</RouterLink>
        </div>
      </div>
    </main>
  );
}
