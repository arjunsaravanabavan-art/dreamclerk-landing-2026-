// ─── Supabase client + helpers ──────────────────────────────────────────────
//
// Single client for:
//   - waitlist subscriber count (subscribers table + 2 RPCs)
//   - notify_signups (email + source from the landing page's get-notified form)
//   - posts (blog — public read, admin-only write)
//   - admin auth (email + password via supabase auth)
//
// Env vars (set in .env — Vite exposes them via import.meta.env):
//   VITE_SUPABASE_URL          — e.g. https://xxxx.supabase.co
//   VITE_SUPABASE_ANON_KEY     — public, RLS protects writes
//   VITE_ADMIN_EMAIL           — pre-shared admin email, used to gate the admin route
//
// If env is missing, helpers degrade gracefully (console.warn + mock returns)
// so the site still renders in dev.
//
// Schema lives in /supabase/schema.sql — run it once in the Supabase SQL editor.

import { createClient } from "@supabase/supabase-js";

const URL = import.meta.env.VITE_SUPABASE_URL;
const KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || "admin@dreamclerk.in";

export const isConfigured = Boolean(URL && KEY);

export const supabase = isConfigured
  ? createClient(URL, KEY, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false },
    })
  : null;

// ─── waitlist counter (existing — kept for landing-page stat) ───────────────

const SEED_COUNT = 1847;
const CACHE_KEY = "dc_count_cached";
const COUNT_CACHE_KEY = "dc_counted";
const COUNT_TTL_MS = 24 * 60 * 60 * 1000;

function readLocalCount() {
  if (typeof window === "undefined") return SEED_COUNT;
  return parseInt(localStorage.getItem("subscriberCount") || String(SEED_COUNT), 10);
}

function writeLocalCount(n) {
  if (typeof window === "undefined") return;
  localStorage.setItem("subscriberCount", String(n));
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ count: n, at: Date.now() }));
  } catch {}
}

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

export async function getSubscriberCount() {
  // 30s cache
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (raw) {
        const { count, at } = JSON.parse(raw);
        if (Date.now() - at < 30 * 1000) return count;
      }
    } catch {}
  }
  if (!isConfigured || !supabase) return readLocalCount();
  try {
    const { data, error } = await supabase.rpc("get_waitlist_count");
    if (error) throw error;
    const count = typeof data === "number" ? data : parseInt(data, 10) || readLocalCount();
    writeLocalCount(count);
    return count;
  } catch (err) {
    console.warn("[supabase] getSubscriberCount fallback:", err?.message || err);
    return readLocalCount();
  }
}

