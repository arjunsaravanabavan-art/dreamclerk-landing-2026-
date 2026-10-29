const featuredCompanies = [
  { code: "C01", name: "orbit labs", field: "AI & machine learning", track: "AI/ML engineering", tone: "violet", mark: "O" },
  { code: "C02", name: "nexara", field: "Fintech & payments", track: "Backend engineering", tone: "green", mark: "N" },
  { code: "C03", name: "vaultx", field: "Cybersecurity", track: "Security engineering", tone: "red", mark: "V" },
  { code: "C04", name: "meridian", field: "B2B SaaS", track: "Full-stack engineering", tone: "gold", mark: "M" },
];

export default function InternshipPromo() {
  return (
    <section className="section internship-promo" id="internships">
      <div className="wrap">
        <div className="section-head reveal">
          <div className="section-head__label">
            <span className="cmd">$ internships --explore</span>
            <span>your next step</span>
          </div>
          <div className="section-head__body">
            <h2 className="section-head__title">
              get your online internship with <em className="heading-accent" style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontWeight: 400 }}>dreamclerk</em>.
            </h2>
            <p className="section-head__lede">
              Build hands-on experience inside simulated companies. Ship practical work, develop real-world skills, and create a portfolio employers can review.
            </p>
            <a className="btn btn--solid" href="#companies">
              explore all companies <span className="arr" aria-hidden="true">→</span>
            </a>
          </div>
        </div>

        <div className="internship-companies" aria-label="Featured simulated companies">
          <div className="internship-companies__topline">
            <span className="internship-companies__eyebrow">A QUICK LOOK INSIDE</span>
            <span className="internship-companies__count">04 / 06 SIMULATED SCENARIOS</span>
          </div>
          <div className="internship-companies__grid">
            {featuredCompanies.map((company) => (
              <a
                className="internship-company-card"
                href="#companies"
                key={company.code}
                aria-label={`Explore ${company.name}, ${company.track}`}
              >
                <div className="internship-company-card__head">
                  <span className={`internship-company-card__mark internship-company-card__mark--${company.tone}`} aria-hidden="true">
                    {company.mark}
                  </span>
                  <span className="internship-company-card__code">{company.code}</span>
                  <span className="internship-company-card__arrow" aria-hidden="true">↗</span>
                </div>
                <h3>{company.name}</h3>
                <p className="internship-company-card__field">{company.field}</p>
                <div className="internship-company-card__footer">
                  <span>{company.track}</span>
                  <span className="internship-company-card__link">view track →</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
