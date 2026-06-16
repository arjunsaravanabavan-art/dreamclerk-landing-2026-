export default function Nav({ activePath = "/" } = {}) {
  // activePath is the current path route (e.g. "/how", "/workspace", "/").
  // When on a non-landing route, the brand link returns to "/" (the home).
  const isLanding = !activePath || activePath === "/" || activePath === "";
  const brandHref = isLanding ? "#top" : "/";
  const ariaCurrent = (route) => (activePath === route ? { "aria-current": "page" } : {});

  return (
    <header className="nav" role="banner">
      <div className="wrap nav__inner">
        <a href={brandHref} className="nav__brand" aria-label="dreamclerk home">
          <span className="nav__mark" aria-hidden="true" />
          <span>dreamclerk</span>
        </a>
        <nav className="nav__links" aria-label="primary">
          <a href="/how"       {...ariaCurrent("/how")}>how it works</a>
          <a href="/workspace" {...ariaCurrent("/workspace")}>workspace</a>
          <a href="/tracks"    {...ariaCurrent("/tracks")}>tracks</a>
          <a href="/companies" {...ariaCurrent("/companies")}>companies</a>
          <a href="/faq"       {...ariaCurrent("/faq")}>faq</a>
          <a href="/blog"      {...ariaCurrent("/blog")}>blog</a>
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
