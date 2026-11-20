import { useEffect, useRef, useState } from "react";
import { subscribeNotify, getSubscriberCount, bumpSubscriberCount, isValidNotifyEmail, submitFeedback } from "../lib/supabase";

function InvestorLink({ onClick }) {
  return (
    <button type="button" className="modal__investor-link" onClick={onClick}>
      <span aria-hidden="true">↗</span>
      <span><strong>are you an investor?</strong><small>share your details and connect with our founder</small></span>
      <span aria-hidden="true">→</span>
    </button>
  );
}

export function InvestorEnquiryModal({ open, onClose, onSubmitted }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [organisation, setOrganisation] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  useEffect(() => {
    if (!open) return;
    const onKey = (event) => { if (event.key === "Escape") onClose?.(); };
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open, onClose]);
  if (!open) return null;
  const sendEnquiry = async (event) => {
    event.preventDefault();
    if (saving) return;
    setSaving(true);
    setSaveError("");
    const details = `Name: ${name.trim()}\\nOrganisation: ${organisation.trim() || "Not provided"}\\n\\nInvestor message:\\n${message.trim() || "No message provided"}`;
    const result = await submitFeedback({
      email: email.trim(),
      category: "investor-enquiry",
      message: details,
      source: "landing-investor-popup",
    });
    setSaving(false);
    if (!result.ok || result.mock) {
      setSaveError(result.error || "We couldn't save your enquiry. Please try again.");
      return;
    }
    onSubmitted?.();
    const subject = encodeURIComponent("DreamClerk investor enquiry");
    const body = encodeURIComponent(`Name: ${name.trim()}\\nEmail: ${email.trim()}\\nOrganisation: ${organisation.trim()}\\n\\nMessage:\\n${message.trim()}`);
    window.location.href = `mailto:arjun@dreamclerk.com?subject=${subject}&body=${body}`;
  };
  return (
    <div className="investor-modal-back" role="dialog" aria-modal="true" aria-labelledby="investor-title" onClick={(event) => { if (event.target === event.currentTarget) onClose?.(); }}>
      <section className="investor-modal">
        <header className="investor-modal__head">
          <span>dreamclerk · investor relations</span>
          <button type="button" onClick={onClose} aria-label="Close investor enquiry">×</button>
        </header>
        <div className="investor-modal__body">
          <span className="investor-modal__eyebrow">pre-seed · investor enquiry</span>
          <h3 id="investor-title">let's talk about dreamclerk.</h3>
          <p>Tell us a little about yourself. Your enquiry is saved before your email app opens for direct follow-up.</p>
          <form onSubmit={sendEnquiry} className="investor-modal__form">
            <input value={name} onChange={(event) => setName(event.target.value)} placeholder="your name *" required />
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="work email *" required />
            <input value={organisation} onChange={(event) => setOrganisation(event.target.value)} placeholder="organisation / fund" />
            <textarea value={message} onChange={(event) => setMessage(event.target.value)} placeholder="your message (optional)" rows={3} />
            {saveError && <p className="investor-modal__error" role="alert">{saveError}</p>}
            <button type="submit" disabled={saving}>{saving ? "saving enquiry…" : "save & continue via email ↗"}</button>
          </form>
          <div className="investor-modal__contact">
            <a href="mailto:arjun@dreamclerk.com?subject=DreamClerk%20Investor%20Enquiry">arjun@dreamclerk.com ↗</a>
            <a href="https://www.linkedin.com/in/arjun-sv-6bbb8a316/" target="_blank" rel="noreferrer noopener">connect on linkedin ↗</a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function EmailModal({ open, onClose, onSubmitted, onInvestorClick, source = "modal" }) {
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
    getSubscriberCount()
      .then((n) => { if (!cancelled) setCount(n); })
      .catch(() => { if (!cancelled) setCount(null); });
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
    if (!isValidNotifyEmail(cleanEmail)) {
      setStatus("error");
      setError("Please enter a valid email address.");
      return;
    }
    setStatus("loading");
    setError("");
    try {
      const result = await subscribeNotify({ name: cleanName, email: cleanEmail, source });
      if (result.ok) {
        setStatus("success");
        setSavedToSupabase(!result.mock);
        onSubmitted?.();
        // Refresh the count without allowing a count failure to undo signup.
        if (!result.mock) {
          try { await bumpSubscriberCount(); } catch {}
        }
        // Keep confirmation visible until the visitor closes the modal.
      } else {
        setStatus("error");
        setError(result.error || "Something went wrong. Please try again.");
      }
    } catch (err) {
      setStatus("error");
      setError(err?.message || "We couldn't submit your details. Please try again.");
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
