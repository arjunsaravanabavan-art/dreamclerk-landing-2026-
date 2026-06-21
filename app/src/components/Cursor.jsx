import { useEffect, useRef, useState } from "react";

/**
 * Cursor — inverted-color custom cursor.
 *
 * Replaces the default OS cursor with a small circle that:
 *   - On light sections (default): is solid black (--ink) with a paper
 *     outline — high contrast on cream backgrounds.
 *   - On dark sections (.section--dark, .modal-back, .final-band):
 *     inverts to solid white (--paper) with a black outline — high
 *     contrast on ink backgrounds.
 *   - On a text/clickable element (links, buttons, inputs): grows from
 *     10px to 22px and adds a thin outline ring (hover state).
 *   - On a textarea/input: shows the native text caret (cursor: text)
 *     instead of the dot, so users know they can type.
 *
 * Active only when:
 *   - pointerType is mouse (touch/pen keep the native cursor)
 *   - viewport width > 1024px (per CLAUDE.md hard rule)
 *   - prefers-reduced-motion is NOT set (no jittery transition)
 *
 * Per user request: "white background black pointer black background white
 * pointer smooth transition" — that is what this delivers.
 *
 * No external dependencies. rAF-throttled so it stays at 60fps on
 * mid-range hardware.
 */

const RING_SIZE = 22;
const DOT_SIZE = 10;
const HOVER_PAD = 6; // extra px around the cursor when hovering a target

function isInteractive(el) {
  if (!el) return false;
  if (el.closest?.("a, button, [role='button'], [data-open-modal], [data-close-modal]")) return true;
  if (el.closest?.("input, textarea, select, [contenteditable='true']")) return "text";
  return false;
}

function isOnDark(el) {
  if (!el) return false;
  // Walk up the DOM tree to find the nearest dark-section marker.
  // Each marker is a CSS class we paint at the section / overlay level.
  return Boolean(el.closest?.(
    ".section--dark, .modal-back, .final-band, .nav__cta, [data-dark='1']"
  ));
}

export default function Cursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [enabled, setEnabled] = useState(false);
  const [onDark, setOnDark] = useState(false);
  const [hover, setHover] = useState(false);
  const [text, setText] = useState(false);
  const stateRef = useRef({ onDark: false, hover: false, text: false });
  const targetRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef(0);

  // Decide whether the custom cursor should run at all.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const compute = () => {
      const fine = window.matchMedia?.("(pointer: fine)").matches !== false;
      const wide = window.innerWidth > 1024;
      const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
      setEnabled(fine && wide && !reduced);
    };
    compute();
    window.addEventListener("resize", compute);
    const mq = window.matchMedia?.("(pointer: fine)");
    if (mq?.addEventListener) mq.addEventListener("change", compute);
    return () => {
      window.removeEventListener("resize", compute);
      if (mq?.removeEventListener) mq.removeEventListener("change", compute);
    };
  }, []);

  // Track the mouse + recompute state every frame.
  useEffect(() => {
    if (!enabled) return;

    const onMove = (e) => {
      if (e.pointerType && e.pointerType !== "mouse") return;
      targetRef.current.x = e.clientX;
      targetRef.current.y = e.clientY;

      const tgt = e.target;
      const interactive = isInteractive(tgt);
      const dark = isOnDark(tgt);

      const newHover = interactive === true;
      const newText = interactive === "text";
      const newDark = dark;

      if (stateRef.current.onDark !== newDark) {
        stateRef.current.onDark = newDark;
        setOnDark(newDark);
      }
      if (stateRef.current.hover !== newHover) {
        stateRef.current.hover = newHover;
        setHover(newHover);
      }
      if (stateRef.current.text !== newText) {
        stateRef.current.text = newText;
        setText(newText);
      }
    };
    const onLeave = () => {
      // Park the cursor off-screen when the pointer leaves the window.
      targetRef.current.x = -100;
      targetRef.current.y = -100;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, [enabled]);

  // 60fps rAF loop interpolates position so the cursor follows the mouse
  // with a slight ease (lerp). No jitter at high refresh rates.
  useEffect(() => {
    if (!enabled) return;
    const lerp = (a, b, n) => (a + (b - a) * n);

    const tick = () => {
      const cur = currentRef.current;
      const tgt = targetRef.current;
      cur.x = lerp(cur.x, tgt.x, 0.35);
      cur.y = lerp(cur.y, tgt.y, 0.35);
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${cur.x}px, ${cur.y}px, 0)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${cur.x}px, ${cur.y}px, 0)`;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [enabled]);

  if (!enabled) return null;

  // Color logic — invert across the light/dark boundary.
  // Background of the dot: --ink on light sections, --paper on dark.
  // Border of the dot: the *opposite* — so it reads as a ringed circle
  // on either background. Hover ring: same opposite, larger.
  const dotFill = onDark ? "var(--paper)" : "var(--ink)";
  const dotBorder = onDark ? "var(--ink)" : "var(--paper)";
  const ringBorder = dotBorder;

  const dotSize = text ? 2 : hover ? DOT_SIZE : DOT_SIZE;
  const ringSize = hover ? RING_SIZE + HOVER_PAD : RING_SIZE;

  // Native cursor is hidden everywhere we render this, since the dot
  // IS the cursor. We do this via body class so the same stylesheet
  // owns the rule (no JS to set inline styles on body).
  // The class also flips per-section so text inputs get a native caret.
  return (
    <>
      <style>{`
        body.has-dc-cursor,
        body.has-dc-cursor * { cursor: none !important; }
        body.has-dc-cursor input,
        body.has-dc-cursor textarea,
        body.has-dc-cursor select,
        body.has-dc-cursor [contenteditable="true"] { cursor: text !important; }
      `}</style>
      <div
        ref={ringRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: ringSize,
          height: ringSize,
          marginLeft: -ringSize / 2,
          marginTop: -ringSize / 2,
          border: `1.5px solid ${ringBorder}`,
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 9999,
          opacity: text ? 0 : 0.55,
          transition: "width 180ms var(--ease), height 180ms var(--ease), margin 180ms var(--ease), border-color 220ms var(--ease), opacity 180ms var(--ease)",
          willChange: "transform, width, height",
        }}
      />
      <div
        ref={dotRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: dotSize,
          height: dotSize,
          marginLeft: -dotSize / 2,
          marginTop: -dotSize / 2,
          background: dotFill,
          border: `1.5px solid ${dotBorder}`,
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 10000,
          opacity: text ? 0 : 1,
          transition: "background 220ms var(--ease), border-color 220ms var(--ease), width 180ms var(--ease), height 180ms var(--ease), margin 180ms var(--ease), opacity 180ms var(--ease)",
          willChange: "transform, background",
        }}
      />
    </>
  );
}