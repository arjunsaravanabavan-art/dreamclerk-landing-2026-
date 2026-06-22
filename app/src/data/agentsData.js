// ─── agentsData.js — single source of truth for the 8 AI agents ───────────
//
// 1 agent per company. Each agent is a named, autonomous peer that "works" at
// their company. The landing rebrand positions them as the workforce; the beta
// (Part B) uses the same data so the agent signatures map to real beta tracks.
//
// STATUS VALUES: "shipping" | "idle" | "review" | "compiling" | "standup"
//   — these cycle randomly every 4-8s on the landing pulse grid so the office
//   feels alive even when nobody is watching.

export const AGENTS = [
  {
    id: "aria",
    name: "Aria",
    pronouns: "she/her",
    company: "Nexara",
    role: "Frontend Lead",
    signature: "React, design systems, ships UI in hours",
    status: "shipping",
    sprintsCompleted: 412,
    prsMerged: 1820,
    peerQuote: "I optimise for 'does it feel right at 100ms'. Everything else is a tax.",
    signatureColor: "var(--ok-fill)",
    bio: "Aria runs Nexara's frontend platform. She owns the design system, kills stale CSS on sight, and ships components faster than the design team can brief them.",
    lastCommit: "12 min ago",
    cohort: "nexara-2026-summer",
  },
  {
    id: "kai",
    name: "Kai",
    pronouns: "he/him",
    company: "Orbit Labs",
    role: "ML Engineer",
    signature: "Trains, evals, ships models overnight",
    status: "compiling",
    sprintsCompleted: 287,
    prsMerged: 940,
    peerQuote: "Every experiment gets a hypothesis written down before the first line of code.",
    signatureColor: "#5b8cff",
    bio: "Kai is Orbit Labs' resident experiment runner. He treats data as a product, logs every run, and writes the postmortem whether the model wins or loses.",
    lastCommit: "4 min ago",
    cohort: "orbit-labs-2026-summer",
  },
  {
    id: "vega",
    name: "Vega",
    pronouns: "they/them",
    company: "VaultX",
    role: "Backend / Security",
    signature: "Compliance-grade APIs, audit-ready",
    status: "review",
    sprintsCompleted: 358,
    prsMerged: 1410,
    peerQuote: "If a regulator can subpoena your build, your build is a liability. I fix that.",
    signatureColor: "#7ad3a4",
    bio: "Vega runs VaultX's compliance-aware backend. Every endpoint has audit logging, every secret is scoped, and every change has a reviewer other than themselves.",
    lastCommit: "27 min ago",
    cohort: "vaultx-2026-summer",
  },
  {
    id: "sol",
    name: "Sol",
    pronouns: "she/her",
    company: "Meridian Corp",
    role: "Data Analyst",
    signature: "Raw data → board decks",
    status: "shipping",
    sprintsCompleted: 198,
    prsMerged: 612,
    peerQuote: "Stakeholders don't want a dashboard. They want a recommendation in 3 slides.",
    signatureColor: "#f0b94c",
    bio: "Sol turns raw SQL into C-suite ready narratives. She finds the one number that matters and builds the rest of the deck around it.",
    lastCommit: "8 min ago",
    cohort: "meridian-2026-summer",
  },
  {
    id: "iris",
    name: "Iris",
    pronouns: "she/her",
    company: "Pulse Media",
    role: "Product Designer",
    signature: "Design-led prototypes, user-obsessed",
    status: "idle",
    sprintsCompleted: 221,
    prsMerged: 487,
    peerQuote: "Every screen should be a banger or it should be in the bin. Nothing in between.",
    signatureColor: "#d97aff",
    bio: "Iris is Pulse Media's design lead. She runs user research on Tuesdays, ships prototypes on Thursdays, and writes the design tokens everyone else fights over.",
    lastCommit: "1 hr ago",
    cohort: "pulse-media-2026-summer",
  },
  {
    id: "rin",
    name: "Rin",
    pronouns: "they/them",
    company: "GreenStack",
    role: "Full-Stack + Climate",
    signature: "Carbon-aware builds, end-to-end",
    status: "shipping",
    sprintsCompleted: 167,
    prsMerged: 524,
    peerQuote: "Does this move the needle on emissions? If no, why are we shipping it?",
    signatureColor: "#76c893",
    bio: "Rin is GreenStack's full-stack engineer with a climate budget. Every PR includes a carbon estimate. They will rewrite your lambda to be cold-start friendlier without being asked.",
    lastCommit: "16 min ago",
    cohort: "greenstack-2026-summer",
  },
  {
    id: "echo",
    name: "Echo",
    pronouns: "she/her",
    company: "BridgeHR",
    role: "People Ops",
    signature: "Onboarding flows, culture scaffolding",
    status: "standup",
    sprintsCompleted: 142,
    prsMerged: 311,
    peerQuote: "How would this land with a nervous candidate on day three? That's my spec.",
    signatureColor: "#ff9b6a",
    bio: "Echo runs BridgeHR's onboarding. She writes the docs nobody else wants to write, sits in on difficult conversations, and remembers everyone's pronouns.",
    lastCommit: "33 min ago",
    cohort: "bridgehr-2026-summer",
  },
  {
    id: "dax",
    name: "Dax",
    pronouns: "he/him",
    company: "ClearLens",
    role: "Editorial Lead",
    signature: "Long-form, video, content at speed",
    status: "shipping",
    sprintsCompleted: 256,
    prsMerged: 698,
    peerQuote: "Copy deadline is hard. No exceptions. Ever.",
    signatureColor: "#5ecbe6",
    bio: "Dax is ClearLens' editorial lead. He files copy on time, fact-checks his own work, and writes the kind of headlines that make people stop scrolling without tricking them.",
    lastCommit: "5 min ago",
    cohort: "clearlens-2026-summer",
  },
];

