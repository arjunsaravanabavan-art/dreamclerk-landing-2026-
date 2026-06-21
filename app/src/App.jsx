import { useEffect, useState } from "react";

import { useReveal } from "./components/useReveal.js";
import { usePathRoute, redirectLegacyHashes } from "./lib/router.jsx";

import Nav from "./components/Nav.jsx";
import Hero from "./components/Hero.jsx";
import Mentions from "./components/Mentions.jsx";
import Marquee from "./components/Marquee.jsx";
import Loop from "./components/Loop.jsx";
import Workspace from "./components/Workspace.jsx";
import Tracks from "./components/Tracks.jsx";
import Companies from "./components/Companies.jsx";
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
import FeedbackPage from "./components/FeedbackPage.jsx";
import ContactPage from "./components/ContactPage.jsx";
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

  // Custom cursor: hide native cursor on desktop with a fine pointer.
  // Per CLAUDE.md hard rule: cursor: none on >1024px only.
  useEffect(() => {
    let hide = false;
    const onMove = (e) => {
      if (e.pointerType !== "mouse" || window.innerWidth <= 1024) {
        if (hide) { document.body.classList.remove("has-cursor-hidden"); hide = false; }
        return;
      }
      if (!hide) { document.body.classList.add("has-cursor-hidden"); hide = true; }
    };
    const onLeave = () => {
      if (hide) { document.body.classList.remove("has-cursor-hidden"); hide = false; }
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);
    window.addEventListener("blur", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("blur", onLeave);
      document.body.classList.remove("has-cursor-hidden");
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

  // Auto-open the waitlist modal once per session for landing visitors.
  // Gated to the marketing landing route only — /about, /blog, /verify,
  // /admin, and the beta flow stay quiet. Session storage + a 4.5s delay
  // so the hero animation lands first and the modal never feels like an
  // interruption. Closes itself once a user has submitted or dismissed
  // the modal in this session.
  useEffect(() => {
    if (path !== "/") return;
    if (typeof window === "undefined") return;
    if (window.sessionStorage.getItem("dc.waitlist.popup") === "seen") return;

    const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const delay = reducedMotion ? 200 : 4500;
    const t = setTimeout(() => {
      setModalOpen(true);
      try { window.sessionStorage.setItem("dc.waitlist.popup", "seen"); } catch {}
    }, delay);

    return () => clearTimeout(t);
  }, [path]);

  // Scroll to top on real route change (skip on initial /).
  // Instant scroll keeps the page-enter animation clean — smooth scroll at
  // the same time as the fade+rise would double-animate the viewport.
  useEffect(() => {
    if (path && path !== "/") {
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
        "has-cursor-hidden"
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
  } else if (path === "/feedback") routeNode = <FeedbackPage />;
  else if (path === "/contact") routeNode = <ContactPage />;
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
      <Nav activePath={path} />
      <div key={routeKey} className="page page-enter">
        {routeNode}
      </div>
      <Footer />
      {modalOpen && (
        <EmailModal
          source={modalSource}
          onClose={() => {
            setModalOpen(false);
            try { window.sessionStorage.setItem("dc.waitlist.popup", "seen"); } catch {}
          }}
        />
      )}
    </div>
  );
}
