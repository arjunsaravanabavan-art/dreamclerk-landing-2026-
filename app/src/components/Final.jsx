import { useEffect, useState } from "react";

const verbs = ["ship", "merge", "deploy", "review", "certify", "earn", "place"];

export default function Final() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % verbs.length), 1600);
    return () => clearInterval(t);
  }, []);

  return (
    <section id="apply" className="final-band section">
      <div className="wrap final reveal">
        <div className="final-l">
          <span className="ps1">$</span> dreamclerk --apply{" "}
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
            <label htmlFor="qa" className="visually-hidden">your college email</label>
            <input id="qa" type="email" required placeholder="you@college.edu" autoComplete="email" />
            <button type="submit" className="btn">
              apply
              <span className="arr">→</span>
            </button>
          </form>
          <div className="pulse-row" aria-hidden="true">
            <span className="live" />
            <span>{verbs[i]}…</span>
            <span className="meta">5 students applied in the last minute</span>
          </div>
        </div>
      </div>
    </section>
  );
}
