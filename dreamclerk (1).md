# DreamClerk — *Live the Job Before You Land It*

> **Tagline:** Not a course. Not a tutorial. A career — simulated in real time.  
> **Certificate Promise:** Not a completion badge. A verified work record.

---

## The Core Idea

DreamClerk is a **real-world career simulation platform** for undergraduate students. The technical workspace — a full in-browser IDE, live terminal, sandboxed codebase, AI code reviewer, and real task queue — is the **beating heart of the platform.** Everything else (the company, the manager, the teammates, the Slack messages) exists to give that code meaning and context.

Students don't learn to code here. They **ship code, get it reviewed, fix bugs, hit deadlines, survive production incidents, and earn certificates that prove they did the work** — the same work a real company would pay them to do.

You don't study here. **You work here.**

---

## The Core Loop

```
APPLY → GET HIRED → DO THE JOB (IN THE IDE) → GET REVIEWED → EARN XP
→ CLEAR TECHNICAL INTERVIEW → GET PROMOTED → EARN CERTIFICATE → UNLOCK NEXT LEVEL
```

1. **Apply like it's real.** AI recruiter screens your profile, conducts a live conversational interview for the role. Pass = hired. Fail = detailed feedback, retry next sprint.
2. **Day 1 onboarding.** You're handed a codebase, an architecture doc, a Slack channel, and your first ticket — just like a real first day.
3. **Tasks arrive like real work.** A bug ticket. A feature spec from Figma. A model to fine-tune. A REST API to design. A failing test suite to fix.
4. **You code. AI reviews like a senior engineer.** Line-level feedback on correctness, security, performance, readability, and edge cases.
5. **You rise.** Intern → Junior → Mid → Senior → Lead. Each level requires a technical interview and a capstone project.
6. **You earn a verified Experience Certificate** — backed by your actual code submissions, AI review scores, and sprint velocity. Not attendance. Work.

---

## The Technical Workspace — This Is DreamClerk's Core

