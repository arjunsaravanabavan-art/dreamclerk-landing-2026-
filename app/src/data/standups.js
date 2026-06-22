// ─── standups.js — sample daily standup transcripts ──────────────────────
//
// A standup has 3 speakers (manager, tech lead, peer), each with their
// archetype's voice. The StandupModal shows 1 random standup per sprint,
// and asks the user to fill in "what did you ship yesterday / today / blockers"
// in the bullet-point manager's voice.

export const STANDUP_TRANSCRIPTS = [
  {
    sprint: 1,
    title: "monday standup · sprint 01",
    attendees: [
      { name: "Priya Raman",  role: "EM",                voice: "bullet-point", text: "1. welcome to the team. 2. sprint 1 starts today. 3. read ENG-4419 first." },
      { name: "Marcus Lee",   role: "tech lead",         voice: "code-first",   text: "users.handler.ts is your reference. read line 42." },
      { name: "Owen Patel",   role: "senior backend",    voice: "supportive",   text: "if you get stuck on the cursor logic, ping me. happy to pair for 15 min." },
    ],
    userPrompt: {
      yesterday: "i read the predecessor ticket. i understand the cursor shape but i haven't written code yet.",
      today: "implement the /teams cursor, write the empty-result test, push a draft PR.",
      blockers: "none yet.",
    },
  },
  {
    sprint: 2,
    title: "wednesday standup · sprint 02",
    attendees: [
      { name: "Priya Raman",  role: "EM",                voice: "bullet-point", text: "1. status? 2. PR up? 3. soft-delete migration applied locally?" },
      { name: "Sana Qureshi", role: "PM",                voice: "clarifying-questions", text: "did you decide on the response code for delete? document the rationale in the PR." },
    ],
    userPrompt: {
      yesterday: "shipped soft-delete migration, GET /projects filters by deleted_at, working on DELETE handler.",
      today: "finish DELETE handler, write tests for include_deleted=true, draft PR description.",
      blockers: "stuck on whether the audit view should paginate. leana says no, the db is small.",
    },
  },
  {
    sprint: 3,
    title: "friday standup · sprint 03",
    attendees: [
      { name: "Priya Raman",  role: "EM",                voice: "bullet-point", text: "1. billing endpoint status? 2. DoD written? 3. Lina blocked on anything?" },
      { name: "Marcus Lee",   role: "tech lead",         voice: "code-first",   text: "if the DoD is thin, the endpoint is thin." },
      { name: "Lina Chen",    role: "customer success",  voice: "supportive",   text: "if you can ship the monthly version this sprint, i'm fine. quarterly can wait." },
    ],
    userPrompt: {
      yesterday: "drafted the DoD. shipped the auth middleware path. reviewed 2 of Lina's tickets.",
      today: "wrap the response shape, finalize the DoD, push the PR before 4pm.",
      blockers: "need to confirm with leana whether the overage badge should include the tier or just the percentage.",
    },
  },
];