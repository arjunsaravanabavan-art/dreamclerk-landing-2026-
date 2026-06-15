import { useEffect, useState } from "react";

export default function Hero() {
  const [strike, setStrike] = useState(false);
  useEffect(() => { const t = setTimeout(() => setStrike(true), 1500); return () => clearTimeout(t); }, []);

  return (
    <section className="section hero" id="top">
      <div className="wrap">
        <div className="hero__meta">
          <span className="chip"><span className="dot" /> build /public · v0.9.2</span>
          <span>·</span>
          <span>last ship · 2026-06-12</span>
          <span className="chip" style={{ marginLeft: "auto" }}>
            <span className="dot" /> accepting the next 200 students · 1,847 in queue
          </span>
        </div>

        <h1 className="hero__title">
          no more <span className="pill">unemployment</span>.
          <br />
          ship code. <span className="serif">get reviewed.</span>
        </h1>

        <p className="hero__sub">
          live the job before you land it. apply, get hired by an ai recruiter, ship code in a full in-browser ide, get reviewed, earn xp, and leave with a verified work record — not a "course".
        </p>

        <div className="hero__ctas">
          <a className="btn btn--solid" href="#" data-open-modal data-open-source="hero-cta">
            get notified <span className="arr" aria-hidden="true">→</span>
          </a>
          <a className="btn btn--ghost" href="#workspace">
            see the workspace <span className="arr" aria-hidden="true">↓</span>
          </a>
          <span className="tag">for indian undergraduates · free during beta · built in chennai</span>
        </div>

        <div className="ticker" aria-label="live pr activity">
          <div className="ticker__head">
            <span className="dot" /> live · pr activity · last 24h
          </div>
          <ul className="ticker__list">
            <li><span className="user">rohan</span> @ <b>nexara</b> · <span>rate limiter · middleware</span><span className="score">91/100</span></li>
            <li><span className="user">aanya</span> @ <b>vivacity</b> · <span>checkout flow · react</span><span className="score">87/100</span></li>
            <li><span className="user">karthik</span> @ <b>oxygon</b> · <span>bert fine-tune · f1 0.87</span><span className="score">82/100</span></li>
            <li><span className="user">mira</span> @ <b>levanto</b> · <span>sql query opt · 3.2s → 220ms</span><span className="score">94/100</span></li>
          </ul>
        </div>
      </div>
    </section>
  );
}
