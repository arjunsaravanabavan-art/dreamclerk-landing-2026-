// ─── AssistantButton — in-IDE AI assist mode picker ──────────────────────
//
// A small floating button that opens the assist menu. Modes:
//   - boilerplate     → generate function signature, always allowed
//   - name            → suggest variable / function names, always allowed
//   - test_stub       → generate test structure, always allowed
//   - explanation     → explain existing code, always allowed
//   - logic           → write non-trivial logic, BANNED at Nexara
//   - full_solution   → write the whole PR, BANNED at Nexara
//
// Each click calls llmManager.assistant(); banned modes are caught in the
// wrapper and the response is shown as a policy notice (not as generated
// code). The assistanceCounter component reads usage from the wrapper.

import { useState, useEffect } from "react";
import { assistant, subscribeUsage, getUsage } from "../../lib/llmManager.js";
import { getActivePolicy } from "../../data/aiPolicies.js";

const MODE_LABELS = {
  boilerplate:   { label: "boilerplate",   short: "function signatures, type defs" },
  name:          { label: "name",          short: "suggest a variable or function name" },
  test_stub:     { label: "test stub",     short: "structure of a test case" },
  explanation:   { label: "explain",       short: "what does this code do?" },
  logic:         { label: "logic",         short: "write the implementation", banned: true },
  full_solution: { label: "full solution", short: "write the whole PR", banned: true },
};

export default function AssistantButton({ context = {}, trackId = "backend-intern", onAssist }) {
  const [open, setOpen] = useState(false);
  const [policy] = useState(() => getActivePolicy(trackId));
  const [usage, setUsage] = useState(() => getUsage());
  const [lastResult, setLastResult] = useState(null);

  useEffect(() => {
    const unsub = subscribeUsage(() => setUsage(getUsage()));
    return unsub;
  }, []);

  const trigger = async (mode) => {
    setOpen(false);
    const res = await assistant({ mode, context, policy });
    setLastResult({ mode, ...res });
    onAssist?.({ mode, ...res });
  };

  return (
    <>
      <button
        className="dc-assist-btn"
        onClick={() => setOpen((o) => !o)}
        aria-label="open AI assist"
        aria-expanded={open}
      >
        <span className="dc-assist-btn__icon">✦</span>
        <span className="dc-assist-btn__count">{usage.assistCount}</span>
      </button>
      {open && (
        <div className="dc-assist-menu" role="menu">
          <div className="dc-assist-menu__head">
            <div>
              <div className="dc-assist-menu__title">AI assist</div>
              <div className="dc-assist-menu__policy">{policy.company} · {policy.posture.replace(/-/g, " ")}</div>
            </div>
            <button className="dc-assist-menu__close" onClick={() => setOpen(false)} aria-label="close">×</button>
          </div>
          {Object.entries(MODE_LABELS).map(([mode, m]) => (
            <button
              key={mode}
              className={`dc-assist-menu__item ${m.banned ? "is-banned" : ""}`}
              onClick={() => !m.banned && trigger(mode)}
              disabled={m.banned}
              role="menuitem"
            >
              <div className="dc-assist-menu__row">
                <span className="dc-assist-menu__label">{m.label}</span>
                {m.banned && <span className="dc-assist-menu__tag">banned</span>}
              </div>
              <span className="dc-assist-menu__short">{m.short}</span>
            </button>
          ))}
          <div className="dc-assist-menu__foot">
            each click adds to your assist count. reviewers see it.
          </div>
        </div>
      )}
      {lastResult && <AssistantToast result={lastResult} onDismiss={() => setLastResult(null)} />}
    </>
  );
}

function AssistantToast({ result, onDismiss }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 6000);
    return () => clearTimeout(t);
  }, [onDismiss]);
  return (
    <div className="dc-assist-toast" role="status">
      <div className="dc-assist-toast__head">
        {result.allowed === false ? "blocked by policy" : `assist · ${result.mode}`}
        <button onClick={onDismiss} aria-label="dismiss">×</button>
      </div>
      <div className="dc-assist-toast__body">
        {result.allowed === false
          ? result.text
          : <pre><code>{result.text}</code></pre>}
      </div>
      <div className="dc-assist-toast__src">
        {result.source === "live" ? "· live" : result.source === "policy" ? "· policy" : "· scripted"} · counter · {result.counter || "—"}
      </div>
    </div>
  );
}