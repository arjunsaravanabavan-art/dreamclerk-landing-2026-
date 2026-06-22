// ─── slack.js — sample channel feeds for the in-workspace SlackTicker ───
//
// 4 channels with 3 messages each. Tone matches the manager archetype
// (bullet-point) and the work culture. Updates NEVER happen at runtime —
// the SlackTicker is intentionally a "what the office looks like" snapshot,
// not a live feed (the live feed is in the landing hero).

export const CHANNELS = [
  {
    name: "eng",
    topic: "all engineering",
    members: 14,
    messages: [
      { from: "Priya Raman", time: "11:14", text: "1. PR review window tuesday + friday. 2. standup at 10. 3. don't push to main on friday afternoon." },
      { from: "Marcus Lee",  time: "11:16", text: "merged the cursor fix. good diff. tests cover the empty case." },
      { from: "Owen Patel",  time: "11:18", text: "if anyone has time, can you review my OpenTelemetry spike doc? link in the thread." },
    ],
  },
  {
    name: "random",
    topic: "pets, lunch, friday",
    members: 22,
    messages: [
      { from: "Echo Davis",  time: "10:02", text: "mango says hi. (attached: 1 photo of a cat)" },
      { from: "Lina Chen",   time: "10:04", text: "friday lunch is at the new thai place. 6 of us confirmed." },
      { from: "Vega Rao",    time: "10:06", text: "i am bringing my sourdough. yes, you can have some." },
    ],
  },
  {
    name: "incidents",
    topic: "prod alerts, postmortems",
    members: 9,
    messages: [
      { from: "Sana Qureshi", time: "09:14", text: "false alarm on the billing webhook. rate limit on the customer side. ops says it's been resolved." },
      { from: "Vega Rao",     time: "09:18", text: "P2 incident log is in /docs/incidents/2026-06-19-billing-webhook.md. no action items from us, but the customer audit log is good to look at." },
    ],
  },
  {
    name: "design",
    topic: "design crit + Figma links",
    members: 8,
    messages: [
      { from: "Iris Park",  time: "13:02", text: "new icon set is up. feedback by thursday 5pm. please look at the empty-state on the dashboard — it's been bothering me for weeks." },
      { from: "Aria Chen",  time: "13:06", text: "left comments. the empty-state in particular — let's align on the icon weight before we go further." },
    ],
  },
];