import { useEffect, useRef, useState } from "react";
import { subscribeNotify, getSubscriberCount, bumpSubscriberCount } from "../lib/supabase";

export default function EmailModal({ open, onClose, source = "modal" }) {
  // Source-aware copy. Blog-post signups should say "we'll ping you when
  // a new post goes live", landing signups say "when a new cohort opens".
  // Computed once per render — source is stable while the modal is open.
  const isBlogSource = typeof source === "string" && source.startsWith("blog-post");
  const isNotifyCta = source === "notify-cta" || source === "final-band";
  const successHeadline = isBlogSource
    ? "you're on the list."
    : isNotifyCta
      ? "you're on the list."
      : "you are on the list.";
  const successBody = isBlogSource
    ? "we'll email you the moment a new post goes live. while you wait, follow @dreamclrk on instagram for the behind-the-scenes."
    : isNotifyCta
      ? "we'll email you the moment a new cohort opens. while you wait, follow @dreamclrk on instagram for the behind-the-scenes."
      : "we will email you the moment a new cohort opens. while you wait, follow @dreamclrk on instagram for the behind-the-scenes.";
  const formHeadline = isBlogSource
    ? "get notified when we publish."
    : "get notified when dreamclerk opens.";
  const formLede = isBlogSource
    ? "drop your email. we will email you the moment a new post goes live."
    : "drop your details. we will email you the moment a new cohort opens.";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [error, setError] = useState("");
  const [count, setCount] = useState(null);
  const [savedToSupabase, setSavedToSupabase] = useState(true); // false = mock/dev only
  const inputRef = useRef(null);

  // load live waitlist count on open
  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    getSubscriberCount().then((n) => {
      if (!cancelled) setCount(n);
    });
    return () => { cancelled = true; };
  }, [open]);

  // lock body scroll when open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // focus first input on open
  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 80);
      return () => clearTimeout(t);
    }
  }, [open]);

  // reset state when closed
  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => {
        setStatus("idle");
        setError("");
        setName("");
        setEmail("");
        setSavedToSupabase(true);
      }, 220);
      return () => clearTimeout(t);
    }
  }, [open]);

  // close on escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (status === "loading") return;
    const cleanName = name.trim();
    const cleanEmail = email.trim();
    if (!cleanName || !cleanEmail) {
      setStatus("error");
      setError("Please enter your name and email.");
      return;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(cleanEmail)) {
      setStatus("error");
      setError("That email looks off — please double-check it.");
      return;
    }
    setStatus("loading");
    setError("");
    const result = await subscribeNotify({ name: cleanName, email: cleanEmail, source });
    if (result.ok) {
      setStatus("success");
      setSavedToSupabase(!result.mock);
      // Bump the live counter for the next visitor — only if we actually
      // hit Supabase (mock-mode would double-count locally).
      if (!result.mock) {
        try { await bumpSubscriberCount(); } catch {}
      }
      // DO NOT auto-close — user must manually click the close button
    } else {
      setStatus("error");
      setError(result.error || "Something went wrong.");
    }
  }

  return (
    <div
      className={"modal-back" + (open ? " open" : "")}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-hidden={!open}
    >
      <div className="modal" role="document">
        <div className="modal__head">
          <span className="dot" />
          <span>● live · waitlist · {count != null ? count.toLocaleString("en-IN") + " in queue" : "joining…"}</span>
          <button
            type="button"
            className="btn modal__close"
            onClick={onClose}
            aria-label="Close"
          >
            esc ✕
          </button>
        </div>

        {status === "success" ? (
          <div className="modal__success">
            <div className="modal__head" style={{ borderBottom: 0, padding: 0, marginBottom: 14 }}>
              <span className="dot" />
              <span style={{ color: "var(--ok)" }}>● confirmed</span>
            </div>
            <h4>{successHeadline}</h4>
            <p>
              {successBody}
            </p>
            {/* visible "saved to" line — confirms the email landed in supabase */}
            <p
              style={{
                fontFamily: "var(--mono)",
                fontSize: 11,
                color: "var(--muted)",
                letterSpacing: "0.04em",
                margin: "0 0 14px",
                padding: "8px 10px",
                border: savedToSupabase ? "1px dashed var(--ok)" : "1px dashed var(--warn)",
                borderRadius: 3,
                background: savedToSupabase ? "rgba(34,197,94,0.04)" : "rgba(234,179,8,0.05)",
              }}
            >
              {savedToSupabase ? (
                <>
                  ● saved to <strong>supabase · notify_signups</strong> ({email || "—"})<br />
                  <span style={{ opacity: 0.7 }}>
                    source: {source}
                  </span>
                </>
              ) : (
                <>
                  ● <strong>dev mode</strong> — supabase env not set, email not persisted<br />
                  <span style={{ opacity: 0.7 }}>
                    configure VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY to enable.
                  </span>
                </>
              )}
            </p>
            <a
              href="https://www.instagram.com/dreamclrk"
              target="_blank"
              rel="noreferrer"
              className="btn"
              style={{ marginTop: 4, alignSelf: "flex-start" }}
            >
              follow @dreamclrk ↗
            </a>
            {/* explicit close button — the modal must NOT auto-close */}
            <button
              type="button"
              className="btn btn--solid"
              onClick={onClose}
              style={{ marginTop: 8, alignSelf: "flex-start" }}
            >
              close <span className="arr">→</span>
            </button>
            <div
              style={{
                marginTop: 12,
                fontFamily: "var(--mono)",
                fontSize: 10,
                color: "var(--muted)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              press esc · or click outside · to close
            </div>
          </div>
        ) : (
          <div className="modal__body">
            <h4 id="modal-title">{formHeadline}</h4>
            <p>{formLede}</p>

            <form className="modal__form" onSubmit={handleSubmit} noValidate>
              <input
                ref={inputRef}
                id="modal-name"
                type="text"
                placeholder="your name · aanya iyer"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (status === "error") setStatus("idle");
                }}
                disabled={status === "loading"}
                required
                autoComplete="name"
              />
              <input
                id="modal-email"
                type="email"
                placeholder="your email · you@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status === "error") setStatus("idle");
                }}
                disabled={status === "loading"}
                required
                autoComplete="email"
              />
              {status === "error" && <div className="err">{error}</div>}
              <p style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--muted)", letterSpacing: "0.04em", margin: "0 0 12px" }}>
                or just follow us —{" "}
                <a
                  href="https://www.instagram.com/dreamclrk"
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: "var(--ink)", textDecoration: "underline", textDecorationColor: "var(--ok-fill)", textUnderlineOffset: 2 }}
                >
                  @dreamclrk ↗
                </a>{" "}
                for behind-the-scenes and announcements.
              </p>
              <div className="row">
                <button
                  type="submit"
                  className="btn btn--solid"
                  disabled={status === "loading"}
                >
                  {status === "loading" ? "joining…" : <>notify me <span className="arr">→</span></>}
                </button>
              </div>
              <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                no spam · unsubscribe anytime · we never share your details
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
