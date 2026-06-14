import { useEffect, useState } from "react";

export default function Hero() {
  const [strike, setStrike] = useState(false);
  useEffect(() => { const t = setTimeout(() => setStrike(true), 1500); return () => clearTimeout(t); }, []);

  return (
    <section id="top">
      <div className="wrap">
        <div className="meta">
          <span className="chip">
            <span className="dot" /> build /public · v0.9.2
          </span>
          <span>·</span>
          <span>last ship · 2026-06-12</span>
          <span className="ml-auto chip">
            <span className="dot" /> accepting the next 200 students · 1,847 in queue
          </span>
        </div>

        <h1 className="hero-title">no more unemployment.</h1>

        <p className="hero-sub">
          live the job. before you land it. <br />
          apply, get hired by an ai recruiter, ship code in a full in-browser ide, get reviewed, earn xp, and leave with a verified work record.
        </p>

        <div className="hero-cta">
          <button className="btn solid" onClick={() => document.dispatchEvent(new CustomEvent('open-modal'))}>
            get notified <span className="arr">→</span>
          </button>
          <a href="#workspace" className="btn ghost">
            see the workspace <span className="arr">↓</span>
          </a>
          <span className="tag">for indian undergraduates · free during beta · built in chennai</span>
        </div>

        <div className="ticker" aria-label="live pr activity">
          <div className="ticker-head">
            <span className="dot" /> live · pr activity · last 24h
          </div>
          <ul className="ticker-list">
            <li><b>rohan</b> @ <b>nexara</b> · <span>rate limiter · middleware</span> · <b>91/100</b></li>
            <li><b>aanya</b> @ <b>vivacity</b> · <span>checkout flow · react</span> · <b>87/100</b></li>
            <li><b>karthik</b> @ <b>oxygon</b> · <span>bert fine-tune · f1 0.87</span> · <b>82/100</b></li>
            <li><b>mira</b> @ <b>levanto</b> · <span>sql query opt · 3.2s → 220ms</span> · <b>94/100</b></li>
          </ul>
        </div>
      </div>
    </section>
  );
}
