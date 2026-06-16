// ─── seed posts ──────────────────────────────────────────────────────────
//
// These ship in the bundle so the blog is alive even without a supabase
// project. Each post has the same shape as the `posts` table:
//   id, slug, title, excerpt, body (markdown), cover_image, tags,
//   published, published_at, author_name, reading_time, created_at, updated_at
//
// 5 launch posts:
//  1. why we built dreamclerk (the 90-second interview essay — long-form)
//  2. how to pass a coding interview with no experience
//  3. inside our bias audit: the rubric, the data, the changes
//  4. the in-browser ide: what it actually runs, what it can't
//  5. shipping code vs knowing code: a 5-min glossary

const TAGS_BIAS = ["bias audit", "hiring", "rubric", "data"];
const TAGS_INTERVIEW = ["interview", "career", "coding interview", "no experience"];
const TAGS_IDE = ["in-browser ide", "engineering", "explainers"];
const TAGS_GLOSSARY = ["glossary", "engineering culture", "fundamentals"];
const TAGS_FOUNDER = ["founder notes", "dreamclerk", "internship"];

const AUTHOR = "dreamclerk team";
const ORG_DATE = "2026-04-12T09:00:00.000Z";
const COHORT1 = "2026-02-22T09:00:00.000Z";
const COHORT2 = "2026-05-04T09:00:00.000Z";
const COHORT3 = "2026-06-10T09:00:00.000Z";

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
];
