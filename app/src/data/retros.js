// ─── retros.js — sample sprint retrospectives ───────────────────────────
//
// The SprintRetro component shows a retro after each sprint with 3 columns:
//   - went well
//   - went poorly
//   - we'll do differently
//
// The 3 columns are filled by the 3 main characters (manager, tech lead,
// peer) in their archetype's voice. This grounds the user in what work
// culture looks like at each company.

export const RETRO_FEEDBACK = {
  nexara: {
    1: {
      title: "sprint 01 retro · cursor fix",
      wentWell: [
        { speaker: "Marcus Lee", text: "diff was tight. mirrored the /users pattern cleanly. ✅" },
        { speaker: "Owen Patel",  text: "tests covered the empty-result edge case on the first push. appreciated." },
      ],
      wentPoorly: [
        { speaker: "Priya Raman", text: "PR description was one line. next time: state the contract decision." },
        { speaker: "Marcus Lee",  text: "you didn't run the linter before push. CI caught it. do that locally first." },
      ],
      doDifferently: [
        { speaker: "Owen Patel",  text: "write the test FIRST next sprint. the implementation gets easier when the test tells you the shape." },
        { speaker: "Priya Raman", text: "post in #eng when you start, not when you finish. unblocks people faster." },
      ],
    },
    2: {
      title: "sprint 02 retro · soft-delete",
      wentWell: [
        { speaker: "Marcus Lee",  text: "good call on 204 vs 200. documented. read the style guide §5.2 first." },
        { speaker: "Sana Qureshi", text: "pushed back on the restored_at ask. right call. filed ENG-4501 as a follow-up." },
      ],
      wentPoorly: [
        { speaker: "Priya Raman", text: "sprint slipped by 1 day. not a fail, but log it. velocity tracking matters for promotion." },
      ],
      doDifferently: [
        { speaker: "Owen Patel",  text: "ask sana about quarterly BEFORE you design the date range. saves a refactor." },
        { speaker: "Marcus Lee",  text: "soft-delete is a one-line change to the GET handler. you added a migration. needed, but check the next one doesn't take a day." },
      ],
    },
    3: {
      title: "sprint 03 retro · billing endpoint",
      wentWell: [
        { speaker: "Marcus Lee",  text: "DoD was tight. included out-of-scope. that's senior work." },
        { speaker: "Lina Chen",   text: "asked me about the quarterly use case before adding it. shipped monthly. perfect." },
        { speaker: "Priya Raman", text: "promotion interview ready when you are." },
      ],
      wentPoorly: [
        { speaker: "Sana Qureshi", text: "took 2 days to align with leana on the overage badge. would have been faster if you'd asked in standup." },
      ],
      doDifferently: [
        { speaker: "Owen Patel",  text: "promotion interview: prep by re-reading your 3 sprint retros. the pattern across them is what we're looking for." },
      ],
    },
  },
};