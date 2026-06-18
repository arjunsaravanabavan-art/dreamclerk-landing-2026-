// ─── BetaErrorBoundary — fallback for any uncaught render error in /beta ───
//
// React doesn't expose a hook-based error boundary — you have to use a class
// component. The whole point of this boundary is: if the beta UI throws
// during render (e.g. malformed localStorage session, evaluator crash, a
// track the user no longer has permission for), we don't blank the page —
// we render a recoverable shell that lets the user:
//
//   1. read what went wrong (dev mode only — never expose stack traces
//      in production for a public beta cohort),
//   2. reset the local session and start over,
//   3. go home.
//
// We keep the boundary narrow: only wrap the /beta tree in App.jsx. The
// landing page, blog, etc. don't need it — they fail loudly via the
// build pipeline. This is a v0.1 cohort safety net.

import { Component } from "react";
import { RouterLink } from "../../lib/router.jsx";

export default class BetaErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error("[beta] render error", error, info?.componentStack);
  }

  resetSession = () => {
    try {
      if (typeof window !== "undefined") {
        // Wipe just the beta session keys, not the rest of the site.
        const NS = "dc-beta-v1::session::";
        for (let i = window.localStorage.length - 1; i >= 0; i--) {
          const k = window.localStorage.key(i);
          if (k && k.startsWith(NS)) window.localStorage.removeItem(k);
        }
      }
    } catch {
      // ignore — we're already in a recovery path
    }
    // Hard reload to a clean URL so the route doesn't replay the bad state.
    if (typeof window !== "undefined") window.location.assign("/beta");
  };

  render() {
    if (!this.state.error) return this.props.children;

    const isDev = typeof import.meta !== "undefined" && import.meta.env?.DEV;

    return (
      <main className="beta-shell">
        <div className="beta-card">
          <h1 className="beta-h1">something broke on this page.</h1>
          <p className="beta-p">
            the beta flow hit an unexpected error and we stopped the render
            so it wouldn't make things worse. your work is saved — it's
            safe in your browser's local storage. you can:
          </p>
          <ul className="beta-betalist">
            <li>go back to home and try a different section, or</li>
            <li>reset the local beta session and start over (this clears only the beta data, not the landing page), or</li>
            <li>open the developer console and report the error.</li>
          </ul>

          {isDev ? (
            <details className="beta-ws-error-details">
              <summary>developer details</summary>
              <pre>{String(this.state.error?.stack || this.state.error?.message || this.state.error)}</pre>
            </details>
          ) : null}

          <div className="beta-row" style={{ marginTop: 16 }}>
            <RouterLink to="/" className="beta-btn">back to home</RouterLink>
            <button type="button" className="beta-btn beta-btn--ghost" onClick={this.resetSession}>
              reset beta session
            </button>
          </div>
        </div>
      </main>
    );
  }
}
