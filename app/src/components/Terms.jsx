import { useEffect } from "react";
import SectionLabel from "./SectionLabel.jsx";
import { RouterLink } from "../lib/router.jsx";

/**
 * Terms — concise, no boilerplate for its own sake.
 */
export default function Terms() {
  useEffect(() => { document.title = "terms — dreamclerk"; }, []);

  return (
    <section className="section legal" id="terms">
      <div className="wrap legal__wrap">
        <SectionLabel status="ok">$ cat /legal/terms.md</SectionLabel>

        <h1 className="legal__title">terms of service</h1>
        <p className="legal__meta">last updated · 2026-06-15 · v1.3</p>

        <p className="legal__lede">
          using dreamclerk means you agree to these terms — short version: be respectful, do your own work, no hacks. full version below.
        </p>

        <h2>$ what you give us</h2>
        <ul>
          <li><b>your commitment</b> — 9-to-6 sprint hours, 5 days a week, for 8 weeks. this is not a "whenever you feel like it" course.</li>
          <li><b>your authenticity</b> — your profile data is real. your work is yours. no resume inflation, no copy-paste from the internet.</li>
        </ul>

        <h2>$ what we promise you</h2>
        <ul>
          <li><b>no kidding</b> — we don't pretend this is a mooc with a certificate. it is real work, real prs, real reviews.</li>
          <li><b>valid cert</b> — the work record certificate you get is verifiable publically. we don't fake it.</li>
          <li><b>no tricks</b> — no hidden fees during 2026-q2 beta. no subscriptions. no upsells.</li>
          <li><b>support</b> — response to your emails within 48 hours for non-urgent issues, within 4 hours for system outages.</li>
        </ul>

        <h2>$ what you may not do</h2>
        <ul>
          <li><b>no cheating</b> — don't share your login, don't ask others to do your work, don't copy your final project from stack overflow.</li>
          <li><b>no bad apples</b> — no harassment, no bigotry, no threats, no serious disruption to the environment.</li>
          <li><b>no hacking</b> — no sql injection, no xss, no csrf, no api abuse, no ddos.</li>
          <li><b>no spam</b> — no self-promotion, no pyramid schemes, no "earn money from home" posts.</li>
        </ul>

        <h2>$ acceptable use</h2>
        <ul>
          <li>use the platform to build a work record. that's it.</li>
          <li>share your certificate with employers. that's it.</li>
          <li>help fellow students on public forums (stack overflow, reddit, etc.). that's it.</li>
          <li>contact support if you can't do something technical. that's it.</li>
        </ul>

        <h2>$ acceptable sharing</h2>
        <ul>
          <li>you may share your verified work certificate on linkedin and github.</li>
          <li>you may share your work record with potential employers (that's the point).</li>
          <li>you may share your experience with education blogs or news outlets (please ask first).</li>
          <li>you may not share your login, your homework, or solutions to assignments.</li>
        </ul>

        <h2>$ our liability</h2>
        <p>we are not liable for: your inability to find a job, the specific job you get, or third-party discrimination. we are not liable for: typos, minor bugs, the internet being slow, or your laptop dying during a sprint. we are not liable for: acts of god, war, or government shutdowns.</p>

        <h2>$ termination</h2>
        <p>we can terminate your account immediately if: you cheat, harass others, or break the law. you can terminate your account anytime. no refunds during beta.</p>

        <h2>$ changes to these terms</h2>
        <p>we will email you if we change these terms significantly. continued use after the change = agreement.</p>

        <h2>$ governing law</h2>
        <p>these terms are governed by the laws of india, specifically the digital personal data protection act, 2023. no exceptions.</p>

        <p className="legal__back">
          <RouterLink to="/">← back to dreamclerk</RouterLink>
        </p>
      </div>
    </section>
  );
}
