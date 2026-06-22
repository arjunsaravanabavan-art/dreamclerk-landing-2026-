import { useEffect, useState } from "react";
import SectionLabel from "./SectionLabel.jsx";
import { RouterLink } from "../lib/router.jsx";
import { submitFeedback } from "../lib/supabase.js";

/**
 * Contact — /contact
 * Static directory of how to reach the team. Three lanes:
 *   - email    (info@ for general, dpo@ for privacy, etc.)
 *   - linkedin (company page)
 *   - instagram (@dreamclrk)
 * Each lane is a card with a $ command label, a one-line description,
 * the contact handle, and a primary CTA.
 */

const CATEGORIES = [
  { id: "bug", label: "bug — something broke" },
  { id: "content", label: "content — wrong, unclear, or stale" },
  { id: "idea", label: "idea — feature you want" },
  { id: "story", label: "story — something you want to share" },
  { id: "other", label: "other" },
];

const LANES = [
  {
    id: "email",
    section: "$ mail --to info@dreamclerk.com",
    title: "email us.",
    desc: "for everything that doesn't have its own inbox — questions, ideas, partnership pitches, things you wish we'd written about.",
    handle: "info@dreamclerk.com",
    href: "mailto:info@dreamclerk.com?subject=hi%20dreamclerk",
    cta: "open mail client",
    note: "we read every message. reply within 2 business days.",
  },
  {
    id: "linkedin",
    section: "$ open linkedin.com/company/dreamclerk",
    title: "find us on linkedin.",
    desc: "hiring partners, recruiters, alumni, and the rest of the team's day-to-day updates. follow for cohort openings, hiring-partner announcements, and the occasional hot take.",
    handle: "linkedin.com/company/dreamclerk",
    href: "https://www.linkedin.com/company/dreamclerk",
    cta: "open linkedin ↗",
    external: true,
    note: "best place to tag us if you're a cohort graduate.",
  },
  {
    id: "instagram",
    section: "$ open instagram.com/dreamclrk",
    title: "follow @dreamclrk.",
    desc: "cohort announcements, behind-the-scenes from the workspace, the rare meme. we post about 2x a week and stories when a cohort opens.",
    handle: "@dreamclrk",
    href: "https://www.instagram.com/dreamclrk",
    cta: "open instagram ↗",
    external: true,
    note: "the fastest way to hear about a cohort opening.",
  },
];

