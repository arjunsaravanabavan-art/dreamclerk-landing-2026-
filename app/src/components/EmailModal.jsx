import { useEffect, useRef, useState } from "react";
import { subscribeNotify, getSubscriberCount, bumpSubscriberCount } from "../lib/supabase";

export default function EmailModal({ open, onClose, source = "modal" }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [error, setError] = useState("");
  const [count, setCount] = useState(null);
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
      // bump the live counter for the next visitor
      try { await bumpSubscriberCount(); } catch {}
    }
    if (result.ok) {
      setStatus("success");
      setTimeout(() => onClose(), 2200);
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
            <h4>you are on the list.</h4>
            <p>
              we will email you the moment a new cohort opens. check{" "}
              <a href="https://www.instagram.com/dreamclrk" target="_blank" rel="noreferrer">@dreamclrk</a>{" "}
              for the announcement in the meantime.
            </p>
            <button className="btn btn--solid" onClick={onClose} style={{ marginTop: 8 }}>
              close <span className="arr">→</span>
            </button>
          </div>
        ) : (
          <div className="modal__body">
            <h4 id="modal-title">get notified when dreamclerk opens.</h4>
            <p>drop your details. we will email you the moment a new cohort opens.</p>

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
                placeholder="your email · you@college.edu"
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
              <div className="row">
                <button
                  type="submit"
                  className="btn btn--solid"
                  disabled={status === "loading"}
                >
                  {status === "loading" ? "joining…" : <>get notified <span className="arr">→</span></>}
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
