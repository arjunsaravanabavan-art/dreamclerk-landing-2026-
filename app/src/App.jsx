import { useEffect, useState } from "react";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Marquee from "./components/Marquee";
import Loop from "./components/Loop";
import Workspace from "./components/Workspace";
import Tracks from "./components/Tracks";
import Companies from "./components/Companies";
import Stats from "./components/Stats";
import Certificate from "./components/Certificate";
import Testimonials from "./components/Testimonials";
import FAQ from "./components/FAQ";
import Final from "./components/Final";
import Footer from "./components/Footer";
import EmailModal from "./components/EmailModal";

export default function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalSource, setModalSource] = useState("modal");

  // open modal: any element with [data-open-modal] OR custom event
  useEffect(() => {
    const openFromEl = (el) => {
      setModalSource(el.getAttribute("data-open-source") || "modal");
      setModalOpen(true);
    };
    const onClick = (e) => {
      const t = e.target.closest("[data-open-modal]");
      if (t) { e.preventDefault(); openFromEl(t); }
    };
    const onEvent = (e) => {
      setModalSource(e.detail?.source || "modal");
      setModalOpen(true);
    };
    document.addEventListener("click", onClick);
    document.addEventListener("open-modal", onEvent);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("open-modal", onEvent);
    };
  }, []);

  // scroll-triggered popup at 50% — sessionStorage guard so it fires once per visit
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("dc_scroll_popup_shown") === "1") return;
    const onScroll = () => {
      const doc = document.documentElement;
      const pct = (window.scrollY || doc.scrollTop) / ((doc.scrollHeight - window.innerHeight) || 1);
      if (pct >= 0.5) {
        sessionStorage.setItem("dc_scroll_popup_shown", "1");
        setModalSource("scroll-50");
        setModalOpen(true);
        window.removeEventListener("scroll", onScroll);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // dev-only: ?open=modal opens the modal automatically for screenshotting
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("open") === "modal") {
      setModalSource(params.get("source") || "screenshot");
      setModalOpen(true);
    }
  }, []);

  // scroll reveal + counter + ticker feed
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) e.target.classList.add("in");
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    const tick = setInterval(() => {
      document.querySelectorAll(".reveal:not(.in)").forEach((el) => io.observe(el));
    }, 200);

    const ioNum = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const el = e.target;
          const end = parseInt(el.getAttribute("data-counter") || "0", 10);
          const dur = 1400;
          const t0 = performance.now();
          const step = (t) => {
            const p = Math.min(1, (t - t0) / dur);
            const v = Math.floor(p * end);
            el.firstChild ? (el.firstChild.nodeValue = v.toLocaleString("en-IN")) : null;
            if (p < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
          ioNum.unobserve(el);
        }
      },
      { threshold: 0.5 }
    );
    document.querySelectorAll("[data-counter]").forEach((el) => ioNum.observe(el));

    // live pr feed
    const users = ["aanya", "karthik", "rohan", "mira", "dev", "isha", "amir", "noor", "jaya", "tarun"];
    const cos = ["nexara", "vivacity", "levanto", "kaalm", "oxygon", "siftly", "morko"];
    const tasks = [
      "fix auth middleware · jwt expiry bug",
      "build cart checkout · react + ts",
      "rate limiter · 100 req/min",
      "fine-tune bert · f1 > 0.85",
      "perf audit · lighthouse > 85",
      "sql query · top 3 slow",
      "react component · design system",
      "k8s hpa · production",
      "figma handoff · nav redline",
      "ab test framework · 3 cohorts",
    ];
    const t = setInterval(() => {
      const el = document.querySelector(".ticker__list");
      if (!el) return;
      const u = users[Math.floor(Math.random() * users.length)];
      const c = cos[Math.floor(Math.random() * cos.length)];
      const tsk = tasks[Math.floor(Math.random() * tasks.length)];
      const score = 60 + Math.floor(Math.random() * 38);
      const li = document.createElement("li");
      li.innerHTML = '<span class="user">' + u + '</span> @ <b>' + c + '</b> · <span>' + tsk + '</span><span class="score">' + score + '/100</span>';
      el.prepend(li);
      while (el.children.length > 6) el.removeChild(el.lastChild);
    }, 2400);

    return () => {
      clearInterval(tick);
      clearInterval(t);
    };
  }, []);

  return (
    <>
      <Nav />
      <main>
        <Hero />
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
      <Footer />
      <EmailModal
        open={modalOpen}
        source={modalSource}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
