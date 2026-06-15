# DreamClerk Modal + Footer + Spacing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Trim the on-page signup modal to name + email, persist through Supabase, remove twitter + youtube social links, and fix the small vertical gap above the dark "gain experience" section.

**Architecture:** Targeted edits to four existing files plus one new `.env.example`. No new components, no new state, no new dependencies. The 50% scroll-popup is already wired in `App.jsx` and reuses the same `<EmailModal />` as button clicks — we just slim the modal contents.

**Tech Stack:** React 19, Vite 8, Tailwind 3, plain CSS. Supabase REST (no `@supabase/supabase-js` SDK — direct `fetch`).

**Spec:** `docs/superpowers/specs/2026-06-15-dreamclerk-modal-spacing-fixes.md`

---

## File Structure

| File | Responsibility | Action |
|------|----------------|--------|
| `app/src/components/EmailModal.jsx` | Single signup modal used by all triggers | Modify — trim to name + email fields, new copy, drop twitter + youtube from in-modal footer |
| `app/src/lib/supabase.js` | Supabase REST client for `subscribers` table + waitlist counter | Modify — `subscribe(name, email, source)`; update header docstring |
| `app/src/.env.example` | Template for `VITE_SUPABASE_*` env vars | Create |
| `app/src/components/Footer.jsx` | Site footer with social links | Modify — remove twitter + youtube lines |
| `app/src/index.css` | Global styles | Modify — add one rule `section:has(+ section.merge-dark) { padding-bottom: 0 }` |

No file splits, no new components, no new dependencies.

---

## Task 1: Trim the EmailModal to name + email

**Files:**
- Modify: `app/src/components/EmailModal.jsx`

- [ ] **Step 1: Replace the entire file with the new contents**

Open `app/src/components/EmailModal.jsx` and replace its entire contents with:

