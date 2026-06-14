# CLAUDE.md — DreamClerk Landing

> Frontend skills ordering for the DreamClerk landing page build.
> Three skills are installed in this order. Run them sequentially; do not skip.

---

## Skill stack (in order)

| # | Skill | Source | When to run |
|---|---|---|---|
| 1 | **taste-skill** | https://github.com/Leonxlnx/taste-skill | **First.** Read the brief, infer the design read, set the 3 dials. |
| 2 | **impeccable** | https://github.com/pbakaus/impeccable | **Second.** Apply the 30 design rules + register reference (brand/product). |
| 3 | **emil-design-eng** | https://github.com/emilkowalski/skill | **Third.** Polish: animation, micro-interactions, invisible details. |

> A fourth skill — `frontend-design` (Anthropic official) — is the harness glue and runs as the outermost wrapper around all three.

---

## The order, and why

```
[frontend-design harness]                ← outermost: scaffolding, files, components
        │
        ▼
[1] taste-skill                          ← "what kind of page is this?"
        │  sets: DESIGN_VARIANCE, MOTION_INTENSITY, VISUAL_DENSITY
        │  output: one-line "Design Read"
        ▼
[2] impeccable                           ← "is it actually good?"
        │  applies: 30 hard rules, color/typo/layout/motion guardrails
        │  reads: reference/brand.md (landing) OR reference/product.md (app)
        │  uses: node scripts/context.mjs → reads PRODUCT.md / DESIGN.md
        ▼
[3] emil-design-eng                      ← "does it feel right?"
           applies: animation curves, transform-origin, micro-interactions
           output: Before/After markdown table on every change
```

**taste-skill** picks a direction.
**impeccable** checks the direction against craft rules.
**emil-design-eng** makes the micro-decisions that make it feel hand-made.

---

## How to run

### 1. Install all three skills (one-time)
```bash
git clone https://github.com/Leonxlnx/taste-skill.git   ~/.claude/skills/taste-skill
git clone https://github.com/pbakaus/impeccable.git      ~/.claude/skills/impeccable
git clone https://github.com/emilkowalski/skill.git      ~/.claude/skills/emil-design-eng
```

### 2. First time on this project — let impeccable read context
```bash
node ~/.claude/skills/impeccable/skill/scripts/context.mjs
```
This prints `PRODUCT.md` + `DESIGN.md` (the source of truth for brand tokens, register, audience). If `NO_PRODUCT_MD` is reported, follow `~/.claude/skills/impeccable/skill/reference/init.md` before continuing.

### 3. For every new build / redesign / polish pass

Run them in this order, in this order, every time:

```text
TASK: build / polish / audit / redesign a section of the DreamClerk landing page

STEP 1 — taste-skill
  Read the brief (page kind, vibe words, audience, references).
  Output one line:
    "Design Read: <page kind> for <audience>, with <vibe>, leaning toward <aesthetic family>."
  Set 3 dials:
    DESIGN_VARIANCE: <1-10>
    MOTION_INTENSITY: <1-10>
    VISUAL_DENSITY: <1-10>
  Pick 1 sub-skill if needed: minimalist / brutalist / soft / output / etc.

STEP 2 — impeccable
  Read the matching register reference:
    → landing page / brand site / portfolio  → reference/brand.md
    → app UI / dashboard / product shell      → reference/product.md
  Apply the 30 rules from SKILL.src.md.
  Verify contrast, typography, layout, motion, z-index, anti-patterns.
  Run any sub-command the user asked for: craft, audit, polish, colorize, animate...

STEP 3 — emil-design-eng
  Polish the animation + micro-interaction layer.
  For every change, output a Before/After markdown table:
    | Before | After | Why |
  Honor his rules:
    - transition: not "all" — specify property + duration + ease
    - transform-origin follows the trigger
    - ease-out-expo / ease-out-quart — never bounce, never elastic
    - :active = scale(0.97) on buttons
    - scale from 0.95 + opacity 0, never scale(0) alone

STEP 4 — output
  Commit real, working code. No prototypes. No "you can extend this."
  Run npm run build and verify 0 errors.
```

---

## DreamClerk-specific constraints (always on)

These are project-level overrides that apply on top of the three skills.

### Brand
- **Monochrome only.** Black `#0a0a0a` on paper `#f4f1ea`. No color except status semantics (green/amber/red) inside terminal contexts.
- **Logo font** is the only display face: lowercase, geometric, friendly. Use it for the wordmark. Pair with **Geist Mono** for code, **Instrument Serif Italic** for serif accent phrases.
- **Terminal is the visual language.** Every section opens with a `$ command` label. Every interactive element looks like a shell input or a keycap. No SaaS-card grids, no purple gradients, no glassmorphism.

