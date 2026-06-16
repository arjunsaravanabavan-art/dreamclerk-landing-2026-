---
name: why-2-years-experience-required-is-a-tax
description: a hiring manager's A/B test: the 2-year rule filters out 88% of applicants and is anti-correlated with the outcome you care about
tags: [hiring manager, tax, experience, a/b test, india]
---

# Why "2 years experience required" is a tax on your future engineering team

i run engineering at a 40-person b2b saas company. for 3 of my 4 years writing JDs, every backend role started with "2+ years experience required." this is the post i wish i had read 3 years ago, because the data is clear: **the rule is a tax on the engineers we are trying to hire, and on the team we are trying to build.**

## the data

we ran an A/B test in 2025. same backend role, two JDs, 30 days each on linkedin.

**JD-A** (the fossil): "2+ years experience in Node.js or Go. CS degree from a tier-1 college preferred."

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

the **6-month rubric score** is the second key. the JD-B hires scored 2.4 points higher on the same 4-dimension rubric. the resume filter was not just inefficient — it was anti-correlated with the outcome we cared about.

## the math

the resume filter is doing 3 things:

1. **filtering for a 2014-shaped engineer** — "2 years experience" was a reasonable proxy in 2014. in 2026, the proxy is broken.
2. **filtering out tier-2 and tier-3 candidates** — a tier-3 graduate with 30 PRs and a public cert is, on our data, a better hire than a tier-1 graduate with 2 years at a brand-name company and no public work.
3. **filtering out career-switchers** — the strongest backend engineer on our team in 2025 was a 28-year-old former chartered accountant who shipped 40 PRs in 6 months at a fintech bootcamp.

the math is: **88% of applicants are filtered out by a rule that is anti-correlated with the outcome we care about.** that is not a filter. that is a tax.

## the 4-step replacement

**step 1: replace the resume screen with a portfolio screen.** 1 link, 4 minutes, "is this a real, reviewable work record?" yes / no.

**step 2: replace the take-home with a 90-second in-browser exercise.** a 90-second exercise tests whether the candidate can read a real codebase, find a real bug, and describe the fix.

**step 3: replace the panel with a structured interview + a pushback round.** three reasoning questions, one short coding block, one pushback round. every answer is scored on the rubric. every reject has a written reason.

**step 4: publish the data.** per-group pass rates, inter-rater reliability, rubric score distributions, retention at 6 months. publish quarterly.

## what this costs

the rule costs the team **the engineers we did not hire.** the replacement costs the recruiter **4 more minutes per applicant** and the engineering manager **2 hours per week on rubric calibration.** the replacement is more expensive in dollars. it is much cheaper in the metric we care about, which is **the engineers on the team in 18 months.**

## what it does solve

it solves the tax. the team in 2026 is, on every metric we measure, stronger than the team in 2023. the resume rule was a tax. removing it was a refund.

---

*part 4 of the 2026-q3 series. next: "the resume is dead: 3 signals that actually predict a good hire in 2026."*

— dreamclerk team, chennai, june 2026
