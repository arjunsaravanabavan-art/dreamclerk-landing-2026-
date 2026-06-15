const items = [
  {
    file: "rohan.md",
    q: "i walked into the flipkart interview with a dreamclerk certificate. the interviewer asked me to walk through my capstone. i got the offer the next day.",
    n: "rohan m.",
    c: "iit roorkee · cse '26",
    t: "junior backend @ nexara",
  },
  {
    file: "aanya.md",
    q: "i had zero internships. after 2 sprints at vivacity, my github looked like a real engineer's. the verified work record did the talking.",
    n: "aanya s.",
    c: "bits pilani · ece '27",
    t: "junior frontend @ vivacity",
  },
  {
    file: "karthik.md",
    q: "the ai code reviewer is harsher than my actual tech lead. by sprint 3, my prs stopped getting rejected. that was the moment i knew this was different.",
    n: "karthik v.",
    c: "nit trichy · ds '26",
    t: "mid ml @ levanto",
  },
];

export default function Testimonials() {
  return (
    <section id="proof" className="section">
      <div className="wrap">
        <header className="section-head reveal">
          <div className="section-head__label">
            <span className="cmd">$ cat /home/alumni/</span>
            <span>alumni.log</span>
          </div>
          <div className="section-head__body">
            <h2 className="section-head__title">the resume writes itself. <br /> because the work is real.</h2>
            <p className="section-head__lede">
              1,847 students in queue. 24 hired this week. 73% interview rate. avg review score 61/100. (we're honest — the bar is high.)
            </p>
          </div>
        </header>

        <div className="testimonials reveal">
          {items.map((t) => (
            <article className="testi" key={t.file}>
              <div className="testi__head">
                <span className="path">$ cat /home/alumni/<b>{t.file}</b></span>
              </div>
              <blockquote>{t.q}</blockquote>
              <div className="testi__who">
                <div className="testi__avatar" aria-hidden="true">{t.n[0]}</div>
                <div>
                  <div className="name">{t.n}</div>
                  <div className="meta">{t.c} · {t.t}</div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
