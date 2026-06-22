// ─── StandupModal — daily standup transcript + user response form ───────
//
// Per the Work Culture .md: standups are 15 minutes. The transcript shows
// 3 speakers in their archetype's voice, then asks the user to fill in
// their yesterday/today/blockers in the bullet-point manager's voice.
//
// This is a "you are participating" piece — the user submits their own
// standup update and the manager persona acknowledges it with a number.

import { useState, useEffect } from "react";
import { STANDUP_TRANSCRIPTS } from "../../data/standups.js";

export default function StandupModal({ sprint = 1, onClose, onSubmit }) {
  const data = STANDUP_TRANSCRIPTS.find((s) => s.sprint === sprint) || STANDUP_TRANSCRIPTS[0];
  const [y, setY] = useState(data.userPrompt.yesterday);
  const [t, setT] = useState(data.userPrompt.today);
  const [b, setB] = useState(data.userPrompt.blockers);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose?.(); };
    window.addEventListener("keydown", onKey);
    document.body.classList.add("dc-modal-open");
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.classList.remove("dc-modal-open");
    };
  }, [onClose]);

  const submit = (e) => {
    e?.preventDefault();
    setSubmitted(true);
    onSubmit?.({ yesterday: y, today: t, blockers: b, sprint });
  };

  return (
    <div className="dc-modal" role="dialog" aria-modal="true">
      <div className="dc-modal__scrim" onClick={onClose} />
      <div className="dc-modal__panel dc-modal__panel--narrow">
        <header className="dc-modal__head">
          <div className="dc-modal__id">
            <div className="dc-modal__name">{data.title}</div>
            <div className="dc-modal__company">nexara · engineering · #standup</div>
          </div>
          <button className="dc-modal__close" onClick={onClose} aria-label="close">×</button>
        </header>

        <section className="dc-standup__transcript">
          {data.attendees.map((a, i) => (
            <div key={i} className="dc-standup__msg">
              <div className="dc-standup__head">
                <b>{a.name}</b>
                <span className="dc-standup__role">· {a.role}</span>
              </div>
              <div className={`dc-standup__voice dc-standup__voice--${a.voice}`}>{a.text}</div>
            </div>
          ))}
        </section>

        {!submitted ? (
          <form className="dc-standup__form" onSubmit={submit}>
            <div className="dc-standup__field">
              <label htmlFor="y">1. yesterday</label>
              <textarea id="y" rows={2} value={y} onChange={(e) => setY(e.target.value)} required />
            </div>
            <div className="dc-standup__field">
              <label htmlFor="t">2. today</label>
              <textarea id="t" rows={2} value={t} onChange={(e) => setT(e.target.value)} required />
            </div>
            <div className="dc-standup__field">
              <label htmlFor="b">3. blockers</label>
              <textarea id="b" rows={2} value={b} onChange={(e) => setB(e.target.value)} placeholder="none. (if you have none, say none.)" />
            </div>
            <div className="dc-standup__hint">
              write in bullet-point priya's voice: numbered, terse, no fluff.
            </div>
            <button type="submit" className="btn btn--solid">
              send to #standup <span className="arr">→</span>
            </button>
          </form>
        ) : (
          <div className="dc-standup__ack">
            <div className="dc-standup__ack-head">
              <span className="dot" style={{ background: "var(--ok-fill)" }} /> posted to #standup
            </div>
            <p>
              priya acks in 38 minutes: <em>"1. got it. 2. PR before friday demo. 3. ping if you're blocked."</em>
            </p>
            <button className="btn btn--ghost" onClick={onClose}>close</button>
          </div>
        )}
      </div>
    </div>
  );
}