### Voice
- Confident, not loud. Sentences are short and declarative.
- Never: "boost", "supercharge", "next-generation", "AI-powered", "seamless".
- Always: "ship code", "fix the bug", "get reviewed", "earn a certificate".

### Hard rules
- No emoji in product copy. Status dots only (● ◐ ○).
- Hero display letter-spacing floor: `-0.04em` (impeccable rule, hard-required).
- Hero display ceiling: `clamp(...)` max ≤ 6rem.
- Every animation must have a `prefers-reduced-motion: reduce` alternative.
- All motion: `ease-out-expo` or `ease-out-quart`. No bounce, no elastic.
- Cursor: `cursor: none` on `>1024px` only. Re-enable below.
- Reduced motion: kill animation + transition duration to 0.001ms globally.

### Stack
- React + Vite, Tailwind, Framer Motion.
- Single-page. No router.
- Components in `app/src/components/`. Shared primitives in `app/src/components/Primitives.jsx`.
- All section labels go through `<SectionLabel status="...">...</SectionLabel>` — never write the label markup by hand.

### Page sections (in order)
1. Nav (with status pill, "SYSTEMS NORMAL")
2. Hero (no parallax — terminal is the focal point)
3. Marquee (separator dots between phrases)
4. Loop (8 steps, mono `[01]` indices)
5. Workspace (file tabs + status bar in the IDE mockup)
6. Tracks (6 cards, mono `[F1]` `[B2]` … indices + `▰▰▰▰▱` progress)
7. Companies (6 cards, `$ cd <name> && ls` detail framing)
8. Certificate (`$ verify --cert dc-2026-8f4a-9c2b` panel)
9. Crisis (dark section, top status bar `STATUS: CRITICAL`)
10. Stats (count-up strip, 5 metrics, on dark)
11. Testimonials (`$ cat /home/alumni/<name>.md` file pane)
12. FAQ (`$ man dreamclerk --help` man-page framing)
13. Closing Terminal (full dark panel, typewriting `dreamclerk --apply …`, ends in `↵ Enter IDE` + `? Talk to a human` KeyCaps)

### Build / verify
- `npm run build` must end with `0 errors`.
- Dev server runs on `http://localhost:5174/`.
- If a section feels generic → re-run taste-skill on it. Do not patch.
- If a section breaks a rule → re-run impeccable on it.
- If a section feels flat → re-run emil-design-eng on it.

---

## Anti-references (never ship)

- ❌ Purple gradient hero on dark background
- ❌ Three equal feature cards under a "Why us" headline
- ❌ "Boost your productivity" / "Supercharge your workflow"
- ❌ Generic glassmorphism panels
- ❌ `transition: all 300ms` (specify property + duration + ease)
- ❌ `transform: scale(0)` appearing from nothing (use `scale(0.95); opacity: 0`)
- ❌ `ease-in` on dropdowns
- ❌ `ease-bounce` / `elastic` on anything
- ❌ Emoji as decoration in body copy
- ❌ Pricing tables (we removed Pricing on this site — the certificate is the sell)

---

## Quick reference — when to use which skill

| If the user says… | Run first | Then | Then |
|---|---|---|---|
| "build a new landing page" | taste-skill (read brief + dials) | impeccable (brand.md) | emil (polish) |
| "redesign the hero" | taste-skill (variance may shift) | impeccable (craft + shape) | emil (micro) |
| "audit this for craft issues" | impeccable (audit command) | — | emil (review table) |
| "make this feel more alive" | impeccable (animate.md) | emil (animation curves) | — |
| "this looks too generic" | taste-skill (anti-slop checklist) | impeccable (bolder.md) | emil (overdrive) |
| "this looks too loud" | taste-skill (quieter dials) | impeccable (quieter.md) | — |
| "I want the IDE to feel like VS Code" | impeccable (product.md) | emil (interaction design) | — |

---

## Install commands (run once)

```bash
# 1. skills into ~/.claude/skills
git clone https://github.com/Leonxlnx/taste-skill.git   ~/.claude/skills/taste-skill
git clone https://github.com/pbakaus/impeccable.git      ~/.claude/skills/impeccable
git clone https://github.com/emilkowalski/skill.git      ~/.claude/skills/emil-design-eng

# 2. write the project-level PRODUCT.md (so impeccable/context.mjs has something to read)
#    required frontmatter:
#      register: brand         # this is a landing page
#      audience: UG students applying to internships
#      product: DreamClerk — career simulation platform
#      anti-references: see "Anti-references" section above
```

---

*This file is the source of truth for skill ordering on this project. If a future skill is added, append it after emil-design-eng and document the new order here.*
