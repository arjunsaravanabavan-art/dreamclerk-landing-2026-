import { useEffect, useRef, useState } from "react";
import { subscribe, getSubscriberCount } from "../lib/supabase";

export default function EmailModal({ open, onClose, source = "modal" }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [error, setError] = useState("");
  const [count, setCount] = useState(1847);
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

  // focus input on open
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
    setStatus("loading");
    setError("");
    const result = await subscribe(email.trim(), source);
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
              we are rolling out dreamclerk in small cohorts. check{" "}
              <a href="https://www.instagram.com/dreamclrk" target="_blank" rel="noreferrer">@dreamclrk</a> for
              the announcement. the next email hits your inbox the moment a seat opens.
            </p>
            <button className="btn solid" onClick={onClose}>
              close <span className="arr">→</span>
            </button>
          </div>
        ) : (
          <>
            <div className="modal-eyebrow">/ get notified · coming soon</div>
            <h2 id="modal-title">let me tell you everything about dreamclerk.</h2>
            <p className="modal-lede">
              dreamclerk is a real-world career simulation platform for indian undergraduates. you apply, an ai recruiter runs a live interview, you get matched to a simulated company, and you ship real code in a full in-browser ide — monaco editor, sandboxed terminal, docker microvm, jupyter, and a real pr flow with an ai tech lead reviewing every line.
            </p>

            {count != null && (
              <div className="modal-waitlist-count">
                <span className="pulse" />
                <span>{count.toLocaleString("en-IN")} undergrads already on the waitlist</span>
              </div>
            )}

            <ul className="modal-points">
              <li>
                <span className="mp-n">/01</span>
                <span><b>apply like it is real.</b> the ai recruiter screens you, runs a conversational interview, and either hires you or hands you a rubric-scored debrief. no gatekeeping. no alumni network.</span>
              </li>
              <li>
                <span className="mp-n">/02</span>
                <span><b>work like it is real.</b> 8-week sprints inside a fictional company — nexara, vivacity, oxygon, levanto. real codebases. real tickets. real slack channels. real deadlines.</span>
              </li>
              <li>
                <span className="mp-n">/03</span>
                <span><b>get reviewed like it is real.</b> the ai tech lead scores every pr on correctness, security, performance, readability, edge cases. 0–100. line-level feedback. no fluff.</span>
              </li>
              <li>
                <span className="mp-n">/04</span>
                <span><b>earn a verified work record.</b> not a completion badge. a recruiter-checkable certificate that links to your actual code, prs, ai review scores, and sprint velocity. blockchain-anchored. qr-verified.</span>
              </li>
            </ul>

            <p className="modal-stack">
              <b>in the workspace:</b> monaco · bash · docker · jupyter · postgresql · figma handoff · postman · git · live logs.
            </p>

            <form className="modal-form" onSubmit={handleSubmit} noValidate>
              <label htmlFor="modal-email" className="modal-label">your email</label>
              <div className="modal-input-row">
                <input
                  ref={inputRef}
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
                <button
                  type="submit"
                  className="btn solid modal-submit"
                  disabled={status === "loading" || !email}
                >
                  {status === "loading" ? "joining…" : <>get notified <span className="arr">→</span></>}
                </button>
              </div>
              {status === "error" && (
                <div className="modal-error">{error}</div>
              )}
              <div className="modal-fine">
                no spam · unsubscribe anytime · we never share your email
              </div>
            </form>

            <div className="modal-foot">
              <span>follow along →</span>
              <a href="https://www.instagram.com/dreamclrk" target="_blank" rel="noreferrer">instagram ↗</a>
              <a href="https://twitter.com/dreamclerk" target="_blank" rel="noreferrer">twitter / 𝕏 ↗</a>
              <a href="https://www.linkedin.com/company/dreamclerk" target="_blank" rel="noreferrer">linkedin ↗</a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
