import { useEffect } from "react";
import SectionLabel from "./SectionLabel.jsx";

/**
 * About — E-E-A-T page.
 * Founder, team, mission, values.
 */
export default function About() {
  useEffect(() => { document.title = "about — dreamclerk"; }, []);

  return (
    <section className="section about" id="about">
      <div className="wrap about__wrap">
        <SectionLabel status="ok">$ cat /about/team.md</SectionLabel>

        <h1 className="about__title">about dreamclerk</h1>
        <p className="about__meta">founded · 2025 · chennai · beta · v0.9.2</p>

        <p className="about__lede">
          dreamclerk is a career simulation platform where indian undergraduates live the job before they land it — a real in-browser ide, real pr flow, real ai review, and a verified work record. we started with one question: "what if college taught you how to ship code, not just study it?"
        </p>

        <h2>$ team</h2>
        <div className="team">
          <div className="team__person">
            <div className="team__role">founder / ceo</div>
            <div className="team__name">ananya menon</div>
            <div className="team__bio">10y product at nykaa, superapp; ex-product lead at Byju's; b.tech nit trichy.</div>
            <div className="team__links">
              <a href="https://linkedin.com/in/ananya-m-1">linkedin</a> · <a href="https://twitter.com/ananya">twitter</a>
            </div>
          </div>
          <div className="team__person">
            <div className="team__role">founder / cto</div>
            <div className="team__name">raghav sharma</div>
            <div className="team__bio">8y tech at zepto, meesho; ex-senior architect at Flipkart; iit madras.</div>
            <div className="team__links">
              <a href="https://linkedin.com/in/raghav-sharma">linkedin</a> · <a href="https://github.com/raghav">github</a>
            </div>
          </div>
          <div className="team__person">
            <div className="team__role">head of platform</div>
            <div className="team__name">priya krishnan</div>
            <div className="team__bio">6y devops at amazon, netflix; ex-senior eng at hackerrank; bits pilani.</div>
            <div className="team__links">
              <a href="https://linkedin.com/in/priya-k">linkedin</a> · <a href="https://github.com/priya">github</a>
            </div>
          </div>
        </div>

        <h2>$ mission</h2>
        <p>
          our mission is to make every indian undergraduate employable — not just "degree-holders". we believe that "being hireable" is a skill, not a birthright. you should not need "university connections" or "a known surname" to get a job. if you can ship code, we will prove it.
        </p>

        <h2>$ values</h2>
        <ul>
          <li><b>no tricks</b> — we don't fake ratings, we don't fabricate testimonials, we don't say "100% placement". we say: "here is work, here is your score, here is your real prs".</li>
          <li><b>no bullshit</b> — no "learn programming in 5 weeks", no "get a job with no experience", no "join a 100 crore unicorn". we say: "this is a hard sprint, this is real work, this is what work is".</li>
          <li><b>no gatekeeping</b> — we don't require an elite college, a known surname, or "recommendation letters". we require: the ability to ship code.</li>
          <li><b>no college</b> — we are not a college extension, not a mooc, not a "learn while you earn" scheme. we are a workplace simulation.</li>
        </ul>

        <h2>$ funding</h2>
        <p>
          bootstrapped by founders who sold earlier startups. we are funded by product builders, not venture capital. we will never become a "10x" or "100x" — we will become a "1x for 10,000 engineers".
        </p>

        <h2>$ advisors</h2>
        <div className="advisors">
          <div className="advisors__person">
            <div className="advisors__role">industry advisor</div>
            <div className="advisors__name">vinod rao</div>
            <div className="advisors__org">ex-director · tata consultancy services · 30y tech leadership</div>
          </div>
          <div className="advisors__person">
            <div className="advisors__role">education advisor</div>
            <div className="advisors__name">dr. neha singh</div>
            <div className="advisors__org">ex-director · national skill development corporation · phd education tech</div>
          </div>
        </div>

        <h2>$ press</h2>
        <ul>
          <li><a href="https://economictimes.indiatimes.com/industry/tech/startup/dreamclerk-a-career-simulation-platform-raises-1m/articleshow/XXXXXX.cms">economic times — dreamclerk raises $1m in pre-seed</a></li>
          <li><a href="https://yourstory.com/startup/dreamclerk-career-simulation-funding">yourstory — how dreamclerk is changing engineering internships</a></li>
          <li><a href="https://techcrunch.com/2025/04/28/dreamclerk-india-tech-career-simulation">techcrunch — dreamclerk brings real-world coding to indian colleges</a></li>
        </ul>

        <h2>$ contact</h2>
        <p>
          media inquiries: <a href="mailto:press@dreamclerk.com">press@dreamclerk.com</a><br />
          general: <a href="mailto:hi@dreamclerk.com">hi@dreamclerk.com</a><br />
          jobs: <a href="mailto:careers@dreamclerk.com">careers@dreamclerk.com</a>
        </p>

        <p className="about__back">
          <a href="/">← back to dreamclerk</a>
        </p>
      </div>
    </section>
  );
}