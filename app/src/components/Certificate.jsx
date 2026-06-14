export default function Certificate() {
  return (
    <section id="certificate" className="merge-dark" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <div className="section-head reveal">
          <div>
            <div className="label">01 · the certificate</div>
          </div>
          <div>
            <h2>not a completion badge.<br />a verified <span style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontWeight: 400 }}>work record</span>.</h2>
            <p className="lede">
              every certificate is cryptographically signed and contains your actual code, prs, ai review scores, sprint velocity, and capstone deliverable. employers can verify in one click.
            </p>
          </div>
        </div>

        <div className="cert-wrap reveal">
          <div className="cert" role="img" aria-label="dreamclerk experience certificate">
            <div className="cert-stamp">DC · VERIFIED</div>
            <div className="cert-top">
              <span className="brand">dreamclerk</span>
              <span>no. <b>DC-2026-002-341</b></span>
            </div>
            <div className="cert-mid">
              <h5>this is to certify that</h5>
              <h2>aanya sharma</h2>
              <p>successfully completed the requirements for the role of</p>
              <h3>junior backend engineer @ vivacity</h3>
              <p style={{ marginTop: 12 }}>
                having shipped <b>34 prs</b>, fixed <b>2 production incidents</b>, and delivered
                a capstone feature in <b>2 sprints</b>.
              </p>
            </div>
            <div className="cert-grid">
              <div><span>level</span><b>junior</b></div>
              <div><span>sprints</span><b>2</b></div>
              <div><span>pr-merge rate</span><b>91%</b></div>
              <div><span>avg review</span><b>84 / 100</b></div>
              <div><span>capstone</span><b>rate-limiter middleware</b></div>
              <div><span>issued</span><b>july 2026</b></div>
            </div>
            <div className="cert-bottom">
              <div>
                <span>verify →</span>
                <b>dreamclerk.com/v/DC-2026-002-341</b>
              </div>
              <div className="sig">/s/ ai tech lead</div>
            </div>
          </div>

          <aside className="cert-side">
            <h3>what's in it</h3>
            <ul>
              <li><b>34</b> <span>merged prs</span></li>
              <li><b>2</b> <span>production incidents resolved</span></li>
              <li><b>1</b> <span>capstone project</span></li>
              <li><b>84</b> <span>avg review score</span></li>
              <li><b>2</b> <span>sprints completed</span></li>
              <li><b>5</b> <span>technologies shipped</span></li>
            </ul>
            <h3 style={{ marginTop: 24 }}>employer verification</h3>
            <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 14 }}>
              one-click verify shows the linked prs, code, and review threads. no screen shots. no hearsay.
            </p>
            <a className="btn ghost" href="#faq">see a verified record →</a>
          </aside>
        </div>
      </div>
    </section>
  );
}
