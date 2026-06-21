import { RouterLink } from "../lib/router.jsx";

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
              <li><RouterLink to="/how">how it works</RouterLink></li>
              <li><RouterLink to="/workspace">workspace</RouterLink></li>
              <li><RouterLink to="/tracks">role tracks</RouterLink></li>
              <li><a href="/certificate">certificate</a></li>
            </ul>
          </div>

          <div>
            <h5>resources</h5>
            <ul>
              <li><RouterLink to="/faq">faq</RouterLink></li>
              <li><RouterLink to="/blog">blog</RouterLink></li>
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
              <li><RouterLink to="/about">about us</RouterLink></li>
              <li><a href="/about#team">team</a></li>
              <li><RouterLink to="/contact">contact</RouterLink></li>
              <li><RouterLink to="/feedback">feedback</RouterLink></li>
              <li><a href="mailto:press@dreamclerk.com">press</a></li>
              <li><a href="mailto:careers@dreamclerk.com">careers</a></li>
            </ul>
          </div>

          <div>
            <h5>follow</h5>
            <ul>
              <li><a href="https://www.instagram.com/dreamclrk" target="_blank" rel="noreferrer">instagram ↗</a></li>
              <li><a href="https://www.linkedin.com/company/dreamclerk" target="_blank" rel="noreferrer">linkedin ↗</a></li>
            </ul>
          </div>

          <div>
            <h5>legal</h5>
            <ul>
              <li><RouterLink to="/privacy">privacy</RouterLink></li>
              <li><RouterLink to="/terms">terms</RouterLink></li>
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
          </div>
        </div>
      </div>
    </footer>
  );
}
