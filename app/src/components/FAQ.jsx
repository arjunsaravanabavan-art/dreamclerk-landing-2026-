const faqs = [
  { q: "is this another course or tutorial platform?", a: "no. there are no videos, no chapters, no quizzes. you apply to a simulated company, get hired, and work real tickets in a real codebase. the only content is the work itself." },
  { q: "do i need a powerful laptop or install anything?", a: "no. dreamclerk runs in the browser. your ide, terminal, jupyter, and sql playground are all sandboxed cloud envs. chromebook works. low-end windows works. even your phone in a pinch." },
  { q: "is the certificate recognised by employers?", a: "it is verified, not accredited. every certificate links to your actual prs, code, and review threads. employers can see the work. that is what they care about. the first 12 cohort graduates are going into 4 hiring-partner companies." },
  { q: "what if i have never shipped code?", a: "that is literally who this is built for. start as an intern. the tasks are scoped to your level. you can be a non-cs grad and complete the frontend intern track in one sprint." },
  { q: "how is the ai recruiter different from a chatbot?", a: "it runs a structured, conversational interview scored against role-specific rubrics. it asks follow-ups, tests reasoning, and pushes back on weak answers. most candidates say it is harder than a real hr screen." },
  { q: "what if i fail the interview?", a: "you get a rubric-scored debrief and a 7-day cool-down. most candidates pass on attempt 2 or 3. nobody is locked out permanently." },
  { q: "can i switch tracks mid-sprint?", a: "yes on pro and cohort. on sprint, you finish your track first. switching is free for pro and cohort within the first 14 days." },
  { q: "do you offer scholarships?", a: "yes. we reserve 20% of every cohort for students with household income below ₹6 lakh/yr. apply through the same form — select the income-based track." },
];

export default function FAQ() {
  return (
    <section id="faq">
      <div className="wrap">
        <div className="section-head reveal">
          <div>
            <div className="label">09 · the disclaimers</div>
          </div>
          <div>
            <h2>questions, answered honestly.</h2>
            <p className="lede">
              if something here sounds too good, it probably is. here is what we are honest about.
            </p>
          </div>
        </div>

        <div className="faq reveal">
          {faqs.map((f, i) => (
            <details key={f.q} open={i === 0}>
              <summary>
                <span className="n">/{String(i + 1).padStart(2, "0")}</span>
                <span className="q">{f.q}</span>
                <span className="ic">+</span>
              </summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
