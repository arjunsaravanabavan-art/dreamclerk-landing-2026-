import { useEffect } from "react";
import SectionLabel from "./SectionLabel.jsx";
import { RouterLink } from "../lib/router.jsx";

/**
 * Contact — /contact
 * Static directory of how to reach the team. Three lanes:
 *   - email    (info@ for general, dpo@ for privacy, etc.)
 *   - linkedin (company page)
 *   - instagram (@dreamclrk)
 * Each lane is a card with a $ command label, a one-line description,
 * the contact handle, and a primary CTA.
 */

const LANES = [
  {
    id: "email",
    section: "$ mail --to info@dreamclerk.com",
    title: "email us.",
    desc: "for everything that doesn't have its own inbox — questions, ideas, partnership pitches, things you wish we'd written about.",
    handle: "info@dreamclerk.com",
    href: "mailto:info@dreamclerk.com?subject=hi%20dreamclerk",
    cta: "open mail client",
    note: "we read every message. reply within 2 business days.",
  },
  {
    id: "linkedin",
    section: "$ open linkedin.com/company/dreamclerk",
    title: "find us on linkedin.",
    desc: "hiring partners, recruiters, alumni, and the rest of the team's day-to-day updates. follow for cohort openings, hiring-partner announcements, and the occasional hot take.",
    handle: "linkedin.com/company/dreamclerk",
    href: "https://www.linkedin.com/company/dreamclerk",
    cta: "open linkedin ↗",
    external: true,
    note: "best place to tag us if you're a cohort graduate.",
  },
  {
    id: "instagram",
    section: "$ open instagram.com/dreamclrk",
    title: "follow @dreamclrk.",
    desc: "cohort announcements, behind-the-scenes from the workspace, the rare meme. we post about 2x a week and stories when a cohort opens.",
    handle: "@dreamclrk",
    href: "https://www.instagram.com/dreamclrk",
    cta: "open instagram ↗",
    external: true,
    note: "the fastest way to hear about a cohort opening.",
  },
];

export default function ContactPage() {
  useEffect(() => { document.title = "contact — dreamclerk"; }, []);

  return (
    <section className="section legal" id="contact">
      <div className="wrap legal__wrap">
        <SectionLabel status="ok">$ cat /contact.md</SectionLabel>

        <h1 className="legal__title">contact.</h1>
        <p className="legal__meta">three lanes · no ticket forms · no chatbots</p>

        <p className="legal__lede">
          we are a small team. we read every message ourselves. pick the lane that fits.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 18,
            margin: "32px 0 40px",
          }}
        >
          {LANES.map((l) => (
            <article
              key={l.id}
              style={{
                border: "1px solid var(--line)",
                borderTop: "3px solid var(--ok)",
                padding: "22px 22px 20px",
                borderRadius: 4,
                background: "var(--paper)",
                display: "flex",
                flexDirection: "column",
                gap: 12,
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
                {l.section}
              </span>
              <h3
                style={{
                  margin: 0,
                  fontSize: 22,
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                }}
              >
                {l.title}
              </h3>
              <p
                style={{
                  margin: 0,
                  color: "var(--muted)",
                  fontSize: 14,
                  lineHeight: 1.55,
                }}
              >
                {l.desc}
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
                {l.handle}
              </div>
              <a
                href={l.href}
                target={l.external ? "_blank" : undefined}
                rel={l.external ? "noreferrer noopener" : undefined}
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
                  alignSelf: "flex-start",
                  gap: 8,
                }}
              >
                {l.cta}
              </a>
              <p
                style={{
                  margin: 0,
                  fontFamily: "var(--mono)",
                  fontSize: 11,
                  color: "var(--muted-2)",
                  letterSpacing: "0.04em",
                }}
              >
                {l.note}
              </p>
            </article>
          ))}
        </div>

        <p className="legal__back">
          <RouterLink to="/">← back to dreamclerk</RouterLink>
        </p>
      </div>
    </section>
  );
}