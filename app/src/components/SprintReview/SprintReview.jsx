// ─── SprintReview — the AI tech lead's PR review result ─────────────────
//
// Shows the 4-axis review (correctness / security / performance / style)
// as 4 horizontal bars plus a final verdict. The "reviewer note" is shown
// at the bottom — it's the in-character tech lead's prose feedback.
//
// The verdict drives advancement:
//   - APPROVE  → next sprint
//   - REVISE   → revise + resubmit, same sprint
//   - REJECT   → restart the sprint, with new AI feedback
//
// The 4-axis structure is taken directly from the actual reviewer in the
// data; this component is the visual.

import { useEffect } from "react";

const VERDICT_META = {
  APPROVE: { label: "approved", color: "var(--ok-fill)", desc: "ship it. next sprint unlocked." },
  REVISE:  { label: "needs revision", color: "#f0b94c", desc: "fix the failed axis, push the diff again." },
  REJECT:  { label: "rejected",       color: "#ff5c5c", desc: "re-read the brief. restart the sprint." },
};

const AXES = [
  { key: "correctness",  label: "correctness",  desc: "logic, edge cases, contract" },
  { key: "security",     label: "security",     desc: "auth, injection, sensitive data" },
  { key: "performance",  label: "performance",  desc: "queries, N+1, hot path" },
  { key: "style",        label: "style",        desc: "API style guide, naming, comments" },
];

export default function SprintReview({ review, onClose, onAction }) {
  const verdict = VERDICT_META[review.verdict] || VERDICT_META.REVISE;

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose?.(); };
    window.addEventListener("keydown", onKey);
    document.body.classList.add("dc-modal-open");
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.classList.remove("dc-modal-open");
    };
  }, [onClose]);

  return (
    <div className="dc-modal" role="dialog" aria-modal="true">
      <div className="dc-modal__scrim" onClick={onClose} />
      <div className="dc-modal__panel dc-modal__panel--narrow">
        <header className="dc-modal__head">
          <div className="dc-modal__id">
            <div className="dc-modal__name">PR review · {review.prId || "untitled"}</div>
            <div className="dc-modal__company">reviewed by {review.reviewer || "Marcus Lee"} · tech lead</div>
          </div>
          <div className="dc-modal__verdict" style={{ color: verdict.color }}>{verdict.label}</div>
          <button className="dc-modal__close" onClick={onClose} aria-label="close">×</button>
        </header>

        <section className="dc-review__axes">
          {AXES.map((a) => {
            const axis = review.axes?.[a.key] || { score: 0, note: "—" };
            const passed = axis.score >= 70;
            return (
              <div key={a.key} className="dc-review__axis">
                <div className="dc-review__axis-head">
                  <span className="dc-review__axis-label">{a.label}</span>
                  <span className="dc-review__axis-score" style={{ color: passed ? "var(--ok-fill)" : "#ff5c5c" }}>
                    {axis.score}
                  </span>
                </div>
                <div className="dc-review__axis-bar">
                  <div
                    className="dc-review__axis-fill"
                    style={{
                      width: `${axis.score}%`,
                      background: passed ? "var(--ok-fill)" : "#ff5c5c",
                    }}
                  />
                </div>
                <div className="dc-review__axis-desc">{a.desc}</div>
                <div className="dc-review__axis-note">{axis.note}</div>
              </div>
            );
          })}
        </section>

        {review.reviewerNote && (
          <section className="dc-review__note">
            <div className="dc-review__note-head">reviewer note</div>
            <p>{review.reviewerNote}</p>
          </section>
        )}

        <footer className="dc-review__foot">
          <p style={{ color: verdict.color }}><b>{verdict.desc}</b></p>
          <div className="dc-review__actions">
            {review.verdict !== "APPROVE" && (
              <button className="btn btn--ghost" onClick={() => onAction?.("revise")}>
                revise & resubmit
              </button>
            )}
            <button className="btn btn--solid" onClick={() => onAction?.("advance")}>
              {review.verdict === "APPROVE" ? "next sprint →" : "save & exit"}
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}