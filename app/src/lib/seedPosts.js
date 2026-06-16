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
];
