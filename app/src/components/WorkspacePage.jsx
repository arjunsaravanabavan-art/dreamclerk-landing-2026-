import { useEffect, useState } from "react";
import SectionLabel from "./SectionLabel.jsx";
import { IconCode, IconTerminal, IconFile, IconNode, IconCheck, IconPadlock, IconRocket, IconStar, ArrowRight, IconBrush, IconScale, IconTrend } from "./Svg.jsx";
import { tracks } from "../lib/trackData.js";
import { useSEO, SEO } from "../lib/seo.js";

/**
 * WorkspacePage V4 — track-filtered, 24 unique mock surfaces.
 * 8 categories × 3 gigs. Outer chrome shared; main panel changes per track kind:
 *   code (backend/frontend/ai-ml/data/platform/security) → code IDE
 *   canvas (design-ux) → figma-style canvas / tokens / crit
 *   ledger (business-bba) → double-entry ledger / tds / funnel
 * Keyboard: ↑↓ switch track, ←→ flip gig.
 */

const GI = {
  code: IconCode, terminal: IconTerminal, node: IconNode, file: IconFile,
  check: IconCheck, rocket: IconRocket, star: IconStar, padlock: IconPadlock,
  brush: IconBrush, scale: IconScale, trend: IconTrend,
};
function GIcon({ name }) {
  const Icon = GI[name] || IconCode;
  return <Icon width={20} height={20} color="var(--ok)" />;
}

// ─── Surfaces (per-track-kind) ──────────────────────────────────────────────
function CodeSurface({ gig }) {
  return (
    <div className="ws4__ide-main">
      <div className="ws4__ide-tabs" role="tablist">
        {gig.files.map((f, i) => (
          <button key={i} className={`ws4__ide-tab ${i === 0 ? "is-active" : ""}`}>{f.name}</button>
        ))}
      </div>
      <pre className="ws4__ide-code"><code>{gig.files[0].code}</code></pre>
    </div>
  );
}

