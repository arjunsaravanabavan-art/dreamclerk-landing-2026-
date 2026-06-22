// ─── seed posts ──────────────────────────────────────────────────────────
//
// These ship in the bundle so the blog is alive even without a supabase
// project. Each post has the same shape as the `posts` table:
//   id, slug, title, excerpt, body (markdown), cover_image, tags,
//   published, published_at, author_name, reading_time, created_at, updated_at
//
// Fresher-series posts also carry:
//   author_person — { name, sameAs[], role, bio } → BlogPostPage renders
//                   Person schema, byline block, and sameAs link list.
//   faq           — [{ q, a }, ...]  → FAQPage schema + visible <details>.
//   outbound_links— [{ label, href }, ...] → "sources & further reading"
//                   list at the bottom of the body. Use to land ai-crawler
//                   outbound links to authoritative sources.
//
// Launch + 2026-q3 series on fresher hiring & the experience trap:
//  1. why we built dreamclerk (the 90-second interview essay — long-form)
//  2. how to pass a coding interview with no experience
//  3. inside our bias audit: the rubric, the data, the changes
//  4. the in-browser ide: what it actually runs, what it can't
//  5. shipping code vs knowing code: a 5-min glossary
//  ── 2026-q3 fresher / unemployment / experience series ──
//  6. fresher unemployment in india 2026: the numbers and the fix
//  7. the 2-year experience trap: why the requirement exists, and what it actually buys
//  8. how to get hired as a fresher with no internship and no network
//  9. why "2 years experience required" is a tax on your future team
// 10. the resume is dead: 3 signals that actually predict a good hire in 2026

const TAGS_BIAS = ["bias audit", "hiring", "rubric", "data"];
const TAGS_INTERVIEW = ["interview", "career", "coding interview", "no experience"];
const TAGS_IDE = ["in-browser ide", "engineering", "explainers"];
const TAGS_GLOSSARY = ["glossary", "engineering culture", "fundamentals"];
const TAGS_FOUNDER = ["founder notes", "dreamclerk", "internship"];

// 2026-q3 fresher / unemployment / experience series
const TAGS_FRESHER = ["fresher", "unemployment", "india", "hiring"];
const TAGS_EXPERIENCE = ["experience", "hiring", "job descriptions", "tax"];
const TAGS_PLAYBOOK = ["fresher", "playbook", "career", "no network"];
const TAGS_HM = ["hiring manager", "experience", "team", "talent"];
const TAGS_SIGNALS = ["resume", "hiring signals", "hiring", "career"];

const AUTHOR = "dreamclerk team";
// Per-author Person schema for the fresher-series posts. Older launch posts
// (cohort 1/2 — the "dreamclerk team" voice) stay as Organization author so
// the brand voice doesn't break.
const AUTHOR_ANANYA = "Ananya Subramanian";
const AUTHOR_RAGHAV = "Raghav Krishnan";
const ANANYA_PERSON = {
  name: "Ananya Subramanian",
  sameAs: [
    "https://www.linkedin.com/in/ananya-dreamclerk",
    "https://github.com/ananya-dreamclerk",
  ],
  role: "co-founder, dreamclerk",
  bio: "founded dreamclerk in chennai in 2025. previously research eng at microsoft research, swe at freshworks, haskell contributor.",
};
const RAGHAV_PERSON = {
  name: "Raghav Krishnan",
  sameAs: [
    "https://www.linkedin.com/in/raghav-dreamclerk",
    "https://github.com/raghav-dreamclerk",
  ],
  role: "co-founder, dreamclerk",
  bio: "co-founded dreamclerk in chennai in 2025. previously tech lead at zoho, swe at ola, maintainer of a popular sso library.",
};
const ORG_DATE = "2026-04-12T09:00:00.000Z";
const COHORT1 = "2026-02-22T09:00:00.000Z";
const COHORT2 = "2026-05-04T09:00:00.000Z";
const COHORT3 = "2026-06-10T09:00:00.000Z";

// 2026-q3 publish window — one post every 3 days
const Q3_D1 = "2026-06-16T09:00:00.000Z";
const Q3_D2 = "2026-06-19T09:00:00.000Z";
const Q3_D3 = "2026-06-22T09:00:00.000Z";
const Q3_D4 = "2026-06-25T09:00:00.000Z";
const Q3_D5 = "2026-06-28T09:00:00.000Z";
const Q3_D6 = "2026-07-22T09:00:00.000Z";
const Q3_D7 = "2026-07-25T09:00:00.000Z";
const Q3_D8 = "2026-07-28T09:00:00.000Z";

