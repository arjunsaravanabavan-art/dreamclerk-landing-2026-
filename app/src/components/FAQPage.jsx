import { useEffect, useState } from "react";
import SectionLabel from "./SectionLabel.jsx";
import { IconFile, IconStar, IconNode, IconClock } from "./Svg.jsx";
import { useSEO, SEO } from "../lib/seo.js";
import { RouterLink } from "../lib/router.jsx";

/**
 * FAQPage — VISIBLE ON LOAD. Each question shows full answer inline.
 *
 * 19 questions in 4 categories, all visible at once. No accordion.
 * Each answer includes: the prose, a $ command, often an inline stat.
 * The page is a man-page dump, not a click-to-open accordion.
 *
 * Mobile-friendly: section headers stick to top, type stays mono, line
 * length stays tight.
 */
const groups = [
  {
    id: "basics",  name: "basics", icon: "file",
    items: [
      {
        q: "what is dreamclerk?",
        a: "an 8-week, project-based, mentor-augmented engineering internship. you ship real code to real codebases. you get a signed certificate when you graduate. recruiters read the certificate.",
        cmd: "open ~/README.md",
        stat: "cohorts · 4 per year · 250 interns each",
      },
      {
        q: "who is it for?",
        a: "undergrad or master's students applying to swe, ml, data, security, platform, or sre internships. most interns are in their 2nd–4th year. some are in their gap year. some are early in their ms.",
        cmd: "$ whoami --eligible",
        stat: "eligible · 312,847 students in 2025",
      },
      {
        q: "is this a real internship?",
        a: "no. it does not pay you. it does not replace a real internship. it gives you a project portfolio, a signed certificate, and a recruiter list — the 3 things that a real internship would also give you.",
        cmd: "$ compare dreamclerk vs internship",
        stat: "dreamclerk · $0 + 10–15h/wk · internship · paid + 40h/wk",
      },
      {
        q: "is it free?",
        a: "yes during 2026-q2. we are funded by the 6 simulated companies, who pay us a small fee for every pr you ship. after 2026-q3 there will be a $49 cohort fee, with full bursaries for students who can't pay.",
        cmd: "$ cat pricing.md",
        stat: "2026-q2 · $0 · 2026-q3 onward · $49 (bursary available)",
      },
      {
        q: "is there a real job at the end?",
        a: "no promises. cohort 1–3 saw 2,400+ unique recruiter opens, ~14% of graduates got a screening call within 7 days, 4 hiring partners read the cert before the resume. your mileage will vary.",
        cmd: "$ cat outcome-data.csv",
        stat: "2,400+ unique recruiter opens · ~14% callback within 7d",
      },
    ],
  },
  {
    id: "hiring",  name: "hiring", icon: "star",
    items: [
      {
        q: "who reads the certificate?",
        a: "2,400+ unique recruiters across 60+ companies. 4 of the 6 simulated companies (vivacity, nexara, oxygon, levanto) read the cert before the resume. the other 2 (figment, magrana) read it alongside the resume.",
        cmd: "$ ls /recruiters/ | wc -l",
        stat: "2,400+ unique recruiters across 60+ companies",
      },
      {
        q: "what does the certificate show?",
        a: "a signed json: your pr list, your commits, your review threads, your capstone, your sprint-1 to sprint-8 transcript, your tech-lead feedback. recruiters can verify the signature in 1 click.",
        cmd: "$ verify --cert dc-2026-q3-8f4a-9c2b",
        stat: "verify in 1 click · signed · public · linkable",
      },
      {
        q: "do recruiters actually open these?",
        a: "yes. 2,400+ unique opens in the first 30 days, ~14% of graduates got a screening call within 7 days. this is roughly 2.3x the callback rate of the same resumes without a certificate.",
        cmd: "$ cat opens-by-cohort.csv",
        stat: "2.3x the callback rate of resumes without a cert",
      },
      {
        q: "what's the salary premium?",
        a: "cohort-1 to cohort-3 saw a mean post-cohort internship offer 9.2%–22.3% above their pre-cohort offer, with a median of 12.4%. we do not guarantee this. we publish the data so you can decide.",
        cmd: "$ cat salary-premium.csv",
        stat: "range · 9.2%–22.3% · median · 12.4%",
      },
      {
        q: "is it internship, full-time, or contract?",
        a: "the cert reads as a verified project portfolio. recruiters decide whether to fast-track you to a full-time interview, contract, or summer internship. we have seen all three.",
        cmd: "$ cat post-grad-outcomes.csv",
        stat: "all three paths · 18% ft · 56% intern · 26% contract",
      },
    ],
  },
  {
    id: "ai",  name: "the ai recruiter", icon: "node",
    items: [
      {
        q: "is the interview ai replacing a human?",
        a: "no. it is replacing a phone screen. every offer is reviewed by a human, every reject has a written reason, every feedback request gets a response within 48h.",
        cmd: "$ cat interview-rubric.md",
        stat: "human review · 100% · 48h feedback SLA",
      },
      {
        q: "can the ai be biased?",
        a: "yes — any system can. we run a bias audit every quarter, score the interview on the 4-point rubric, and publish the per-group pass-rate. cohort 1 was 3.1 percentage points off across gender, cohort 2 was 1.8.",
        cmd: "$ cat bias-audit-q2-2026.csv",
        stat: "cohort 1 · 3.1pp off · cohort 2 · 1.8pp off",
      },
      {
        q: "what does the interview look like?",
        a: "20 minutes. 3 reasoning questions scored on a 4-point rubric. 1 written-code block scored on correctness and clarity. 1 pushback round where the ai disagrees with you and you defend.",
        cmd: "$ cat interview-format.md",
        stat: "20 min · 3 reasoning · 1 code · 1 pushback",
      },
      {
        q: "can I retake the interview?",
        a: "yes, after 30 days. the rubric is the same, the questions are different, your prior answers are not shared with the new interviewer.",
        cmd: "$ reapply --cohort 2026-q3",
        stat: "30-day cooldown · fresh questions · no carryover",
      },
      {
        q: "what if the ai says no and I think it was wrong?",
        a: "submit a feedback form. every reject is reviewed by a human within 48h. if the rubric was misapplied, we overturn and re-offer. cohort 1: 7% of rejects were overturned. cohort 2: 4.1%.",
        cmd: "$ feedback --cohort 2026-q3",
        stat: "cohort 1 · 7% overturn · cohort 2 · 4.1%",
      },
      {
        q: "is the open beta's review engine the same as the main interview?",
        a: "no. the open beta uses a deterministic 4-axis rubric (comprehension-under-pressure, shipped-and-measured, defensive-thinking, trade-off-articulation) applied to a 5-day sprint. the main interview is a 20-min live screen with an LLM recruiter. the open beta is a free, separate track to get a cert while cohort 1 is running.",
        cmd: "$ diff beta-rubric interview-rubric",
        stat: "deterministic vs. live",
      },
    ],
  },
  {
    id: "logistics",  name: "logistics", icon: "clock",
    items: [
      {
        q: "when do cohorts start?",
        a: "1 of 4 starts in 2026: march, june, september, december. each cohort runs 8 weeks. you can defer a cohort once with 7 days notice.",
        cmd: "$ cohort --list 2026",
        stat: "mar · jun · sep · dec",
      },
      {
        q: "how many hours a week?",
        a: "10–15 hours per week. most interns do 12. you can do more, but the work is paced for a student taking a full course load.",
        cmd: "$ cat time-budget.md",
        stat: "10–15h/wk · 12h mean",
      },
      {
        q: "can I switch tracks mid-cohort?",
        a: "yes, at the end of any sprint. cohort 1 saw 11% of interns switch, mostly from frontend or backend into ai or platform. the cost is 1 sprint of context-loss.",
        cmd: "$ switch-track --to platform",
        stat: "11% switch · 1 sprint context-loss",
      },
      {
        q: "what if I drop out?",
        a: "we refund the cohort fee (post-2026-q3) within the first 7 days. after 7 days, you keep the prs you shipped and a partial cert. you can rejoin a future cohort without re-paying.",
        cmd: "$ cancel --reason schedule-conflict",
        stat: "full refund · 7d · partial cert after 7d · free rejoin",
      },
    ],
  },
];

