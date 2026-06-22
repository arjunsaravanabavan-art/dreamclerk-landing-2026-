// ─── llmManager.js — Anthropic Claude wrapper ──────────────────────────────
//
// This is the single client for the Anthropic Messages API. Every other
// feature (manager chat, agent modal, jargon explainer, reviewer) calls
// through here. The wrapper exists to:
//
//   1. Centralize the model + endpoint + key handling
//   2. Apply a strict system prompt that keeps the agent IN CHARACTER
//   3. Enforce token limits and rate limits
//   4. Track per-session usage for the IWR (Independent Work Ratio) metric
//   5. Fall back to scripted responses when the API is unavailable
//
// Modes (per aiPolicies.js):
//   - "manager"   → PM/EM-style in-character response
//   - "reviewer"  → 4-axis PR review
//   - "jargon"    → short in-context term explanation
//   - "agent"     → one-line in-character chat from one of the 8 agents
//   - "assistant" → in-IDE assist-mode response (boilerplate, name, etc.)
//
// All modes share the same retry/backoff and are safe to call from React.

import { AGENTS } from "../data/agentsData.js";

// ─── config ────────────────────────────────────────────────────────────────
// API key is set at build time via VITE_ANTHROPIC_API_KEY. In dev, the
// wrapper falls back to scripted responses (defined per-mode below) so the
// UI is fully functional without a key.
const API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY || "";
const MODEL = import.meta.env.VITE_ANTHROPIC_MODEL || "claude-sonnet-4-6";
const ENDPOINT = "https://api.anthropic.com/v1/messages";
const API_VERSION = "2023-06-01";
const MAX_TOKENS_DEFAULT = 600;
const TIMEOUT_MS = 12000; // generous but won't hang the UI

// ─── usage tracking (IWR) ─────────────────────────────────────────────────
// assistCount is incremented on every wrapper call. assistCount is the
// raw count; IWR is computed in the workspace as
//     IWR = 1 - (assistCount / totalEdits)
// The IWR is the value graded by the reviewer.
let _sessionUsage = { assistCount: 0, byMode: {} };
const listeners = new Set();