function CanvasSurface({ gig }) {
  const s = gig.surface;
  return (
    <div className="ws4__canvas">
      <div className="ws4__canvas-frame">
        {s.layers.map((l, i) => (
          <div
            key={i}
            className={`ws4__canvas-layer ${l.name.startsWith("text ") ? "is-text" : ""}`}
            style={{ left: l.x, top: l.y, width: l.w, height: l.h, background: l.color }}
          >
            {l.name.startsWith("text ") ? l.name.replace("text · ", "") : ""}
          </div>
        ))}
        {s.comments.map((c, i) => (
          <div key={i} className="ws4__canvas-comment" style={{ left: c.x, top: c.y }}>
            <span className="ws4__canvas-comment-n">[{String(i + 1).padStart(2, "0")}]</span>
            <span className="ws4__canvas-comment-txt">{c.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TokensSurface({ gig }) {
  const s = gig.surface;
  return (
    <div className="ws4__tokens">
      {s.groups.map((g) => (
        <div key={g.name} className="ws4__tokens-group">
          <h4 className="ws4__tokens-h">{g.name}</h4>
          <table className="ws4__tokens-table">
            <tbody>
              {g.tokens.map((t, i) => (
                <tr key={i}>
                  <td><code>{t.k}</code></td>
                  <td><code>{t.v}</code></td>
                  <td className="ws4__tokens-note">{t.note}</td>
                  {g.name === "color" && <td><div className="ws4__tokens-swatch" style={{ background: t.v }} /></td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

function CritSurface({ gig }) {
  const s = gig.surface;
  return (
    <div className="ws4__crit">
      {s.items.map((it) => (
        <div key={it.n} className={`ws4__crit-row ws4__crit-row--${it.verdict}`}>
          <span className="ws4__crit-n">[{it.n}]</span>
          <div className="ws4__crit-body">
            <div className="ws4__crit-who">{it.who}</div>
            <div className="ws4__crit-note">{it.note}</div>
          </div>
          <span className={`ws4__crit-verdict ws4__crit-verdict--${it.verdict}`}>{it.verdict}</span>
        </div>
      ))}
    </div>
  );
}

function LedgerTable({ rows, columns }) {
  return (
    <div className="ws4__ledger">
      <table className="ws4__ledger-table">
        <thead>
          <tr>{columns.map((c) => <th key={c}>{c}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              {columns.map((c) => <td key={c} className={`ws4__ledger-${c}`}>{r[c.toLowerCase().replace(/\s/g, "_")] || r[c] || ""}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function FunnelSurface({ gig }) {
  const s = gig.surface;
  const max = Math.max(...s.stages.map((x) => x.v));
  return (
    <div className="ws4__funnel">
      {s.stages.map((st, i) => {
        const pct = (st.v / max) * 100;
        return (
          <div key={i} className="ws4__funnel-row">
            <div className="ws4__funnel-label">
              <span className="ws4__funnel-n">[{String(i + 1).padStart(2, "0")}]</span>
              <span className="ws4__funnel-name">{st.n}</span>
            </div>
            <div className="ws4__funnel-bar-wrap">
              <div className="ws4__funnel-bar" style={{ width: `${pct}%` }} />
              <span className="ws4__funnel-v">{st.v.toLocaleString("en-IN")}</span>
            </div>
            <div className="ws4__funnel-meta">
              <span>{st.cost}</span>
              <span>cac {st.cac}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function renderSurface(gig) {
  if (!gig.surface) return <CodeSurface gig={gig} />;
  switch (gig.surface.kind) {
    case "canvas": return <CanvasSurface gig={gig} />;
    case "tokens": return <TokensSurface gig={gig} />;
    case "crit":   return <CritSurface gig={gig} />;
    case "ledger": return <LedgerTable rows={gig.surface.rows} columns={["date", "voucher", "dr (debit)", "cr (credit)", "amount", "note"]} />;
    case "tds":    return <LedgerTable rows={gig.surface.rows} columns={["ch", "tan", "amount", "bsr", "date", "status", "ref"]} />;
    case "funnel": return <FunnelSurface gig={gig} />;
    default:       return <CodeSurface gig={gig} />;
  }
}

// ─── Page ───────────────────────────────────────────────────────────────────
export default function WorkspacePage() {
  const [activeTrack, setActiveTrack] = useState(0);
  const [activeGig, setActiveGig] = useState(0);
  useEffect(() => { document.title = "workspace — dreamclerk"; }, []);
  useSEO(SEO.workspace);
  useEffect(() => { setActiveGig(0); }, [activeTrack]);

  const track = tracks[activeTrack];
  const gig = track.gigs[activeGig];

  useEffect(() => {
    const onKey = (e) => {
      if (e.target?.tagName === "INPUT" || e.target?.tagName === "TEXTAREA") return;
      if (e.key === "ArrowLeft")  setActiveGig((a) => Math.max(0, a - 1));
      if (e.key === "ArrowRight") setActiveGig((a) => Math.min(track.gigs.length - 1, a + 1));
      if (e.key === "ArrowUp")    setActiveTrack((t) => Math.max(0, t - 1));
      if (e.key === "ArrowDown")  setActiveTrack((t) => Math.min(tracks.length - 1, t + 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [track]);

  return (
    <section className="section ws4" id="workspace">
      <div className="wrap ws4__wrap">
        <SectionLabel status="ok">$ workspace --gig</SectionLabel>

        <header className="ws4__head">
          <h1 className="ws4__h1">workspace. <span className="ws4__h1-mark">v4.0</span></h1>
          <p className="ws4__sub">8 tracks · 24 gigs · pick your track, flip through the gigs. ↑↓ to switch track, ←→ to flip gig.</p>
        </header>

        <nav className="ws4__tracks" aria-label="track picker">
          {tracks.map((t, i) => (
            <button
              key={t.code}
              className={`ws4__track ${activeTrack === i ? "is-active" : ""}`}
              style={{ "--track-color": t.color }}
              onClick={() => setActiveTrack(i)}
            >
              <span className="ws4__track-code">[{t.code}]</span>
              <span className="ws4__track-name">{t.name}</span>
              <span className="ws4__track-count">{t.gigs.length}</span>
            </button>
          ))}
        </nav>

        <div className="ws4__gigs" role="tablist" aria-label={`${track.name} gigs`}>
          {track.gigs.map((g, i) => (
            <button
              key={g.id}
              role="tab"
              aria-selected={activeGig === i}
              className={`ws4__gig ${activeGig === i ? "is-active" : ""}`}
              onClick={() => setActiveGig(i)}
            >
              <span className="ws4__gig-n">[{g.n}]</span>
              <span className="ws4__gig-icon"><GIcon name={g.icon} /></span>
              <span className="ws4__gig-name">{g.name}</span>
              <span className={`ws4__gig-kind ws4__gig-kind--${track.kind}`}>{track.kind}</span>
            </button>
          ))}
        </div>

        <article className="ws4__ide" key={gig.id} style={{ "--track-color": track.color }} aria-label={`Mock surface for ${gig.name}`}>
          <div className="ws4__ide-titlebar">
            <div className="ws4__ide-dots"><span /><span /><span /></div>
            <div className="ws4__ide-path">
              dreamclerk/{track.code.toLowerCase()}/{gig.id}/ — {gig.name.toLowerCase().replace(/\s+/g, "-")}
            </div>
            <div className="ws4__ide-status">● {gig.status}</div>
          </div>

          <div className="ws4__ide-body">
            {track.kind === "code" ? (
              <>
                <aside className="ws4__ide-sidebar">
                  <div className="ws4__ide-side-section">
                    <div className="ws4__ide-side-h">$ files</div>
                    {gig.files?.map((f, i) => (
                      <button key={i} className={`ws4__ide-side-row ${i === 0 ? "is-active" : ""}`}>
                        <span className="ws4__ide-side-icon">▸</span><span>{f.name}</span>
                      </button>
                    ))}
                  </div>
                  <div className="ws4__ide-side-section">
                    <div className="ws4__ide-side-h">$ run</div>
                    <code className="ws4__ide-side-cmd">{gig.cmd}</code>
                  </div>
                </aside>
                {renderSurface(gig)}
                <div className="ws4__ide-term">
                  <div className="ws4__ide-term-head">
                    <span className="ws4__ide-term-h">$ terminal</span>
                    <span className="ws4__ide-term-status">● running</span>
                  </div>
                  <pre className="ws4__ide-term-body"><code>{gig.terminal}</code></pre>
                </div>
              </>
            ) : (
              <div className="ws4__ide-full">
                <div className="ws4__ide-full-head">
                  <span className="ws4__ide-side-h">$ {gig.surface?.title || gig.name}</span>
                  <code className="ws4__ide-side-cmd" style={{ background: "transparent", border: 0, padding: 0 }}>{gig.cmd}</code>
                </div>
                <div className="ws4__ide-full-body">
                  {renderSurface(gig)}
                </div>
                <div className="ws4__ide-term">
                  <div className="ws4__ide-term-head">
                    <span className="ws4__ide-term-h">$ output</span>
                    <span className="ws4__ide-term-status">● done</span>
                  </div>
                  <pre className="ws4__ide-term-body"><code>{gig.terminal}</code></pre>
                </div>
              </div>
            )}
          </div>

          <div className="ws4__ide-statusbar">
            <span>{track.code.toLowerCase()}/{gig.id}</span>
            <span>● {gig.status}</span>
            <span className="ws4__ide-statusbar-r">★ {track.kind === "code" ? "ship ready" : track.kind === "canvas" ? "design ready" : "balanced"}</span>
          </div>
        </article>

        <div className="ws4__meta">
          <div className="ws4__meta-text">
            <span className="ws4__meta-n">[{gig.n}]</span>
            <h2 className="ws4__meta-name">{gig.name}</h2>
            <p className="ws4__meta-blurb">{gig.blurb}</p>
            <code className="ws4__meta-cmd">$ install {gig.cmd}</code>
          </div>

          <nav className="ws4__nav" aria-label="gig navigation">
            <button
              className="ws4__nav-prev"
              disabled={activeGig === 0}
              onClick={() => setActiveGig((a) => Math.max(0, a - 1))}
            >
              <ArrowRight width={16} height={16} color="var(--muted)" className="ws4__nav-arr ws4__nav-arr--left" />
              <span className="ws4__nav-prev-text">
                <span className="ws4__nav-prev-l">prev</span>
                <span className="ws4__nav-prev-n">{activeGig > 0 ? track.gigs[activeGig - 1].name : "—"}</span>
              </span>
            </button>
            <span className="ws4__nav-pos">
              {String(activeGig + 1).padStart(2, "0")} / {String(track.gigs.length).padStart(2, "0")}
            </span>
            <button
              className="ws4__nav-next"
              disabled={activeGig === track.gigs.length - 1}
              onClick={() => setActiveGig((a) => Math.min(track.gigs.length - 1, a + 1))}
            >
              <span className="ws4__nav-next-text">
                <span className="ws4__nav-next-l">next</span>
                <span className="ws4__nav-next-n">{activeGig < track.gigs.length - 1 ? track.gigs[activeGig + 1].name : "—"}</span>
              </span>
              <ArrowRight width={16} height={16} color="var(--ok)" />
            </button>
          </nav>
        </div>

        <div className="ws4__cta">
          <a className="btn btn--solid" href="#" data-open-modal data-open-source="workspace-cta">
            try a sample workspace <span className="arr" aria-hidden="true">→</span>
          </a>
          <p className="ws4__cta-note">free during 2026-q2 beta · 1,847 in queue</p>
        </div>

        <p className="legal__back">
          <a href="/">← back to dreamclerk</a>
        </p>
      </div>
    </section>
  );
}
