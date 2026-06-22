// ─── SprintRetro — the post-sprint retro transcript ─────────────────────
//
// Shows the 3-column retro (went well / went poorly / we'll do differently)
// populated by the 3 main characters in their archetype's voice. This is
// the "office culture" texture that makes the workspace feel like a real
// team — feedback comes from people, not from a system.

import { useEffect } from "react";
import { RETRO_FEEDBACK } from "../../data/retros.js";

export default function SprintRetro({ sprint = 1, company = "nexara", onClose }) {
  const data = RETRO_FEEDBACK[company]?.[sprint];

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose?.(); };
    window.addEventListener("keydown", onKey);
    document.body.classList.add("dc-modal-open");
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.classList.remove("dc-modal-open");
    };
  }, [onClose]);

  if (!data) return null;
  return (
    <div className="dc-modal" role="dialog" aria-modal="true">
      <div className="dc-modal__scrim" onClick={onClose} />
      <div className="dc-modal__panel">
        <header className="dc-modal__head">
          <div className="dc-modal__id">
            <div className="dc-modal__name">{data.title}</div>
            <div className="dc-modal__company">retro · transcript</div>
          </div>
          <button className="dc-modal__close" onClick={onClose} aria-label="close">×</button>
        </header>

        <div className="dc-retro">
          <section className="dc-retro__col dc-retro__col--good">
            <div className="dc-retro__head">went well</div>
            <ul>
              {data.wentWell.map((w, i) => (
                <li key={i}>
                  <div className="dc-retro__speaker">{w.speaker}</div>
                  <div className="dc-retro__text">{w.text}</div>
                </li>
              ))}
            </ul>
          </section>

          <section className="dc-retro__col dc-retro__col--bad">
            <div className="dc-retro__head">went poorly</div>
            <ul>
              {data.wentPoorly.map((w, i) => (
                <li key={i}>
                  <div className="dc-retro__speaker">{w.speaker}</div>
                  <div className="dc-retro__text">{w.text}</div>
                </li>
              ))}
            </ul>
          </section>

          <section className="dc-retro__col dc-retro__col--next">
            <div className="dc-retro__head">we'll do differently</div>
            <ul>
              {data.doDifferently.map((w, i) => (
                <li key={i}>
                  <div className="dc-retro__speaker">{w.speaker}</div>
                  <div className="dc-retro__text">{w.text}</div>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <footer className="dc-retro__foot">
          <p>
            <em>these notes are saved to your sprint record. promotion interviews start here.</em>
          </p>
          <button className="btn btn--solid" onClick={onClose}>close</button>
        </footer>
      </div>
    </div>
  );
}