```jsx
import { useEffect, useRef, useState } from "react";
import { subscribe, getSubscriberCount } from "../lib/supabase";

export default function EmailModal({ open, onClose, source = "modal" }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [error, setError] = useState("");
  const [count, setCount] = useState;
  const inputRef = useRef(null);
  const cardRef = useRef(null);

  // load live waitlist count on open
  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    getSubscriberCount().then((n) => {
      if (!cancelled) setCount(n);
    });
    return () => { cancelled = true; };
  }, [open]);

  // lock body scroll when open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // focus first input on open
  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 80);
      return () => clearTimeout(t);
    }
  }, [open]);

  // reset state when closed
  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => {
        setStatus("idle");
        setError("");
        setName("");
        setEmail("");
      }, 220);
      return () => clearTimeout(t);
    }
  }, [open]);

  // close on escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (status === "loading") return;
    const cleanName = name.trim();
    const cleanEmail = email.trim();
    if (!cleanName || !cleanEmail) {
      setStatus("error");
      setError("Please enter your name and email.");
      return;
    }
    if (!cleanEmail.includes("@")) {
      setStatus("error");
      setError("That email looks off — make sure it has an @.");
      return;
    }
    setStatus("loading");
    setError("");
    const result = await subscribe(cleanName, cleanEmail, source);
    if (result.ok) {
      setStatus("success");
      setTimeout(() => onClose(), 2200);
    } else {
      setStatus("error");
      setError(result.error || "Something went wrong.");
    }
  }

  if (!open) return null;

  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="modal-card" ref={cardRef}>
        <button
          type="button"
          className="modal-close"
          aria-label="Close"
          onClick={onClose}
        >
          ×
        </button>

        {status === "success" ? (
          <div className="modal-success">
            <div className="modal-eyebrow">/ confirmed</div>
            <h2 id="modal-title">you are on the list.</h2>
            <p>
              we will email you the moment a new cohort opens. check{" "}
              <a href="https://www.instagram.com/dreamclrk" target="_blank" rel="noreferrer">@dreamclrk</a>{" "}
              for the announcement in the meantime.
            </p>
            <button className="btn solid" onClick={onClose}>
              close <span className="arr">→</span>
            </button>
          </div>
        ) : (
          <>
            <div className="modal-eyebrow">/ get notified · coming soon</div>
            <h2 id="modal-title">get notified when dreamclerk opens.</h2>
            <p className="modal-lede">
              drop your details. we will email you the moment a new cohort opens.
            </p>

            {count != null && (
              <div className="modal-waitlist-count">
                <span className="pulse" />
                <span>{count.toLocaleString("en-IN")} undergrads already on the waitlist</span>
              </div>
            )}

            <form className="modal-form" onSubmit={handleSubmit} noValidate>
              <div className="modal-input-row modal-input-row--split">
                <div className="modal-field">
                  <label htmlFor="modal-name" className="modal-label">your name</label>
                  <input
                    ref={inputRef}
                    id="modal-name"
                    type="text"
                    className="modal-input"
                    placeholder="aanya iyer"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (status === "error") setStatus("idle");
                    }}
                    disabled={status === "loading"}
                    required
                    autoComplete="name"
                  />
                </div>
                <div className="modal-field">
                  <label htmlFor="modal-email" className="modal-label">your email</label>
                  <input
                    id="modal-email"
                    type="email"
                    className="modal-input"
                    placeholder="you@college.edu"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (status === "error") setStatus("idle");
                    }}
                    disabled={status === "loading"}
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn solid modal-submit"
                disabled={status === "loading" || !name.trim() || !email.trim()}
              >
                {status === "loading" ? "joining…" : <>get notified <span className="arr">→</span></>}
              </button>

              {status === "error" && (
                <div className="modal-error">{error}</div>
              )}
              <div className="modal-fine">
                no spam · unsubscribe anytime · we never share your details
              </div>
            </form>

            <div className="modal-foot">
              <span>follow along →</span>
              <a href="https://www.instagram.com/dreamclrk" target="_blank" rel="noreferrer">instagram ↗</a>
              <a href="https://www.linkedin.com/company/dreamclerk" target="_blank" rel="noreferrer">linkedin ↗</a>
              <a href="https://github.com/dreamclerk" target="_blank" rel="noreferrer">github ↗</a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify the file is syntactically valid**

Run from project root: `cd app && node -e "require('@babel/parser').parse(require('fs').readFileSync('src/components/EmailModal.jsx','utf8'),{sourceType:'module',plugins:['jsx']});console.log('ok')"`

Expected: prints `ok` (one line, no error). If this command errors with "Cannot find module '@babel/parser'", run it via `npx --yes @babel/parser` substitute: skip this step — there is no test runner in this project; the next step's `npm run build` will catch syntax errors.

- [ ] **Step 3: Build to confirm no compile errors**

Run from project root: `cd app && npm run build 2>&1 | tail -15`

Expected: ends with `0 errors` (or equivalent green output from Vite).

- [ ] **Step 4: Commit**

```bash
git add app/src/components/EmailModal.jsx
git commit -m "feat(modal): trim to name+email, drop in-modal twitter/youtube"
```

---

## Task 2: Add CSS for the two-column form layout

**Files:**
- Modify: `app/src/index.css`

The new modal uses `class="modal-input-row modal-input-row--split"`, but the existing `.modal-input-row` is a single-row flex container. Add a modifier so the two `.modal-field` blocks sit side-by-side on wider viewports and stack on narrow ones.

- [ ] **Step 1: Locate the existing modal CSS block**

In `app/src/index.css`, search for `.modal-input-row` (use `grep -n "\.modal-input-row" app/src/index.css`). Note the line number.

- [ ] **Step 2: Add the modifier styles**

Immediately after the closing `}` of the existing `.modal-input-row { ... }` block, add:

```css
.modal-input-row--split { gap: 12px; }
.modal-field { display: flex; flex-direction: column; gap: 6px; flex: 1 1 0; min-width: 0; }
.modal-field .modal-label { margin: 0; }
@media (max-width: 720px) {
  .modal-input-row--split { flex-direction: column; }
}
```

- [ ] **Step 3: Build to confirm no compile errors**

Run from project root: `cd app && npm run build 2>&1 | tail -10`

Expected: ends with `0 errors`.

- [ ] **Step 4: Commit**

```bash
git add app/src/index.css
git commit -m "feat(modal): two-column name+email form layout"
```

---

## Task 3: Update supabase.js to send `name`

**Files:**
- Modify: `app/src/lib/supabase.js`

- [ ] **Step 1: Update the header docstring (lines 1-10)**

In `app/src/lib/supabase.js`, replace the header comment block (lines 1–10) with:

```javascript
// supabase email subscriber + public waitlist counter
// drop your project url + anon key into .env:
//   VITE_SUPABASE_URL=https://xxxx.supabase.co
//   VITE_SUPABASE_ANON_KEY=eyJ...
//
// tables / functions expected:
//   subscribers(id uuid pk, name text null, email text unique, source text, created_at timestamptz)
//     NOTE: `name` column must be added with: ALTER TABLE subscribers ADD COLUMN name text;
//   waitlist_count row: { value: int }   (seed = 1847)
//   rpc get_waitlist_count() returns int
//   rpc bump_waitlist_count() returns int  (one-per-visitor-per-day, see COUNT_TTL_MS)
```

- [ ] **Step 2: Replace the `subscribe` function**

In `app/src/lib/supabase.js`, replace the entire `subscribe` function (currently lines 22–60) with:

```javascript
export async function subscribe(name, email, source = "modal") {
  // trim and basic shape check — accept any string containing an `@`
  const cleanName = (name || "").trim();
  const cleanEmail = (email || "").trim();
  if (!cleanName) {
    return { ok: false, error: "Please enter your name." };
  }
  if (!cleanEmail || !cleanEmail.includes("@")) {
    return { ok: false, error: "Please enter a valid email address." };
  }

  if (!isConfigured()) {
    // graceful fallback: log + pretend it worked so the ui does not break
    // in dev. wire your real keys in .env to enable persistence.
    console.warn(
      "[dreamclerk] supabase env vars missing. add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env"
    );
    return { ok: true, mock: true };
  }

  try {
    const res = await fetch(`${URL}/rest/v1/subscribers`, {
      method: "POST",
      headers: {
        apikey: KEY,
        Authorization: `Bearer ${KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({ name: cleanName, email: cleanEmail, source }),
    });

    if (res.ok) return { ok: true };

    if (res.status === 409) {
      return { ok: false, error: "This email is already on the list." };
    }

    const text = await res.text();
    return { ok: false, error: text || `Subscription failed (${res.status}).` };
  } catch (err) {
    return { ok: false, error: err?.message || "Network error. Please try again." };
  }
}
```

- [ ] **Step 3: Build to confirm no compile errors**

Run from project root: `cd app && npm run build 2>&1 | tail -10`

Expected: ends with `0 errors`.

- [ ] **Step 4: Commit**

```bash
git add app/src/lib/supabase.js
git commit -m "feat(supabase): subscribe() sends name along with email"
```

---

## Task 4: Create `app/src/.env.example`

**Files:**
- Create: `app/.env.example`

- [ ] **Step 1: Create the file**

```bash
cat > app/.env.example <<'EOF'
# Supabase project credentials for the waitlist signup modal.
# Copy this file to `app/.env` (gitignored) and fill in your real values.
# Get them from https://app.supabase.com → your project → Settings → API.

VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
EOF
```

- [ ] **Step 2: Verify `.gitignore` already excludes `.env`**

Run from project root: `grep -E '^\.env' app/.gitignore || grep -E '^\.env$|^\\.env' .gitignore || echo "NO_MATCH"`

Expected: prints one or more matching lines. If `NO_MATCH`, add `.env` to `app/.gitignore` (create the file if it doesn't exist) with a single line: `.env`.

- [ ] **Step 3: Commit**

```bash
git add app/.env.example
git commit -m "chore: add .env.example for supabase credentials"
```

---

## Task 5: Remove twitter + youtube from Footer

**Files:**
- Modify: `app/src/components/Footer.jsx`

- [ ] **Step 1: Delete the twitter line**

In `app/src/components/Footer.jsx`, delete lines 60–64 (the `<li>` containing the `twitter.com/dreamclerk` link). Specifically, remove this block:

```jsx
              <li>
                <a href="https://twitter.com/dreamclerk" target="_blank" rel="noreferrer">
                  twitter / 𝕏 ↗
                </a>
              </li>
```

- [ ] **Step 2: Delete the youtube line**

In the same file, delete lines 75–79 (the `<li>` containing the `youtube.com/@dreamclerk` link). Specifically, remove this block:

```jsx
              <li>
                <a href="https://www.youtube.com/@dreamclerk" target="_blank" rel="noreferrer">
                  youtube ↗
                </a>
              </li>
```

- [ ] **Step 3: Build to confirm no compile errors**

Run from project root: `cd app && npm run build 2>&1 | tail -10`

Expected: ends with `0 errors`.

- [ ] **Step 4: Commit**

```bash
git add app/src/components/Footer.jsx
git commit -m "chore(footer): drop twitter and youtube social links"
```

---

## Task 6: Fix the vertical gap above `.merge-dark` sections

**Files:**
- Modify: `app/src/index.css`

The `Experience` section uses `className="dark-block merge-dark"` and inline `style={{ paddingTop: 0 }}`. The small gap above it is the *previous* section's `padding-bottom` (the global `section { padding-bottom: clamp(48px, 5.5vw, 80px) }`). Same problem exists for `Certificate` (line 3 of `Certificate.jsx`) and any other `merge-dark` consumer.

- [ ] **Step 1: Add the targeted rule**

In `app/src/index.css`, immediately after the existing `section.merge-dark { padding-top: 0 !important; }` rule (line 261), add this single rule:

```css

/* when a non-dark section flows into a .merge-dark dark slab, collapse
   the white gutter so the dark slab starts flush against the previous
   section's content. applies to every merge-dark transition on the page. */
section:has(+ section.merge-dark) { padding-bottom: 0; }
```

- [ ] **Step 2: Build to confirm no compile errors**

Run from project root: `cd app && npm run build 2>&1 | tail -10`

Expected: ends with `0 errors`.

- [ ] **Step 3: Commit**

```bash
git add app/src/index.css
git commit -m "fix(css): close gap before .merge-dark sections"
```

---

## Task 7: Verify end-to-end and host locally

**Files:** none (verification only)

- [ ] **Step 1: Stop the existing dev server if one is running**

```bash
# from project root
ps -ef | grep -E 'vite|node.*dev' | grep -v grep
```

If any process is listed, run: `pkill -f "vite" || true` to terminate it. (Skip on Windows; the harness already tracks `bpoq7lo5q` and we will restart.)

- [ ] **Step 2: Confirm a clean build**

```bash
cd app && npm run build 2>&1 | tail -10
```

Expected: `0 errors` / `built in ...ms`.

- [ ] **Step 3: Start the dev server in the background**

```bash
cd app && npm run dev -- --host 127.0.0.1 --port 5174
```

Run in background (the harness exposes `run_in_background: true` on Bash).

- [ ] **Step 4: Wait for Vite to print the local URL**

After ~3 seconds, read the background task's output file (the harness prints the path in the result). Expected: line containing `Local:   http://127.0.0.1:5174/`.

- [ ] **Step 5: Manual browser checks**

Open `http://127.0.0.1:5174/` and verify:
- [ ] The page renders with no visible vertical gap between the non-dark `Terminal` section and the dark `Experience` (gain experience) section.
- [ ] The dark `Experience` section's top is flush with the previous section's content (no white gutter).
- [ ] The footer shows only `instagram`, `linkedin`, `github` links under "follow" — no twitter or youtube.
- [ ] Clicking "get notified" in the Nav opens a modal with: a name input, an email input, and a single "get notified →" submit button. The old 4-bullet list (`/01` … `/04`) is gone.
- [ ] Scrolling past the 50% mark of the page opens the same modal (the existing scroll-popup logic in `App.jsx` reuses `<EmailModal />`).
- [ ] Pressing Escape closes the modal.
- [ ] Clicking the backdrop closes the modal.
- [ ] Submitting with both fields empty: submit button is disabled.
- [ ] Submitting with only a name: submit button is disabled.
- [ ] Submitting with only an email: submit button is disabled.
- [ ] Submitting with both fields populated: button enables. (Network may mock the POST if `.env` is missing — that is expected; success card should still appear in mock mode.)

- [ ] **Step 6: Confirm Supabase `.env` setup is documented (operator note)**

If `app/.env` exists and has real credentials, the modal will POST to the real project. If not, the modal logs a warning and returns `{ ok: true, mock: true }`. Note in the final summary that the operator needs to:
1. Add a `name text` column to the `subscribers` table in the Supabase dashboard (`ALTER TABLE subscribers ADD COLUMN name text;`).
2. Copy `app/.env.example` to `app/.env` and fill in their real `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.

- [ ] **Step 7: Final summary commit (only if anything was tweaked during verification)**

If step 5 forced a tweak, commit it now. Otherwise, no commit.

```bash
git status
# if any uncommitted change:
#   git add -A
#   git commit -m "chore: verification-time tweaks"
```

---

## Self-Review

**1. Spec coverage:**
- Modal: name + email only ✓ (Task 1)
- Modal headline + lede ✓ (Task 1, exact strings pinned)
- Drop 4-bullet list + long lede + modal-stack line ✓ (Task 1)
- Email accepts any string with `@` ✓ (Task 1 `cleanEmail.includes("@")` and Task 3 same)
- 409 handling kept ✓ (Task 3)
- 50% scroll-popup unchanged ✓ (no edit to App.jsx)
- Submit disabled until both fields populated ✓ (Task 1)
- Drop twitter + youtube from modal footer ✓ (Task 1)
- Drop twitter + youtube from page footer ✓ (Task 5)
- Supabase: `subscribe(name, email, source)` ✓ (Task 3)
- `app/.env.example` created ✓ (Task 4)
- Closing gap above `Experience` (and other merge-dark consumers) ✓ (Task 6)
- Untouched: all other sections ✓ (no edits to Hero, Terminal, Certificate, Problem, Cure, Loop, Workspace, Tracks, Companies, Stats, FAQ, Final, Nav, App.jsx, index.css beyond the two scoped additions)
- Build with `0 errors` ✓ (every task ends with a build step)
- Host locally ✓ (Task 7)

**2. Placeholder scan:** no TBD/TODO/fill-in. Every step has either exact code, exact shell, or a specific file edit. ✓

**3. Type consistency:**
- `subscribe(name, email, source)` defined in Task 3, called as `subscribe(cleanName, cleanEmail, source)` in Task 1's `handleSubmit`. ✓
- `setName` / `setEmail` defined in Task 1, used consistently. ✓
- `.modal-input-row--split` and `.modal-field` defined in Task 2, applied in Task 1. ✓
- `app/.env.example` referenced in Task 4, mentioned in Task 7. ✓
