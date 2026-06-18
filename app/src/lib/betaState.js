// ─── beta state (local-only, no backend) ───────────────────────────────────
//
// Per BETA.md §13.1, the build must run locally before production. This file
// is the entire data layer for the beta: localStorage-backed session state
// (keyed by email, since the beta is open — no token), a sprint clock that
// respects the user's timezone (D4), and the deterministic review pipeline.
//
// v0.2 swap: hydrate from Supabase on mount, debounced upsert on every
// setSession. The local shape stays the same — every UI component reads
// from the hook below and never touches localStorage directly.
//
// Per D5 (free re-runs), the session's `run` field is bumped when the user
// re-runs the sprint. Re-runs reset the sprint clock and task states. The
// email is stable across re-runs — one email = one active user.

import { useEffect, useState, useCallback, useRef } from "react";
import { BETA } from "./betaData.js";
import { evaluate } from "./evaluator.js";
import { isConfigured as supabaseConfigured, fetchBetaSessionByEmail, debouncedUpsertBetaSession } from "./supabase.js";

// Issue a public cert id of the form `dc-2026-q3-8f4a-9c2b`. Two short
// random hex chunks are enough for a v0.1 beta: collision is unlikely
// across the cohort (tens to low-hundreds of users) and the URL is the
// only thing standing between a stranger and a record. A v1 swap can
// switch this to a true UUID without changing callers.
function randChunk(len) {
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    const a = new Uint8Array(len);
    crypto.getRandomValues(a);
    return Array.from(a, (b) => b.toString(16).padStart(2, "0")).join("").slice(0, len);
  }
  return Math.random().toString(16).slice(2, 2 + len);
}
function issueCertId() {
  return `dc-2026-q3-${randChunk(4)}-${randChunk(4)}`;
}

// ─── localStorage layer ─────────────────────────────────────────────────────
const NS = "dc-beta-v1";
const k = (key) => `${NS}::${key}`;

export function loadSessionByEmail(email) {
  if (typeof window === "undefined" || !email) return null;
  try {
    const raw = window.localStorage.getItem(k(`session::${email}`));
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveSessionByEmail(email, session) {
  if (typeof window === "undefined" || !email) return;
  try {
    window.localStorage.setItem(k(`session::${email}`), JSON.stringify(session));
  } catch {
    // localStorage full / disabled — fail silently. v0.2 will surface this.
  }
}

export function listAllSessions() {
  if (typeof window === "undefined") return [];
  const sessions = [];
  for (let i = 0; i < window.localStorage.length; i++) {
    const key = window.localStorage.key(i);
    if (key && key.startsWith(k("session::"))) {
      try {
        const s = JSON.parse(window.localStorage.getItem(key));
        if (s) sessions.push(s);
      } catch {
        // ignore unparseable
      }
    }
  }
  return sessions;
}

// ─── session shape ──────────────────────────────────────────────────────────
// {
//   email: string,                       // the session id (top-level so verify can find it)
//   run: number,                         // re-run counter (D5)
//   user: { email, name, college, year, branch, timezone, skills: {python, numpyPandas, sklearn, pytorch}, why },
//   onboardedAt: ISO string,
//   sprintStartedAt: ISO string,         // user-local sprint start
//   currentTaskId: string | null,
//   taskStates: { [taskId]: { status: 'todo'|'in_progress'|'submitted'|'approved'|'rejected', submission: string, rejectionCount: number, submittedAt: ISO, reviewerNote: string, lastReview, reviews[] } },
//   chat: Array<{ speaker, text, at }>,
//   oneOnOne: { completed: boolean, answers: {} },
//   record: { id: string | null, issuedAt: ISO | null, verdict: 'pass'|'fail'|'pending', review: string },
//   survey: { csat: number | null, exitInterviewBooked: boolean },
// }
//
// v0.2 swap: same shape, server-side. The hook below is the only consumer.

export function makeFreshSession(email, userOverrides = {}) {
  return {
    email,
    run: 1,
    user: {
      email: email || "",
      name: "",
      college: "",
      year: "",
      branch: "",
      why: "",
      timezone:
        typeof Intl !== "undefined" && Intl.DateTimeFormat
          ? Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Kolkata"
          : "Asia/Kolkata",
      skills: { python: 5, numpyPandas: 5, sklearn: 5, pytorch: 5 },
      ...userOverrides,
    },
    onboardedAt: null,
    sprintStartedAt: null,
    currentTaskId: null,
    taskStates: BETA.tasks.reduce((acc, t) => {
      acc[t.id] = { status: "todo", submission: "", rejectionCount: 0, submittedAt: null, reviewerNote: "", lastReview: null, reviews: [] };
      return acc;
    }, {}),
    chat: [],
    oneOnOne: { completed: false, answers: {} },
    record: { id: null, issuedAt: null, verdict: "pending", review: "" },
    survey: { csat: null, exitInterviewBooked: false },
  };
}

// ─── timezone-aware sprint clock ────────────────────────────────────────────
//
// Per D4: Anjali sends 9 AM + 6 PM in the *user's* local timezone, not IST.
// Sprint ends at 11:59 PM on Day 5 in the user's local timezone.

export function dayIndexOf(session, now = new Date()) {
  if (!session.sprintStartedAt) return 0;
  const start = new Date(session.sprintStartedAt);
  const diffMs = now - start;
  const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000)) + 1;
  return Math.max(1, Math.min(5, diffDays));
}

