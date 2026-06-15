export default function Nav() {
  return (
    <header className="nav" role="banner">
      <div className="wrap nav__inner">
        <a href="#" className="nav__brand" aria-label="dreamclerk home">
          <span className="nav__mark" aria-hidden="true" />
          <span>dreamclerk</span>
        </a>
        <nav className="nav__links" aria-label="primary">
          <a href="#how">how it works</a>
          <a href="#workspace">workspace</a>
          <a href="#tracks">tracks</a>
          <a href="#companies">companies</a>
          <a href="#faq">faq</a>
        </nav>
        <div className="nav__cta">
          <span className="chip" aria-label="system status">
            <span className="dot" /> systems normal
          </span>
          <a className="btn btn--solid" href="#" data-open-modal data-open-source="nav-cta">
            apply <span className="arr" aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </header>
  );
}
