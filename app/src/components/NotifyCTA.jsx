import { useEffect, useRef, useState } from "react";

/**
 * NotifyCTA — inline "notify me" form for blog posts.
 *
 * Fires the same open-modal custom event the landing Final band uses,
 * but tags the source as "blog-post-<slug>" so the EmailModal success
 * message can say "we'll email you when a new post goes live" instead
 * of "when a new cohort opens".
 *
 * The EmailModal renders once (in App.jsx) and listens for the
 * `open-modal` click — this component just dispatches the event.
 */

export default function NotifyCTA({ source = "notify-cta", cta = "notify me" }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!submitted && inputRef.current) inputRef.current.focus();
  }, [submitted]);

  function handleSubmit(e) {
    e.preventDefault();
    const clean = email.trim();
    if (!clean || !clean.includes("@")) return;
    document.dispatchEvent(
      new CustomEvent("open-modal", { detail: { source } })
    );
    setSubmitted(true);
    setEmail("");
  }

  if (submitted) {
    return (
      <div
        style={{
          fontFamily: "var(--mono)",
          fontSize: 13,
          color: "var(--ok)",
          padding: "14px 0 0",
          borderTop: "1px dashed var(--line)",
          marginTop: 18,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span aria-hidden="true">●</span>
        <span>you're on the list — we'll ping you when there's something new.</span>
      </div>
    );
  }

  return (
    <div
      style={{
        border: "1px solid var(--line)",
        borderTop: "3px solid var(--ok)",
        padding: "18px 20px",
        borderRadius: 4,
        background: "var(--paper-2)",
        marginTop: 32,
      }}
    >
      <span
        style={{
          fontFamily: "var(--mono)",
          fontSize: 12,
          color: "var(--muted)",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
        }}
      >
        $ dreamclerk --notify
      </span>
      <p
        style={{
          margin: "8px 0 12px",
          fontSize: 14,
          color: "var(--muted)",
          lineHeight: 1.55,
        }}
      >
        liked what you read? we'll notify you when we publish a new post — no spam, one-click unsubscribe.
      </p>
      <form
        onSubmit={handleSubmit}
        noValidate
        style={{
          display: "flex",
          gap: 8,
          alignItems: "stretch",
          flexWrap: "wrap",
        }}
      >
        <input
          ref={inputRef}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          autoComplete="email"
          style={{
            fontFamily: "var(--mono)",
            fontSize: 14,
            padding: "10px 12px",
            border: "1px solid var(--line)",
            background: "var(--paper)",
            color: "var(--ink)",
            borderRadius: 3,
            flex: "1 1 220px",
            minWidth: 160,
          }}
        />
        <button
          type="submit"
          disabled={!email.trim() || !email.includes("@")}
          style={{
            fontFamily: "var(--mono)",
            fontSize: 13,
            padding: "10px 16px",
            border: "1px solid var(--ink)",
            background: !email.trim() || !email.includes("@") ? "var(--paper-2)" : "var(--ink)",
            color: !email.trim() || !email.includes("@") ? "var(--muted)" : "var(--paper)",
            borderRadius: 3,
            letterSpacing: "0.04em",
            textTransform: "lowercase",
            cursor: !email.trim() || !email.includes("@") ? "not-allowed" : "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          {cta} <span aria-hidden="true">→</span>
        </button>
      </form>
    </div>
  );
}