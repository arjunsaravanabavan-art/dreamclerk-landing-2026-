// ─── Jargon — inline term highlighter for project vocabulary ────────────
//
// Per the Knowledge Layer .md: terms in the workspace get highlighted on
// first render. Hovering shows a short definition. The component is a
// controlled wrapper that walks a string and replaces matches with a
// <span class="dc-jargon" data-term> element. CSS handles the underline
// and the popup.
//
// Use:
//   <Jargon text="..." />
//   <Jargon text="..." filter={["cursor", "JWT"]} />   // limit to a subset
//
// Limitations: naive word-boundary match. Phrases ("soft delete") would
// need a more sophisticated tokenizer; we use single tokens for now.

import { useState } from "react";
import { NEXARA_JARGON, JARGON_BY_TERM } from "../../data/jargon.js";

// Build a single regex from a list of terms. The longest-first sort
// ensures "soft-delete" matches before "soft".
function buildRegex(terms) {
  const sorted = [...terms].sort((a, b) => b.length - a.length);
  const escaped = sorted.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  return new RegExp(`\\b(${escaped.join("|")})\\b`, "g");
}

export default function Jargon({ text, filter }) {
  const [hovered, setHovered] = useState(null); // term currently being hovered
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  const dict = filter ? NEXARA_JARGON.filter((j) => filter.includes(j.term)) : NEXARA_JARGON;
  const terms = dict.map((j) => j.term);
  if (terms.length === 0) return <>{text}</>;

  const re = buildRegex(terms);
  const out = [];
  let last = 0;
  let m;
  let i = 0;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) out.push(<span key={`t${i++}`}>{text.slice(last, m.index)}</span>);
    const term = m[0];
    const entry = JARGON_BY_TERM[term.toLowerCase()];
    out.push(
      <span
        key={`j${i++}`}
        className="dc-jargon"
        data-term={term}
        onMouseEnter={(e) => { setHovered(entry); setMouse({ x: e.clientX, y: e.clientY }); }}
        onMouseMove={(e) => setMouse({ x: e.clientX, y: e.clientY })}
        onMouseLeave={() => setHovered(null)}
      >
        {term}
      </span>
    );
    last = m.index + term.length;
  }
  if (last < text.length) out.push(<span key={`t${i++}`}>{text.slice(last)}</span>);

  return (
    <>
      {out}
      {hovered && (
        <div
          className="dc-jargon__popup"
          style={{ left: mouse.x, top: mouse.y }}
          role="tooltip"
        >
          <div className="dc-jargon__popup-term">
            {hovered.term} <span className="dc-jargon__popup-cat">· {hovered.category}</span>
          </div>
          <div className="dc-jargon__popup-short">{hovered.short}</div>
          {hovered.detail && <div className="dc-jargon__popup-detail">{hovered.detail}</div>}
          {hovered.example && <div className="dc-jargon__popup-ex"><code>{hovered.example}</code></div>}
        </div>
      )}
    </>
  );
}