export default function Final() {
  return (
    <section id="final">
      <div className="wrap">
        <div className="final reveal">
          <div className="final-num">/ end · transmission complete</div>
          <h2>the rest of the internet teaches you to code.</h2>
          <h2><em>we hand you the job.</em></h2>
          <p>
            the next cohort opens july 14. applications close july 7. 60 seats. 1 track. 1 sprint. 1 verified work record at the end.
          </p>
          <div className="cta">
            <button className="btn solid" onClick={() => document.dispatchEvent(new CustomEvent('open-modal'))}>
              get notified <span className="arr">→</span>
            </button>
          </div>
          <div className="seats">
            <div className="meter"><span style={{ width: "74%" }} /></div>
            <div className="info">
              <span><b>60</b> seats</span>
              <span><b>44</b> applied</span>
              <span><b>16</b> left</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
