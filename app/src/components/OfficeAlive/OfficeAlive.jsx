// ─── OfficeAlive — the landing-page ambient pulse grid ──────────────────
//
// 24-cell grid representing the 8-agent × 3-company ecosystem. Each cell
// is a "person working on a thing" — pulses randomly between 4-9 second
// cycles, with a color that maps to status (shipping/idle/review/standup).
// The grid feels like a small company's office from a 3D camera: someone
// is always doing something.
//
// Visual contract: NEVER a static grid. Every cell has its own pulse
// cadence. The hero CTA lives BELOW the grid, not on top of it.

import { useEffect, useState } from "react";
import { AGENTS } from "../../data/agentsData.js";

const STATUS = ["shipping", "idle", "review", "compiling", "standup"];
const STATUS_COLOR = {
  shipping: "var(--ok-fill)",
  idle: "var(--muted)",
  review: "#f0b94c",
  compiling: "#5b8cff",
  standup: "#d97aff",
};

const NUM_CELLS = 24;

function initialGrid() {
  // Stable seed: assign each agent to cells in a pattern, then sprinkle
  // the rest with anonymous workers.
  return Array.from({ length: NUM_CELLS }, (_, i) => {
    const agent = AGENTS[i % AGENTS.length];
    return {
      i,
      agent,
      status: STATUS[Math.floor(Math.random() * STATUS.length)],
      // Each cell pulses on its own cycle, 4-9s.
      pulse: 4 + Math.random() * 5,
      // 0-1 initial phase.
      phase: Math.random(),
    };
  });
}

export default function OfficeAlive() {
  const [grid, setGrid] = useState(initialGrid);

  // Tick the grid every 2.5s. Random cells change status. The pulse cycle
  // (handled via CSS animation) is per-cell so the visual is always
  // different.
  useEffect(() => {
    const t = setInterval(() => {
      setGrid((g) =>
        g.map((c) =>
          Math.random() < 0.18
            ? { ...c, status: STATUS[Math.floor(Math.random() * STATUS.length)] }
            : c
        )
      );
    }, 2500);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="dc-office" aria-hidden="true">
      <div className="dc-office__head">
        <span className="dc-office__title">the office · live</span>
        <span className="dc-office__legend">
          <span><span className="dot" style={{ background: STATUS_COLOR.shipping }} /> shipping</span>
          <span><span className="dot" style={{ background: STATUS_COLOR.review }} /> review</span>
          <span><span className="dot" style={{ background: STATUS_COLOR.compiling }} /> compiling</span>
          <span><span className="dot" style={{ background: STATUS_COLOR.standup }} /> standup</span>
          <span><span className="dot" style={{ background: STATUS_COLOR.idle }} /> idle</span>
        </span>
      </div>
      <div className="dc-office__grid">
        {grid.map((c) => {
          const color = STATUS_COLOR[c.status] || STATUS_COLOR.idle;
          return (
            <div
              key={c.i}
              className="dc-office__cell"
              style={{
                "--cell-color": color,
                "--cell-pulse": `${c.pulse}s`,
                "--cell-phase": `${c.phase * 360}deg`,
              }}
            >
              <div className="dc-office__cell-inner">
                <span
                  className="dc-office__cell-avatar"
                  style={{ background: c.agent?.signatureColor || "var(--ink)" }}
                >
                  {c.agent?.name?.[0] || "·"}
                </span>
                <span className="dc-office__cell-status" style={{ background: color }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}