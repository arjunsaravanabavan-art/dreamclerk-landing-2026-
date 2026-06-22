// ─── AgentsRoster — the public landing grid of the 8 AI agents ──────────
//
// Each cell is an agent. Clicking opens AgentModal with the full peer profile,
// signature, recent work, and a live (or fallback) chat. The grid cycles
// status colors every 4-8s so the office feels alive.
//
// Layout: 8 cells in a 4x2 grid on desktop, 2x4 on tablet, 1x8 on mobile.

import { useEffect, useState } from "react";
import Section from "../Section.jsx";
import { AGENTS } from "../../data/agentsData.js";

const STATUS_META = {
  shipping:  { label: "shipping",       color: "var(--ok-fill)" },
  idle:      { label: "idle",           color: "var(--muted)" },
  review:    { label: "in review",      color: "#f0b94c" },
  compiling: { label: "compiling",      color: "#5b8cff" },
  standup:   { label: "in standup",     color: "#d97aff" },
};

export default function AgentsRoster({ onSelectAgent }) {
  // Re-pick a random status for each agent every 5s. The original status
  // is preserved as the agent's "primary" status — this just adds
  // background movement so the grid never feels frozen.
  const [activeStatus, setActiveStatus] = useState(() =>
    Object.fromEntries(AGENTS.map((a) => [a.id, a.status]))
  );

  useEffect(() => {
    const allStatuses = Object.keys(STATUS_META);
    const t = setInterval(() => {
      setActiveStatus((prev) => {
        const next = { ...prev };
        // pick 2-3 agents to flip each tick
        const flips = 2 + Math.floor(Math.random() * 2);
        for (let i = 0; i < flips; i++) {
          const a = AGENTS[Math.floor(Math.random() * AGENTS.length)];
          const s = allStatuses[Math.floor(Math.random() * allStatuses.length)];
          next[a.id] = s;
        }
        return next;
      });
    }, 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <Section
      id="agents"
      command="who --works-here"
      label="the workforce"
      title="8 agents. 8 companies. one loop."
      lede="every agent on this page is the employee you're working alongside. click any of them to see their sprint log, their stack, and how they ship."
    >
      <div className="dc-agents">
        {AGENTS.map((agent) => {
          const status = activeStatus[agent.id] || agent.status;
          const meta = STATUS_META[status] || STATUS_META.shipping;
          return (
            <button
              key={agent.id}
              className="dc-agent"
              onClick={() => onSelectAgent?.(agent.id)}
              style={{ "--accent": agent.signatureColor }}
            >
              <div className="dc-agent__head">
                <div className="dc-agent__avatar" style={{ background: agent.signatureColor }}>
                  {agent.name[0]}
                </div>
                <div className="dc-agent__id">
                  <div className="dc-agent__name">
                    {agent.name}
                    <span className="dc-agent__pronouns">· {agent.pronouns}</span>
                  </div>
                  <div className="dc-agent__company">{agent.company}</div>
                </div>
                <div className="dc-agent__status" style={{ color: meta.color }}>
                  <span className="dc-agent__pulse" style={{ background: meta.color }} />
                  {meta.label}
                </div>
              </div>
              <div className="dc-agent__role">{agent.role}</div>
              <div className="dc-agent__sig">"{agent.signature}"</div>
              <div className="dc-agent__stats">
                <span><b>{agent.sprintsCompleted}</b> sprints</span>
                <span><b>{agent.prsMerged.toLocaleString()}</b> PRs</span>
                <span className="dc-agent__commit">last commit · {agent.lastCommit}</span>
              </div>
              <div className="dc-agent__hover">open peer profile →</div>
            </button>
          );
        })}
      </div>
    </Section>
  );
}