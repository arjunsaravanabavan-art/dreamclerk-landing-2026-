const items = [
  {
    q: "\"i walked into the flipkart interview with a dreamclerk certificate. the interviewer asked me to walk through my capstone. i got the offer the next day.\"",
    n: "rohan m.",
    c: "iit roorkee · cse '26",
    t: "junior backend @ nexara",
    s: "4.9 / 5",
  },
  {
    q: "\"i had zero internships. after 2 sprints at vivacity, my github looked like a real engineer's. the verified work record did the talking.\"",
    n: "aanya s.",
    c: "bits pilani · ece '27",
    t: "junior frontend @ vivacity",
    s: "4.8 / 5",
  },
  {
    q: "\"the ai code reviewer is harsher than my actual tech lead. by sprint 3, my prs stopped getting rejected. that was the moment i knew this was different.\"",
    n: "karthik v.",
    c: "nit trichy · ds '26",
    t: "mid ml @ levanto",
    s: "5.0 / 5",
  },
  {
    q: "\"from a tier-3 college, no network, no referrals. dreamclerk was my only on-ramp. i shipped 41 prs in 3 sprints and got 4 interview calls.\"",
    n: "tarun r.",
    c: "vit vellore · cse '26",
    t: "junior devops @ pulsegrid",
    s: "4.7 / 5",
  },
  {
    q: "\"the ai recruiter's first interview rejected me. the rubric was the most useful thing i've ever read. i passed on attempt 2 and got hired by vivacity.\"",
    n: "noor k.",
    c: "iiit hyderabad · cse '27",
    t: "intern frontend @ vivacity",
    s: "4.9 / 5",
  },
];

export default function Testimonials() {
  return (
    <section id="proof">
      <div className="wrap">
        <div className="section-head reveal">
          <div>
            <div className="label">09 · what students shipped</div>
          </div>
          <div>
            <h2>the resume writes itself. <br /> because the work is real.</h2>
            <p className="lede">
              1,847 students in queue. 24 hired this week. 73% interview rate. avg review score 61/100. (we're honest — the bar is high.)
            </p>
          </div>
        </div>

        <div className="testi-grid reveal">
          {items.map((t) => (
            <article className="testi" key={t.n}>
              <div className="testi-score">{t.s} ★</div>
              <p className="testi-q">{t.q}</p>
              <footer>
                <div className="testi-avatar">{t.n[0]}</div>
                <div>
                  <div className="testi-name">{t.n}</div>
                  <div className="testi-meta">{t.c} · {t.t}</div>
                </div>
              </footer>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
