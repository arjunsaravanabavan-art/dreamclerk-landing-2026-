---
register: brand
audience: Undergraduate CS students in India (IIT/NIT/Anna University tier) applying to internships, plus recruiters who verify their certificates
product: DreamClerk — real-world career simulation platform. Coming-soon landing page in a Claude-style AI chat aesthetic.
voice: Confident, declarative, terminal-tone. "You don't study here. You work here." Never hedging, never breathless.
register_reason: Pre-launch coming-soon page. The AI chat is the funnel. One action: email.
---

# Product (revised — coming-soon, AI-chat register)

## What it is now

A coming-soon landing page. **Four sections**: Nav, Hero (with terminal ticker + runnable terminal), AIChat (the centerpiece — visitor types, scripted AI streams back with popups on every numbered item), Apply (single email field, on submit the chat streams a 3-line confirmation). Plus a recovered footer.

## Why the redesign

The 11-section "launched product" page (Hero → Loop → Workspace → Tracks → Companies → Certificate → Crisis → Stats → Testimonials → FAQ → Closing Terminal) is the wrong shape for a pre-launch state. It's also too dense, has dead code (`Final.jsx` never rendered — the Nav Apply button linked to `#apply` but no element had that id), and the narrative arc (Crisis Mode, cohort stats, alumni testimonials) is false advertising before launch.

The chat interface is the right funnel for a pre-launch product:
- Visitors get to **try the product** without signing up (they type, the AI answers, the AI behaves like the real product would)
- The chat streams honestly scripted answers — no LLM call, no false claim of intelligence
- The only CTA is email. One field. One action. The action proves the AI works (it acknowledges the email in a streamed turn)

## Aesthetic lane

**AI chat interface (Claude-style)** — terminal-as-poster on the hero, full-width two-column chat on the centerpiece. Mono chrome only (paper/ink, no purple, no glassmorphism). The chat itself is the design.

# Product

## What it is

A career-simulation platform where students get hired (by an AI recruiter), join a simulated company, get tickets, ship code, get reviewed, earn XP, clear a technical interview, and earn a **verified Experience Certificate** — not a completion badge.

The IDE is the product. The certificate is the sell. The brand voice lives in the terminal.

## Audience

Primary: UG students in India (18–22), CS / ECE branch, frustrated with tutorial hell, looking for proof of work to attach to placement applications.

Secondary: Recruiters at Indian tech companies who scan candidate certificates. They land on `dreamclerk.io/verify` to confirm a candidate's actual code submissions, AI review scores, and sprint velocity.

## Brand personality

**Three words:** terminal, honest, earned.

- **Terminal** — the entire visual language is a CLI. Section labels are `$ commands`. Buttons are keycaps. CTAs are prompts. Status bars on dark. Carets blinking.
- **Honest** — no purple-gradient hype, no "boost productivity", no "supercharge". The certificate is sold on what the student actually shipped.
- **Earned** — every visual choice (file tabs, error counts, severity flags, status bars) reinforces "you did the work" not "we gave you a badge."

## Brand pillars

1. **The IDE is the product.** Every section frames the platform as a real working environment, not a learning app.
2. **Certificates are verified work records, not completion badges.** QR + blockchain hash + the actual code behind them.
3. **Simulated companies are real engineering orgs** with codebases, culture docs, and PR review culture.
4. **XP is real because the work is real.** Crisis Mode, technical interviews, capstones — all real, all evaluated.

## Anti-references

The site and brand must be the **antithesis** of:

- EdTech SaaS landing clichés (hero + 3 feature cards + "trusted by 10k students" + pricing table)
- Purple-gradient dark modes, glassmorphism panels, neon accents
- "Boost your career" / "Supercharge your skills" / "AI-powered learning"
- Emoji as decoration in product copy
- Generic "Why us" comparison tables that look like every other site
- Three equal feature cards in a row (the lazy answer — impeccable rule `skill-layout-cards-lazy`)

