// ─── nexaraOnboarding.js — Sprint 0 Shadow Week artifact pack ──────────────
//
// Per the Fresher Onboarding .md: Sprint 0 is NOT a course. It's a read-only
// onboarding artifact pack framed as "what a new hire gets on Day 1":
//   - 5-page company wiki (About, How We Work, Tech Stack, Comm Rules, Team)
//   - 1 fully-completed predecessor ticket (the "Fix pagination bug on
//     /users endpoint" example) with the actual diff and review thread
//   - 1-page architecture diagram
//   - Style guide doc
//
// Gated: user must acknowledge the pack before Sprint 1 unlocks.

export const NEXARA_WIKI = [
  {
    page: "01 — About Us",
    title: "About Nexara",
    body: `Nexara is a 22-person SaaS startup building analytics tools for Series B marketplaces. We were founded in 2024, raised a Series A in early 2026, and we ship to ~1,400 paying teams.

**Stage:** Series A. Still scrappy. Still move fast.

**Mission:** Give mid-market operators the analytical power of an internal data team — without the headcount.

**What we believe:**
- Ship > perfect. The cost of a wrong assumption is a 3-day revert. The cost of no ship is a competitor's first mover advantage.
- Async by default. We're distributed across 4 timezones. If it's not written, it didn't happen.
- Internal tools deserve the same care as customer-facing ones. Your sprint board is a product. Your wiki is a product. Your PR templates are a product.`,
  },
  {
    page: "02 — How We Work",
    title: "How We Work",
    body: `**Working hours:** 4 hours of overlap, your local. The rest is async. We do not ping people outside their overlap window unless something is on fire.

**Decision-making:** The person closest to the work makes the call. If you want to override, write a doc — don't argue in Slack.

**Cadence:**
- **Monday:** Sprint planning. 30 min, async-friendly.
- **Tuesday + Thursday:** Optional pairing. Drop into anyone's Zoom, no agenda required.
- **Friday:** Demo. Show what you shipped. 15 min hard cap per person.

**Reviews:** All non-trivial PRs need 1 reviewer. Auth, schema migrations, anything touching billing: 2 reviewers + a comment explaining the rollback plan.`,
  },
  {
    page: "03 — Tech Stack",
    title: "Tech Stack",
    body: `- **Frontend:** React 19, Vite, TanStack Query, our own design system (\"nexara/ui\" — npm package, internal).
- **Backend:** Node 22, Fastify, Postgres 16, Redis 7, BullMQ for jobs.
- **Infra:** Fly.io apps, Cloudflare in front, GitHub Actions, Sentry for errors, Axiom for logs.
- **Data:** dbt + Snowflake. The analytics schema is owned by Sol, not engineering.
- **AI:** Most of the product is LLM calls against Anthropic. We cache aggressively.

We do not use Kubernetes. We will not use Kubernetes. If you think we should use Kubernetes, write a doc.`,
  },
  {
    page: "04 — Communication Rules",
    title: "Communication Rules",
    body: `**Slack is for:** quick questions, blockers, time-sensitive things, and at least one non-work message per day in #random. We're humans, not ticket machines.

**Notion is for:** decisions, specs, postmortems, and anything you want to be able to grep in 6 months.

**GitHub is for:** code, code review, and technical discussion that's tied to a specific change.

**Linear is for:** everything else. If it's a unit of work and you haven't filed a ticket, it doesn't exist.

**Tone:** Direct. Not rude. "I think X is wrong because Y" is fine. "This is dumb" is not. Disagree with the work, never the person.`,
  },
  {
    page: "05 — Meet The Team",
    title: "Meet The Team",
    body: `- **Priya Raman** — Engineering Manager. Bullet-point manager. Will respond to your 4-paragraph message with 3 numbered points. Don't take it personally.
- **Marcus Lee** — Tech Lead. Read-the-code-then-talk type. Reviews are usually 2-3 sentences, occasionally just a ✅.
- **Aria** (that's me, the AI agent on the team) — Frontend Lead. Owns the design system. Ships components.
- **Jess Park** — Senior Backend. Will pair with you on the schema migration.
- **Owen** — Junior Backend. Started 6 months ago. Ask them what they wish they'd known on day one.
- **Sana Qureshi** — Product Manager. Files the tickets. Has a soft spot for engineers who ask clarifying questions before starting.`,
  },
];

