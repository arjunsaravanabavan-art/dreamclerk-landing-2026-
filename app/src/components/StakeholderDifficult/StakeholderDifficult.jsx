// ─── StakeholderDifficult — the "while you're at it..." inbox item ───────
//
// Per the Work Culture .md: scope creep is a real workplace phenomenon.
// A stakeholder (PM, customer success, sales) drops a "while you're at it"
// item in the inbox. The user has to choose one of three responses:
//   - take it on   (scope creeps, reviewer notes "scope discipline")
//   - file a follow-up  (right answer, reviewer praises)
//   - ask why      (data-driven, also a senior move)
//
// The component is a small inbox-style toast that appears in the workspace
// sidebar. Clicking the message opens a 3-option response panel.

import { useState, useEffect } from "react";

export default function StakeholderDifficult({ from, message, options, onRespond, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  const [responded, setResponded] = useState(null);

  useEffect(() => { if (defaultOpen) setOpen(true); }, [defaultOpen]);

  const choose = (opt) => {
    setResponded(opt);
    onRespond?.(opt);
  };

  return (
    <div className="dc-scope">
      <button
        className="dc-scope__header"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <div className="dc-scope__from">
          <span className="dc-scope__icon">✉</span>
          <div>
            <div className="dc-scope__from-name">{from}</div>
            <div className="dc-scope__from-sub">scope-creep inbox</div>
          </div>
        </div>
        <span className="dc-scope__chevron">{open ? "−" : "+"}</span>
      </button>
      {open && (
        <div className="dc-scope__body">
          <p className="dc-scope__msg">{message}</p>
          {responded ? (
            <div className="dc-scope__ack">
              <div className="dc-scope__ack-head">you replied</div>
              <p>{responded.label}</p>
              <p className="dc-scope__ack-outcome"><em>{responded.outcome}</em></p>
            </div>
          ) : (
            <div className="dc-scope__options">
              <div className="dc-scope__options-head">your move</div>
              {options.map((o) => (
                <button
                  key={o.id}
                  className={`dc-scope__opt dc-scope__opt--${o.id}`}
                  onClick={() => choose(o)}
                >
                  <div className="dc-scope__opt-label">{o.label}</div>
                  <div className="dc-scope__opt-outcome">{o.outcome}</div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}