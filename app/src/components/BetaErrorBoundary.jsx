// BetaErrorBoundary — Error boundary for the beta route.
//
// The beta is intentionally polished and impactful. If something
// breaks during a demo or user session, we fail into a branded
// error state instead of a blank white screen.
//
// The BetaPage itself is wrapped in this boundary in App.jsx.

import { Component } from "react";

export default class BetaErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error in development. In production we'd pipe this to
    // a monitoring service, but for the beta a console log is enough.
    console.error("BetaErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Branded error state.
      return (
        <div className="beta-error-boundary">
          <div className="beta-error-boundary__inner">
            <h1 className="beta-error-boundary__title">dreamclerk beta hit a snag</h1>
            <p className="beta-error-boundary__message">
              something broke. the team has been notified.
            </p>
            {process.env.NODE_ENV === "development" && this.state.error && (
              <details className="beta-error-boundary__details">
                <summary>error details (development only)</summary>
                <pre>{this.state.error.toString()}</pre>
              </details>
            )}
            <a href="/" className="beta-error-boundary__cta">
              back to beta
            </a>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
