// ─── nexaraSprints.js — Sprints 1-3 for Nexara Backend Intern ─────────────
//
// Implements the "scaffolding decay" model from the Fresher Onboarding .md:
//   Sprint 1 = MIRRORED — user copies a near-identical pattern from a
//     predecessor ticket. The structure is visible; the muscle is not.
//   Sprint 2 = SAME-SHAPE — same kind of work (e.g. another endpoint) but
//     no twin to copy. User must extract the pattern themselves.
//   Sprint 3 = REAL AMBIGUITY — a "client paragraph" ticket, deliberately
//     underspecified. User must draft their own Definition of Done before
//     the workspace unlocks. This is the highest-stakes sprint.
//
// Every sprint carries:
//   - brief        (what was asked)
//   - attached[]   (named files)
//   - acceptance[] (graded)
//   - mirror       (optional — only Sprint 1 has it)
//   - userDoD      (optional — only Sprint 3 asks the user to write this)
//   - hints[]      (in-character)
//   - template     (Sprint 1 boilerplate the user is asked to adapt)
//   - stakeholder  (Sprint 3 — Sana files it with realistic PM ambiguity)
//
// "Scope creep" tasks are deliberately sprinkled into Sprint 2 (mid-sprint
// Slack message from a stakeholder who says "while you're at it..."). The
// user has to decide whether to take it on or push back.