function bumpUsage(mode) {
  _sessionUsage.assistCount += 1;
  _sessionUsage.byMode[mode] = (_sessionUsage.byMode[mode] || 0) + 1;
  listeners.forEach((l) => l());
}
export function getUsage() {
  return { ..._sessionUsage, byMode: { ..._sessionUsage.byMode } };
}
export function resetUsage() {
  _sessionUsage = { assistCount: 0, byMode: {} };
  listeners.forEach((l) => l());
}
export function subscribeUsage(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

// ─── character / system prompts (per mode) ───────────────────────────────
const SYSTEM_PROMPTS = {
  manager: `You are a senior engineering manager at a Series A SaaS startup. You are direct, never rude. You use numbered lists. You give short answers (2-5 numbered points, rarely prose). You never use corporate jargon like "synergy" or "circle back". You never apologize for being direct. You address the developer's specific question; you do not give generic advice.`,
  reviewer: `You are a senior code reviewer. You return a 4-axis assessment as JSON: { correctness, security, performance, style } where each is a number 0-100 and an explanation string. You never invent issues that aren't there. You never flatter. If the code is good, you say it's good and explain what specifically is good.`,
  jargon: `You are a senior backend engineer explaining a single term to a junior engineer. Your explanation is 1-2 sentences, no analogies, no fluff. You give one concrete example from a real codebase. You do not lecture.`,
  agent: `You are one of 8 named AI agents working at a mock company. You are in character: opinionated, brief, never sycophantic, never vague. Your response is one line, ends in a period or a question. You do not break character.`,
  assistant: `You are a code assistant. Your job is to be useful, not to be impressive. You write code that matches the existing style of the project. You don't add comments. You don't add emoji. You don't apologize.`,
};

// ─── fallback responses (when no API key, or on error) ────────────────────
// These are deliberately in-character so the UI is fully functional in dev.
const FALLBACK = {
  manager: [
    "1. on it. 2. PR when ready. 3. ping me on Slack if you're stuck on the cursor logic.",
    "Three things: 1) read the predecessor, 2) write the test first, 3) ship before Friday demo.",
    "Status: 1) cursor fix — in progress, 2) test — pending, 3) PR — pending. Update me on each.",
  ],
  reviewer: {
    correctness: { score: 78, note: "Logic looks right. One edge case unhandled." },
    security: { score: 90, note: "Auth is correct. No obvious injection risk." },
    performance: { score: 72, note: "One query is N+1. See line 47." },
    style: { score: 85, note: "Matches the API style guide. Cursor is correctly empty string." },
  },
  jargon: {
    cursor: "An opaque string the client passes back to get the next page. Always a string — never null.",
    jwt: "A signed token the client sends to prove identity. Verified in middleware before the handler runs.",
    middleware: "Code that runs before the handler. Auth, logging, rate limits. Don't write your own auth — use it.",
  },
  agent: (agentId) => {
    const opener = {
      aria: "Pulled your last 3 PRs. Naming is consistent. Good.",
      kai: "Hypothesis first. What's the smallest experiment that falsifies your assumption?",
      vega: "Every endpoint that touches user data needs an audit log. I'll review your PR before merge.",
      sol: "What decision are you trying to inform? That's where the chart starts.",
      iris: "Where are users actually getting stuck? Send me the recording and I'll cut a prototype.",
      rin: "Carbon estimate for this PR is 4.2g CO₂ per request. Want to drop the cold start?",
      echo: "Onboarding pack is updated. Take a look before your next 1:1.",
      dax: "Headline is the only thing that matters. Send me 5 options and I'll cut to 3.",
    };
    return opener[agentId] || "Read the brief. Ship it. Ping me on Slack.";
  },
  assistant: (mode) => {
    if (mode === "boilerplate") return "export async function listTeams(req, reply) {\n  // TODO: implement\n}";
    if (mode === "name") return "teamListHandler";
    if (mode === "test_stub") return "describe('listTeams', () => {\n  it('returns empty cursor when result set is empty', async () => {});\n});";
    if (mode === "explanation") return "This handler queries the teams table, encodes the last id as a cursor, and returns the page. The cursor is a string, never null.";
    return "// implementation pending";
  },
};

// ─── core: send one request to the Anthropic Messages API ─────────────────
async function sendRequest({ system, messages, maxTokens = MAX_TOKENS_DEFAULT, signal }) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  // If caller provided a signal, forward its abort
  if (signal) signal.addEventListener("abort", () => ctrl.abort());
  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
        "anthropic-version": API_VERSION,
        "anthropic-dangerous-direct-browser-access": "true",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: maxTokens,
        system,
        messages,
      }),
      signal: ctrl.signal,
    });
    if (!res.ok) {
      const errBody = await res.text().catch(() => "");
      throw new Error(`Anthropic API error ${res.status}: ${errBody.slice(0, 200)}`);
    }
    const json = await res.json();
    return json?.content?.[0]?.text || "";
  } finally {
    clearTimeout(t);
  }
}

// ─── mode: manager (chat) ────────────────────────────────────────────────
// conversation: [{ speaker: "user"|"manager", text }]
// Returns: { text, source: "live"|"fallback" }
export async function managerChat({ conversation, sprintN = 1, managerLabel = "Priya" }) {
  bumpUsage("manager");
  if (!API_KEY) {
    const fb = FALLBACK.manager[Math.floor(Math.random() * FALLBACK.manager.length)];
    return { text: fb, source: "fallback" };
  }
  try {
    const system = `${SYSTEM_PROMPTS.manager}\n\nYou are ${managerLabel}. Stay in character. The developer is in sprint ${sprintN}. Keep your response to 2-5 numbered points.`;
    const messages = conversation.map((m) => ({
      role: m.speaker === "user" ? "user" : "assistant",
      content: m.text,
    }));
    const text = await sendRequest({ system, messages, maxTokens: 400 });
    return { text, source: "live" };
  } catch (e) {
    // On any API failure (rate limit, timeout, no key) we fall back silently.
    // The UI shows a small "· live" or "· scripted" badge so the user knows.
    const fb = FALLBACK.manager[Math.floor(Math.random() * FALLBACK.manager.length)];
    return { text: fb, source: "fallback", error: String(e.message || e) };
  }
}

