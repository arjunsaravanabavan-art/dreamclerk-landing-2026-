export default function Footer() {
  return (
    <footer>
      <div className="wrap">
        <div className="foot-top">
          <div className="foot-brand">
            <div className="foot-mark">
              <span className="dot" /> dreamclerk
            </div>
            <p>
              a real-world career simulation platform. no more unemployment. built in india for indian undergraduates. free during beta.
            </p>
            <div className="foot-status">
              <span className="dot live" /> all systems operational · v0.9.2 · 1,847 students in queue
            </div>
          </div>

          <div>
            <h5>platform</h5>
            <ul>
              <li><a href="#how">how it works</a></li>
              <li><a href="#workspace">workspace</a></li>
              <li><a href="#tracks">role tracks</a></li>
              <li><a href="#certificate">certificate</a></li>
            </ul>
          </div>

          <div>
            <h5>resources</h5>
            <ul>
              <li><a href="#faq">faq</a></li>
              <li><a href="#proof">student stories</a></li>
              <li><a href="https://dreamclerk.com" rel="noreferrer">dreamclerk.com ↗</a></li>
              <li>
                <button type="button" data-open-modal className="foot-mail">
                  get notified →
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h5>company</h5>
            <ul>
              <li><a href="#about">about</a></li>
              <li><a href="#manifesto">manifesto</a></li>
              <li><a href="#press">press</a></li>
              <li><a href="#careers">careers</a></li>
            </ul>
          </div>

          <div>
            <h5>follow</h5>
            <ul>
              <li>
                <a href="https://www.instagram.com/dreamclrk" target="_blank" rel="noreferrer">
                  instagram ↗
                </a>
              </li>
              <li>
                <a href="https://twitter.com/dreamclerk" target="_blank" rel="noreferrer">
                  twitter / 𝕏 ↗
                </a>
              </li>
              <li>
                <a href="https://www.linkedin.com/company/dreamclerk" target="_blank" rel="noreferrer">
                  linkedin ↗
                </a>
              </li>
              <li>
                <a href="https://github.com/dreamclerk" target="_blank" rel="noreferrer">
                  github ↗
                </a>
              </li>
              <li>
                <a href="https://www.youtube.com/@dreamclerk" target="_blank" rel="noreferrer">
                  youtube ↗
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="foot-bottom">
          <span>© 2026 dreamclerk.com · no more unemployment</span>
          <span>made in india · for the 1.5 million</span>
        </div>
      </div>
    </footer>
  );
}
