// ─── minimal path-based router ────────────────────────────────────────────
//
// We use the browser history API (pushState / popstate) instead of a hash
// router so that the URL is a real path (/blog/why-we-built-dreamclerk),
// which search engines can index. No external dep, no react-router.
//
// API mirrors a tiny subset of what App.jsx was already doing with hashes:
//   - usePathRoute()           → { path, navigate, Link }
//   - <RouterLink to="/blog">  → renders an <a> that intercepts clicks
//   - redirectLegacyHashes()   → if the URL has #/foo, rewrite to /foo once
//
// Server fallback is handled by vercel.json's SPA rewrite.

import { useEffect, useState, useCallback } from "react";

function readPath() {
  if (typeof window === "undefined") return "/";
  return window.location.pathname || "/";
}

/** Migrate visitors who still have an old hash URL: /#/blog → /blog */
export function redirectLegacyHashes() {
  if (typeof window === "undefined") return;
  const h = window.location.hash;
  if (h && h.startsWith("#/")) {
    const newPath = h.slice(1); // "/blog/..."
    // use replace so we don't pollute history
    window.history.replaceState(null, "", newPath + window.location.search);
  }
}

export function usePathRoute() {
  const [path, setPath] = useState(readPath);

  useEffect(() => {
    const onPop = () => setPath(readPath());
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const navigate = useCallback((to, opts = {}) => {
    if (typeof window === "undefined") return;
    if (opts.replace) {
      window.history.replaceState(null, "", to);
    } else {
      window.history.pushState(null, "", to);
    }
    setPath(to);
    if (opts.scrollToTop !== false) {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, []);

  return { path, navigate };
}

/** Intercept <a> clicks and route them through history.pushState. */
export function RouterLink({ to, onClick, replace, children, ...rest }) {
  const handleClick = (e) => {
    // Let the browser handle modifier keys, new-tab clicks, and external links.
    if (
      e.defaultPrevented ||
      e.button !== 0 ||
      e.metaKey || e.ctrlKey || e.shiftKey || e.altKey
    ) {
      onClick && onClick(e);
      return;
    }
    if (typeof to === "string" && to.startsWith("/")) {
      e.preventDefault();
      const next = to + window.location.search;
      if (replace) {
        window.history.replaceState(null, "", next);
      } else {
        window.history.pushState(null, "", next);
      }
      window.dispatchEvent(new PopStateEvent("popstate"));
      onClick && onClick(e);
    } else {
      onClick && onClick(e);
    }
  };
  return (
    <a href={to} onClick={handleClick} {...rest}>
      {children}
    </a>
  );
}
