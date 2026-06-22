/**
 * Certificate teaser — the lead-in section above the detailed Certificate/verify panel.
 *
 * A high-level preview of what the certificate IS and a "claim yours" notify CTA.
 * Sits between Companies and the existing Certificate section so the two read as
 * a paired sequence ("here's what it is → here's the verify demo").
 */
export default function CertTeaser() {
  return (
    <section id="cert-teaser" className="section">
      <div className="wrap">
        <header className="section-head reveal">
          <div className="section-head__label">
            <span className="cmd">$ cat /certificate.md</span>
            <span>the certificate</span>
          </div>
          <div className="section-head__body">
            <h2 className="section-head__title">
              your work record, not a badge.
            </h2>
            <p className="section-head__lede">
              signed · audit-trail · one-click verified by employers.
            </p>
          </div>
        </header>

        <div className="cert-teaser reveal">
          {/* Card 1: what's in it */}
          <article className="cert-teaser__card">
            <span className="cert-teaser__cmd">$ cat certificate.yaml</span>
            <div className="cert-teaser__kv">
              <span className="cert-teaser__k">signed:</span>
              <span className="cert-teaser__v">sha256</span>
            </div>
            <div className="cert-teaser__kv">
              <span className="cert-teaser__k">audit:</span>
              <span className="cert-teaser__v">prs + review</span>
            </div>
            <div className="cert-teaser__kv">
              <span className="cert-teaser__k">verify:</span>
              <span className="cert-teaser__v">1-click</span>
            </div>
            <p className="cert-teaser__note">
              every certificate contains your actual code, merge history, and capstone repo.
            </p>
          </article>

          {/* Card 2: claim yours CTA */}
          <article className="cert-teaser__card cert-teaser__card--cta">
            <span className="cert-teaser__cmd">$ claim --yours</span>
            <p className="cert-teaser__lede">
              join the beta, ship real work, earn a work record that recruiters actually open.
            </p>
            <a
              href="#"
              className="btn btn--solid"
              data-open-modal
              data-open-source="cert-teaser"
            >
              claim yours <span className="arr" aria-hidden="true">→</span>
            </a>
            <p className="cert-teaser__note">
              free during beta · open to indian undergraduates.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
