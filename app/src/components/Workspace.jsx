const features = [
  { ic: "M", t: "monaco editor", d: "the same engine that powers vs code, running in your browser tab." },
  { ic: "T", t: "live terminal", d: "real bash, sandboxed per student per task. no shared state." },
  { ic: "D", t: "sandboxed runtime", d: "docker-based microvm. run node, python, java, go safely." },
  { ic: "J", t: "jupyter notebooks", d: "full in-browser notebooks (jupyterlite · wasm) for ml & data tasks." },
  { ic: "S", t: "sql playground", d: "sandboxed postgresql per student. learn by querying real data." },
  { ic: "R", t: "ai code reviewer", d: "line-level feedback on security, performance, readability, edge cases." },
  { ic: "P", t: "pr flow", d: "submit code as a pr. ai tech lead merges or requests changes." },
  { ic: "X", t: "test runner", d: "pre-written test suites. your job: make them pass." },
  { ic: "L", t: "live logs & debug", d: "console logs, error traces, stack inspection. like a real production env." },
  { ic: "F", t: "figma handoff", d: "design spec, asset export, redlines — for frontend tickets." },
  { ic: "A", t: "api tester", d: "postman-style tester for your own endpoints before submitting." },
  { ic: "G", t: "git client", d: "full source control, branch, rebase, merge — all in browser." },
];

export default function Workspace() {
  return (
    <section id="workspace">
      <div className="wrap">
        <div className="section-head reveal">
          <div>
            <div className="label">06 · the workspace</div>
          </div>
          <div>
            <h2>your ide, your terminal, your <span style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontWeight: 400 }}>real</span> job.</h2>
            <p className="lede">
              zero setup. zero downloads. open the platform and you are already inside a real codebase with a real task queue, real pr flow, and a real reviewer.
            </p>
          </div>
        </div>

        <div className="ws reveal">
          <div className="ws-features">
            {features.map((f) => (
              <div className="ws-feature" key={f.t}>
                <span className="ic">{f.ic}</span>
                <h4>{f.t}</h4>
                <p>{f.d}</p>
              </div>
            ))}
          </div>

          <div className="ws-side">
            <div className="quote">
              "i thought it was another tutorial platform. by week 2 i ship 14 prs to a real codebase and get my ass handed to me on the second one. <em>it works.</em>"
              <span className="who">— rohan, intern @ nexara, sprint 4</span>
            </div>
            <div className="quote">
              "the ai reviewer catch a sql injection in my first submission. <em>that moment is when i know this is different.</em>"
              <span className="who">— aanya, junior @ vivacity, sprint 2</span>
            </div>
            <div className="quote">
              "i go from 'i know react' to 'i ship a design system' in three sprints. employers stop asking if i do <em>real</em> work."
              <span className="who">— karthik, mid @ levanto, sprint 7</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
