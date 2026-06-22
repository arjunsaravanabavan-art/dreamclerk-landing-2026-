// ─── ResignationFlow — the "wrong company" exit ──────────────────────────
//
// Per the Work Culture .md: not every fit is right. If the user realizes
// during Day 1 onboarding that this company/role isn't theirs, they should
// be able to leave cleanly — without shame, without a survey, without
// a "but are you sure?" loop.
//
// The flow:
//   1. User clicks "this isn't the right fit" on Day 1
//   2. They see a 1-line reason picker (4 options + free text)
//   3. The system offers to redirect them to a different company in the
//      same 8-company pool, with the Day 1 pack preserved
//   4. Confirm → "you've switched to [new company]. day 1 resets."
//
// This is a real-work-pattern feature. A good employee knows when to leave.

import { useState, useEffect } from "react";
import { COMPANIES, TRACKS } from "../../data/nexaraOnboarding.js";

const REASONS = [
  { id: "stack",    label: "the stack isn't for me" },
  { id: "culture",  label: "the culture isn't a fit" },
  { id: "role",     label: "i want a different role" },
  { id: "level",    label: "the seniority is wrong" },
  { id: "other",    label: "other (free text)" },
];

export default function ResignationFlow({ currentCompany, currentTrack, onClose, onSwitch, onExit }) {
  const [step, setStep] = useState(1);
  const [reason, setReason] = useState(null);
  const [free, setFree] = useState("");
  const [picked, setPicked] = useState(null);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose?.(); };
    window.addEventListener("keydown", onKey);
    document.body.classList.add("dc-modal-open");
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.classList.remove("dc-modal-open");
    };
  }, [onClose]);

  // Step 2: suggest an alternative based on the reason. Stack-mismatch
  // routes to orbit-labs; role-mismatch shows a different track; etc.
  const suggestAlt = () => {
    if (reason === "stack") return { company: "Orbit Labs",  reason: "rust + python + cuda, ML research vibe" };
    if (reason === "culture") return { company: "GreenStack", reason: "mission-driven, open culture, climate work" };
    if (reason === "role") {
      // Same company, different role.
      const alt = TRACKS.find((t) => t.company === currentCompany && t.id !== currentTrack) || TRACKS[0];
      return { company: alt.company, track: alt, reason: `same company, but as a ${alt.label}` };
    }
    if (reason === "level") return { company: "Pulse Media", reason: "design-led, frontend-heavy, smaller commits" };
    return { company: "BridgeHR", reason: "people-first, smaller scope, gentler on-ramp" };
  };

  const alt = reason && reason !== "other" ? suggestAlt() : null;
  const finalAlt = picked || alt;

  return (
    <div className="dc-modal" role="dialog" aria-modal="true">
      <div className="dc-modal__scrim" onClick={onClose} />
      <div className="dc-modal__panel dc-modal__panel--narrow">
        <header className="dc-modal__head">
          <div className="dc-modal__id">
            <div className="dc-modal__name">if this isn't the right fit</div>
            <div className="dc-modal__company">no shame. day 1 is the day to find out.</div>
          </div>
          <button className="dc-modal__close" onClick={onClose} aria-label="close">×</button>
        </header>

        {step === 1 && (
          <div className="dc-resign__step">
            <p className="dc-resign__lede">
              you're not locked in. what's the main reason this doesn't feel like your fit?
            </p>
            <div className="dc-resign__reasons">
              {REASONS.map((r) => (
                <button
                  key={r.id}
                  className={`dc-resign__reason ${reason === r.id ? "is-picked" : ""}`}
                  onClick={() => setReason(r.id)}
                >
                  {r.label}
                </button>
              ))}
            </div>
            {reason === "other" && (
              <textarea
                className="dc-resign__free"
                rows={3}
                value={free}
                onChange={(e) => setFree(e.target.value)}
                placeholder="what's not right?"
              />
            )}
            <div className="dc-resign__actions">
              <button className="btn btn--ghost" onClick={onExit}>
                leave dreamclerk entirely
              </button>
              <button
                className="btn btn--solid"
                disabled={!reason || (reason === "other" && !free.trim())}
                onClick={() => setStep(2)}
              >
                see alternatives <span className="arr">→</span>
              </button>
            </div>
          </div>
        )}

        {step === 2 && finalAlt && (
          <div className="dc-resign__step">
            <p className="dc-resign__lede">
              based on your reason, here's a place that might fit better. day 1 resets. your
              artifact pack moves with you.
            </p>
            <div className="dc-resign__alt">
              <div className="dc-resign__alt-name">{finalAlt.company}</div>
              <div className="dc-resign__alt-reason">{finalAlt.reason}</div>
            </div>
            <p className="dc-resign__note">
              you can switch freely during sprint 0. after sprint 1, switching resets your
              progress — same as a real job move.
            </p>
            <div className="dc-resign__actions">
              <button className="btn btn--ghost" onClick={() => setStep(1)}>← back</button>
              <button
                className="btn btn--solid"
                onClick={() => onSwitch?.(finalAlt)}
              >
                switch to {finalAlt.company} <span className="arr">→</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}