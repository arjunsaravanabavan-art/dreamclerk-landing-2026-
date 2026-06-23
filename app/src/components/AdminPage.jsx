import { useEffect, useState } from "react";
import SectionLabel from "./SectionLabel.jsx";
import { signInAdmin, signOutAdmin, getSession, isConfigured, ADMIN_EMAIL } from "../lib/supabase.js";
import AdminDashboard from "./AdminDashboard.jsx";
import { useSEO } from "../lib/seo.js";

/**
 * Admin entry point — /#/admin
 * If signed in, renders AdminDashboard. Otherwise shows the login form.
 * Renders nothing useful if supabase is not configured.
 */
export default function AdminPage() {
  const [session, setSession] = useState(null);
  const [bootChecking, setBootChecking] = useState(true);
  const [email, setEmail] = useState(ADMIN_EMAIL);
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState("");

  useSEO({ title: "admin", description: "internal admin. not for public indexing.", path: "/admin", keywords: "" });
  // force noindex
  useEffect(() => {
    const prev = document.head.querySelector('meta[name="robots"]')?.getAttribute("content");
    document.head.querySelector('meta[name="robots"]')?.setAttribute("content", "noindex, nofollow");
    return () => {
      // restore default on unmount
      const el = document.head.querySelector('meta[name="robots"]');
      if (el) el.setAttribute("content", prev || "index, follow, max-image-preview:large, max-snippet:-1");
    };
  }, []);

  useEffect(() => { document.title = "admin — dreamclerk"; }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const s = await getSession();
        if (!cancelled) setSession(s);
      } finally {
        if (!cancelled) setBootChecking(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    if (!email || !password) { setErr("email and password required."); return; }
    setSubmitting(true);
    try {
      const result = await signInAdmin(email, password);
      if (result?.error) setErr(result.error.message || "sign-in failed");
      else setSession(result?.data?.session || null);
    } catch (e2) {
      setErr(e2?.message || "sign-in failed");
    } finally {
      setSubmitting(false);
    }
  }

  async function onSignOut() {
    await signOutAdmin();
    setSession(null);
  }

  if (!isConfigured) {
    return (
      <section className="section adm0" id="admin">
        <div className="wrap adm0__wrap">
          <SectionLabel status="warn">$ supabase not configured</SectionLabel>
          <h1 className="adm0__h1">admin is offline.</h1>
          <p>to enable admin features, add <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> to <code>app/.env</code> and run <code>supabase/schema.sql</code> in your project. then create an admin user in supabase auth with the email <code>info@dreamclerk.com</code>.</p>
        </div>
      </section>
    );
  }

  if (bootChecking) {
    return (
      <section className="section adm0" id="admin">
        <div className="wrap adm0__wrap">
          <SectionLabel status="ok">$ /admin</SectionLabel>
          <p className="adm0__loading">$ checking session…</p>
        </div>
      </section>
    );
  }

  if (session) {
    return <AdminDashboard session={session} onSignOut={onSignOut} />;
  }

  return (
    <section className="section adm0" id="admin">
      <div className="wrap adm0__wrap">
        <SectionLabel status="warn">$ /admin · auth required</SectionLabel>
        <h1 className="adm0__h1">admin login.</h1>
        <p className="adm0__sub">internal only. only the address in <code>VITE_ADMIN_EMAIL</code> can sign in.</p>

        <form className="adm0__form" onSubmit={onSubmit}>
          <label className="adm0__label">
            <span className="adm0__label-h">$ email</span>
            <input
              type="email"
              className="adm0__input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              required
            />
          </label>
          <label className="adm0__label">
            <span className="adm0__label-h">$ password</span>
            <input
              type="password"
              className="adm0__input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </label>
          {err ? <p className="adm0__err">! {err}</p> : null}
          <button type="submit" className="btn btn--solid adm0__submit" disabled={submitting}>
            {submitting ? "signing in…" : "sign in →"}
          </button>
        </form>

        <p className="legal__back"><a href="/">← back to dreamclerk</a></p>
      </div>
    </section>
  );
}
