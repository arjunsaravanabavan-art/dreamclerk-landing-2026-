// app/src/components/agent/Cursor.jsx
//
// Custom cursor with automatic inversion.
// Strategy: a single 18px circle, white, with mix-blend-mode: difference.
// On a white background, white XOR white = black, so the dot renders black.
// On a black background, white XOR black = white, so the dot renders white.
// On a colored background, the difference mode produces a complementary color,
// which is good enough — there's no color anywhere on the page outside the
// status dots in the terminal context, and those are status semantics that
// should still read as inverted.
//
// Activated only on >1024px viewports (matches the cursor: none rule).
// Hidden entirely under prefers-reduced-motion.

import { useEffect, useRef } from "react";

export function Cursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    // Respect reduced motion + small viewports.
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motionQuery.matches) {
      dot.style.display = "none";
      ring.style.display = "none";
      return;
    }

    let dotX = -100;
    let dotY = -100;
    let ringX = -100;
    let ringY = -100;
    let targetX = -100;
    let targetY = -100;
    let raf = 0;
    let visible = false;

    const setVisible = (on) => {
      if (on === visible) return;
      visible = on;
      dot.classList.toggle("agent3__cursor--on", on);
      ring.classList.toggle("agent3__cursor--on", on);
      document.body.classList.toggle("has-cursor-hidden", on);
    };

    const onMove = (e) => {
      // Only react to mouse pointers on desktop.
      if (e.pointerType && e.pointerType !== "mouse") {
        setVisible(false);
        return;
      }
      if (window.innerWidth <= 1024) {
        setVisible(false);
        return;
      }
      targetX = e.clientX;
      targetY = e.clientY;
      // Snap the inner dot; the ring trails with its own lerp.
      dotX = targetX;
      dotY = targetY;
      dot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0)`;
      setVisible(true);
    };

    const onLeave = () => setVisible(false);
    const onBlur = () => setVisible(false);

    const onDown = () => ring.classList.add("agent3__cursor--down");
    const onUp = () => ring.classList.remove("agent3__cursor--down");

    // Clickable hover detection: scale ring on interactive elements.
    const onOver = (e) => {
      const t = e.target;
      if (!(t instanceof Element)) return;
      const interactive = t.closest(
        "a, button, input, textarea, select, label, [role='button'], [role='link'], [data-cursor='hover']"
      );
      ring.classList.toggle("agent3__cursor--hover", !!interactive);
    };

    const tick = () => {
      // Ring lerp toward the dot. 0.18 = ~30% catch-up per frame at 60fps.
      ringX += (dotX - ringX) * 0.22;
      ringY += (dotY - ringY) * 0.22;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);
    window.addEventListener("blur", onBlur);
    window.addEventListener("pointerover", onOver, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("blur", onBlur);
      window.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.body.classList.remove("has-cursor-hidden");
    };
  }, []);

  return (
    <>
      <div ref={ringRef} className="agent3__cursor-ring" aria-hidden="true" />
      <div ref={dotRef} className="agent3__cursor-dot" aria-hidden="true" />
    </>
  );
}
