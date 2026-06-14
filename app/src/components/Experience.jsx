import { useEffect, useState } from "react";
import { getSubscriberCount } from "../lib/supabase";

export default function Experience() {
  const [subscriberCount, setSubscriberCount] = useState(1847);

  useEffect(() => {
    let cancelled = false;
    getSubscriberCount().then((n) => {
      if (!cancelled) setSubscriberCount(n);
    });
    return () => { cancelled = true; };
  }, []);

  return (
    <section id="experience" className="dark-block merge-dark" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <div className="section-head reveal">
          <div>
            <div className="label">02 · gain experience</div>
          </div>
          <div>
            <h2>gain experience. not degrees.</h2>
            <p className="lede">
              what if you could ship 18 production-grade features before you graduate? the dreamclerk workspace runs in your browser, talks to your terminal, and reviews your prs — exactly like a real engineering job, because that is what it is.
            </p>
          </div>
        </div>

        <div className="exp-grid reveal">
          <div className="exp-card">
            <span className="k">/01 shipped code</span>
            <div className="v">1,200<span className="unit">+</span></div>
            <p className="d">production-grade prs reviewed and merged by an ai tech lead across all active sprints.</p>
          </div>
          <div className="exp-card">
            <span className="k">/02 hours coded</span>
            <div className="v">38,500</div>
            <p className="d">in-browser ide time logged by undergrads this quarter — real terminal, real docker, real jupyter.</p>
          </div>
          <div className="exp-card">
            <span className="k">/03 reviews cleared</span>
            <div className="v">4,712</div>
            <p className="d">line-level feedback loops on security, performance, readability, and edge cases. the harshest reviewer in your career.</p>
          </div>
          <div className="exp-card">
            <span className="k">/04 sprints survived</span>
            <div className="v">96</div>
            <p className="d">8-week sprints shipped end-to-end inside simulated companies — nexara, vivacity, levanto, oxygon.</p>
          </div>
          <div className="exp-card">
            <span className="k">/05 certs issued</span>
            <div className="v">218</div>
            <p className="d">verified work records, blockchain-anchored, recruiter-checkable. not attendance badges.</p>
          </div>
          <div className="exp-card">
            <span className="k">/06 placed</span>
            <div className="v">85<span className="unit">%</span></div>
            <p className="d">dreamclerk graduates who walked into a real tech offer within 90 days of earning their certificate.</p>
          </div>
        </div>

        <div className="exp-waitlist reveal">
          <span className="pulse" />
          <div>
            <div className="num">{subscriberCount.toLocaleString("en-IN")}</div>
            <div className="lbl">undergrads already on the waitlist</div>
          </div>
          <button
            className="btn solid ml-auto"
            onClick={() => document.dispatchEvent(new CustomEvent("open-modal"))}
            data-open-source="experience"
          >
            join waitlist <span className="arr">→</span>
          </button>
        </div>
      </div>
    </section>
  );
}
