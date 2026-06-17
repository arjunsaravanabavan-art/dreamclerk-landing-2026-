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
import AdminPage from "./components/AdminPage.jsx";
import { useSEO, SEO } from "./lib/seo.js";

/**
 * Path router (no react-router). 12 routes:
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

  // Scroll to top on real route change (skip on initial /).
  useEffect(() => {
    if (path && path !== "/") {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [path]);

  return (
    <div className="app">
      <Nav activePath={path} />
      {path === "/about" && <About />}
      {path === "/privacy" && <Privacy />}
      {path === "/terms" && <Terms />}
      {path === "/how" && <HowItWorksPage />}
      {path === "/workspace" && <WorkspacePage />}
      {path === "/tracks" && <TracksPage />}
      {path === "/companies" && <CompaniesPage />}
      {path === "/faq" && <FAQPage />}
      {path === "/blog" && <BlogListPage />}
      {path.startsWith("/blog/") && (
        <BlogPostPage slug={path.replace("/blog/", "").replace(/\/$/, "")} />
      )}
      {(path === "/admin" || path.startsWith("/admin/")) && <AdminPage />}
      {(!path || path === "/") && <LandingPage />}
      <Footer />
      {modalOpen && <EmailModal onClose={() => setModalOpen(false)} />}
    </div>
  );
}
