// ─── reviewer — LLM primary, deterministic fallback ──────────────────────
//
// Single entrypoint for /beta submission review. Decides at call time
// whether to talk to the Supabase Edge Function (which calls Claude) or
// fall back to the in-browser deterministic reviewer in `evaluator.js`.
//
// Decision matrix:
//   1. VITE_USE_LLM_REVIEW === "false"           → fallback (deterministic)
//   2. supabase is not configured                 → fallback
//   3. network/5xx/429/timeout from edge function → fallback
//   4. any other non-2xx response                 → fallback
//   5. successful 2xx                             → return parsed JSON
//
// Logging: every call logs `[reviewer] { path, latencyMs, ... }` to
// console.info so the smoke test + dev console can verify which path ran.

import { evaluate } from "./evaluator.js";
import { supabase, isConfigured } from "./supabase.js";

const USE_LLM = String(import.meta.env.VITE_USE_LLM_REVIEW ?? "true").toLowerCase() !== "false";

// Edge Function URL. The supabase client exposes `supabase.functions` but
// in v0.2 the helper is async and adds a wrapper. Plain fetch is simpler
// and gives us direct control over the abort signal.
function functionsBase() {
  const url = import.meta.env.VITE_SUPABASE_URL;
  if (!url) return null;
  return `${url.replace(/\/$/, "")}/functions/v1`;
}

function logReviewer(info) {
  // Keep the format stable so the smoke test can grep for it.
  // eslint-disable-next-line no-console
  console.info("[reviewer]", JSON.stringify(info));
}

function normalizeLanguage(lang) {
  if (lang === "js" || lang === "javascript") return "js";
  return "python";
}

function fallbackResult(task, submission, reason) {
  const ev = evaluate(task, submission || "");
  logReviewer({ path: "fallback", reason, taskId: task?.id });
  return ev;
}

/**
 * Review a single submission.
 *
 * @param {object} task  - { id, type, title, brief, acceptance[], hints[] }
 * @param {string} submission - raw text the user pasted into the workspace
 * @param {object} [opts]
 * @param {string} [opts.email] - for quota tracking in the edge function
 * @param {AbortSignal} [opts.signal] - caller's cancel signal
 * @returns {Promise<object>} - the review result (verdict, axes, checklist, ...)
 */
export async function reviewSubmission(task, submission, opts = {}) {
  const { email, signal } = opts;
  const language = normalizeLanguage(task?.language);

  // Pre-flight floors: hard-disable or missing infra → immediate fallback.
  if (!USE_LLM) return fallbackResult(task, submission, "VITE_USE_LLM_REVIEW=false");
  if (!isConfigured) return fallbackResult(task, submission, "supabase_not_configured");

  const base = functionsBase();
  if (!base) return fallbackResult(task, submission, "no_supabase_url");

  const url = `${base}/evaluate-submission`;
  const start = performance.now();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort("timeout"), 6000);

  // If the caller passed their own signal, forward its abort.
  if (signal) {
    if (signal.aborted) controller.abort("caller_aborted");
    signal.addEventListener("abort", () => controller.abort("caller_aborted"));
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        // The Edge Function uses ANTHROPIC_API_KEY from server-side secrets.
        // The Authorization header is the anon key — Supabase validates it
        // and (in production) the function checks it. For the open beta the
        // function does not require JWT verification (`--no-verify-jwt`).
        authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY || ""}`,
        apikey: import.meta.env.VITE_SUPABASE_ANON_KEY || "",
      },
      body: JSON.stringify({
        email: email || "anon@local",
        task: {
          id: task?.id,
          type: task?.type,
          title: task?.title,
          brief: task?.brief,
          acceptance: task?.acceptance || [],
          hints: task?.hints || [],
        },
        submission: submission || "",
        language,
      }),
      signal: controller.signal,
    });
    clearTimeout(timer);

    if (res.status === 429) return fallbackResult(task, submission, "quota_exceeded");
    if (res.status === 503) return fallbackResult(task, submission, "engine_unavailable");
    if (!res.ok) return fallbackResult(task, submission, `http_${res.status}`);

    const data = await res.json();
    const latencyMs = Math.round(performance.now() - start);

    // Sanity check the response shape. If the model returned garbage, fall
    // back rather than render broken UI.
    if (!data || !data.verdict || !data.axes) {
      logReviewer({ path: "fallback", reason: "malformed_response", taskId: task?.id, latencyMs });
      return evaluate(task, submission || "");
    }

    logReviewer({ path: "llm", taskId: task?.id, verdict: data.verdict, latencyMs });
    return data;
  } catch (e) {
    clearTimeout(timer);
    const msg = e instanceof Error ? e.message : String(e);
    const isAbort = /abort|timeout/i.test(msg);
    return fallbackResult(task, submission, isAbort ? "client_timeout" : "network_error");
  }
}
