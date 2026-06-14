export default function Nav() {
  return (
    <header className="nav">
      <div className="wrap nav-inner">
        <a href="#top" className="brand" aria-label="dreamclerk home">
          <span className="mark" />
          <span>dreamclerk</span>
        </a>
        <nav className="nav-links" aria-label="primary">
          <a href="#top">top</a>
          <a href="#experience">experience</a>
          <a href="#how">how it works</a>
          <a href="#tracks">tracks</a>
          <a href="#certificate">certificate</a>
          <a href="#faq">faq</a>
        </nav>
        <div className="nav-cta">
          <button className="btn solid" aria-label="Get notified about dreamclerk" data-open-modal>get notified <span className="arr">→</span></button>
        </div>
      </div>
    </header>
  );
}
