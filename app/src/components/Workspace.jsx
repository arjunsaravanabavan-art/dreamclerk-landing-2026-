const features = [
  { ic: "M", t: "monaco editor", d: "the same engine that powers vs code, running in your browser tab." },
  { ic: "T", t: "live terminal", d: "real bash, sandboxed per student per task. no shared state." },
  { ic: "D", t: "sandboxed runtime", d: "docker-based microvm. run node, python, java, go safely." },
  { ic: "J", t: "jupyter notebooks", d: "full in-browser notebooks (jupyterlite · wasm) for ml & data tasks." },
  { ic: "S", t: "sql playground", d: "sandboxed postgresql per student. learn by querying real data." },
  { ic: "R", t: "ai code reviewer", d: "line-level feedback on security, performance, readability, edge cases." },
  { ic: "P", t: "pr flow", d: "submit code as a pr. ai tech lead merges or requests changes." },
  { ic: "G", t: "git client", d: "full source control, branch, rebase, merge — all in browser." },
];

export default function Workspace() {
  return (
    <section id="workspace" className="section">
      <div className="wrap">
        <header className="section-head reveal">
          <div className="section-head__label">
            <span className="cmd">$ workspace --describe</span>
            <span>the workspace</span>
          </div>
          <div className="section-head__body">
            <h2 className="section-head__title">
              your ide, your terminal, your <em style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontWeight: 400 }}>real</em> job.
            </h2>
            <p className="section-head__lede">
              zero setup. zero downloads. open the platform and you are already inside a real codebase with a real task queue, real pr flow, and a real reviewer.
            </p>
          </div>
        </header>

        <div className="ws reveal">
          <div className="ws__features">
            {features.map((f) => (
              <div className="ws__feature" key={f.t}>
                <span className="ic" aria-hidden="true">{f.ic}</span>
                <h4>{f.t}</h4>
                <p>{f.d}</p>
              </div>
            ))}
          </div>

          <div className="ws__ide" role="img" aria-label="dreamclerk IDE mockup">
            <div className="ws__ide-bar">
              <span className="dot" />
              <span className="dot" />
              <span className="dot live" />
              <span style={{ marginLeft: 8 }}>nexara/&lt;your-name&gt; — sprint-04 · fix-auth-middleware</span>
              <span style={{ marginLeft: "auto" }}>● ci passing · 14/14</span>
            </div>
            <div className="ws__ide-tabs">
              <span>auth.ts</span>
              <span className="active">auth.test.ts</span>
              <span>package.json</span>
              <span>README.md</span>
            </div>
            <div className="ws__ide-body">
              <div className="ws__ide-tree">
                <div className="row"><b>nexara/</b></div>
                <div className="row active">  src/</div>
                <div className="row">    auth.ts</div>
                <div className="row">    auth.test.ts</div>
                <div className="row">    routes/</div>
                <div className="row">    middleware/</div>
                <div className="row">  tests/</div>
                <div className="row">  package.json</div>
                <div className="row">  README.md</div>
              </div>
              <pre className="ws__ide-code">
<span className="c">// auth.test.ts — write tests, make them pass.</span>{`
`}<span className="k">import</span> {"{ describe, it, expect }"} <span className="k">from</span> <span className="s">"vitest"</span>;{`
`}<span className="k">import</span> {"{ sign }"} <span className="k">from</span> <span className="s">"./auth"</span>;{`
`}{`
`}<span className="c">// TODO: cover expiry, replay, role-claim.</span>{`
`}<span className="f">describe</span>(<span className="s">"auth.sign"</span>, () {"=>"} {"{"}{`
  `}<span className="f">it</span>(<span className="s">"rejects expired tokens"</span>, <span className="k">async</span> () {"=>"} {"{"}{`
    `}<span className="k">const</span> tok = <span className="k">await</span> <span className="f">sign</span>({"{ sub: 1, exp: -1 }"});{`
    `}<span className="k">await</span> <span className="f">expect</span>(<span className="f">verify</span>(tok)).<span className="f">rejects</span>.<span className="f">toThrow</span>();{`
  `}{"}"});{`
`}{"}"});{`
`}</pre>
            </div>
            <div className="ws__ide-status">
              <span>main · +12 -3</span>
              <span className="ok">● tests 14/14</span>
              <span>lint clean</span>
              <span className="ml-auto">awaiting review</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
