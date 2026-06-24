import { useEffect, useState } from "react";

import { useReveal } from "./components/useReveal.js";
import { usePathRoute, redirectLegacyHashes } from "./lib/router.jsx";

import Nav from "./components/Nav.jsx";
import Cursor from "./components/Cursor.jsx";
import Hero from "./components/Hero.jsx";
import Mentions from "./components/Mentions.jsx";
import Marquee from "./components/Marquee.jsx";
import Loop from "./components/Loop.jsx";
import Workspace from "./components/Workspace.jsx";
import Tracks from "./components/Tracks.jsx";
import Companies from "./components/Companies.jsx";
import CertTeaser from "./components/CertTeaser.jsx";
import Certificate from "./components/Certificate.jsx";
import Stats from "./components/Stats.jsx";
import Testimonials from "./components/Testimonials.jsx";
import FAQ from "./components/FAQ.jsx";
import Final from "./components/Final.jsx";
import Footer from "./components/Footer.jsx";
import EmailModal from "./components/EmailModal.jsx";
import About from "./components/About.jsx";
import Privacy from "./components/Privacy.jsx";
import Terms from "./components/Terms.jsx";
import HowItWorksPage from "./components/HowItWorksPage.jsx";
import WorkspacePage from "./components/WorkspacePage.jsx";
import TracksPage from "./components/TracksPage.jsx";
import CompaniesPage from "./components/CompaniesPage.jsx";
import FAQPage from "./components/FAQPage.jsx";
import BlogListPage from "./components/BlogListPage.jsx";
import BlogPostPage from "./components/BlogPostPage.jsx";
import ContactPage from "./components/ContactPage.jsx";
import FounderPage from "./components/FounderPage.jsx";
import AdminPage from "./components/AdminPage.jsx";
import BetaPage from "./components/BetaPage.jsx";
import BetaVerifyPage from "./components/beta/BetaVerifyPage.jsx";
import HowBetaPage from "./components/HowBetaPage.jsx";
import { useSEO, SEO } from "./lib/seo.js";

/**
 * Path router (no react-router). 15 routes:
 *  /                  → landing (the full 13 sections)
 *  /how               → How it works (long-form, from nav)
 *  /workspace         → Workspace (long-form, from nav)
 *  /tracks            → Tracks (long-form, from nav)
 *  /companies         → Companies (long-form, from nav)
 *  /faq               → FAQ (long-form, from nav)
 *  /blog              → Blog list
 *  /blog/:slug        → Blog post
 *  /about             → About page
 *  /privacy           → Privacy policy
 *  /terms             → Terms of service
 *  /admin             → Admin dashboard (blocked in robots.txt)
 *  /beta              → Beta landing (intro)
 *  /beta/:token       → Beta flow (invite gate, onboarding, dashboard, wrap-up)
 *  /verify/:recordId  → Public work-record page (no auth)
 */

function LandingPage() {
  useSEO(SEO.landing);
  return (
    <main>
      <Hero />
      <Mentions />
      <Marquee />
      <Loop />
      <Workspace />
      <Tracks />
      <Companies />
      <CertTeaser />
      <Certificate />
      <Stats />
      <Testimonials />
      <FAQ />
      <Final />
    </main>
  );
}