export function msUntilSprintEnd(session, now = new Date()) {
  if (!session.sprintStartedAt) return null;
  const start = new Date(session.sprintStartedAt);
  const end = new Date(start);
  end.setDate(end.getDate() + 5);
  end.setHours(23, 59, 59, 999);
  return Math.max(0, end - now);
}

// Format a ms duration as "D days H:M:S"
export function formatRemaining(ms) {
  if (ms == null) return "—";
  const s = Math.floor(ms / 1000);
  const days = Math.floor(s / 86400);
  const hours = Math.floor((s % 86400) / 3600);
  const mins = Math.floor((s % 3600) / 60);
  const secs = s % 60;
  if (days > 0) return `${days}d ${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
  return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

// Format a clock time in the user's timezone.
export function localTimeIn(tz, now = new Date()) {
  try {
    return new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: tz, hour12: false }).format(now);
  } catch {
    return "—";
  }
}

// ─── scripted review ────────────────────────────────────────────────────────
//
// For each task, the deterministic review engine inspects the submission text
// and emits 1 of {APPROVE, REVISE, REJECT} with 4 axis scores + per-task
// checklist + signals. The engine is a regex+counts pipeline in
// `evaluator.js` — there is no LLM in the loop. The `note` we return here
// is the persona-voiced line that the chat bubble shows; the structured
// `review` payload is what the "what the reviewer ran" UI panel renders.
//
// Map: APPROVE -> "approve", REVISE/REJECT -> "reject" (the user can
// resubmit). REVISE is treated as "rejected" in the two-state UI machine.

export function scriptedReview(taskId, submission) {
  const task = BETA.tasks.find((t) => t.id === taskId) || { type: "", title: "this task" };
  const ev = evaluate(task, submission || "");
  const personaKey = ev.verdict === "APPROVE" ? `${taskId}-approve` : `${taskId}-reject`;
  const personaLine = BETA.scriptedMessages?.[personaKey]?.() || ev.chatLine;
  const verdict = ev.verdict === "APPROVE" ? "approve" : "reject";
  return {
    verdict,
    note: personaLine,
    review: {
      verdict: ev.verdict,
      summary: ev.summary,
      chatLine: ev.chatLine,
      axes: ev.axes,
      checklist: ev.checklist,
      language: ev.language,
      signals: ev.signals,
    },
  };
}

// Final verdict for the sprint, computed from task states.
export function computeFinalVerdict(session) {
  const states = Object.values(session.taskStates);
  const allApproved = states.every((s) => s.status === "approved");
  if (allApproved) return "pass";
  const allSubmitted = states.every((s) => s.status === "approved" || s.status === "rejected");
  if (allSubmitted) return "fail";
  const anySubmitted = states.some((s) => s.status === "approved" || s.status === "rejected");
  return anySubmitted ? "incomplete" : "pending";
}

// ─── React hook: useBetaSession ────────────────────────────────────────────
// Single source of session state for all beta pages.
//
// v0.2 will hydrate from Supabase before falling back to localStorage. For
// now, localStorage is the only backing store. The hook takes no args; the
// email is read from the session payload itself, which starts empty.

// On the first mount, pick up the most-recent session from localStorage
// (across all email keys). Without this, navigating from `/beta` → `/tracks`
// → `/beta` would re-mount `useBetaSession` with no localStorage read, and
// the user would see the email gate again. The most-recent pick is the
// same heuristic the VerifyPage uses.
function findMostRecentLocalSession() {
  if (typeof window === "undefined") return null;
  let best = null;
  let bestAt = 0;
  for (let i = 0; i < window.localStorage.length; i++) {
    const key = window.localStorage.key(i);
    if (!key || !key.startsWith(k("session::"))) continue;
    try {
      const raw = window.localStorage.getItem(key);
      const s = JSON.parse(raw);
      if (!s || !s.email) continue;
      const at = new Date(s.sprintStartedAt || s.onboardedAt || 0).getTime();
      if (at >= bestAt) {
        bestAt = at;
        best = s;
      }
    } catch {
      // skip unparseable
    }
  }
  return best;
}

export function useBetaSession() {
  // Lazy init: pick up the most-recent local session. The first time the
  // hook is called (no email captured yet), there's nothing to load, so the
  // session is a fresh empty one. Once the user enters an email, we save
  // and reload under that key.
  const [session, setSession] = useState(() => findMostRecentLocalSession() || makeFreshSession(""));

  // Email key changes when the user enters their email for the first time.
  // When that happens, we want to load any prior session for that email —
  // and, if supabase is configured, hydrate from the server copy in case
  // the user is on a different device than where they started.
  const email = session.email || "";
  const firstSaveRef = useRef(true);
  const hydratedForEmailRef = useRef("");

  // Hydrate: when the email becomes known, ask supabase for the latest
  // server copy. If the server is newer than what we have locally, swap
  // it in. This is what makes the verify page work cross-device.
  useEffect(() => {
    if (!email || !supabaseConfigured) return;
    if (hydratedForEmailRef.current === email) return;
    hydratedForEmailRef.current = email;
    let cancelled = false;
    (async () => {
      const remote = await fetchBetaSessionByEmail(email);
      if (cancelled || !remote || !remote.payload) return;
      setSession((local) => {
        const remoteUpdated = new Date(remote.updatedAt || 0).getTime();
        const localUpdated = new Date(local.sprintStartedAt || local.onboardedAt || 0).getTime();
        // Server copy wins if it's newer OR if we have nothing local.
        if (!local.email || remoteUpdated > localUpdated) {
          return { ...makeFreshSession(""), ...remote.payload, email };
        }
        return local;
      });
    })();
    return () => { cancelled = true; };
  }, [email]);

  // Persist on every change. Skip the FIRST run: the useState initializer
  // already read from localStorage and we don't want to write back. More
  // importantly, when the router re-mounts the beta page (because the
  // parent is keyed by `path`), the *unmounting* component's last effect
  // run fires BEFORE the new component's first render. Without this skip,
  // the unmounting component overwrites the freshly-loaded state with its
  // own (now stale) snapshot.
  useEffect(() => {
    if (firstSaveRef.current) {
      firstSaveRef.current = false;
      return;
    }
    if (!email) return; // nothing to key on yet
    saveSessionByEmail(email, session);
    // Also debounce-write to supabase so the verify page works cross-device.
    // If supabase is unconfigured this is a no-op.
    debouncedUpsertBetaSession(session);
  }, [email, session]);

  // Patch helper — merges a partial into session.
  const patch = useCallback((partial) => {
    setSession((s) => ({ ...s, ...partial }));
  }, []);

  const patchUser = useCallback((partial) => {
    setSession((s) => ({ ...s, user: { ...s.user, ...partial } }));
  }, []);

  const patchTask = useCallback((taskId, partial) => {
    setSession((s) => ({
      ...s,
      taskStates: { ...s.taskStates, [taskId]: { ...s.taskStates[taskId], ...partial } },
    }));
  }, []);

  const pushChat = useCallback((message) => {
    setSession((s) => ({ ...s, chat: [...s.chat, { ...message, at: new Date().toISOString() }] }));
  }, []);

  const startSprint = useCallback(() => {
    setSession((s) => ({
      ...s,
      sprintStartedAt: new Date().toISOString(),
      currentTaskId: BETA.tasks[0].id,
      onboardedAt: s.onboardedAt || new Date().toISOString(),
      chat: [
        ...s.chat,
        { speaker: "manager", text: BETA.scriptedMessages["day1-morning"](s.user.name || "intern"), at: new Date().toISOString() },
      ],
    }));
  }, []);

  const submitTask = useCallback((taskId, submission) => {
    const review = scriptedReview(taskId, submission);
    setSession((s) => {
      const prev = s.taskStates[taskId];
      const reviews = Array.isArray(prev.reviews) ? prev.reviews.slice() : [];
      reviews.push({
        at: new Date().toISOString(),
        verdict: review.verdict,
        note: review.note,
        review: review.review,
      });
      const next = {
        ...prev,
        submission,
        submittedAt: new Date().toISOString(),
        reviewerNote: review.note,
        lastReview: review.review,
        reviews,
        status: review.verdict === "approve" ? "approved" : "rejected",
        rejectionCount: prev.rejectionCount + (review.verdict === "approve" ? 0 : 1),
      };
      const taskStates = { ...s.taskStates, [taskId]: next };
      const chat = [
        ...s.chat,
        { speaker: "techLead", text: review.note, at: new Date().toISOString() },
      ];
      let currentTaskId = s.currentTaskId;
      if (review.verdict === "approve") {
        const idx = BETA.tasks.findIndex((t) => t.id === taskId);
        const nextTask = BETA.tasks[idx + 1];
        currentTaskId = nextTask ? nextTask.id : null;
      }
      // Update the record verdict + issue a public cert id the first time
      // the user clears the final task. We don't issue on every approval
      // because the cert id should be the record's stable handle.
      let nextRecord = s.record;
      if (review.verdict === "approve") {
        const approvedCount = Object.values({ ...s.taskStates, [taskId]: next })
          .filter((t) => t.status === "approved").length;
        const totalTasks = BETA.tasks.length;
        if (approvedCount >= totalTasks && s.record.verdict !== "pass") {
          nextRecord = {
            ...s.record,
            id: s.record.id || issueCertId(),
            issuedAt: s.record.issuedAt || new Date().toISOString(),
            verdict: "pass",
          };
        }
      } else if (s.record.verdict === "pending") {
        // First rejection on a fresh run — flip to "fail" so the cert id
        // URL resolves to a "verdict: fail" state instead of "pending".
        nextRecord = { ...s.record, verdict: "fail" };
      }
      return { ...s, taskStates, chat, currentTaskId, record: nextRecord };
    });
  }, []);

  const startNewRun = useCallback(() => {
    // Free re-run per D5. Increments run number, resets task states. The
    // email is preserved — one email = one user, multiple runs allowed.
    setSession((s) => {
      const nextRun = (s.run || 1) + 1;
      const fresh = makeFreshSession(s.email);
      return {
        ...fresh,
        run: nextRun,
        user: s.user, // preserve user info across runs
        onboardedAt: s.onboardedAt,
        chat: [
          { speaker: "manager", text: `welcome back ${s.user.name?.split(" ")[0] || "intern"}. fresh sprint, same role. you've got this.`, at: new Date().toISOString() },
        ],
      };
    });
  }, []);

  return { session, patch, patchUser, patchTask, pushChat, startSprint, submitTask, startNewRun };
}
