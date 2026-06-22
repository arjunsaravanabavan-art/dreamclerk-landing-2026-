// ─── AssistanceCounter — visible usage meter for the IWR metric ─────────
//
// Per the AI Policy .md: the user can ALWAYS see how many times they've
// used the assistant. The IWR (Independent Work Ratio) is computed as:
//
//     IWR = 1 - (assistCount / max(1, totalEdits))
//
// A high IWR means more of the work was theirs. The reviewer reads this
// when grading. The counter updates in real time as the user clicks
// assist buttons.

import { useEffect, useState } from "react";
import { getUsage, subscribeUsage } from "../../lib/llmManager.js";

export default function AssistanceCounter({ totalEdits = 0, variant = "sidebar" }) {
  const [usage, setUsage] = useState(() => getUsage());

  useEffect(() => {
    const unsub = subscribeUsage(() => setUsage(getUsage()));
    return unsub;
  }, []);

  const iwr = totalEdits > 0 ? Math.max(0, 1 - usage.assistCount / totalEdits) : 1;
  const pct = Math.round(iwr * 100);

  // Color the meter: green > 80, amber 60-80, red < 60
  const color = pct >= 80 ? "var(--ok-fill)" : pct >= 60 ? "#f0b94c" : "#ff5c5c";

  return (
    <div className={`dc-iwr dc-iwr--${variant}`} aria-label="independent work ratio">
      <div className="dc-iwr__head">
        <span className="dc-iwr__label">independent work ratio</span>
        <span className="dc-iwr__pct" style={{ color }}>{pct}%</span>
      </div>
      <div className="dc-iwr__bar">
        <div className="dc-iwr__bar-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
      <div className="dc-iwr__meta">
        <span><b>{usage.assistCount}</b> assists</span>
        <span><b>{totalEdits}</b> edits</span>
        <span>reviewer reads this.</span>
      </div>
    </div>
  );
}