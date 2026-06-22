import { useEffect, useState } from "react";
import SectionLabel from "./SectionLabel.jsx";
import { RouterLink } from "../lib/router.jsx";

/**
 * Founder — /founder
 * The founder's own note. No fake achievements, no fluff.
 *
 * Layout:
 *  - Left column: lede + 3 paragraphs written in present continuous ("I'm
 *    building…", "I'm running…"), exactly as the founder writes in public.
 *  - Right column: live "currently building" panel — a stack of build cards
 *    with staggered entrance and a continuously running marquee pulse on
 *    the active item. Animated entrance + ongoing pulse, with
 *    prefers-reduced-motion honored.
 *  - Below both: the contact card.
 */

const BUILDING = [
  { tag: "[shipped]",     label: "dreamclerk beta — verify engine v1",     dot: "ok",   ms: 0    },
  { tag: "[shipping]",    label: "deterministic review · /how-beta",        dot: "live", ms: 600  },
  { tag: "[shipping]",    label: "rate-limiter middleware (capstone seed)", dot: "live", ms: 1200 },
  { tag: "[shipping]",    label: "student stories — first 5 interviews",    dot: "live", ms: 1800 },
  { tag: "[next]",        label: "cohort 2 invite · end of july",            dot: "wait", ms: 2400 },
  { tag: "[always]",      label: "responding to arjun@dreamclerk.com",      dot: "ok",   ms: 3000 },
];

export default function FounderPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { document.title = "founder — dreamclerk"; }, []);
  useEffect(() => {
    // small rAF delay so the .fp-enter animations can play after mount
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <section className="section about" id="founder">
      <div className="wrap about__wrap">
        <SectionLabel status="ok">$ cat /founder.md</SectionLabel>

        <h1 className="about__title">arjun sv.</h1>
        <p className="about__meta">founder · dreamclerk · age 22 · chennai</p>

        {/* Two-column lede + live build panel */}
        <div className={"fp-cols" + (mounted ? " is-in" : "")}>
          {/* ── LEFT: paragraphs in present-continuous ────────────────── */}
          <div className="fp-cols__left">
            <p className="about__lede">
              i built dreamclerk because i lived the problem first. a real-world
              career simulation platform for indian undergraduates — so no one
              graduates into unemployment wondering whether the system saw them
              at all.
            </p>

            <h2 className="contact__h2">$ what i'm building</h2>
            <p className="legal__lede">
              i'm building a platform where students don't just watch tutorials —
              they get hired by an ai recruiter, ship code in a full in-browser
              ide, take real review, and walk away with a verified work record
              that an employer can open in 30 seconds. i'm running the beta
              myself, with a 1-person team, built in public, from chennai.
            </p>

            <h2 className="contact__h2">$ why this works</h2>
            <p className="legal__lede">
              i'm shipping the only signal a recruiter actually trusts: your
              merged code, your review notes, your sprint velocity, and a
              capstone you can demo live. i'm running the review engine
              deterministically so two reviewers always agree. i'm writing
              every line of the cert code so the trail is auditable, signed,
              and one-click verifiable. no badges, no fluff.
            </p>

            <h2 className="contact__h2">$ who i am</h2>
            <p className="legal__lede">
              i'm arjun, 22, in chennai. i'm building dreamclerk alone. i'm
              writing this site, the beta engine, the sql schema, and the
              landing copy. i'm not raising. i'm not hiring. i'm just
              shipping, one sprint at a time, until the certificate is what
              gets a student through the door.
            </p>
          </div>

          {/* ── RIGHT: live "currently building" panel ─────────────────── */}
          <aside className="fp-cols__right" aria-label="currently building">
            <div className="fp-build">
              <div className="fp-build__bar">
                <span className="fp-build__dot" aria-hidden="true" />
                <span className="fp-build__title">live · currently building</span>
                <span className="fp-build__time">{mounted ? "online" : "boot…"}</span>
              </div>

              <ul className="fp-build__list">
                {BUILDING.map((b, i) => (
                  <li
                    key={b.label}
                    className="fp-build__item"
                    style={{ animationDelay: `${b.ms}ms` }}
                  >
                    <span className={`fp-build__tag fp-build__tag--${b.dot}`}>{b.tag}</span>
                    <span className="fp-build__label">{b.label}</span>
                    <span className={`fp-build__pip fp-build__pip--${b.dot}`} aria-hidden="true" />
                  </li>
                ))}
              </ul>

              <div className="fp-build__foot">
                <span className="fp-build__line" aria-hidden="true">
                  <span>$ tail -f /founder/build.log</span>
                  <span className="fp-build__cursor" />
                </span>
              </div>
            </div>

            <a className="fp-quote" href="https://www.linkedin.com/in/arjun-sv-6bbb8a316/" target="_blank" rel="noreferrer noopener">
              <span className="fp-quote__mark">"</span>
              <span className="fp-quote__body">
                building this in public. if you want to follow along, i post
                every sprint, every mistake, every merge.
              </span>
              <span className="fp-quote__src">— arjun sv · linkedin ↗</span>
            </a>
          </aside>
        </div>

        {/* Single founder card — ContactPage style */}
        <article className="founder-card">
          <span className="founder-card__cmd">$ whoami arjun-sv</span>

          <h3 className="founder-card__title">founder, dreamclerk.</h3>

          <p className="founder-card__sub">
            chennai, india · 1-person team · built in public.
          </p>

          <div className="founder-card__kv">
            <div>linkedin.com/in/arjun-sv-6bbb8a316/</div>
            <div>arjun@dreamclerk.com</div>
          </div>

          <div className="founder-card__ctas">
            <a
              href="https://www.linkedin.com/in/arjun-sv-6bbb8a316/"
              target="_blank"
              rel="noreferrer noopener"
              className="founder-card__btn"
            >
              open linkedin ↗
            </a>
            <a
              href="mailto:arjun@dreamclerk.com"
              className="founder-card__btn"
            >
              send email →
            </a>
          </div>

          <p className="founder-card__foot">
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
