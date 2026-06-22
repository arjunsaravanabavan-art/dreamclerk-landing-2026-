// ─── ConfusionNudge — early warning that the user might be stuck ─────────
//
// Heuristic (per the Work Culture .md):
//   - many rapid "go back" events
//   - or: long idle + no submission + tab not focused
//
// When triggered, the nudge is a 1-line in-character peer message. It does
// NOT block the workspace. It does NOT auto-help. It just says: "hey, we
// noticed." The user can dismiss it.
//
// The peer who nudges is the one whose work pattern matches the user's
// current task type — backend → Owen, frontend → Aria, etc. (See
// managerPersonalities.js for the archetype pool.)

import { useEffect, useState, useRef } from "react";
import { AGENTS } from "../../data/agentsData.js";

const NUDGE_COOLDOWN_MS = 90000; // don't nudge twice in 90s
const MIN_GO_BACKS = 3;          // go-backs in the window
const GO_BACK_WINDOW_MS = 20000; // rolling 20s window
const IDLE_FOR_NUDGE_MS = 120000; // 2 min idle

export default function ConfusionNudge({ trackId = "backend-intern" }) {
  const [nudge, setNudge] = useState(null);
  const lastNudgeAt = useRef(0);
  const goBacks = useRef([]); // timestamps
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Track go-backs via custom events the workspace will dispatch.
    // We don't add it as a hard dependency on the workspace — the workspace
    // dispatches `dc:go-back` on each nav-back; we listen globally.
    const onGoBack = () => {
      const now = Date.now();
      goBacks.current.push(now);
      goBacks.current = goBacks.current.filter((t) => now - t < GO_BACK_WINDOW_MS);
      if (goBacks.current.length >= MIN_GO_BACKS) maybeNudge("go-backs");
    };
    window.addEventListener("dc:go-back", onGoBack);

    // Track long-idle.
    let idleStart = Date.now();
    const onActivity = () => { idleStart = Date.now(); };
    window.addEventListener("keydown", onActivity);
    window.addEventListener("mousemove", onActivity);
    window.addEventListener("mousedown", onActivity);
    const idleT = setInterval(() => {
      if (Date.now() - idleStart > IDLE_FOR_NUDGE_MS) maybeNudge("idle");
    }, 5000);

    return () => {
      window.removeEventListener("dc:go-back", onGoBack);
      window.removeEventListener("keydown", onActivity);
      window.removeEventListener("mousemove", onActivity);
      window.removeEventListener("mousedown", onActivity);
      clearInterval(idleT);
    };
  }, []);

  const maybeNudge = (reason) => {
    if (dismissed) return;
    const now = Date.now();
    if (now - lastNudgeAt.current < NUDGE_COOLDOWN_MS) return;
    // Pick a peer that fits the track.
    const peerPool = {
      "backend-intern": ["owen", "jess"],
      "frontend-intern": ["aria"],
      "aiml-intern": ["kai"],
      "data-intern": ["sol"],
    }[trackId] || ["owen"];
    const peerName = peerPool[Math.floor(Math.random() * peerPool.length)];
    const peer = AGENTS.find((a) => a.name.toLowerCase().startsWith(peerName));
    if (!peer) return;
    const message = reason === "go-backs"
      ? `you've navigated back a few times. want me to walk you through the cursor logic?`
      : `quiet for a while. everything okay? if you're stuck on the brief, the predecessor ticket is the answer.`;
    lastNudgeAt.current = now;
    setNudge({ peer, message, reason });
    // Auto-dismiss after 15s.
    setTimeout(() => setNudge((n) => (n?.reason === reason ? null : n)), 15000);
  };

  if (!nudge) return null;
  return (
    <div className="dc-nudge" role="status" aria-live="polite">
      <div className="dc-nudge__bubble">
        <div className="dc-nudge__avatar" style={{ background: nudge.peer.signatureColor }}>{nudge.peer.name[0]}</div>
        <div className="dc-nudge__body">
          <div className="dc-nudge__head">
            {nudge.peer.name} <span className="dc-nudge__role">· {nudge.peer.role}</span>
          </div>
          <div className="dc-nudge__msg">{nudge.message}</div>
        </div>
        <button className="dc-nudge__close" onClick={() => setNudge(null)} aria-label="dismiss">×</button>
      </div>
    </div>
  );
}