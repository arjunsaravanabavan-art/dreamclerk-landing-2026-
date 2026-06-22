// ─── CompanyWiki — the Day 1 artifact pack ────────────────────────────────
//
// Sprint 0 of the beta. The user reads a 5-page wiki, opens the predecessor
// ticket, and reviews the architecture diagram + style guide. They MUST
// acknowledge the pack before Sprint 1 unlocks — this is the gate.
//
// Layout:
//   - left rail: page list (5 wiki pages + predecessor + diagram + style guide)
//   - main: the active page
//   - footer: "Acknowledge & start sprint 1" CTA, enabled only after the
//     user has opened at least 3 wiki pages and the predecessor ticket
//
// This is the FIRST thing the user sees after the track picker. It's
// deliberately framed as "Day 1 at Nexara", not "Read these docs."

import { useState, useMemo } from "react";
import {
  NEXARA_WIKI,
  PREDECESSOR_TICKET,
  ARCHITECTURE_DIAGRAM,
  STYLE_GUIDE,
  TEAM_PROFILES,
  acknowledgeSprint0,
} from "../../../data/nexaraOnboarding.js";

const TABS = [
  { id: "wiki", label: "company wiki" },
  { id: "predecessor", label: "predecessor ticket" },
  { id: "architecture", label: "architecture" },
  { id: "style", label: "style guide" },
  { id: "team", label: "meet the team" },
];

