import { useEffect, useState } from "react";

/**
 * Nav — sticky, monochrome, terminal-friendly.
 *
 * Desktop: brand | links | cta-pill + apply
 * Mobile (<=880px): brand | hamburger + apply. Tapping the hamburger
 * slides the link list down as a full-width drop sheet so the layout
 * never overlaps or breaks.
 */
export default function Nav({ activePath = "/" } = {}) {
  const [open, setOpen] = useState(false);

  // activePath is the current path route (e.g. "/how", "/workspace", "/").
  // When on a non-landing route, the brand link returns to "/" (the home).
  const isLanding = !activePath || activePath === "/" || activePath === "";
  const brandHref = isLanding ? "#top" : "/";
  const ariaCurrent = (route) => (activePath === route ? { "aria-current": "page" } : {});

  // Close the mobile menu on:
  //  - any link tap (so the user lands on the new page with the menu closed)
  //  - the Escape key
  //  - the viewport widening past 880px (so a desktop resize doesn't
  //    leave the menu locked open)
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    const onResize = () => { if (window.innerWidth > 880) setOpen(false); };
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  // Lock body scroll while the mobile menu is open (so the page
  // behind the drop sheet doesn't scroll on iOS rubber-band).
  useEffect(() => {
    const prev = document.body.style.overflow;
    if (open) document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  return (
    <header className="nav" role="banner">
      <div className="wrap nav__inner">
        <a href={brandHref} className="nav__brand" aria-label="dreamclerk home">
          <span className="nav__mark" aria-hidden="true" />
          <span>dreamclerk</span>
        </a>

        <nav id="primary-nav" className={"nav__links" + (open ? " is-open" : "")} aria-label="primary">
          <a href="/how"       {...ariaCurrent("/how")}       onClick={() => setOpen(false)}>how it works</a>
          <a href="/workspace" {...ariaCurrent("/workspace")} onClick={() => setOpen(false)}>workspace</a>
          <a href="/tracks"    {...ariaCurrent("/tracks")}    onClick={() => setOpen(false)}>tracks</a>
          <a href="/companies" {...ariaCurrent("/companies")} onClick={() => setOpen(false)}>companies</a>
          <a href="/faq"       {...ariaCurrent("/faq")}       onClick={() => setOpen(false)}>faq</a>
          <a href="/blog"      {...ariaCurrent("/blog")}      onClick={() => setOpen(false)}>blog</a>
        </nav>

        <div className="nav__cta">
          <span className="chip nav__status" aria-label="system status">
            <span className="dot" /> systems normal
          </span>
          <a className="btn btn--solid" href="#" data-open-modal data-open-source="nav-cta">
            apply <span className="arr" aria-hidden="true">→</span>
          </a>
          <button
            className={"nav__burger" + (open ? " is-open" : "")}
            type="button"
            aria-label={open ? "close menu" : "open menu"}
            aria-expanded={open}
            aria-controls="primary-nav"
            onClick={() => setOpen((o) => !o)}
          >
            <span /><span /><span />
          </button>
        </div>
      </div>
    </header>
  );
}
