// ─── aiPolicies.js — Company-specific AI Assistant policy (System B) ──────
//
// Per the Knowledge Layer .md: every company has a posture toward AI tools.
// Nexara's posture is "use it for boilerplate, verify everything, get
// reviewed like anyone else." The posture maps directly to the assist-mode
// rules the workspace enforces.
//
// Postures are designed to be company-portable: when we add Orbit Labs
// (research-driven) or VaultX (compliance-grade), they get their own entry.
// The AssistantButton reads this config to decide which actions are allowed.

export const AI_POLICIES = {
  nexara: {
    company: "Nexara",
    posture: "use-it-for-boilerplate",
    summary: "AI assistant is fine for boilerplate, names, and stub tests. Any non-trivial logic must be understood and reviewed. Getting flagged for unverified AI output is a performance issue, not a tooling one.",
    assistModes: {
      boilerplate: {
        allowed: true,
        description: "Generate function signatures, test stubs, and type definitions.",
        counter: "low-impact", // counts weakly against IWR
      },
      name: {
        allowed: true,
        description: "Suggest variable, function, and file names.",
        counter: "low-impact",
      },
      test_stub: {
        allowed: true,
        description: "Generate the structure of a test (cases, beforeEach, etc).",
        counter: "low-impact",
      },
      explanation: {
        allowed: true,
        description: "Explain a piece of existing code in plain English.",
        counter: "no-impact",
      },
      logic: {
        allowed: false,
        description: "Write the actual implementation of a non-trivial function. BANNED — must be your own work.",
        counter: "high-impact", // counts strongly against IWR
      },
      full_solution: {
        allowed: false,
        description: "Generate a full PR description, a full endpoint, or a full test file. BANNED.",
        counter: "high-impact",
      },
    },
    interviewPolicy: "AI assistant is OFF during the technical interview. Bringing it in is an instant fail. The interview is graded on independent work.",
    capstonePolicy: "AI assistant is OFF during the capstone. The capstone is graded on independent work.",
    reviewNote: "Reviewers are trained to spot AI-style output: variable names that don't match our style, perfect-but-wrong test cases, 'explanatory' comments that explain the obvious. Flag and ask.",
  },
  // Future postures (not active in this build, but the structure is here so
  // a new company slot is a 10-line add):
  "orbit-labs": {
    company: "Orbit Labs",
    posture: "use-it-as-a-teammate",
    summary: "Orbit Labs treats AI as a research collaborator. Use it for literature search, experiment design feedback, and postmortem drafting. Any output cited in a paper must be verified.",
    assistModes: {
      literature: { allowed: true, description: "Find related work, summarize papers.", counter: "no-impact" },
      experiment_design: { allowed: true, description: "Suggest control variables, baseline models.", counter: "low-impact" },
      logic: { allowed: true, description: "Write training loops, eval scripts.", counter: "low-impact" },
      paper_draft: { allowed: false, description: "Write the paper. BANNED — must be your own writing.", counter: "high-impact" },
    },
    interviewPolicy: "AI assistant is ON during the interview. We want to see how you use it, not how you avoid it.",
    capstonePolicy: "AI assistant is ON. Capstone is graded on research quality, not independence.",
    reviewNote: "Reviewers are looking for: did the human verify the AI's claims? did they catch the AI's errors?",
  },
  vaultx: {
    company: "VaultX",
    posture: "minimal-use",
    summary: "VaultX is compliance-grade. AI output is treated as untrusted. The assistant is allowed for doc lookups and never for code that touches regulated data.",
    assistModes: {
      doc_lookup: { allowed: true, description: "Look up an API, a regulation, a standard.", counter: "no-impact" },
      boilerplate: { allowed: true, description: "Generate non-regulated boilerplate.", counter: "low-impact" },
      logic: { allowed: false, description: "Write code that touches user data. BANNED.", counter: "high-impact" },
      full_solution: { allowed: false, description: "Full PR generation. BANNED.", counter: "high-impact" },
    },
    interviewPolicy: "AI assistant is OFF. Compliance teams audit the interview transcript.",
    capstonePolicy: "AI assistant is OFF.",
    reviewNote: "Reviewers are looking for: did the human write the audit log? did they check the AI's data handling?",
  },
};

// Active policy for the current track — defaults to Nexara for the backend
// intern role. Future tracks would key off session.trackId.
export function getActivePolicy(trackId = "backend-intern") {
  // backend-intern is at Nexara. Other intern tracks map to other companies.
  const map = {
    "backend-intern": "nexara",
    "aiml-intern": "orbit-labs",
    "frontend-intern": "nexara",
    "data-intern": "meridian-corp",
  };
  const company = map[trackId] || "nexara";
  return { id: company, ...AI_POLICIES[company] };
}