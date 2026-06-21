import { useEffect, useState } from "react";

const verbs = ["ship", "merge", "deploy", "review", "certify", "earn", "place"];

export default function Final() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % verbs.length), 1600);
    return () => clearInterval(t);
  }, []);

  return (
    <section id="know" className="final-band section">
      <div className="wrap final reveal">
        <div className="final-l">
          <span className="ps1">$</span> dreamclerk --know{" "}
          <span className="caret" />
          <h2>
            coming soon
            <span className="ticker-num">.</span>
          </h2>
        </div>
        <div className="final-r">
          <p>
            no more "courses". no more "build 30 projects for your resume". in 8 weeks you do real work, get reviewed, and leave with proof. <em>free for the first 200 students.</em>
          </p>
          <form
            className="quick-apply"
            onSubmit={(e) => { e.preventDefault(); document.dispatchEvent(new CustomEvent("open-modal", { detail: { source: "final-band" } })); }}
          >
            <label htmlFor="qa" className="visually-hidden">your email</label>
            <input id="qa" type="email" required placeholder="you@example.com" autoComplete="email" />
            <button type="submit" className="btn">
              notify me
              <span className="arr">→</span>
            </button>
          </form>
          <div className="pulse-row" aria-hidden="true">
            <span className="live" />
            <span>{verbs[i]}…</span>
            <span className="meta">5 students applied in the last minute</span>
          </div>
          <p
            style={{
              margin: "12px 0 0",
              fontFamily: "var(--mono)",
              fontSize: 13,
              color: "var(--muted-on-dark-2)",
            }}
          >
            ? want to know more?{" "}
            <a
              href="mailto:info@dreamclerk.com?subject=human%20contact%20%E2%80%94%20dreamclerk%20beta&body=hi%20dreamclerk%20team%2C%0A%0A"
              style={{
                color: "var(--paper)",
                textDecoration: "underline",
                textDecorationColor: "var(--ok-fill)",
                textUnderlineOffset: 3,
                textDecorationThickness: 1,
                transition: "text-decoration-color 200ms var(--ease), color 200ms var(--ease)",
              }}
            >
              talk to a human →
            </a>
          </p>

          <ul
            aria-label="contact"
            style={{
              listStyle: "none",
              padding: 0,
              margin: "20px 0 0",
              display: "flex",
              flexWrap: "wrap",
              gap: 14,
              fontFamily: "var(--mono)",
              fontSize: 13,
              color: "var(--muted-on-dark-2)",
              borderTop: "1px solid rgba(255,255,255,0.08)",
              paddingTop: 14,
            }}
          >
            <li style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span aria-hidden="true">$</span>
              <a
                href="mailto:info@dreamclerk.com"
                style={{
                  color: "var(--paper)",
                  textDecoration: "underline",
                  textDecorationColor: "var(--ok-fill)",
                  textUnderlineOffset: 3,
                  textDecorationThickness: 1,
                  transition: "text-decoration-color 200ms var(--ease), color 200ms var(--ease)",
                }}
              >
                info@dreamclerk.com
              </a>
            </li>
            <li style={{ color: "var(--muted-on-dark-2)" }}>·</li>
            <li>
              <a
                href="https://www.linkedin.com/company/dreamclerk"
                target="_blank"
                rel="noreferrer"
                style={{
                  color: "var(--paper)",
                  textDecoration: "underline",
                  textDecorationColor: "var(--ok-fill)",
                  textUnderlineOffset: 3,
                  textDecorationThickness: 1,
                  transition: "text-decoration-color 200ms var(--ease), color 200ms var(--ease)",
                }}
              >
                linkedin ↗
              </a>
            </li>
            <li style={{ color: "var(--muted-on-dark-2)" }}>·</li>
            <li>
              <a
                href="https://www.instagram.com/dreamclrk"
                target="_blank"
                rel="noreferrer"
                style={{
                  color: "var(--paper)",
                  textDecoration: "underline",
                  textDecorationColor: "var(--ok-fill)",
                  textUnderlineOffset: 3,
                  textDecorationThickness: 1,
                  transition: "text-decoration-color 200ms var(--ease), color 200ms var(--ease)",
                }}
              >
                instagram ↗
              </a>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