export const NEXARA_SPRINTS = [
  {
    n: 1,
    label: "sprint 01",
    title: "Add pagination cursor to /teams endpoint",
    company: "Nexara",
    role: "Backend Engineering Intern",
    persona: "mirrored",
    xp: 50,
    durationMin: 45,
    filedBy: "Sana Qureshi",
    filedAt: "Day 2, 09:14",
    brief: `The /teams endpoint currently returns the full list of teams in one response. As the team count has grown, this is causing slow page loads on the admin dashboard. We need cursor-based pagination, mirroring what we already ship on /users.

**What you should produce:**
- A working cursor-based /teams endpoint
- A test that proves the cursor is an empty string (not null) when the result set is empty
- Clean code that matches our existing API style

**Where to look first:**
- \`/users\` handler — this is your reference implementation. Read it before you write anything.
- API style guide section 4.1 — pagination is locked there.
- The predecessor ticket ENG-4419 in your onboarding pack — same fix, same pattern, different endpoint.`,
    attached: [
      "teams.handler.ts (the file to touch)",
      "teams.test.ts (existing test file — add a new case here)",
      "users.handler.ts (reference — DO NOT modify)",
    ],
    mirror: {
      // The predecessor ENG-4419 already lives in nexaraOnboarding.js. This
      // pointer tells the UI "show the user the predecessor alongside this
      // brief so they can mirror it."
      ref: "ENG-4419",
      hint: "open the predecessor ticket from your onboarding pack before you start. the diff is 1 line. the test is 1 case. this sprint is about reading code, not writing it.",
    },
    acceptance: [
      "Add test case: when result set is empty, cursor is \"\" not null.",
      "Implement cursor-based pagination on /teams using the same shape as /users.",
      "Don't change the API contract for non-empty results.",
      "Add at least one more test case beyond the empty-result one (e.g. multi-page traversal).",
    ],
    template: `// teams.handler.ts — paginated list of teams
export async function listTeams(req, reply) {
  const { cursor, limit = 50 } = req.query;
  const query = cursor
    ? "SELECT * FROM teams WHERE id > $1 ORDER BY id ASC LIMIT $2"
    : "SELECT * FROM teams ORDER BY id ASC LIMIT $1";
  const params = cursor ? [cursor, limit] : [limit];
  const rows = await db.query(query, params);

  // TODO: encode the cursor the same way /users does
  // Hint: read users.handler.ts and copy the pattern.
  return { teams: rows, cursor: null };
}`,
    hints: [
      "Open users.handler.ts first. The encoding pattern is right there. Don't reinvent it.",
      "Your test name should describe the scenario, not the expected outcome. 'returns empty cursor when result set is empty' beats 'empty test'.",
      "Cursor is always a string. Read the style guide section 4.2 if you reach for null.",
    ],
    scopeCreep: null,
    stakeholderMessage: null,
    evaluationNote: "Submissions must mirror the /users pattern. The structure of the diff should be near-identical to ENG-4419, with the endpoint name swapped. We grade on whether the test file got the new case, not whether the user invented a new pagination scheme.",
  },
  {
    n: 2,
    label: "sprint 02",
    title: "Add a soft-delete flag to the /projects endpoint",
    company: "Nexara",
    role: "Backend Engineering Intern",
    persona: "same-shape",
    xp: 100,
    durationMin: 75,
    filedBy: "Sana Qureshi",
    filedAt: "Day 3, 10:02",
    brief: `Customers have been accidentally deleting projects. We need a soft-delete: deleting a project should set \`deleted_at\` to \`now()\` instead of removing the row. The endpoint GET /projects must exclude soft-deleted rows by default, and accept a query param \`include_deleted=true\` for the audit view.

**Acceptance is on the left of the ticket. The ticket body intentionally doesn't tell you:**
- Whether the response should include a \`deleted_at\` field on each row
- What status code DELETE should return (200? 204? 404?)
- Whether the soft-delete is reversible via the API or only via DB access
- Whether the audit view should paginate

These are decisions you'll have to make and document in your PR description. There's no predecessor ticket for this one — extract the pattern from /users and /teams yourself.`,
    attached: [
      "projects.handler.ts (the file to touch)",
      "projects.test.ts (existing test file)",
      "schema/projects.sql (you'll need a migration)",
    ],
    mirror: null,
    acceptance: [
      "Add a soft-delete column to projects. Write the migration.",
      "GET /projects excludes soft-deleted rows by default.",
      "GET /projects?include_deleted=true returns all rows.",
      "DELETE /projects/:id sets deleted_at, doesn't remove the row.",
      "Add tests for: soft-delete, default exclude, include_deleted=true, double-delete.",
      "PR description explains your decisions on the unspecified points above.",
    ],
    template: null,
    hints: [
      "Decide on your API contract BEFORE you write the migration. Changing a column is cheap. Changing a contract is expensive.",
      "For DELETE returning a status code: 204 means 'done, nothing to say'. 200 means 'done, here's the state'. Pick the one that matches your consistency rule.",
      "The PR description is graded. 'I picked this because...' is a complete sentence. Don't skip it.",
    ],
    // Scope creep arrives mid-sprint via Slack. The user has to decide.
    scopeCreep: {
      arrivesAt: "sprint_60pct",
      from: "Sana Qureshi (PM)",
      message: "while you're in there — can you also add a `restored_at` column so we can audit restores too? should be quick.",
      // Three response options the user picks from. Each has consequences.
      options: [
        { id: "yes", label: "yes, I'll do it", outcome: "Expands scope. PR takes longer. Reviewer notes 'scope discipline'." },
        { id: "later", label: "file a follow-up ticket", outcome: "Right answer. Reviewer praises the discipline." },
        { id: "ask", label: "ask Sana why first", outcome: "Acceptable. Reviewer notes 'good clarifying question'." },
      ],
    },
    stakeholderMessage: null,
    evaluationNote: "No mirror. We grade the user's ability to extract the pattern from prior work AND to make and document decisions. A working PR with no PR description is a pass-with-note. A working PR with a clear rationale is a pass-with-merit.",
  },
  {
    n: 3,
    label: "sprint 03",
    title: "Build a billing-usage endpoint for the enterprise dashboard",
    company: "Nexara",
    role: "Backend Engineering Intern",
    persona: "ambiguous",
    xp: 150,
    durationMin: 90,
    filedBy: "Sana Qureshi (PM)",
    filedAt: "Day 5, 11:30",
    brief: `We need an endpoint that powers the new enterprise billing dashboard. The dashboard shows customers their monthly API usage broken down by endpoint and shows whether they're approaching their plan limit.

That's the whole brief. The rest is on you.`,
    attached: [
      "There's a vague Notion link to a 3-bullet product spec.",
      "There's a Loom from the PM walking through 2 screenshots.",
      "There's no API style guide entry for this one.",
    ],
    mirror: null,
    // The graded part — the user drafts their own DoD before code unlocks.
    userDoD: {
      prompt: "Before you write any code, draft your Definition of Done. What does 'done' mean for this endpoint? List the test cases, the contract decisions, and the edge cases you're going to handle.",
      placeholder: `My Definition of Done for this endpoint:

1. The endpoint returns X when Y
2. ...

Edge cases I'm explicitly handling:
- ...

Edge cases I'm explicitly NOT handling (and why):
- ...`,
    },
    acceptance: [
      "Submit your Definition of Done BEFORE you start coding. (It unlocks the editor.)",
      "The endpoint returns usage data for the requested month.",
      "Endpoint must be auth'd — every request verifies a session JWT.",
      "Pagination follows the standard cursor pattern (string, never null).",
      "At least one test for: empty result, single result, multi-page result, overage above plan limit.",
      "PR description includes: the contract decisions you made, the alternatives you rejected, and what's explicitly out of scope.",
    ],
    template: null,
    hints: [
      "The PM brief is intentionally short. That's the test. Real tickets are like this.",
      "Your DoD is the artifact. If you can't write it, you don't understand the work yet.",
      "Out-of-scope is a feature. Saying 'we explicitly don't handle X' is a senior move.",
    ],
    scopeCreep: null,
    // The stakeholder arrives DURING the sprint, not mid-sprint.
    stakeholderMessage: {
      arrivesAt: "sprint_30pct",
      from: "Lina Chen (Customer Success — the actual customer)",
      channel: "slack",
      message: "Quick one — we need this to also support a custom date range, not just monthly. Some of our enterprise customers bill quarterly. Can you add that?",
      options: [
        { id: "yes", label: "yes, custom date range too", outcome: "Scope creep. Sprint goes over. Reviewer flags but does not fail." },
        { id: "later", label: "ship monthly now, file follow-up", outcome: "Right answer. Customer is told what to expect." },
        { id: "ask", label: "ask Lina what fraction of customers need this", outcome: "Senior move. Reviewer praises the data-driven scoping." },
      ],
    },
    evaluationNote: "Highest-stakes sprint. The DoD is graded as a separate artifact. A working endpoint without a DoD is a pass-with-note. A working endpoint WITH a DoD AND an explicit out-of-scope section is the merit threshold. A working endpoint with all of the above AND a clear rationale for rejected alternatives is distinction.",
  },
];

// Sprint 0 lives in nexaraOnboarding.js — the artifact pack. This helper just
// lets the UI gate Sprint 1 on Sprint 0 acknowledgment.
export function isSprint0Acknowledged(session) {
  return Boolean(session?.sprint0AckAt);
}

// Sprint 0 acknowledgement — persisted in session.
export function acknowledgeSprint0(session) {
  return {
    ...session,
    sprint0AckAt: new Date().toISOString(),
  };
}