// The predecessor ticket — the highest-leverage artifact per the .md.
// It's framed as "this is what a unit of work looks like in this role," not
// "here's a lesson on X." The user sees the actual ticket, the actual diff,
// and the actual review thread.
export const PREDECESSOR_TICKET = {
  id: "ENG-4419",
  title: "Fix pagination bug on /users endpoint",
  filedBy: "Marcus Lee",
  filedAt: "2 weeks ago",
  type: "bugfix",
  brief: `When the user list has exactly 0 results, the endpoint returns 200 with an empty array, but the cursor field is null. Frontend then crashes trying to read cursor.next on a null value.

**Repro:**
1. Filter users by a tag that has no matches.
2. Hit GET /users?tag=nonexistent
3. Observe: \`{ users: [], cursor: null }\` instead of \`{ users: [], cursor: "" }\`

**Expected:** cursor should be an empty string, never null, so the frontend's \`cursor?.next\` check works as expected.`,
  attached: [
    "users.handler.ts (the file to touch)",
    "users.test.ts (existing test file — add a new case here)",
  ],
  acceptance: [
    "Add test case: when result set is empty, cursor is \"\" not null.",
    "Fix the handler to return empty string for cursor when no results.",
    "Don't change the API contract for non-empty results.",
  ],
  diff: `--- a/src/routes/users.handler.ts
+++ b/src/routes/users.handler.ts
@@ -42,7 +42,7 @@ export async function listUsers(req, reply) {
   const rows = await db.query(query);
-  const cursor = rows.length ? encodeCursor(rows[rows.length - 1].id) : null;
+  const cursor = rows.length ? encodeCursor(rows[rows.length - 1].id) : "";
   return { users: rows, cursor };
 }`,
  reviewThread: [
    {
      author: "Marcus Lee",
      time: "2h after submit",
      text: "Clean fix. One nit — the test name could be more specific. \"returns empty cursor for empty result set\" reads better than \"no results test\".",
    },
    {
      author: "Owen",
      time: "1d after submit",
      text: "Why did you pick empty string over null? Genuine question, not a critique — I've been writing null in similar places and want to know if I should switch.",
    },
    {
      author: "Marcus Lee",
      time: "1d after submit",
      text: "@Owen — null is a valid choice but it's a frontend footgun. We standardised on empty string 8 months ago after Priya's postmortem on the contacts endpoint. It's in the API style guide, section 4.2. Worth a read.",
    },
    {
      author: "Marcus Lee",
      time: "1d after submit",
      text: "✅ ship it. Solid first ticket.",
    },
  ],
  outcome: "Merged in 38 minutes. Deployed to staging 12 minutes later. No regressions in the next 48 hours.",
};

// The architecture diagram — a 1-page ASCII/SVG-friendly overview.
export const ARCHITECTURE_DIAGRAM = {
  title: "Nexara — 1-Page Architecture",
  layers: [
    {
      label: "Edge",
      nodes: ["Cloudflare", "WAF + rate limits"],
    },
    {
      label: "App",
      nodes: ["Fly.io app (us-east, eu-west)", "Fastify on Node 22"],
    },
    {
      label: "Data",
      nodes: ["Postgres 16 (primary + read replica)", "Redis 7 (cache + BullMQ jobs)", "S3 (assets)"],
    },
    {
      label: "Async",
      nodes: ["BullMQ workers (3x)", "Event stream → Snowflake", "Daily dbt run → analytics schema"],
    },
    {
      label: "Observability",
      nodes: ["Sentry (errors)", "Axiom (logs)", "Grafana (dashboards)"],
    },
  ],
  notes: "Auth lives in the app. We use Clerk for identity, but every API verifies a session JWT. The frontend never trusts localStorage as a source of truth for auth state.",
};

// The API style guide — referenced in the predecessor review thread.
export const STYLE_GUIDE = {
  title: "Nexara API Style Guide — v0.4 (excerpt)",
  sections: [
    {
      heading: "4.1 Pagination",
      body: "All list endpoints return `{ items: T[], cursor: string }`. The cursor is always a string, even when empty. Never null, never undefined. Empty string means 'no more pages'.",
    },
    {
      heading: "4.2 Nullable fields",
      body: "Avoid null. Use empty string for strings, 0 for numbers, [] for arrays. The only acceptable null is in the database layer; the API never returns null to the client.",
    },
    {
      heading: "4.3 Error format",
      body: "Errors return `{ error: { code: string, message: string, details?: object } }`. HTTP status is meaningful — 4xx for caller errors, 5xx for our problems. Never both.",
    },
    {
      heading: "4.4 Auth",
      body: "Every endpoint verifies a session JWT except /health, /ready, and the public marketing site. Auth middleware is in src/middleware/auth.ts. Don't write your own.",
    },
  ],
};

// Team profiles — used in the wiki AND the Slack ticker (so the names
// are familiar by the time the user sees them in chat).
export const TEAM_PROFILES = [
  { name: "Priya Raman", role: "Engineering Manager", personality: "bullet-point", emoji: "📋" },
  { name: "Marcus Lee", role: "Tech Lead", personality: "code-first", emoji: "💻" },
  { name: "Aria", role: "Frontend Lead (AI)", personality: "ship-first", emoji: "🎨" },
  { name: "Jess Park", role: "Senior Backend", personality: "supportive", emoji: "🛠️" },
  { name: "Owen", role: "Junior Backend", personality: "curious", emoji: "🌱" },
  { name: "Sana Qureshi", role: "Product Manager", personality: "clarifying-questions", emoji: "🎯" },
];
