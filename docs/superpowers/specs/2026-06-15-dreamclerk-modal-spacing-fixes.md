# Spec — DreamClerk modal, footer links, spacing fix

**Date:** 2026-06-15
**Scope:** Targeted edits to four files. No other landing-page content changes.

## Goal

Make the on-page signup modal smaller (name + email only), make sure it appears
at 50% scroll, persist the data through Supabase, remove the twitter + youtube
social links, and fix the small vertical gap that appears between the
non-dark `Terminal` section and the dark `Experience` (gain experience) section.

## Non-goals

- No redesign of any section, copy, or motion.
- No new UI elements outside the modal form.
- No dev-server / build-config changes.
- Do not provision a Supabase project — only wire the client to post to the
  existing one configured via `.env`.
- Do not change the dev workflow (`npm run dev` on port 5174, etc.).

## File-level changes

### 1. `app/src/components/EmailModal.jsx`

Replace the current email-only form with a name + email form, used by every
trigger (the 50% scroll trigger and any `data-open-modal` button click).

**New copy:**
- Eyebrow: `/ get notified · coming soon` (unchanged)
- Headline: `get notified when dreamclerk opens.`
- Lede: `drop your details. we will email you the moment a new cohort opens.`
- Remove: the four `/01`–`/04` value-prop list, the long lede paragraph, the
  `modal-stack` line, and the live waitlist counter card.
- Keep: success card, error card, focus/escape/backdrop behavior, the existing
  body-scroll lock, the `useReveal`-style focus-on-open.

**Form fields:**
- Two inputs side-by-side on `>= 720px`, stacked below that:
  - `name` (text input, required, `autoComplete="name"`)
  - `email` (email input, required, `autoComplete="email"`)
- Submit label: `get notified →` (unchanged).
- Submit disabled until both fields are non-empty.
- Validation: `email` only requires an `@` substring. No shape regex. Whitespace
  trimmed on submit.
- 409 from Supabase: "this email is already on the list." (unchanged).
- Other errors: pass through as today.
- Source tag: unchanged — `EmailModal` accepts a `source` prop and posts it.

**Footer inside modal:**
- Drop `twitter / 𝕏` and `youtube` lines.
- Keep: `instagram`, `linkedin`, `github`.

**State machine (unchanged shape):**
- `idle | loading | success | error`
- Reset on close (after the existing 220ms timeout).

### 2. `app/src/lib/supabase.js`

- Change `subscribe(email, source)` to `subscribe(name, email, source)`.
- POST body becomes `{ name, email, source }` to the existing `subscribers`
  table — assumes the operator has added a `name text` column to that table
  in the Supabase dashboard (and made it `null`-able, since existing rows
  predate this change).
- If the response is `400` with a Postgres `null value in column "name"`
  error, the modal shows: `we could not save your details. please try again.`
- Keep `getSubscriberCount` and `bumpSubscriberCount` as-is — they are still
  used by `Experience.jsx` and the modal-on-open counter.
- Keep the local-storage fallback behavior.
- Add a comment block at the top documenting the new table shape:
  `subscribers(id uuid pk, name text null, email text unique, source text, created_at timestamptz)`.

### 3. `app/src/.env.example`

Create a fresh `.env.example` (the real `.env` was deleted in the reset).
```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```
Do not commit any real secrets. Only the example file lands in the repo.

### 4. `app/src/components/Footer.jsx`

- Remove the `twitter / 𝕏 ↗` line.
- Remove the `youtube ↗` line.
- Keep `instagram`, `linkedin`, `github`.

### 5. `app/src/index.css`

Targeted spacing fix only — no full audit.

The `Experience` section uses `class="dark-block merge-dark"` and explicitly
sets `padding-top: 0` inline. The remaining small gap above it is the
*previous* section's `padding-bottom` (the global `section { padding-bottom:
clamp(48px, 5.5vw, 80px) }` rule).

Add one targeted CSS rule:

```css
/* collapse the bottom padding of any section that flows into a .merge-dark
   dark slab, so the previous section's white gutter disappears. */
section:has(+ section.merge-dark) { padding-bottom: 0; }
```

Walk the page for all `section.merge-dark` consumers and confirm the rule
fixes the visual seam:
- `Terminal` (`<Terminal />`) → `Experience` (`<Experience />`) — the gap
  the user flagged.
- `Crisis` (`<Problem />` / `<Cure />` chain) → `Stats` (`<Stats />`) — apply
  the same fix; user explicitly asked for "every section is spaced properly."
- Any other `merge-dark` consumer in the same file — apply the same rule.

If `:has(+ ...)` is not supported by all target browsers, fall back to
explicit class pairs. (Check Vite + project browser targets before
committing; Vite 8 + modern evergreen = `:has()` is safe.)

Do **not** alter `section { padding-top, padding-bottom }` defaults, the
`section:last-of-type` rule, or any other spacing token.

## Out of scope (explicitly)

- No new Supabase project provisioning.
- No new Supabase SQL migration file (operator will add the `name` column by
  hand or via the Supabase dashboard).
- No copy edits to any section outside the modal.
- No motion, color, or typography changes.
- No changes to App.jsx (the 50% scroll-popup trigger is already wired and
  reuses the same modal as button clicks).

## Verification (per superpowers:verification-before-completion)

Before claiming done, I will:
1. Run `npm run build` — must end with `0 errors`.
2. Run `npm run dev` and visit the page locally.
3. Manually verify in a browser session that:
   - The modal appears when scrolling to the 50% mark of the page.
   - The same modal appears when clicking `get notified` in the Nav.
   - Submitting with both fields populated POSTs to Supabase and shows the
     success card.
   - Submitting with an empty name or email does not POST and the submit
     button stays disabled.
   - Footer no longer renders twitter or youtube lines.
   - No vertical gap between `Terminal` and `Experience` sections.
4. Read the built CSS in the browser devtools to confirm the `:has(+ ...)`
   rule is applied (not stripped).

## Risks

- **`:has(+ ...)` browser support**: not a risk on evergreen browsers, but
  Safari < 15.4 and any pre-2022 browser will silently ignore the rule. If the
  project's browser support matrix is unknown, the fallback is to add the
  class `merge-dark-prev` to `Terminal` and `Problem` explicitly and target
  `section.merge-dark-prev { padding-bottom: 0 }`. The user has not specified
  a browser-support matrix; I will assume evergreen (Chrome / Edge / Firefox /
  Safari 15.4+) since Vite 8 is being used.
- **Supabase `name` column not yet added**: the POST will return a 400 until
  the operator runs `ALTER TABLE subscribers ADD COLUMN name text;` in the
  Supabase SQL editor. Modal will display a friendly error in the meantime.
  This is a known one-time migration step.
- **Existing dev `.env` deleted in the reset**: the operator needs to repopulate
  `app/.env` (gitignored) with their real Supabase keys, or the modal will run
  in mock mode and silently pretend submissions succeed (existing behavior).