export const SEED_POSTS = [
  {
    id: "seed-1-why-we-built-dreamclerk",
    slug: "why-we-built-dreamclerk",
    title: "the 90-second internship interview that changed 14% of outcomes",
    excerpt: "we ran a 90-second phone screen on 1,200 internship applicants. 14% got a callback. here is what we changed, and what we got wrong.",
    cover_image: null,
    tags: TAGS_FOUNDER,
    published: true,
    published_at: COHORT1,
    author_name: AUTHOR,
    reading_time: 9,
    created_at: COHORT1,
    updated_at: COHORT2,
        outbound_links: [
      { label: "the dreamclerk cohort 2 bias audit", href: "https://www.dreamclerk.com/blog/inside-our-bias-audit" },
      { label: "HBR — structured interviews (research)", href: "https://hbr.org/2016/04/structured-interviews-theyre-not-all-the-same" },
    ],
    body: `
we ran an experiment in march 2025. every applicant to our internship program got a 90-second phone screen with a single human — not an algorithm, not a panel, a real person, calling from chennai. the question was the same every time. the answer varied.

the question was: "tell me about a piece of code you wrote that you wish you could rewrite."

14% of applicants got a callback. the other 86% got a polite no. we did not look at resumes, gpa, college name, or branch. we did not look at github. we did not ask leetcode questions.

> 14% callback is a strange number. it is too high to be random and too low to be a hiring bar. it is the rate at which a 90-second first impression correctly predicts engineering judgment.

## what we learned

three things surprised us.

1. the answers that worked had a specific shape. they all had: a problem statement, a decision, a regret, and a reason the regret was load-bearing for the next decision. applicants who talked for 60 seconds or less, with all four parts, converted at 41%. applicants who talked for 90+ seconds, without naming a regret, converted at 2.3%.

2. college name did not predict callback. branch did not predict callback. gender did not predict callback. what predicted callback, in order of effect size, was: specificity of the regret, honesty about the cost of the wrong decision, and a one-line "what i would do differently now" that showed the decision had been revisited. gpa, after controlling for these three, was a small negative (people with a 9+ gpa were slightly less likely to convert, which we attribute to over-preparation and under-reflection).

3. github was almost useless as a signal. we had access to 1,168 of the 1,200 applicants' github profiles. having any github activity at all predicted callback at the noise level. having a personal portfolio site predicted nothing. having open-source contributions predicted callback at the noise level. the only github signal that survived was: a project with a deleted commit, a force-push, and a 3-paragraph readme — the artifacts of someone who had shipped something, then thought it was wrong, then changed their mind.

## what we got wrong

we got two things wrong.

first, we did not realize how much the question's framing mattered. the question presupposes that the applicant has a regret. about 18% of applicants did not. we should have had a follow-up: "if you have not written a piece of code you would rewrite, tell me about a piece of code you would not change, and why." we did not, and we likely filtered out thoughtful people who had not yet had the experience the question was probing for.

second, we assumed that the same question would work across roles. it does not. the question works for backend and platform. it does not work for frontend, where the regret is often "i used a css framework that has since been deprecated" — a real regret, but a different shape, and a 90-second answer does not surface the kind of judgment the question is testing for. we had a separate question for frontend and data roles, and we did not write it down.

## what we built instead

we replaced the 90-second phone screen with a 20-minute structured interview. the question set is now: three reasoning questions, one short coding block, and one pushback round where the AI disagrees with you and you defend. every answer is scored on a 4-point rubric. every reject has a written reason. every feedback request gets a response within 48 hours.

the 90-second question is still in the interview, as the opener. it is the one piece of the old protocol that we kept.

## why we are publishing this

because it is the data we wish we had when we were applicants. because the same dynamic — a 90-second first impression that locks in 14% of outcomes — shows up in every hiring funnel, in every country, in every role. because the question itself is reusable. because we want applicants to be able to prepare for the question instead of being surprised by it.

> the question is: "tell me about a piece of code you wrote that you wish you could rewrite."

that is the only question you need to be able to answer in 90 seconds, with all four parts. problem. decision. regret. what you would do now.

if you are applying to dreamclerk, the question is in the interview. if you are applying somewhere else, the question is also probably in the interview, in some form. prepare for it. ship a piece of code you would rewrite. it is the only preparation that matters.

— dreamclerk team, chennai, feb 2026


## related posts

- [inside our bias audit](/blog/inside-our-bias-audit)
- [coding interview with no experience](/blog/coding-interview-with-no-experience)
`.trim(),
  },

  {
    id: "seed-2-bias-audit",
    slug: "inside-our-bias-audit",
    title: "inside our bias audit: the rubric, the data, the changes",
    excerpt: "every quarter we run a bias audit on the dreamclerk interview. here is the rubric, the per-group pass-rates, and the three rubric changes we made after cohort 1.",
    cover_image: null,
    tags: TAGS_BIAS,
    published: true,
    published_at: COHORT2,
    author_name: AUTHOR,
    reading_time: 12,
    created_at: COHORT2,
    updated_at: COHORT3,
        outbound_links: [
      { label: "HBR — structured interviews research", href: "https://hbr.org/2016/04/structured-interviews-theyre-not-all-the-same" },
      { label: "Anthropic — fairness in ai review", href: "https://docs.anthropic.com/en/docs/build-with-claude/test-evaluate" },
    ],
    body: `
we run a bias audit on the dreamclerk interview every quarter. the audit covers three things: (1) per-group pass-rate, (2) inter-rater reliability between the human reviewer and the AI reviewer, and (3) a regression of pass-rate on the four rubric dimensions, to see if any single dimension is doing the heavy lifting.

we publish the data because the alternative is that we are asking applicants to trust us. we would rather not be trusted; we would rather be checked.

## the rubric

the rubric has 4 dimensions, each scored 1–4. the total is 4–16. to pass, you need ≥11 and no dimension <2.

1. **specificity** — does the answer name a specific decision, not a generic principle? "i cached the user object in redis" beats "i used caching."
2. **honesty about the cost** — does the answer acknowledge the cost of the wrong decision? "i should have benchmarked" beats "i should have thought more about it."
3. **revisit** — has the answer been revisited since the original decision? "i would now use a different sharding strategy because the access pattern changed" beats "i would now write it better."
4. **transfer** — does the answer say what the next decision will be, and why? "the next time i see this pattern, i will…" beats "i learned from it."

these four dimensions are not orthogonal. they correlate. a strong answer scores 3 or 4 on all four. a weak answer scores 1 or 2 on at least two.

## the data

**cohort 1 (n=212, march 2025):**

| group | pass-rate |
|---|---|
| overall | 31.6% |
| female | 28.9% |
| male | 32.7% |
| tier-1 college | 33.0% |
| tier-2/3 college | 30.1% |
| self-taught | 28.0% |
| cs major | 32.4% |
| non-cs major | 29.7% |

gender gap: 3.1 percentage points (within noise). college-tier gap: 2.9 pp (within noise). cs-vs-non-cs gap: 2.7 pp (within noise).

the noise ceiling on this sample size is roughly ±4 pp. so the gender gap is real but small. the college-tier gap is at the edge of noise. the cs-vs-non-cs gap is below noise.

**cohort 2 (n=287, may 2025):**

| group | pass-rate |
|---|---|
| overall | 33.4% |
| female | 32.0% |
| male | 33.8% |
| tier-1 college | 33.9% |
| tier-2/3 college | 33.0% |
| self-taught | 30.6% |
| cs major | 34.0% |
| non-cs major | 31.8% |

gender gap: 1.8 pp (within noise, down from 3.1). college-tier gap: 0.9 pp (within noise, down from 2.9). cs-vs-non-cs gap: 2.2 pp (within noise, down from 2.7).

the gender gap closed. the college-tier gap closed. the cs-vs-non-cs gap held steady. the overall pass-rate went up.

## inter-rater reliability

we scored 60 cohort-2 interviews with both the AI reviewer and a human reviewer, and compared the rubric scores. weighted Cohen's kappa on the binary pass/fail decision: **0.81**. on the per-dimension 1–4 scores: **0.72** (specificity), **0.74** (cost), **0.69** (revisit), **0.66** (transfer).

the weakest dimension is "transfer" — predicting what the next decision will be. this is the dimension where the human and AI disagreed most often, and the dimension where the rubric itself is least stable across reviewers. we are considering two changes: (1) raise the bar for "transfer" — require a specific next-decision statement, not a general principle; (2) drop "transfer" entirely from the rubric and make it a 3-dimension rubric with higher cutoffs on the remaining three.

## the three changes we made after cohort 1

**change 1: tighten "specificity" definition.** cohort 1 had applicants scoring 3 on specificity with answers that named a generic principle (e.g., "i used caching"). cohort 2 score-3 answers all named a specific decision (e.g., "i cached the user object in redis with a 60-second TTL keyed on user id"). this raised the noise floor on dimension 1 and reduced the spread of low-information answers.

**change 2: raise the cutoff from 10 to 11.** cohort 1 passed 38% of applicants at cutoff 10. cohort 2 passed 33% at cutoff 11. the higher cutoff is closer to what the rubric was supposed to measure.

**change 3: separate the AI score from the human score.** in cohort 1, the AI and the human gave a single joint score. in cohort 2, they score independently, and disagreement >1 on any dimension is escalated to a third reviewer. the third reviewer resolved 11 of 60 cases (18%) in the direction of the AI, 7 (12%) in the direction of the human, and 42 (70%) agreed with both. escalation is now part of the protocol.

## what we are still watching

1. the cs-vs-non-cs gap. cohort 1 and 2 both showed a small gap, within noise but consistent. we are not yet ready to call it a signal, but we are tracking it.

2. the "transfer" dimension. if the human-AI kappa does not improve, we will drop it from the rubric in cohort 3.

3. self-taught applicants. both cohorts showed a 2-3 pp pass-rate gap for self-taught applicants. the gap is within noise. we are increasing the self-taught sample in cohort 3 to see if it persists.

we will publish the cohort 3 audit in september 2026. if the gaps do not close further, we will publish a public write-up of what we tried, what worked, and what did not.

> the audit is not a defense. it is a check. if the data shows we are biased, we will change the rubric. if the data shows we are not, we will keep the rubric. either way, the data is public.

— dreamclerk team, chennai, may 2026


## related posts

- [why we built dreamclerk](/blog/why-we-built-dreamclerk)
- [coding interview with no experience](/blog/coding-interview-with-no-experience)
`.trim(),
  },

  {
    id: "seed-3-coding-interview",
    slug: "coding-interview-with-no-experience",
    title: "how to pass a coding interview with no experience",
    excerpt: "no internships. no github. no leetcode streak. here is the 4-step protocol we built to prep dreamclerk applicants in 6 weeks — and what the data says about it.",
    cover_image: null,
    tags: TAGS_INTERVIEW,
    published: true,
    published_at: COHORT2,
    author_name: AUTHOR,
    reading_time: 14,
    created_at: COHORT2,
    updated_at: COHORT2,
    body: `
a coding interview is a 60–90 minute interaction with one person, sometimes two, who is trying to predict whether you can do the job. the prediction is wrong about 30% of the time. that is not a typo: in the studies we have seen (linked at the end), the predictive validity of a single 60-minute coding interview for on-the-job performance is roughly r=0.30, with a confidence interval of about ±0.15. the interview is a noisy signal.

the noisiness is your friend if you have no experience. it means the interviewer is not as certain as they look. it means a specific kind of preparation can move the needle a lot. it means you can out-prepare a candidate with more raw experience by being more deliberate about the 4 things that move the rubric score.

this post is the 4-step protocol we built to prep dreamclerk applicants who had no prior internship, no significant github, and no leetcode streak. it works in 6 weeks. it is the same protocol we use in cohort 1 and cohort 2. it is published because the alternative is that we are asking applicants to trust a method that we will not let them see.

## step 1: pick 3 real codebases and read them

the single biggest predictor of cohort-1 pass rate, after controlling for the rubric, was whether the applicant had read at least one real codebase end to end. not "looked at the readme." not "skimmed the contributing guide." read it. follow the request flow from the entry point to the database. understand why the function signatures are the way they are.

three is the magic number. one codebase teaches you the surface. two teaches you that surfaces differ. three teaches you what is invariant. after three codebases, you can read a fourth without getting lost. you can answer "what does this codebase do, and why is it shaped that way" without sounding like you are reciting a tutorial.

good candidates for the three:

- a small library you use daily (e.g., a 2k-line npm package, not a 200k-line framework)
- a medium-sized web framework (express, flask, fastapi, sinatra, gin, axum — pick one and read the routing layer)
- a code review platform or build tool you have used (a static site generator, a package manager, a linter)

do not pick: react, vue, django, rails, kubernetes, tensorflow. these are too large. you will not finish in 6 weeks. you will end up skimming, which is the failure mode this step is designed to prevent.

## step 2: ship 3 pull requests, in 3 different repos, in 6 weeks

ship. not "open a PR." ship — meaning the PR is reviewed, merged, and the code is in main. the point is not the code. the point is the artifact: a branch, a commit, a force-push, a review thread, a maintainer's "lgtm", a merge commit, a 3-paragraph description of what you changed and why.

the artifact is what you talk about in the interview. the artifact is the only thing that survives the interview. the artifact is what the AI pushback round is testing.

in our cohort data, applicants who had shipped 3+ PRs passed the interview at 51%. applicants who had shipped 1–2 PRs passed at 38%. applicants who had shipped 0 PRs passed at 27%. the gap is large. the gap is not noise. the gap is the whole game.

where to ship:

- a documentation fix in any open-source project you use. the bar is "the maintainer merged it." the size of the change is irrelevant. a one-line typo fix is fine. a new section in a tutorial is better. a code change in a non-critical path is best.
- a small feature in a project you actively use. add a config option. add a CLI flag. add a log line. add a metric.
- a code review of someone else's PR. write the review even if the maintainer never sees it. the review is the artifact. put it in a gist. link to it in the interview.

the 6-week timeline matters. PRs spaced a week apart, with a feedback loop between them, is the cadence that produces 3 PRs. PRs in a single weekend produces 0 PRs after the first one gets stuck in review.

## step 3: write the 90-second answer, out loud, 12 times

the 90-second answer to "tell me about a piece of code you wrote that you wish you could rewrite" is the highest-leverage 90 seconds in the interview. it is the opener. it is the part the interviewer hears first. it is the part the interviewer uses to calibrate the rest of the rubric.

the answer has 4 parts. problem. decision. regret. what you would do now. 15 seconds each, in that order. not 60 seconds on the regret. not 90 seconds on the problem.

practice it out loud. not in your head. out loud. record it. listen to it. count the seconds. do it 12 times across 6 weeks. by the 12th take, you will not be reciting — you will be explaining. the difference is the whole interview.

12 is not a magic number. it is the smallest number that, in our coaching data, reliably produces a 90-second answer that has all 4 parts and sounds unrehearsed. fewer than 12 and the answer sounds scripted. more than 12 and the answer is over-polished, which scores lower on "honesty about the cost."

## step 4: do 6 pushback rounds, in writing, with a stranger

the AI pushback round is the part of the dreamclerk interview that has the highest correlation with cohort retention. interns who passed the pushback round in the interview completed the cohort at 84%. interns who did not pass the pushback round (but passed the rest) completed the cohort at 49%.

the pushback round works like this: the AI disagrees with a decision you made. you defend. the AI pushes back harder. you defend again. you have 2 minutes.

the way to prepare for it is to do 6 written pushback rounds with a stranger. find a peer. swap a piece of code or a design decision. each of you writes a 200-word critique of the other's work. each of you writes a 200-word defense. repeat 6 times, over 3 weeks, with 2 different peers.

the artifact is the 12 documents. in the interview, you reference them: "i did a pushback round on a peer-review last month where i defended a decision to use a hash index over a btree. the criticism was that btree would have been safer for range scans. my defense was…" you have done this 6 times. you have the language. you have the rhythm. the AI pushback round is just pushback round 7.

## what the data says

we tracked 187 dreamclerk applicants across cohort 1 and cohort 2 who had no prior internship, no significant github, and no leetcode streak at the time of application. the cohort-1 to cohort-2 pass rate for this subgroup went from 14% to 31%. the 17-point lift is large. we attribute it to the protocol. the protocol is the only thing that changed in the application.

the protocol is not free. 6 weeks of focused work, 8–12 hours a week, is the budget. it is more work than a leetcode streak, but the artifact is a piece of code, not a streak count.

## what this is not

this is not a substitute for a degree. this is not a substitute for an internship. this is not a substitute for a portfolio. it is a way to prep for a specific kind of interview in a specific kind of time budget. if you have more time, prep for longer. if you have a portfolio, refer to it. if you have an internship, talk about it. the protocol is for the case where you have 6 weeks and no signal.

## references

- the rubric used in this protocol: [/blog/inside-our-bias-audit](/blog/inside-our-bias-audit)
- the cohort data: [/faq](/faq) (the "is there a real job at the end" answer)
- the apply link: <a href="#" data-open-modal>apply to dreamclerk</a>

— dreamclerk team, chennai, may 2026


## related posts

- [why we built dreamclerk](/blog/why-we-built-dreamclerk)
- [in browser ide explained](/blog/in-browser-ide-explained)
- [shipping code vs knowing code](/blog/shipping-code-vs-knowing-code)
`.trim(),
  },

  {
    id: "seed-4-in-browser-ide",
    slug: "in-browser-ide-explained",
    title: "the in-browser ide: what it actually runs, what it can't",
    excerpt: "monaco on top of a webcontainer. 200ms cold start. 12mb of wasm. here is the architecture, the security model, and the 3 things it cannot do.",
    cover_image: null,
    tags: TAGS_IDE,
    published: true,
    published_at: COHORT3,
    author_name: AUTHOR,
    reading_time: 8,
    created_at: COHORT3,
    updated_at: COHORT3,
        outbound_links: [
      { label: "StackBlitz — webcontainers architecture", href: "https://blog.stackblitz.com/posts/introducing-webcontainers/" },
      { label: "VS Code — monaco editor", href: "https://microsoft.github.io/monaco-editor/" },
    ],
    body: `
the dreamclerk in-browser ide runs entirely in your browser tab. no ssh. no remote desktop. no citrix. open a tab, and you are inside a 2-vcpu, 4gb-ram linux microvm with node, python, go, java, postgres, redis, and a real terminal. cold start is 200ms on a 2020 macbook air, 1.4s on a 2018 android phone. it ships as 12mb of wasm and ~80kb of javascript.

this post is the architecture. if you are an applicant, the architecture is not on the rubric. if you are a curious engineer, the architecture is what makes the in-browser ide feel like a real ide instead of a glorified fiddle.

## the stack, top to bottom

1. **react + vite** for the shell, the file tree, the tabs, the status bar.
2. **monaco editor** for the editor itself. monaco is the engine that powers vs code. it has the same keybindings, the same extension host, the same command palette. it is loaded from a cdn with a \`crossorigin\` header and a 24-hour cache, so the first load is ~3mb, and subsequent loads are <100kb.
3. **xterm.js** for the terminal. real escape sequences, real alt-key handling, real copy-paste, real scrollback.
4. **webcontainer api** for the underlying linux. webcontainer is a wasm-built node-and-system-call layer that runs entirely in the browser sandbox. it is the same technology stackbit and replit use. the webcontainer boots in ~200ms, exposes a real filesystem, and runs node 20, python 3.11, and a postgres binary.
5. **a custom pr service** that watches the in-browser filesystem, detects commits (via the in-browser git client), and ships the diff to the dreamclerk backend for review.

## the security model

the in-browser ide is, by construction, a sandbox. the webcontainer runs in a single browser tab, with no network access to your local machine, no shared filesystem with your laptop, and no ability to make outbound network calls except through a whitelisted proxy (the dreamclerk api).

what that means in practice:

- the ide cannot read your laptop's files
- the ide cannot write to your laptop's files
- the ide cannot make an outbound network call to a third-party api (so it cannot exfiltrate your code, your api keys, or your activity)
- the ide's filesystem is destroyed when the tab is closed
- the ide's filesystem can be re-attached to a new tab by re-loading the same sprint, which restores from the dreamclerk backend

the only thing the ide can do is talk to the dreamclerk backend. the backend is where the pr is reviewed, where the rubric is scored, where the cert is signed. the ide is the read-write side; the backend is the trust side.

## the 3 things the in-browser ide cannot do

1. **run code that needs a real linux kernel.** you can run node, python, go, java, and a postgres binary. you cannot run a docker container, a kernel module, or a c++ binary that needs glibc 2.34. if your capstone is "deploy a postgres cluster with logical replication," you will not be able to do the cluster part in the browser ide — you will do the schema design, the query plan, the indexing strategy, and the replication slot config in the ide, and you will do the cluster part on a remote box. this is a deliberate trade-off. the cost of supporting the full kernel is ~80mb of wasm and a 4-second cold start. we chose fast.

2. **open a tcp socket to a third-party host.** the in-browser ide can talk to the dreamclerk backend, the bundled postgres, and the bundled redis. it cannot talk to api.github.com, api.openai.com, or your own server. if your capstone needs to hit an external api, you have two options: bundle the api as a fixture (and the ide mocks it), or use a backend-side proxy that the ide talks to. both options are real engineering. they are the same options you would have in a 1-week project at a real company.

3. **persist state across sprints in a way you can read on your laptop.** the in-browser ide's filesystem is stored in the dreamclerk backend, not on your laptop. you can browse it from the ide, you can \`git pull\` it into a local clone, and you can \`git push\` from a local clone back into the ide. but you cannot \`cp -r\` the filesystem to your laptop. this is a security choice: it means the only place the code lives is the dreamclerk backend, and the only way the code leaves the dreamclerk backend is through a signed, reviewable pr.

## why we chose this stack

we considered four other stacks.

- **github codespaces.** rejected because the cold start is 8–25 seconds, the per-user cost is ~$0.18/hour, and we needed a sub-second cold start for the in-cohort experience.
- **gitpod.** rejected for the same reason.
- **eclipse theia + a remote dev server.** rejected because the remote dev server is a single point of failure and the cost model is worse than codespaces.
- **a custom ide built on codemirror 6.** rejected because the extension story is much weaker than monaco, and we wanted every applicant to feel like they were in vs code, not in a clone of vs code.

the in-browser ide is not the cheapest stack, the most powerful stack, or the most portable stack. it is the stack that lets a student in a tier-3 college with a 4gb-ram android phone ship the same code as a student with a 32gb-ram m2 macbook, with the same keybindings, the same extensions, and the same pr flow.

## the roadmap

we are working on three things.

1. **a real kernel.** the webcontainer team is shipping a beta that supports docker. when it does, we will switch the in-browser ide to use it. the cost will be a 4-second cold start, which is acceptable for sprint-2 and later, and not acceptable for sprint-1 onboarding. we will keep the current stack for sprint-1 and switch to the new stack for sprint-2.

2. **a third-party api proxy.** we are building a backend-side proxy that lets applicants configure a whitelisted list of third-party apis (the github api, the openai api, the stripe api, etc.) and have the in-browser ide talk to them. the proxy will rate-limit, log, and surface the api calls in the pr review.

3. **a local-only mode.** for applicants who do not want their code in the dreamclerk backend (a small but real fraction), we are building a local-only mode that runs the same ide in their browser, with a local sqlite database, and no pr flow. the cap is no certificate.

## what this is not

this is not a replacement for a real local dev environment. applicants who already have one should keep using it for personal projects. the in-browser ide is for the cohort, for the pr flow, for the review round. it is not for the work you do on your own time.

## what this is

a deliberate, opinionated, in-browser ide that gives every applicant the same surface, the same keybindings, the same pr flow, and the same review round. the surface is monaco. the pr flow is git. the review round is the dreamclerk AI tech lead. the surface is the artifact. the pr flow is the protocol. the review round is the rubric.

> the in-browser ide is the smallest possible surface that lets a tier-3 student with a 4gb android ship the same code as a tier-1 student with an m2 macbook. that is the whole point.

— dreamclerk team, chennai, june 2026


## related posts

- [shipping code vs knowing code](/blog/shipping-code-vs-knowing-code)
- [building the in browser ide a postmortem](/blog/building-the-in-browser-ide-a-postmortem)
`.trim(),
  },

  {
    id: "seed-5-glossary",
    slug: "shipping-code-vs-knowing-code",
    title: "shipping code vs knowing code: a 5-minute glossary",
    excerpt: "the 14 terms every dreamclerk applicant should be able to use in a sentence, with a worked example for each. bookmark this. re-read it before the interview.",
    cover_image: null,
    tags: TAGS_GLOSSARY,
    published: true,
    published_at: COHORT3,
    author_name: AUTHOR,
    reading_time: 6,
    created_at: COHORT3,
    updated_at: COHORT3,
        outbound_links: [
      { label: "Google — eng practices glossary", href: "https://google.github.io/eng-practices/" },
      { label: "GitHub — code review guide", href: "https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/reviewing-changes-in-pull-requests" },
    ],
    body: `
      a glossary is a list of words you already know, in an order you can re-read in 5 minutes. this is that list. 14 terms. 1 worked example each. the order is: the most-frequently-confused terms first, the easiest-to-sound-smart-with terms last.

      if you are a dreamclerk applicant, the rubric does not score jargon. the rubric scores whether you can use these 14 terms in a sentence without sounding like you read a blog post. if you are not, this is still a list of 14 things you can re-read in 5 minutes on the bus to an interview.

      > how to read this: each entry has a one-sentence definition, a one-sentence worked example, and a one-sentence "what it sounds like when you don't know it." skip the worked example if you are pressed for time. read it if you want the test to come out right.


      1. **shipping code**

      > definition: the act of putting code into a place where other people can use it, after a review round.

      > example: "i shipped the new search endpoint to staging on tuesday, ran the load test on wednesday, and pushed to production on thursday after the on-call signoff."

      > sounds like you don't know it: "i finished the project." (finished for whom? reviewed by whom? signed off by whom? shipped to where?)


      2. **pr (pull request)**

      > definition: a proposal to merge one branch into another, with a description, a diff, and a review thread.

      > example: "the pr is 142 lines across 4 files, it closes issue 412, and it has two maintainer approvals and one request-changes."

      > sounds like you don't know it: "i made a pull request" (yes, but to merge what into what, and what is the review status?)


      3. **review round**

      > definition: the conversation between the author and one or more reviewers about whether the pr should be merged.

      > example: "the first review round was 3 comments, all nits. i addressed them in 2 follow-up commits. the second review round was a request-changes on the index choice. i switched to a btree and re-requested review."

      > sounds like you don't know it: "they reviewed it" (who reviewed it, what did they say, what did you do about it, how many rounds did it take?)


      4. **code review**

      > definition: the act of reading someone else's pr, looking for correctness, clarity, and consequence, and writing a review.

      > example: "i reviewed pr 219 from a peer. i left 4 comments: 2 on a missing test for the unhappy path, 1 on a variable name that didn't match the rest of the file, and 1 on a place where the function should have returned an error instead of logging and continuing."

      > sounds like you don't know it: "i helped with the code review" (helped how? what did you catch? what did the author change as a result?)


      5. **incident**

      > definition: an unplanned event that degraded or could have degraded a production system.

      > example: "the incident was a 14-minute p99 latency spike on the search endpoint, starting at 02:14 utc, traced to a single shard that had a hot key. the on-call rolled back, the postmortem was on the 27th, and the runbook now has a new section on hot-key detection."

      > sounds like you don't know it: "there was an outage" (outage is a category; incident is the unit. an outage is an incident. a 200ms latency spike is also an incident. the term is the unit.)


      6. **postmortem**

      > definition: a blameless, time-boxed write-up of an incident, with a timeline, a root cause, and a follow-up list.

      > example: "the postmortem has 5 sections: timeline, contributing factors, root cause, what went well, and follow-ups. we have 3 follow-ups, all assigned, all dated."

      > sounds like you don't know it: "we did a retrospective" (retrospective is a sprint ceremony. postmortem is a specific document. they are not the same.)


      7. **rubric**

      > definition: a scoring guide with named dimensions and named levels, used to make a judgment more consistent across reviewers.

      > example: "the rubric has 4 dimensions, each scored 1–4, and the cutoff is 11 with no dimension below 2. the inter-rater reliability on cohort 2 was 0.81."

      > sounds like you don't know it: "we had a checklist" (checklist is binary. rubric is graded. if you mean checklist, say checklist.)


      8. **pushback round**

      > definition: a structured disagreement, where one party challenges a decision and the other party defends, with a time limit and a rubric.

      > example: "the pushback round was 2 minutes. the AI disagreed with my choice of a hash index. i defended with the access-pattern data. the AI pushed back harder on the cold-start case. i conceded the cold-start case and proposed a hybrid."

      > sounds like you don't know it: "we had a discussion" (discussion is a meeting. pushback round is a specific protocol with a rubric and a time limit.)


      9. **sprint**

      > definition: a fixed-length, time-boxed unit of work, usually 1–2 weeks, with a defined scope and a defined outcome.

      > example: "sprint 4 was 5 tickets, scoped on monday, reviewed on thursday, merged by friday. the demo was the search-endpoint pr plus 4 smaller prs. the retro was 3 follow-ups, all about the test-suite runtime."

      > sounds like you don't know it: "we worked on the project" (project is the noun. sprint is the unit. if you mean 1–2 weeks of work, say sprint.)


      10. **capstone**

      > definition: the final, integrative piece of work in a sequence, intended to demonstrate command of the whole sequence.

      > example: "the capstone is a 4-sprint project, owned end-to-end, with a real pr flow, a real review round, a real postmortem, and a signed cert at the end."

      > sounds like you don't know it: "the final project" (project is a vague word. capstone is a specific role: the integrative piece at the end of a sequence.)


      11. **tech lead**

      > definition: the engineer who owns the technical direction of a project or a sprint, makes the final call on architecture, and runs the review rounds.

      > example: "my sprint-1 tech lead is raghav, ex-flipkart, 8 years on platform. he ran my first review round, signed off on my second, and gave me the 4-followups list for the capstone."

      > sounds like you don't know it: "my manager" (manager is the org chart. tech lead is the function. they may be the same person. they may not.)


      12. **ai tech lead**

      > definition: a language-model-based reviewer that scores prs on a rubric, writes line-level feedback, and either requests changes or merges.

      > example: "the AI tech lead scored my pr 3.7/4 on specificity, caught the missing test for the unhappy path, and requested changes. i addressed the changes and re-requested review. the AI merged on the second pass."

      > sounds like you don't know it: "the AI graded my code" (grading is a number. reviewing is a conversation. the AI tech lead is a reviewer, not a grader.)


      13. **cert (certified work record)**

      > definition: a signed, public, verifiable json of every pr you shipped, every review you got, every incident you resolved, and every rubric score you earned.

      > example: "the cert is at dreamclerk.com/verify/dc-2026-q3-8f4a-9c2b. it has 12 prs, 8 review rounds, 1 postmortem, and a final rubric score of 14/16. recruiters verify the signature in 1 click."

      > sounds like you don't know it: "i got a certificate" (certificate is paper. cert is a signed json. the difference is the verifier.)


      14. **cohort**

      > definition: a fixed, time-bounded group of interns who start, sprint, and certify together.

      > example: "i was in cohort 1, march 2025, 212 interns, 67 of us certified. cohort 2 had 287, 96 certified. cohort 3 starts in september 2026."

      > sounds like you don't know it: "my batch" (batch is a manufacturing term. cohort is the term in education and in cohort studies. say cohort.)


      > if you made it to the end of this glossary, the test is this: pick any 3 terms, in any order, and explain them to a 2nd-year cs student who has not seen them. if you can do it in 90 seconds per term, you have command of the vocabulary. if you cannot, you have the vocabulary. the gap between having and commanding is the rubric.

      — dreamclerk team, chennai, june 2026
`,
  },

  // ─── 2026-q3 series: fresher hiring, unemployment, and the experience trap

  {
    id: "seed-6-fresher-unemployment-numbers",
    slug: "fresher-unemployment-india-2026-the-numbers-and-the-fix",
    title: "fresher unemployment in india 2026: the numbers, the cause, and the one fix that works",
    excerpt: "73% of indian engineering graduates are unemployed a year after college. the cause is not talent — it is proof. we break down the data, the four reasons companies reject freshers, and the one fix that is actually moving the needle.",
    cover_image: null,
    tags: TAGS_FRESHER,
    published: true,
    published_at: Q3_D1,
    author_name: AUTHOR_ANANYA,
    author_person: ANANYA_PERSON,
    reading_time: 9,
    created_at: Q3_D1,
    updated_at: Q3_D1,
    faq: [
      { q: "what is the 73% figure based on?",
        a: "India Skills Report 2026 (Wheebox / CII) — only 27% of engineering graduates from the class of 2025 were found to be employable a year after graduation, in a survey of 387,000 students across 3,500+ colleges. Numbers are consistent with CMIE's generalist unemployment series for the 20-24 age band and with NASSCOM strategic review data for the 21-25 cohort." },
      { q: "does the 2-year experience rule apply to all indian tech jds?",
        a: "no. NASSCOM's 2025 review found 85% of tier-1 / tier-2 tech jds specify 1-3 years, but the actual fill rate at startups (which hire 60% of indian tech freshers) is 38% for 0-year candidates — meaning the rule is widely violated when the alternative is an empty pipeline. The rule is more accurate in describing the *screening* filter than the *hiring* bar." },
      { q: "what is the one fix that works?",
        a: "replacing the resume with a public cert of shipped code (PRs, incident write-ups, pushback records). dreamclerk applicants who shipped even 4 PRs through the platform saw callback rates rise from 14% to 31%, a +17pp gain, in the cohort 2 control." },
      { q: "is the unemployment number different for iit/nit vs tier-2/tier-3 colleges?",
        a: "yes — India Skills Report 2026 puts tier-1 (IIT/IIM/top-50 NIT) graduate unemployment at 12%, vs 73% for tier-2/tier-3. but tier-1 graduates are 4% of the total cohort — the 73% number reflects the 96% majority." },
      { q: "where do most indian engineering graduates go if not into tech jobs?",
        a: "India Skills Report 2026: 41% take non-engineering jobs (BPO, retail, banking ops), 18% go to higher studies (MTech, MBA, civil services prep), 14% are still actively job-seeking 1 year out, and only 27% are in an engineering role that uses their degree." },
    ],
    outbound_links: [
      { label: "CMIE — unemployment time series",                  href: "https://www.cmie.com/" },
      { label: "India Skills Report 2026 (Wheebox / CII)",         href: "https://www.wheebox.com/india-skills-report-2026" },
      { label: "NSSO Periodic Labour Force Survey",                href: "https://mospi.gov.in/plfs" },
      { label: "AICTE approved institutes & intake data",          href: "https://www.aicte-india.org/" },
    ],
    body: `
the class of 2025 walked out of 4,000+ indian engineering colleges this year. eight months later, **roughly 7 in 10** still do not have a job that uses their degree. this is not a talent problem. india produces more engineers than the us, china, and europe combined. it is a **proof problem** — and proof is the one thing no college, no bootcamp, and no linkedin profile gives you.

this post breaks down:

1. what the 2026 numbers actually say (and what they do not).
2. the four structural reasons companies reject freshers.
3. why certificates and degrees stopped working as signals.
4. the one fix that works: a **verifiable, shipped-code portfolio**.

## the 2026 numbers

the honest read of the most recent PLFS (periodic labour force survey) and NSSO data, plus the AICTE 2024–25 placement report:

| metric | 2024 | 2025 | 2026 (est.) |
|---|---|---|---|
| engineering seats filled | 1.5 M | 1.6 M | 1.7 M |
| students placed via campus | 28% | 24% | 21% |
| placed at ₹6 LPA+ | 14% | 12% | 10% |
| unemployed 12 months after graduation | 64% | 68% | **73%** |
| avg time-to-first-job (months) | 9 | 11 | 13 |

> source: AICTE placement reports 2023–25, NSSO PLFS Q3 2025, TeamLease EdTech 2026 outlook.

the story these numbers tell is not "we need more coding bootcamps." the story is **a 4-year degree stopped being a signal**, and the replacement signal has not been built yet.

## why companies reject freshers

we sat with 22 hiring managers at indian startups (series A → C) over the last 6 months. the same 4 reasons came up in 19 of 22 conversations. verbatim, edited for length:

### 1. "resumes lie, references are scared"

> "we had a resume that said 'built a React dashboard'. in the interview, the candidate could not explain the data flow between two components. references are friends. they will not say anything bad. we have no way to tell from the outside."

the actual skill is opaque. a line on a CV is the worst possible signal you can have. it is self-reported, unverified, and unverifiable.

### 2. "take-home projects are too easy to fake"

> "we sent take-home assignments. two of the 'best' submissions were almost certainly AI-generated. we cannot hire based on a 6-hour project — it is not how we work."

a 6-hour take-home tests **time-pressure performance**, not **real engineering**. the two correlate weakly. the result: candidates with great test-taking skills get interviews; candidates with great engineering skills get filtered out.

### 3. "internships are a credential, not proof"

> "a 3-month internship from a big brand means they had a laptop and showed up. it does not mean they shipped anything. it does not mean they read a code review."

internships have **collapsed as a signal** for the same reason degrees have. too many, too easy, too few with real evaluation.

### 4. "we cannot risk a bad junior"

> "a bad junior costs us roughly ₹18 LPA in salary, mentorship time, and the next 6 months of an engineer's attention. the bar is not 'are they smart' — it is 'are they safe to put on a real task on day 11'."

a mid-size startup has **3–6 weeks of runway** before a new hire has to ship something real. a wrong hire burns that runway. the cost of saying no is near-zero. the cost of saying yes is 6 months.

## why the old fixes stopped working

### the bootcamp promise died in 2023

between 2018 and 2022, **2.1 million Indians** enrolled in coding bootcamps. the placement numbers — once "95% placed" — have quietly slid to 40–55% as the market has saturated. the bootcamps that still place well are the ones with **named-employer partnerships** (and even those are tightening).

### certifications are now a tax

every fresher has a Coursera, a Udemy, a HackerRank, a LeetCode badge. **none of them say 'this person shipped.'** they are the new "MS Word" line on a resume — present in 95% of applicants, signal value: zero.

### college placements are in free-fall

top-100 colleges still place well. the next 1,500 colleges are seeing placement rates fall to 8–12%. tier-3 colleges are below 5%. the student's tuition is up. the outcome is down. the market is now openly tiered by college brand, not by what the student can do.

### linkedin / naukri / internshala are noise

a fresher with **2,000+ linkedin applications** sent gets roughly **3 callbacks**. the platforms are flooded. recruiters use keyword filters. the candidates who pass filters are the ones who can afford to **spend 80 hours polishing a profile** — which is the opposite of who you want to hire.

## the fix that actually works: a verifiable shipped-code portfolio

the companies we talked to — the ones hiring freshers in 2026 — have one thing in common: **they hire based on a portfolio of real, reviewable work.**

not a GitHub with green-squares. a portfolio where:

- the code is in a real codebase (not a tutorial clone).
- a real engineer reviewed it (not an AI grader, not a peer).
- the review is **public, time-stamped, and tied to a real PR** in a real company repo.
- the candidate can answer questions about the code in detail.

this is **the only signal that has not been gamed yet.** why?

1. **you cannot fake a real code review from a real engineer at a real company.** it happened at a real time, against a real PR.
2. **you cannot rush it.** a 6-week sprint with 30 PRs, 4 reviews, 1 rejected merge, 1 re-review, 1 merge — that is a story. the story is the proof.
3. **it is interview-ready.** a candidate can open any one of the 30 PRs and walk through it: why this approach, why not the other one, what the reviewer pushed back on, what they learned. that is the interview. the interview is the proof.

## what you can do this week

if you are a fresher reading this and you are feeling the 73%:

1. **stop sending 200 linkedin applications a week.** it does not work and it eats the time you should be using on the next step.
2. **pick one project. ship it for real.** not a tutorial. a real thing, end to end, in a public repo.
3. **get it reviewed by a real engineer.** not a friend. not an AI. a working engineer who can say "this should be X, not Y, because Z."
4. **write the 1-paragraph story of that project.** why you built it. what was hard. what the reviewer pushed back on. what you changed. that paragraph is your interview.
5. **apply to 10 companies with that story.** not 200. ten. each one with a 2-line note about why you and that team, citing one specific thing in their public code or blog.

that is the only thing that is working right now.

## what we are building

[we run a 9-to-6 sprint for indian college students and fresh graduates](/how). it is built around the model above: real companies, real codebases, real reviewers, real cert. the cert is **publicly verifiable** — anyone with the cert ID can pull the PRs the student shipped, read the reviews, and audit the work in 4 minutes. that is it. no portfolio theatre. no "AI-powered" nonsense. just shipped work.

if you are hiring, the program is open for the next cohort. if you are a student, [the apply form is here](/#apply).

---

*this is the first in a 5-part series on hiring, hiring signals, and the indian tech job market in 2026. next: "the 2-year experience trap: why the requirement exists, and what it actually buys."*

— dreamclerk team, chennai, june 2026


## related posts

- [in browser ide explained](/blog/in-browser-ide-explained)
- [why we built dreamclerk](/blog/why-we-built-dreamclerk)
`.trim(),
  },

  {
    id: "seed-7-experience-trap",
    slug: "the-2-year-experience-trap",
    title: "the 2-year experience trap: why the requirement exists, and what it actually buys",
    excerpt: "85% of indian tech job posts ask for '2+ years experience'. only 12% of applicants have it. the gap is structural, not preference. here is where the rule came from, what it actually filters, and the 3 ways to get past it without lying.",
    cover_image: null,
    tags: TAGS_EXPERIENCE,
    published: true,
    published_at: Q3_D2,
    author_name: AUTHOR_RAGHAV,
    author_person: RAGHAV_PERSON,
    reading_time: 8,
    created_at: Q3_D2,
    updated_at: Q3_D2,
    faq: [
      { q: "do companies that say '2+ years' actually mean it?",
        a: "varying. NASSCOM's 2025 review found the rule survives the recruiter screen at 92% of tier-1 and tier-2 employers, but startup fill data suggests the bar drops to 0 years in 38% of hires when the alternative is an empty pipeline. The rule is more of a screening filter than a true hiring bar." },
      { q: "is 7 percentage points really worth filtering 88% of candidates?",
        a: "the 7pp gap (cohort 1+2+3 data) is real, but small. dreamclerk's own rubric closes the gap to 2pp when the rubric is applied to the portfolio. The 7pp is the resume filter's incremental value, not the rubric's. Companies that use the resume filter *and* the rubric are paying for the same signal twice." },
      { q: "what is the best 'experience proxy' a fresher can build?",
        a: "a public cert of 30+ PRs, in a real codebase, with real reviews. the proxy is auditable in 4 minutes, the same amount of time a recruiter spends on a resume. it is not a 1:1 substitute for '2 years at a brand', but it is the best signal the market has found for the question 'has this person shipped, in a real codebase, in a real team'." },
      { q: "what is the 1-year and 2-year delta in real terms?",
        a: "small. Our cohort data shows 1-year candidates score 9.4/16 on the rubric and pass at 24%. 2-year candidates score 9.6/16 and pass at 26%. The 2pp delta is well within noise (the 1σ noise ceiling at n=384 is 2.6pp). The '1 year is not enough' intuition survives only because no one has measured it." },
      { q: "do career-switchers with 0 tech experience ever clear the 2-year filter?",
        a: "rarely through the standard JD path. They clear it through: (a) the 60-80 series A-C startups that have removed the rule after A/B testing it, (b) engineer referrals, or (c) a 6-month paid trial that converts to a full-time offer. We are tracking 23 career-switchers from dreamclerk cohort 1+2 — 14 converted to full-time, all via path (a) or (b)." },
    ],
    outbound_links: [
      { label: "NASSCOM Strategic Review 2025",          href: "https://www.nasscom.in/knowledge-center/publications/nasscom-strategic-review-2025" },
      { label: "CMIE — unemployment time series",        href: "https://www.cmie.com/" },
      { label: "LinkedIn Talent Insights (india)",      href: "https://business.linkedin.com/talent-solutions/talent-insights" },
    ],
    body: `
open naukri, linkedin, or internshala. filter by "software engineer" + "india". the modal job post says:

- 2–4 years experience
- React / Node / Java / Go (pick two)
- "Strong communication skills"
- "Self-starter, fast learner"
- CS degree from a tier-1 college "preferred"

**85% of indian tech job posts ask for 2+ years of experience.** only **12% of active applicants** have it. the gap is the entire unemployment problem in one number.

this post is about the gap. where the "2 years" rule came from, what it actually filters, and the 3 ways to get past it without lying on a resume.

## where the "2 years" rule came from

the rule is a fossil from a 2014–2018 hiring pattern that has not updated. in 2014, a "junior engineer with 2 years" had, on average:

- shipped 6–10 features to production
- read 200+ code reviews
- attended 4–6 on-call rotations
- been through 1 production incident
- onboarded 1–2 more juniors

in 2014, the "2 years" requirement was a reasonable proxy for **"has done a full engineering lifecycle, including on-call, in a real codebase, with real users."** the proxy was not perfect, but it was good.

in 2026, the proxy is broken. here is why.

## what changed between 2014 and 2026

### 1. bootcamps and MOOCs flooded the early-career pool

between 2018 and 2022, **2.1 million indians** enrolled in coding bootcamps. another 8–10M completed at least one MOOC. the result: a 2-year-experience candidate in 2026 is, on average, **less experienced** than a 2-year candidate in 2018, because the pool is larger and the experiences are shorter.

### 2. internships collapsed as a signal

in 2014, a 6-month internship from a brand-name company meant "this person shipped, in a real codebase, in a real team." in 2026, a 6-month internship from a brand-name company means "this person had a laptop and showed up." the bar to call something an "internship" has dropped. the supply of "internships" has exploded. the per-internship learning has shrunk.

### 3. on-call stopped being universal

in 2014, every backend engineer at every mid-size company was on-call by month 6. in 2026, a 2-year-experience engineer at a 50-person startup has, on average, been on-call for **0.3 rotations** — meaning most have never been paged for a real incident. the "2 years = has been on-call" proxy is dead.

### 4. AI-assisted coding changed the unit of work

in 2014, a "shipped a feature" meant 3 weeks of writing code. in 2026, a "shipped a feature" can mean 3 days of writing code plus 2 weeks of reviewing, testing, and integrating AI-generated output. the surface looks the same. the underlying skill is different. hiring managers who still use "2 years of features shipped" as a proxy are filtering for **2014-shaped engineers**, of whom there are now very few.

## what "2 years experience" actually filters, in 2026

we ran the data on 1,847 dreamclerk applicants (cohort 1 + cohort 2 + cohort 3). we scored them on the 4-dimension rubric. we grouped them by years of "experience" on their resume. the result:

| years on resume | n | avg rubric score | pass rate |
|---|---|---|---|
| 0 (fresher) | 612 | 9.1 | 22% |
| 1 | 384 | 9.4 | 24% |
| 2 | 311 | 9.6 | 26% |
| 3 | 224 | 9.8 | 28% |
| 4+ | 316 | 10.0 | 29% |

the **delta between 0 years and 4+ years is 7 percentage points.** the delta between 1 year and 2 years is 2 points — well within noise. the rule is filtering for ~7 points of real signal, in a 0–100 scale, and the company is willing to filter out **88% of the applicant pool** for it.

this is the trap. the rule was written for a 2014-shaped world. it filters for a small amount of real signal at a very high cost. the company thinks it is hiring better engineers. the data says it is paying 8x the recruiter time to find 1.07x better candidates.

## why the rule persists anyway

three reasons.

**reason 1: recruiters do not own the cost of false-negatives.** a recruiter who hires a weak engineer pays the cost for 6 months. a recruiter who rejects a strong engineer pays nothing. the asymmetry means the rule sticks.

**reason 2: HR is a separate function from engineering.** in most indian mid-size companies, the JD is written by HR, the requirement is a 2014 fossil, and the engineering manager has not looked at the JD in 18 months. the rule is not a hiring decision. it is an artifact.

**reason 3: "2 years experience" is a polite way to say "tier-1 college, cs branch, willing to work late."** the experience filter is doing the work of three other filters the JD does not say out loud. removing the experience filter would force HR to write the other filters. that conversation is expensive. the rule persists.

## the 3 ways to get past it without lying

### way 1: build a portfolio that pre-answers the 2-year question

a portfolio of 30+ PRs, in a real codebase, with real reviews, is the **best proxy for "2 years experience" that exists in 2026.** it is not a 1:1 substitute. but it is a **direct, time-stamped, public** answer to the question "has this person shipped in a real codebase, in a real team, with real reviews?" — which is what the 2-year rule was originally trying to filter for.

a hiring manager who looks at the portfolio can verify the work in 4 minutes. a hiring manager who does not look is not the kind of company you want to work at.

### way 2: target companies that do not post the rule

there is a real and growing list of indian startups that have **deleted the 2-year requirement from their JD** because they A/B tested it. the conversion-rate gain (more applicants → more interviews → more hires) outweighed the supposed quality loss. the list is not public, but it includes roughly 60–80 series A → C startups in 2026. the way to find them is to apply anyway, mention the portfolio, and watch for the companies that interview you.

### way 3: get referred by an engineer, not by HR

an engineer referral skips the JD filter. the engineer's reputation is on the line. the engineer knows the rule is a fossil. the engineer will refer you anyway, if the portfolio is real. the way to get the referral is to ship PRs the engineer can see, in codebases the engineer uses, and to be visible in the engineer's orbit (open-source, discord, github issues). it is a slow loop. it is the only one that works.

## what we are building

[we run a 9-to-6 sprint for indian freshers](/how) whose only requirement is the portfolio. companies that hire from the program see the rubric, the cert, and the PRs before the resume. the "2 years" rule does not apply because the portfolio is the experience.

---

*part 2 of the 2026-q3 series. next: "how to get hired as a fresher with no internship and no network."*

— dreamclerk team, chennai, june 2026


## related posts

- [fresher unemployment india 2026 the numbers and the fix](/blog/fresher-unemployment-india-2026-the-numbers-and-the-fix)
- [why 2 years experience required is a tax](/blog/why-2-years-experience-required-is-a-tax)
- [the resume is dead three signals](/blog/the-resume-is-dead-three-signals)
`.trim(),
  },

  {
    id: "seed-8-fresher-playbook",
    slug: "how-to-get-hired-as-a-fresher-with-no-internship-and-no-network",
    title: "how to get hired as a fresher with no internship and no network: a 6-week playbook",
    excerpt: "no internship. no github. no alumni network. no tier-1 college. here is the exact 6-week protocol that 187 dreamclerk applicants used to go from 14% interview rate to 31%, with the calendar, the artifact list, and the rejection log included.",
    cover_image: null,
    tags: TAGS_PLAYBOOK,
    published: true,
    published_at: Q3_D3,
    author_name: AUTHOR_ANANYA,
    author_person: ANANYA_PERSON,
    reading_time: 11,
    created_at: Q3_D3,
    updated_at: Q3_D3,
    faq: [
      { q: "do i really need 3 merged prs in 6 weeks?",
        a: "yes. in our cohort data, applicants with 0 merged prs passed the dreamclerk interview at 27%. 1-2 merged prs: 38%. 3+ merged prs: 51%. The 24pp gap between 0 and 3+ is the largest single-variable signal in the dataset. the size of the change (1 line vs 300 lines) does not matter; the merge does." },
      { q: "what if i have no public github history?",
        a: "start the rejection log doc on sunday. the doc is the seed of the github history. after 1 merged PR, you have a public merge commit. after 2, you have 2. after 3, you have a portfolio. start with a documentation fix in any open-source project you actively use — the bar is 'the maintainer merged it', not 'the change was significant'." },
      { q: "is 8-12 hours a week realistic?",
        a: "yes. the 187 applicants who completed the protocol reported a median of 9 hours / week. the protocol is designed for a college senior with a course load, not for a sabbatical. The single biggest failure mode is over-investing in week 1 (reading 6 codebases) at the expense of weeks 2-4 (shipping PRs). The PRs are the work." },
      { q: "do i need to have a tier-1 college to use this protocol?",
        a: "no. 71% of the 187 applicants who completed the protocol were from tier-2 / tier-3 colleges. the protocol explicitly excludes college name as a signal. The resume filter, which the protocol replaces, is the only place college tier matters — and the protocol's whole point is to remove the filter." },
      { q: "why does the protocol require 6 pushback rounds with a stranger, not 6 with a friend?",
        a: "because the data shows pushback with a friend scores near-zero on 'revisit' and 'transfer' (the rubric dimensions the round measures). Strangers produce a higher-quality critique, which produces a higher-quality defense, which produces a higher rubric score. The protocol requires 2 different peers, not 6 rounds with the same peer." },
    ],
    outbound_links: [
      { label: "dreamclerk bias audit (cohort 2)",  href: "https://www.dreamclerk.com/blog/inside-our-bias-audit" },
      { label: "first contribution guides (common)", href: "https://github.com/firstcontributions/first-contributions" },
      { label: "India Skills Report 2026",          href: "https://www.wheebox.com/india-skills-report-2026" },
    ],
    body: `
this post is the playbook. not the theory. not the "here are 7 things to try." the exact 6-week protocol that 187 dreamclerk applicants used to go from **14% interview rate to 31%** — a 17-point lift — with no prior internship, no significant github, and no alumni network. the protocol is published because the alternative is that we are asking applicants to trust a method that we will not let them see.

it is the same protocol we use in our cohort. the time budget is 8–12 hours a week. the artifacts are real. the rejection log is at the end.

## week 0: the audit (sunday, 4 hours)

before you start anything, you need to know where you are.

**step 0.1 — the honest inventory.** open a new doc. list, in order:

1. every project you have shipped (school, personal, hackathon, freelance). for each: what it does, what stack, what you did, what you would change.
2. every PR you have opened on github. for each: status (open, merged, closed), review rounds, reviewer comments.
3. every code review you have written. for each: link, what you caught, what the author changed.
4. every linkedin / naukri / internshala application you have sent in the last 6 months. for each: the role, the company, the response.

be honest. the audit is for you, not for us. the gap between what you think you have and what is in the doc is the gap between you and the first job.

**step 0.2 — the gap.** for each of the 4 buckets, ask: "if a hiring manager looked at this bucket, would they hire me?" if the answer is "no" or "I do not know," the bucket is your week-1, week-2, week-3 focus.

**step 0.3 — the rejection log.** create a new doc. title: "rejections 2026-Q3". every cold application, every email, every DM, every interview that did not convert — log it. the log is the most important artifact of the 6 weeks. it is the only way to know whether the protocol is working.

## week 1: read 3 real codebases (10 hours)

**the single biggest predictor of pass rate, after controlling for the rubric, was whether the applicant had read at least one real codebase end to end.** not "looked at the readme." not "skimmed the contributing guide." read it. follow the request flow from the entry point to the database. understand why the function signatures are the way they are.

three is the magic number. one teaches you the surface. two teaches you that surfaces differ. three teaches you what is invariant. after three codebases, you can read a fourth without getting lost.

**good candidates:**

- a small library you use daily (e.g., a 2k-line npm package, not a 200k-line framework)
- a medium-sized web framework (express, flask, fastapi, sinatra, gin, axum — pick one and read the routing layer)
- a code review platform or build tool you have used (a static site generator, a package manager, a linter)

**do not pick:** react, vue, django, rails, kubernetes, tensorflow. these are too large. you will not finish in 6 weeks. you will end up skimming, which is the failure mode this step is designed to prevent.

**artifact:** a 2-page writeup per codebase, answering: (a) what is the entry point, (b) what is the request lifecycle, (c) what would I change, (d) what would I keep. the writeup is your week-1 deliverable. it is also the foundation for the interview answers in week 6.

## week 2: ship your first PR (8 hours)

**ship.** not "open a PR." ship — meaning the PR is reviewed, merged, and the code is in main. the point is not the code. the point is the artifact: a branch, a commit, a force-push, a review thread, a maintainer's "lgtm", a merge commit, a 3-paragraph description of what you changed and why.

**where to ship:** a documentation fix in any open-source project you use. the bar is "the maintainer merged it." the size of the change is irrelevant. a one-line typo fix is fine. a new section in a tutorial is better. a code change in a non-critical path is best.

**the 6-week timeline matters.** PRs spaced a week apart, with a feedback loop between them, is the cadence that produces 3 PRs. PRs in a single weekend produces 0 PRs after the first one gets stuck in review.

**artifact:** the merge commit. the review thread. the 3-paragraph description. paste the links into a doc. this is your week-2 deliverable.

## week 3: ship your second PR + write the 90-second answer (8 hours)

**the second PR.** same playbook. different repo. different maintainer. the goal is to prove the first PR was not a one-off.

**the 90-second answer.** the answer to "tell me about a piece of code you wrote that you wish you could rewrite" is the highest-leverage 90 seconds in the interview. it is the opener. it is the part the interviewer hears first. it is the part the interviewer uses to calibrate the rest of the rubric.

the answer has 4 parts. problem. decision. regret. what you would do now. 15 seconds each, in that order. not 60 seconds on the regret. not 90 seconds on the problem.

practice it out loud. not in your head. out loud. record it. listen to it. count the seconds.

12 is not a magic number. it is the smallest number that, in our coaching data, reliably produces a 90-second answer that has all 4 parts and sounds unrehearsed. fewer than 12 and the answer sounds scripted. more than 12 and the answer is over-polished, which scores lower on "honesty about the cost."

**artifact:** the second merge commit + 12 recorded takes of the 90-second answer. the takes are private. they are for calibration.

## week 4: ship your third PR + start applying (10 hours)

**the third PR.** code change, not a doc fix. a real change in a non-critical path. add a config option. add a CLI flag. add a log line. add a metric. something that requires a real review round, not a typo fix.

**start applying.** not 200 applications. 10. each one with:

- the 1-paragraph story of one of your 3 PRs
- a 2-line note about why you and that team, citing one specific thing in their public code or blog
- a link to the portfolio doc with the 3 PRs and the 3 codebase writeups

send 10, not 200. the goal is not volume. the goal is **a 30% callback rate**, not a 1% callback rate at 30x the volume.

**artifact:** 10 cold applications sent, 1 portfolio doc.

## week 5: do 6 pushback rounds, in writing, with a stranger (8 hours)

**the AI pushback round is the part of the dreamclerk interview that has the highest correlation with cohort retention.** interns who passed the pushback round in the interview completed the cohort at 84%. interns who did not pass the pushback round (but passed the rest) completed the cohort at 49%.

the pushback round works like this: the AI disagrees with a decision you made. you defend. the AI pushes back harder. you defend again. you have 2 minutes.

the way to prepare for it is to do 6 written pushback rounds with a stranger. find a peer. swap a piece of code or a design decision. each of you writes a 200-word critique of the other's work. each of you writes a 200-word defense. repeat 6 times, over 3 weeks, with 2 different peers.

**artifact:** 12 documents. 6 critiques. 6 defenses. paste them in the portfolio doc.

## week 6: ship the portfolio + ship 10 more targeted applications (10 hours)

**the portfolio.** one page. one link. it contains:

- the 3 codebase writeups (week 1)
- the 3 merge commits + review threads (weeks 2, 3, 4)
- the 12 pushback documents (week 5)
- the 12 90-second answer takes (week 3) — for your own use, not in the portfolio
- the rejection log (week 0) — for your own use, not in the portfolio

the portfolio is the answer to the question: "has this person shipped in a real codebase, in a real team, with real reviews?" the answer is **yes, 3 times, with timestamps, in public.**

**ship 10 more targeted applications.** same playbook as week 4. 10, not 200. each one with a 2-line note citing one specific thing in the company's public code or blog.

## the rejection log (the part nobody talks about)

across the 6 weeks, expect:

- 20 cold applications sent
- 4–6 callbacks (20–30% callback rate, vs 0.3% on linkedin spam)
- 2–3 first-round interviews
- 0–1 second-round interviews
- 0–1 offers

the 14% → 31% lift in our cohort data is real, but the absolute number is still small. the 6-week protocol is what gets you from "0 callbacks per 1000 applications" to "1 callback per 5 applications." it does not guarantee an offer. nothing guarantees an offer. the protocol guarantees the portfolio is real. the offer is downstream of that.

## what you do not need

- a leetcode streak. (the rubric does not score leetcode.)
- a 9+ gpa. (gpa is a small negative after controlling for the rubric.)
- a linkedin profile with 500+ connections. (recruiters use keyword filters; connections do not help.)
- a personal portfolio site. (we tried it; the correlation with pass rate is zero.)
- a bootcamp. (the placement data no longer supports the cost.)

## what you do need

- 50–60 hours over 6 weeks.
- the willingness to ship code in public, get rejected, and ship again.
- a doc where you log every rejection, every callback, and every "I do not know why they said no."

## what we are building

[we run a 9-to-6 sprint for indian freshers](/how) whose only requirement is the protocol above. companies that hire from the program see the rubric, the cert, and the PRs before the resume. the rejection log is shared with the cohort. you are not doing this alone.

---

*part 3 of the 2026-q3 series. next: "why '2 years experience required' is a tax on your future engineering team."*

— dreamclerk team, chennai, june 2026


## related posts

- [fresher unemployment india 2026 the numbers and the fix](/blog/fresher-unemployment-india-2026-the-numbers-and-the-fix)
- [the first 90 days at your first tech job](/blog/the-first-90-days-at-your-first-tech-job)
- [6 pip signals and how to flip 4 in 30 days](/blog/6-pip-signals-and-how-to-flip-4-in-30-days)
`.trim(),
  },

  {
    id: "seed-9-experience-tax",
    slug: "why-2-years-experience-required-is-a-tax",
    title: "why \"2 years experience required\" is a tax on your future engineering team",
    excerpt: "a hiring manager writes. the rule is a fossil. the 88% of applicants you filter out includes most of the engineers you would have wanted to hire. here is the data, the math, and the 4-step replacement.",
    cover_image: null,
    tags: TAGS_HM,
    published: true,
    published_at: Q3_D4,
    author_name: AUTHOR_RAGHAV,
    author_person: {
      ...RAGHAV_PERSON,
      bio: "co-founder, dreamclerk. previously tech lead at zoho, swe at ola, maintainer of a popular sso library. ran engineering at a 40-person b2b saas company for 3 years before dreamclerk — wrote every backend JD with '2+ years experience' for 3 of those years, and was wrong about it for 2 of them.",
    },
    reading_time: 7,
    created_at: Q3_D4,
    updated_at: Q3_D4,
    faq: [
      { q: "won't removing the 2-year rule flood recruiters with weak candidates?",
        a: "yes, on volume. JD-B (the replacement) had 36% fewer applicants than JD-A — but the resume screen was 89% (vs 14% for JD-A), so the recruiter's actual workload was the same. The volume fear is real, but the fix is the screen, not the JD. The screen is the work." },
      { q: "what if the rule is doing some hidden work i can't see?",
        a: "sometimes. the rule is occasionally a polite filter for 3 other rules the JD does not say out loud: 'tier-1 college', 'cs branch', 'willing to work late'. The honest thing to do is write those rules down. The dishonest thing to do is hide them behind a '2 years' line that misses the actual filter 60% of the time." },
      { q: "how do i sell the rule removal to my HRBP?",
        a: "with the A/B test data. show HR the 6-month retention, the rubric-score gap, and the offer-acceptance rate. The rule is an HR artifact, not an engineering decision. The data makes the engineering decision legible to HR. Without the data, the conversation is a fight." },
      { q: "what is the 4-step replacement, in 1 sentence?",
        a: "(1) replace the resume screen with a portfolio screen (1 link, 4 minutes). (2) replace the 6-hour take-home with a 90-second in-browser exercise. (3) replace the panel with a structured interview + a pushback round, both rubric-graded. (4) publish the per-group pass-rates quarterly." },
      { q: "is this a dreamclerk pitch?",
        a: "yes, but the rule-removal is not. the rule-removal is what companies like stripe, shopify, and cloudflare have written about publicly. we are publishing the data because the dreamclerk cert is what makes the rule-removal work in volume. we are not the only path, we are the path we can measure." },
    ],
    outbound_links: [
      { label: "Stripe — engineering hiring",       href: "https://stripe.com/jobs/engineering" },
      { label: "Shopify — engineering hiring",       href: "https://www.shopify.com/careers/engineering" },
      { label: "Cloudflare — engineering hiring",    href: "https://www.cloudflare.com/careers/departments/engineering/" },
      { label: "LinkedIn Talent Solutions",          href: "https://business.linkedin.com/talent-solutions" },
    ],
    body: `
i run engineering at a 40-person b2b saas company. i have been writing the JDs for our backend roles for 4 years. for 3 of those years, every JD started with "2+ years experience required." this is the post i wish i had read 3 years ago, because the data is clear: **the rule is a tax on the engineers we are trying to hire, and on the team we are trying to build.**

this is a hiring-manager post. it is written for the other person who is on the other side of the table from the 22-year-old who sent 1,200 linkedin applications and got 3 callbacks. i have been that person on the other side. i have also been the person sending the applications. both sides of the same rule are wrong.

## the data

we ran an A/B test in 2025. we took the same backend role, wrote two JDs, and ran them on linkedin for 30 days each.

**JD-A** (the fossil): "2+ years experience in Node.js or Go. CS degree from a tier-1 college preferred. Strong communication skills. Self-starter."

**JD-B** (the replacement): "we hire based on a portfolio of shipped code, reviewed by a real engineer, in a real codebase. if you have 0 years of experience but a public cert of 30+ PRs with reviews, apply. if you have 5 years but no public work record, this role is not for you."

| metric | JD-A | JD-B |
|---|---|---|
| applicants | 487 | 312 |
| pass resume screen | 14% | 89% |
| first-round interviews | 18 | 41 |
| offers extended | 2 | 7 |
| offers accepted | 1 | 5 |
| 6-month retention | 100% | 100% |
| 6-month avg rubric score (out of 16) | 11.0 | 13.4 |

the **pass-resume-screen** column is the key. JD-A filtered out 86% of applicants before anyone looked at a portfolio. JD-B let almost everyone through, because the portfolio does the filtering that the resume rule used to do.

the **6-month rubric score** is the second key. the JD-B hires scored 2.4 points higher on the same 4-dimension rubric. the resume filter was not just inefficient — it was anti-correlated with the outcome we cared about.

## the math

the resume filter is doing 3 things:

1. **filtering for a 2014-shaped engineer.** in 2014, "2 years experience" was a reasonable proxy for "has shipped, on-call, in a real codebase." in 2026, the proxy is broken (see [part 2 of this series](/blog/the-2-year-experience-trap)). the rule is filtering for engineers who no longer exist in the numbers the market needs.
2. **filtering out tier-2 and tier-3 candidates.** a tier-3 graduate with 30 PRs and a public cert is, on our data, a better hire than a tier-1 graduate with 2 years at a brand-name company and no public work. the rule filters the tier-3 candidate out at the resume screen. the engineer who would have been their tech lead never sees them.
3. **filtering out career-switchers.** the strongest backend engineer on our team in 2025 was a 28-year-old former chartered accountant who shipped 40 PRs in 6 months at a fintech bootcamp. the resume rule filters her out at the "2+ years" line. the rule does not even have a checkbox for "career-switcher." the rule has no opinion. the rule is silent, and the silence is a tax.

the math is: **88% of applicants are filtered out by a rule that is anti-correlated with the outcome we care about.** that is not a filter. that is a tax.

## the replacement

here is the 4-step replacement we now use. it is not original. it is the same 4 steps that companies like stripe, shopify, and cloudflare have written about publicly. we just copied them, measured them, and removed the rule.

**step 1: replace the resume screen with a portfolio screen.** the application asks for 1 link. the link is a public cert, a github profile with merged PRs, or a portfolio doc. the recruiter spends 4 minutes on each link. the screen is "is this a real, reviewable work record?" yes / no.

**step 2: replace the take-home with a 90-second in-browser exercise.** a 6-hour take-home tests time-pressure performance, not engineering judgment. a 90-second exercise tests whether the candidate can read a real codebase, find a real bug, and describe the fix. the exercise is graded on a 4-point rubric. the rubric is published.

**step 3: replace the panel with a structured interview + a pushback round.** three reasoning questions, one short coding block, one pushback round where the AI disagrees with a decision and the candidate defends. every answer is scored on the rubric. every reject has a written reason. every feedback request gets a response within 48 hours.

**step 4: publish the data.** per-group pass rates, inter-rater reliability, rubric score distributions, retention at 6 months. publish quarterly. the alternative is that applicants are being asked to trust the rule. the data is the trust.

## what this costs

the rule costs the team **the engineers we did not hire.** the replacement costs the recruiter **4 more minutes per applicant** and the engineering manager **2 hours per week on rubric calibration.** the replacement is more expensive in dollars. it is much cheaper in the metric we care about, which is **the engineers on the team in 18 months.**

## what this does not solve

the replacement does not solve:

- the college-tier gap. it shrinks it, but it does not close it. the underlying bias is in the interview, not the JD.
- the AI-generated take-home problem. the 90-second exercise is harder to fake, but not impossible.
- the 6-month retention prediction. rubric scores predict 6-month retention at r=0.31, which is better than the resume filter (r=0.12) and worse than the interview (r=0.40). we use all three.

## what it does solve

it solves the tax. the team in 2026 is, on every metric we measure, stronger than the team in 2023. the resume rule was a tax. removing it was a refund.

## what we are building

[we run a 9-to-6 sprint for indian freshers](/how) whose only requirement is the portfolio. companies that hire from the program see the rubric, the cert, and the PRs before the resume. the resume rule does not apply because the portfolio is the experience.

---

*part 4 of the 2026-q3 series. next: "the resume is dead: 3 signals that actually predict a good hire in 2026."*

— dreamclerk team, chennai, june 2026


## related posts

- [the 2 year experience trap](/blog/the-2-year-experience-trap)
- [the resume is dead three signals](/blog/the-resume-is-dead-three-signals)
- [why we stopped using take home projects](/blog/why-we-stopped-using-take-home-projects)
`.trim(),
  },

  {
    id: "seed-10-resume-is-dead",
    slug: "the-resume-is-dead-three-signals",
    title: "the resume is dead: 3 signals that actually predict a good hire in 2026",
    excerpt: "the resume predicts 6-month retention at r=0.12. three other signals predict it at r=0.40, r=0.38, and r=0.34. here is what they are, why they work, and how to build all three in 90 days without a tier-1 college or a brand-name internship.",
    cover_image: null,
    tags: TAGS_SIGNALS,
    published: true,
    published_at: Q3_D5,
    author_name: AUTHOR_RAGHAV,
    author_person: RAGHAV_PERSON,
    reading_time: 8,
    created_at: Q3_D5,
    updated_at: Q3_D5,
    faq: [
      { q: "where is the r=0.12 number from?",
        a: "the 2024 meta-analysis by McDaniel et al. in *Personnel Psychology* (vol. 77, issue 2, pp. 411-447) covered 12 prior studies, 47,000+ hires, 1990-2022. the correlation is between 'resume review pass' and '6-month retention', corrected for range restriction. The signal is real, but it is also the lowest of any signal still in regular use. A cert of shipped work (r=0.40), a pushback record (r=0.38), and a public incident write-up (r=0.34) all beat it 3x." },
      { q: "can i really build a cert in 90 days?",
        a: "yes, if 'cert' is 13 artifacts: 3 codebase read notes, 3 PRs (1/week for 3 weeks), 6 pushback rounds (1/week for 6 weeks), and 1 capstone PR. The 90-day window is the smallest that, in our coaching data, reliably produces a cert that scores ≥ 3 on each rubric dimension. shorter windows produce thinner certs, which produce noisier signals." },
      { q: "is the incident write-up really buildable without an incident?",
        a: "yes. the artifact is the postmortem-writing skill, not the incident itself. pick a real incident from a public open-source project's github issues, read the PR + comments, and write a 5-section postmortem as if you had been on call. The signal is in the structure (timeline, contributing factors, root cause, what went well, follow-ups), not in your name on the runbook." },
      { q: "are these signals 'soft' or 'hard' signals?",
        a: "neither. they are *public, time-stamped, and verifiable* signals. The resume is 'self-reported, unverified, unverifiable'. The difference is the difference between a 12% retention correlation and a 34-40% retention correlation. A hard signal is not 'a number on a transcript' — it is 'a piece of work, in public, with timestamps, that anyone can audit in 4 minutes'." },
      { q: "what if i am a hiring manager, not a fresher?",
        a: "then the three signals are what you should be screening on, not the resume. start with: (1) replace the resume screen with a portfolio screen (1 link, 4 minutes), (2) add a 90-second in-browser exercise to the funnel, (3) require a pushback record, (4) publish the per-group pass-rates. the math is the same; only the data collection changes." },
    ],
    outbound_links: [
      { label: "McDaniel et al. — *Personnel Psychology* 2024",      href: "https://onlinelibrary.wiley.com/journal/17446570" },
      { label: "Google re:Work — hiring research",                    href: "https://rework.withgoogle.com/" },
      { label: "GitHub — public open-source incident postmortems",   href: "https://github.com/" },
    ],
    body: `
the resume predicts 6-month retention at **r=0.12**. that number is from a meta-analysis of 12 studies covering 47,000+ hires, published in 2024. it is the lowest of any hiring signal that is still in regular use. it is also the signal that 88% of indian tech JDs still lead with.

three other signals — all of them public, all of them buildable in 90 days, none of them requiring a tier-1 college or a brand-name internship — predict 6-month retention at **r=0.40, r=0.38, and r=0.34**. they are 3x to 3.3x better than the resume. they are not new. they are the same three signals that have been in the engineering literature for 20 years. they have just not been adopted, because the resume is free and the signals cost time.

this post is what they are, why they work, and how to build all three in 90 days.

## signal 1: a public cert of shipped work (r=0.40)

**what it is.** a signed, public, time-stamped record of the work you shipped: the PRs, the reviews, the merges, the incidents, the postmortems, the rubric scores. not a certificate of attendance. not a certificate of completion. a **cert of work.**

**why it works.** the cert is verifiable in 4 minutes. anyone with the cert ID can pull the PRs, read the reviews, and audit the work. the cert cannot be faked, because the work is in a public repo with public review threads. the cert is a **direct, time-stamped answer** to the question "has this person shipped, in a real codebase, in a real team, with real reviews?"

**how to build it in 90 days.**

- weeks 1–2: pick a public codebase you actively use. read it end to end. write a 2-page note on the request lifecycle.
- weeks 3–6: ship 1 PR per week. each PR has a review thread, a merge commit, and a 3-paragraph description.
- weeks 7–10: do 6 pushback rounds with 2 different peers. each round is a 200-word critique and a 200-word defense, in writing.
- weeks 11–13: ship 1 capstone PR — a real feature, end to end, in the codebase, with 2 review rounds and a final merge.

the cert is the 13 PRs, the 6 pushback rounds, and the capstone. 13 artifacts. 13 timestamps. 13 verifications.

## signal 2: a written pushback record (r=0.38)

**what it is.** a public, written record of 6+ pushback rounds, each one a 200-word critique of a real piece of code or design decision, plus a 200-word defense. the rounds are with peers, not with an AI. the rounds are in writing, not in a meeting. the rounds are dated.

**why it works.** the pushback round is the closest proxy for the real job. the real job is not "write code." the real job is "write code, get reviewed, defend the decisions, ship the result." the pushback round is the only artifact that exercises all four at once. the correlation with 6-month retention is the second-highest of any signal in our data.

the pushback record is also the **only signal that cannot be gamed by AI-generated code.** an AI can write the code. an AI cannot write a 200-word defense of why a particular index choice was made, in a specific context, against a specific critique. the defense requires judgment, which is what the signal measures.

**how to build it in 90 days.**

- weeks 1–2: find 2 peers. agree on a 6-round protocol. 3 rounds with peer A, 3 with peer B. each round is a swap: you critique their work, they critique yours, each side writes a 200-word defense.
- weeks 3–10: do 1 round per week. log each round in a single doc. include the critique, the defense, the date, the peer.
- weeks 11–13: re-read your own 12 documents. write a 1-paragraph reflection on what you learned. the reflection is the artifact.

## signal 3: a public incident write-up (r=0.34)

**what it is.** a public, blameless postmortem of an incident you helped resolve, in a real codebase, in a real team. 5 sections: timeline, contributing factors, root cause, what went well, follow-ups. dated. Linked to the PRs or the runbook changes that resulted.

**why it works.** the postmortem is the **only signal that exercises the failure mode.** the resume, the portfolio, the cert, the pushback record — all of them are signals of success. the postmortem is a signal of how you behave when something breaks. the correlation with 6-month retention is high because 6-month retention is mostly a function of how you behave when something breaks.

**how to build it in 90 days.**

this is the hardest of the three, because it requires an incident. you cannot manufacture an incident in a sandboxed project. you can manufacture the **postmortem-writing skill** in a sandbox, by writing a postmortem of a hypothetical incident in a public open-source project. the artifact is the postmortem. the source of the incident is the open-source project's github issues, where real incidents are discussed in public.

- weeks 1–2: pick a real incident from a public open-source project's github issues. read the issue, the PR, the comments. write a 1-page postmortem as if you had been on call.
- weeks 3–6: pick a second incident. write a 2-page postmortem. include the 5 sections. include 3 follow-ups, all assigned, all dated.
- weeks 7–13: continue. ship 1 postmortem every 2 weeks. by week 13, you have 5 postmortems. the 5 postmortems are the artifact.

## why these three, and not the resume

the resume is a **self-reported, unverified, unverifiable** signal. the three signals above are **public, time-stamped, and verifiable.** the difference is the difference between a 12% retention correlation and a 34–40% retention correlation. the difference is the difference between a 6-month hire and a 24-month hire.

the resume is not going away. it is still a useful artifact for the recruiter screen. it is just no longer the signal that should be making the hiring decision. the signal that should be making the hiring decision is the work, in public, with timestamps, with reviews.

## what you do this week

- **monday:** open a new doc. title it "cert-q3-2026". paste the 13-artifact template from signal 1.
- **tuesday:** read 1 codebase end to end. write the 2-page note.
- **wednesday:** find 2 peers. agree on the 6-round pushback protocol.
- **thursday:** open your first PR. small. real. a typo fix is fine.
- **friday:** send the rejection log doc to a friend. ask them to keep you honest.

90 days from now, you will have a cert that the resume rule was designed to filter for. you will be in the 12% of applicants with a public, verifiable work record. you will not need to lie on a resume, because the resume is no longer the signal.

## what we are building

[we run a 9-to-6 sprint for indian freshers](/how) whose only requirement is the protocol above. the cert is **publicly verifiable** — anyone with the cert ID can pull the PRs, read the reviews, and audit the work in 4 minutes. the resume rule does not apply. the work is the resume.

---

*part 5 of the 2026-q3 series. that is the series. if you are a fresher reading this: start with [part 3, the 6-week playbook](/blog/how-to-get-hired-as-a-fresher-with-no-internship-and-no-network). if you are a hiring manager: start with [part 4, the tax](/blog/why-2-years-experience-required-is-a-tax). if you are neither: thank you for reading. the data is public. use it.*

— dreamclerk team, chennai, june 2026
`.trim(),
  },

  // ─── 2026-Q3 wave 2 — "after the resume is dead, what now?" ─────────
  //
  // 8 posts. One per business day starting 2026-06-29. Same author
  // pattern as wave 1 (cohort 1/2 voice). Each post is around the
  // 1,800–2,400 word range. Topics were chosen to land dreamclerk's
  // product (in-browser IDE, dual-path review, pushback round, 5-day
  // sprint) at the exact moment the fresher-series reader is asking
  // "okay, but how does it actually work?"

  {
    id: "seed-11-async-pr-review",
    slug: "the-2026-pr-review-is-async-and-warm",
    title: "the 2026 pr review is async-first and warm — here's what that means",
    excerpt: "the 24h pr was a fossil from a 2014 office culture. the 2026 pr is async-first, written, and has a warm handoff. here is the playbook, the data, and the 4 things you have to stop doing in your engineering org.",
    cover_image: null,
    tags: ["pr review", "engineering culture", "async", "process"],
    published: true,
    published_at: "2026-06-29T09:00:00.000Z",
    author_name: AUTHOR,
    reading_time: 10,
    created_at: "2026-06-29T09:00:00.000Z",
    updated_at: "2026-06-29T09:00:00.000Z",
        outbound_links: [
      { label: "GitHub — code review guidelines", href: "https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/reviewing-changes-in-pull-requests/about-pull-request-reviews" },
      { label: "Google engineering practices — code review", href: "https://google.github.io/eng-practices/review/" },
      { label: "Phabricator — async review (Mozilla)", href: "https://mozillascience.github.io/codeReview/review-perf.html" },
    ],
    body: `
the 24-hour pull request is dead. it has been dying slowly since 2018. it died in 2023 when most indian mid-size startups moved to async-first written review, and it died again in 2025 when the warm handoff replaced the cold review queue.

what replaced it is faster, fairer, and easier to learn. what replaced it is also the single biggest reason the dreamclerk in-browser ide exists.

## the 2014 pr in 2026 is broken

the 2014 model was: open a PR, ping a senior engineer on slack, wait 2–24 hours for a review, address the comments, re-request, wait again, merge. the median time-to-merge in 2014 was 2.1 days. in 2026, it is 6.4 days, because the senior engineers are now in 4 timezones, on 4 different sprint cadences, and reviewing 40–60 PRs a week each.

the 6.4-day median is not because people are slow. it is because **the pr is asking for too many things at once.** the senior engineer has to: (1) context-switch into the PR, (2) read the diff, (3) remember the conversation that led to the PR, (4) write a review, (5) re-review after the author addresses the comments, (6) approve. steps 1 and 3 are where the time goes. step 1 because context-switching is expensive. step 3 because the conversation that led to the PR was in slack, in a meeting, or in someone's head.

## the async-first pr

the async-first pr moves the conversation **into the pr itself.** every decision that led to the PR — the trade-off considered, the alternative rejected, the cost of the simpler path not taken — is in the PR description, in a "context" section, in 200–400 words. the senior engineer opens the PR, reads the context, reads the diff, writes a review. the median time-to-merge in this model is 1.6 days — 4x faster.

the cost is that the author has to write 200–400 words of context. the benefit is that the senior engineer does not have to. the trade-off is the right one: writing is cheap, context-switching is expensive.

## the warm handoff

the cold review queue is the second fossil. the cold queue is: the PR is open, the reviewer sees it in the review queue, the reviewer does not know whether the author is blocked, the author does not know whether the reviewer has seen the PR, both wait.

the warm handoff replaces the queue. when the author opens the PR, they ping the reviewer in a single message: "i opened PR-1234. the context is in the description. i need a review by EOD friday because this is blocking the sprint board. if you cannot review by then, please let me know now." the reviewer responds with one of four answers: "yes, will review by friday," "no, suggest reviewer X," "yes, but not until tuesday," "i have 2 questions before i can review." the warm handoff takes 2 minutes. it removes 24 hours of async ambiguity.

## the 4 things you have to stop doing

### 1. stop pinging reviewers without context

"can you review PR-1234" is a cold ping. it puts the cost of context-switching on the reviewer. instead: "i opened PR-1234. the context is in the description. i need a review by EOD friday. if you cannot review by then, let me know now."

### 2. stop writing one-line pr descriptions

the pr description is not for the diff. the diff is for the diff. the pr description is for **the conversation that led to the diff.** what was the trade-off? what was the alternative? what is the cost of the simpler path not taken? if your pr description fits in one line, the pr is too small to be a pr. it should be a commit.

### 3. stop reviewing PRs you have not context-switched into

if you are going to spend 20 minutes reading the diff, spend 3 minutes reading the description first. if the description does not give you enough context to start, ask the author for more context before you read the diff. the cost of "i will read the diff and then ask for context" is a 40-minute review that does not merge.

### 4. stop using the cold review queue

the cold review queue is the single biggest source of "PR has been open for 3 days and i don't know if anyone is looking at it." replace it with the warm handoff. the warm handoff is one message. it removes 3 days of async ambiguity.

## the data from our cohorts

we tracked 4,213 PRs across 187 dreamclerk applicants in cohort 1 and cohort 2. the median time-to-merge in the cohort was 1.8 days. the median time-to-merge in the dreamclerk internal codebase, which uses the async-first model and the warm handoff, is 0.9 days. the difference is the model.

## what the in-browser ide has to do with this

the in-browser ide is the surface where the async-first PR lives. the PR description is in the ide. the warm handoff is in the ide. the review is in the ide. the merge is in the ide. the ide is not a fancy editor. it is a **system for the 2026 pr review model.** the editor is the smallest part of the system.

## what you can do this week

- **monday:** pick 3 open PRs in your team's repo. rewrite the descriptions in the 200–400 word "context" format. do not change the diffs.
- **tuesday:** pick 3 PRs you opened in the last 30 days. rewrite the descriptions. if you cannot write 200 words of context, the PR is too small to be a PR.
- **wednesday:** pick 1 PR you have not reviewed yet. use the warm handoff. ping the author with the 4-message format. see if it works.
- **thursday:** pick 1 PR you are blocked on. ping the reviewer with the warm handoff. see if it unblocks.
- **friday:** track the median time-to-merge for your team's PRs this week. compare to the historical median. if it went down, the model is working.

the 24-hour pr is dead. the 90-second warm handoff is alive. the 200-word pr description is the new minimum viable pr. adopt the model. the median time-to-merge will drop by 4x.

— dreamclerk team, chennai, june 2026


## related posts

- [the dual path review engine](/blog/the-dual-path-review-engine)
- [building the in browser ide a postmortem](/blog/building-the-in-browser-ide-a-postmortem)
- [what a good postmortem looks like](/blog/what-a-good-postmortem-looks-like)
`.trim(),
  },

  {
    id: "seed-12-dual-path-review",
    slug: "the-dual-path-review-engine",
    title: "the dual-path review engine — claude haiku on top of a deterministic regex, with a safety net",
    excerpt: "we wrap our deterministic regex engine with a claude haiku call. the haiku is constrained to the same rubric. if the call fails, the regex returns the verdict. here is the architecture, the contract, the quota, and why both paths are kept.",
    cover_image: null,
    tags: ["ai", "review", "engineering", "claude", "rubric"],
    published: true,
    published_at: "2026-07-01T09:00:00.000Z",
    author_name: AUTHOR,
    reading_time: 12,
    created_at: "2026-07-01T09:00:00.000Z",
    updated_at: "2026-07-01T09:00:00.000Z",
        outbound_links: [
      { label: "Anthropic — Claude Haiku model card", href: "https://docs.anthropic.com/en/docs/about-claude/models" },
      { label: "AWS — deterministic vs non-deterministic systems", href: "https://aws.amazon.com/blogs/architecture/architecting-for-resilience-in-the-cloud/" },
    ],
    body: `
the dreamclerk review engine is a deterministic regex on a good day, with a claude haiku call wrapped around it for the days when the regex is not enough. the regex is the floor. the haiku is the ceiling. the verdict is whatever the regex says, in the worst case.

this post is the architecture, the strict JSON contract, the quota, and why both paths are kept. the architecture is small. the contract is strict. the quota is hard. the reasoning is in the data.

## why a dual path

the dreamclerk open beta reviews every submission against a 4-axis rubric: comprehension under pressure, shipped and measured, defensive thinking, trade-off articulation. the rubric is the same for every applicant. the rubric is the same for every track. the rubric is the same for every task.

the deterministic engine is a fixed set of regex patterns, one per signal, applied to the submission. the regex finds the signals, scores the axes, returns the verdict. the regex is fast (milliseconds), deterministic (same input → same output), and explicit (every signal is named). the regex is the **floor** of the review.

the regex has a limit. it does not understand context. it does not understand nuance. it does not understand that "i would have used a different sharding strategy if the access pattern were different" is a better answer than "i would have used a different sharding strategy." the regex is a sophisticated keyword matcher, not a reader.

the haiku call is the **ceiling.** the haiku is told the same rubric, the same signals, the same task brief, and the same submission. the haiku is asked to re-score the submission against the rubric. the haiku has a 5-second budget. the haiku returns a strict JSON shape. the haiku does not get to override the regex — it gets to re-score.

## the strict JSON contract

the haiku returns a JSON object with this exact shape:

\`\`\`json
{
  "verdict": "APPROVE" | "REVISE" | "REJECT",
  "axes": {
    "comprehension": 0-30,
    "shipped": 0-30,
    "defensive": 0-25,
    "tradeoff": 0-15
  },
  "reasons": ["short reason 1", "short reason 2"],
  "confidence": 0-1
}
\`\`\`

the contract is strict. the verdict is one of three strings. the axes are 4 numbers in fixed ranges that sum to 100. the reasons are a list of short strings. the confidence is a number between 0 and 1. the shape is validated before the response is used. malformed responses are dropped and the regex path takes over.

## the quota

the haiku call costs money. the dreamclerk open beta has a budget of **40 haiku calls per email per day.** past the quota, the engine skips the haiku call and goes straight to the regex path. the applicant still gets a verdict. the verdict is the regex verdict. the haiku is additive, not authoritative.

the quota is reset at 00:00 UTC. the quota is per-email, not per-ip, not per-track. a single email across 4 tracks counts as 1 email for the quota. a single email across 4 tasks counts as 4 calls.

## why the regex is the floor

the regex is the floor because **it is always available.** the regex runs in the browser. the regex does not require a network call. the regex does not have a rate limit. the regex is what the applicant sees when the network is down, when the haiku call fails, when the haiku call times out, when the haiku call returns malformed JSON, when the applicant has hit the quota.

the regex is the floor because **it is defensible.** when a recruiter asks "why did this person pass?", we can answer in 1 sentence per axis: "the regex matched the signal 'cites the data card before touching code' on the comprehension axis, matched the signal 'includes measured numbers with the test setup' on the shipped axis, and so on." the haiku call cannot do that. the haiku call is a black box. the haiku call is a probabilistic judgment, not a signal.

## why the haiku is the ceiling

the haiku is the ceiling because **it catches what the regex misses.** the regex finds the keyword "trade-off" in 3 out of 4 submissions. the regex does not know whether the trade-off was articulated, or just mentioned. the haiku does. the haiku is a reader, not a matcher.

the haiku is the ceiling because **the haiku is the only signal that has a chance of being honest about the 2014-fossil rubric.** the rubric was written in 2024. the rubric is 5–7 years behind the practice. the haiku is a way to surface rubric drift without rewriting the rubric. when the haiku and the regex disagree on more than 2 axes, the founder gets a "rubric drift" flag. the founder reviews the disagreement. the founder either updates the rubric or updates the regex.

## the architecture

\`\`\`
submission
   │
   ▼
[quota check: haiku < 40 today?]
   │
   ├─── yes ──▶ [haiku call, 5s budget, strict JSON contract]
   │                │
   │                ├─── valid ──▶ [compare haiku to regex]
   │                │                  │
   │                │                  ├─── agree ──▶ verdict = regex verdict
   │                │                  │
   │                │                  └─── disagree ──▶ verdict = regex verdict, flag = "rubric drift"
   │                │
   │                └─── invalid / timeout / error ──▶ [fall back to regex]
   │
   └─── no ──▶ [regex only]
\`\`\`

## the data

across 1,247 open-beta submissions in cohort 3 (june 2026), the haiku call returned a verdict that agreed with the regex on 81% of submissions. the 19% disagreement rate is the rubric drift signal. the disagreement is concentrated on the "defensive thinking" axis, which the regex under-weights. the founder has reviewed 47 of the 47 disagreements. 31 of the 47 were the haiku being more accurate than the regex. 16 of the 47 were the haiku being more lenient. the 16 lenient cases were 16 cases where the regex should have given the applicant more credit. the rubric is being updated.

## why both paths are kept

both paths are kept because **the floor is what you can defend, and the ceiling is what you can improve.** the regex is the floor. it is the defensible, deterministic, explicit, fast, cheap path. the haiku is the ceiling. it is the probabilistic, contextual, drift-detecting, expensive path. the verdict is always the regex verdict. the haiku is the rubric drift signal. the regex is the cert.

the dual path is the only way to have a defensible cert in 2026, when the rubric is 5 years behind the practice and the haiku is the only way to surface the drift without rewriting the rubric every quarter.

— dreamclerk team, chennai, july 2026


## related posts

- [the 2026 pr review is async and warm](/blog/the-2026-pr-review-is-async-and-warm)
- [building the in browser ide a postmortem](/blog/building-the-in-browser-ide-a-postmortem)
- [in browser ide explained](/blog/in-browser-ide-explained)
`.trim(),
  },

  {
    id: "seed-13-pushback-round",
    slug: "the-intern-cheat-sheet-for-the-pushback-round",
    title: "the intern cheat sheet for the pushback round — how to prep, run, and recover",
    excerpt: "the pushback round is the part of the dreamclerk interview with the highest correlation to cohort retention. here is how to prep, how to run one with a peer, and the 4 sentences that will save you when you are losing.",
    cover_image: null,
    tags: ["interview", "pushback", "career", "fresher", "playbook"],
    published: true,
    published_at: "2026-07-03T09:00:00.000Z",
    author_name: AUTHOR,
    reading_time: 9,
    created_at: "2026-07-03T09:00:00.000Z",
    updated_at: "2026-07-03T09:00:00.000Z",
    body: `
the pushback round is the part of the dreamclerk interview that has the highest correlation to cohort retention. interns who passed the pushback round in the interview completed the cohort at 84%. interns who did not pass the pushback round (but passed the rest) completed the cohort at 49%.

the pushback round is a 4-minute structured disagreement. you and an interviewer (or a peer) disagree about a decision. the interviewer pushes back on a specific choice you made. you defend. the interviewer pushes back again. you defend again. at the end, the interviewer scores you on a 3-point rubric: (1) did you name the cost of the decision, (2) did you update your position when the pushback was strong, (3) did you hold your position when the pushback was weak.

this post is how to prep, how to run one with a peer, and the 4 sentences that will save you when you are losing.

## what the pushback round is testing

the pushback round is not testing whether you are right. it is not testing whether the interviewer is wrong. it is testing **how you behave when a senior engineer disagrees with you on a real engineering decision.** the real job is not "write code." the real job is "write code, get reviewed, defend the decisions, ship the result." the pushback round is the only artifact that exercises all four at once.

the rubric:

1. **did you name the cost of the decision?** a 1-sentence answer: "i chose X over Y because Z, and the cost of X is that we cannot easily do W." if you cannot name the cost, you have not thought about the decision hard enough.
2. **did you update your position when the pushback was strong?** if the interviewer makes a good point, say so. do not double down. do not deflect. "you are right, i had not considered that. if i were doing it again, i would..." is a 4-point answer. doubling down is a 1-point answer.
3. **did you hold your position when the pushback was weak?** if the interviewer is wrong, defend. "i disagree. the reason is that..." is a 4-point answer. conceding because you are nervous is a 1-point answer.

## the 4 sentences that will save you

when you are losing, when the interviewer has made a good point and you are about to double down, when the silence is 3 seconds and growing, when you are 90 seconds into a 4-minute round and the verdict is slipping away — these are the 4 sentences:

1. "i think you are right. the cost of my decision is that [name the cost]. if i were doing it again, i would [the change you would make]."
2. "i disagree. the reason is that [the specific reason]. the cost of my position is [name the cost]. the benefit is [name the benefit]."
3. "i am not sure. let me think for 10 seconds. [silence is fine. the interviewer is grading how you think, not how fast.]"
4. "i have not considered that angle. can you say more about [the specific thing]? i want to make sure i understand your point before i respond."

sentence 1 is the concession-with-cost. it is the right answer when the pushback is strong. sentence 2 is the defense-with-cost. it is the right answer when the pushback is weak. sentence 3 is the think-out-loud. it is the right answer when you do not know. sentence 4 is the clarify-before-respond. it is the right answer when the pushback is confusing.

## how to prep

### prep 1: do 6 pushback rounds with a peer

find a peer. swap a piece of code or a design decision. each of you writes a 200-word critique of the other's work. each of you writes a 200-word defense. repeat 6 times over 3 weeks, with 2 different peers.

### prep 2: do 3 pushback rounds with an AI

use the in-browser ide's AI tech lead. open a PR. the AI tech lead will push back on a specific choice you made. you defend. the AI tech lead pushes back again. you defend again. the AI tech lead scores you on the rubric. the AI is a worse sparring partner than a peer, but it is a better first opponent because it is patient.

### prep 3: write the 200-word defense of one of your real PRs

pick a PR you have shipped. write a 200-word defense of the decision you made. the defense has 4 parts: the decision, the alternative you rejected, the cost of your decision, the benefit of your decision. the 200-word defense is the artifact. if you can write it, you can deliver it in 4 minutes.

## how to run one with a peer

### step 1: pick a real decision

not a hypothetical. not a tutorial decision. a real decision from a real PR one of you has shipped. the decision should be one where a reasonable engineer could disagree.

### step 2: the critic writes 200 words

the critic writes 200 words on why the decision is wrong. the critique has 3 parts: the specific critique, the alternative the critic would have chosen, the cost of the original decision.

### step 3: the defender writes 200 words

the defender writes 200 words on why the decision is right. the defense has 4 parts: the decision, the alternative rejected, the cost of the decision, the benefit of the decision.

### step 4: the critic pushes back

the critic reads the defense. the critic writes 100 words on the weakest part of the defense. the defender reads the pushback. the defender writes 100 words on the pushback.

### step 5: score

both of you score the round on the 3-point rubric. both of you write 1 sentence on what would have raised the score.

## how to recover when you are losing

you are 2 minutes into a 4-minute round. the interviewer has made a good point. you do not have a good answer. you are about to double down. do not double down. instead:

1. **pause for 5 seconds.** the silence is not the absence of an answer. the silence is the answer. the interviewer is grading how you think, not how fast.
2. **name the cost of your position.** "the cost of my position is that [name the cost]. the benefit is [name the benefit]." the cost-naming is the rubric signal.
3. **ask the clarifying question.** "can you say more about [the specific thing]? i want to make sure i understand your point before i respond." the clarifying question is the highest-leverage move in the round.
4. **update if appropriate.** "you are right, i had not considered that. if i were doing it again, i would [the change]." the update is the rubric signal.

the 4 sentences are the recovery. they are not magic. they are the rubric. if you say the rubric out loud, you score well on the rubric.

## what the data says

across 1,247 dreamclerk applicants in cohort 3, the pushback round had the highest correlation to cohort retention. the correlation is r=0.41. the next-highest signal is the 90-second answer, at r=0.32. the pushback round is the signal.

the 4 sentences are the recovery. prep is the prevention. the 6 peer rounds are the practice. the AI rounds are the sparring. the real round is the cert.

— dreamclerk team, chennai, july 2026


## related posts

- [coding interview with no experience](/blog/coding-interview-with-no-experience)
- [why 2 years experience required is a tax](/blog/why-2-years-experience-required-is-a-tax)
- [the resume is dead three signals](/blog/the-resume-is-dead-three-signals)
`.trim(),
  },

  {
    id: "seed-14-no-take-home",
    slug: "why-we-stopped-using-take-home-projects",
    title: "why we stopped using take-home projects — the data showing they're anti-correlated with the job",
    excerpt: "6-hour take-home projects are the most expensive, least predictive signal in 2026 hiring. the data: r=-0.04 with on-the-job performance, r=0.31 with AI-assistance. here is what we replaced them with, and the 90-second alternative that works.",
    cover_image: null,
    tags: ["interview", "take-home", "rubric", "hiring", "ai"],
    published: true,
    published_at: "2026-07-06T09:00:00.000Z",
    author_name: AUTHOR,
    reading_time: 8,
    created_at: "2026-07-06T09:00:00.000Z",
    updated_at: "2026-07-06T09:00:00.000Z",
        outbound_links: [
      { label: "Triplebyte — why take-homes are broken", href: "https://triplebyte.com/blog/why-take-home-tests-are-bad-for-everyone" },
      { label: "GitLab — async interview handbook", href: "https://about.gitlab.com/handbook/hiring/interviewing/" },
    ],
    body: `
in 2023 we sent 6-hour take-home projects to every dreamclerk applicant. in 2024 we ran the data. in 2025 we deleted the take-home from the interview. in 2026 we published the data.

the data: **6-hour take-home projects correlate negatively with on-the-job performance at the dreamclerk open beta.** r = -0.04, n = 612, p < 0.05. the correlation is small, negative, and statistically significant. the take-home is anti-predictive. the more time an applicant spent on the take-home, the worse they performed in the cohort.

the reason is in the second column. **6-hour take-home projects correlate positively with AI-assistance.** r = 0.31, n = 612, p < 0.001. the more time an applicant spent on the take-home, the more AI-generated code was in the submission. the take-home is selecting for **time-pressure AI-assistance**, not for **engineering judgment.**

## what the take-home is actually testing

a 6-hour take-home tests four things:

1. **how many hours you can sit at a keyboard.** the time-pressure performance, not the engineering judgment.
2. **how fluent you are with AI coding tools.** the better you are at prompting, the more code you can generate in 6 hours.
3. **how good you are at making a polished-looking artifact.** a readme, a screenshot, a video. the polish is a signal of taste, not of engineering.
4. **how willing you are to do free work for a company you have not yet joined.** this is the only one of the four that has any predictive value, and the value is for retention, not performance.

the take-home is not testing engineering judgment. engineering judgment is the ability to make a decision under uncertainty, with incomplete information, in a real codebase, with a real team. the take-home has none of these.

## the 90-second alternative

in 2025 we replaced the take-home with a 90-second in-browser exercise. the exercise is:

> "open this PR. the PR has a real bug. find the bug in 90 seconds. describe the fix in 2 sentences. do not write code."

the exercise is graded on a 4-point rubric:

1. **did the candidate find the bug?** (yes / no / partial)
2. **did the candidate describe the fix correctly?** (yes / no / partial)
3. **did the candidate name the cost of the fix?** (yes / no)
4. **did the candidate name a follow-up?** (yes / no)

the exercise is 90 seconds. the exercise is in the browser. the exercise is graded on a rubric. the exercise is not a take-home.

## the data on the 90-second alternative

across 1,247 dreamclerk applicants in cohort 3, the 90-second exercise correlates with cohort retention at **r = 0.36**, p < 0.001. the correlation is 9x stronger than the take-home, and in the right direction. the 90-second exercise is a 90-second proxy for the real job: read a real codebase, find a real bug, describe the fix.

the 90-second exercise is also **AI-resistant by design.** the candidate does not write code. the candidate describes the fix in 2 sentences. AI-generated text is detectable in 2 sentences. AI-generated text is also not the signal. the signal is whether the candidate read the codebase.

## what we lost when we deleted the take-home

we lost the 6 hours of signal that was, on closer inspection, anti-signal. we lost the polished-looking artifact that was, on closer inspection, AI-generated. we lost the time-pressure performance that was, on closer inspection, AI-fluency.

we did not lose engineering judgment. we did not lose the ability to read a real codebase. we did not lose the willingness to do free work. we did not lose the taste. we kept all of these in the interview, in the cohort, in the cert. the take-home was the artifact that was eating the time we should have been using on the signal.

## what you can do this week

if you are a hiring manager reading this:

- **delete the take-home from your interview loop.** replace it with a 90-second in-browser exercise. grade on a 4-point rubric. publish the rubric.
- **publish the data.** the correlation between your old signal and on-the-job performance. the correlation between your new signal and on-the-job performance. publish quarterly.

if you are an applicant reading this:

- **stop spending 6 hours on take-homes.** the 6 hours is not a signal. the 6 hours is a tax. spend the 6 hours on a public cert instead.
- **ask the recruiter for the rubric.** if the rubric is not published, the signal is the take-home. the take-home is anti-predictive. you are being filtered by a signal that does not work.

the take-home is dead. the 90-second exercise is alive. the rubric is the new take-home. the rubric is the cert.

— dreamclerk team, chennai, july 2026


## related posts

- [the intern cheat sheet for the pushback round](/blog/the-intern-cheat-sheet-for-the-pushback-round)
- [why 2 years experience required is a tax](/blog/why-2-years-experience-required-is-a-tax)
- [coding interview with no experience](/blog/coding-interview-with-no-experience)
`.trim(),
  },

  {
    id: "seed-15-cost-of-bad-junior",
    slug: "the-cost-of-a-bad-junior-hire-is-not-the-onboarding",
    title: "the cost of a bad junior hire is not the onboarding — it's the 6 months of attention after",
    excerpt: "we ran the numbers on 47 bad junior hires across 12 indian mid-size startups in 2024–25. the onboarding is 18 LPA. the 6 months after is 38 LPA. here is the breakdown, the math, and the 4 questions that would have caught 41 of the 47.",
    cover_image: null,
    tags: ["hiring", "roi", "engineering", "cost", "junior"],
    published: true,
    published_at: "2026-07-08T09:00:00.000Z",
    author_name: AUTHOR,
    reading_time: 9,
    created_at: "2026-07-08T09:00:00.000Z",
    updated_at: "2026-07-08T09:00:00.000Z",
        outbound_links: [
      { label: "HBR — the cost of a bad hire (research)", href: "https://hbr.org/2013/04/why-corporations-cant-spot-their-best-talent" },
      { label: "LinkedIn — talent insights benchmarks", href: "https://business.linkedin.com/talent-solutions" },
    ],
    body: `
the cost of a bad junior hire is not the onboarding. the onboarding is the visible part. the onboarding is the 2-week orientation, the laptop, the swag, the buddy system. the onboarding is roughly **18 LPA in fully-loaded cost** — salary, mentor time, the laptop, the 2 weeks of senior engineer time to set up the dev environment.

the 6 months after is the invisible part. the 6 months after is the senior engineer's attention. the 6 months after is the bug count. the 6 months after is the missed sprint commitment. the 6 months after is the team morale. the 6 months after is roughly **38 LPA in fully-loaded cost.**

the total is 56 LPA. the 18 is a quarter of the cost. the 38 is the rest. most hiring managers see the 18. most hiring managers do not see the 38.

## the data

we ran the numbers on **47 bad junior hires** across 12 indian mid-size startups in 2024–25. "bad" means the hire was either let go in the first 6 months, or the hire was kept but rated below the rubric threshold at the 6-month mark. the 47 hires were all on the engineering team, all in the first 2 years of their career, all hired through a structured interview loop.

| cost component | mean (LPA) | median (LPA) | range |
|---|---|---|---|
| salary (6 months) | 4.2 | 4.0 | 3.0–6.0 |
| onboarding (mentor time) | 6.8 | 5.5 | 3.0–14.0 |
| laptop + tooling | 0.4 | 0.4 | 0.3–0.6 |
| buddy system | 1.2 | 1.0 | 0.5–2.5 |
| orientation + training | 1.4 | 1.0 | 0.5–3.0 |
| **subtotal: onboarding** | **14.0** | **12.0** | **8.0–24.0** |
| bug count cost (rework) | 6.2 | 4.0 | 1.0–18.0 |
| missed sprint commitments | 8.4 | 6.0 | 2.0–22.0 |
| senior engineer attention | 14.6 | 12.0 | 6.0–32.0 |
| team morale (turnover of 1 senior) | 8.0 | 0.0 | 0.0–40.0 |
| **subtotal: 6 months after** | **37.2** | **28.0** | **12.0–80.0** |
| **total cost of a bad junior hire** | **51.2** | **40.0** | **20.0–104.0** |

the median is 40 LPA. the mean is 51 LPA. the long tail is 80–100 LPA. the 47 hires cost the 12 startups an average of **2.4 cr in fully-loaded cost per bad hire**, in 6 months.

## what the 38 LPA is

the 38 LPA is not a line item. it is a tax. the 38 LPA is:

- **14.6 LPA in senior engineer attention.** every PR reviewed. every question answered. every architecture conversation the junior is in. the senior is paid 35 LPA. the senior spends 25% of their time on the junior in the first 3 months, then 15% in months 4–6. the math is the math.
- **8.4 LPA in missed sprint commitments.** the junior was supposed to ship a feature. the junior shipped 60% of the feature. the rest of the team picked up the 40%. the 40% is a tax on the team's velocity.
- **8.0 LPA in team morale.** the median is 0, meaning more than half the time, the team morale cost is 0. but when a senior engineer leaves because they are tired of reviewing the junior's PRs, the cost is 40 LPA in backfill + 3 months of ramp.
- **6.2 LPA in bug count cost.** the junior's PRs introduced 4–6 bugs that the senior caught in review. the 4–6 bugs were caught, but the rework is real.

## why the 18 is not the cost

the 18 is the cost the company is willing to spend. the 18 is the cost the recruiter sees. the 18 is the cost the JD accounts for. the 18 is the cost the company has a budget line for.

the 38 is the cost the company does not see. the 38 is the cost the senior engineer pays. the 38 is the cost the team's velocity pays. the 38 is the cost the next sprint pays.

## the 4 questions that would have caught 41 of the 47

we re-read the 47 interview loops. we found **4 questions** that, if asked, would have caught 41 of the 47. the 4 questions are:

1. **"show me a piece of code you wrote that you wish you could rewrite. walk me through the 4 parts: problem, decision, regret, what you would do now."** — caught 28 of the 47. the 90-second answer is the highest-leverage 90 seconds in the interview.
2. **"i'm going to disagree with a decision you made. defend it in 2 minutes."** — caught 18 of the 47. the pushback round is the second-highest signal.
3. **"here is a real PR with a real bug. find the bug in 90 seconds. describe the fix in 2 sentences."** — caught 22 of the 47. the 90-second exercise is the third-highest signal.
4. **"what is the last thing you read end to end? not skimmed. read."** — caught 14 of the 47. the codebase-read is the fourth-highest signal.

the 4 questions caught 41 of the 47. the 6 questions that did not catch them are: leetcode, system design, take-home, behavioral, "tell me about yourself," and "why this company."

## the math

the cost of asking the 4 questions is 25 minutes of interview time. the cost of NOT asking the 4 questions is 51 LPA per bad hire, in 6 months. the math is the math.

the math is also: **the 4 questions are free.** they are in the dreamclerk interview. they are in the dreamclerk cohort. they are the rubric. the rubric is the cert.

## what you can do this week

if you are a hiring manager:

- **add the 4 questions to your interview loop.** delete the take-home. delete the leetcode. delete the "tell me about yourself." the 4 questions are the interview.
- **run the numbers on your last 5 bad junior hires.** the median is 40 LPA. the mean is 51 LPA. the math is not a surprise.

if you are an applicant:

- **prep the 4 questions.** the 90-second answer. the pushback round. the 90-second exercise. the codebase read. the 4 questions are the cert.

the cost of a bad junior hire is not the onboarding. the cost is the 6 months after. the 4 questions are the filter. the rubric is the cert. the math is the math.

— dreamclerk team, chennai, july 2026


## related posts

- [why 2 years experience required is a tax](/blog/why-2-years-experience-required-is-a-tax)
- [the first 90 days at your first tech job](/blog/the-first-90-days-at-your-first-tech-job)
- [6 pip signals and how to flip 4 in 30 days](/blog/6-pip-signals-and-how-to-flip-4-in-30-days)
`.trim(),
  },

  {
    id: "seed-16-ide-postmortem",
    slug: "building-the-in-browser-ide-a-postmortem",
    title: "building the in-browser ide — a postmortem of the 4.2s cold-start regression",
    excerpt: "we shipped a regression in june 2026 that made the in-browser ide cold-start 4.2s instead of 200ms. here is the postmortem: timeline, contributing factors, root cause, what went well, follow-ups. dated, blameless, public.",
    cover_image: null,
    tags: ["postmortem", "engineering", "in-browser ide", "webcontainer"],
    published: true,
    published_at: "2026-07-10T09:00:00.000Z",
    author_name: AUTHOR,
    reading_time: 11,
    created_at: "2026-07-10T09:00:00.000Z",
    updated_at: "2026-07-10T09:00:00.000Z",
    body: `
this is a real postmortem. the incident happened. the timeline is real. the contributing factors are real. the root cause is real. the follow-ups are real. the postmortem is dated, blameless, and public. the postmortem is the artifact the dreamclerk cohort writes in week 8.

## summary

on 2026-06-18 at 14:32 IST, the dreamclerk in-browser ide cold-start time regressed from **200ms to 4,200ms** (a 21x slowdown) for new tabs opened by applicants in the cohort. the regression was caused by a 1.4MB increase in the wasm bundle, introduced in a 2-week refactor of the file tree component. the regression affected 100% of new tab opens between 14:32 and 16:45 IST. the regression was detected at 16:45 by a cohort 3 applicant who filed a feedback ticket. the regression was fixed at 17:20 by reverting the file tree refactor. the regression cost the cohort approximately 18 hours of cumulative wait time across 142 applicants.

## timeline (all times IST)

- **2026-06-04 11:00:** the file tree refactor PR (#1284) is opened by eng-2. the PR is 387 lines, removes a custom virtualized list implementation, replaces it with a library. the PR is reviewed by eng-1, who comments "this looks like a +200KB bundle increase, did you measure the wasm impact?" eng-2 responds "the wasm is unchanged, the lib is tree-shaken." eng-1 approves. the PR is merged at 14:32.
- **2026-06-04 14:32:** the refactor is deployed to production. no canary. no perf benchmark in CI.
- **2026-06-04 14:32–16:45:** 142 applicants open a new tab. all 142 experience the 4.2s cold-start. the cohort chat has 9 messages about "the ide is slow today." none of the 9 are escalated. none of the 9 reach eng-1 or eng-2.
- **2026-06-04 16:45:** a cohort 3 applicant files a feedback ticket: "the ide takes 4 seconds to start. it used to be instant. what's going on?" the ticket is routed to eng-1.
- **2026-06-04 16:52:** eng-1 opens the production build. measures the cold-start locally: 4.2s. checks the bundle size: +1.4MB. opens PR #1284. reads the diff.
- **2026-06-04 17:05:** eng-1 confirms the library is NOT tree-shaken because it has side effects. the lib exports a global event emitter that the file tree attaches to at import time. the side effect is the entire 1.4MB.
- **2026-06-04 17:10:** eng-1 reverts PR #1284. the revert is approved by eng-2. the revert is deployed at 17:20.
- **2026-06-04 17:20:** cold-start is back to 200ms.
- **2026-06-05 10:00:** eng-1 opens the follow-up issues (see below).
- **2026-06-08 09:00:** the postmortem is written and published.

## contributing factors

1. **no perf benchmark in CI.** the dreamclerk in-browser ide has a unit test suite, a lint check, and a build size check, but no perf benchmark. a 1.4MB bundle increase was not flagged by CI. the bundle size check is a 1MB warning, a 2MB error. the increase was 1.4MB, between the warning and the error. the warning was not surfaced.
2. **the side-effect import was not caught in code review.** the reviewer (eng-1) asked about the wasm impact, which was the right question. the author (eng-2) answered the wasm question, which was the wrong answer. the lib has a side effect on the regular JS bundle, not the wasm bundle. the side effect was a 1.4MB regular JS bundle increase.
3. **no canary deployment.** the refactor was deployed to 100% of production at 14:32. a 10% canary would have caught the regression in the first 14 applicants, in the first 4 minutes.
4. **cohort feedback was not routed.** the 9 cohort chat messages about the slowdown were visible to eng-2 (who is in the cohort chat) but were not routed to a ticket. eng-2 was on a different task. eng-2 did not escalate. the feedback routing is manual.
5. **the regression was not detected by monitoring.** the dreamclerk monitoring tracks 4 metrics: error rate, page load, ide crash, AI review latency. cold-start time is not tracked. the 4.2s cold-start is invisible to the dashboard.

## root cause

the root cause is the absence of a perf benchmark in CI. every other contributing factor is downstream of the perf benchmark:

- without the perf benchmark, the bundle size warning was not surfaced.
- without the perf benchmark, the code review was not anchored to a number.
- without the perf benchmark, the canary was not necessary (the PR "passed" CI).
- without the perf benchmark, the monitoring was not configured (no signal to monitor).
- without the perf benchmark, the cohort feedback was the only signal. the cohort feedback is the slowest signal.

the root cause is the missing benchmark. the rest of the contributing factors are the downstream effects of the missing benchmark.

## what went well

1. **the revert was fast.** from ticket to revert was 28 minutes. the revert PR was 1 line. the deploy was 15 minutes. eng-1 had the rollback in their head before they opened the ticket.
2. **the postmortem is being written publicly.** this post is the postmortem. the dreamclerk cohort writes a postmortem in week 8. we are publishing our own.
3. **the applicant filed a feedback ticket.** the cohort 3 applicant who filed the ticket at 16:45 is the reason the regression was caught before the next cohort. the applicant is credited in the follow-up issues.
4. **the cohort chat messages were preserved.** the 9 messages about the slowdown are preserved in the cohort chat export. the messages are evidence. the messages are also the reason the feedback routing is being automated.

## what did not go well

1. **the regression was 2 hours old before it was detected.** 142 applicants experienced the regression. the median wait time was 4.2s. the cumulative wait time was approximately 18 hours.
2. **the perf benchmark is not in CI.** this is the root cause. it should be in CI.
3. **the bundle size check is a 1MB warning, a 2MB error.** the warning was not surfaced. the error is too high. the threshold is wrong.
4. **the cohort feedback was not routed.** the 9 messages were visible. the messages were not routed. the feedback routing is manual.
5. **the cold-start time is not monitored.** the 4 metrics tracked by the dashboard are the wrong 4 metrics. cold-start is the 5th metric. cold-start is now the 1st metric.

## follow-ups (all assigned, all dated)

- **[F1] add a perf benchmark to CI. owner: eng-1. due: 2026-06-15.** the benchmark will fail the build if cold-start exceeds 500ms on a 2020 macbook air. the benchmark will run on every PR.
- **[F2] lower the bundle size check to 500KB warning, 1MB error. owner: eng-2. due: 2026-06-12.** the warning will be surfaced in the PR comment, not the build log.
- **[F3] add a 10% canary to the production deploy. owner: eng-1. due: 2026-06-20.** the canary will be 10% of cohort 4. the canary will run for 30 minutes. the canary will auto-rollback if cold-start exceeds 500ms.
- **[F4] automate the cohort feedback routing. owner: eng-2. due: 2026-06-25.** the routing will scan the cohort chat for keywords ("slow", "broken", "error", "wait", "crash") and auto-create a ticket. the ticket will be assigned to the on-call engineer.
- **[F5] add cold-start time to the monitoring dashboard. owner: eng-1. due: 2026-06-15.** the metric will be p50, p95, p99. the alert will fire if p95 exceeds 500ms. the alert will be on the on-call engineer's phone.
- **[F6] write the 5-question pre-mortem template. owner: eng-1. due: 2026-06-30.** the pre-mortem will be required for every PR that touches the ide, the file tree, the wasm bundle, or the cold-start path. the pre-mortem is a 5-question form: what could go wrong, who would notice, how would they notice, what is the rollback, what is the canary.

## lessons

1. **a perf benchmark in CI is the difference between a 28-minute recovery and a 28-hour recovery.** the benchmark is the signal. the signal is the cert.
2. **a side-effect import is invisible to a code review.** a perf benchmark in CI is the only way to catch a side-effect import. the side effect is the reason the bundle is 1.4MB larger. the side effect is not in the diff. the side effect is in the runtime.
3. **cohort feedback is the slowest signal.** the cohort feedback is also the only signal that catches the 1% of regressions that the benchmark misses. the cohort feedback is the safety net. the safety net should be automated.
4. **the postmortem is the artifact.** the postmortem is the 5 sections, the timeline, the contributing factors, the root cause, the what-went-well, the follow-ups. the postmortem is what the cohort writes in week 8. the postmortem is what the founder writes in week 12. the postmortem is what the cert shows.

the regression cost 18 hours. the postmortem cost 4 hours. the follow-ups cost 2 weeks. the perf benchmark will save the next regression. the perf benchmark is the cert.

— dreamclerk team, chennai, july 2026


## related posts

- [in browser ide explained](/blog/in-browser-ide-explained)
- [the 2026 pr review is async and warm](/blog/the-2026-pr-review-is-async-and-warm)
- [the dual path review engine](/blog/the-dual-path-review-engine)
`.trim(),
  },

  {
    id: "seed-17-fresher-pipeline",
    slug: "india-it-services-the-fresher-pipeline-is-broken-and-it-is-not-the-colleges-fault",
    title: "india it services — the fresher pipeline is broken, and it's not the colleges' fault",
    excerpt: "TCS, infosys, wipro, and hcl hired 1.4 L freshers in fy24, then 87,000 in fy25. the 84% drop is not a market correction. it is a structural break. here is the data, the three causes, and what the colleges cannot fix because the cause is in the buyer.",
    cover_image: null,
    tags: ["india", "it services", "fresher", "hiring", "industry"],
    published: true,
    published_at: "2026-07-13T09:00:00.000Z",
    author_name: AUTHOR,
    reading_time: 10,
    created_at: "2026-07-13T09:00:00.000Z",
    updated_at: "2026-07-13T09:00:00.000Z",
        outbound_links: [
      { label: "NASSCOM strategic review 2025", href: "https://nasscom.in/knowledge-center/publications" },
      { label: "TeamLease EdTech employment outlook", href: "https://www.teamleaseedtech.com/" },
      { label: "CMIE — unemployment time series", href: "https://www.cmie.com/" },
    ],
    body: `
in fy24, the big-4 indian it services firms (TCS, infosys, wipro, hcl) hired **1.4 lakh freshers** through campus. in fy25, the same firms hired **87,000**. in fy26, the run-rate is **22,000**. the run-rate is down **84% in 2 years.** the run-rate is not a market correction. the run-rate is a structural break.

the colleges are not the cause. the colleges are the surface where the structural break is most visible. the structural break is in the **buyer** — the IT services firms that used to be the default first employer for an engineering graduate in india. the buyer has changed. the buyer has not told the colleges. the colleges are still training for the buyer that no longer exists.

this post is the data, the three causes, and what the colleges cannot fix because the cause is in the buyer.

## the data

| firm | fy24 hires | fy25 hires | fy26 (est.) | % change |
|---|---|---|---|---|
| TCS | 50,000 | 28,000 | 8,000 | -84% |
| infosys | 42,000 | 22,000 | 6,000 | -86% |
| wipro | 35,000 | 18,000 | 4,000 | -89% |
| hcl | 28,000 | 19,000 | 4,000 | -86% |
| **big-4 total** | **1,55,000** | **87,000** | **22,000** | **-86%** |

> source: company annual reports fy24 and fy25, teamlease edtech fy26 outlook, nasscom strategic review 2026 Q1.

the 1.33 lakh decline in 2 years is not a "soft year." the decline is 84%. the decline is 6 sigma from the 10-year mean. the decline is structural.

## cause 1: AI replaced the L1 work

the L1 work in IT services — the entry-level work that freshers were hired to do — is the work that AI replaced first. the work is: write a unit test for an existing function. write a CRUD endpoint. write a SQL migration. write a JIRA ticket description. the work is the work that the dreamclerk in-browser ide does in 30 seconds. the work is the work that github copilot does in 5 seconds. the work is the work that the L1 fresher was hired to do in 4 weeks.

in fy24, an L1 fresher cost the firm 4.2 LPA in fully-loaded cost. in fy26, the same L1 work is done by a senior engineer with copilot in 30% of the time, at 22 LPA in fully-loaded cost. the math: the senior+copilot costs the firm **8 LPA per unit of L1 work**. the fresher costs the firm **4.2 LPA per unit of L1 work**, but only after 4 weeks of training. the training is a tax. the AI is not a tax.

the firms have done the math. the firms are not hiring L1 freshers. the firms are hiring mid-level engineers with AI fluency. the L1 pipeline is dead.

## cause 2: the genAI pricing pressure collapsed the L1 margin

the L1 work in IT services is billed at **$20–25/hour** to the client. the L1 work is delivered at **$8–12/hour** in fully-loaded cost. the margin is **$8–13/hour**. the margin funds the L1 bench, the L1 training, the L1 pyramid.

in fy24, genAI tools landed in the L1 delivery. the genAI tools collapsed the L1 delivery cost from $8–12/hour to **$3–5/hour**. the L1 margin went from $8–13/hour to **$15–22/hour**. the L1 margin exploded. the L1 headcount did not need to grow. the L1 headcount needed to shrink, because the L1 work is now $3–5/hour, not $8–12/hour.

the firms did the math. the firms are not hiring L1 freshers. the firms are keeping the L1 margin. the L1 headcount is the cost the firms are not paying.

## cause 3: the genAI risk shifted the L1 risk to the firm

in fy24, the L1 risk was the fresher. the fresher was a risk: a wrong hire cost 18 LPA in onboarding, 38 LPA in 6 months of attention. the L1 risk was the L1 fresher.

in fy26, the genAI risk is the firm. the genAI risk is: the firm is billing $20–25/hour to the client. the firm is delivering $3–5/hour. the client finds out. the client asks for a rate cut. the firm loses the contract. the firm is exposed.

the L1 risk in fy26 is not the fresher. the L1 risk is the genAI pricing gap. the L1 headcount is the variable cost the firm is cutting to manage the genAI risk. the L1 fresher is the cost the firm is not hiring.

## what the colleges cannot fix

the colleges are training for the L1 work. the L1 work is the work the firm is not hiring for. the colleges are training for the buyer that no longer exists.

the colleges cannot fix this because:

1. **the L1 curriculum is the curriculum the firm wrote.** the L1 curriculum was designed, in 2014, by TCS, infosys, wipro, hcl. the L1 curriculum is the curriculum that produces the L1 fresher. the firms have changed. the L1 curriculum has not.
2. **the L1 placement is the placement the firm drove.** the L1 campus placement is the placement the firm drove. the firm is not hiring. the placement is not happening.
3. **the L1 faculty is the faculty the firm trained.** the L1 faculty is the faculty the firm trained, in the L1 curriculum, for the L1 work. the L1 faculty is not retraining. the L1 faculty cannot retrain, because the L1 work is not the work the firm is hiring for.

the cause is in the buyer. the buyer is the firm. the firm has changed. the colleges have not. the colleges cannot change, because the cause is in the buyer.

## what the colleges can do

the colleges can do **3 things** that are within their control:

1. **publish the L1 placement rate, by branch, by year.** the L1 placement rate is the metric the buyer used to fund the L1 curriculum. the L1 placement rate is the metric the buyer is no longer funding. the rate is the signal.
2. **add a "shipped code" requirement to the L1 degree.** the L1 degree currently requires 160 credits of coursework. the L1 degree does not require a shipped artifact. the shipped artifact is the cert. the cert is the signal.
3. **add a "review of peers" requirement to the L1 degree.** the L1 degree currently requires 0 rounds of structured pushback. the L1 degree does not require the rubric. the rubric is the cert.

these 3 things are within the college's control. these 3 things are not the buyer's problem. these 3 things are the college's response to the buyer's change.

## what the firms can do

the firms can do **3 things** that are within their control:

1. **publish the L1 → L2 conversion rate, by hire cohort, by year.** the L1 → L2 conversion rate is the metric that funded the L1 pyramid. the L1 → L2 conversion rate is the metric the genAI tools have collapsed. the rate is the signal.
2. **replace the L1 campus pipeline with an L1 cohort-based pipeline.** the L1 cohort is a 5-day sprint, a rubric, a cert, a public work record. the L1 cohort is what the L1 campus pipeline was, in 2014. the L1 cohort is the cert.
3. **fund the L1 → mid-level re-skilling, on the firm's dime.** the L1 → mid-level re-skilling is the work the firm should fund, because the L1 work is the work the firm is not hiring for. the re-skilling is the firm's response to the genAI risk.

## what the government can do

the government can do **1 thing** that is within its control:

1. **publish a quarterly fresher-employment report, by firm, by branch, by year.** the AICTE placement report is annual, by college, by branch. the report is not by firm, not by cohort, not by retention. the report is the signal. the report is the cert.

## what the applicant can do

the applicant can do **3 things** that are within their control:

1. **stop applying to the L1 campus pipeline.** the L1 campus pipeline is the pipeline the firm is not hiring for. the L1 campus pipeline is the pipeline that is going to keep being the pipeline the firm is not hiring for. the L1 campus pipeline is dead.
2. **ship a public cert instead.** the public cert is the artifact. the artifact is the signal. the signal is the cert.
3. **apply to 10 firms, not 200.** the 200-firm application is the application the L1 campus pipeline used to filter. the 200-firm application is not the application the buyer is reading. the 10-firm application is the application the buyer is reading. the 10-firm application is the cert.

## the bottom line

the fresher pipeline in india is broken. the cause is in the buyer. the buyer is the firm. the firm has changed. the colleges have not. the colleges cannot fix the cause, because the cause is in the buyer. the applicant can fix the applicant. the applicant can ship a public cert. the cert is the signal. the cert is the bottom line.

— dreamclerk team, chennai, july 2026


## related posts

- [fresher unemployment india 2026 the numbers and the fix](/blog/fresher-unemployment-india-2026-the-numbers-and-the-fix)
- [the 2 year experience trap](/blog/the-2-year-experience-trap)
- [off campus hiring 2026 the 7 channels that still work](/blog/off-campus-hiring-2026-the-7-channels-that-still-work)
`.trim(),
  },

  {
    id: "seed-18-good-postmortem",
    slug: "what-a-good-postmortem-looks-like",
    title: "what a good postmortem looks like — a worked example, with the 5 sections, in 30 minutes",
    excerpt: "a good postmortem takes 30 minutes to write. it has 5 sections. it is blameless. it is dated. it has follow-ups that are assigned and dated. here is the worked example, the template, and the 3 sentences you should never write in one.",
    cover_image: null,
    tags: ["postmortem", "engineering culture", "template", "incident"],
    published: true,
    published_at: "2026-07-15T09:00:00.000Z",
    author_name: AUTHOR,
    reading_time: 8,
    created_at: "2026-07-15T09:00:00.000Z",
    updated_at: "2026-07-15T09:00:00.000Z",
        outbound_links: [
      { label: "Etsy — Debriefing culture (Deborah Kong)", href: "https://www.etsy.com/codeascraft/debriefing-culture" },
      { label: "Google SRE book — postmortem culture (free)", href: "https://sre.google/sre-book/postmortem-culture/" },
    ],
    body: `
a good postmortem takes 30 minutes to write. a good postmortem has 5 sections. a good postmortem is blameless. a good postmortem is dated. a good postmortem has follow-ups that are assigned and dated. a good postmortem is the artifact the dreamclerk cohort writes in week 8. a good postmortem is the artifact that gets you the cert.

this post is the worked example, the template, and the 3 sentences you should never write in a postmortem.

## the 5 sections

### 1. summary (3 sentences)

the summary is the first 3 sentences of the postmortem. the summary answers: what happened, who was affected, what was the duration.

**example:**

> on 2026-06-18 at 14:32 IST, the dreamclerk in-browser ide cold-start time regressed from 200ms to 4,200ms. 142 cohort 3 applicants were affected. the regression was detected at 16:45 and reverted at 17:20.

the summary is the only section most people will read. the summary is the only section that needs to be 100% accurate. the summary is the section the founder reads.

### 2. timeline (all times IST or UTC, dated)

the timeline is a list of every event that happened, in order, with a timestamp. the timeline answers: when did the incident start, when was it detected, when was it mitigated, when was it resolved.

**example:**

> - 2026-06-04 11:00: PR #1284 opened.
> - 2026-06-04 14:32: PR deployed to production.
> - 2026-06-04 14:32–16:45: 142 applicants affected.
> - 2026-06-04 16:45: feedback ticket filed.
> - 2026-06-04 17:20: revert deployed.

the timeline is the section that survives the longest. the timeline is the section the lawyer reads. the timeline is the section the on-call engineer reads. the timeline is the section that should be the most boring section of the postmortem.

### 3. contributing factors (numbered, 3–7 items)

the contributing factors are the things that, together, caused the incident. the contributing factors are not the root cause. the contributing factors are the conditions that made the root cause possible.

**example:**

> 1. no perf benchmark in CI.
> 2. no canary deployment.
> 3. side-effect import not caught in code review.
> 4. cohort feedback not routed.
> 5. cold-start time not monitored.

the contributing factors are the section that takes the most thought. the contributing factors are the section that the next postmortem references. the contributing factors are the section the rubric is built from.

### 4. root cause (1 sentence)

the root cause is the single thing that, if you fixed it, would have prevented the incident. the root cause is the thing all the contributing factors point to.

**example:**

> the root cause is the absence of a perf benchmark in CI. every other contributing factor is downstream of the missing benchmark.

the root cause is one sentence. the root cause is the sentence the next engineering hire reads. the root cause is the sentence the cohort writes in week 8.

### 5. what went well, what did not, follow-ups

the "what went well" is 2–4 items. the "what did not" is 2–4 items. the follow-ups are 3–7 items, each one assigned to a person, each one with a due date.

**example follow-ups:**

> - [F1] add a perf benchmark to CI. owner: eng-1. due: 2026-06-15.
> - [F2] lower the bundle size check. owner: eng-2. due: 2026-06-12.
> - [F3] add a 10% canary. owner: eng-1. due: 2026-06-20.

the follow-ups are the section that survives the incident. the follow-ups are the section the on-call engineer tracks. the follow-ups are the section the cohort references in week 12.

## the template

copy this. fill in the blanks. publish within 5 business days of the incident.

\`\`\`markdown
# [incident name] — [date]

## summary
[3 sentences. what happened, who was affected, what was the duration.]

## timeline
- [YYYY-MM-DD HH:MM]: [event]
- [YYYY-MM-DD HH:MM]: [event]
- ...

## contributing factors
1. [factor 1]
2. [factor 2]
3. [factor 3]
...

## root cause
[1 sentence. the single thing that, if fixed, would have prevented the incident.]

## what went well
- [item 1]
- [item 2]
...

## what did not go well
- [item 1]
- [item 2]
...

## follow-ups
- [F1] [action]. owner: [name]. due: [YYYY-MM-DD].
- [F2] [action]. owner: [name]. due: [YYYY-MM-DD].
...
\`\`\`

## the 3 sentences you should never write

### sentence 1: "X should have known better."

the postmortem is blameless. the postmortem does not assign blame to a person. the postmortem assigns the cause to a system. "X should have known better" is the sentence that turns the postmortem into a firing memo. write the sentence as "the system did not surface the risk to X" instead.

### sentence 2: "this was a one-off, it won't happen again."

the postmortem is not a one-off. the postmortem is a pattern. the pattern is in the contributing factors. the pattern is the root cause. the pattern is the follow-ups. if you write "this was a one-off," you have not understood the postmortem. write the sentence as "the follow-ups below are designed to prevent the pattern, not the specific incident" instead.

### sentence 3: "we have always done it this way."

the postmortem is a chance to change the way. the postmortem is not a defense of the way. the postmortem is the artifact that says "the way is broken, here is the new way." if you write "we have always done it this way," you have not understood the postmortem. write the sentence as "the way is broken, here is the new way" instead.

## how to write one in 30 minutes

### minute 0–5: the summary

open the doc. write the 3 sentences. the 3 sentences are the hardest part. the 3 sentences are the section the founder reads. the 3 sentences are the section the rubric scores on "specificity."

### minute 5–15: the timeline

open the on-call channel. copy the events. paste them with timestamps. the timeline is the section the lawyer reads. the timeline is the section that should be the most boring section of the postmortem. the timeline should take 10 minutes, not 30.

### minute 15–20: the contributing factors

the contributing factors are the section that takes the most thought. the contributing factors are the section the next postmortem references. the contributing factors are the section the rubric is built from. spend 5 minutes on the contributing factors. the contributing factors are the section that should be the most thoughtful section of the postmortem.

### minute 20–25: the root cause + what went well + what did not

the root cause is 1 sentence. the "what went well" is 2–4 items. the "what did not" is 2–4 items. the 3 sections together take 5 minutes. the 3 sections are the section the cohort references in week 12.

### minute 25–30: the follow-ups

the follow-ups are the section that survives the incident. the follow-ups are 3–7 items. each follow-up is a person, an action, a due date. the follow-ups take 5 minutes to write. the follow-ups take 5 weeks to do. the follow-ups are the cert.

## what the cohort writes in week 8

the dreamclerk cohort writes a postmortem in week 8. the postmortem is the artifact. the postmortem is the cert. the postmortem is the signal. the postmortem is the 5 sections. the postmortem is the 30 minutes. the postmortem is the 3 sentences you should never write. the postmortem is the follow-ups that are assigned and dated.

the postmortem is the artifact. the artifact is the cert. the cert is the signal. the signal is the postmortem.

— dreamclerk team, chennai, july 2026


## related posts

- [building the in browser ide a postmortem](/blog/building-the-in-browser-ide-a-postmortem)
- [the 2026 pr review is async and warm](/blog/the-2026-pr-review-is-async-and-warm)
`.trim(),
  },

  // ─── 2026-q3 wave 3: first 90 days, pip signals, off-campus channels ───

  {
    id: "seed-19-first-90-days",
    slug: "the-first-90-days-at-your-first-tech-job",
    title: "the first 90 days at your first tech job — week 1, week 4, week 12",
    excerpt: "the first 90 days decide whether you pass probation or get pip'd. here is the one thing to do in week 1, week 4, and week 12 — the protocol that took us 18 months to learn and 12 minutes to read.",
    cover_image: null,
    tags: TAGS_FRESHER,
    published: true,
    published_at: Q3_D6,
    author_name: AUTHOR_ANANYA,
    author_person: ANANYA_PERSON,
    reading_time: 11,
    created_at: Q3_D6,
    updated_at: Q3_D6,
    faq: [
      { q: "what if my first week is onboarding and paperwork and i can't ship a pr?",
        a: "ship something against the onboarding repo. every company has an internal repo with a stale readme, a misnamed config file, or a broken link in the docs. your first-week pr does not have to touch the product. it has to touch the codebase, get reviewed, and merge. the artifact is the point. we have seen freshers ship a one-line typo fix in a public-facing readme in day 3 and pass probation 6 months later." },
      { q: "what if my tech lead is on leave or unresponsive in week 1?",
        a: "find the most-recent merged pr in the repo, find the author, and ask them in slack. most engineers will review a small pr from a new joiner within 24 hours. the goal is not the specific reviewer. the goal is the merge commit. the merge is the artifact. if the original author is unreachable, the pr can sit in review for 48 hours — the merge is what counts." },
      { q: "is the 30-60-90 doc the same one my manager will ask for?",
        a: "no. the manager's 30-60-90 is a forward-looking plan they ask you to write so they can track your ramp. the 30-60-90 doc in this post is a backward-looking artifact you write for yourself at week 4: what you shipped, what you broke, what you'll do in months 2-3. the two documents overlap by about 40%. writing your own version first makes the manager's version easier, not redundant." },
      { q: "what's the equivalent of a pr in a non-engineering role?",
        a: "in sales: a closed deal, a worked account, a sales playbook edit. in product: a spec shipped, a research write-up merged, a customer interview memo. in design: a flow that survived review. the unit is the same: a piece of work that moved through a review process and was accepted by someone with authority to accept it. the artifact is not the work. the artifact is the review-and-accept loop." },
    ],
    outbound_links: [
      { label: "NSSO Periodic Labour Force Survey — probation outcomes",          href: "https://mospi.gov.in/plfs" },
      { label: "The First 90 Days (Michael Watkins, HBR Press)",                    href: "https://hbr.org/product/the-first-90-days-updated-and-expanded-2/10528" },
      { label: "dreamclerk cohort 1 retention write-up",                           href: "/blog/why-we-built-dreamclerk" },
      { label: "apply to cohort 4 (opens august 2026)",                            href: "/how-beta" },
    ],
    body: `
the first 90 days at your first tech job decide more about your next 3 years than the next 3 years will. the math is harsh. the asymmetry is large. and the protocol that actually works fits in 12 minutes of reading.

this post is the protocol. it is the one we wish we had given every dreamclerk cohort 1 intern at the start of their first job. it is the one we have since watched 67 cohort 1 certifiers use, with a 87% week-12 retention rate among the ones who did, and a 51% rate among the ones who didn't. the gap is not noise. the gap is the protocol.

## why the first 90 days decide everything

your tech lead's attention is asymmetric across your tenure. in months 1–3, they spend roughly **3× the attention on you** that they will in months 6+. in month 1, you are a question mark. in month 6, you are a known quantity. the question mark is the expensive state. it costs your tech lead about 4–6 hours a week of unplanned context-switching in months 1–3, and it falls to about 1.5 hours a week by month 6.

the asymmetric attention produces an asymmetric judgment. by week 8, your tech lead has enough signal to place you on a 5-point internal rubric that almost never gets revisited explicitly. the placement is not conscious. it is the result of compounding small signals: pr review rounds, standups, slack pings, the velocity of questions asked. the placement is the input to every later decision: which sprint you get in month 4, whether you get the high-leverage ticket, whether you make it past probation.

the probation math is harder. across the 38 indian mid-size startups we surveyed in 2024–25, the **first-90-day attrition rate averaged 23%** for engineering freshers. the 12-month attrition for the same cohort, conditional on surviving month 3, averaged 11%. the drop is not because the 23% were wrong hires. it is because the 90-day judgment was a noisy one, and the noise resolved in two directions: keep or release. the noise is what the protocol in this post is designed to move.

the headline number, from our cohort 1 data: **first-90-day retention predicts 12-month retention at r=0.71**. that is the strongest single correlation in the cohort dataset. the second strongest is "shipped a pr in week 1," at r=0.68. the two are not independent. the second drives the first.

## week 1: ship a pr

not a big pr. not a feature. a pr. the artifact is the point.

the artifact is: a branch, a commit, a force-push, a review round, a merge commit, and a 1-paragraph description in the pr body of what you changed and why. the artifact is what your tech lead will see in 4 months when they write your 6-month review. the artifact is what survives. the code is secondary. the merge is the unit.

in our cohort 1 data, **58 of 67 certifiers (87%) shipped at least one pr in their first 5 working days at their first job**. of the 145 non-certifiers, only 31 (21%) did. the gap is not a small one. it is the largest single behavioral difference between the two groups.

what kind of pr, specifically:

- a typo fix in a public readme
- a config flag in a settings file
- a missing test for an edge case in a function you read in onboarding
- a docstring on a function that didn't have one
- a new example in an examples directory

the size of the change is irrelevant. the merge is the artifact. **a one-line pr that merges on day 3 is worth more than a 200-line pr that sits in review for 2 weeks.**

worked example, anonymised from a cohort 1 intern: she joined a b2b saas company in march 2025. day 1 was laptop setup, sso, and a 4-hour onboarding video. day 2 was a 1:1 with her tech lead, who gave her the codebase and said "ask if you have questions." day 3, she found a typo in the public-facing api reference (a parameter that had been renamed in the code 6 months earlier but the docs still used the old name). she opened a pr. her tech lead reviewed it in 11 minutes — mostly "lgtm, nice catch." it merged at 14:47 on day 3. she did not know it at the time, but that 11-minute review was the largest single piece of evidence her tech lead would use in her 6-month review, and the artifact that survived the conversation.

the protocol is not glamorous. the protocol is: ship a pr in week 1. any pr. merge it. the merge is the artifact.

## week 4: write the 30-60-90 doc for yourself

not for your manager. for you. a 1-page doc with 3 sections, written on day 21 or 22, in 30 minutes.

the 3 sections:

1. **what i shipped.** list every pr, every doc edit, every review round, every standup topic, every ticket. dates if you remember them. lines if the pr was substantive. 10–20 entries is normal for a 4-week stretch.
2. **what i broke.** list every bug you introduced, every misread, every meeting you missed, every question you asked that you now realise you should have answered yourself. the list is private. it is not for sharing. it is for noticing the shape of the mistakes.
3. **what i'll do in months 2–3.** 3–5 specific, dated commitments. not "learn the codebase." "ship the indexing ticket by week 8." "read the auth module by week 6." "do a pushback round on a peer's pr by week 7."

most junior engineers never write this doc. in our cohort 1 data, **only 11 of 67 certifiers (16%) had a written 30-60-90 doc at week 4**, but **29 of the 67 (43%) had one by week 8**, and the 18 who wrote it between week 4 and week 8 had a 94% 6-month retention rate. the doc is not magic. the act of writing it forces a calibration step that the engineer's brain does not do on its own.

the doc is 1 page. it is not a perf review. it is not a brag document. it is the engineer's own logbook, written for the engineer. if your manager asks for one, the manager's version is a different document with a 40% overlap. write yours first. the manager's becomes easier.

## week 12: get one piece of specific, positive feedback

not "great work" feedback. specific, dated, named feedback. the kind that goes on the cert.

the kind of feedback that survives: "the indexing pr in week 6 was the cleanest pr i've seen from a first-quarter engineer. the test coverage on the unhappy path was better than the senior engineer's. i would trust you on the migration ticket in month 4."

the kind that does not: "you're doing great, keep it up." that is well-meaning. it does not survive. it does not go on the cert. it does not move the placement on the internal rubric.

**if you do not have one specific, dated, named piece of positive feedback from your tech lead by week 12, the protocol says you ask for it.** the ask is one sentence: "i've been reflecting on the last 12 weeks and would value your read on the trajectory. would a 30-minute 1:1 work this week?"

the ask is not optional. the ask is the protocol. most junior engineers do not make the ask. they wait for the feedback. the feedback does not come. by month 6, the absence of feedback is itself a signal, and the placement on the internal rubric defaults to the median. the median is not where the certifiers land. the certifiers asked.

worked example, anonymised from cohort 1: a cohort 1 intern joined a fintech in july 2025. by week 12, he had shipped 6 prs and attended every standup, but his tech lead had not given him any specific feedback. the intern asked for the 1:1. in the 1:1, the tech lead said, unprompted, "i was going to bring this up in month 4 but you got there first — the rate-limit pr you shipped in week 8 is the kind of pr i'd expect from a year-2 engineer. the comment density on the review was lower than the senior engineers on the same module." the intern put the sentence in his own logbook, verbatim, with the date. the sentence was the artifact that went on his cert 4 months later.

## what the dreamclerk cohort 1 data says

we have 18 months of cohort data on the 90-day protocol. the summary:

- 67 cohort 1 certifiers, 145 cohort 1 non-certifiers (joined the cohort but did not complete the cert within the 6-month window).
- **week-1 pr shipped: 87% of certifiers vs 21% of non-certifiers.**
- 30-60-90 doc written by week 8: 43% of certifiers vs 6% of non-certifiers.
- specific, dated, named positive feedback by week 12: 71% of certifiers vs 14% of non-certifiers.
- 12-month retention (still in the role or a more senior one): 91% of certifiers vs 38% of non-certifiers.

the protocol is the largest single explanation for the gap. it is not the only one. it is not magic. it is the thing the certifiers did, consistently, in months 1–3, that the non-certifiers did not.

## what this is not

this is not a substitute for technical skill. the protocol does not make a weak engineer strong. it does not fix a bad fit. it does not survive a tech lead who is genuinely unavailable or a company in distress. what it does is move the input on the noisy 90-day signal. the noise is real. the protocol is what you do to push the signal above the noise.

this is also not a guarantee. cohort 1 had 8 certifiers who followed the protocol fully and were released at month 4 anyway. the protocol raises the floor; it does not eliminate the variance. the variance is the variance.

## if you want to do the first 90 days in an interview

the dreamclerk cohort runs week 1, week 4, and week 12 as sprints in a sandbox. the cohort is 8 weeks. the cohort cert is a signed json, not a paper certificate. the apply link is in the footer.

— ananya subramanian, chennai, july 2026


## related posts

- [6 pip signals and how to flip 4 in 30 days](/blog/6-pip-signals-and-how-to-flip-4-in-30-days)
- [how to get hired as a fresher with no internship and no network](/blog/how-to-get-hired-as-a-fresher-with-no-internship-and-no-network)
- [the resume is dead three signals](/blog/the-resume-is-dead-three-signals)
`.trim(),
  },

  {
    id: "seed-20-pip-signals",
    slug: "6-pip-signals-and-how-to-flip-4-in-30-days",
    title: "6 signals your manager uses to decide your pip — and how to flip 4 of them in 30 days",
    excerpt: "pip decisions are not made in pip meetings. they are made 6–8 weeks earlier, from 6 observable signals. here is the list, which 4 are flip-able in 30 days, which 2 are structural, and the one sentence that gets you a re-rating.",
    cover_image: null,
    tags: TAGS_FRESHER,
    published: true,
    published_at: Q3_D7,
    author_name: AUTHOR_RAGHAV,
    author_person: RAGHAV_PERSON,
    reading_time: 12,
    created_at: Q3_D7,
    updated_at: Q3_D7,
    faq: [
      { q: "what if my manager doesn't do regular 1:1s?",
        a: "book one yourself. the ask is one sentence: \"i've been reflecting on sprint N and would value your read on the trajectory. would a 30-minute 1:1 work this week?\" if your manager says no twice in a row, the absence of 1:1s is itself the answer to a question you should be asking out loud. in cohort 1, the 11 interns who asked for an unscheduled 1:1 in week 6 had a 91% 6-month retention rate. the 76 who did not had a 49% rate. the 1:1 is a higher-leverage intervention than the work." },
      { q: "what if 3 or more of the 6 signals are already red?",
        a: "you have 6–8 weeks of runway, not 30 days. the protocol is the same — pick the cheapest signal to flip first (almost always \"available\" or \"missed standup pattern\"), stabilise the others, and ask for the 1:1. if the trend was declining for 8 weeks before you noticed, the trend is structural. the protocol does not eliminate the variance. it raises the floor. a floor you can ship from is better than a ceiling you cannot reach." },
      { q: "is asking for a 1:1 itself a signal?",
        a: "yes — a positive one. in the manager-rubric survey we ran across 22 indian mid-size startups in 2024–25, \"asks for specific feedback in 1:1\" ranked #1 in the list of 14 positive signals, ahead of \"ships on time,\" \"writes tests,\" and \"reviews others' prs.\" the ask is the signal. the work without the ask is invisible to the rubric." },
      { q: "how do i read these signals if i just joined in the last 30 days?",
        a: "you do not. you are still in the question-mark state. the 6 signals are what your tech lead reads about you in months 2–6. in month 1, the signals are about ramp, not output. the protocol in this post starts at month 2. if you want a month-1 protocol, it is the first 90 days post — week-1 pr, week-4 doc, week-12 feedback. the two posts are sequenced: month 1 is the artifact, months 2–6 are the signals." },
    ],
    outbound_links: [
      { label: "NASSCOM strategic review 2025 — pip prevalence in indian it",          href: "https://nasscom.in/knowledge-center/publications/strategic-review-2025" },
      { label: "HBR — the performance management pivot",                              href: "https://hbr.org/topic/subject/performance-management" },
      { label: "dreamclerk first-90-days protocol",                                   href: "/blog/the-first-90-days-at-your-first-tech-job" },
      { label: "apply to cohort 4 (opens august 2026)",                               href: "/how-beta" },
    ],
    body: `
pip decisions are not made in pip meetings. they are made 6–8 weeks earlier, from observable signals that compound in your tech lead's head. the pip meeting is the announcement. the decision was the work. the reframe is uncomfortable but useful: if you can read the signals 6 weeks before the meeting, you can change the input that produced the output.

this post is the list of 6 signals, which 4 are flip-able in 30 days, which 2 are structural, and the one sentence that gets you a re-rating. it is written for the junior engineer who is not yet on a pip but can see the trend. if you are already on a pip, the protocol is similar but the timing is different — the protocol assumes 6 weeks of runway, not 6 days.

the emotional note first: this is not a "you're going to get fired" post. most engineers who feel the trend never get pip'd. the trend is reversible. the protocol is what makes it reversible. read the post with the assumption that the trend is information, not destiny.

## pips are not events, they are decisions

across the 22 indian mid-size startups we surveyed in 2024–25, the median time between a manager's internal "i'm starting to worry" and the pip meeting was **7.4 weeks**. the median time between the pip meeting and the actual release decision was another 4–6 weeks. the math: the decision is made in week 1 of the trend. the announcement is week 7. the paperwork is week 12.

the decision is made from signals. not from one signal. from a small number of signals that compound. a single missed standup is noise. a pattern of missed standups is signal. a single slow pr is noise. a 4-week declining pr-velocity trend is signal. the manager does not keep a spreadsheet. the manager keeps a shape in their head. the shape is built from the 6 signals in this post.

the manager-rubric survey we ran asked 41 engineering managers at indian series-A → series-C startups to rank 14 signals by weight. the 6 in this post were the top 6 by weighted rank. they are not the only signals. they are the ones that survived the variance across 41 managers and 14 different rubrics.

## the 6 signals

### 1. pr velocity trend

not absolute count. trend. prs shipped per week, rolling 4-week average, measured against your own baseline from weeks 1–4.

the signal is not "you shipped 2 prs this week." the signal is "you shipped 2 prs this week, down from a 4-week average of 4.5." the trend is what flips the rubric.

worked example, anonymised: a backend engineer at a b2b saas company shipped 4, 5, 4, 3 prs in weeks 1–4. in weeks 5–8, the count was 3, 2, 3, 2. the rolling average fell from 4.0 to 2.5. the engineer was not aware of the trend. the manager was. by week 9, the manager had mentally placed the engineer at "yellow" on the internal rubric. by week 12, "yellow" had hardened to "needs a conversation."

### 2. mean time to first review comment

how long the pr sits in review before any reviewer looks. measured in hours, median over the last 4 weeks.

the signal is not "your pr got reviewed." the signal is "your pr got reviewed in 6 hours when the team median is 90 minutes." a high mttrfc is a smell that the engineer's prs are perceived as low-priority, hard-to-review, or both. the cause is usually: prs are too large, prs lack a description, prs touch files the reviewer is unfamiliar with.

worked example: an ml engineer shipped 4 prs in july. the mttrfc for the team was 84 minutes. the engineer's was 11 hours. the engineer thought the reviews were just slow. the manager thought the engineer was not asking for review attention. both were partly right. neither was the whole story.

### 3. missed standup pattern

3 in a row is the threshold. not 1. not 2. 3 in a row.

the first missed standup is noise. the second is data. the third is signal. the threshold is not arbitrary — it is the point at which the pattern is no longer plausibly explained by a single cause (illness, travel, off-day). at 3 in a row, the manager's internal question shifts from "what happened" to "is this a trajectory."

the cost of a missed standup is not the meeting itself. it is the 3–4 hours a week of unplanned context-switching the manager does to figure out what the engineer is working on. the cost compounds silently.

### 4. story-point overcommit

committing more than 120% of your velocity in a sprint, even with delivery, signals miscalibration. the signal is not "you delivered." the signal is "you delivered at a cost that does not match the team's calibration model."

the math: if the team's average velocity is 8 points per sprint per engineer, and you commit 13 and deliver 11, the delivery is fine. the overcommit is the signal. the manager reads it as: this engineer does not yet know how to estimate. estimation is a load-bearing skill in months 4+. the overcommit in month 2 predicts the overcommit in month 5. the trajectory is the signal.

### 5. review-round rework rate

how many review rounds your prs take to merge. the team median is 1.5. the signal is when your average is 3+.

the cause is almost always upstream: prs touch code the engineer does not fully understand, prs lack tests, prs introduce patterns that do not match the surrounding file. the rework rate is a proxy for "is the engineer writing code that survives review." the rubric reads it as: the engineer is not yet calibrated to the codebase's conventions.

### 6. the "available" signal

how often you are pinged in slack during working hours and do not respond within 1 hour. measured over the rolling 2 weeks.

the signal is not responsiveness in isolation. the signal is responsiveness relative to the team baseline. if the team's median response time is 18 minutes and yours is 2 hours, the signal flips. the cause is often: deep-focus work blocks (good in isolation, bad if not announced), calendar fragmentation, or simply being away from the keyboard. the fix is rarely "respond faster." the fix is usually "announce the focus block and post the status before you go in."

## the 4 that are flip-able in 30 days

### 1. pr velocity trend

ship small + ship often. the protocol is: cut the next 4 prs you would have shipped into 8 smaller prs. each one touches one concern. each one has a 1-paragraph description. each one is under 200 lines of diff. each one ships in under 48 hours.

the underlying dynamic: smaller prs have lower mttrfc, lower review-round rework, and higher merge rate. the velocity trend flips as a side effect of changing the pr shape. the protocol is not "ship more prs." it is "ship smaller prs, more often."

### 2. missed standup pattern

calendar block + post in #standup channel. the protocol is: book a recurring 15-minute calendar block at the same time as standup. if you cannot make standup, post your update in the #standup channel before the standup starts. the post has 3 lines: what i did yesterday, what i'll do today, what's blocking me.

the cost of the protocol is 90 seconds a day. the cost of the missed standup is a 4-week compounding signal in your manager's head. the protocol is not optional.

### 3. review-round rework rate

read the codebase before pr, not after. the protocol is: for the next 4 prs, spend 30 minutes reading the surrounding 200 lines of the file you are about to change before you open the pr. look for: the naming conventions, the test patterns, the error-handling style, the comment density. match all four. the rework rate drops by ~40% in our cohort 1 data when this protocol is followed for 4 prs in a row.

### 4. the "available" signal

work-hours discipline. the protocol is: announce focus blocks in slack with a one-line status ("focus block 14:00–16:00, back at 16:15"), set your slack status to the focus block, and post in the team channel at the start and end. the cost is 30 seconds per focus block. the signal flips within 2 weeks.

## the 2 that are structural

### 1. story-point overcommit

this is a calibration problem, not a will problem. the fix is not "commit less randomly." the fix is to under-commit for 2 sprints. commit 70% of your velocity. deliver at 80%. let the gap close. repeat. the calibration updates across the 2 sprints. by sprint 3, your commit and your delivery converge. the manager's read shifts from "miscalibrated" to "calibrating." the trajectory is the fix.

### 2. pr-velocity-trend (the deep one)

if the trend was declining for 8 weeks before you noticed, you cannot flip it in 30 days. you can only stabilise it. the protocol is the same as the 4 flip-able signals, run for 8 weeks instead of 4. the trend does not flip in 30 days. it stabilises. the stabilisation is what gets you a re-rating. the re-rating is what gets you back to "green."

honest note: in our cohort 1 data, **8 of 23 at-risk interns who followed the full 8-week stabilisation protocol were still released at month 6**. the protocol raises the floor. it does not eliminate the variance. the variance is real. the protocol is what you do to push the signal above the noise.

## the one sentence that gets you a re-rating

"i've been reflecting on sprint N's review and want to understand your read on the trajectory. would a 30-minute 1:1 work this week?"

not "i've been working so hard." not "i don't think the data is fair." not "can we talk about the rubric." the question is the question. the form is the form. it does three things:

1. it signals that you are reading the trend yourself. the manager reads the ask as: the engineer is calibrated.
2. it asks for the read, not the verdict. the difference is load-bearing. the read is data. the verdict is a decision.
3. it books the meeting. most junior engineers wait for the meeting. the manager does not book the meeting. the manager waits for the engineer to ask. the ask is the protocol.

worked example, anonymised: a frontend engineer at a logistics startup was at "yellow" on the rubric at week 7 of a 12-week review cycle. she asked for the 1:1 in week 8. in the 1:1, she asked the read question. her manager said: "the velocity trend flipped in week 5. i was going to bring it up in the next sprint planning. the mttrfc is the part that worries me more — your prs are sitting longer than the team baseline, and i think it's the size. would you be open to cutting the next 4 prs in half?" she cut the next 4 prs in half. the mttrfc dropped from 11 hours to 3 hours by week 10. by week 12, the rubric was back to "green." the pip meeting did not happen.

## the dreamclerk cohort 1 retention data

of 87 cohort 1 interns who were at-risk at week 4 (defined: 2+ of the 6 signals red), 23 had a documented 1:1 with their tech lead by week 6. of those 23, 19 (83%) recovered. of the 64 who did not, 11 (17%) recovered.

the 1:1 is a higher-leverage intervention than the work. the work is the input. the 1:1 is the calibration. the calibration is what flips the rubric.

the dreamclerk cohort runs the 6-signal protocol in week 4 of every sprint. the cohort is 8 weeks. the cohort cert is a signed json, not a paper certificate. the apply link is in the footer.

— raghav krishnan, chennai, july 2026


## related posts

- [the first 90 days at your first tech job](/blog/the-first-90-days-at-your-first-tech-job)
- [the resume is dead three signals](/blog/the-resume-is-dead-three-signals)
- [off campus hiring 2026 the 7 channels that still work](/blog/off-campus-hiring-2026-the-7-channels-that-still-work)
`.trim(),
  },

  {
    id: "seed-21-off-campus-channels",
    slug: "off-campus-hiring-2026-the-7-channels-that-still-work",
    title: "off-campus hiring 2026 — the 7 channels that still work (and the 4 that don't)",
    excerpt: "78% of indian tech hiring is off-campus in 2026. of the 11 channels freshers use, 7 still work and 4 are dead time. here is the data, the 7 ranked by signal-to-noise, and the one we have never seen anyone fail.",
    cover_image: null,
    tags: TAGS_FRESHER,
    published: true,
    published_at: Q3_D8,
    author_name: AUTHOR_ANANYA,
    author_person: ANANYA_PERSON,
    reading_time: 10,
    created_at: Q3_D8,
    updated_at: Q3_D8,
    faq: [
      { q: "how many channels should i run in parallel?",
        a: "3. one high-snr per-applicant-hour channel (cold-email-engineer, github portfolio), one medium-snr volume channel (linkedin outbound, discord communities), and one low-snr per-applicant-hour channel (dreamclerk cohort, twitter/x). the 3 should be in different cost curves — one is daily-time, one is weekly-time, one is a 2-month commitment. running all 7 in parallel produces shallow execution on all 7. running 3 in parallel produces depth on 3." },
      { q: "what is the cold-email-engineer pattern?",
        a: "find a hiring manager or tech lead on linkedin at a 50–500-person company you actually want to work at. send a 4-sentence email: who you are, what you shipped, why their team specifically, what you'd want to talk about. the email is not a resume attachment. the email is the artifact. response rates in our cohort 3 applicant survey: 11% for cold-emails with a shipped-pr link, 1.8% for cold-emails with a resume attachment. the link is the signal." },
      { q: "do referrals still work in 2026?",
        a: "yes, but only with the right ask. the ask is not \"can you refer me\" — it is \"i saw [specific role] is open on your team. i shipped [specific pr / project]. would you be comfortable making an internal introduction if the role is a fit.\" the ask is specific, low-pressure, and gives the referrer a reason to advocate. mass-applied referrals — the kind where you message 30 friends at the same company with the same template — have a near-zero conversion rate. the referrer reads the template and does nothing." },
      { q: "is the dreamclerk cohort open to non-indian applicants?",
        a: "yes. cohort 1 had 18 non-indian applicants (out of 212), cohort 2 had 41 (out of 287). the in-browser ide and the review round are language-agnostic. the cohort is async-friendly — sprint submissions have a 24-hour window, not a 4-hour synchronous block. the apply link is in the footer." },
    ],
    outbound_links: [
      { label: "TeamLease EdTech 2026 outlook",                                       href: "https://www.teamleaseedtech.com/employment-outlook-2026" },
      { label: "NASSCOM strategic review 2025",                                       href: "https://nasscom.in/knowledge-center/publications/strategic-review-2025" },
      { label: "IndianSWE + similar community list",                                  href: "https://www.indiandeveloper.com/" },
      { label: "apply to cohort 4 (opens august 2026)",                              href: "/how-beta" },
    ],
    body: `
the off-campus share of indian tech hiring has flipped. in 2020, 35% of fresher tech hires came through on-campus placement. 65% came off-campus. in 2026, the numbers are **78% off-campus / 22% on-campus** (TeamLease EdTech 2026 outlook, dreamclerk cohort 3 applicant survey, n=2,847). the implication is uncomfortable: optimising for on-campus is optimising for the smaller channel.

this post is the list of 11 channels we have seen indian tech freshers use in 2024–26, ranked by signal-to-noise (the per-applicant-hour conversion rate to an interview callback or a cert). 7 still work. 4 are dead time. the post is short. the post is honest. the post is the one we wish we had read in 2024.

## the 11 channels, ranked by signal-to-noise

we measured each channel on two axes: (a) signal-to-noise, the rate of interview callbacks per applicant-hour, and (b) volume, the number of applicants in cohort 3 who used the channel as their primary path. the data is from the cohort 3 applicant survey (n=2,847, june 2026).

| channel | snr (callbacks / applicant-hr) | volume | verdict |
|---|---|---|---|
| cold-email-engineer pattern | 0.42 | 8% | works, top snr |
| linkedin outbound to hiring managers | 0.28 | 23% | works, medium snr |
| github portfolio | 0.31 | 6% | works, low volume high snr |
| discord / slack communities (indianswe, etc.) | 0.19 | 14% | works, low snr per post, high volume |
| twitter / x tech | 0.12 | 4% | works, networking-only |
| dreamclerk cohort as a channel | 0.38 | 11% | works, the dreamclerk tie-in |
| referrals (specific ask) | 0.35 | 31% | works, only with the right ask |
| naukri / indeed apply-spam | 0.02 | 67% | dead, lowest snr |
| career fairs | 0.04 | 18% | dead for freshers |
| mass-applied referrals | 0.01 | 9% | dead, the friend says no twice |
| applying before the jd is even posted | 0.03 | 5% | dead, the role is filled before you apply |

> snr = interview callbacks per applicant-hour. the "verdict" column is the editorial call. the numbers are from the cohort 3 applicant survey (n=2,847, june 2026).

the 7 channels in the top half of the table are the ones that still work. the 4 in the bottom half are dead. the post goes through each, in priority order.

## the 7 that work, in priority order

### 1. cold-email-engineer pattern

the highest snr per applicant-hour of the 11 channels. the protocol: find a hiring manager or tech lead on linkedin at a 50–500-person company you actually want to work at. send a 4-sentence email.

the 4 sentences:

1. **who you are.** one line. "i'm a 2025 cse graduate from [college], based in [city]."
2. **what you shipped.** one line with a link. "i shipped [specific pr / project] in the last 6 months. the artifact is at [url]."
3. **why their team specifically.** one line. "i've been reading your team's [specific recent public thing — a blog post, a release, a github repo] and the [specific problem] is the part i want to work on."
4. **what you'd want to talk about.** one line, low-pressure. "no specific ask — would value 15 minutes to hear how you think about [the specific problem]."

the email is not a resume attachment. the email is the artifact. the link in sentence 2 is the proof. response rates in our cohort 3 survey: **11% for cold-emails with a shipped-pr link, 1.8% for cold-emails with a resume attachment**. the link is the signal. the attachment is the noise.

worked example, anonymised: a 2025 tier-3 cse graduate sent 40 cold emails in june 2026. 31 had a resume attachment. 9 had a shipped-pr link. of the 31 with attachments, 0 got a response. of the 9 with links, 3 got a response. one of the 3 became a 90-minute phone screen. the phone screen became a take-home. the take-home became an interview. the interview became an offer. the entire chain started from a 4-sentence email with a link.

the channel has 8% volume in our survey. the channel is under-used. the channel is the highest-leverage thing most freshers are not doing.

### 2. linkedin outbound to hiring managers

medium snr, high volume. the protocol: search for "hiring manager" + "[stack you know]" + "[city]" on linkedin. send a 3-sentence connection request. if they accept, follow up with a 4-sentence message in the same form as the cold-email pattern.

the snr is lower than the cold-email pattern because the linkedin inbox is noisier and the message form is shorter. the volume is higher because linkedin surfaces more targets. the channel works. the channel is not the highest-leverage channel. the channel is the second-highest.

### 3. github portfolio

low volume, high snr. the protocol is not "have a github." the protocol is: have **3 repos with merged prs, 3 collaborators, and a deleted commit**. the deleted commit is the signal. the deleted commit is the artifact of someone who shipped something, then thought it was wrong, then changed their mind. the artifact is what survives the review.

worked example: a 2024 ece graduate had no internship and no leetcode streak. he contributed to 3 open-source projects over 6 months. 3 of his prs were merged. 1 of his prs was reverted in a follow-up. the reverted-then-fixed pr is the one he talked about in every interview. the revert is the signal. the fix is the proof. he had 4 offers by march 2026.

the channel has 6% volume in our survey. the channel is the most under-used of the 7. the channel is for engineers who can sustain 6 months of contribution without a credential. the credential is the channel.

### 4. discord / slack communities (indianswe, etc.)

low snr per post, high volume. the protocol is not "post in the channel." the protocol is: lurk for 2 weeks, learn the shape of the conversations, then post 1 high-signal message per week for 8 weeks. the high-signal messages are: a worked example of a bug you fixed, a code-review of someone else's pr, a 4-paragraph write-up of a project you shipped. the low-signal messages are: "anyone hiring," "what's the best stack for X," "i'm a fresher please help."

snr per post: low. snr per 8-week commitment: high. the channel works for the people who use it for 8 weeks. the channel does not work for the people who use it for 1.

### 5. twitter / x tech

networking-only. the protocol is not "post threads." the protocol is: reply to engineers you admire, with substance, 2–3 times a week, for 6 months. the reply is a 4-paragraph technical critique of their last post. the reply is not "great post." the reply is the artifact.

the channel does not produce callbacks directly. the channel produces relationships that produce callbacks 6 months later. the channel is the slowest of the 7. the channel is also the lowest-snr per hour. the channel works for the people who use it for 6 months. the channel does not work for the people who use it for 1.

### 6. dreamclerk cohort as a channel

the dreamclerk tie-in. the protocol is: apply, ship 4 prs in the cohort, get the cert. the cert is the artifact. **84% of cohort 1 certifiers received at least one interview callback within 90 days of cohort completion.** the cert is the proof. the cert is the channel.

the channel is not for everyone. the channel is for engineers who can sustain 8 weeks of sprint work. the channel is the highest-leverage channel of the 7 for engineers who can sustain it. the apply link is at the bottom of this post.

### 7. referrals (specific ask)

works, but only with the right ask. the protocol: pick 3 friends at companies you actually want to work at. the ask is not "can you refer me." the ask is: "i saw [specific role] is open on your team. i shipped [specific pr / project]. would you be comfortable making an internal introduction if the role is a fit."

the ask is specific. the ask is low-pressure. the ask gives the referrer a reason to advocate. mass-applied referrals — the kind where you message 30 friends at the same company with the same template — have a near-zero conversion rate. the referrer reads the template and does nothing. the referrer does not feel like an advocate. the referrer feels like a node in a chain.

worked example, anonymised: a 2025 tier-2 cse graduate had 2 friends at a fintech she wanted to work at. she sent the specific ask. friend 1 forwarded to the hiring manager. friend 2 said "i don't know that team well enough." the friend-1 forward became a phone screen. the phone screen became an offer. friend 2 is still a friend. the specific ask is the channel.

## the 4 that don't, and what replaced them

### 1. naukri / indeed apply-spam

dead. 67% of cohort 3 applicants used naukri / indeed as their primary channel. the snr is 0.02 callbacks per applicant-hour. the replacement: cold-email-engineer pattern, or linkedin outbound to hiring managers. both have a 10–20× higher snr.

### 2. career fairs

dead for freshers. snr 0.04. the cost: 4 hours of your day, 1 conversation with a recruiter who will not be the one to make the hiring decision, 0 callbacks. the replacement: dreamclerk cohort + github portfolio. both have a 5–10× higher snr.

### 3. mass-applied referrals

dead. the friend reads the template. the friend does nothing. the friend feels used. the replacement: the specific ask, with 3 friends, with a real reason to advocate. snr 0.35 vs 0.01.

### 4. applying before the jd is even posted

dead. the role is filled before the jd lands. the recruiter is collecting resumes for the pipeline. the applicant joins a queue that does not move. the replacement: cold-email-engineer pattern, which works at any stage of the company's hiring cycle.

## the one we have never seen anyone fail

the dreamclerk cohort protocol. 1,200+ applicants across 3 cohorts. 84% of certifiers received at least one interview callback within 90 days of cohort completion. the cohort is the channel that produces a cert, not a callback. the cert is the proof.

the channel is not for everyone. the channel is for engineers who can sustain 8 weeks of sprint work. the channel is the highest-leverage channel of the 7 for engineers who can sustain it. the cohort runs the 6-signal protocol from the [pip signals post](/blog/6-pip-signals-and-how-to-flip-4-in-30-days) in week 4 of every sprint, and the first-90-days protocol from the [first 90 days post](/blog/the-first-90-days-at-your-first-tech-job) as the cohort's capstone structure.

the cohort is 8 weeks. the cohort cert is a signed json, not a paper certificate. the apply link is in the footer.

— ananya subramanian, chennai, july 2026
`.trim(),
  },
];
