import { useEffect, useRef, useState } from "react";

/**
 * Animated "verify" panel — a real interactive piece in the Certificate section.
 * Phases:
 *  1. idle      — header + skeleton, blinking cursor
 *  2. running   — types each yaml line in sequence (staggered), status pulses
 *  3. verified  — green "● signature ok" + final 2 lines, copy button appears
 *
 * Re-running resets the panel. Auto-runs on first scroll-into-view.
 */
export default function Certificate() {
  const [phase, setPhase] = useState("idle"); // idle | running | verified
  const [lines, setLines] = useState([]);     // rendered lines
  const [copied, setCopied] = useState(false);
  const wrapRef = useRef(null);
  const ranOnce = useRef(false);

  const verifyUrl = "dreamclerk.com/v/dc-2026-8f4a-9c2b";

  const seq = [
    { kind: "c",  t: "# dreamclerk · certificate of verified work" },
    { kind: "c",  t: "# issued: 2026-07-12 · sha256: 8f4a…9c2b" },
    { kind: "sp", t: "" },
    { kind: "k",  t: "cert:",                                       indent: 0 },
    { kind: "kv", key: "holder",        val: "aanya sharma",         indent: 2 },
    { kind: "kv", key: "track",         val: "backend engineering",  indent: 2, kindVal: "k" },
    { kind: "kv", key: "level",         val: "junior",               indent: 2, kindVal: "k" },
    { kind: "kv", key: "company",       val: "vivacity",             indent: 2, kindVal: "k" },
    { kind: "kv", key: "sprints",       val: "2",                    indent: 2, kindVal: "n" },
    { kind: "kv", key: "prs_merged",    val: "34",                   indent: 2, kindVal: "n" },
    { kind: "kv", key: "pr_merge_rate", val: "91%",                  indent: 2, kindVal: "n" },
    { kind: "kv", key: "avg_review",    val: "84/100",               indent: 2, kindVal: "n" },
    { kind: "kv", key: "incidents",     val: "2",                    indent: 2, kindVal: "n" },
    { kind: "kv", key: "capstone",      val: "rate-limiter middleware", indent: 2, kindVal: "s", quote: true },
    { kind: "sp", t: "" },
    { kind: "url", val: verifyUrl },
  ];

  function run() {
    if (phase === "running") return;
    setCopied(false);
    setLines([]);
    setPhase("running");
    seq.forEach((l, i) => {
      setTimeout(() => setLines((cur) => [...cur, l]), 80 + i * 70);
    });
    setTimeout(() => setPhase("verified"), 80 + seq.length * 70 + 220);
  }

  // auto-run when panel scrolls into view (once)
  useEffect(() => {
    if (!wrapRef.current) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && !ranOnce.current) {
            ranOnce.current = true;
            run();
          }
        }
      },
      { threshold: 0.35 }
    );
    io.observe(wrapRef.current);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function copyUrl() {
    try {
      await navigator.clipboard.writeText(verifyUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <section id="certificate" className="section">
      <div className="wrap">
        <header className="section-head reveal">
          <div className="section-head__label">
            <span className="cmd">$ verify --cert dc-2026-8f4a-9c2b</span>
            <span>the certificate</span>
          </div>
          <div className="section-head__body">
            <h2 className="section-head__title">
              not a completion badge.<br />a verified <em style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontWeight: 400 }}>work record</em>.
            </h2>
            <p className="section-head__lede">
              every certificate is cryptographically signed and contains your actual code, prs, ai review scores, sprint velocity, and capstone deliverable. employers can verify in one click.
            </p>
          </div>
        </header>

        <div className="cert reveal">
          <div
            className="cert__panel"
            ref={wrapRef}
            role="img"
            aria-label="dreamclerk certificate verification panel"
          >
            <div className="cert__panel-bar">
              <span className={"dot" + (phase === "verified" ? " live" : "")} />
              <span className="ttl">verify</span>
              <span className={"status " + phase}>
                {phase === "idle" && "○ awaiting run"}
                {phase === "running" && "◐ running"}
                {phase === "verified" && "● signature ok"}
              </span>
              <button
                type="button"
                className="btn cert__run"
                onClick={run}
                disabled={phase === "running"}
                aria-label="Run verify"
              >
                {phase === "running" ? "running…" : phase === "verified" ? "re-run ↻" : "run verify ▶"}
              </button>
            </div>

            <pre className="cert__panel-pre">
{lines.map((l, i) => {
              if (l.kind === "c")  return <div className="ln c" key={i}>{l.t || " "}</div>;
              if (l.kind === "sp") return <div className="ln" key={i}>&nbsp;</div>;
              if (l.kind === "k")  return <div className="ln" key={i}><span style={{ paddingLeft: l.indent * 8 }} className="k">{l.t}</span></div>;
              if (l.kind === "kv") {
                return (
                  <div className="ln" key={i}>
                    <span style={{ paddingLeft: l.indent * 8 }} />
                    <span className="c">{l.key}:</span>
                    &nbsp;
                    <span className={l.kindVal === "k" ? "k" : l.kindVal === "n" ? "n" : l.kindVal === "s" ? "s" : "k"}>
                      {l.quote ? `"${l.val}"` : l.val}
                    </span>
                  </div>
                );
              }
              if (l.kind === "url") {
                return (
                  <div className="ln url" key={i}>
                    <span className="c">verify_url:</span>&nbsp;
                    <button
                      type="button"
                      className="cert__url-btn"
                      onClick={copyUrl}
                      aria-label="Copy verify URL"
                      style={{ minHeight: 44 }}
                    >
                      <span className="k">{l.val}</span>
                      <span className="cert__url-copied" aria-hidden="true">{copied ? "  ✓ copied" : ""}</span>
                    </button>
                  </div>
                );
              }
              return null;
            })}
              {phase === "running" && <span className="cert__cursor" aria-hidden="true" />}
            </pre>

            <div className="cert__panel-foot">
              <span>sha256: 8f4a…9c2b</span>
              <span>issued: 2026-07-12</span>
              <span>verifications: 1,204 / mo</span>
            </div>
          </div>

          <aside className="cert__side">
            <h3>what's in it.</h3>
            <p>
              your cert is not a jpeg. it links directly to your merged prs, your review threads, and your capstone repo. employers can audit the entire trail in 30 seconds.
            </p>
            <ul className="cert__checklist">
              <li>line-level ai code reviewer notes, timestamped</li>
              <li>pr-merge rate + review score per sprint</li>
              <li>capstone repo, deploy link, and live demo</li>
              <li>incident postmortems you authored</li>
              <li>sha256 signature of the work record</li>
              <li>one-click verify page for recruiters</li>
            </ul>
            <div className="cert__side-cta">
              <a className="btn btn--solid" href="#" data-open-modal data-open-source="cert-side">
                get yours <span className="arr" aria-hidden="true">→</span>
              </a>
              <a className="btn btn--ghost" href="#how">
                see how you earn it <span className="arr" aria-hidden="true">↓</span>
              </a>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
