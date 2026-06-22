/**
 * Certificate teaser — the lead-in section above the existing Certificate/verify panel.
 *
 * A 2-up layout:
 *  - Left: a real, readable certificate card (the document a recruiter opens). Static
 *    SVG-style DOM with the holder, track, sprint metrics, capstone, signature, and
 *    verify URL. Looks like a real cert, not a jpeg.
 *  - Right: a short terminal-style "claim yours" block with the notify CTA and a
 *    micro-stats strip.
 *
 * The card has a tiny "live" pulse on the signature line so the eye notices it.
 * Sits between Companies and the existing Certificate section so the two read as
 * a paired sequence ("here's the document → here's the verify panel").
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

        <div className="ct-grid reveal">
          {/* ── Real certificate card ─────────────────────────────────────── */}
          <article className="ct-cert" aria-label="sample dreamclerk certificate">
            <div className="ct-cert__corner ct-cert__corner--tl" />
            <div className="ct-cert__corner ct-cert__corner--tr" />
            <div className="ct-cert__corner ct-cert__corner--bl" />
            <div className="ct-cert__corner ct-cert__corner--br" />

            <header className="ct-cert__head">
              <div className="ct-cert__brand">
                <span className="ct-cert__mark" aria-hidden="true" />
                <span className="ct-cert__brandname">dreamclerk</span>
              </div>
              <div className="ct-cert__seal" aria-hidden="true">
                <span>VERIFIED</span>
                <small>sha256 · 8f4a…9c2b</small>
              </div>
            </header>

            <div className="ct-cert__body">
              <p className="ct-cert__eyebrow">certificate of verified work</p>
              <h3 className="ct-cert__name">aanya sharma</h3>
              <p className="ct-cert__track">backend engineering · junior</p>

              <dl className="ct-cert__grid">
                <div className="ct-cert__metric">
                  <dt>sprints completed</dt>
                  <dd>2</dd>
                </div>
                <div className="ct-cert__metric">
                  <dt>prs merged</dt>
                  <dd>34</dd>
                </div>
                <div className="ct-cert__metric">
                  <dt>merge rate</dt>
                  <dd>91%</dd>
                </div>
                <div className="ct-cert__metric">
                  <dt>avg review</dt>
                  <dd>84<span className="ct-cert__unit">/100</span></dd>
                </div>
                <div className="ct-cert__metric ct-cert__metric--wide">
                  <dt>capstone</dt>
                  <dd className="ct-cert__code">"rate-limiter middleware"</dd>
                </div>
                <div className="ct-cert__metric ct-cert__metric--wide">
                  <dt>company</dt>
                  <dd>vivacity</dd>
                </div>
              </dl>
            </div>

            <footer className="ct-cert__foot">
              <div className="ct-cert__sig">
                <span className="ct-cert__sigdot" aria-hidden="true" />
                <span>signature ok</span>
              </div>
              <div className="ct-cert__url">dreamclerk.com/v/dc-2026-8f4a-9c2b</div>
              <div className="ct-cert__date">issued 2026-07-12</div>
            </footer>
          </article>

          {/* ── Terminal claim block ──────────────────────────────────────── */}
          <aside className="ct-claim">
            <div className="ct-claim__cmd">$ claim --yours</div>
            <p className="ct-claim__lede">
              join the beta, ship real work, earn a work record that recruiters
              actually open.
            </p>

            <ul className="ct-claim__points">
              <li><span className="ct-claim__ok">●</span> cryptographically signed</li>
              <li><span className="ct-claim__ok">●</span> links to your merged prs and reviews</li>
              <li><span className="ct-claim__ok">●</span> one-click verify page for recruiters</li>
            </ul>

            <a
              href="#"
              className="btn btn--solid ct-claim__btn"
              data-open-modal
              data-open-source="cert-teaser"
            >
              claim yours <span className="arr" aria-hidden="true">→</span>
            </a>

            <p className="ct-claim__note">
              free during beta · open to indian undergraduates.
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}
