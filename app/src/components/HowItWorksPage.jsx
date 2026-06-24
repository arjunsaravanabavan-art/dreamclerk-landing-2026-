import { useEffect, useRef, useState } from "react";
import SectionLabel from "./SectionLabel.jsx";
import { IconCheck, IconClock, IconTerminal, IconRocket, IconCode, ArrowRight, IconStar } from "./Svg.jsx";
import { useSEO, SEO } from "../lib/seo.js";
import { RouterLink } from "../lib/router.jsx";

/**
 * HowItWorksPage — REAL-WORK TIMELINE.
 *
 * 8 vertical beats that animate as the user scrolls. Each beat is a
 * real artifact you'd see at a real job: a PR card, a review thread,
 * a slack message, a terminal output, a code diff, a certificate.
 *
 * The timeline covers intern → junior → mid → senior → lead → hire,
 * with the work that real engineers actually do at each level.
 *
 * Beats are scroll-triggered via IntersectionObserver; the global
 * progress bar at the top of the page fills as the user scrolls.
 */
const beats = [
  {
    n: "01", who: "you", role: "intern", cmd: "apply", color: "intern",
    title: "you apply in 90 seconds",
    blurb: "1-page form, 800 chars on why you want this, 1 link. no resume, no essay. the form rejects multi-page resumes and 'references available on request'.",
    artifacts: [
      { type: "form", body: { name: "—", email: "—", uni: "—", year: "—", why: "—", link: "—" }, status: "draft" },
    ],
  },
  {
    n: "02", who: "ai", role: "recruiter", cmd: "interview", color: "ai",
    title: "the ai recruiter runs a 20-min screen",
    blurb: "3 reasoning questions on a 4-point rubric. 1 written-code block on correctness + clarity. 1 pushback round — the ai disagrees with your answer, you defend. 31% first-attempt pass rate.",
    artifacts: [
      { type: "chat", speaker: "ai", text: "you have 6 months of open-source. walk me through a bug you shipped in production and how you caught it." },
      { type: "chat", speaker: "you", text: "we had a token-replay bug in our jwt flow. the same token was being accepted twice. caught it because a senior pointed out a missing jti claim check in the auth middleware." },
      { type: "chat", speaker: "ai", text: "good. the test you wrote — does it actually exercise the replay, or does it only test that an expired token is rejected?" },
      { type: "chat", speaker: "you", text: "honestly, only the expiry case. the replay test is on my list." },
      { type: "rubric", score: 4, label: "reasoning — concrete example + honest gap" },
    ],
  },
  {
    n: "03", who: "ai", role: "system", cmd: "offer", color: "ai",
    title: "you get hired. cohort + track + 3 company preferences.",
    blurb: "cohort start date, track offer, your top 3 of 6 companies. you do not pick a company before the interview — picks happen after offer.",
    artifacts: [
      { type: "offer", cohort: "2026-q3", track: "backend", date: "2026-09-01", companyPrefs: ["nexara", "vivacity", "oxygon"] },
    ],
  },
  {
    n: "04", who: "you", role: "intern", cmd: "onboard", color: "intern",
    title: "your first day. ssh key, ide, slack, first ticket.",
    blurb: "real first day. you read 2k lines of an existing feature and write a 1-paragraph summary. you get one 'good first issue' to ship in week 1.",
    artifacts: [
      { type: "slack", channel: "#nexara-onboarding", who: "priya (tech lead)", text: "👋 welcome. read `src/auth/middleware.ts` end-to-end. by friday, post a 1-paragraph summary in #nexara-eng. first ticket assigned: T-1042." },
      { type: "ticket", id: "T-1042", title: "good first issue: fix typo in docs/api/auth.md", points: 1, time: "30 min" },
    ],
  },
  {
    n: "05", who: "you + ai", role: "junior", cmd: "sprint · 1–5", color: "junior",
    title: "5 sprints of real work. real prs, real reviews.",
    blurb: "5-8 tickets per sprint, scoped to your level. pr → ai review → 2-3 review rounds → merge. the harder the pr, the more review rounds.",
    artifacts: [
      { type: "pr", num: "NX-1042", title: "feat: add idempotency-key middleware to /capture", lines: "+184 −12", files: 4, reviewRounds: 3, time: "2 days" },
      { type: "review", who: "tech-lead", line: 8, txt: "cover expiry, replay, role-claim — see 3 cases below" },
      { type: "review", who: "reviewer", line: 13, txt: "good. add a negative case for malformed tokens." },
      { type: "review", who: "tech-lead", line: 16, txt: "★ lgtm — ship it." },
      { type: "terminal", cmd: "git push origin HEAD", out: "remote: opened pr #142 → ci running → 14/14 tests pass" },
    ],
  },
  {
    n: "06", who: "you", role: "mid", cmd: "sprint · 6 — capstone", color: "mid",
    title: "the capstone. one feature, end-to-end, shipped behind a flag.",
    blurb: "a real feature, 500-1500 lines, design + impl + ship + post-mortem. nothing in this sprint is graded. it is graded by the people who use it.",
    artifacts: [
      { type: "pr", num: "NX-1107", title: "feat: token-bucket rate limiter for /charge (capstone)", lines: "+1124 −87", files: 11, reviewRounds: 5, time: "8 days" },
      { type: "diff", before: "if (rate > 100) reject()", after: "const bucket = tokenBucket({ rps: 100, burst: 200, key: ip });\nif (!bucket.consume()) return new Response('rate-limited', { status: 429 });" },
    ],
  },
  {
    n: "07", who: "you + lead", role: "senior", cmd: "sprint · 7 — review", color: "senior",
    title: "you are now a reviewer. you shadow 3 interns at lower levels.",
    blurb: "you do real pr merges for 1 sprint. you read 200+ lines of other people's code every day. you write 1-pagers on your reviews. this is the part of being senior nobody tells you about.",
    artifacts: [
      { type: "slack", channel: "#nexara-eng", who: "you", text: "reviewed PR #158 from @anand (intern). flagged 2 issues: missing index on (org_id, created_at) and a race in the cache invalidation. left 14 inline comments." },
    ],
  },
  {
    n: "08", who: "you", role: "lead", cmd: "hire", color: "lead",
    title: "the certificate. signed. public. recruiters read it.",
    blurb: "your prs, your review scores, your sprint velocity, your capstone — all signed json, all public, all linkable. 2,400+ unique recruiter opens in 30 days. ~14% get a screening call within 7 days.",
    artifacts: [
      { type: "cert", cohort: "2026-q3", track: "backend", certId: "dc-2026-q3-8f4a-9c2b", prs: 47, reviews: 312, sprintVelocity: "8.4 / 10" },
    ],
  },
];

