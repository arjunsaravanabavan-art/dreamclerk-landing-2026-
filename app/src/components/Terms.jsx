import { useEffect } from "react";
import SectionLabel from "./SectionLabel.jsx";
import { RouterLink } from "../lib/router.jsx";

const LAST_UPDATED = "2026-11-11";

export default function Terms() {
  useEffect(() => {
    document.title = "terms & conditions — dreamclerk";
  }, []);

  return (
    <section className="section legal" id="terms">
      <div className="wrap legal__wrap">
        <SectionLabel status="ok">$ cat /legal/terms.md</SectionLabel>

        <h1 className="legal__title">terms &amp; conditions</h1>
        <p className="legal__meta">last updated · {LAST_UPDATED}</p>

        <p className="legal__lede">
          these terms explain the rules for using dreamclerk. by creating an account or using the platform, you agree to them. if you do not agree, do not use the platform.
        </p>

        <h2>$ 01 · the service</h2>
        <p>
          dreamclerk provides online career-practice experiences, including simulated teams, project tasks, workspaces, feedback, community features, and records of work. features may change, be limited, or be unavailable from time to time. descriptions on the site explain the experience being offered; they are not a promise that every feature, project, or cohort will always be available.
        </p>

        <h2>$ 02 · practice, not a job offer</h2>
        <p>
          unless a separate written agreement says otherwise, dreamclerk is a learning and career-practice service. simulated companies, coworkers, tickets, deadlines, reviews, interviews, and hiring scenarios are part of that experience. using dreamclerk does not create employment, an internship, an agency, or a partnership with dreamclerk or a company featured in a simulation. participation, feedback, or a certificate does not guarantee a job, interview, academic credit, income, or a particular career outcome.
        </p>

        <h2>$ 03 · your account</h2>
        <ul>
          <li>provide information that is accurate and keep it reasonably up to date.</li>
          <li>keep your sign-in details private and tell us promptly if you think someone else has accessed your account.</li>
          <li>you are responsible for activity carried out through your account, except where applicable law says otherwise.</li>
          <li>use the service only if you can legally agree to these terms. if you are under the age of majority where you live, obtain permission from a parent or legal guardian before using it.</li>
        </ul>

        <h2>$ 04 · your work and conduct</h2>
        <p>
          you keep ownership of work and other material you create or submit. you give dreamclerk permission to host, copy, display, and process that material only as reasonably needed to operate, secure, support, and improve the service, provide requested feedback, and create any work record you request. this permission is worldwide, non-exclusive, and lasts only as long as those purposes or legal obligations require. you confirm that you have the rights needed to submit the material and that your submissions do not unlawfully use someone else’s work or confidential information.
        </p>
        <p>you agree not to:</p>
        <ul>
          <li>misrepresent your identity, qualifications, work, or results, or submit work as your own when it is not;</li>
          <li>harass, threaten, discriminate against, or exploit another person;</li>
          <li>use the service to break the law, send spam, distribute malware, or infringe another person’s rights;</li>
          <li>probe, disrupt, overload, reverse engineer, or bypass security or access controls, except where applicable law permits it;</li>
          <li>share another person’s private information or confidential material without permission.</li>
        </ul>

        <h2>$ 05 · dreamclerk materials and feedback</h2>
        <p>
          dreamclerk and its licensors retain their rights in the platform, software, branding, templates, and materials they provide. we give you a limited, personal, non-transferable right to use those materials as part of the service. do not copy, resell, or publicly redistribute them except where the service or applicable law permits it. you may use feedback and general skills you gain, while respecting the rights and confidentiality of others.
        </p>

        <h2>$ 06 · automated and third-party services</h2>
        <p>
          some feedback or features may use automated systems, including AI. automated output can be incomplete or wrong; review it before relying on it. third-party services may have their own terms and privacy practices. dreamclerk does not control services operated by others, and their terms apply when you use them.
        </p>

        <h2>$ 07 · pricing and refunds</h2>
        <p>
          any price, payment schedule, cancellation window, or refund rule that applies to a paid offering will be shown before you enroll or pay. these terms do not create a fee where none has been disclosed. mandatory rights under applicable consumer-protection law continue to apply.
        </p>

        <h2>$ 08 · privacy</h2>
        <p>
          our <RouterLink to="/privacy">privacy policy</RouterLink> explains how personal information is handled. please review it before using the service. you can contact us at <a href="mailto:info@dreamclerk.com">info@dreamclerk.com</a> with privacy or account questions.
        </p>

        <h2>$ 09 · suspension and ending use</h2>
        <p>
          you may stop using dreamclerk at any time. we may restrict or suspend access when reasonably necessary to protect users, the service, or legal rights; respond to a serious or repeated breach of these terms; or comply with law. where practical, we will give notice and a chance to address the issue. you may contact <a href="mailto:hi@dreamclerk.com">hi@dreamclerk.com</a> if you believe access was restricted by mistake. provisions that need to continue after access ends, such as ownership, accrued payment obligations, and liability terms, will continue to apply.
        </p>

        <h2>$ 10 · availability and responsibility</h2>
        <p>
          we work to keep dreamclerk useful and available, but the service is provided as available and may contain errors or interruptions. to the extent permitted by law, dreamclerk is not responsible for indirect or consequential loss arising from use of the service. nothing in these terms excludes responsibility that cannot legally be excluded, including liability for fraud or deliberate misconduct. these terms do not limit consumer rights that applicable law protects.
        </p>

        <h2>$ 11 · changes to the service or these terms</h2>
        <p>
          we may update the service and these terms. we will post the current terms here and revise the date above. if a change materially affects users, we will provide reasonable notice through the service or another contact method where practicable. changes apply from their stated effective date; if you do not agree, stop using the affected service.
        </p>

        <h2>$ 12 · governing law</h2>
        <p>
          these terms are governed by the laws of India, subject to any mandatory protections that apply where you live. disputes will be handled by courts with jurisdiction under applicable law.
        </p>

        <h2>$ 13 · contact</h2>
        <p>
          questions about these terms? email <a href="mailto:hi@dreamclerk.com">hi@dreamclerk.com</a>. for privacy matters, see the <RouterLink to="/privacy">privacy policy</RouterLink> or email <a href="mailto:dpo@dreamclerk.com">dpo@dreamclerk.com</a>.
        </p>

        <p className="legal__back">
          <RouterLink to="/">← back to dreamclerk</RouterLink>
        </p>
      </div>
    </section>
  );
}