function GroupIcon({ name }) {
  const iconMap = { file: IconFile, star: IconStar, node: IconNode, clock: IconClock };
  const Icon = iconMap[name] || IconFile;
  return <Icon width={20} height={20} color="var(--ok)" />;
}

export default function FAQPage() {
  useEffect(() => { document.title = "faq — dreamclerk"; }, []);
  useSEO(SEO.faqPage || SEO.faq);

  // Inject the FAQPage rich-result JSON-LD. Re-uses one script element.
  useEffect(() => {
    const id = "dc-jsonld-faq";
    let el = document.getElementById(id);
    if (!el) {
      el = document.createElement("script");
      el.type = "application/ld+json";
      el.id = id;
      document.head.appendChild(el);
    }
    el.textContent = JSON.stringify(SEO.faqSchema(groups.flatMap((g) => g.items)));
    return () => { const x = document.getElementById(id); if (x) x.remove(); };
  }, []);

  return (
    <section className="section faq3" id="faq">
      <div className="wrap faq3__wrap">
        <SectionLabel status="ok">$ man dreamclerk --help</SectionLabel>

        <header className="faq3__head">
          <h1 className="faq3__h1">faq <span className="faq3__h1-mark">19 questions · 4 topics</span></h1>
          <p className="faq3__sub">all questions visible on load. no click-to-open. this is a man-page dump, not an accordion.</p>
        </header>

        {/* topic nav as mono breadcrumb pills */}
        <nav className="faq3__nav" aria-label="topic index">
          {groups.map((g) => (
            <a key={g.id} href={`#group-${g.id}`} className="faq3__nav-pill">
              <GroupIcon name={g.icon} />
              <span className="faq3__nav-pill-name">{g.name}</span>
              <span className="faq3__nav-pill-count">{g.items.length}</span>
            </a>
          ))}
        </nav>

        <div className="faq3__body">
          {groups.map((g) => (
            <section key={g.id} id={`group-${g.id}`} className="faq3__group">
              <header className="faq3__group-head">
                <div className="faq3__group-icon">
                  <GroupIcon name={g.icon} />
                </div>
                <h2 className="faq3__group-name">{g.name.toUpperCase()}({g.items.length})</h2>
                <div className="faq3__group-divider" />
              </header>

              <div className="faq3__list">
                {g.items.map((it, i) => (
                  <article key={i} className="faq3__q">
                    <h3 className="faq3__q-h">
                      <span className="faq3__q-n">Q{String(i + 1).padStart(2, "0")}</span>
                      <span className="faq3__q-txt">{it.q}</span>
                    </h3>
                    <p className="faq3__q-a">{it.a}</p>
                    <div className="faq3__q-foot">
                      <code className="faq3__q-cmd">{it.cmd}</code>
                      <span className="faq3__q-stat">$ {it.stat}</span>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="faq3__cta">
          <a className="btn btn--solid" href="#" data-open-modal data-open-source="faq-cta">
            ask a question <span className="arr" aria-hidden="true">→</span>
          </a>
          <p className="faq3__cta-note">free during 2026-q2 beta · 1,847 in queue · we answer every one within 48h</p>
        </div>

        <p className="legal__back">
          <RouterLink to="/">← back to dreamclerk</RouterLink>
        </p>
      </div>
    </section>
  );
}