export default function App() {
  const { path, navigate } = usePathRoute();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalSource, setModalSource] = useState("modal");

  // Migrate /#/foo → /foo for visitors landing on legacy hash URLs.
  useEffect(() => { redirectLegacyHashes(); }, []);

  // Disable browser-default scroll restoration. Without this, the browser
  // can restore prior scroll position on back/forward navigations, which
  // overrides the route-change scrollTo above and leaves the user mid-page.
  // We own scroll position ourselves (every route change → top), so the
  // browser should stay out of it.
  useEffect(() => {
    if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  // Custom inverted-color cursor. The <Cursor /> component manages its
  // own enable/disable (desktop only, no reduced motion) and toggles a
  // body class while it is active so the stylesheet can hide the native
  // cursor globally while keeping the text caret in inputs.
  const [cursorActive, setCursorActive] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const compute = () => {
      const fine = window.matchMedia?.("(pointer: fine)").matches !== false;
      const wide = window.innerWidth > 1024;
      const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
      const next = fine && wide && !reduced;
      setCursorActive(next);
      try {
        if (next) document.body.classList.add("has-dc-cursor");
        else document.body.classList.remove("has-dc-cursor");
      } catch {}
    };
    compute();
    window.addEventListener("resize", compute);
    return () => {
      window.removeEventListener("resize", compute);
      try { document.body.classList.remove("has-dc-cursor"); } catch {}
    };
  }, []);

  // Make .reveal sections visible on scroll. Re-runs on every route change
  // so the legal pages (which also use .reveal) animate on entry.
  useReveal(path);

  // Modal open/close wiring: any element with [data-open-modal] opens it.
  useEffect(() => {
    const onClick = (e) => {
      const t = e.target.closest("[data-open-modal]");
      if (t) {
        e.preventDefault();
        const src = t.getAttribute("data-open-source") || "modal";
        setModalSource(src);
        setModalOpen(true);
      }
      const c = e.target.closest("[data-close-modal]");
      if (c) {
        e.preventDefault();
        setModalOpen(false);
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  // Custom-event listener — components that fire `open-modal` from their
  // own JS (the blog-post NotifyCTA, the Final band) get to attach a
  // source so the EmailModal knows where the signup came from.
  useEffect(() => {
    const onOpen = (e) => {
      const source = e?.detail?.source || "modal";
      setModalSource(source);
      setModalOpen(true);
    };
    document.addEventListener("open-modal", onOpen);
    return () => document.removeEventListener("open-modal", onOpen);
  }, []);

  // Auto-open the waitlist modal on every landing visit.
  //
  // Triggers, first one wins:
  //   1. 2-second timer (reduced to 2s per hardening)
  //   2. 35% scroll-depth (lowered from 50%)
  //   3. Hero CTA "get notified" button click (open-modal)
  //
  // Safety: 8-second auto-close if user hasn't engaged (clicked / typed).
  // No localStorage lock — shows every visit. Gated to "/" only.
  useEffect(() => {
    if (path !== "/") return;
    if (typeof window === "undefined") return;

    let opened = false;
    let engaged = false;
    let closeSafety = null;

    const openOnce = (why) => {
      if (opened) return;
      opened = true;
      setModalOpen(true);
      setModalSource(why === "scroll" ? "modal-scroll" : why === "hero" ? "modal-hero" : "modal-timer");

      // 8-second safety: close modal if no user interaction yet
      closeSafety = setTimeout(() => {
        if (!engaged) {
          setModalOpen(false);
        }
      }, 8000);
    };

    const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const timerDelay = reducedMotion ? 200 : 2000;

    // Trigger 1: timer
    const t = setTimeout(() => openOnce("timer"), timerDelay);

    // Trigger 2: 35% scroll depth
    const onScroll = () => {
      const doc = document.documentElement;
      const scrolled = window.scrollY + window.innerHeight;
      const total = doc.scrollHeight;
      if (total > 0 && scrolled / total >= 0.35) {
        openOnce("scroll");
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    // Mark engagement on any keydown or click
    const onEngage = () => { engaged = true; };
    window.addEventListener("keydown", onEngage, { passive: true });
    window.addEventListener("click", onEngage, { passive: true });

    const cleanup = () => {
      clearTimeout(t);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("keydown", onEngage);
      window.removeEventListener("click", onEngage);
      if (closeSafety) clearTimeout(closeSafety);
    };
    return cleanup;
  }, [path]);

  // Scroll to top on every real route change.
  // Instant scroll keeps the page-enter animation clean — smooth scroll at
  // the same time as the fade+rise would double-animate the viewport.
  //
  // Why the `path !== "/"` guard was removed: returning to "/" from any
  // other route would leave the user mid-page because the only scrollTo
  // was skipped on the home route. Now every nav lands at the top.
  //
  // Hash anchors (<a href="#how"> on /) are unaffected because the path
  // does NOT change in that case, so this effect does not re-fire and the
  // browser handles the smooth in-page jump natively.
  useEffect(() => {
    if (path) {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [path]);

  // Clear page-level body classes on every route change. Several child pages
  // add classes to <body> for their own UI (modal-open, task-active, etc.) and
  // only remove them on their own close path. If the user navigates away
  // instead of closing, the class leaks — which causes scroll lock, layout
  // shift, or stuck cursor states. This is the router-level safety net.
  useEffect(() => {
    return () => {
      document.body.classList.remove(
        "dc-modal-open",
        "dc-task-active",
        "has-dc-cursor"
      );
    };
  }, [path]);

  // The route content is wrapped in a div keyed by `path` so React re-mounts
  // it on every navigation. The fresh mount restarts the .page-enter keyframe
  // animation, giving every route a smooth fade+rise on entry — desktop and
  // mobile, with `prefers-reduced-motion` honored at the CSS layer.
  const routeKey = path || "/";
  let routeNode = null;
  if (path === "/about") routeNode = <About />;
  else if (path === "/privacy") routeNode = <Privacy />;
  else if (path === "/terms") routeNode = <Terms />;
  else if (path === "/how") routeNode = <HowItWorksPage />;
  else if (path === "/workspace") routeNode = <WorkspacePage />;
  else if (path === "/tracks") routeNode = <TracksPage />;
  else if (path === "/companies") routeNode = <CompaniesPage />;
  else if (path === "/faq") routeNode = <FAQPage />;
  else if (path === "/blog") routeNode = <BlogListPage />;
  else if (path.startsWith("/blog/")) {
    routeNode = <BlogPostPage slug={path.replace("/blog/", "").replace(/\/$/, "")} />;
  } else if (path === "/contact") routeNode = <ContactPage />;
  else if (path === "/founder") routeNode = <FounderPage />;
  else if (path === "/admin" || path.startsWith("/admin/")) {
    routeNode = <AdminPage />;
  } else if (path === "/beta" || path.startsWith("/beta/")) {
    // Open beta: no token, no gate. `BetaPage` shows its own email gate on
    // first visit and the rest of the flow once an email is on the session.
    routeNode = <BetaPage />;
  } else if (path === "/how-beta" || path.startsWith("/how-beta/")) {
    // Manual for the deterministic review engine. Linked from the beta
    // page header, the cert verify page, and the FAQ. noindex'd because
    // it is beta-participant copy, not search traffic.
    routeNode = <HowBetaPage />;
  } else if (path.startsWith("/verify/")) {
    routeNode = <BetaVerifyPage recordId={path.replace("/verify/", "").replace(/\/$/, "")} />;
  } else {
    routeNode = <LandingPage />;
  }

  return (
    <div className="app">
      {cursorActive && <Cursor />}
      <Nav activePath={path} />
      <div key={routeKey} className="page page-enter">
        {routeNode}
      </div>
      <Footer />
      {modalOpen && (
        <EmailModal
          open={modalOpen}
          source={modalSource}
          onClose={() => {
            setModalOpen(false);
            // No localStorage lock here — the dual timer/scroll triggers
            // re-fire on every visit to "/", so a user who dismisses now
            // will see the pop-up again next time they land.
          }}
        />
      )}
    </div>
  );
}
