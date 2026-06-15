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

const URL = import.meta.env.VITE_SUPABASE_URL;
const KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const isConfigured = () => Boolean(URL && KEY);

// local fallback seed — used if supabase is not configured or unreachable.
// also mirrors whatever the last successful bump set, so the modal still
// shows a believable number in dev mode.
const SEED_COUNT = 1847;

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

// Read the public waitlist counter (no increment, no auth).
// Used by Experience.jsx and EmailModal to display the live count.
// Falls back to a localStorage-cached value if Supabase is unreachable,
// and to the seed value on first visit.
export async function getSubscriberCount() {
  // short cache so the section doesn't re-fetch on every render
  const CACHE_KEY = "dc_count_cached";
  const CACHE_TTL = 30 * 1000; // 30s
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (raw) {
        const { count, at } = JSON.parse(raw);
        if (Date.now() - at < CACHE_TTL) return count;
      }
    } catch {}
  }

  if (!isConfigured()) {
    return readLocalCount();
  }

  try {
    const { data, error } = await supabaseRpc("get_waitlist_count");
    if (error) throw error;
    const count = typeof data === "number" ? data : parseInt(data, 10) || readLocalCount();
    cacheCount(count);
    return count;
  } catch (err) {
    console.warn("[supabase] getSubscriberCount fallback:", err?.message || err);
    return readLocalCount();
  }
}

// Increment the public waitlist counter (1 per visitor per day).
// Falls back to a localStorage-only counter when Supabase is unreachable.
export async function bumpSubscriberCount() {
  if (!isConfigured() || alreadyCountedToday()) {
    const next = readLocalCount() + 1;
    writeLocalCount(next);
    return { count: next, source: "local" };
  }
  try {
    const { data, error } = await supabaseRpc("bump_waitlist_count");
    if (error) throw error;
    const count = typeof data === "number" ? data : parseInt(data, 10) || readLocalCount();
    markCounted();
    writeLocalCount(count);
    return { count, source: "supabase" };
  } catch (err) {
    console.warn("[supabase] bumpSubscriberCount fallback:", err?.message || err);
    const next = readLocalCount() + 1;
    writeLocalCount(next);
    return { count: next, source: "local" };
  }
}

// ─── helpers ──────────────────────────────────────────────────────────────

async function supabaseRpc(fn) {
  const res = await fetch(`${URL}/rest/v1/rpc/${fn}`, {
    method: "POST",
    headers: {
      apikey: KEY,
      Authorization: `Bearer ${KEY}`,
      "Content-Type": "application/json",
    },
    body: "{}",
  });
  if (!res.ok) {
    const text = await res.text();
    return { data: null, error: { message: text || `RPC ${fn} failed (${res.status})` } };
  }
  const data = await res.json();
  return { data, error: null };
}

function readLocalCount() {
  if (typeof window === "undefined") return SEED_COUNT;
  return parseInt(localStorage.getItem("subscriberCount") || String(SEED_COUNT), 10);
}

function writeLocalCount(n) {
  if (typeof window === "undefined") return;
  localStorage.setItem("subscriberCount", String(n));
  try {
    localStorage.setItem(
      "dc_count_cached",
      JSON.stringify({ count: n, at: Date.now() })
    );
  } catch {}
}

function cacheCount(count) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(
      "dc_count_cached",
      JSON.stringify({ count, at: Date.now() })
    );
  } catch {}
}

const COUNT_CACHE_KEY = "dc_counted";
const COUNT_TTL_MS = 24 * 60 * 60 * 1000; // 24h

function alreadyCountedToday() {
  if (typeof window === "undefined") return true;
  try {
    const raw = localStorage.getItem(COUNT_CACHE_KEY);
    if (!raw) return false;
    const { at } = JSON.parse(raw);
    return Date.now() - at < COUNT_TTL_MS;
  } catch {
    return false;
  }
}

function markCounted() {
  if (typeof window === "undefined") return;
  localStorage.setItem(COUNT_CACHE_KEY, JSON.stringify({ at: Date.now() }));
}
