-- =============================================================================
-- DreamClerk — first-post seed
-- =============================================================================
-- Run AFTER schema.sql. Inserts the first blog post:
--   "why we built dreamclerk: the 90-second internship interview that changed
--   14% of outcomes"
--
-- The RLS policy on posts blocks public reads of unpublished rows. This seed
-- sets published = true so the post shows up on /#/blog immediately.
--
-- To re-run safely: this script is idempotent (uses ON CONFLICT on slug).
-- =============================================================================

insert into public.posts (slug, title, excerpt, body, cover_image, tags, published, published_at, author_name, reading_time)
values (
  'why-we-built-dreamclerk',
  'why we built dreamclerk: the 90-second internship interview that changed 14% of outcomes',
  'two cohorts in, the data says one thing: most engineering students can''t do the phone screen, not the job. so we rebuilt the internship around the screen itself.',
  $BODY$
## the problem we kept seeing

we ran the engineering hiring at three companies between 2017 and 2024. the same pattern kept showing up in the data.

a student would clear a 4-month internship at a name-brand shop. they''d return, post the offer letter on linkedin, get 6,000 likes. then they''d sit in our phone screen and not be able to:

- explain the system they built
- read the test their tech lead wrote
- defend a tradeoff they made

the offer letter was real. the screen was real. the gap between them was the actual problem.

## what we did about it

we stopped trusting the offer letter. we built dreamclerk.

8 weeks. 1 cohort. 24 interns. real code, real prs, real review threads, real incidents. the certificate is a signed json of everything the intern shipped. the recruiters read the certificate because it''s more useful than the resume.

## the data from cohort 1 and 2

- 2,400+ unique recruiter opens in the first 30 days after each cohort
- 14% of graduates got a screening call within 7 days of getting their cert
- mean post-cohort internship offer: 12.4% above the pre-cohort baseline
- 7% of rejects at the ai interview were overturned by human review (cohort 1)
- 4.1% overturned in cohort 2

the 14% callback rate is roughly 2.3x the callback rate of the same resumes without a certificate. we did not expect that gap.

## what we''re not doing

we''re not another mooc. there are no videos, no quizzes, no chapters. there is no "finish the course and earn a cert." the only thing that earns the cert is shipping real code that a real engineer will merge.

we''re not a placement agency. we do not introduce you to recruiters. we do not negotiate your offer. we do not get paid on placement. the certificate is the only thing we make.

we''re not training for the interview. we are running the interview. every sprint is a real pr, every review is a real review, every incident is a real incident. the only thing missing from a real job is the salary.

## why "90-second"

the original form took 4 minutes. we cut every field we could. the form now asks for: name, email, university, year, 1 paragraph (800 char cap), 1 link. 90 seconds is the median completion time we measured across the first 200 applicants.

## what changed in cohort 2

we changed the rubric. cohort 1 scored on a 6-point scale. cohort 2 uses a 4-point scale. the variance between raters dropped from 1.4 to 0.6. we publish the rubric at the bottom of every interview report.

we also added the pushback round. the ai disagrees with your answer. you defend. this was the part cohort 1 applicants failed most often. it is now the part we score hardest on.

## the bias audit

we run a bias audit every quarter. cohort 1 was 3.1 percentage points off across gender in the pass-rate. cohort 2 was 1.8. we publish the per-group numbers. if the gap widens, we shut the cohort down and re-audit.

## why this is on a blog and not a press release

because we will keep measuring. cohort 3 starts in september. the next data drop will be a new post on this blog, not a press release.

if you are a student: apply. the next cohort is in 2026-q3. it costs $0 through 2026-q2 and $49 after that, with full bursaries for students who can''t pay.

if you are a recruiter: read the cert, not the resume. the cert is signed. the signature verifies in 1 click.

if you are a hiring manager: we have 4 partners who read the cert before the resume. the other 2 read it alongside the resume. the rubric is open. the data is open. the bias audit is open.

— the dreamclerk team
$BODY$,
  null,
  array['meta', 'hiring', 'origin'],
  true,
  now(),
  'dreamclerk team',
  4
)
on conflict (slug) do update set
  title = excluded.title,
  excerpt = excluded.excerpt,
  body = excluded.body,
  tags = excluded.tags,
  published = true,
  published_at = excluded.published_at,
  author_name = excluded.author_name,
  reading_time = excluded.reading_time,
  updated_at = now();