export default function ContactPage() {
  const [fbCategory, setFbCategory] = useState("idea");
  const [fbEmail, setFbEmail] = useState("");
  const [fbMessage, setFbMessage] = useState("");
  const [fbStatus, setFbStatus] = useState("idle"); // idle | loading | success | error
  const [fbError, setFbError] = useState("");
  const [fbSubmitted, setFbSubmitted] = useState(null);

  useEffect(() => { document.title = "contact — dreamclerk"; }, []);

  async function handleFeedbackSubmit(e) {
    e.preventDefault();
    if (fbStatus === "loading") return;
    setFbStatus("loading");
    setFbError("");
    const result = await submitFeedback({
      email: fbEmail,
      category: fbCategory,
      message: fbMessage,
      source: "contact-page",
    });
    if (result.ok) {
      setFbSubmitted({ category: fbCategory, message: fbMessage, email: fbEmail });
      setFbStatus("success");
      setFbMessage("");
    } else {
      setFbError(result.error || "Something went wrong.");
      setFbStatus("error");
    }
  }

  return (
    <section className="section legal" id="contact">
      <div className="wrap legal__wrap">
        <SectionLabel status="ok">$ cat /contact.md</SectionLabel>

        <h1 className="legal__title">contact.</h1>
        <p className="legal__meta">three lanes · no ticket forms · no chatbots</p>

        <p className="legal__lede">
          we are a small team. we read every message ourselves. pick the lane that fits.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 18,
            margin: "32px 0 40px",
          }}
        >
          {LANES.map((l) => (
            <article
              key={l.id}
              style={{
                border: "1px solid var(--line)",
                borderTop: "3px solid var(--ok)",
                padding: "22px 22px 20px",
                borderRadius: 4,
                background: "var(--paper)",
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              <span
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: 12,
                  color: "var(--muted)",
                  letterSpacing: "0.04em",
                }}
              >
                {l.section}
              </span>
              <h3
                style={{
                  margin: 0,
                  fontSize: 22,
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                }}
              >
                {l.title}
              </h3>
              <p
                style={{
                  margin: 0,
                  color: "var(--muted)",
                  fontSize: 14,
                  lineHeight: 1.55,
                }}
              >
                {l.desc}
              </p>
              <div
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: 13,
                  color: "var(--ink)",
                  padding: "8px 0",
                  borderTop: "1px dashed var(--line)",
                  borderBottom: "1px dashed var(--line)",
                }}
              >
                {l.handle}
              </div>
              <a
                href={l.href}
                target={l.external ? "_blank" : undefined}
                rel={l.external ? "noreferrer noopener" : undefined}
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: 13,
                  padding: "10px 14px",
                  border: "1px solid var(--ink)",
                  background: "var(--ink)",
                  color: "var(--paper)",
                  borderRadius: 3,
                  letterSpacing: "0.04em",
                  textTransform: "lowercase",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  alignSelf: "flex-start",
                  gap: 8,
                }}
              >
                {l.cta}
              </a>
              <p
                style={{
                  margin: 0,
                  fontFamily: "var(--mono)",
                  fontSize: 11,
                  color: "var(--muted-2)",
                  letterSpacing: "0.04em",
                }}
              >
                {l.note}
              </p>
            </article>
          ))}
        </div>

        {/* Feedback section — moved from the old /feedback page so users only
            have one contact surface instead of two. Same submitFeedback() call,
            same Supabase `feedback` table. */}
        <h2 id="feedback" className="contact__h2">$ feedback</h2>
        <p className="contact__h2-meta">
          anonymous by default · email optional · we read every message
        </p>
        <p className="legal__lede">
          something broke? a blog post is wrong? you have an idea? tell us. if you leave your email we can write back. if you don't, that's fine — we still see it.
        </p>

        {fbStatus === "success" && fbSubmitted ? (
          <div
            style={{
              border: "1px solid var(--line)",
              borderLeft: "3px solid var(--ok)",
              padding: "20px 22px",
              borderRadius: 4,
              margin: "24px 0",
              background: "var(--paper-2)",
              maxWidth: 640,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <span style={{ color: "var(--ok)", fontFamily: "var(--mono)", fontSize: 13 }}>●</span>
              <strong style={{ fontFamily: "var(--mono)", fontSize: 13, letterSpacing: "0.04em", textTransform: "lowercase" }}>
                got it. logged.
              </strong>
            </div>
            <p style={{ margin: "0 0 10px", color: "var(--muted)", fontSize: 14, lineHeight: 1.55 }}>
              thanks for the {fbSubmitted.category} note.{" "}
              {fbSubmitted.email
                ? <>we will email you at <code>{fbSubmitted.email}</code> if we have a follow-up.</>
                : <>you didn't leave an email, so this is a one-way ping — that's fine.</>}
            </p>
            <div style={{ display: "flex", gap: 14, marginTop: 14, fontFamily: "var(--mono)", fontSize: 12, flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={() => { setFbStatus("idle"); setFbSubmitted(null); }}
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: 12,
                  padding: "8px 14px",
                  border: "1px solid var(--ink)",
                  background: "var(--ink)",
                  color: "var(--paper)",
                  borderRadius: 3,
                  letterSpacing: "0.04em",
                  textTransform: "lowercase",
                  cursor: "pointer",
                }}
              >
                send another →
              </button>
              <RouterLink to="/" style={{ alignSelf: "center", color: "var(--muted)" }}>
                ← back to dreamclerk
              </RouterLink>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleFeedbackSubmit}
            noValidate
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 18,
              maxWidth: 640,
              margin: "24px 0 32px",
            }}
          >
            <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--muted)", textTransform: "lowercase", letterSpacing: "0.06em" }}>
                category
              </span>
              <select
                value={fbCategory}
                onChange={(e) => setFbCategory(e.target.value)}
                disabled={fbStatus === "loading"}
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: 14,
                  padding: "10px 12px",
                  border: "1px solid var(--line)",
                  background: "var(--paper)",
                  color: "var(--ink)",
                  borderRadius: 3,
                }}
              >
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            </label>

            <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--muted)", textTransform: "lowercase", letterSpacing: "0.06em" }}>
                email <span style={{ color: "var(--muted-2)" }}>(optional, if you want a reply)</span>
              </span>
              <input
                type="email"
                value={fbEmail}
                onChange={(e) => { setFbEmail(e.target.value); if (fbStatus === "error") setFbStatus("idle"); }}
                placeholder="you@example.com"
                disabled={fbStatus === "loading"}
                autoComplete="email"
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: 14,
                  padding: "10px 12px",
                  border: "1px solid var(--line)",
                  background: "var(--paper)",
                  color: "var(--ink)",
                  borderRadius: 3,
                }}
              />
            </label>

            <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--muted)", textTransform: "lowercase", letterSpacing: "0.06em" }}>
                message <span style={{ color: "var(--muted-2)" }}>(required)</span>
              </span>
              <textarea
                value={fbMessage}
                onChange={(e) => { setFbMessage(e.target.value); if (fbStatus === "error") setFbStatus("idle"); }}
                placeholder="what's on your mind?"
                rows={6}
                required
                disabled={fbStatus === "loading"}
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: 14,
                  lineHeight: 1.55,
                  padding: "10px 12px",
                  border: "1px solid var(--line)",
                  background: "var(--paper)",
                  color: "var(--ink)",
                  borderRadius: 3,
                  resize: "vertical",
                  minHeight: 120,
                }}
              />
              <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--muted-2)", textAlign: "right" }}>
                {fbMessage.length} / 4000
              </span>
            </label>

            {fbStatus === "error" && (
              <div
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: 12,
                  color: "var(--err)",
                  border: "1px solid var(--err)",
                  padding: "8px 12px",
                  borderRadius: 3,
                }}
              >
                {fbError}
              </div>
            )}

            <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
              <button
                type="submit"
                disabled={fbStatus === "loading" || !fbMessage.trim()}
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: 13,
                  padding: "12px 20px",
                  border: "1px solid var(--ink)",
                  background: fbStatus === "loading" || !fbMessage.trim() ? "var(--paper-2)" : "var(--ink)",
                  color: fbStatus === "loading" || !fbMessage.trim() ? "var(--muted)" : "var(--paper)",
                  borderRadius: 3,
                  letterSpacing: "0.04em",
                  textTransform: "lowercase",
                  cursor: fbStatus === "loading" || !fbMessage.trim() ? "not-allowed" : "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                {fbStatus === "loading" ? "sending…" : <>send feedback <span style={{ fontSize: 16 }}>→</span></>}
              </button>
              <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--muted-2)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                no spam · never shared
              </span>
            </div>
          </form>
        )}

        <p className="legal__back">
          <RouterLink to="/">← back to dreamclerk</RouterLink>
        </p>
      </div>
    </section>
  );
}