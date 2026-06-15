import { useEffect, useRef, useState } from "react";
import { subscribe, getSubscriberCount } from "../lib/supabase";

export default function EmailModal({ open, onClose, source = "modal" }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [error, setError] = useState("");
  const [count, setCount] = useState(null);
  const inputRef = useRef(null);
  const cardRef = useRef(null);

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
    if (!cleanEmail.includes("@")) {
      setStatus("error");
      setError("That email looks off — make sure it has an @.");
      return;
    }
    setStatus("loading");
    setError("");
    const result = await subscribe(cleanName, cleanEmail, source);
    if (result.ok) {
      setStatus("success");
      setTimeout(() => onClose(), 2200);
    } else {
      setStatus("error");
      setError(result.error || "Something went wrong.");
    }
  }

  if (!open) return null;

  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="modal-card" ref={cardRef}>
        <button
          type="button"
          className="modal-close"
          aria-label="Close"
          onClick={onClose}
        >
          ×
        </button>

        {status === "success" ? (
          <div className="modal-success">
            <div className="modal-eyebrow">/ confirmed</div>
            <h2 id="modal-title">you are on the list.</h2>
            <p>
              we will email you the moment a new cohort opens. check{" "}
              <a href="https://www.instagram.com/dreamclrk" target="_blank" rel="noreferrer">@dreamclrk</a>{" "}
              for the announcement in the meantime.
            </p>
            <button className="btn solid" onClick={onClose}>
              close <span className="arr">→</span>
            </button>
          </div>
        ) : (
          <>
            <div className="modal-eyebrow">/ get notified · coming soon</div>
            <h2 id="modal-title">get notified when dreamclerk opens.</h2>
            <p className="modal-lede">
              drop your details. we will email you the moment a new cohort opens.
            </p>

            {count != null && (
              <div className="modal-waitlist-count">
                <span className="pulse" />
                <span>{count.toLocaleString("en-IN")} undergrads already on the waitlist</span>
              </div>
            )}

            <form className="modal-form" onSubmit={handleSubmit} noValidate>
              <div className="modal-input-row modal-input-row--split">
                <div className="modal-field">
                  <label htmlFor="modal-name" className="modal-label">your name</label>
                  <input
                    ref={inputRef}
                    id="modal-name"
                    type="text"
                    className="modal-input"
                    placeholder="aanya iyer"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (status === "error") setStatus("idle");
                    }}
                    disabled={status === "loading"}
                    required
                    autoComplete="name"
                  />
                </div>
                <div className="modal-field">
                  <label htmlFor="modal-email" className="modal-label">your email</label>
                  <input
                    id="modal-email"
                    type="email"
                    className="modal-input"
                    placeholder="you@college.edu"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (status === "error") setStatus("idle");
                    }}
                    disabled={status === "loading"}
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn solid modal-submit"
                disabled={status === "loading" || !name.trim() || !email.trim()}
              >
                {status === "loading" ? "joining…" : <>get notified <span className="arr">→</span></>}
              </button>

              {status === "error" && (
                <div className="modal-error">{error}</div>
              )}
              <div className="modal-fine">
                no spam · unsubscribe anytime · we never share your details
              </div>
            </form>

            <div className="modal-foot">
              <span>follow along →</span>
              <a href="https://www.instagram.com/dreamclrk" target="_blank" rel="noreferrer">instagram ↗</a>
              <a href="https://www.linkedin.com/company/dreamclerk" target="_blank" rel="noreferrer">linkedin ↗</a>
              <a href="https://github.com/dreamclerk" target="_blank" rel="noreferrer">github ↗</a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
