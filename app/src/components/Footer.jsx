import { useEffect, useState } from "react";
import { RouterLink } from "../lib/router.jsx";
import { subscribeNotify } from "../lib/supabase.js";

export default function Footer() {
  const [nfEmail, setNfEmail] = useState("");
  const [nfStatus, setNfStatus] = useState("idle"); // idle | loading | success | error
  const [nfError, setNfError] = useState("");
  const [notifySent, setNotifySent] = useState(false);

  async function handleNotifySubmit(e) {
    e.preventDefault();
    if (nfStatus === "loading" || !nfEmail.trim()) return;
    setNfStatus("loading");
    setNfError("");
    const r = await subscribeNotify({ email: nfEmail.trim(), source: "footer" });
    if (r.ok) { setNfStatus("success"); setNotifySent(true); setNfEmail(""); }
    else { setNfError(r.error || "something went wrong."); setNfStatus("error"); }
  }

  // Scroll to contact feedback if clicked there
  useEffect(() => {
    if (typeof window === "undefined") return;
    const onHash = () => {
      if (window.location.hash === "#feedback") {
        const el = document.getElementById("feedback");
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };
    window.addEventListener("hashchange", onHash, { passive: true });
    onHash();
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer__top">
          <div className="footer__brand">
            <div className="word">dreamclerk</div>
            <p>
              a real-world career simulation platform. no more unemployment. built in india for indian undergraduates. free during beta.
            </p>
            <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 10, fontFamily: "var(--mono)", fontSize: 12, color: "var(--muted-on-dark-2)" }}>
              <span className="chip chip--on-dark"><span className="dot" /> all systems operational</span>
            </div>
          </div>

          <div>
            <h5>platform</h5>
            <ul>
              <li><RouterLink to="/how">how it works</RouterLink></li>
              <li><RouterLink to="/workspace">workspace</RouterLink></li>
              <li><RouterLink to="/tracks">role tracks</RouterLink></li>
              <li><a href="/certificate">certificate</a></li>
            </ul>
          </div>

          <div>
            <h5>resources</h5>
            <ul>
              <li><RouterLink to="/faq">faq</RouterLink></li>
              <li><RouterLink to="/blog">blog</RouterLink></li>
              <li><a href="/proof">student stories</a></li>
              <li><a href="https://www.dreamclerk.com" rel="noreferrer">dreamclerk.com ↗</a></li>
            </ul>

            {/* inline notify form — no modal, no scroll. lives in the footer. */}
            <form
              onSubmit={handleNotifySubmit}
              noValidate
              style={{ marginTop: 18 }}
              className="footer__notify"
            >
              <label
                htmlFor="footer-notify-email"
                style={{
                  display: "block",
                  fontFamily: "var(--mono)",
                  fontSize: 10,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--muted-on-dark-2)",
                  marginBottom: 8,
                }}
              >
                next cohort · 1 email
              </label>

              {notifySent ? (
                <div
                  style={{
                    border: "1px solid var(--ok)",
                    padding: "10px 12px",
                    borderRadius: 3,
                    fontFamily: "var(--mono)",
                    fontSize: 12,
                    color: "var(--ok)",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    background: "rgba(0,0,0,0.2)",
                  }}
                >
                  <span>●</span>
                  <span>on the list. pinged within 2 weeks.</span>
                </div>
              ) : (
                <>
                  <div style={{ display: "flex", gap: 0 }}>
                    <input
                      id="footer-notify-email"
                      type="email"
                      value={nfEmail}
                      onChange={(e) => { setNfEmail(e.target.value); if (nfStatus === "error") setNfStatus("idle"); }}
                      placeholder="you@example.com"
                      disabled={nfStatus === "loading"}
                      autoComplete="email"
                      required
                      style={{
                        flex: 1,
                        minWidth: 0,
                        fontFamily: "var(--mono)",
                        fontSize: 12,
                        padding: "10px 12px",
                        border: "1px solid var(--line-2)",
                        background: "var(--paper)",
                        color: "var(--ink)",
                        borderTopLeftRadius: 3,
                        borderBottomLeftRadius: 3,
                        borderRight: "none",
                        outline: "none",
                      }}
                    />
                    <button
                      type="submit"
                      disabled={nfStatus === "loading" || !nfEmail.trim()}
                      style={{
                        fontFamily: "var(--mono)",
                        fontSize: 12,
                        padding: "10px 14px",
                        border: "1px solid var(--ink)",
                        background: nfStatus === "loading" || !nfEmail.trim() ? "var(--paper-2)" : "var(--paper)",
                        color: nfStatus === "loading" || !nfEmail.trim() ? "var(--muted)" : "var(--ink)",
                        borderTopRightRadius: 3,
                        borderBottomRightRadius: 3,
                        letterSpacing: "0.04em",
                        textTransform: "lowercase",
                        cursor: nfStatus === "loading" || !nfEmail.trim() ? "not-allowed" : "pointer",
                      }}
                    >
                      {nfStatus === "loading" ? "…" : "→"}
                    </button>
                  </div>
                  {nfStatus === "error" && (
                    <div
                      style={{
                        marginTop: 6,
                        fontFamily: "var(--mono)",
                        fontSize: 11,
                        color: "var(--err)",
                      }}
                    >
                      {nfError}
                    </div>
                  )}
                </>
              )}
            </form>
          </div>

          <div>
            <h5>company</h5>
            <ul>
              <li><RouterLink to="/about">about us</RouterLink></li>
              <li><a href="/about#team">team</a></li>
              <li><RouterLink to="/founder">founder</RouterLink></li>
              <li><RouterLink to="/contact">contact</RouterLink></li>
              <li><RouterLink to="/contact#feedback">feedback</RouterLink></li>
              <li><a href="mailto:press@dreamclerk.com">press</a></li>
              <li><a href="mailto:careers@dreamclerk.com">careers</a></li>
            </ul>
          </div>

          <div>
            <h5>follow</h5>
            <ul>
              <li><a href="https://www.instagram.com/dreamclrk" target="_blank" rel="noreferrer">instagram ↗</a></li>
              <li><a href="https://www.linkedin.com/company/dreamclerk" target="_blank" rel="noreferrer">linkedin ↗</a></li>
            </ul>
          </div>

          <div>
            <h5>legal</h5>
            <ul>
              <li><RouterLink to="/privacy">privacy</RouterLink></li>
              <li><RouterLink to="/terms">terms</RouterLink></li>
              <li><a href="mailto:dpo@dreamclerk.com">dpo</a></li>
              <li><a href="mailto:security@dreamclerk.com">security</a></li>
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <span>© 2026 dreamclerk.com · no more unemployment</span>
          <div className="socials">
            <a href="https://www.instagram.com/dreamclrk" target="_blank" rel="noreferrer">instagram</a>
            <a href="https://www.linkedin.com/company/dreamclerk" target="_blank" rel="noreferrer">linkedin</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
