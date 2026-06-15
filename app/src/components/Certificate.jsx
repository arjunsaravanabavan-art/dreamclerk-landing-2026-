export default function Certificate() {
  return (
    <section id="certificate" className="section">
      <div className="wrap">
        <header className="section-head reveal">
          <div className="section-head__label">
            <span className="cmd">$ verify --cert dc-2026-8f4a-9c2b</span>
            <span>the certificate</span>
          </div>
          <div className="section-head__body">
            <h2 className="section-head__title">
              not a completion badge.<br />a verified <em style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontWeight: 400 }}>work record</em>.
            </h2>
            <p className="section-head__lede">
              every certificate is cryptographically signed and contains your actual code, prs, ai review scores, sprint velocity, and capstone deliverable. employers can verify in one click.
            </p>
          </div>
        </header>

        <div className="cert reveal">
          <div className="cert__panel" role="img" aria-label="dreamclerk certificate verification panel">
            <div className="ttl">
              <span>●</span><span style={{ color: "var(--paper)" }}>verify</span>
              <span style={{ marginLeft: "auto" }} className="ok">● signature ok</span>
            </div>
<pre>
<span className="c"># dreamclerk · certificate of verified work</span>
<span className="c"># issued: 2026-07-12 · sha256: 8f4a…9c2b</span>

cert:
  holder:       <span className="k">aanya sharma</span>
  track:        <span className="k">backend engineering</span>
  level:        <span className="k">junior</span>
  company:      <span className="k">vivacity</span>
  sprints:      <span className="n">2</span>
  prs_merged:   <span className="n">34</span>
  pr_merge_rate:<span className="n">91%</span>
  avg_review:   <span className="n">84</span><span className="k">/100</span>
  incidents:    <span className="n">2</span>
  capstone:     <span className="s">"rate-limiter middleware"</span>

verify_url: <span className="k">dreamclerk.com/v/dc-2026-8f4a-9c2b</span>
</pre>
          </div>

          <aside className="cert__side">
            <h3>what's in it.</h3>
            <p>
              your cert is not a jpeg. it links directly to your merged prs, your review threads, and your capstone repo. employers can audit the entire trail in 30 seconds.
            </p>
            <ul className="cert__checklist">
              <li>line-level ai code reviewer notes, timestamped</li>
              <li>pr-merge rate + review score per sprint</li>
              <li>capstone repo, deploy link, and live demo</li>
              <li>incident postmortems you authored</li>
              <li>sha256 signature of the work record</li>
              <li>one-click verify page for recruiters</li>
            </ul>
            <a className="btn btn--ghost" href="#faq" style={{ marginTop: 16, alignSelf: "flex-start" }}>
              see how recruiters use it <span className="arr" aria-hidden="true">→</span>
            </a>
          </aside>
        </div>
      </div>
    </section>
  );
}