// Pre-canned chat messages shown when a visitor opens the agent modal.
// These are deliberately LLM-style (one line, in-character, ends in a period or
// a question) so the modal feels responsive without burning API tokens.
export const AGENT_CHAT_OPENERS = {
  aria: [
    "Pulled your last 3 component submissions. Naming is consistent. Good.",
    "Hey — what are you trying to ship today? I can scaffold the file structure.",
    "Design system is at v0.4. Want me to PR the token migration before you start?",
  ],
  kai: [
    "Hypothesis first. What's the smallest experiment that falsifies your assumption?",
    "I just shipped the eval harness. Your next ticket is the training loop.",
    "Plot the loss. If it diverges at epoch 2, check the data loader — it's always the data loader.",
  ],
  vega: [
    "Every endpoint that touches user data needs an audit log. I'll review your PR before merge.",
    "Show me your schema migration plan before you write it. Backwards compatibility is non-negotiable.",
    "Compliance review queue is light. Drop the diff in #eng-review and I'll take it in 2 hours.",
  ],
  sol: [
    "What decision are you trying to inform? That's where the chart starts.",
    "Number one in your deck should be the recommendation. Everything else is evidence.",
    "The variance is in the data, not the model. Want me to send the cleaned table?",
  ],
  iris: [
    "Where are users actually getting stuck? Send me the recording and I'll cut a prototype.",
    "This layout works in Figma. I'm less sure it works at 360px. Let me check.",
    "Design system tokens are public. Steal liberally, but rename them so I know which ones you're using.",
  ],
  rin: [
    "Carbon estimate for this PR is 4.2g CO₂ per request. Want to drop the cold start?",
    "I can cut the bundle in half by removing lodash. Push back if you actually use it.",
    "End-to-end test passes locally. Deploying to staging now — flag if you see a regression.",
  ],
  echo: [
    "Onboarding pack is updated. Take a look before your next 1:1.",
    "How would this land with someone on day three? That's my review lens.",
    "Calendar is open for the difficult conversation. Book it before it gets harder.",
  ],
  dax: [
    "Headline is the only thing that matters. Send me 5 options and I'll cut to 3.",
    "Fact-check: the 2.4M figure you cited is from 2023. Do you have 2025?",
    "Copy deadline is hard. I filed mine 11 minutes ago. Where's yours?",
  ],
};

// Random live-activity feed entries that scroll across the hero ticker.
// Format: "AGENT_NAME  verb  object  (time)". Visitor sees continuous activity.
export const TICKER_FEED_TEMPLATES = [
  { agent: "Aria", verb: "shipped", object: "12-file PR — onboarding redesign" },
  { agent: "Kai", verb: "ran", object: "experiment v0.4 — 78% recall" },
  { agent: "Vega", verb: "closed", object: "ticket #4218 — auth refactor" },
  { agent: "Sol", verb: "delivered", object: "Q2 board deck to Meridian client" },
  { agent: "Iris", verb: "prototyped", object: "checkout flow in 47 minutes" },
  { agent: "Rin", verb: "cut", object: "lambda cold start by 38%" },
  { agent: "Echo", verb: "wrote", object: "Day 1 doc — BridgeHR onboarding v3" },
  { agent: "Dax", verb: "filed", object: "ClearLens feature on climate-tech sector" },
  { agent: "Aria", verb: "merged", object: "design system tokens v0.4" },
  { agent: "Kai", verb: "reviewed", object: "intern's first fine-tune submission" },
  { agent: "Vega", verb: "audited", object: "VaultX API for ITAR compliance" },
  { agent: "Sol", verb: "found", object: "the 1 number in 14k rows of funnel data" },
  { agent: "Iris", verb: "ran", object: "12 user interviews on Tuesday" },
  { agent: "Rin", verb: "estimated", object: "carbon impact of new build pipeline" },
  { agent: "Echo", verb: "scheduled", object: "difficult conversation, kept it kind" },
  { agent: "Dax", verb: "wrote", object: "the 2,400-word feature, filed on time" },
];

// Helper: get a random subset of the feed for initial render. Ticker
// re-shuffles itself client-side every 30s so it never feels static.
export function getInitialFeed(count = 6) {
  const pool = [...TICKER_FEED_TEMPLATES];
  const out = [];
  for (let i = 0; i < count && pool.length; i++) {
    const idx = Math.floor(Math.random() * pool.length);
    out.push({ ...pool.splice(idx, 1)[0], t: "now" });
  }
  return out;
}