export async function bumpSubscriberCount() {
  if (!isConfigured || !supabase || alreadyCountedToday()) {
    const next = readLocalCount() + 1;
    writeLocalCount(next);
    return { count: next, source: "local" };
  }
  try {
    const { data, error } = await supabase.rpc("bump_waitlist_count");
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

// ─── notify_signups (new — get-notified form on landing) ────────────────────
//
// Lightweight table — just email + source + a soft tag for which section
// the user came in from. Lets us know whether the cv-90s form, the hero
// cta, the closing-terminal, or the press-mention band converted best.

export async function subscribeNotify({ email, name, source = "modal" }) {
  const cleanEmail = (email || "").trim();
  const cleanName = (name || "").trim();
  if (!cleanEmail || !cleanEmail.includes("@")) {
    return { ok: false, error: "Please enter a valid email." };
  }
  if (!isConfigured || !supabase) {
    console.warn("[dreamclerk] supabase not configured — notify signup dropped locally");
    return { ok: true, mock: true };
  }
  try {
    const { error } = await supabase
      .from("notify_signups")
      .insert({ email: cleanEmail, name: cleanName || null, source });
    if (!error) return { ok: true };
    if (error.code === "23505") {
      return { ok: false, error: "You're already on the list." };
    }
    return { ok: false, error: error.message };
  } catch (err) {
    return { ok: false, error: err?.message || "Network error." };
  }
}

// ─── posts (blog) ───────────────────────────────────────────────────────────
//
// Public read (RLS: select where published = true).
// Authed read of all (RLS: select where auth.role() = 'authenticated').
// Authed write (RLS: insert/update/delete where auth.role() = 'authenticated'
//   AND auth.jwt() ->> 'email' matches VITE_ADMIN_EMAIL — the policy checks
//   the email claim from the JWT).

export async function listPublishedPosts() {
  if (!isConfigured || !supabase) return seedPosts;
  try {
    const { data, error } = await supabase
      .from("posts")
      .select("id, slug, title, excerpt, cover_image, tags, published_at, author_name, reading_time, created_at")
      .eq("published", true)
      .order("published_at", { ascending: false })
      .limit(50);
    if (error) throw error;
    if (!data || data.length === 0) return seedPosts;
    return data;
  } catch (err) {
    console.warn("[supabase] listPublishedPosts:", err?.message || err);
    return seedPosts;
  }
}

export async function getPostById(id) {
  if (!isConfigured || !supabase) return null;
  try {
    const { data, error } = await supabase
      .from("posts")
      .select("id, slug, title, excerpt, body, cover_image, tags, published, published_at, author_name, reading_time, created_at, updated_at")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    return data || null;
  } catch (err) {
    console.warn("[supabase] getPostById:", err?.message || err);
    return null;
  }
}

export async function getPostBySlug(slug) {
  if (!isConfigured || !supabase) return seedPosts.find((p) => p.slug === slug) || null;
  try {
    const { data, error } = await supabase
      .from("posts")
      .select("id, slug, title, excerpt, body, cover_image, tags, published, published_at, author_name, reading_time, created_at, updated_at")
      .eq("slug", slug)
      .maybeSingle();
    if (error) throw error;
    if (data) return data;
    // Fallback to local seed so the slug works in any environment.
    return seedPosts.find((p) => p.slug === slug) || null;
  } catch (err) {
    console.warn("[supabase] getPostBySlug:", err?.message || err);
    return seedPosts.find((p) => p.slug === slug) || null;
  }
}

// ─── seed posts (in-app, ships even when supabase is not configured) ──────
//
// These are the launch posts. They are also seeded into the `posts` table
// by `supabase/seed-posts.sql` so the admin editor can pick them up.
// If the admin publishes a new post, the live list will combine the
// admin-published post with these seed posts (the admin posts come first
// because they are ordered by `published_at` desc).

import { SEED_POSTS } from "./seedPosts.js";
const seedPosts = SEED_POSTS;

export async function listAllPostsAdmin() {
  if (!isConfigured || !supabase) return [];
  try {
    const { data, error } = await supabase
      .from("posts")
      .select("id, slug, title, excerpt, published, published_at, updated_at, author_name")
      .order("updated_at", { ascending: false });
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.warn("[supabase] listAllPostsAdmin:", err?.message || err);
    return [];
  }
}

export async function upsertPost(post) {
  if (!isConfigured || !supabase) return { ok: false, error: "Supabase not configured." };
  try {
    const payload = {
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt || null,
      body: post.body || "",
      cover_image: post.cover_image || null,
      tags: post.tags || [],
      published: !!post.published,
      published_at: post.published ? (post.published_at || new Date().toISOString()) : null,
      author_name: post.author_name || "DreamClerk",
      reading_time: post.reading_time || Math.max(1, Math.round((post.body || "").split(/\s+/).length / 220)),
    };
    let res;
    if (post.id) {
      res = await supabase.from("posts").update(payload).eq("id", post.id).select("id, slug").single();
    } else {
      res = await supabase.from("posts").insert(payload).select("id, slug").single();
    }
    if (res.error) return { ok: false, error: res.error.message };
    return { ok: true, id: res.data.id, slug: res.data.slug };
  } catch (err) {
    return { ok: false, error: err?.message || "Network error." };
  }
}

export async function deletePost(id) {
  if (!isConfigured || !supabase) return { ok: false, error: "Supabase not configured." };
  try {
    const { error } = await supabase.from("posts").delete().eq("id", id);
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err?.message || "Network error." };
  }
}

// ─── admin auth ─────────────────────────────────────────────────────────────

export async function signInAdmin(email, password) {
  if (!isConfigured || !supabase) {
    return { ok: false, error: "Supabase not configured. Add VITE_SUPABASE_* to .env." };
  }
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { ok: false, error: error.message };
    return { ok: true, user: data.user };
  } catch (err) {
    return { ok: false, error: err?.message || "Network error." };
  }
}

export async function signOutAdmin() {
  if (!isConfigured || !supabase) return;
  try {
    await supabase.auth.signOut();
  } catch {}
}

export async function getSession() {
  if (!isConfigured || !supabase) return null;
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) return null;
    return data.session || null;
  } catch {
    return null;
  }
}

export function onAuthChange(cb) {
  if (!isConfigured || !supabase) return () => {};
  const { data } = supabase.auth.onAuthStateChange((_event, session) => cb(session));
  return () => { try { data?.subscription?.unsubscribe(); } catch {} };
}
