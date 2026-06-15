import { useEffect, useRef, useState } from "react";

const items = [
  {
    name: "aanya sharma",
    track: "backend · vivacity",
    grad: "vit '25",
    quote:
      "i had 11 companies reject me on linkedin. i shipped 34 prs in 8 weeks at vivacity. 2 of those reviewers are now my references. i have a job now.",
  },
  {
    name: "karthik r",
    track: "ai/ml · oxygen",
    grad: "iitm '25",
    quote:
      "the cert is the part i did not expect. an interviewer opened it, audited three of my prs in real time, said 'this is real work'. offer extended on the spot.",
  },
  {
    name: "mira patil",
    track: "data · levanto",
    grad: "bits '25",
    quote:
      "i joined thinking it was a coding bootcamp with a marketing page. it was not. it was a 9-to-6 sprint with deadlines, prs, and a real tech lead. the closest thing to a first job before a first job.",
  },
];

export default function Testimonials() {
  const wrapRef = useRef(null);
  const [typed, setTyped] = useState(items.map(() => ""));
  const ranOnce = useRef(false);

  useEffect(() => {
    if (!wrapRef.current) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && !ranOnce.current) {
            ranOnce.current = true;
            // type each quote in parallel
            items.forEach((it, idx) => {
              let i = 0;
              const tick = () => {
                i += 2;
                setTyped((cur) => {
                  const c = cur.slice();
                  c[idx] = it.quote.slice(0, i);
                  return c;
                });
                if (i < it.quote.length) setTimeout(tick, 22);
                else setTyped((cur) => {
                  const c = cur.slice();
                  c[idx] = it.quote;
                  return c;
                });
              };
              setTimeout(tick, idx * 240);
            });
          }
        }
      },
      { threshold: 0.25 }
    );
    io.observe(wrapRef.current);
    return () => io.disconnect();
  }, []);

  return (
    <section id="alumni" className="section">
      <div className="wrap">
        <header className="section-head reveal">
          <div className="section-head__label">
            <span className="cmd">$ cat /home/alumni/*.md</span>
            <span>in their words</span>
          </div>
          <div className="section-head__body">
            <h2 className="section-head__title">
              "i had 11 companies reject me on linkedin."<br />
              <em style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontWeight: 400 }}>— aanya, vit '25</em>
            </h2>
            <p className="section-head__lede">
              short, honest, from students who got placed in the last 6 months. not testimonials from founders. not testimonials from friends.
            </p>
          </div>
        </header>

        <div className="testimonials reveal" ref={wrapRef}>
          {items.map((it, i) => (
            <article className="testi" key={it.name}>
              <header>
                <span className="ps1">$</span> cat /home/alumni/<span className="path">{it.name.replace(/ /g, "-")}.md</span>
              </header>
              <pre className="quote">{typed[i]}{typed[i].length < it.quote.length && <span className="caret" />}</pre>
              <footer>
                <div className="l">
                  <span className="dot" /> {it.name} · {it.track}
                </div>
                <div className="r">{it.grad}</div>
              </footer>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
