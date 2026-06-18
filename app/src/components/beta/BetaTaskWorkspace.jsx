// ─── BetaTaskWorkspace — task detail + IDE-style code editor + review ───────
//
// Per BETA.md §3 Day 1-5: user opens a task, reads the brief, sees the
// attached files, writes code or paste in a submission, submits it, and
// either gets approved (advance) or rejected (revise + resubmit).
//
// Editor choice: Monaco is too heavy for a beta simulation. We render a
// plain <textarea> with a parallel gutter for line numbers — the same
// look VS Code has, minus the syntax highlighting (v0.2 = Monaco swap).
//
// Submission flow:
//   1. user clicks "submit"
//   2. submitTask() runs scriptedReview() which calls the real evaluator
//      in lib/evaluator.js (lex/structure-check, 4 axes)
//   3. evaluator returns APPROVE / REVISE / REJECT + 4-axis breakdown
//   4. APPROVE advances; REVISE/REJECT shows the breakdown inline so the
//      user knows which axis failed and what to fix
//
// The reviewer breakdown is the educational content. Each rejection teaches.

import { useState, useRef, useMemo } from "react";
import SectionLabel from "../SectionLabel.jsx";
import { BETA } from "../../lib/betaData.js";
import { useReveal } from "../useReveal.js";

const STATUS_LABEL = {
  todo: "○ todo",
  in_progress: "◐ in progress",
  submitted: "◐ submitted",
  approved: "● approved",
  rejected: "● rejected",
};

const VERDICT_LABEL = {
  APPROVE: "approved",
  REVISE: "needs revision",
  REJECT: "rejected",
};

const VERDICT_ICON = {
  APPROVE: "●",
  REVISE: "◐",
  REJECT: "○",
};

function statusToLabel(s) {
  return STATUS_LABEL[s] || s;
}

// Editor gutter: render line numbers for lines 1..n. n = max(1, lines in
// submission OR a minimum of 12 so the editor looks full at rest).
function buildGutterLines(text) {
  const n = Math.max(12, (text || "").split("\n").length);
  let out = "";
  for (let i = 1; i <= n; i++) out += (i === n ? `${i}` : `${i}\n`);
  return out;
}

// Parse out a rough Ln/Col from a textarea's selectionStart so the status
// bar can show it. This is a "looks like VS Code" approximation, not exact.
function selectionToLnCol(text, sel) {
  const upTo = (text || "").slice(0, sel ?? 0);
  const lines = upTo.split("\n");
  return { ln: lines.length, col: lines[lines.length - 1].length + 1 };
}

