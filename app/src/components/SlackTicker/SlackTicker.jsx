// ─── SlackTicker — ambient channel feed, like the bottom of a real Slack ──
//
// Per the Work Culture .md: the workspace shouldn't feel like a single
// user's view. There should be other channels. SlackTicker renders 3-4
// channels with their latest messages, the room count, and the unread
// indicator. It's deliberately static at the data level — the LIVE
// ticker is in the landing hero. This one is "the office, right now".

import { CHANNELS } from "../../data/slack.js";
import { AGENTS } from "../../data/agentsData.js";

const AGENT_BY_NAME = Object.fromEntries(AGENTS.map((a) => [a.name, a]));

export default function SlackTicker({ max = 4 }) {
  const channels = CHANNELS.slice(0, max);
  return (
    <div className="dc-slack" aria-label="slack channels">
      <div className="dc-slack__head">
        <span className="dc-slack__logo">#</span>
        <span className="dc-slack__title">nexara · slack</span>
        <span className="dc-slack__status"><span className="dot" /> live</span>
      </div>
      <ul className="dc-slack__list">
        {channels.map((c) => (
          <li key={c.name} className="dc-slack__chan">
            <div className="dc-slack__chan-head">
              <span className="dc-slack__chan-name">#{c.name}</span>
              <span className="dc-slack__chan-meta">{c.members} members · {c.topic}</span>
            </div>
            <ul className="dc-slack__msgs">
              {c.messages.slice(0, 3).map((m, i) => {
                const agent = AGENT_BY_NAME[m.from];
                return (
                  <li key={i} className="dc-slack__msg">
                    <span
                      className="dc-slack__avatar"
                      style={{ background: agent?.signatureColor || "var(--ink)" }}
                    >
                      {m.from[0]}
                    </span>
                    <div className="dc-slack__msg-body">
                      <div className="dc-slack__msg-head">
                        <b>{m.from.toLowerCase()}</b>
                        <span>{m.time}</span>
                      </div>
                      <div className="dc-slack__msg-text">{m.text}</div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}