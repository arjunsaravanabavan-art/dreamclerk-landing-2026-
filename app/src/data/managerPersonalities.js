// ─── managerPersonalities.js — 4 manager archetypes ────────────────────────
//
// Per the Work Culture .md: managers have distinct, predictable personalities
// that shape how they respond, how quickly, and what they push back on. The
// persona isn't a flavor — it changes the actual interaction shape:
//
//   - "bullet-point"      → short numbered lists, almost never prose
//   - "code-first"        → reads the diff before responding, often ✅
//   - "supportive"        → long, warm, asks how you're doing
//   - "clarifying-questions" → won't answer a question you didn't ask
//
// The ManagerChat component picks an archetype from this file based on the
// track's assigned manager. Each archetype has:
//   - responseShape    (how the messages are structured)
//   - typicalLatencyMin (async reply time — Sprint 1 = 30-60, Sprint 3 = 5-15)
//   - openers          (what they say at the start of a sprint)
//   - nudgeTemplates   (what they say when the user has been idle)
//   - escalationTriggers (when do they get concerned vs. pleased)

export const MANAGER_ARCHETYPES = {
  "bullet-point": {
    label: "Bullet-Point Manager",
    example: "Priya Raman (Nexara EM)",
    description: "Responds in 2-4 numbered points. Rarely writes prose. Will ignore your 4-paragraph message and answer 3 of your 12 questions.",
    responseShape: "numbered_list",
    typicalLatencyMin: { sprint1: 45, sprint2: 30, sprint3: 15 },
    openers: [
      "1. Welcome. 2. Today: read the predecessor ticket before touching /teams. 3. Ping me if the API style guide is unclear.",
      "Three things for this sprint: 1) the cursor fix, 2) the test, 3) the PR description. Let's go.",
      "Quick orientation: 1) you have async overlap, 2) I review PRs on Tuesday and Friday, 3) Slack is for blockers, Notion is for decisions.",
    ],
    nudgeTemplates: [
      "Status check: 1) on the cursor fix? 2) any blockers? 3) PR ready?",
      "Two questions: 1) where are you in the test? 2) is the cursor logic clear?",
    ],
    escalationTriggers: [
      { condition: "submission has no test", response: "Test missing. Add it before review." },
      { condition: "PR description is one line", response: "PR description needs the contract decision. Add it." },
    ],
  },
  "code-first": {
    label: "Code-First Tech Lead",
    example: "Marcus Lee (Nexara Tech Lead)",
    description: "Will read the diff before responding. Often replies with just ✅ or a 1-line nit. Doesn't explain — expects you to read the code yourself.",
    responseShape: "code_snippet_or_emoji",
    typicalLatencyMin: { sprint1: 60, sprint2: 30, sprint3: 20 },
    openers: [
      "✅ read the predecessor. start.",
      "users.handler.ts is your reference. read line 42.",
      "push when you have a diff.",
    ],
    nudgeTemplates: [
      "diff?",
      "push.",
      "test?",
    ],
    escalationTriggers: [
      { condition: "no diff pushed", response: "no diff to review." },
      { condition: "PR is 200+ lines", response: "tighten the diff." },
    ],
  },
  "supportive": {
    label: "Supportive Senior",
    example: "Jess Park (Nexara Senior Backend)",
    description: "Long, warm messages. Asks how you're doing. Will pair with you on the schema migration. Sometimes over-explains.",
    responseShape: "prose_paragraph",
    typicalLatencyMin: { sprint1: 20, sprint2: 15, sprint3: 10 },
    openers: [
      "Hey! Welcome to the team. I've been where you are — the cursor fix is a classic first ticket and it's a good one. Read ENG-4419, it'll save you 30 minutes. Slack me anytime, no question too small.",
      "Hi — happy to pair on this one if you want. My calendar is open Tuesday/Thursday afternoons. Just drop a Zoom link in #eng.",
    ],
    nudgeTemplates: [
      "Hey, just checking in. Where are you on the cursor logic? No rush if you're still reading the predecessor — that's the right thing to do.",
      "How's it going? If you're stuck, I'd rather you ask than spin. Even 'I don't know where to start' is a fine Slack message.",
    ],
    escalationTriggers: [
      { condition: "user has been idle 2+ days", response: "Haven't heard from you in a couple days — everything okay? Reach out if you need anything." },
    ],
  },
  "clarifying-questions": {
    label: "PM with clarifying questions",
    example: "Sana Qureshi (Nexara PM)",
    description: "Won't answer a question you didn't ask. Will turn your 4-paragraph message into 2 questions and answer those.",
    responseShape: "questions_back",
    typicalLatencyMin: { sprint1: 90, sprint2: 45, sprint3: 30 },
    openers: [
      "Two questions: 1) have you read the predecessor ticket? 2) do you understand why the cursor is a string and not null? If the answer to either is no, start there.",
      "Before I brief you: 1) what's your timezone? 2) when can you ship this? Answer those and I'll file the rest.",
    ],
    nudgeTemplates: [
      "Where are you stuck — the cursor logic, the test, or the PR description? Tell me which one.",
      "One question: is your blocker the code, the spec, or the time? I can help differently for each.",
    ],
    escalationTriggers: [
      { condition: "user asks for the answer", response: "I can give you the answer, but I'd rather you find it. What's your read on the cursor choice?" },
    ],
  },
};

// Map tracks to their assigned manager. The ManagerChat component reads
// this to know which archetype to use.
export const TRACK_MANAGERS = {
  "backend-intern": "bullet-point", // Priya
  "aiml-intern": "code-first", // Marcus-style tech lead at Orbit Labs
  "frontend-intern": "code-first", // Aria is ship-first / code-first
  "data-intern": "clarifying-questions", // PM-style at Meridian
};

export function getManagerForTrack(trackId = "backend-intern") {
  const archetype = TRACK_MANAGERS[trackId] || "bullet-point";
  return { archetype, ...MANAGER_ARCHETYPES[archetype] };
}