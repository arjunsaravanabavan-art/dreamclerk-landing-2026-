export default function Problem() {
  return (
    <section id="problem">
      <div className="wrap">
        <div className="section-head reveal">
          <div>
            <div className="label">03 · the diagnosis</div>
          </div>
          <div>
            <h2>live the job. before you land it.</h2>
            <p className="lede">
              india produces 1.5 million engineers a year. 60% are unemployable on day one — not because they're stupid, but because the system that taught them has never once asked them to do the job.
            </p>
            <p className="experience-note">
              <strong>experience matters more than degrees.</strong> recruiters do not care where you study. they care what you ship. a github profile with merged prs beats a 9-cgpa resume every single time. dreamclerk gives you that experience — verifiable, recruiter-checkable, built sprint by sprint.
            </p>
          </div>
        </div>

        <div className="problem reveal">
          <ul className="problem-list">
            <li>
              <span className="n">/01</span>
              <span className="t">courses <em>teach syntax.</em> jobs require shipping code under pressure.</span>
              <span className="x">→</span>
            </li>
            <li>
              <span className="n">/02</span>
              <span className="t">tutorials <em>give answers.</em> pr reviews give growth.</span>
              <span className="x">→</span>
            </li>
            <li>
              <span className="n">/03</span>
              <span className="t">completion badges <em>measure attendance.</em> companies need proof of work.</span>
              <span className="x">→</span>
            </li>
            <li>
              <span className="n">/04</span>
              <span className="t">resumes <em>claim skills.</em> code on github proves them.</span>
              <span className="x">→</span>
            </li>
            <li>
              <span className="n">/05</span>
              <span className="t">internships <em>are gated by alumni and referrals.</em> the rest are stuck.</span>
              <span className="x">→</span>
            </li>
          </ul>

          <aside className="problem-side" aria-label="prescription">
            <h3>prescription</h3>
            <div className="row"><span className="lbl">patient</span><span>2,400,000 graduates/yr</span></div>
            <div className="row"><span className="lbl">symptom</span><span>no verifiable work record</span></div>
            <div className="row"><span className="lbl">cause</span><span>training ≠ employment</span></div>
            <div className="row"><span className="lbl">dose</span><span>1 simulated sprint, 8 wks</span></div>
            <div className="row"><span className="lbl">side effects</span><span>portfolio, xp, certificate</span></div>
            <div className="rx">rx · dreamclerk</div>
          </aside>
        </div>
      </div>
    </section>
  );
}