export default function BetaTaskWorkspace({ sessionState, taskId, onClose }) {
  const { session, submitTask } = sessionState;
  const task = BETA.tasks.find((t) => t.id === taskId);
  const state = session.taskStates[taskId];
  const [submission, setSubmission] = useState(state.submission || "");
  const [activeFile, setActiveFile] = useState(task?.attached?.[0] || "main.py");
  const [showCelebrate, setShowCelebrate] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const editorRef = useRef(null);
  const [sel, setSel] = useState({ ln: 1, col: 1 });

  useReveal("/beta-workspace");

  const gutter = useMemo(() => buildGutterLines(submission), [submission]);
  const wordCount = (submission.match(/\b\w+\b/g) || []).length;

  if (!task) {
    return (
      <main className="beta-shell">
        <SectionLabel status="error">task not found</SectionLabel>
        <div className="beta-card">
          <button className="beta-btn" onClick={onClose}>← back to board</button>
        </div>
      </main>
    );
  }

  const onSubmit = async () => {
    if (submitting) return; // guard against double-click during the LLM call
    setSubmitting(true);
    setSubmitError("");
    try {
      // submitTask is async (LLM path can take up to 5s on cold cache). We
      // must await it so the loading state actually reflects the work, and
      // so an error doesn't get swallowed.
      const wasFirstTry = (state.rejectionCount || 0) === 0;
      const firstTryLength = wasFirstTry ? submission.length : 0;
      await submitTask(taskId, submission);
      // Celebration on a fresh first-try approve. After await, the latest
      // session is in the hook; read it from the next render via state ref
      // pattern. Simpler: just compare lengths — first-try approvals on a
      // >50-char submission get the small "shipped" toast.
      if (wasFirstTry && firstTryLength > 50) {
        setTimeout(() => {
          const fresh = session.taskStates[taskId]?.rejectionCount ?? 0;
          if (fresh === 0) setShowCelebrate(true);
        }, 80);
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("[beta] submitTask failed", err);
      setSubmitError(
        err?.message ||
          "review failed to run. try again in a moment — your work is still in the editor.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const onSelect = (e) => {
    setSel(selectionToLnCol(submission, e.target.selectionStart));
  };

  const onKey = (e) => {
    // Tab inserts 4 spaces, doesn't move focus.
    if (e.key === "Tab") {
      e.preventDefault();
      const t = e.target;
      const start = t.selectionStart;
      const end = t.selectionEnd;
      const next = submission.slice(0, start) + "    " + submission.slice(end);
      setSubmission(next);
      requestAnimationFrame(() => {
        t.selectionStart = t.selectionEnd = start + 4;
      });
    }
  };

  const lastReview = state.lastReview;
  const reviewClass =
    !lastReview
      ? ""
      : lastReview.verdict === "APPROVE"
      ? ""
      : lastReview.verdict === "REVISE"
      ? "is-revise"
      : "is-reject";

  return (
    <main className="beta-shell beta-workspace">
      <SectionLabel status={state.status === "approved" ? "active" : state.status === "rejected" ? "error" : "active"}>
        $ cat tasks/{task.id}/brief.md
      </SectionLabel>

      <div className="beta-ws-task">
        <div className="beta-ws-task-head">
          <button className="beta-btn beta-btn--ghost" onClick={onClose}>← board</button>
          <div className="beta-ws-task-meta">
            <span className="beta-mono beta-ws-task-n">[{task.n}]</span>
            <span className="beta-mono beta-ws-task-xp">+{task.xp} XP</span>
            <span className={`beta-task-status beta-task-status--${state.status}`}>
              {statusToLabel(state.status)}
            </span>
          </div>
        </div>

        <h1 className="beta-h1">{task.title}</h1>

        <div className="beta-ws-section">
          <h3 className="beta-h3">brief</h3>
          <p className="beta-p">{task.brief}</p>
        </div>

        <div className="beta-ws-section">
          <h3 className="beta-h3">acceptance criteria</h3>
          <ol className="beta-betalist">
            {task.acceptance.map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ol>
        </div>

        <details className="beta-ws-hints">
          <summary>stuck? show hints ({task.hints.length})</summary>
          <ol className="beta-betalist">
            {task.hints.map((h, i) => (
              <li key={i}>{h}</li>
            ))}
          </ol>
        </details>

        {/* Reviewer feedback (if reviewed) */}
        {state.reviewerNote && (state.status === "rejected" || state.status === "approved") && (
          <div className={`beta-ws-review ${reviewClass}`}>
            <div className="beta-ws-review-head">
              <span className="beta-ws-review-author">
                deterministic review engine
                <span className="beta-ws-review-sub">
                  delivered by {BETA.personas.techLead.name} · {BETA.personas.techLead.role}
                </span>
              </span>
              <span className="beta-ws-review-verdict">
                {VERDICT_ICON[lastReview?.verdict] || (state.status === "approved" ? "●" : "○")}{" "}
                {VERDICT_LABEL[lastReview?.verdict] || state.status}
              </span>
            </div>
            <p className="beta-ws-review-line">{state.reviewerNote}</p>

            {lastReview?.checklist?.length > 0 && (
              <div className="beta-ws-review-checklist" role="list" aria-label="reviewer checklist">
                <div className="beta-ws-review-checklist-head">what the reviewer ran</div>
                <ul>
                  {lastReview.checklist.map((c, i) => (
                    <li
                      key={i}
                      className={`beta-ws-review-check ${c.passed ? "is-pass" : "is-fail"}`}
                      role="listitem"
                    >
                      <span className="beta-ws-review-check-glyph" aria-hidden="true">
                        {c.passed ? "✓" : "✗"}
                      </span>
                      <span className="beta-ws-review-check-label">{c.label}</span>
                      {c.evidence ? (
                        <code className="beta-ws-review-check-evidence">{c.evidence}</code>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {lastReview?.axes && (
              <div className="beta-ws-review-axes">
                {Object.entries(lastReview.axes).map(([k, v]) => (
                  <div key={k}>
                    <b>{k}</b>: {v.score}/{v.max} <span style={{ opacity: 0.6 }}>— {v.label}</span>
                  </div>
                ))}
              </div>
            )}
            {lastReview?.signals && Object.keys(lastReview.signals).length > 0 && (
              <details>
                <summary className="beta-ws-review-signals-h">
                  raw signals ({Object.keys(lastReview.signals).length})
                </summary>
                <pre>{Object.entries(lastReview.signals).map(([k, v]) => `${k}: ${v}`).join("\n")}</pre>
              </details>
            )}
          </div>
        )}

        {/* Submission form: file tabs + line-numbered editor + status bar */}
        {state.status !== "approved" && (
          <>
            <h3 className="beta-h3" style={{ marginTop: 28 }}>your submission</h3>
            <p className="beta-p beta-p--small">
              paste your code, your diagnosis, your report — whatever the task asks for. vikram reviews in &lt;5 min during work hours.
            </p>

            <div className="beta-ws-tabs" role="tablist" aria-label="files in this task">
              {task.attached.map((f) => (
                <button
                  key={f}
                  className={`beta-ws-tab ${activeFile === f ? "is-on" : ""}`}
                  onClick={() => setActiveFile(f)}
                  type="button"
                  role="tab"
                  aria-selected={activeFile === f}
                >
                  {f}
                </button>
              ))}
              <button
                className={`beta-ws-tab ${activeFile === "submission.md" ? "is-on" : ""}`}
                onClick={() => setActiveFile("submission.md")}
                type="button"
                role="tab"
                aria-selected={activeFile === "submission.md"}
              >
                submission.md
              </button>
            </div>

            <div className="beta-ws-editor-wrap">
              <div className="beta-ws-gutter" aria-hidden="true">{gutter}</div>
              <textarea
                ref={editorRef}
                className="beta-ws-editor"
                value={submission}
                onChange={(e) => setSubmission(e.target.value)}
                onKeyDown={onKey}
                onSelect={onSelect}
                onClick={onSelect}
                spellCheck={false}
                aria-label={`code editor for ${activeFile}`}
                placeholder={task.type === "ml-debugging" ? "# paste your diagnose.py or your diagnosis here\n\nroot cause: " : task.type === "model-training" ? "# paste your training script + writeup here\n\nwhat worked: " : task.type === "productionisation" ? "# paste your API code + locustfile + latency results here\n\np95 latency: " : "# paste your audit report here\n\nleakage found: "}
              />
            </div>

            <div className="beta-ws-statusbar">
              <div className="beta-ws-statusbar-left">
                <span><span className="beta-dot"></span>evaluator ready</span>
                <span>● {task.type}</span>
                <span>Ln {sel.ln}, Col {sel.col}</span>
              </div>
              <div className="beta-ws-statusbar-right">
                <span>{wordCount} words · {submission.length} chars</span>
                <span>UTF-8 · LF</span>
              </div>
            </div>

            <div className="beta-ws-actions">
              <span className="beta-p beta-p--small" style={{ alignSelf: "center", flex: 1 }}>
                review #{(state.rejectionCount || 0) + 1} — pressing {(state.rejectionCount || 0) > 0 ? "resubmit" : "submit"} sends this to {BETA.personas.techLead.name.split(" ")[0]}.
              </span>
              <button
                className="beta-btn"
                onClick={onSubmit}
                disabled={submission.trim().length < 30 || submitting}
                type="button"
                aria-busy={submitting}
              >
                {submitting
                  ? "reviewing…"
                  : (state.rejectionCount || 0) > 0
                    ? `resubmit → ${BETA.personas.techLead.name.split(" ")[0].toLowerCase()}`
                    : `submit → ${BETA.personas.techLead.name.split(" ")[0].toLowerCase()}`}
              </button>
            </div>

            {submitError && (
              <div className="beta-ws-submit-error" role="alert" style={{ marginTop: 12 }}>
                {submitError}
              </div>
            )}
          </>
        )}

        {state.status === "approved" && (
          <div className="beta-ws-section beta-ws-section--done">
            <p className="beta-p">
              approved. head back to the board for the next task.
            </p>
            <button className="beta-btn" onClick={onClose}>← board</button>
          </div>
        )}

        {/* Review history: every submission's full review object */}
        {Array.isArray(state.reviews) && state.reviews.length > 0 && (
          <details className="beta-ws-history-wrap" style={{ marginTop: 28 }}>
            <summary className="beta-ws-history-h">
              review history ({state.reviews.length})
            </summary>
            <ul className="beta-ws-history">
              {state.reviews.map((r, i) => (
                <li
                  key={i}
                  className={`beta-ws-history--${r.review?.verdict === "APPROVE" ? "approve" : r.review?.verdict === "REVISE" ? "reviewer" : "reject"}`}
                >
                  <div><b>#{i + 1}</b> · {r.review?.verdict || r.verdict} · {new Date(r.at).toLocaleString()}</div>
                  {r.note && <div style={{ marginTop: 4 }}>{r.note}</div>}
                  {r.review?.signals && Object.keys(r.review.signals).length > 0 && (
                    <pre>{Object.entries(r.review.signals).map(([k, v]) => `${k}: ${v}`).join("\n")}</pre>
                  )}
                </li>
              ))}
            </ul>
          </details>
        )}

        {showCelebrate && state.status === "approved" && (
          <div className="beta-ws-celebrate" aria-live="polite">
            <pre className="beta-terminal">{`✓ shipped. moving you on.`}</pre>
          </div>
        )}
      </div>
    </main>
  );
}
