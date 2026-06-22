// ─── BetaIdle — ambient office pulse, visible only when user is idle ─────
//
// Per the Work Culture .md: when no key has been pressed for 45s, the
// workspace dims and an "ambient" overlay fades in. The overlay shows
// recent agent work happening nearby — the office is alive even when
// the user is stuck. Pressing any key or moving the mouse exits idle.
//
// This is NOT a guilt-trip or a "are you still there?" prompt. It's a
// textual reminder that the rest of the office didn't stop.

import { useEffect, useState } from "react";
import { TICKER_FEED_TEMPLATES, AGENTS } from "../../data/agentsData.js";

const IDLE_MS = 45000;
const PEEK_INTERVAL_MS = 7000;

export default function BetaIdle() {
  const [idle, setIdle] = useState(false);
  const [peeks, setPeeks] = useState([]);

  // Watch for keyboard / mouse activity. Reset the idle timer on either.
  useEffect(() => {
    let idleTimer = null;
    const reset = () => {
      setIdle(false);
      if (idleTimer) clearTimeout(idleTimer);
      idleTimer = setTimeout(() => setIdle(true), IDLE_MS);
    };
    reset();
    window.addEventListener("keydown", reset);
    window.addEventListener("mousemove", reset);
    window.addEventListener("mousedown", reset);
    return () => {
      window.removeEventListener("keydown", reset);
      window.removeEventListener("mousemove", reset);
      window.removeEventListener("mousedown", reset);
      if (idleTimer) clearTimeout(idleTimer);
    };
  }, []);

  // When idle, rotate 3-4 peeks at a time. Each peek is a recent agent work
  // event from the ticker templates.
  useEffect(() => {
    if (!idle) {
      setPeeks([]);
      return;
    }
    const all = TICKER_FEED_TEMPLATES;
    const sample = () => {
      const out = [];
      const seen = new Set();
      while (out.length < 3 && seen.size < all.length) {
        const i = Math.floor(Math.random() * all.length);
        if (seen.has(i)) continue;
        seen.add(i);
        out.push(all[i]);
      }
      return out;
    };
    setPeeks(sample());
    const t = setInterval(() => setPeeks(sample()), PEEK_INTERVAL_MS);
    return () => clearInterval(t);
  }, [idle]);

  if (!idle) return null;
  return (
    <div className="dc-idle" aria-hidden="true">
      <div className="dc-idle__pane">
        <div className="dc-idle__head">
          <span className="dot" /> the office is still going
        </div>
        <ul className="dc-idle__list">
          {peeks.map((p, i) => {
            const agent = AGENTS.find((a) => a.name === p.agent);
            return (
              <li key={i}>
                <span className="dc-idle__who">{p.agent.toLowerCase()}</span>
                <span className="dc-idle__verb">{p.verb}</span>
                <span className="dc-idle__obj">{p.object}</span>
                {agent && <span className="dc-idle__dot" style={{ background: agent.signatureColor }} />}
              </li>
            );
          })}
        </ul>
        <div className="dc-idle__hint">type or click anywhere to come back.</div>
      </div>
    </div>
  );
}