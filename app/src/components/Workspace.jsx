import { useEffect, useState } from "react";

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

const comments = [
  { who: "tech-lead", line: 8,  text: "cover expiry, replay, role-claim — see 3 cases below" },
  { who: "reviewer",  line: 13, text: "good. add a negative case for malformed tokens." },
  { who: "tech-lead", line: 16, text: "★ lgtm — ship it." },
];

export default function Workspace() {
  const [activeTab, setActiveTab] = useState(1);
  const [activeFile, setActiveFile] = useState(0);
  const [testsRun, setTestsRun] = useState(11);
  const [testsTotal] = useState(14);
  const [ci, setCi] = useState("ci · passing");
  const [commentsOn, setCommentsOn] = useState(0);

  // rotate active tab every 4s
  useEffect(() => {
    const t = setInterval(() => setActiveTab((i) => (i + 1) % 4), 4000);
    return () => clearInterval(t);
  }, []);

  // bump testsRun every 1.6s up to total, then loop
  useEffect(() => {
    const t = setInterval(() => {
      setTestsRun((n) => {
        const next = n >= testsTotal ? testsTotal - 1 : n + 1;
        if (next === testsTotal) setCi("ci · passing · 14/14");
        return next;
      });
    }, 1600);
    return () => clearInterval(t);
  }, [testsTotal]);

  // add reviewer comments one by one
  useEffect(() => {
    const t = setInterval(() => setCommentsOn((i) => Math.min(comments.length, i + 1)), 1400);
    return () => clearInterval(t);
  }, []);

  // pretend to type the active tree file
  useEffect(() => {
    const t = setInterval(() => setActiveFile((i) => (i + 1) % 5), 3200);
    return () => clearInterval(t);
  }, []);

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
              <button
                type="button"
                className="ws__feature"
                key={f.t}
                onClick={() => setActiveFile((Math.random() * 5) | 0)}
                aria-label={f.t}
              >
                <span className="ic" aria-hidden="true">{f.ic}</span>
                <h4>{f.t}</h4>
                <p>{f.d}</p>
              </button>
            ))}
          </div>

          <div className="ws__ide" role="img" aria-label="dreamclerk IDE mockup">
            <div className="ws__ide-bar">
              <span className="dot" />
              <span className="dot" />
              <span className="dot live" />
              <span className="ws__ide-path">nexara/&lt;your-name&gt; — sprint-04 · fix-auth-middleware</span>
              <span className="ws__ide-status-pill">● {ci}</span>
            </div>
            <div className="ws__ide-tabs">
              {["auth.ts", "auth.test.ts", "package.json", "README.md"].map((t, i) => (
                <button
                  type="button"
                  key={t}
                  className={i === activeTab ? "active" : ""}
                  onClick={() => setActiveTab(i)}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="ws__ide-body">
              <div className="ws__ide-tree">
                <div className="row"><b>nexara/</b></div>
                <div className="row active">  src/</div>
                <div className={"row" + (activeFile === 0 ? " active" : "")}>    auth.ts</div>
                <div className={"row" + (activeFile === 1 ? " active" : "")}>    auth.test.ts</div>
                <div className={"row" + (activeFile === 2 ? " active" : "")}>    routes/</div>
                <div className={"row" + (activeFile === 3 ? " active" : "")}>    middleware/</div>
                <div className="row">  tests/</div>
                <div className={"row" + (activeFile === 4 ? " active" : "")}>  package.json</div>
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
`}<span className="ide-cursor" aria-hidden="true" /></pre>
            </div>
            <div className="ws__ide-review">
              {comments.slice(0, commentsOn).map((c, i) => (
                <div className={"ide-comment in" + (c.text.startsWith("★") ? " ok" : "")} key={i}>
                  <span className="who">{c.who}</span>
                  <span className="at">L{c.line}</span>
                  <span className="text">{c.text}</span>
                </div>
              ))}
            </div>
            <div className="ws__ide-status">
              <span>main · +12 -3</span>
              <span className="ok">● tests {testsRun}/{testsTotal}</span>
              <span>lint clean</span>
              <span className="ml-auto">{testsRun < testsTotal ? "running tests…" : "awaiting review"}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
