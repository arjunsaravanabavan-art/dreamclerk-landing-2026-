export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer__top">
          <div className="footer__brand">
            <div className="word">dreamclerk</div>
            <p>
              a real-world career simulation platform. no more unemployment. built in india for indian undergraduates. free during beta.
            </p>
            <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 10, fontFamily: "var(--mono)", fontSize: 12, color: "var(--muted-on-dark-2)" }}>
              <span className="chip chip--on-dark"><span className="dot" /> all systems operational</span>
            </div>
          </div>

          <div>
            <h5>platform</h5>
            <ul>
              <li><a href="/how-it-works">how it works</a></li>
              <li><a href="/workspace">workspace</a></li>
              <li><a href="/tracks">role tracks</a></li>
              <li><a href="/certificate">certificate</a></li>
            </ul>
          </div>

          <div>
            <h5>resources</h5>
            <ul>
              <li><a href="/faq">faq</a></li>
              <li><a href="/blog">blog</a></li>
              <li><a href="/proof">student stories</a></li>
              <li><a href="https://www.dreamclerk.com" rel="noreferrer">dreamclerk.com ↗</a></li>
              <li>
                <a href="#" data-open-modal data-open-source="footer-cta">get notified →</a>
              </li>
            </ul>
          </div>

          <div>
            <h5>company</h5>
            <ul>
              <li><a href="/about">about us</a></li>
              <li><a href="/about#team">team</a></li>
              <li><a href="mailto:press@dreamclerk.com">press</a></li>
              <li><a href="mailto:careers@dreamclerk.com">careers</a></li>
            </ul>
          </div>

          <div>
            <h5>follow</h5>
            <ul>
              <li><a href="https://www.instagram.com/dreamclrk" target="_blank" rel="noreferrer">instagram ↗</a></li>
              <li><a href="https://www.linkedin.com/company/dreamclerk" target="_blank" rel="noreferrer">linkedin ↗</a></li>
              <li><a href="https://github.com/dreamclerk" target="_blank" rel="noreferrer">github ↗</a></li>
            </ul>
          </div>

          <div>
            <h5>legal</h5>
            <ul>
              <li><a href="/privacy">privacy</a></li>
              <li><a href="/terms">terms</a></li>
              <li><a href="mailto:dpo@dreamclerk.com">dpo</a></li>
              <li><a href="mailto:security@dreamclerk.com">security</a></li>
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <span>© 2026 dreamclerk.com · no more unemployment</span>
          <div className="socials">
            <a href="https://www.instagram.com/dreamclrk" target="_blank" rel="noreferrer">instagram</a>
            <a href="https://www.linkedin.com/company/dreamclerk" target="_blank" rel="noreferrer">linkedin</a>
            <a href="https://github.com/dreamclerk" target="_blank" rel="noreferrer">github</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
