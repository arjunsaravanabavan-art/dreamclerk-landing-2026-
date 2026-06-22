// tools/meta-agent-server/local.ts
// Local-only stand-in for the supabase edge function. Same role, different
// runtime: this is what the Vite dev server talks to when there's no
// Supabase project deployed.
//
// Differences from the production edge function:
//   - no JWT validation (local-only trust)
//   - no Supabase logging / rate limit (the meta_agent_log table is not
//     provisioned yet — calling it would 500)
//   - reads ANTHROPIC_BASE_URL from the host env (Claude Code uses a
//     non-default base URL on this box; the Anthropic SDK picks it up
//     automatically when the env var is set)
//
// Run:  deno run --node-modules-dir=auto --allow-net --allow-env --allow-read tools/meta-agent-server/local.ts
// Listens on http://127.0.0.1:54321/functions/v1/meta-agent-parse by default.

import Anthropic from "npm:@anthropic-ai/sdk@0.40.0";

const PORT = Number(Deno.env.get("META_AGENT_PORT") ?? "54321");
const MODEL = Deno.env.get("META_AGENT_MODEL") ?? "claude-sonnet-4-6";
const MAX_TOKENS = 600;
const TEMPERATURE = 0.2;
const MAX_INPUT_LENGTH = 500;
const TIMEOUT_MS = 11_000;

const VALID_ACTIONS = [
  "list_posts",
  "list_drafts",
  "list_published",
  "list_scheduled",
  "read_post",
  "publish_post",
  "unpublish_post",
  "schedule_post",
  "delete_post",
  "publish_all_drafts",
  "seo_audit",
  "seo_audit_all",
  "show_diff",
  "show_help",
  "clear_output",
  "clarify",
  "refuse",
] as const;
type ActionName = (typeof VALID_ACTIONS)[number];

// Read the system prompt from the production function's file. Single source
// of truth — the LLM behaves identically local and prod.
const SYSTEM_PROMPT = await Deno.readTextFile(
  new URL("../../supabase/functions/meta-agent-parse/system.md", import.meta.url),
);

const FALLBACK_REPLY = "i lost the wire. try again?";
const TIMEOUT_REPLY = "timed out. try again.";
const SERVER_ERROR_REPLY = "something broke on my end. try again in a minute.";

function jsonResponse(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json",
      "access-control-allow-origin": "*",
    },
  });
}

function parseActionFromText(text: string): { action: ActionName; args: Record<string, unknown> } | null {
  let cleaned = text.trim();
  const fence = cleaned.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/);
  if (fence) cleaned = fence[1].trim();
  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    return null;
  }
  if (
    typeof parsed !== "object" ||
    parsed === null ||
    typeof (parsed as { action?: unknown }).action !== "string"
  ) return null;
  const action = (parsed as { action: string }).action as ActionName;
  if (!VALID_ACTIONS.includes(action)) return null;
  const args =
    typeof (parsed as { args?: unknown }).args === "object" &&
    (parsed as { args?: unknown }).args !== null
      ? (parsed as { args: Record<string, unknown> }).args
      : {};
  return { action, args };
}

Deno.serve({ port: PORT, hostname: "127.0.0.1" }, async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "access-control-allow-origin": "*",
        "access-control-allow-methods": "POST, OPTIONS",
        "access-control-allow-headers": "content-type, authorization",
      },
    });
  }
  if (req.method !== "POST") {
    return new Response("method not allowed", { status: 405 });
  }

  // Local auth bypass: any non-empty Bearer is accepted. We're on the
  // host, no internet exposure. Production hardens this in the supabase
  // edge function with `supabase.auth.getUser(jwt)`.
  const authHeader = req.headers.get("authorization") ?? "";
  if (!authHeader.startsWith("Bearer ")) {
    return jsonResponse({ error: "not signed in." }, 401);
  }

  let body: { prompt?: unknown; input?: unknown };
  try {
    body = await req.json();
  } catch {
    return jsonResponse({ error: "bad input" }, 400);
  }
  // Accept either {prompt} (client's contract) or {input} (prod fn contract).
  const input = (
    typeof body.prompt === "string" ? body.prompt :
    typeof body.input === "string" ? body.input : ""
  ).trim();
  if (!input || input.length > MAX_INPUT_LENGTH) {
    return jsonResponse({ error: "bad input" }, 400);
  }

  const apiKey = Deno.env.get("ANTHROPIC_AUTH_TOKEN") ?? Deno.env.get("ANTHROPIC_API_KEY") ?? "";
  if (!apiKey) {
    console.error("[meta-agent] missing ANTHROPIC_AUTH_TOKEN / ANTHROPIC_API_KEY");
    return jsonResponse({ error: SERVER_ERROR_REPLY }, 500);
  }

  const client = new Anthropic({ apiKey });
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  let parsed: { action: ActionName; args: Record<string, unknown> } | null = null;
  try {
    const resp = await client.messages.create(
      {
        model: MODEL,
        max_tokens: MAX_TOKENS,
        temperature: TEMPERATURE,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: input }],
      },
      { signal: controller.signal },
    );
    clearTimeout(timeout);
    const block = resp.content[0];
    const text = block && block.type === "text" ? block.text : "";
    console.log(`[meta-agent] ← ${input.slice(0, 60)}${input.length > 60 ? "…" : ""}  →  ${text.slice(0, 100)}`);
    parsed = parseActionFromText(text);
  } catch (err) {
    clearTimeout(timeout);
    const e = err as { name?: string; message?: string; status?: number; error?: unknown };
    const isTimeout = e.name === "AbortError";
    console.error(`[meta-agent] ${isTimeout ? "timeout" : "anthropic_error"}: ${e.message ?? err}`);
    if (!isTimeout) {
      console.error(`[meta-agent]   status=${e.status}  err=${JSON.stringify(e.error)?.slice(0, 300)}`);
    }
    if (isTimeout) {
      return jsonResponse(
        { error: TIMEOUT_REPLY, parsed: { action: "clarify", args: { question: TIMEOUT_REPLY } } },
        504,
      );
    }
    return jsonResponse({ error: SERVER_ERROR_REPLY }, 500);
  }

  if (!parsed) {
    return jsonResponse({
      error: FALLBACK_REPLY,
      parsed: { action: "clarify", args: { question: FALLBACK_REPLY } },
    }, 200);
  }

  return jsonResponse({ parsed }, 200);
});

console.log(`[meta-agent] listening on http://127.0.0.1:${PORT}/functions/v1/meta-agent-parse`);
console.log(`[meta-agent] model=${MODEL}  base=${Deno.env.get("ANTHROPIC_BASE_URL") ?? "default"}`);
