const tiers = [
  {
    n: "trial",
    tag: "free",
    price: "₹0",
    sub: "2 weeks · 1 sprint · 3 tickets",
    cta: "start trial",
    fe: [
      "1 track of your choice",
      "3 production-grade tasks",
      "ai code review",
      "no certificate",
    ],
    cta2: "ghost",
  },
  {
    n: "sprint",
    tag: "most popular",
    price: "₹1,999",
    sub: "8 weeks · 1 sprint · 18 tickets",
    cta: "apply for sprint",
    fe: [
      "1 track · 5 levels",
      "18 production-grade tasks",
      "ai tech lead · 1:1 pr reviews",
      "xp & portfolio generated",
      "verified experience certificate",
    ],
    cta2: "solid",
    featured: true,
  },
  {
    n: "cohort",
    tag: "best value",
    price: "₹6,499",
    sub: "6 months · 3 sprints · 54 tickets",
    cta: "join next cohort",
    fe: [
      "1 track · all 5 levels",
      "54 tasks · 3 capstones",
      "job board access",
      "interview prep + mock loops",
      "1:1 mentor sessions · 6",
    ],
    cta2: "ghost",
  },
  {
    n: "pro",
    tag: "unlimited",
    price: "₹14,999",
    sub: "12 months · 6 sprints · 108 tickets",
    cta: "go pro",
    fe: [
      "unlimited track switches",
      "108 tasks · 6 capstones",
      "guaranteed interview pipeline",
      "career coach · 1:1",
      "hiring partner priority",
    ],
    cta2: "ghost",
  },
];

export default function Pricing() {
  return (
    <section id="pricing">
      <div className="wrap">
        <div className="section-head reveal">
          <div>
            <div className="label">07 · the price of a career</div>
          </div>
          <div>
            <h2>less than a semester. more useful than a degree.</h2>
            <p className="lede">
              transparent pricing in inr. no gmat-style tiers. pay for sprints, not for content you'll never watch.
            </p>
          </div>
        </div>

        <div className="pricing reveal">
          {tiers.map((t) => (
            <div className={"tier " + (t.featured ? "featured" : "")} key={t.n}>
              {t.featured && <div className="ribbon">↗ most popular</div>}
              <div className="name">{t.n}</div>
              <div className="tag">{t.tag}</div>
              <div className="price">{t.price}</div>
              <div className="sub">{t.sub}</div>
              <ul>
                {t.fe.map((f) => <li key={f}>{f}</li>)}
              </ul>
              <a className={"btn " + t.cta2} href="#apply" style={{ width: '100%', justifyContent: 'center' }}>
                {t.cta} <span className="arr">→</span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
