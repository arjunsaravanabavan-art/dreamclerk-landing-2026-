// ─── BetaVerifyPage — public, unauthenticated record verification ─────────
//
// Per D7 (share-before-issuance allowed) + D8 (cohort is public on LinkedIn).
// Anyone with the URL can see the record. There is no auth gate. The
// "verdict pending" tag is honest about what the founder (Arjun) is doing.
//
// URL: /verify/:recordId  where recordId = `${token}-${run}`
//
// What we render:
//   1. The company + role + cohort slug
//   2. The user info they entered (their choice to share)
//   3. The task-by-task verdict (scripted for now, founder override coming)
//   4. The overall verdict (Pass / Pending / Fail)
//   5. The reviewer note from Arjun
//
// What we DON'T render:
//   - Internal review history
//   - Chat transcripts
//   - Submission content (private)
//   - Skill self-assessment

import { useEffect, useState } from "react";
import SectionLabel from "../SectionLabel.jsx";
import { BETA } from "../../lib/betaData.js";
import { useSEO, SEO } from "../../lib/seo.js";
import { RouterLink } from "../../lib/router.jsx";
import { fetchVerifyRecordByCertId } from "../../lib/supabase.js";

export default function BetaVerifyPage({ recordId }) {
  const [state, setState] = useState({ loading: true, record: null, notFound: false });

  useSEO({
    ...SEO.landing,
    title: "verify · dreamclerk beta",
    description: "verify a dreamclerk beta work record.",
    noindex: true,
  });

  useEffect(() => {
    // Lookup order:
    //   1. Supabase public view by cert id (cross-device)
    //   2. Viewer's own localStorage (works for the original device even
    //      if supabase is unconfigured or the upsert hasn't completed)
    // Any error path defaults to notFound=true — we never leave the user
    // stuck on "looking up…".
    if (typeof window === "undefined") return;
    let cancelled = false;
    const NS = "dc-beta-v1::session::";
    const tryLocal = () => {
      try {
        for (let i = 0; i < window.localStorage.length; i++) {
          const key = window.localStorage.key(i);
          if (!key || !key.startsWith(NS)) continue;
          let session = null;
          try {
            session = JSON.parse(window.localStorage.getItem(key));
          } catch {
            continue;
          }
          if (!session) continue;
          const certMatch = session.record?.id === recordId;
          // Back-compat: pre-cert sessions used `${token}-${run}`.
          const backcompat = recordId === `${session.token}-${session.run}`;
          if (certMatch || backcompat) return session;
        }
      } catch {}
      return null;
    };
    (async () => {
      const remote = await fetchVerifyRecordByCertId(recordId);
      if (cancelled) return;
      if (remote) {
        setState({ loading: false, record: { ...remote, source: "remote" }, notFound: false });
        return;
      }
      const local = tryLocal();
      if (cancelled) return;
      if (local) {
        setState({ loading: false, record: local, notFound: false });
        return;
      }
      setState({ loading: false, record: null, notFound: true });
    })();
    return () => { cancelled = true; };
  }, [recordId]);

  if (state.loading) {
    return (
      <main className="beta-shell">
        <SectionLabel status="active">$ verify --record {recordId}</SectionLabel>
        <div className="beta-card">
          <p className="beta-p mono">looking up…</p>
        </div>
      </main>
    );
  }

  if (state.notFound || !state.record) {
    return (
      <main className="beta-shell">
        <SectionLabel status="error">404 · record not found</SectionLabel>
        <div className="beta-card">
          <h1 className="beta-h1">we can't find that record.</h1>
          <p className="beta-p">
            this could mean: (1) the URL is wrong, (2) the record was issued
            on a different device, or (3) the cohort is closed and the record
            has been archived.
          </p>
          <p className="beta-p beta-p--small">
            if you got this URL from a friend, ask them to re-share it from
            their own dashboard.
          </p>
          <RouterLink to="/" className="beta-btn">back to home</RouterLink>
        </div>
      </main>
    );
  }

  const r = state.record;
  // The remote row from supabase's `beta_verify` VIEW is a different
  // shape than a local session — display_name, user_college, verdict at
  // the top, no taskStates. Normalize so the JSX below doesn't have to
  // care where the record came from.
  const isRemote = r.source === "remote";
  const user = isRemote
    ? {
        name: r.display_name,
        college: r.user_college,
        branch: r.user_branch,
        year: r.user_year,
      }
    : (r.user || {});
  const states = r.taskStates || {};
  const taskRows = BETA.tasks.map((t) => ({ task: t, state: states[t.id] || { status: "todo" } }));
  // For remote rows we have a server-stamped verdict; for local we derive
  // it from approvedCount. The remote verdict is the source of truth.
  const approvedCount = Object.values(states).filter((s) => s.status === "approved").length;
  let overall;
  if (isRemote) {
    overall = r.verdict || "pending";
  } else {
    overall = approvedCount === BETA.tasks.length ? "pass" : approvedCount === 0 ? "pending" : "in progress";
  }

  return (
    <main className="beta-shell">
      <SectionLabel status={overall === "pass" ? "active" : "active"}>$ verify --record {recordId}</SectionLabel>
      <div className="beta-card">
        <h1 className="beta-h1">verified work record</h1>
        <p className="beta-p beta-p--small">
          {overall === "pass" ? "verdict issued." : "verdict pending — founder review in progress."}
        </p>

        <pre className="beta-terminal">{`
  ┌──────────────────────────────────────────────────────────┐
  │  DREAMCLERK · WORK RECORD                                │
  │                                                          │
  │  applicant   ${user.name.padEnd(46)}│
  │  college     ${(user.college + ", " + user.branch + ", " + user.year).slice(0, 46).padEnd(46)}│
  │  cohort      ${BETA.cohort.padEnd(46)}│
  │  company     ${BETA.company.name.padEnd(46)}│
  │  role        ${BETA.role.title.padEnd(46)}│
  │  duration    ${BETA.role.durationDays + " days".padEnd(46)}│
  │  xp earned   ${(approvedCount * 75).toString().padEnd(46)}│
  │  tasks       ${(approvedCount + "/" + BETA.tasks.length).padEnd(46)}│
  │  verdict     ${overall.padEnd(46)}│
  └──────────────────────────────────────────────────────────┘
        `.trim()}</pre>

        <h3 className="beta-h3">task-by-task</h3>
        <ul className="beta-verify-tasks">
          {taskRows.map(({ task, state }) => (
            <li key={task.id} className={`beta-verify-task beta-verify-task--${state.status}`}>
              <span className="beta-verify-task-n mono">[{task.n}]</span>
              <span className="beta-verify-task-t">{task.title}</span>
              <span className={`beta-task-status beta-task-status--${state.status}`}>
                {state.status === "approved" && "● approved"}
                {state.status === "rejected" && "● rejected"}
                {state.status === "submitted" && "◐ submitted"}
                {state.status === "in_progress" && "◐ in progress"}
                {state.status === "todo" && "○ not started"}
              </span>
            </li>
          ))}
        </ul>

        <h3 className="beta-h3">reviewer</h3>
        <p className="beta-p">
          tech lead review (scripted, AI-assisted): <strong>{BETA.personas.techLead.name}</strong>, {BETA.personas.techLead.title}
        </p>
        <p className="beta-p">
          founder review (personal, all 50): <strong>{BETA.reviewer.name}</strong>, {BETA.reviewer.title}{" "}
          <a className="beta-link" href={BETA.reviewer.linkedin} target="_blank" rel="noreferrer">↗ linkedin</a>
        </p>

        <h3 className="beta-h3">what this record is</h3>
        <p className="beta-p beta-p--small">
          this is a record of a 5-day simulated sprint at orbit labs (a
          14-person AI/ML research lab), with 4 tasks reviewed by vikram
          iyer (simulated tech lead) and a final review by {BETA.reviewer.name}.
          the tasks tested the applicant's ability to: diagnose a model drift
          (root-cause analysis, not just symptom-spotting), fine-tune a
          distilbert model on a small imbalanced dataset, ship a low-latency
          inference API, and audit a training data pipeline for label
          leakage.
        </p>
        <p className="beta-p beta-p--small">
          this is not a certificate of completion. it is a record of
          performance. it does not confer employment, course credit, or any
          other credential. the work record is permanent and public.
        </p>

        <p className="beta-p beta-p--small">
          recruiter? this record is generated by a 4-axis deterministic rubric.{" "}
          <RouterLink to="/how-beta" className="beta-link">read the manual →</RouterLink>
        </p>

        <div className="beta-row">
          <RouterLink to="/" className="beta-btn">back to home</RouterLink>
          <a className="beta-btn beta-btn--ghost" href="/" data-open-modal>join the waitlist</a>
        </div>
      </div>
    </main>
  );
}