export default function CompanyWiki({ session, onAcknowledge }) {
  const [activeTab, setActiveTab] = useState("wiki");
  const [wikiPage, setWikiPage] = useState(0);
  const [viewed, setViewed] = useState({ wiki: new Set([0]), predecessor: false, architecture: false, style: false, team: false });

  // Update viewed on tab change. Used to gate the acknowledge button.
  const setTab = (id) => {
    setActiveTab(id);
    setViewed((v) => {
      const next = { ...v, [id]: id === "wiki" ? new Set([...v.wiki, wikiPage]) : true };
      return next;
    });
  };
  const setPage = (i) => {
    setWikiPage(i);
    setViewed((v) => ({ ...v, wiki: new Set([...v.wiki, i]) }));
  };

  // Gating: must have opened at least 3 wiki pages, the predecessor, and 1 other.
  const canAck = useMemo(() => {
    const others = ["predecessor", "architecture", "style", "team"].filter((k) => viewed[k]).length;
    return viewed.wiki.size >= 3 && viewed.predecessor && others >= 1;
  }, [viewed]);

  const onAck = () => {
    if (!canAck) return;
    onAcknowledge(acknowledgeSprint0(session));
  };

  return (
    <div className="dc-sprint0">
      <div className="dc-sprint0__head">
        <div className="dc-sprint0__brand">
          <div className="dc-sprint0__logo">N</div>
          <div>
            <div className="dc-sprint0__name">Nexara · Day 1</div>
            <div className="dc-sprint0__role">backend engineering intern · sprint 0 of 3</div>
          </div>
        </div>
        <div className="dc-sprint0__progress" aria-label="pack progress">
          <span className={`dc-pill ${viewed.wiki.size >= 3 ? "on" : ""}`}>wiki {viewed.wiki.size}/5</span>
          <span className={`dc-pill ${viewed.predecessor ? "on" : ""}`}>predecessor {viewed.predecessor ? "✓" : ""}</span>
          <span className={`dc-pill ${viewed.architecture ? "on" : ""}`}>arch {viewed.architecture ? "✓" : ""}</span>
          <span className={`dc-pill ${viewed.style ? "on" : ""}`}>style {viewed.style ? "✓" : ""}</span>
          <span className={`dc-pill ${viewed.team ? "on" : ""}`}>team {viewed.team ? "✓" : ""}</span>
        </div>
      </div>

      <div className="dc-sprint0__body">
        <aside className="dc-sprint0__rail">
          {TABS.map((t) => (
            <button
              key={t.id}
              className={`dc-sprint0__tab ${activeTab === t.id ? "is-active" : ""}`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
              {t.id === "wiki" && <span className="dc-sprint0__count">{viewed.wiki.size}/5</span>}
            </button>
          ))}
        </aside>

        <main className="dc-sprint0__main">
          {activeTab === "wiki" && <WikiPage page={NEXARA_WIKI[wikiPage]} index={wikiPage} total={NEXARA_WIKI.length} onPage={setPage} />}
          {activeTab === "predecessor" && <PredecessorPage />}
          {activeTab === "architecture" && <ArchitecturePage />}
          {activeTab === "style" && <StylePage />}
          {activeTab === "team" && <TeamPage />}
        </main>
      </div>

      <footer className="dc-sprint0__foot">
        <div className="dc-sprint0__foot-text">
          read the pack. when you've seen enough, acknowledge and start sprint 1.
          {canAck ? <span className="dc-sprint0__ready"> ready when you are.</span> : <span className="dc-sprint0__notready"> open 3 wiki pages + the predecessor to unlock.</span>}
        </div>
        <button
          className="btn btn--solid dc-sprint0__ack"
          onClick={onAck}
          disabled={!canAck}
        >
          acknowledge & start sprint 1 <span className="arr">→</span>
        </button>
      </footer>
    </div>
  );
}

function WikiPage({ page, index, total, onPage }) {
  if (!page) return null;
  return (
    <article className="dc-wiki">
      <div className="dc-wiki__head">
        <span className="dc-wiki__page">{page.page}</span>
        <h2>{page.title}</h2>
      </div>
      <div className="dc-wiki__body">
        {page.body.split("\n").map((line, i) => {
          if (line.startsWith("**") && line.endsWith("**")) return <h4 key={i}>{line.replace(/\*\*/g, "")}</h4>;
          if (line.startsWith("- ")) return <li key={i}>{renderInline(line.slice(2))}</li>;
          if (line.trim() === "") return <br key={i} />;
          return <p key={i}>{renderInline(line)}</p>;
        })}
      </div>
      <div className="dc-wiki__nav">
        <button className="btn btn--ghost" onClick={() => onPage(Math.max(0, index - 1))} disabled={index === 0}>
          ← previous
        </button>
        <span className="dc-wiki__pos">page {index + 1} of {total}</span>
        <button className="btn btn--ghost" onClick={() => onPage(Math.min(total - 1, index + 1))} disabled={index === total - 1}>
          next →
        </button>
      </div>
    </article>
  );
}

// Render simple **bold** inline. Kept tiny on purpose — we don't need a real
// markdown parser for a 5-page wiki.
function renderInline(s) {
  const parts = s.split(/(\*\*[^*]+\*\*)/);
  return parts.map((p, i) =>
    p.startsWith("**") ? <strong key={i}>{p.replace(/\*\*/g, "")}</strong> : <span key={i}>{p}</span>
  );
}

function PredecessorPage() {
  return (
    <article className="dc-pre">
      <div className="dc-pre__head">
        <span className="dc-pre__id">{PREDECESSOR_TICKET.id}</span>
        <h2>{PREDECESSOR_TICKET.title}</h2>
        <div className="dc-pre__meta">
          filed by {PREDECESSOR_TICKET.filedBy} · {PREDECESSOR_TICKET.filedAt} · {PREDECESSOR_TICKET.type}
        </div>
      </div>

      <section className="dc-pre__section">
        <h3>brief</h3>
        <p style={{ whiteSpace: "pre-wrap" }}>{PREDECESSOR_TICKET.brief}</p>
      </section>

      <section className="dc-pre__section">
        <h3>attached files</h3>
        <ul>
          {PREDECESSOR_TICKET.attached.map((a, i) => (
            <li key={i}><code>{a}</code></li>
          ))}
        </ul>
      </section>

      <section className="dc-pre__section">
        <h3>acceptance</h3>
        <ul>
          {PREDECESSOR_TICKET.acceptance.map((a, i) => <li key={i}>{a}</li>)}
        </ul>
      </section>

      <section className="dc-pre__section">
        <h3>the diff that fixed it</h3>
        <pre className="dc-pre__diff"><code>{PREDECESSOR_TICKET.diff}</code></pre>
      </section>

      <section className="dc-pre__section">
        <h3>review thread</h3>
        <ol className="dc-pre__thread">
          {PREDECESSOR_TICKET.reviewThread.map((r, i) => (
            <li key={i} className="dc-pre__msg">
              <div className="dc-pre__msg-head">
                <b>{r.author}</b> <span>{r.time}</span>
              </div>
              <div className="dc-pre__msg-body">{r.text}</div>
            </li>
          ))}
        </ol>
      </section>

      <section className="dc-pre__section dc-pre__outcome">
        <h3>outcome</h3>
        <p>{PREDECESSOR_TICKET.outcome}</p>
      </section>

      <p className="dc-pre__note">
        read this twice. sprint 1 is the same fix, on a different endpoint.
      </p>
    </article>
  );
}

function ArchitecturePage() {
  return (
    <article className="dc-arch">
      <h2>{ARCHITECTURE_DIAGRAM.title}</h2>
      <div className="dc-arch__diagram">
        {ARCHITECTURE_DIAGRAM.layers.map((layer, i) => (
          <div key={i} className="dc-arch__layer">
            <div className="dc-arch__layer-label">{layer.label}</div>
            <div className="dc-arch__nodes">
              {layer.nodes.map((n, j) => <div key={j} className="dc-arch__node">{n}</div>)}
            </div>
          </div>
        ))}
      </div>
      <p className="dc-arch__notes"><em>{ARCHITECTURE_DIAGRAM.notes}</em></p>
    </article>
  );
}

function StylePage() {
  return (
    <article className="dc-style">
      <h2>{STYLE_GUIDE.title}</h2>
      {STYLE_GUIDE.sections.map((s, i) => (
        <section key={i} className="dc-style__section">
          <h3>{s.heading}</h3>
          <p>{s.body}</p>
        </section>
      ))}
      <p className="dc-style__note">
        ⤷ section 4.2 is why the cursor is a string, not null. re-read the predecessor
        review thread — Marcus cites this section by name.
      </p>
    </article>
  );
}

function TeamPage() {
  return (
    <article className="dc-team">
      <h2>meet the team</h2>
      <div className="dc-team__grid">
        {TEAM_PROFILES.map((p, i) => (
          <div key={i} className="dc-team__card">
            <div className="dc-team__emoji">{p.emoji}</div>
            <div className="dc-team__name">{p.name}</div>
            <div className="dc-team__role">{p.role}</div>
            <div className="dc-team__personality">{p.personality}</div>
          </div>
        ))}
      </div>
      <p className="dc-team__note">
        you'll see these names in slack before you see them in person. the personas
        aren't flavor — they change how the manager replies to you.
      </p>
    </article>
  );
}