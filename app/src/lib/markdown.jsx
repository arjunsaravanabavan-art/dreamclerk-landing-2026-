// Tiny safe markdown renderer — paragraphs, h2/h3, lists, blockquote, code, hr, links.
// Deliberately small (no dep). Kept consistent with the landing-page voice.

import React from "react";

// h2/h3 elements get an id (slugified text) so the in-page TOC can deep-link to them.
function slugifyHeading(s) {
  return String(s || "")
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function renderInline(text) {
  const parts = [];
  let buf = "";
  let i = 0;
  const pushBuf = () => { if (buf) { parts.push(buf); buf = ""; } };
  while (i < text.length) {
    const ch = text[i];
    if (ch === "`") {
      pushBuf();
      const end = text.indexOf("`", i + 1);
      if (end < 0) { buf += ch; i += 1; continue; }
      parts.push({ t: "code", v: text.slice(i + 1, end) });
      i = end + 1;
    } else if (ch === "[" && text[i + 1] !== undefined) {
      const closeBracket = text.indexOf("]", i);
      if (closeBracket > i && text[closeBracket + 1] === "(") {
        const closeParen = text.indexOf(")", closeBracket + 2);
        if (closeParen > closeBracket) {
          const label = text.slice(i + 1, closeBracket);
          const url = text.slice(closeBracket + 2, closeParen);
          pushBuf();
          parts.push({ t: "link", label, url });
          i = closeParen + 1;
          continue;
        }
      }
      buf += ch; i += 1;
    } else if (ch === "*" && text[i + 1] === "*") {
      const end = text.indexOf("**", i + 2);
      if (end > i) {
        pushBuf();
        parts.push({ t: "bold", v: text.slice(i + 2, end) });
        i = end + 2;
        continue;
      }
      buf += ch; i += 1;
    } else if (ch === "*") {
      const end = text.indexOf("*", i + 1);
      if (end > i) {
        pushBuf();
        parts.push({ t: "italic", v: text.slice(i + 1, end) });
        i = end + 1;
        continue;
      }
      buf += ch; i += 1;
    } else {
      buf += ch; i += 1;
    }
  }
  pushBuf();
  return parts.map((p, ix) => {
    if (typeof p === "string") return <span key={ix}>{p}</span>;
    if (p.t === "code")   return <code key={ix}>{p.v}</code>;
    if (p.t === "link")   return <a key={ix} href={p.url} target={p.url.startsWith("http") ? "_blank" : undefined} rel="noreferrer">{p.label}</a>;
    if (p.t === "bold")   return <b key={ix}>{p.v}</b>;
    if (p.t === "italic") return <i key={ix}>{p.v}</i>;
    return null;
  });
}

export function renderMarkdown(md) {
  if (!md) return null;
  const lines = md.split(/\r?\n/);
  const out = [];
  let i = 0;
  while (i < lines.length) {
    const ln = lines[i];
    if (ln.startsWith("```")) {
      const lang = ln.slice(3).trim();
      const code = [];
      i += 1;
      while (i < lines.length && !lines[i].startsWith("```")) {
        code.push(lines[i]); i += 1;
      }
      i += 1;
      out.push(<pre key={out.length} className="md__pre"><code data-lang={lang || undefined}>{code.join("\n")}</code></pre>);
      continue;
    }
    if (/^##\s+/.test(ln)) {
      const t = ln.replace(/^##\s+/, "");
      out.push(<h2 key={out.length} id={slugifyHeading(t)}>{renderInline(t)}</h2>);
      i += 1; continue;
    }
    if (/^###\s+/.test(ln)) {
      const t = ln.replace(/^###\s+/, "");
      out.push(<h3 key={out.length} id={slugifyHeading(t)}>{renderInline(t)}</h3>);
      i += 1; continue;
    }
    if (ln.trim() === "---") { out.push(<hr key={out.length} className="md__hr" />); i += 1; continue; }
    if (ln.trim() === "") { i += 1; continue; }
    if (/^\s*[-*]\s+/.test(ln)) {
      const items = [];
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) { items.push(lines[i].replace(/^\s*[-*]\s+/, "")); i += 1; }
      out.push(<ul key={out.length} className="md__ul">{items.map((t, ix) => <li key={ix}>{renderInline(t)}</li>)}</ul>);
      continue;
    }
    if (/^\s*\d+\.\s+/.test(ln)) {
      const items = [];
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) { items.push(lines[i].replace(/^\s*\d+\.\s+/, "")); i += 1; }
      out.push(<ol key={out.length} className="md__ol">{items.map((t, ix) => <li key={ix}>{renderInline(t)}</li>)}</ol>);
      continue;
    }
    if (/^>\s+/.test(ln)) {
      const items = [];
      while (i < lines.length && /^>\s+/.test(lines[i])) { items.push(lines[i].replace(/^>\s+/, "")); i += 1; }
      out.push(<blockquote key={out.length} className="md__bq">{items.map((t, ix) => <p key={ix}>{renderInline(t)}</p>)}</blockquote>);
      continue;
    }
    const para = [];
    while (i < lines.length && lines[i].trim() !== "" && !/^(##|###|>|\s*[-*]\s|\s*\d+\.\s|```|---)/.test(lines[i])) {
      para.push(lines[i]); i += 1;
    }
    out.push(<p key={out.length} className="md__p">{renderInline(para.join(" "))}</p>);
  }
  return out;
}

// slugify a string for post slugs
export function slugify(s) {
  return String(s || "").toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}