## Brand tokens (mono chrome only)

```
ink:      #0a0a0a   (text, borders, primary surface fill on dark)
paper:    #f4f1ea   (page background, foreground text on dark)
paper-2:  #ece8df   (subtle alt surface for tabs/strips)
status:   green/amber/red — only inside terminal contexts, never decorative
```

- Logo font: lowercase geometric sans, used as-is for the wordmark
- Display: same logo family, black weight, letter-spacing `-0.04em` to `-0.02em`
- Body: Geist
- Mono: Geist Mono (terminal, code, status bars, keycaps)
- Serif: Source Serif 4 Italic (used sparingly as a single accent word per section, never as body)
  - Source Serif 4 chosen for its technical-document feel — a 1970s terminal manual, not a magazine
  - Off the "reflex-reject" list (Fraunces, Newsreader, Instrument Serif all banned as AI-shit defaults)
  - `.serif-accent` = italic, `.serif-roman` = upright (used in the closing CTA's "Start shipping.")

## Voice examples

| Don't | Do |
|---|---|
| "Boost your career with AI" | "Stop studying. Start shipping." |
| "Supercharge your learning" | "Fix the bug before 5 PM." |
| "Trusted by 10,000+ students" | "47 PRs · 12 sprints · 8 incidents · verified." |
| "Get certified today!" | "You didn't complete a course. You shipped code." |

## Sections (locked order)

1. Nav — status pill, `SYSTEMS NORMAL`
2. Hero — no parallax, terminal is the focal point
3. Marquee — separator dots between phrases
4. Loop — 8 steps, mono `[01]` indices
5. Workspace — file tabs + status bar in the IDE mockup
6. Tracks — 6 cards, mono `[F1]` `[B2]` indices + `▰▰▰▰▱` progress
7. Companies — 6 cards, `$ cd <name> && ls` detail
8. Certificate — `$ verify --cert dc-2026-8f4a-9c2b`
9. Crisis — dark section, top status bar
10. Stats — count-up strip on dark
11. Testimonials — `$ cat /home/alumni/<name>.md`
12. FAQ — `$ man dreamclerk --help`
13. Closing Terminal — typewriting `$ dreamclerk --apply`, ends in `↵ Enter IDE` + `? Talk to a human` KeyCaps

## Hard craft rules (apply on top of impeccable's 30)

- Display letter-spacing: never tighter than `-0.04em` (impeccable `skill-typo-tracking-floor`)
- Display size: `clamp()` max ≤ 6rem (~96px) (impeccable `skill-typo-hero-ceiling`)
- Body line length: 65–75ch
- All motion: `ease-out-expo` or `ease-out-quart`. No bounce, no elastic.
- Every animation needs `prefers-reduced-motion: reduce` fallback
- Cards: avoid. Use them only when they're the best affordance. Nested cards are wrong.

## Repeated label system (DELIBERATE, NOT ACCIDENTAL)
The `$ command` labels across sections are a deliberate CLI theme:
- `$ ls companies`, `$ cat /home/alumni`, `$ man dreamclerk`, etc.
- This is a named CLI metaphor, not duplicated chrome; each has a unique shell prompt
- Font: Geist Mono uppercase tracking-widest, not tiny-tracked uppercase
- Example: `$ ls ./companies / 05 / COMPANIES` is *not* the same as `$ cat /home/alumni / 08 / WHO GOT HIRED`
- This is intentional branding, not rule-violation
- Never "flatten" these into generic labels like "About" or "Features"
- `transition: <prop> <duration> <ease>` — never `transition: all`
- `transform-origin` follows the trigger (not center) for popovers
- `:active` state on every clickable thing — at minimum `scale(0.97)`
- Reveal animations: `scale(0.95); opacity: 0` → `scale(1); opacity: 1`. Never `scale(0)`.
- Cursor: `cursor: none` only on `>1024px`. Re-enable on touch.
