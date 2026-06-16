// Mentions — press-quotes marquee band for landing page.
// 6 quotes (alternating filled/ghost) scrolling right-to-left at a slower tempo than
// the colleges marquee. Used right after the hero on the landing page.
//
// All quotes are HYPOTHETICAL / illustrative — dreamclerk is a new product and has not
// been covered by these outlets. The structure (short pull-quote + outlet name) is the
// landing-page convention; future rewriters will swap in real coverage as it lands.

import { useEffect } from "react";

const mentions = [
  { q: "the closest thing i've seen to a real engineering interview outside of a real engineering interview.", o: "yourstory" },
  { q: "ship code. get reviewed. earn a certificate. a working model for campus recruiting.", o: "inc42" },
  { q: "forget leetcode farms. this is what an internship should look like in 2026.", o: "entrackr" },
  { q: "the cohort is small, the bar is high, the work is real. that's the point.", o: "linkedin news india" },
  { q: "a deliberate counter-bet to the mooc era. simulate the job, don't lecture about it.", o: "the ken" },
  { q: "the certificate is the side-effect. the actual product is the 8 weeks before it.", o: "factor daily" },
];

export default function Mentions() {
  useEffect(() => { document.title = "dreamclerk — a real 8-week internship"; }, []);

  // duplicate once for seamless loop
  const list = [...mentions, ...mentions];

  return (
    <section className="mentions" aria-label="press mentions (illustrative)">
      <div className="wrap mentions__wrap">
        <header className="mentions__head">
          <span className="mentions__kicker">$ what press is saying</span>
          <span className="mentions__note">illustrative — coverage in progress</span>
        </header>
        <div className="mentions__track" role="list">
          {list.map((m, i) => (
            <article
              key={i}
              role="listitem"
              className={`mentions__card ${i % 3 === 0 ? "is-filled" : "is-ghost"}`}
            >
              <p className="mentions__q">“{m.q}”</p>
              <footer className="mentions__o">— {m.o}</footer>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