// ─── mode: reviewer (PR review) ──────────────────────────────────────────
// submission: the user's code submission
// brief: the sprint brief
// acceptance: array of strings
// Returns: { axes: { correctness, security, performance, style }, verdict: "APPROVE"|"REVISE"|"REJECT", source }
export async function reviewSubmission({ submission, brief, acceptance }) {
  bumpUsage("reviewer");
  if (!API_KEY) {
    return { ...FALLBACK.reviewer, verdict: "REVISE", source: "fallback" };
  }
  try {
    const system = `${SYSTEM_PROMPTS.reviewer}\n\nReturn ONLY a JSON object. No prose, no markdown fences. The JSON shape is:\n{ "correctness": {"score":0-100,"note":"..."}, "security": {"score":0-100,"note":"..."}, "performance": {"score":0-100,"note":"..."}, "style": {"score":0-100,"note":"..."}, "verdict": "APPROVE" | "REVISE" | "REJECT" }`;
    const userMsg = `BRIEF:\n${brief}\n\nACCEPTANCE:\n${(acceptance || []).map((a, i) => `${i+1}. ${a}`).join("\n")}\n\nSUBMISSION:\n${submission}`;
    const text = await sendRequest({ system, messages: [{ role: "user", content: userMsg }], maxTokens: 800 });
    // Parse — the model is told to return only JSON, but be defensive.
    const json = JSON.parse(text);
    return { ...json, source: "live" };
  } catch (e) {
    return { ...FALLBACK.reviewer, verdict: "REVISE", source: "fallback" };
  }
}

// ─── mode: jargon (in-context term) ──────────────────────────────────────
export async function explainJargon({ term, context = "" }) {
  bumpUsage("jargon");
  if (!API_KEY) {
    return { text: FALLBACK.jargon[term.toLowerCase()] || `${term}: a project-specific concept. Hover for details.`, source: "fallback" };
  }
  try {
    const system = `${SYSTEM_PROMPTS.jargon}\n\nThe term is "${term}". ${
      context ? `Context: ${context.slice(0, 200)}` : ""
    }\n\nReturn 1-2 sentences. No preamble.`;
    const text = await sendRequest({ system, messages: [{ role: "user", content: `Explain: ${term}` }], maxTokens: 200 });
    return { text, source: "live" };
  } catch (e) {
    return { text: FALLBACK.jargon[term.toLowerCase()] || `${term}: see project docs.`, source: "fallback" };
  }
}

// ─── mode: agent (one of the 8 named agents) ─────────────────────────────
export async function agentChat({ agentId, userText }) {
  bumpUsage("agent");
  const agent = AGENTS.find((a) => a.id === agentId) || AGENTS[0];
  if (!API_KEY) {
    return { text: FALLBACK.agent(agentId), source: "fallback" };
  }
  try {
    const system = `${SYSTEM_PROMPTS.agent}\n\nYour name is ${agent.name}. You work at ${agent.company} as a ${agent.role}. Your signature is: "${agent.signature}". A peer quote you've said: "${agent.peerQuote}". Stay in this character.`;
    const text = await sendRequest({
      system,
      messages: [{ role: "user", content: userText }],
      maxTokens: 200,
    });
    return { text, source: "live" };
  } catch (e) {
    return { text: FALLBACK.agent(agentId), source: "fallback" };
  }
}

// ─── mode: assistant (in-IDE assist) ─────────────────────────────────────
// mode: "boilerplate" | "name" | "test_stub" | "explanation" | "logic" | "full_solution"
// context: { currentCode, language, sprintBrief, cursor }
export async function assistant({ mode, context = {}, policy }) {
  bumpUsage("assistant");
  // Enforce company policy FIRST. If the mode is disallowed, refuse and
  // bump IWR (we still count the attempt so reviewers can see the user tried).
  if (policy && policy.assistModes && policy.assistModes[mode]) {
    const m = policy.assistModes[mode];
    if (!m.allowed) {
      return {
        text: `Banned by company policy. ${mode} is not allowed in ${policy.company || "this role"}. Write it yourself.`,
        allowed: false,
        source: "policy",
        counter: m.counter || "high-impact",
      };
    }
  }
  if (!API_KEY) {
    return { text: FALLBACK.assistant(mode), allowed: true, source: "fallback", counter: "low-impact" };
  }
  try {
    const system = `${SYSTEM_PROMPTS.assistant}\n\nThe user is asking for "${mode}" help. The project is a Fastify backend with TypeScript. Stay terse. No comments. No emoji. Match the existing style.`;
    const userMsg = JSON.stringify({
      mode,
      currentCode: (context.currentCode || "").slice(0, 1500),
      language: context.language || "typescript",
      cursor: context.cursor || { ln: 1, col: 1 },
    });
    const text = await sendRequest({ system, messages: [{ role: "user", content: userMsg }], maxTokens: 400 });
    return { text, allowed: true, source: "live", counter: "low-impact" };
  } catch (e) {
    return { text: FALLBACK.assistant(mode), allowed: true, source: "fallback", counter: "low-impact" };
  }
}

// ─── public helper: does the live API work? ──────────────────────────────
export function isLive() {
  return Boolean(API_KEY);
}