import { useEffect, useState } from "react";
import SectionLabel from "./SectionLabel.jsx";
import { RouterLink } from "../lib/router.jsx";
import { submitFeedback } from "../lib/supabase.js";

const CATEGORIES = [
  { id: "bug", label: "bug — something broke" },
  { id: "content", label: "content — wrong, unclear, or stale" },
  { id: "idea", label: "idea — feature you want" },
  { id: "story", label: "story — something you want to share" },
  { id: "other", label: "other" },
];

/**
 * Feedback — /feedback
 * Anonymous-by-default form for bug reports, content corrections, ideas,
 * and stories. Posts to public.feedback (schema-feedback.sql). Email is
 * optional; category required; message required (≤4 KB).
 */
export default function FeedbackPage() {
  const [category, setCategory] = useState("idea");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(null); // { category, message, email }

  useEffect(() => {
    document.title = "feedback — dreamclerk";
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (status === "loading") return;
    setStatus("loading");
    setError("");
    const result = await submitFeedback({
      email,
      category,
      message,
      source: "feedback-page",
    });
    if (result.ok) {
      setSubmitted({ category, message, email });
      setStatus("success");
      setMessage("");
    } else {
      setError(result.error || "Something went wrong.");
      setStatus("error");
    }
  }

  return (
    <section className="section legal" id="feedback">
      <div className="wrap legal__wrap">
        <SectionLabel status="ok">$ cat /feedback.md</SectionLabel>

        <h1 className="legal__title">feedback.</h1>
        <p className="legal__meta">anonymous by default · email optional · we read every message</p>

        <p className="legal__lede">
          something broke? a blog post is wrong? you have an idea? tell us. if you leave your email we can write back. if you don't, that's fine — we still see it.
        </p>

        {status === "success" && submitted ? (
          <div
            style={{
              border: "1px solid var(--line)",
              borderLeft: "3px solid var(--ok)",
              padding: "20px 22px",
              borderRadius: 4,
              margin: "24px 0",
              background: "var(--paper-2)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <span style={{ color: "var(--ok)", fontFamily: "var(--mono)", fontSize: 13 }}>●</span>
              <strong style={{ fontFamily: "var(--mono)", fontSize: 13, letterSpacing: "0.04em", textTransform: "lowercase" }}>
                got it. logged.
              </strong>
            </div>
            <p style={{ margin: "0 0 10px", color: "var(--muted)", fontSize: 14, lineHeight: 1.55 }}>
              thanks for the {submitted.category} note.{" "}
              {submitted.email
                ? <>we will email you at <code>{submitted.email}</code> if we have a follow-up.</>
                : <>you didn't leave an email, so this is a one-way ping — that's fine.</>}
            </p>
            <div style={{ display: "flex", gap: 14, marginTop: 14, fontFamily: "var(--mono)", fontSize: 12 }}>
              <button
                type="button"
                onClick={() => { setStatus("idle"); setSubmitted(null); }}
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
            onSubmit={handleSubmit}
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
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                disabled={status === "loading"}
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
                value={email}
                onChange={(e) => { setEmail(e.target.value); if (status === "error") setStatus("idle"); }}
                placeholder="you@example.com"
                disabled={status === "loading"}
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
                value={message}
                onChange={(e) => { setMessage(e.target.value); if (status === "error") setStatus("idle"); }}
                placeholder="what's on your mind?"
                rows={6}
                required
                disabled={status === "loading"}
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
                {message.length} / 4000
              </span>
            </label>

            {status === "error" && (
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
                {error}
              </div>
            )}

            <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
              <button
                type="submit"
                disabled={status === "loading" || !message.trim()}
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: 13,
                  padding: "12px 20px",
                  border: "1px solid var(--ink)",
                  background: status === "loading" || !message.trim() ? "var(--paper-2)" : "var(--ink)",
                  color: status === "loading" || !message.trim() ? "var(--muted)" : "var(--paper)",
                  borderRadius: 3,
                  letterSpacing: "0.04em",
                  textTransform: "lowercase",
                  cursor: status === "loading" || !message.trim() ? "not-allowed" : "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                {status === "loading" ? "sending…" : <>send feedback <span style={{ fontSize: 16 }}>→</span></>}
              </button>
              <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--muted-2)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                no spam · never shared
              </span>
            </div>
          </form>
        )}

        <h2>$ other ways to reach us</h2>
        <p>
          if it's urgent or you'd rather not use the form: <a href="mailto:info@dreamclerk.com">info@dreamclerk.com</a>.
          for press, see the <RouterLink to="/about">about page</RouterLink>. for security disclosures, see the <RouterLink to="/privacy">privacy page</RouterLink>.
        </p>

        <p className="legal__back">
          <RouterLink to="/">← back to dreamclerk</RouterLink>
        </p>
      </div>
    </section>
  );
}