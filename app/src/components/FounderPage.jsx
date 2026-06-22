import { useEffect } from "react";
import SectionLabel from "./SectionLabel.jsx";
import { RouterLink } from "../lib/router.jsx";

/**
 * Founder — /founder
 * The founder's own note. No fake achievements, no fluff.
 */
export default function FounderPage() {
  useEffect(() => { document.title = "founder — dreamclerk"; }, []);

  return (
    <section className="section about" id="founder">
      <div className="wrap about__wrap">
        <SectionLabel status="ok">$ cat /founder.md</SectionLabel>

        <h1 className="about__title">arjun sv.</h1>
        <p className="about__meta">founder · dreamclerk · age 22 · chennai</p>

        <p className="about__lede">
          i built dreamclerk because i lived the problem first. a real-world career simulation platform for indian undergraduates — so no one graduates into unemployment wondering whether the system saw them at all.
        </p>

        <h2 className="contact__h2">$ why i built this</h2>
        <p className="legal__lede">
          i am 22. i watched classmates finish four years of coursework and still get rejected from entry-level roles because the role already had 1,000 applicants. dreamclerk is what i wish someone had handed me in second year — a way to ship real code, take real review, earn a real work record that employers actually open.
        </p>

        <h2 className="contact__h2">$ what i believe</h2>
        <p className="legal__lede">
          a degree is not a work record. a work record is a work record. every dreamclerk certificate is signed, audit-trail-verified, and one-click verifiable. no badges, no fluff.
        </p>

        {/* Single founder card — ContactPage style */}
        <article
          style={{
            border: "1px solid var(--line)",
            borderTop: "3px solid var(--ok)",
            padding: "22px 22px 20px",
            borderRadius: 4,
            background: "var(--paper)",
            display: "flex",
            flexDirection: "column",
            gap: 12,
            maxWidth: 640,
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
            $ whoami arjun-sv
          </span>

          <h3
            style={{
              margin: 0,
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: "-0.02em",
            }}
          >
            founder, dreamclerk.
          </h3>

          <p
            style={{
              margin: 0,
              color: "var(--muted)",
              fontSize: 14,
              lineHeight: 1.55,
            }}
          >
            chennai, india · 1-person team · built in public.
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
            <div>linkedin.com/in/arjun-sv-6bbb8a316/</div>
            <div>arjun@dreamclerk.com</div>
          </div>

          <div
            style={{
              display: "flex",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <a
              href="https://www.linkedin.com/in/arjun-sv-6bbb8a316/"
              target="_blank"
              rel="noreferrer noopener"
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
                gap: 8,
              }}
            >
              open linkedin ↗
            </a>
            <a
              href="mailto:arjun@dreamclerk.com"
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
                gap: 8,
              }}
            >
              send email →
            </a>
          </div>

          <p
            style={{
              margin: 0,
              fontFamily: "var(--mono)",
              fontSize: 11,
              color: "var(--muted-2)",
              letterSpacing: "0.04em",
            }}
          >
            founder · 1-person team · chennai, india
          </p>
        </article>

        <p className="legal__back">
          <RouterLink to="/">← back to dreamclerk</RouterLink>
        </p>
      </div>
    </section>
  );
}
