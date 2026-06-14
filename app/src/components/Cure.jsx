export default function Cure() {
  return (
    <section id="cure">
      <div className="wrap">
        <div className="reveal">
          <div className="section-head">
            <div>
              <div className="label">04 · the solution</div>
            </div>
            <div>
              <h2>your degree doesn't cure unemployment.</h2>
              <p className="lede">
                india graduates 1.5 million engineers a year. 60% are unemployable on day one — not because they're stupid, but because no one has ever once asked them to do the job.
              </p>
            </div>
          </div>

          <div className="cure-grid">
            <div className="cure-list">
              {[
                ["1.", "the education system teaches syntax.", "industry needs shipped code under pressure."],
                ["2.", "tutorials give answers.", "pr reviews teach defence."],
                ["3.", "moocs measure attendance.", "dreamclerk measures prs merged."],
                ["4.", "completion badges sit on linkedin.", "code sits on github."],
                ["5.", "internships are gated.", "we are not."],
              ].map(([n, a, b]) => (
                <div className="cure-item" key={n}>
                  <span className="n">{n}</span>
                  <div>
                    <strong>{a}</strong>
                    <p>{b}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="rx-card">
              <div className="rx-head">
                <div className="rx-pulse" />
                <span>prescription · DC-2026</span>
              </div>
              <div className="rx-body">
                <p className="rx-diagnosis">SYMPTOMS</p>
                <ul>
                  <li><span>·</span> no work record</li>
                  <li><span>·</span> no pr reviews</li>
                  <li><span>·</span> no production exposure</li>
                  <li><span>·</span> no recruiter-verifiable proof</li>
                </ul>
                <p className="rx-diagnosis" style={{ marginTop: 18 }}>RX</p>
                <p className="rx-text">
                  dreamclerk · 1 simulated sprint · 8 wks · 18 production-grade tickets · 1 verified certificate · ₹1,999
                </p>
                <button
                  className="btn solid"
                  data-open-modal
                  data-open-source="cure-rx"
                  style={{ marginTop: 18, width: "100%", justifyContent: "center" }}
                >
                  get notified <span className="arr">→</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
