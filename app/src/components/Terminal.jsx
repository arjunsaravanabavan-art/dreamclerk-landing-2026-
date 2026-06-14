export default function Terminal() {
  return (
    <section id="terminal" className="merge-dark" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <div className="terminal reveal">
          <div className="term-bar">
            <span className="dot live" />
            <span className="dot" />
            <span className="dot" />
            <span className="title">~/dreamclerk · nexara/sprint-6 · task-#341 · auth-bug-fix</span>
            <span className="spacer" />
            <span className="right">branch · fix/auth-leak · pr · #4012</span>
          </div>

          <div className="term-body">
            {/* file tree pane */}
            <div className="term-pane">
              <h4>explorer</h4>
              <ul>
                <li className="active"><span className="ic">▸</span> src/ <span className="tag">12</span></li>
                <li style={{ paddingLeft: 14 }}><span className="ic">•</span> auth.js <span className="tag">edit</span></li>
                <li style={{ paddingLeft: 14 }}><span className="ic">•</span> api.js</li>
                <li style={{ paddingLeft: 14 }}><span className="ic">•</span> middleware/</li>
                <li style={{ paddingLeft: 14 }}><span className="ic">•</span> utils.js</li>
                <li><span className="ic">▸</span> tests/ <span className="tag">4</span></li>
                <li><span className="ic">▸</span> docs/</li>
                <li><span className="ic">▸</span> .github/</li>
                <li><span className="ic">▸</span> prisma/</li>
                <li><span className="ic">▸</span> docker/</li>
              </ul>

              <h4 style={{ marginTop: 18 }}>current ticket</h4>
              <ul>
                <li><span className="ic">#</span> 341 — auth bug (P1) <span className="tag">today</span></li>
                <li><span className="ic">•</span> from: client</li>
                <li><span className="ic">•</span> due: 5pm</li>
                <li><span className="ic">•</span> est: 2h</li>
              </ul>
            </div>

            {/* code editor pane */}
            <div className="term-pane">
              <h4>auth.js · 24 / 87</h4>
              <pre className="term-code">
                <span className="c">// auth.js — login handler</span>{"\n"}
                <span className="k">const</span> <span className="f">login</span> = <span className="k">async</span> (req) {"=>"} {"{"}
                {"\n"}  <span className="k">const</span> {"{"} email, pass {"}"} = req.body;{"\n\n"}
                  {"  "}<span className="c">// ⚠ unparameterized query</span>{"\n"}
                  {"  "}<span className="k">const</span> user = <span className="k">await</span> db.query({"\n"}
                    {"    "}<span className="s">`SELECT * FROM users{"\n"}
                    {"     "} WHERE email=<span className="n">${"${email}"}</span>`</span>{"\n"}
                  {"  "});{"\n\n"}
                  {"  "}<span className="c">// ❌ no error handling</span>{"\n"}
                  {"  "}<span className="k">if</span> (!user) <span className="k">throw</span> <span className="k">new</span> <span className="f">Error</span>(<span className="s">"no user"</span>);{"\n\n"}
                  {"  "}<span className="c">// ❌ returns password hash</span>{"\n"}
                  {"  "}<span className="k">return</span> user;{"\n"}
                {"}"}
                <span className="term-cursor" />
              </pre>
            </div>

            {/* reviewer pane */}
            <div className="term-pane term-review">
              <h4>ai tech lead · review</h4>
              <div className="row"><span className="ico">✓</span><span>logic flow is correct</span></div>
              <div className="row"><span className="ico" style={{color:'#ffd76b'}}>!</span><span>missing error handling on db.query</span></div>
              <div className="row"><span className="ico" style={{color:'#ff8e8e'}}>✗</span><span>sql injection risk · use parameterised queries</span></div>
              <div className="row"><span className="ico" style={{color:'#ff8e8e'}}>✗</span><span>password hash leaked in response</span></div>
              <div className="row"><span className="ico" style={{color:'#d6ff5b'}}>+</span><span>add try/catch + 401 response</span></div>
              <div className="row"><span className="ico" style={{color:'#d6ff5b'}}>+</span><span>destructure — omit password before return</span></div>
              <div className="score">score <b>61 / 100</b></div>

              <h4 style={{ marginTop: 12 }}>tests</h4>
              <ul className="term-test">
                <li><span className="ok">✓</span><span>hashes password</span><span className="meta">12ms</span></li>
                <li><span className="ok">✓</span><span>creates session</span><span className="meta">8ms</span></li>
                <li><span className="fail">✗</span><span>rejects sql injection</span><span className="meta">—</span></li>
                <li><span className="fail">✗</span><span>omits password hash</span><span className="meta">—</span></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