// ============ Artifact renderers ============

function FormArtifact({ body }) {
  return (
    <div className="tl-art tl-art--form">
      <div className="tl-art__head">$ apply</div>
      <div className="tl-art__body">
        {Object.entries(body).map(([k, v]) => (
          <div className="tl-art__form-row" key={k}>
            <span className="tl-art__form-k">{k}</span>
            <span className="tl-art__form-v">{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ChatArtifact({ items }) {
  return (
    <div className="tl-art tl-art--chat">
      {items.map((m, i) => (
        <div key={i} className={`tl-art__msg tl-art__msg--${m.speaker}`}>
          <span className="tl-art__msg-who">{m.speaker === "ai" ? "$ ai-recruiter" : "$ you"}</span>
          <p className="tl-art__msg-text">{m.text}</p>
        </div>
      ))}
      {items.find((m) => m.type === "rubric") && (
        <div className="tl-art__rubric">
          <span className="tl-art__rubric-score">{items.find((m) => m.type === "rubric").score}/4</span>
          <span className="tl-art__rubric-label">{items.find((m) => m.type === "rubric").label}</span>
        </div>
      )}
    </div>
  );
}

function RubricOnly({ score, label }) {
  return (
    <div className="tl-art tl-art--rubric-only">
      <span className="tl-art__rubric-score">{score}/4</span>
      <span className="tl-art__rubric-label">{label}</span>
    </div>
  );
}

function OfferArtifact({ cohort, track, date, companyPrefs }) {
  return (
    <div className="tl-art tl-art--offer">
      <div className="tl-art__head">$ offer.json</div>
      <pre>{`{
  "cohort": "${cohort}",
  "track": "${track}",
  "start": "${date}",
  "company_prefs": [${companyPrefs.map((c) => `"${c}"`).join(", ")}]
}`}</pre>
    </div>
  );
}

function SlackArtifact({ items }) {
  return (
    <div className="tl-art tl-art--slack">
      {items.map((m, i) => (
        <div key={i} className="tl-art__slack-msg">
          <div className="tl-art__slack-head">
            <span className="tl-art__slack-ch">{m.channel}</span>
            <span className="tl-art__slack-who">{m.who}</span>
          </div>
          <p className="tl-art__slack-text">{m.text}</p>
        </div>
      ))}
    </div>
  );
}

function TicketArtifact({ items }) {
  return (
    <div className="tl-art tl-art--tickets">
      {items.map((t, i) => (
        <div key={i} className="tl-art__ticket">
          <div className="tl-art__ticket-head">
            <span className="tl-art__ticket-id">{t.id}</span>
            <span className="tl-art__ticket-pts">{t.points} pt</span>
            <span className="tl-art__ticket-time">~{t.time}</span>
          </div>
          <div className="tl-art__ticket-title">{t.title}</div>
        </div>
      ))}
    </div>
  );
}

function PRArtifact({ items }) {
  return (
    <div className="tl-art tl-art--prs">
      {items.map((p, i) => (
        <div key={i} className="tl-art__pr">
          <div className="tl-art__pr-head">
            <span className="tl-art__pr-status">● open</span>
            <span className="tl-art__pr-num">{p.num}</span>
            <span className="tl-art__pr-title">{p.title}</span>
          </div>
          <div className="tl-art__pr-meta">
            <span><b>{p.lines}</b> lines</span>
            <span><b>{p.files}</b> files</span>
            <span><b>{p.reviewRounds}</b> review rounds</span>
            <span><b>{p.time}</b></span>
          </div>
        </div>
      ))}
    </div>
  );
}

function ReviewArtifact({ items }) {
  return (
    <div className="tl-art tl-art--review">
      {items.map((r, i) => (
        <div key={i} className="tl-art__review-row">
          <span className="tl-art__review-who">{r.who}</span>
          <span className="tl-art__review-ln">L{r.line}</span>
          <span className="tl-art__review-txt">{r.txt}</span>
        </div>
      ))}
    </div>
  );
}

function TerminalArtifact({ items }) {
  return (
    <div className="tl-art tl-art--term">
      {items.map((t, i) => (
        <div key={i} className="tl-art__term-line">
          <span className="tl-art__term-prompt">$</span>
          <span className="tl-art__term-cmd">{t.cmd}</span>
          {t.out && <div className="tl-art__term-out">{t.out}</div>}
        </div>
      ))}
    </div>
  );
}

function DiffArtifact({ items }) {
  return (
    <div className="tl-art tl-art--diff">
      {items.map((d, i) => (
        <div key={i} className="tl-art__diff-pair">
          <div className="tl-art__diff-side tl-art__diff-side--before">
            <div className="tl-art__diff-label">− before</div>
            <code>{d.before}</code>
          </div>
          <ArrowRight width={20} height={20} color="var(--ok)" />
          <div className="tl-art__diff-side tl-art__diff-side--after">
            <div className="tl-art__diff-label">+ after</div>
            <code>{d.after}</code>
          </div>
        </div>
      ))}
    </div>
  );
}

function CertArtifact({ items }) {
  return (
    <div className="tl-art tl-art--certs">
      {items.map((c, i) => (
        <div key={i} className="tl-art__cert">
          <div className="tl-art__cert-head">
            <span className="tl-art__cert-mark">● verified</span>
            <span className="tl-art__cert-id">{c.certId}</span>
          </div>
          <div className="tl-art__cert-grid">
            <div className="tl-art__cert-stat"><span className="tl-art__cert-n">{c.prs}</span><span className="tl-art__cert-l">prs merged</span></div>
            <div className="tl-art__cert-stat"><span className="tl-art__cert-n">{c.reviews}</span><span className="tl-art__cert-l">review comments</span></div>
            <div className="tl-art__cert-stat"><span className="tl-art__cert-n">{c.sprintVelocity}</span><span className="tl-art__cert-l">sprint velocity</span></div>
          </div>
          <div className="tl-art__cert-foot">$ verify --cert {c.certId}</div>
        </div>
      ))}
    </div>
  );
}

// ============ Beat renderer ============

function Beat({ beat, isActive }) {
  const renderArtifact = (a, i) => {
    switch (a.type) {
      case "form":    return <FormArtifact key={i} body={a.body} />;
      case "chat":    return null; // rendered as a group
      case "rubric":  return null;
      case "offer":   return <OfferArtifact key={i} cohort={a.cohort} track={a.track} date={a.date} companyPrefs={a.companyPrefs} />;
      case "slack":   return null;
      case "ticket":  return null;
      case "pr":      return null;
      case "review":  return null;
      case "terminal":return null;
      case "diff":    return null;
      case "cert":    return null;
      default:        return null;
    }
  };

  // Group artifacts by type
  const groups = [];
  let i = 0;
  while (i < beat.artifacts.length) {
    const a = beat.artifacts[i];
    if (["chat", "rubric", "slack", "ticket", "pr", "review", "terminal", "diff", "cert"].includes(a.type)) {
      const same = beat.artifacts.filter((x) => x.type === a.type);
      groups.push({ type: a.type, items: same });
      i += same.length;
    } else {
      groups.push({ type: a.type, items: [a] });
      i += 1;
    }
  }

  return (
    <div className={`how2__beat how2__beat--${beat.color} ${isActive ? "is-active" : ""}`}>
      <div className="how2__beat-rail">
        <div className="how2__beat-dot" />
      </div>
      <div className="how2__beat-card">
        <div className="how2__beat-head">
          <span className="how2__beat-n">[{beat.n}]</span>
          <span className="how2__beat-role">{beat.role}</span>
          <span className="how2__beat-cmd">$ {beat.cmd}</span>
          <span className="how2__beat-who">— {beat.who}</span>
        </div>
        <h2 className="how2__beat-title">{beat.title}</h2>
        <p className="how2__beat-blurb">{beat.blurb}</p>

        <div className="how2__beat-arts">
          {groups.map((g, gi) => {
            if (g.type === "chat") return <ChatArtifact key={gi} items={g.items} />;
            if (g.type === "rubric") {
              const r = g.items[0];
              return <RubricOnly key={gi} score={r.score} label={r.label} />;
            }
            if (g.type === "slack") return <SlackArtifact key={gi} items={g.items} />;
            if (g.type === "ticket") return <TicketArtifact key={gi} items={g.items} />;
            if (g.type === "pr") return <PRArtifact key={gi} items={g.items} />;
            if (g.type === "review") return <ReviewArtifact key={gi} items={g.items} />;
            if (g.type === "terminal") return <TerminalArtifact key={gi} items={g.items} />;
            if (g.type === "diff") return <DiffArtifact key={gi} items={g.items} />;
            if (g.type === "cert") return <CertArtifact key={gi} items={g.items} />;
            return null;
          })}
        </div>
      </div>
    </div>
  );
}

export default function HowItWorksPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const beatRefs = useRef([]);
  useSEO(SEO.how);
  useEffect(() => { document.title = "how it works — dreamclerk"; }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const idx = Number(e.target.dataset.index);
            setActiveIndex(idx);
          }
        });
      },
      { threshold: 0.25, rootMargin: "-20% 0px -40% 0px" }
    );
    beatRefs.current.forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const total = doc.scrollHeight - doc.clientHeight;
      const p = total > 0 ? window.scrollY / total : 0;
      setProgress(Math.min(1, Math.max(0, p)));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="section how2" id="how">
      <div className="how2__progress" aria-hidden="true">
        <div className="how2__progress-fill" style={{ width: `${progress * 100}%` }} />
      </div>

      <div className="wrap how2__wrap">
        <SectionLabel status="ok">$ ./protocol --live</SectionLabel>

        <header className="how2__head">
          <h1 className="how2__h1">real work, not courses.</h1>
          <p className="how2__sub">a scrollable timeline of what actually happens — intern, junior, mid, senior, lead. 8 beats, 8 weeks. each beat is a real artifact you'd see at a real job: a pr, a review thread, a slack message, a code diff, a certificate.</p>
        </header>

        {/* timeline */}
        <ol className="how2__timeline">
          {beats.map((b, i) => (
            <li
              key={b.n}
              ref={(el) => (beatRefs.current[i] = el)}
              data-index={i}
            >
              <Beat beat={b} isActive={activeIndex === i} />
            </li>
          ))}
        </ol>

        {/* the loop outro */}
        <div className="how2__loop">
          <h2 className="how2__loop-h">then the loop repeats. you ship a new sprint, get a new review, get a new level, get a new offer.</h2>
          <div className="how2__loop-levels">
            <span className="how2__loop-level">intern</span>
            <ArrowRight width={16} height={16} color="var(--ok)" />
            <span className="how2__loop-level">junior</span>
            <ArrowRight width={16} height={16} color="var(--ok)" />
            <span className="how2__loop-level">mid</span>
            <ArrowRight width={16} height={16} color="var(--ok)" />
            <span className="how2__loop-level">senior</span>
            <ArrowRight width={16} height={16} color="var(--ok)" />
            <span className="how2__loop-level">lead</span>
            <ArrowRight width={16} height={16} color="var(--ok)" />
            <span className="how2__loop-level how2__loop-level--final">hired</span>
          </div>
        </div>

        <div className="how2__cta">
          <a className="btn btn--solid" href="#" data-open-modal data-open-source="how-cta">
            start at beat 01 <span className="arr" aria-hidden="true">→</span>
          </a>
          <p className="how2__cta-note">free during 2026-q2 beta · 1,847 in queue</p>
        </div>

        <p className="legal__back">
          <RouterLink to="/">← back to dreamclerk</RouterLink>
        </p>
      </div>
    </section>
  );
}