The workspace is a **full professional development environment inside the browser.** Zero setup. Zero downloads. Open the platform, and you're already inside a codebase.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  DreamClerk Workspace  —  Nexara  /  Sprint 6  /  Task #341: Auth Bug Fix   │
├─────────────────┬───────────────────────────────────┬───────────────────────┤
│                 │                                   │                       │
│   FILE TREE     │        CODE EDITOR                │   AI CODE REVIEWER    │
│                 │        (Monaco — VS Code engine)  │                       │
│  📁 src/        │                                   │  Reviewing: auth.js   │
│   ├ auth.js  ←  │  // auth.js                       │  ─────────────────    │
│   ├ api.js      │  const login = async (req) => {   │  ✅ Logic is correct  │
│   ├ middleware/ │    const { email, pass } = req    │  ⚠️ No error handling │
│   └ utils.js    │    const user = await db.query(   │  ❌ SQL injection risk │
│                 │      `SELECT * FROM users         │  💡 Use parameterised │
│  📁 tests/      │       WHERE email=${email}`       │     queries instead   │
│   └ auth.test   │    )                              │                       │
│                 │    return user                    │  Score: 61 / 100      │
│  📋 Task #341   │  }                                │  [See Full Review]    │
│  ─────────────  │                                   │                       │
│  Fix auth bug   │                                   │  [Submit PR]          │
│  reported by    │  >  Terminal                      │                       │
│  client (P1)    │  $ npm test                       │                       │
│                 │  FAIL auth.test.js                │                       │
│  Due: 5 PM      │  ● login › should handle error    │                       │
│                 │                                   │                       │
└─────────────────┴───────────────────────────────────┴───────────────────────┘
```

### What the Workspace Includes:

| Feature | What It Is |
|---|---|
| **Monaco Code Editor** | The same engine that powers VS Code, running in-browser |
| **Integrated Terminal** | Real bash terminal, sandboxed per student per task |
| **Sandboxed Runtime** | Docker-based microVM — run Node, Python, Java, Go safely |
| **In-Browser Jupyter** | Full notebook environment for ML/Data tasks (JupyterLite, WASM) |
| **SQL Playground** | Per-student sandboxed PostgreSQL for database tasks |
| **AI Code Reviewer** | Inline feedback on every submission — security, performance, style |
| **PR Flow** | Submit code as a pull request; AI Tech Lead reviews and either merges or requests changes |
| **Test Runner** | Pre-written test suites; students must make them pass |
| **Live Logs & Debugger** | Console logs, error traces, stack inspection |
| **Figma Handoff Panel** | For frontend tasks — design spec, asset export, redlines |
| **Postman-style API Tester** | Test your own endpoints before submitting |

---

## Role Tracks — Technical Tracks Are the Core

### 🧑‍💻 TECHNICAL TRACKS

---

#### 1. Frontend Engineering
**What you build:** Real UI components, full product features, performance improvements

```
Intern    → Static HTML/CSS pages, fix broken UI bugs, basic JavaScript
Junior    → React components, state management (Redux/Zustand), API integration
Mid       → Feature ownership, performance audits, accessibility (WCAG), testing
Senior    → Design system architecture, micro-frontends, cross-browser strategy
Lead      → Tech roadmap, frontend hiring bar, design-eng alignment
```

**In the workspace you'll use:**
- React / Next.js / Vue (depending on company)
- Tailwind CSS, CSS Modules
- TypeScript
- Jest + React Testing Library
- Lighthouse performance audits
- Figma design-to-code handoff
- GitHub-style PR flow with code review

**Sample Tasks:**
- "The checkout button breaks on mobile Safari. Reproduce and fix."
- "Build the notifications dropdown from this Figma spec."
- "Our Lighthouse score is 54. Get it above 85."

---

#### 2. Backend Engineering
**What you build:** APIs, services, database schemas, authentication systems

```
Intern    → Write GET/POST endpoints, understand REST, fix failing tests
Junior    → Build CRUD APIs, JWT auth, write unit + integration tests
Mid       → Design services, caching layer, query optimisation, rate limiting
Senior    → System design, distributed architecture, security reviews
Lead      → Define API contracts, own SLAs, architect for scale
```

**In the workspace you'll use:**
- Node.js (Express/Fastify) or Python (FastAPI/Django) or Java (Spring Boot)
- PostgreSQL, Redis, MongoDB
- Docker, REST, GraphQL
- Jest / Pytest for testing
- Postman-style API tester built in
- Simulated CI/CD pipeline

**Sample Tasks:**
- "The /users endpoint is leaking password hashes. Fix it before the security audit."
- "Build a rate-limiter middleware for our public API — 100 req/min per user."
- "Our DB queries are timing out under load. Profile and optimise the top 3 slow queries."

---

#### 3. Full Stack Engineering
A combined path — students rotate between frontend and backend tasks within the same sprint, mirroring real full-stack roles at product startups. Must be comfortable in both tracks before applying.

---

#### 4. AI / ML Engineering
**What you build:** ML pipelines, model training, inference APIs, evaluation frameworks

```
Intern    → Run notebooks, explore datasets, basic EDA, visualisations
Junior    → Train classification models, evaluate precision/recall/F1, compare baselines
Mid       → Feature engineering, ML pipelines, model versioning with MLflow
Senior    → Deploy models to production (FastAPI + Docker), monitor drift, run A/B tests
Lead      → Define ML strategy, research new architectures, own model governance
```

**In the workspace you'll use:**
- Jupyter Notebooks (in-browser, JupyterLite)
- Python: scikit-learn, PyTorch, TensorFlow, Hugging Face Transformers
- MLflow / Weights & Biases for experiment tracking
- Pandas, NumPy, Matplotlib, Seaborn
- FastAPI for model serving
- Simulated production monitoring dashboard

**Sample Tasks:**
- "Our sentiment model's accuracy dropped from 87% to 71% after last week's data update. Diagnose and retrain."
- "Fine-tune a BERT model on this customer support dataset. Target F1 > 0.85."
- "Build a prediction API endpoint that serves our churn model with under 200ms latency."

---

#### 5. Data Science & Analytics
**What you build:** Dashboards, statistical models, A/B test frameworks, business reports

```
Intern    → Write SQL queries, clean messy datasets, build basic charts
Junior    → Statistical analysis, Python notebooks, KPI dashboards
Mid       → Predictive models, A/B testing, data storytelling for stakeholders
Senior    → Experimentation frameworks, causal inference, data strategy
Lead      → Analytics org design, BI ownership, self-serve analytics culture
```

**In the workspace you'll use:**
- SQL editor (sandboxed PostgreSQL)
- Python: pandas, scipy, statsmodels
- In-platform dashboard builder (Tableau-like)
- dbt for data transformation
- Jupyter Notebooks

**Sample Tasks:**
- "Marketing wants to know if the new homepage increased sign-ups. Run the A/B test analysis."
- "Build a monthly churn dashboard for the product team. Pull data from the warehouse."
- "The weekly sales report has been wrong for 3 weeks. Find the bug in the pipeline."

---

#### 6. Software Engineering (General)
A track for students who want a broad engineering experience — touching backend, frontend, DevOps, and system design without specialising. Great for product engineers and startup generalists.

```
Intern    → Bug fixes across the stack, reading and understanding a large codebase
Junior    → Own small features end-to-end, write tests, participate in code review
Mid       → Lead a feature from spec to deploy, mentor intern
Senior    → System design ownership, cross-team technical lead
Lead      → Engineering manager track — planning, hiring bar, technical vision
```

---

#### 7. DevOps / Cloud Engineering
**What you build:** CI/CD pipelines, infrastructure, deployment automation, monitoring

```
Intern    → Write shell scripts, understand pipeline stages, fix broken builds
Junior    → Dockerise services, set up GitHub Actions, manage staging environments
Mid       → Kubernetes, Terraform, infrastructure as code, incident response
Senior    → Multi-cloud architecture, SRE practices, chaos engineering
Lead      → Platform engineering, cost optimisation, 99.99% uptime ownership
```

**In the workspace you'll use:**
- Terminal (sandboxed bash)
- Docker playground
- GitHub Actions simulator
- Simulated AWS / GCP console
- Terraform (sandboxed)
- Grafana-style monitoring dashboard

**Sample Tasks:**
- "The deployment pipeline is failing on step 3 for the last 6 hours. Fix it before the release."
- "Dockerise the Python service and write a compose file with the database."
- "Set up autoscaling for the API pods based on CPU > 70%."

---

#### 8. Cybersecurity
**What you build:** Security reports, patches, threat models, incident responses

```
Intern    → Spot vulnerabilities in code samples, understand OWASP Top 10
Junior    → Run security scans, patch CVEs, write security advisories
Mid       → Threat modeling, penetration testing simulations, security reviews
Senior    → Security architecture, incident response playbooks
Lead      → CISO-level strategy, compliance (SOC2, ISO 27001), security culture
```

**In the workspace you'll use:**
- Simulated vulnerability scanner
- OWASP checklist tooling
- CTF-style challenge environment
- Code review with security lens
- Incident report templates

---

### 💼 NON-TECHNICAL TRACKS (Supporting Roles)

| Track | What they do inside the platform |
|---|---|
| 🎯 Product Management | Write PRDs, prioritise backlogs in Jira-like board, work with engineering and design |
| 📣 Marketing & Growth | Run campaigns, write briefs, analyse funnel data, present to stakeholders |
| 💰 Finance & Analyst | Build financial models in in-platform Excel, create investor decks |
| 💼 Business Analyst | Write requirements, stakeholder interviews, process documentation |
| 🧠 Consulting | Case studies, slide decks, client presentations, recommendations |
| 🗣️ HR & People Ops | Hiring simulations, performance reviews, culture initiatives |

**Total: 14 tracks × 5 seniority levels = 70+ unlockable role states**

---

## The Experience Certificate System

### How Certificates Are Earned:
Certificates are **not given for completing a course.** They are earned by completing a full role cycle at a seniority level:

```
Complete 3 Sprints at level  →  Clear Technical Interview  →  Complete Capstone Project
                                                                        ↓
                                                          Certificate Issued (Pass / Merit / Distinction)
```

### What a Certificate Contains:
- Student name, role title, seniority level, company name
- Duration of simulation (e.g., "8 weeks as Junior Backend Engineer at Nexara")
- Performance metrics: Sprint completion rate, AI review average score, PR merge rate
- Capstone project summary
- Unique certificate ID — **blockchain-verified hash** (tamper-proof)
- QR code for instant recruiter verification
- DreamClerk digital seal

### Certificate Tiers:
| Tier | How Earned |
|---|---|
| **Pass** | Completed all sprints, cleared interview, submitted capstone |
| **Merit** | Above-average AI review scores + on-time delivery rate > 80% |
| **Distinction** | Top 10% score in your cohort + exceptional capstone evaluation |

### Recruiter Verification:
Any recruiter can scan the QR code or enter the certificate ID on dreamclerk.io/verify and see:
- The real work samples behind the certificate
- AI review scores per submission
- Sprint velocity and consistency
- Side-by-side comparison with cohort benchmarks

**This is not a completion certificate. It is a verified work record.**

---

## The Simulated Companies

Students join fictional but hyper-realistic companies — each with its own codebase culture, tech stack, and engineering practices:

| Company | Domain | Tech Stack | Culture |
|---|---|---|---|
| **Nexara** | Tech Startup | React, Node.js, PostgreSQL, AWS | Ship fast, break things responsibly |
| **Orbit Labs** | AI/ML Research | Python, PyTorch, Hugging Face, Jupyter | Research-first, paper culture |
| **VaultX** | Fintech | Java, Spring Boot, Kafka, Kubernetes | Reliability obsessed, compliance-heavy |
| **Meridian Corp** | Consulting/Analytics | Python, SQL, Power BI, dbt | Structured, data-driven, formal |
| **Pulse Media** | Product & Growth | Next.js, Figma, Firebase, Amplitude | Design-led, fast iteration |
| **GreenStack** | Climate Tech | Python, GIS APIs, open source tools | Mission-driven, documentation culture |

Each company has: an internal GitHub-style repo, architecture docs, a Slack-like channel with real AI teammates, a PR review culture, and an engineering culture guide students read on Day 1.

---

## The XP System

### XP is earned by:
- Submitting tasks on time ⏱️
- AI review score on code quality ⭐
- PR approved on first review vs multiple revision cycles
- Passing unit tests on first submission
- Handling Crisis Mode incidents 🔥
- Completing sprint goals on Friday review 📅
- Mentoring juniors (Senior level) 🤝
- Cross-functional collaboration (e.g., backend + frontend working together)

### XP Penalties:
- Missed deadline → XP deduction + manager message
- Critical bug in "production" → XP deduction + post-mortem required
- PR rejected 3+ times → mandatory code review session with AI Tech Lead

### XP Unlocks:
- Higher seniority levels
- New companies (harder environments, different stacks)
- Crisis Mode access
- Capstone project eligibility
- Certificate unlock
- Recruiter profile visibility

---

## Signature Features

### 🔥 Crisis Mode — Production Emergencies
Random, unannounced, time-boxed emergencies:
- "API returning 500s for 10,000 users. Logs are attached. Fix it."
- "ML model accuracy dropped 20% post-deploy. Diagnose. Rollback or patch?"
- "Critical CVE found in a dependency. Patch, test, and redeploy before 6 PM."
- "Database at 98% capacity. Optimise or migrate — you have 2 hours."

Students get: a timer, real logs, access to the codebase, and an AI SRE as a partner. Solution is evaluated on speed, correctness, and post-mortem quality.

### 🎙️ Technical Interview Simulation
Required before every level-up. Three rounds:

**Round 1 — DSA & Problem Solving**
Live coding in the IDE. Timed. Problems scale with seniority.
- Intern: Arrays, strings, basic sorting
- Junior: Trees, graphs, dynamic programming basics
- Mid: System design component problems
- Senior: Full system design — "Design a rate limiter at scale"

**Round 2 — Technical Deep Dive**
AI interviewer asks about your recent work:
- "Walk me through the auth bug you fixed in Sprint 6."
- "Why did you choose Redis over Memcached for the cache layer?"
- "What would you do differently if you had to rebuild this API?"

**Round 3 — Behavioural (STAR Format)**
- "Tell me about a time you missed a deadline."
- "How did you handle a disagreement with your tech lead?"

All three rounds scored. Feedback given win or lose.

### 🔬 Capstone Projects (Required for Certificate)
One major project at the end of each seniority level:

| Track | Capstone |
|---|---|
| Frontend | Build a full product feature end-to-end from a Figma spec, including tests and accessibility |
| Backend | Design and implement a microservice with auth, rate limiting, and full test coverage |
| AI/ML | Train, evaluate, deploy a model with a live monitoring dashboard and drift detection |
| DevOps | Set up a complete CI/CD pipeline with staging, prod, rollback, and monitoring |
| Full Stack | Build a small product — backend API + frontend UI — solo in 2 weeks |
| Data Science | Deliver a full analysis report with model, dashboard, and stakeholder presentation |

Capstone quality directly determines certificate tier.

### 🌐 Cross-Company Sprints
Students from different companies collaborate on a shared deliverable. Nexara's backend team builds an API; Orbit Labs' ML team integrates a model into it; Pulse Media's frontend team builds the UI. Mirrors real inter-company engineering projects.

### 📂 The Code Portfolio Engine
Every PR, notebook, bug fix, and capstone auto-compiles into a **professional technical portfolio:**
- GitHub-style contribution graph
- Projects with tech stack, context, and AI review scores
- Side-by-side: original code vs. AI-suggested improvements
- Exportable as PDF
- Shareable link for recruiters
- One-click LinkedIn and resume integration

---

## Platform UI — What It Looks and Feels Like

When a student logs in, they see **a professional work desktop**, not a learning platform.

```
┌──────────────────────────────────────────────────────────────────┐
│  DreamClerk                              Mon, 10:02 AM  [Nexara] │
├──────────┬───────────────────────────────────────────────────────┤
│          │                                                       │
│  🏠 Home │   📌 TODAY:  Sprint 4, Day 3                         │
│  📧 Mail │   ─────────────────────────────────────────────────  │
│  💬 Chat │   Task #341  →  Fix auth bug (P1, due 5 PM)  [OPEN]  │
│  💻 IDE  │   Task #344  →  Write unit tests for /api/user       │
│  📋 Board│                                                       │
│  🔬 Lab  │   💬 #engineering — Nexara                           │
│  📊 XP   │   Tech Lead: "@you PR looks good, one comment"       │
│  🏆 Cert │   Priya (AI): "Can someone help with the DB schema?" │
│  👤 Profile                                                      │
│          │   [Open IDE]   [View PR]   [Team Chat]               │
└──────────┴───────────────────────────────────────────────────────┘
```

**Key Screens:**

- **Home Dashboard** — Your sprint, today's tasks, team messages, XP progress bar
- **The IDE Workspace** — Monaco editor, terminal, AI reviewer, test runner, task context panel
- **The Jupyter Lab** — For ML/Data tracks — full notebook environment, dataset viewer
- **The Task Board** — Kanban: Backlog → In Progress → In Review → Done, with ticket details
- **The Inbox** — Email threads from managers, clients, HR — you reply, AI continues
- **The War Room** — Crisis Mode only. Ticking clock, live logs, pressure.
- **Career Profile** — Public page: role, company, XP, certificates, code portfolio
- **The Promotion Board** — Your next level requirements, interview scheduler, capstone brief
- **Certificate Vault** — All earned certificates, download PDF, share link, LinkedIn connect

---

## AI-Powered People You Work With

| Person | Behaviour |
|---|---|
| **Your Manager** | Sets sprint goals, gives performance feedback, approves or blocks promotions |
| **Tech Lead** | Reviews every PR. Asks "why did you choose this approach?" Demands clean code. |
| **Colleague (Dev)** | Pair programming partner. Sometimes sends half-baked code for you to review. |
| **The Client** | Files tickets, changes requirements, escalates to your manager when unhappy |
| **Junior Under You** (Senior+) | Submits buggy code. You must review it, give feedback, and teach them. |
| **HR** | Monthly check-ins, performance conversations, wellness pings |
| **The Interviewer** | Shows up at level-up time. Serious. No hints. |

Every AI persona has a personality profile — demanding, chill, micromanager, visionary — that shifts their communication style and what they tolerate.

---

## Monetisation

| Tier | What's Included | Price |
|---|---|---|
| **Free** | 1 track, 1 company, Intern level, 5 hrs IDE/month, no certificate | ₹0 |
| **Pro** | All tracks, all companies, unlimited IDE, all levels, certificates, portfolio export | ₹399/month |
| **Campus License** | All Pro features for all students, admin dashboard for college, placement analytics | Custom |
| **Recruiter Access** | Browse verified profiles, filter by track/level/score, direct contact | ₹X/month |
| **Placement Partner** | Post real jobs directly to top performers on the platform | Custom |
| **Certificate Verify API** | Companies integrate our API into their ATS for instant background check | Usage-based |

---

## The Growth Roadmap

```
Phase 1 — Technical MVP
  ├── IDE workspace live (Monaco + terminal + sandboxed runtime)
  ├── 3 tracks: Frontend, Backend, AI/ML
  ├── 2 companies: Nexara, Orbit Labs
  ├── Intern + Junior levels
  ├── Basic XP system
  └── First certificate: Junior Engineer Certificate

Phase 2 — Full Platform
  ├── All 8 technical tracks + 6 non-technical tracks
  ├── All 6 companies, all 5 seniority levels
  ├── Crisis Mode, Cross-Company Sprints
  ├── Capstone projects + full certificate system
  └── Public recruiter-facing profiles

Phase 3 — Real World Bridge
  ├── Recruiter dashboard + job board
  ├── Certificate verification API (ATS integration)
  ├── LinkedIn badge integration
  └── Campus placement analytics portal

Phase 4 — Live Multiplayer
  ├── Real students fill teammate slots alongside AI
  ├── Hackathon Mode: 48-hour team sprints
  ├── Open source simulation: contribute to shared internal repos
  └── DreamClerk Leaderboard: public, by track, by cohort
```

---

## Why DreamClerk Wins

| What Exists | What DreamClerk Does Differently |
|---|---|
| LeetCode / HackerRank | Isolated DSA problems vs. real product engineering context with a manager and a deadline |
| Udemy / Coursera | Watch videos vs. ship code and get reviewed by an AI senior engineer |
| Internships | Hard to get, limited seats vs. open to every UG student, anytime |
| GitHub portfolio | Self-directed, no validation vs. company-context work with AI review scores |
| Bootcamps | Generic curriculum vs. role-specific, level-progressive, certificate-backed simulation |
| College projects | Solo, unreviewed vs. team environment with real feedback loops |

**DreamClerk doesn't teach you to code. It puts you inside a real codebase, assigns you a P1 bug, tells you the client is watching, and asks you to fix it before 5 PM.**

---

## The Certificate Promise

> *"You didn't complete a course. You spent 8 weeks as a Junior Backend Engineer at a simulated fintech company — writing APIs, fixing production bugs, getting your PRs reviewed, surviving two incidents, and shipping a capstone microservice. Here's your certificate. Here's your verified work record. Go get hired."*

Every DreamClerk Experience Certificate is backed by:
- Actual code you wrote
- AI review scores on every submission
- Sprint velocity and delivery consistency
- A capstone project employers can read
- A blockchain-verified ID that can't be faked

---

*Built for the student who doesn't want to be told what a job feels like. They want the bug ticket, the PR review, the 5 PM deadline, the manager message, and the certificate on the other side.*
