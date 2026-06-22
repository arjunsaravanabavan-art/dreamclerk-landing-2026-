// ─── AgentModal — full peer profile for one of the 8 agents ──────────────
//
// Opens when the user clicks an agent in AgentsRoster or a ticker row.
// Shows: identity, role, signature, recent sprint log (peer quote + work),
// a small chat box, and an "ask them a question" input that calls the LLM
// in `agent` mode. Chat is in-character.

import { useEffect, useRef, useState } from "react";
import { AGENTS } from "../../data/agentsData.js";
import { agentChat, isLive } from "../../lib/llmManager.js";

export default function AgentModal({ agentId, onClose }) {
  const agent = AGENTS.find((a) => a.id === agentId);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [live, setLive] = useState(false);
  const inputRef = useRef(null);

  // Focus the input on open. ESC closes. Body scroll lock while open.
  useEffect(() => {
    inputRef.current?.focus();
    const onKey = (e) => { if (e.key === "Escape") onClose?.(); };
    window.addEventListener("keydown", onKey);
    document.body.classList.add("dc-modal-open");
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.classList.remove("dc-modal-open");
    };
  }, [onClose]);

  if (!agent) return null;

  const submit = async (e) => {
    e?.preventDefault();
    const text = input.trim();
    if (!text || busy) return;
    setInput("");
    setMessages((m) => [...m, { speaker: "user", text }]);
    setBusy(true);
    const { text: reply, source } = await agentChat({ agentId: agent.id, userText: text });
    setLive(source === "live");
    setMessages((m) => [...m, { speaker: "agent", text: reply, source }]);
    setBusy(false);
  };

  return (
    <div className="dc-modal" role="dialog" aria-modal="true" aria-label={`peer profile: ${agent.name}`}>
      <div className="dc-modal__scrim" onClick={onClose} />
      <div className="dc-modal__panel" style={{ "--accent": agent.signatureColor }}>
        <header className="dc-modal__head">
          <div className="dc-modal__avatar" style={{ background: agent.signatureColor }}>{agent.name[0]}</div>
          <div className="dc-modal__id">
            <div className="dc-modal__name">{agent.name} <span>· {agent.pronouns}</span></div>
            <div className="dc-modal__company">{agent.company} · {agent.role}</div>
            <div className="dc-modal__status">
              <span className="dot" style={{ background: agent.signatureColor }} /> status · {agent.status}
              {!isLive() && <span className="dc-modal__src">· scripted</span>}
              {live && <span className="dc-modal__src dc-modal__src--live">· live</span>}
            </div>
          </div>
          <button className="dc-modal__close" onClick={onClose} aria-label="close">×</button>
        </header>

        <section className="dc-modal__sig">
          <div className="dc-modal__sig-label">signature</div>
          <div className="dc-modal__sig-text">"{agent.signature}"</div>
        </section>

        <section className="dc-modal__stats">
          <div><span>sprints</span><b>{agent.sprintsCompleted}</b></div>
          <div><span>PRs merged</span><b>{agent.prsMerged.toLocaleString()}</b></div>
          <div><span>reviews given</span><b>{agent.reviewsGiven}</b></div>
          <div><span>last commit</span><b>{agent.lastCommit}</b></div>
        </section>

        <section className="dc-modal__peer">
          <div className="dc-modal__peer-label">peer quote</div>
          <div className="dc-modal__peer-text">"{agent.peerQuote}"</div>
          <div className="dc-modal__peer-attrib">— a teammate, on {agent.name}'s review style</div>
        </section>

        <section className="dc-modal__stack">
          <div className="dc-modal__stack-label">stack</div>
          <div className="dc-modal__chips">
            {agent.stack.map((s, i) => <span key={i} className="dc-chip">{s}</span>)}
          </div>
        </section>

        <section className="dc-modal__chat">
          <div className="dc-modal__chat-head">ask {agent.name.split(" ")[0]} a question</div>
          <div className="dc-modal__chat-list">
            {messages.length === 0 && (
              <div className="dc-modal__chat-empty">
                try: "what did you ship this week?" / "how do you review a PR?" / "what's the worst code you've seen?"
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`dc-modal__msg dc-modal__msg--${m.speaker}`}>
                <div className="dc-modal__msg-meta">
                  {m.speaker === "user" ? "you" : agent.name}
                  {m.source && m.speaker === "agent" && <span className="dc-modal__msg-src">· {m.source === "live" ? "live" : "scripted"}</span>}
                </div>
                <div className="dc-modal__msg-body">{m.text}</div>
              </div>
            ))}
            {busy && <div className="dc-modal__msg dc-modal__msg--agent dc-modal__msg--busy">{agent.name.split(" ")[0]} is typing…</div>}
          </div>
          <form className="dc-modal__form" onSubmit={submit}>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`ask ${agent.name.split(" ")[0]}…`}
              disabled={busy}
            />
            <button type="submit" className="btn btn--solid" disabled={!input.trim() || busy}>
              send <span className="arr">→</span>
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}