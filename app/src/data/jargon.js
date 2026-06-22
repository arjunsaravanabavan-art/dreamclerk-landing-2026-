// ─── jargon.js — Just-in-Time Knowledge Layer (System A) ───────────────────
//
// Per the Knowledge Layer .md: jargon terms in the workspace are highlighted
// on first render. Hovering (or tapping on mobile) shows a short, in-context
// definition. No separate "Learn" tab exists — knowledge is ambient.
//
// Terms are scoped to the Nexara backend intern role. The structure is
// designed so a future track can import its own jargon dictionary without
// touching the Jargon component (term + definition + example + category).
//
// `trigger` controls how the Jargon component renders:
//   - "always" — highlight the term everywhere it appears
//   - "first"  — highlight only on first render of the page (default)
//   - "off"    — never highlight (for advanced users)

export const NEXARA_JARGON = [
  {
    term: "cursor",
    category: "API",
    trigger: "always",
    short: "An opaque string the client passes back to get the next page.",
    detail: "In our pagination scheme, the cursor is the id of the last row from the previous page. The server returns it; the client doesn't try to parse it. Empty string means 'no more pages' — never null.",
    example: "GET /users?cursor=8f4a → returns rows after 8f4a + a new cursor.",
  },
  {
    term: "soft-delete",
    category: "DB",
    trigger: "always",
    short: "Mark a row as deleted without removing it.",
    detail: "We set a `deleted_at` timestamp instead of DELETE FROM. The row stays in the table so audits, restores, and analytics keep working. The default query always filters `WHERE deleted_at IS NULL`.",
    example: "DELETE /projects/42 → UPDATE projects SET deleted_at = now() WHERE id = 42;",
  },
  {
    term: "JWT",
    category: "Auth",
    trigger: "always",
    short: "JSON Web Token. A signed token the client sends to prove identity.",
    detail: "Every API request (except /health and /ready) verifies a session JWT in middleware. The token has the user_id, role, and expiry. Never trust client claims — verify the signature.",
    example: "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  },
  {
    term: "middleware",
    category: "Backend",
    trigger: "first",
    short: "Code that runs before the handler. Auth, logging, rate limits.",
    detail: "Fastify middleware sits between the request and the route handler. Our auth middleware rejects unauthenticated requests before they reach the handler. Don't write your own auth — use the middleware.",
    example: "src/middleware/auth.ts — verifies the JWT and attaches req.user.",
  },
  {
    term: "migration",
    category: "DB",
    trigger: "first",
    short: "A versioned SQL change. Forward and reverse, both committed.",
    detail: "Migrations are append-only. We never edit a committed migration. Reversibility is required: every forward migration has a corresponding down. Migrations run in order on deploy.",
    example: "migrations/20260621_add_deleted_at_to_projects.sql",
  },
  {
    term: "session",
    category: "Auth",
    trigger: "first",
    short: "A logged-in user's identity for the duration of a request.",
    detail: "A session is created at login, stored server-side, and identified by a session cookie. The JWT is signed proof that the user holds that session. Sessions can be revoked (e.g. on logout).",
    example: "req.user = { id: 'usr_8f4a', role: 'admin', sessionId: 'sess_2c1b' }",
  },
  {
    term: "rate limit",
    category: "Backend",
    trigger: "first",
    short: "Max requests per minute per user/IP. 429 if exceeded.",
    detail: "Public endpoints have rate limits. The default is 60 req/min per IP. The middleware reads X-Forwarded-For (we're behind Cloudflare) and bumps a Redis counter. Return 429 with Retry-After.",
    example: "X-RateLimit-Limit: 60, X-RateLimit-Remaining: 12",
  },
  {
    term: "endpoint",
    category: "API",
    trigger: "off",
    short: "A URL + HTTP method. The unit we deploy and document.",
    detail: "Each endpoint is a method on a Fastify router. We document endpoints in the auto-generated OpenAPI spec — the doc IS the contract. Don't ship an endpoint without a doc entry.",
    example: "POST /projects → 201 { project: {...} }",
  },
  {
    term: "handler",
    category: "Backend",
    trigger: "off",
    short: "The function that runs when a route is hit.",
    detail: "Handlers are async functions exported from *.handler.ts files. They take (req, reply) and return a JSON payload. They do the input validation, the work, and the response — nothing else.",
    example: "export async function listUsers(req, reply) { ... }",
  },
  {
    term: "DoD",
    category: "Process",
    trigger: "always",
    short: "Definition of Done. What 'finished' means for this piece of work.",
    detail: "A DoD is a checklist: tests, contract decisions, edge cases, docs. Sprint 1 DoDs are usually given to you. By Sprint 3, you write your own. If you can't write a DoD, you don't understand the work yet.",
    example: "DoD: 'Pagination follows §4.1. Empty cursor is empty string, not null. Tests cover empty, single, and multi-page.'",
  },
  {
    term: "contract",
    category: "API",
    trigger: "first",
    short: "The shape of what an endpoint takes and returns.",
    detail: "The contract is what the client can rely on. Changing a contract is breaking. Adding a field is usually safe. Removing or renaming a field requires a deprecation cycle and a major version.",
    example: "Adding an optional `include_deleted` query param is non-breaking. Removing `cursor` is breaking.",
  },
  {
    term: "stakeholder",
    category: "Process",
    trigger: "off",
    short: "Anyone whose work depends on yours, or vice versa.",
    detail: "Customers, PMs, designers, other engineers, support, sales. The best engineers learn to talk to stakeholders early — clarifying questions before coding are not a sign of weakness, they're how scope gets right.",
    example: "Lina is the stakeholder for the billing endpoint. Ask her what fraction of customers need quarterly before adding it.",
  },
];

// Build a quick lookup: text → entry. The Jargon component walks the source
// text and replaces matches with <span class="dc-jargon" data-term="...">.
// Doing it at render time is fine — the dictionary is small and stable.
export const JARGON_BY_TERM = Object.fromEntries(
  NEXARA_JARGON.map((j) => [j.term.toLowerCase(), j])
);