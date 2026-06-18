// ─── beta data ─────────────────────────────────────────────────────────────
//
// Source of truth for every track that ships in the dreamclerk open beta.
//
// Structure:
//   - TRACKS: ordered list of every available track. UI iterates this for
//     the picker; state layer keys session by trackId; reviewer.js reads
//     tasks from currentTrack().
//   - BETA: back-compat alias for the AIML track (was the only track
//     pre-v0.2). Code that still does `import { BETA }` gets TRACKS[0].
//   - PRICING: free during beta, ₹999 post-beta.
//   - runNumberForToken: kept as a stable export even though it's not used.
//
// Adding a new track: copy one of the existing entries (e.g. AIML) into
// TRACKS, change `id`, `company`, `role`, `tasks`, and the scriptedMessages
// keys to be namespaced by your track id (see comment in scriptedMessages
// below). The LLM reviewer (reviewer.js) will pick up the new brief +
// acceptance list automatically.

const AIML = {
  id: "aiml-intern",
  n: "01",
  title: "AI/ML Engineering Intern",
  shortTitle: "AI/ML Intern",
  type: "ml",
  cohort: "orbit-labs-2026-summer",
  cohortSlug: "dc-2026-orbit",
  company: {
    id: "orbit-labs",
    name: "Orbit Labs",
    tagline: "AI/ML research, applied.",
    wiki: {
      about:
        "Orbit Labs is a 14-person research lab that turns papers into production. We work in 6-week cycles, ship to real users, and write a postmortem for every experiment — good or bad. We hire for taste, not for tech stack.",
      culture: [
        "we read papers on friday afternoons",
        "every experiment gets a hypothesis written down before the first line of code",
        "we share a single mlflow instance and a single model registry",
        "we treat data as a product — owners, contracts, freshness SLAs",
        "we ship behind a flag for at least 48h before promoting to 100%",
      ],
      tools: ["python 3.11", "transformers 4.40", "sklearn 1.5", "mlflow 2.18", "fastapi 0.115", "wandb", "postgresql 16"],
    },
  },
  role: {
    id: "aiml-intern",
    title: "AI/ML Engineering Intern",
    level: "Intern",
    durationDays: 5,
    xpTotal: 300,
  },
  tasks: [
    {
      id: "t1-drift",
      n: "01",
      title: "Diagnose sentiment-model drift",
      xp: 50,
      type: "ml-debugging",
      brief:
        "Our customer-feedback sentiment classifier dropped from 87% → 71% accuracy after last week's data refresh. You have the old training set, the new training set, the deployed model, and 100 sample predictions. Diagnose the cause and propose (or implement) a fix.",
      attached: [
        "train_v1.parquet — 12k rows, label dist 70/20/10",
        "train_v2.parquet — 14k rows (someone added 2k 'labelled' rows from a new source)",
        "model_v3.pkl — the deployed model",
        "sample_predictions.csv — 100 held-out reviews with predicted + true labels",
        "data_card.md — describes the new data source (and is wrong)",
      ],
      acceptance: [
        "Write diagnose.py that produces a 1-page HTML report: label dist shift, vocab shift, prediction confidence shift, per-class accuracy.",
        "Identify the root cause (hint: the new 2k rows are pseudo-labels from a previous model, not human-labelled).",
        "Propose a fix in 1 paragraph. Don't implement it.",
        "Submit the report + the diagnosis as a markdown file.",
      ],
      hints: [
        "Always read the data card before touching the data. It's a 30-second read that saves 30 minutes.",
        "If the new rows come from a different distribution, ask: who labelled them, and how?",
        "Plot the label distribution. If something looks too clean, it might be model-generated.",
      ],
    },
    {
      id: "t2-bert",
      n: "02",
      title: "Fine-tune BERT on customer support dataset",
      xp: 100,
      type: "model-training",
      brief:
        "Fine-tune distilbert-base-uncased on the customer support ticket dataset. Target F1 > 0.85 on the held-out test set. Submit a training script, the model artifact, and a 1-paragraph 'what worked, what didn't' writeup.",
      attached: [
        "tickets_train.csv — 8k rows, columns: text, label (billing/technical/account/shipping/other)",
        "tickets_test.csv — 2k rows, same schema",
        "baseline_logreg.pkl — F1 = 0.72 logistic regression baseline",
        "train.py starter — HuggingFace Trainer skeleton",
      ],
      acceptance: [
        "Training script runs end-to-end on the in-platform runtime (Python 3.11, transformers 4.40, no GPU — DistilBERT is small enough to fine-tune on CPU in ~20 min for 3 epochs).",
        "Test F1 > 0.85.",
        "Training log shows the F1 curve (use the in-platform experiment tracker).",
        "Submit: script, model (pickled weights), experiment log, writeup.",
      ],
      hints: [
        "If your F1 is high on average but low on the rare class, you have a class-imbalance problem, not a model problem.",
        "Save the tokenizer with the model. Always. A model without a tokenizer is a brick.",
        "3 epochs is usually the sweet spot for DistilBERT. More → overfit. Less → undertrain.",
      ],
    },
    {
      id: "t3-api",
      n: "03",
      title: "Build a churn-prediction API",
      xp: 75,
      type: "productionisation",
      brief:
        "Wrap the trained churn model in a FastAPI endpoint. Target p95 latency < 200ms. Submit the API code, a locustfile.py for load testing, and the load test results.",
      attached: [
        "churn_model.pkl — pre-trained sklearn logistic regression, ~50 features",
        "feature_schema.json — expected input schema",
        "inference_example.py — reference inference script",
      ],
      acceptance: [
        "POST /predict accepts a single customer JSON, returns { churn_probability: float, tier: 'low|medium|high' }.",
        "p95 latency < 200ms over 1000 requests with 10 concurrent users.",
        "Model is loaded once at startup, not per-request.",
        "Single integration test (one happy path).",
        "Returns 422 with a clear error message on bad input.",
      ],
      hints: [
        "If the latency is high, the first thing to check is: is the model loaded per-request? It should be loaded once at startup, ideally via FastAPI's lifespan context.",
        "Use Pydantic for input validation. It gives you the 422 for free and generates clean error messages.",
        "Run the load test. Don't guess the latency. The point of this task is to *measure*, not to *claim*.",
      ],
    },
    {
      id: "t4-audit",
      n: "04",
      title: "Audit the training data pipeline",
      xp: 75,
      type: "data-audit",
      brief:
        "The data team says there's no label leakage. The ML team says there is. Audit the pipeline. Write a 1-page report. If you find leakage, fix it.",
      attached: [
        "pipeline.py — the training data pipeline, ~200 lines",
        "feature_store_sample.csv — 50 rows from production",
        "data_dictionary.md",
      ],
      acceptance: [
        "Identify any sources of label leakage (feature computed using future info, target encoding on full data, etc.).",
        "For each issue: where it is, why it's leakage, how to fix it.",
        "If you fix it, retrain Task 2's model on the fixed data and report the new F1.",
        "Submit: report and (if you fixed) retrained model + new training script.",
      ],
      hints: [
        "There are 2 planted leakage issues. One is obvious, one is subtle. The obvious one is in the feature engineering step. The subtle one is in the target encoding step — it's fitting on the full dataset before the train/test split.",
        "If your F1 dropped after the 'fix', you probably introduced a different bug. Read the test set first.",
      ],
    },
  ],
  personas: {
    manager: {
      id: "anjali",
      name: "Anjali Rao",
      title: "Engineering Manager, Orbit Labs",
      avatar: "AR",
      timezone: "Asia/Kolkata",
      bio: "8 years in production ML. Ex-Microsoft, ex-Razorpay. Reads 2 papers a week. Asks 'what's your hypothesis?' before 'what's your code?'.",
      style: "calm, encouraging, holds the bar. never mean, never warm.",
      dailyGreeting:
        "morning. sprint plan's in your board. read the data card before you touch the data. ping me if blocked.",
    },
    techLead: {
      id: "vikram",
      name: "Vikram Iyer",
      title: "Tech Lead, ML Platform",
      avatar: "VI",
      timezone: "Asia/Kolkata",
      bio: "5 years building ML infra. Owns the model registry. Has strong opinions about feature stores, loosely held.",
      style: "direct, technical, no warmth. reviews in ≤5 min during work hours.",
    },
  },
  // Scripted message library.
  // ─── IMPORTANT — key naming convention ───
  // Per-track event keys are namespaced by track id so tracks don't collide.
  // Dispatch site (betaState.js scriptedReview) reads:
  //   `aiml-intern::t1-reject` for the AIML T1 reject line,
  //   `aiml-intern::day1-morning` for the day-1 chat, etc.
  // If you add a new event, prefix the key with `${this.id}::`.
  scriptedMessages: {
    "aiml-intern::day1-morning": (name) =>
      `morning ${name.split(" ")[0]}. sprint plan's in your board. read the data card before you touch the data. ping me if blocked.`,
    "aiml-intern::day1-after-t1": () => "good first submit. moving you to T2.",
    "aiml-intern::day3-no-progress": () => "hey — i see you're still on T1. is something blocking? happy to hop on a 1:1.",
    "aiml-intern::day5-sprint-end": () => "sprint's locked. i'll have your review by tomorrow. good work.",
    "aiml-intern::t1-reject": () =>
      "the report shows label shift but doesn't address pseudo-labeling. re-read the data card and check whether the new 2k rows are human-labelled or model-labelled. that's the smoking gun.",
    "aiml-intern::t1-approve": () =>
      "shipped. nice work — most interns stop at the dist plot. moving you to T2.",
    "aiml-intern::t2-reject": () =>
      "F1 is 0.91 but the confusion matrix shows class 'other' is at 0.62 — the model is just guessing on the rare class. add class weights or oversample. don't ship a model that scores high on average and fails on the tail.",
    "aiml-intern::t2-approve": () =>
      "shipped. F1 curve looks clean, tokenizer saved with the model, writeup is honest. moving you to T3.",
    "aiml-intern::t3-reject": () =>
      "latency is 340ms. you loaded the model per-request. load it once at startup. re-measure.",
    "aiml-intern::t3-approve": () =>
      "shipped. p95 is 142ms with 10 concurrent users, model is loaded once, error message tells the user what's wrong. this is the bar. moving you to T4.",
    "aiml-intern::t4-reject": () =>
      "you found the obvious leakage but missed the subtle one — check the target-encoding step. it's fitting on the full dataset before the train/test split.",
    "aiml-intern::t4-approve": () =>
      "shipped. you found both leakage issues, explained why they're leakage (not just that they are), and the retrained model's F1 went up. this is what research taste looks like.",
  },
  oneOnOneScript: [
    { speaker: "manager", text: "how's the sprint going? what's one thing that's harder than you expected?" },
    { speaker: "user", prompt: true, key: "blocker" },
    { speaker: "manager", text: "got it. one thing i'd push back on: most interns underestimate how much time the data audit takes. don't try to be clever — try to be thorough." },
    { speaker: "user", prompt: true, key: "concern" },
    { speaker: "manager", text: "thanks for sharing. last question: after this sprint, what's the one thing you want to learn next?" },
    { speaker: "user", prompt: true, key: "next" },
    { speaker: "manager", text: "noted. let's reconnect after the sprint. good work this week." },
  ],
  reviewer: {
    name: "Arjun S V",
    title: "Founder, DreamClerk",
    linkedin: "https://www.linkedin.com/in/arjun-sv-6bbb8a316/",
  },
};

const BACKEND = {
  id: "backend-intern",
  n: "02",
  title: "Backend Engineering Intern",
  shortTitle: "Backend Intern",
  type: "backend",
  cohort: "helio-cloud-2026-summer",
  cohortSlug: "dc-2026-helio",
  company: {
    id: "helio-cloud",
    name: "Helio Cloud",
    tagline: "edge compute for ML inference. 6 regions, 11ms p99.",
    wiki: {
      about:
        "Helio Cloud runs the inference layer for half the AI apps you've used this month. We do one thing — push a model behind a URL, do it fast, do it everywhere. We're 22 people, fully remote, on a 4-day work week.",
      culture: [
        "we ship behind a feature flag for 72h, not 24h",
        "every PR gets a load-test result, not a vibe",
        "we read other people's postmortems in a weekly meeting",
        "we treat the dashboard as a product — uptime graphs ship with release notes",
        "we don't ship on a Friday unless the on-call is paid double",
      ],
      tools: ["go 1.23", "postgres 16", "fastapi 0.115", "fly.io", "k6", "opentelemetry", "litestream"],
    },
  },
  role: {
    id: "backend-intern",
    title: "Backend Engineering Intern",
    level: "Intern",
    durationDays: 5,
    xpTotal: 300,
  },
  tasks: [
    {
      id: "t1-crud",
      n: "01",
      title: "Build a users API (CRUD + JWT auth)",
      xp: 75,
      type: "backend",
      brief:
        "Build a tiny users service. POST /users creates a user (hashes the password with bcrypt). GET /users/:id returns the user (no password). DELETE /users/:id removes the user. All routes require a valid JWT in the Authorization header except POST /users. Use the provided Postgres schema. Submit the API code, an OpenAPI 3.1 spec, and one integration test per route.",
      attached: [
        "schema.sql — 1 table (users: id uuid, email text unique, password_hash text, created_at timestamptz)",
        "seed.sql — 3 test users, password 'hunter2'",
        "auth_starter.py — JWT verify middleware skeleton",
      ],
      acceptance: [
        "POST /users with valid body returns 201 + { id, email, created_at } (no password).",
        "GET /users/:id returns 200 + the user record, 404 if missing, 401 if no/invalid JWT.",
        "DELETE /users/:id returns 204, 404 if missing, 401 if no/invalid JWT.",
        "Passwords are hashed with bcrypt — no plaintext in the DB.",
        "1 integration test per route (happy + 1 failure case each).",
        "OpenAPI 3.1 spec committed alongside the code.",
      ],
      hints: [
        "If your POST /users takes >100ms, you're doing something wrong (probably hashing on the main thread).",
        "Use HTTPException / abort() for 401/404 — don't return tuples.",
        "Run the tests. Don't claim they pass.",
      ],
    },
    {
      id: "t2-tests",
      n: "02",
      title: "Cover the users service with pytest",
      xp: 75,
      type: "backend",
      brief:
        "Take the API from T1. Add pytest fixtures (test DB, test client, JWT factory). Target 80% coverage on the handlers. Submit the test file + a coverage report (pytest-cov HTML output, or a screenshot of the report).",
      attached: [
        "the API code from T1",
        "conftest.py — empty starter",
      ],
      acceptance: [
        "conftest.py with: a test DB fixture (uses the schema from T1, truncated between tests), a TestClient fixture, a JWT factory fixture.",
        "≥ 80% line coverage on the handlers/ module (per pytest-cov).",
        "At least one test per error path: 401 (no JWT), 401 (bad JWT), 404 (missing user), 422 (bad body), 409 (duplicate email).",
        "Submit: conftest.py, test_users.py, the HTML coverage report.",
      ],
      hints: [
        "If a test hits the real DB, it will flake. Truncate between tests, every time.",
        "JWT factories: parametrize on 'expired' / 'wrong issuer' / 'valid' to cover the 401 paths in one test function.",
        "Don't measure coverage on conftest.py or the test files themselves. The brief says 80% on handlers.",
      ],
    },
    {
      id: "t3-leak",
      n: "03",
      title: "Diagnose the Go service memory leak",
      xp: 75,
      type: "backend",
      brief:
        "Production saw the billing-svc RSS climb from 80MB → 4.2GB over 6 hours, then OOM-killed. You have the pprof heap profile (text format), the last 2h of metrics, and the service code. Find the leak. Propose a fix in 1 paragraph. Don't ship the fix.",
      attached: [
        "billing_svc.go — the service, ~600 lines, 1 file",
        "heap.pprof — text-format pprof heap profile captured at 4.0GB RSS",
        "metrics.jsonl — 2h of {rss_mb, goroutines, gc_pause_p99_ms} at 30s intervals",
      ],
      acceptance: [
        "Open the pprof. Identify the 1-2 functions allocating the most retained memory.",
        "Walk the code and explain *why* they leak (subscription not removed? buffer never freed? map growing without bound?).",
        "Propose a 1-paragraph fix. Be specific (which line, what change).",
        "Submit: a markdown file with the diagnosis + the fix proposal.",
      ],
      hints: [
        "If `top` shows 90% in `runtime.mapassign`, the answer is 'an unbounded map somewhere'. Find where.",
        "If the leak only shows up at high QPS, look for per-request state being kept in a struct that lives longer than the request.",
        "Don't trust the heap profile alone. The metrics tell you if the leak is steady or bursty.",
      ],
    },
    {
      id: "t4-doc",
      n: "04",
      title: "Document the billing service",
      xp: 75,
      type: "backend",
      brief:
        "Write the developer-facing documentation for billing-svc. The next person who joins the team should be able to deploy it, debug it, and add a new endpoint to it without asking you. Submit a README.md and an OpenAPI 3.1 spec for the existing 7 endpoints.",
      attached: [
        "billing_svc.go — the service",
        "Makefile — current build commands",
        "deploy/fly.toml — current fly config",
        "an outdated README.md (you're replacing it)",
      ],
      acceptance: [
        "README.md covers: what the service does (1 paragraph), local dev setup (1 section), how to deploy (1 section), how to add a new endpoint (1 walkthrough), how to read the metrics (1 section), known gotchas (a short bullet list).",
        "OpenAPI 3.1 spec covers all 7 existing endpoints with request/response schemas.",
        "The 'add a new endpoint' walkthrough actually works — you can follow it to add a trivial /healthz-style route in <5 min.",
        "Submit: README.md, openapi.yaml.",
      ],
      hints: [
        "A README that says 'see code' is not a README. Future-you at 2am is the audience.",
        "If the deploy section doesn't say what env vars are required, it's incomplete.",
        "OpenAPI 3.1 is the new one (with JSON schema 2020-12). 3.0 is fine too but be explicit which.",
      ],
    },
  ],
  personas: {
    manager: {
      id: "rahul",
      name: "Rahul Bhatt",
      title: "Engineering Manager, Helio Cloud",
      avatar: "RB",
      timezone: "Asia/Kolkata",
      bio: "10 years on infra teams. Ex-Razorpay, ex-Postman. Believes load tests are a first-class deliverable.",
      style: "calm, exact. reviews code for the failure modes the author didn't think of.",
      dailyGreeting: "morning. your sprint is in the board. first task is CRUD, then tests, then a leak, then docs. ping me on slack if blocked.",
    },
    techLead: {
      id: "asha",
      name: "Asha Pillai",
      title: "Tech Lead, Edge Platform",
      avatar: "AP",
      timezone: "Asia/Kolkata",
      bio: "6 years writing Go on infra. Maintains the internal observability stack. Has read the Go memory model twice.",
      style: "terse, technical. will ask 'where's the test?' before 'how does it work?'.",
    },
  },
  scriptedMessages: {
    "backend-intern::day1-morning": (name) =>
      `morning ${name.split(" ")[0]}. your 5-day sprint is in the board. start with the CRUD task, then tests, then a real bug, then docs. ping me on slack if blocked.`,
    "backend-intern::day1-after-t1": () => "good first submit. your coverage is going to hurt tomorrow. moving you to T2.",
    "backend-intern::day3-no-progress": () => "hey — i see you're still on T1. is the JWT middleware eating you? happy to pair.",
    "backend-intern::day5-sprint-end": () => "sprint's locked. certs go out tomorrow. good work.",
    "backend-intern::t1-reject": () => "the POST works but your password is plaintext in the DB. bcrypt it, then re-submit.",
    "backend-intern::t1-approve": () => "shipped. clean CRUD, tests for the happy path. T2 is where the bar goes up.",
    "backend-intern::t2-reject": () => "coverage is 61% and your test for the duplicate-email case hits the real DB. truncate between tests, add the 409 path.",
    "backend-intern::t2-approve": () => "shipped. 84% on the handlers, conftest is clean. moving you to T3.",
    "backend-intern::t3-reject": () => "you said 'map' but didn't name the map, the file, or the line. the next person who reads this can't act on it.",
    "backend-intern::t3-approve": () => "shipped. you found the buffer pool, named the line, and the fix is one block of code. this is the bar.",
    "backend-intern::t4-reject": () => "the README is good but the 'add a new endpoint' walkthrough doesn't actually compile. follow your own steps and fix it.",
    "backend-intern::t4-approve": () => "shipped. the next person who joins can deploy on day 1. that's the bar.",
  },
  oneOnOneScript: [
    { speaker: "manager", text: "how's the sprint going? what's the hardest thing so far?" },
    { speaker: "user", prompt: true, key: "blocker" },
    { speaker: "manager", text: "got it. one thing to push back on: when you're stuck on a bug, write down your hypothesis before you read the next Stack Overflow answer. it forces you to commit." },
    { speaker: "user", prompt: true, key: "concern" },
    { speaker: "manager", text: "thanks. last one: after this sprint, what's the one thing you want to learn next — a framework, a concept, a habit?" },
    { speaker: "user", prompt: true, key: "next" },
    { speaker: "manager", text: "good. let's reconnect after the sprint. ship it." },
  ],
  reviewer: {
    name: "Arjun S V",
    title: "Founder, DreamClerk",
    linkedin: "https://www.linkedin.com/in/arjun-sv-6bbb8a316/",
  },
};

const FRONTEND = {
  id: "frontend-intern",
  n: "03",
  title: "Frontend Engineering Intern",
  shortTitle: "Frontend Intern",
  type: "frontend",
  cohort: "plyce-2026-summer",
  cohortSlug: "dc-2026-plyce",
  company: {
    id: "plyce",
    name: "Plyce",
    tagline: "design tool for product teams. 2.1M users, 0 enterprise sales.",
    wiki: {
      about:
        "Plyce is a Figma-meets-Notion product used by 2.1M designers and PMs. We don't have a sales team. Our growth is 'people who use it tell other people'. We hire for taste and for the care you put into the things you ship — every animation has a reason.",
      culture: [
        "every PR gets a 30s loom, not a 30-min meeting",
        "we test on a $200 android phone, not just the M-series macbook",
        "if a11y isn't in the PR template, the PR doesn't merge",
        "we ship small features, fast, behind flags",
        "we write copy like humans, not like marketing",
      ],
      tools: ["react 19", "vite", "tailwind", "framer-motion", "tanstack-query", "vitest", "axe-core"],
    },
  },
  role: {
    id: "frontend-intern",
    title: "Frontend Engineering Intern",
    level: "Intern",
    durationDays: 5,
    xpTotal: 300,
  },
  tasks: [
    {
      id: "t1-component",
      n: "01",
      title: "Build a reusable <DataTable />",
      xp: 100,
      type: "frontend",
      brief:
        "Build a reusable <DataTable /> in React + TypeScript. Sortable columns (click header to toggle asc/desc), client-side filter (1 text input filters across all columns), accessible (keyboard nav, screen-reader announces sort changes), no external deps beyond React itself. Submit the component, a story file with 3 example tables, and a 1-paragraph 'what you'd add next'.",
      attached: [
        "table_starter.tsx — empty component with the prop interface",
        "example_data.json — 50 rows of fake users",
      ],
      acceptance: [
        "Sortable: clicking a column header toggles asc/desc; the visual indicator updates; aria-sort is set correctly.",
        "Filter: a text input at the top filters rows in real time across all visible columns (case-insensitive substring).",
        "Accessible: tab order goes through header → input → rows; arrow keys move row focus; screen reader announces 'sorted by name, ascending'.",
        "No external deps beyond React. Implement sort + filter yourself.",
        "Story file with 3 example tables: small (5 rows), medium (50 rows), large (5000 rows, must stay under 16ms paint).",
      ],
      hints: [
        "If you re-sort on every keystroke for 5000 rows, you'll jank. Memoize.",
        "If the screen reader doesn't announce sort changes, you're missing aria-live or aria-sort updates.",
        "Type the prop interface first. The component is short — the types do the work.",
      ],
    },
    {
      id: "t2-a11y",
      n: "02",
      title: "Fix 5 a11y bugs in the given component",
      xp: 75,
      type: "frontend",
      brief:
        "You're given a CheckoutForm component with 5 planted a11y bugs. Fix them all. Run axe-core on the result, attach the output. Submit a 1-paragraph 'what the most subtle bug was and why'.",
      attached: [
        "CheckoutForm.tsx — the buggy component",
        "axe_baseline.txt — what axe-core complains about BEFORE your fixes",
      ],
      acceptance: [
        "After your fixes, axe-core reports 0 violations of severity 'serious' or 'critical' on the rendered form.",
        "The keyboard-only walkthrough (tab through the entire form, submit, see error) works end-to-end with a visible focus ring on every focusable element.",
        "1-paragraph writeup on the most subtle bug (not the obvious missing-label one).",
        "Submit: CheckoutForm.tsx, axe_after.txt (axe-core output after), writeup.md.",
      ],
      hints: [
        "Color contrast is the easy one. The subtle one is usually focus management after an action (modal close, dropdown open, error toast).",
        "axe-core doesn't catch everything. Test with a screen reader if you have one. If not, document the limits.",
        "Don't disable the browser's default focus styles unless you replaced them with a visible alternative.",
      ],
    },
    {
      id: "t3-api",
      n: "03",
      title: "Hook up a paginated fetch with loading + error states",
      xp: 75,
      type: "frontend",
      brief:
        "Build a <PaginatedList /> that fetches a paginated API and handles loading, error, empty, and 'load more' states. The API is mocked in /api/items?page=N (returns 20 items per page, 5 pages total, last page returns 0 items). Use TanStack Query or a tiny custom hook. Submit the component, the hook (or query setup), and a 1-paragraph note on what you'd add for production (auth, retries, prefetch).",
      attached: [
        "api_stub.py — a tiny FastAPI stub at /api/items?page=N",
        "PaginatedList_starter.tsx",
      ],
      acceptance: [
        "First page loads within 300ms on a fast connection, shows a skeleton during load.",
        "Click 'load more' → next page appends without scroll jump, without re-fetching prior pages.",
        "If the API 500s, show an error state with a retry button. Click retry → re-fetches the failed page only.",
        "If a page returns 0 items, hide the 'load more' button and show 'end of list'.",
        "Use TanStack Query (recommended) or a custom hook. If custom: keep cache invalidation correct.",
        "1-paragraph 'production note' on auth headers, retry strategy, prefetch-on-hover.",
      ],
      hints: [
        "If 'load more' re-fetches the first page, your cache key is wrong. page number must be in the key.",
        "Skeleton > spinner for lists. Always.",
        "Don't optimistically update on a list — wait for the server.",
      ],
    },
    {
      id: "t4-test",
      n: "04",
      title: "Write tests for <DataTable />",
      xp: 50,
      type: "frontend",
      brief:
        "Take the <DataTable /> from T1. Write 6 React Testing Library tests covering: empty state, sorted state, filter state, error state, keyboard nav, screen-reader announcement. Submit the test file + a screenshot of the coverage report.",
      attached: [
        "the <DataTable /> from T1",
        "vitest.config.ts",
      ],
      acceptance: [
        "6 tests, each ≤20 lines, each asserting exactly 1 user-visible behaviour.",
        "Tests do not reach into component internals (no getByTestId, no testing-library queries that bypass accessibility).",
        "Coverage on <DataTable /> is ≥ 90% lines, ≥ 80% branches (per vitest --coverage).",
        "All 6 tests pass on a fresh clone with `npm test && npm run test:coverage`.",
        "Submit: DataTable.test.tsx, coverage/lcov-report/index.html (or a screenshot of the summary).",
      ],
      hints: [
        "If a test needs to click a child element to assert a state change, write the test from the user's perspective — query by role, not by data-testid.",
        "Mock the data, not the component. If you're mocking <DataTable /> in its own test, you're testing the wrong thing.",
        "Keyboard nav test: simulate Tab + Enter + ArrowDown + Enter, then assert the row got focused.",
      ],
    },
  ],
  personas: {
    manager: {
      id: "meera",
      name: "Meera Krishnan",
      title: "Design Engineering Lead, Plyce",
      avatar: "MK",
      timezone: "Asia/Kolkata",
      bio: "8 years in design engineering. Wrote Plyce's first animation system. Believes a11y is a craft, not a checklist.",
      style: "warm, exact. reviews for taste, not for tests passing.",
      dailyGreeting: "morning. start with the <DataTable />. it sets the bar for the rest. ping me on slack if you want a 15-min pair.",
    },
    techLead: {
      id: "jaden",
      name: "Jaden Park",
      title: "Senior Frontend Engineer, Plyce",
      avatar: "JP",
      timezone: "America/Los_Angeles",
      bio: "5 years on the Plyce canvas. Maintains the design system. Hates a11y bugs with a passion.",
      style: "kind, technical. will send you the exact line + a one-line fix.",
    },
  },
  scriptedMessages: {
    "frontend-intern::day1-morning": (name) =>
      `morning ${name.split(" ")[0]}. the <DataTable /> is the warm-up — once that's solid, the rest flows. ping me if you want a 15-min pair on the keyboard nav.`,
    "frontend-intern::day1-after-t1": () => "good first submit. a11y is the bar from here. moving you to T2.",
    "frontend-intern::day3-no-progress": () => "hey — i see you're still on T1. is the screen-reader announce tripping you? try VoiceOver on macOS, it tells you immediately.",
    "frontend-intern::day5-sprint-end": () => "sprint's locked. certs go out tomorrow. nice work.",
    "frontend-intern::t1-reject": () => "the sort works but the screen reader doesn't announce it. add aria-sort + an aria-live region for sort changes. re-submit.",
    "frontend-intern::t1-approve": () => "shipped. clean component, types are tight, 5000 rows don't jank. this is the bar.",
    "frontend-intern::t2-reject": () => "the obvious one (color contrast) is fixed but the focus management after the error toast is still broken. tab to the close button, press enter — where does focus go?",
    "frontend-intern::t2-approve": () => "shipped. axe is clean, keyboard nav is clean, the subtle bug writeup is honest. moving you to T3.",
    "frontend-intern::t3-reject": () => "the retry button re-fetches the wrong page. your cache key is the row, not the page. fix the key.",
    "frontend-intern::t3-approve": () => "shipped. cache key is right, skeleton is clean, end-of-list state is correct. this is the bar.",
    "frontend-intern::t4-reject": () => "you're testing the component by mocking the component. test the user behaviour, not the internals.",
    "frontend-intern::t4-approve": () => "shipped. tests are user-perspective, coverage is 94%. this is what a frontend eng test suite looks like.",
  },
  oneOnOneScript: [
    { speaker: "manager", text: "how's the sprint going? what's the one thing that's harder than you expected?" },
    { speaker: "user", prompt: true, key: "blocker" },
    { speaker: "manager", text: "got it. one thing i'd push back on: a lot of frontend work is invisible until you test it on a real device. run your work on your phone before you submit." },
    { speaker: "user", prompt: true, key: "concern" },
    { speaker: "manager", text: "thanks. last one: after this sprint, what's the one thing you want to learn next — a11y patterns, animation, design systems?" },
    { speaker: "user", prompt: true, key: "next" },
    { speaker: "manager", text: "noted. let's reconnect after the sprint. ship it." },
  ],
  reviewer: {
    name: "Arjun S V",
    title: "Founder, DreamClerk",
    linkedin: "https://www.linkedin.com/in/arjun-sv-6bbb8a316/",
  },
};

const DATA = {
  id: "data-intern",
  n: "04",
  title: "Data Engineering Intern",
  shortTitle: "Data Intern",
  type: "data",
  cohort: "lattice-data-2026-summer",
  cohortSlug: "dc-2026-lattice",
  company: {
    id: "lattice-data",
    name: "Lattice Data",
    tagline: "the data warehouse for the next 100 AI companies.",
    wiki: {
      about:
        "Lattice runs the data layer for AI-native companies. We don't ship ML models — we make the data they train on trustworthy. 30 people, 8 enterprise customers, 0 marketing site until 2025.",
      culture: [
        "every query has a cost — we don't pretend it doesn't",
        "we treat the data catalog as a product, with a UI and release notes",
        "we hire for SQL taste — yes, SQL taste is a thing",
        "we run every PR against a 10x production-size dataset, not the dev one",
        "we write the postmortem the same day as the incident, not the same week",
      ],
      tools: ["postgres 16", "duckdb", "dbt 1.8", "snowflake", "great-expectations", "airflow", "looker"],
    },
  },
  role: {
    id: "data-intern",
    title: "Data Engineering Intern",
    level: "Intern",
    durationDays: 5,
    xpTotal: 300,
  },
  tasks: [
    {
      id: "t1-sql",
      n: "01",
      title: "Write 3 SQL queries against the events table",
      xp: 75,
      type: "data",
      brief:
        "You have an events table (user_id, event_name, properties jsonb, occurred_at timestamptz). Write 3 queries: (1) weekly active users for the last 8 weeks using a window function, (2) the top 5 events by user in the last 30 days using a CTE, (3) fix a provided subquery anti-pattern — rewrite it as a JOIN. Submit the 3 queries + a 1-paragraph note on the index each one would want in production.",
      attached: [
        "events_sample.csv — 10k rows of fake events for local testing",
        "schema.sql — the events table definition",
        "anti_pattern.sql — the query you need to rewrite",
      ],
      acceptance: [
        "Query 1 (WAU) returns 8 rows, one per week, with user counts. Uses a window function or date_trunc. Doesn't full-scan the table.",
        "Query 2 (top events) uses at least one CTE. Returns the event_name, distinct user count, total count.",
        "Query 3 is the provided query rewritten using a JOIN. The new query must return the same rows as the original.",
        "For each query, name the index you'd create in production (column, type).",
        "Submit: queries.sql (all 3), index_notes.md.",
      ],
      hints: [
        "If query 1 takes >500ms on 10k rows, you forgot an index hint or you're using a non-sargable function on the timestamp.",
        "Subquery anti-pattern: `WHERE x IN (SELECT ...)` is almost always slower than a JOIN. Rewrite it.",
        "If your CTE has a side effect (e.g. calls a function), it won't be inlined. Test the performance both ways.",
      ],
    },
    {
      id: "t2-dashboard",
      n: "02",
      title: "Build a 1-page Streamlit dashboard",
      xp: 75,
      type: "data",
      brief:
        "Take query 1 (WAU) and query 2 (top events) from T1. Build a Streamlit dashboard that shows them as 2 charts (a line chart for WAU, a bar chart for top events), with a date-range selector at the top. Submit the streamlit_app.py + a screenshot of the rendered dashboard.",
      attached: [
        "queries from T1 (queries.sql)",
        "events_sample.csv",
      ],
      acceptance: [
        "streamlit_app.py runs with `streamlit run streamlit_app.py` and opens at localhost:8501.",
        "The date-range selector actually changes the data in both charts.",
        "The line chart for WAU has week labels on the x-axis (not raw dates).",
        "The bar chart for top events is sorted descending by user count.",
        "A screenshot of the rendered dashboard is committed alongside the code.",
        "Submit: streamlit_app.py, dashboard.png (screenshot).",
      ],
      hints: [
        "If your date filter is in Python instead of in SQL, the dashboard will be slow once the table has 10M rows.",
        "Streamlit caches by hash — if the date range changes, the cache miss is automatic. Use @st.cache_data on the query.",
        "If the line chart shows raw dates, use pandas to set the index to a PeriodIndex or use plotly express with x='week_label'.",
      ],
    },
    {
      id: "t3-quality",
      n: "03",
      title: "Audit a dataset for 4 quality issues",
      xp: 75,
      type: "data",
      brief:
        "You're given a customers.csv (10k rows, 18 columns). Audit it for 4 quality issues: nulls in required fields, duplicate rows (full + by email), label drift (a categorical column that drifted from its expected distribution), and stale records (rows older than 2 years that should be archived). Submit a 1-page report with the count + a 1-line recommendation per issue.",
      attached: [
        "customers.csv — 10k rows, 18 columns",
        "schema.md — what's expected per column (nullability, range, allowed values)",
      ],
      acceptance: [
        "For each of the 4 issue types: the count of affected rows + a representative row id.",
        "For drift: name the column, the expected vs actual distribution, the divergence metric (e.g. KL, JS).",
        "For duplicates: distinguish exact row duplicates from email-based duplicates (the same email with slightly different timestamps).",
        "Recommendation per issue: archive / drop / fix-pipeline / accept-and-monitor. 1 line each.",
        "Submit: quality_audit.md (the report), audit.py (the script you ran).",
      ],
      hints: [
        "If you treat all duplicates as 'delete them', you'll lose data — the email-based duplicates might be a pipeline bug worth fixing, not a data issue worth erasing.",
        "Drift detection: don't eyeball a histogram. Use a divergence metric (JS distance is symmetric and bounded, 0..1).",
        "If a 'stale' row is still being read by a dashboard, archiving it is a regression. Read the dashboards before recommending.",
      ],
    },
    {
      id: "t4-doc",
      n: "04",
      title: "Write the data dictionary",
      xp: 75,
      type: "data",
      brief:
        "Write the data dictionary for the events table (the one from T1-T3). For each column: description, type, nullability, expected range / allowed values, an example value, the pipeline that owns it, and the freshness SLA. Submit a markdown file (one section per column) + a dbt schema.yml that enforces the rules in CI.",
      attached: [
        "events table schema (from T1)",
        "the 3 pipelines that write to it (names + 1-line descriptions)",
      ],
      acceptance: [
        "Every column in events is documented in the dictionary: description, type, nullability, range/values, example, owning pipeline, freshness SLA.",
        "dbt schema.yml includes: not_null tests on the required fields, accepted_values tests on the categorical fields, relationships tests on the foreign keys.",
        "Running `dbt test` on the schema.yml returns 0 errors against the provided sample.",
        "Submit: data_dictionary.md, schema.yml.",
      ],
      hints: [
        "A data dictionary that doesn't say who owns the column is half a dictionary.",
        "Freshness SLA without a metric is a wish, not an SLA. 'fresh within 1h, measured by max(occurred_at) lag' is a SLA.",
        "If the dbt tests pass on the sample but you didn't think through the failure mode, the tests are theatre. Pick 1 column and write down: when this test fails, who gets paged?",
      ],
    },
  ],
  personas: {
    manager: {
      id: "deepa",
      name: "Deepa Venkatesh",
      title: "Head of Data, Lattice Data",
      avatar: "DV",
      timezone: "Asia/Kolkata",
      bio: "10 years on data teams. Ex-Snowflake, ex-Razorpay. Believes the dictionary is the product.",
      style: "exact, kind. reviews for whether the next person can act on the doc, not for whether it's pretty.",
      dailyGreeting: "morning. your 5-day sprint is in the board. start with the SQL, then the dashboard, then a real audit, then a dictionary. ping me on slack if blocked.",
    },
    techLead: {
      id: "kai",
      name: "Kai Nakamura",
      title: "Senior Data Engineer, Lattice",
      avatar: "KN",
      timezone: "Asia/Tokyo",
      bio: "7 years writing SQL on petabyte tables. Has opinions on CTEs vs subqueries and is happy to die on that hill.",
      style: "technical, terse. will rewrite your query in front of you if it's slow.",
    },
  },
  scriptedMessages: {
    "data-intern::day1-morning": (name) =>
      `morning ${name.split(" ")[0]}. your 5-day sprint is in the board. start with the SQL warm-up — once that flows, the dashboard is 1 hour. ping me if blocked.`,
    "data-intern::day1-after-t1": () => "good first submit. your queries are correct; the index notes are the bar from here. moving you to T2.",
    "data-intern::day3-no-progress": () => "hey — i see you're still on T1. is the subquery rewrite tripping you? a join with a distinct is usually the answer.",
    "data-intern::day5-sprint-end": () => "sprint's locked. certs go out tomorrow. good work.",
    "data-intern::t1-reject": () => "query 1 is correct but it does a full scan on 10k rows. add a covering index on (occurred_at, user_id) and the time drops 10x. re-submit.",
    "data-intern::t1-approve": () => "shipped. the index notes are specific (column, type, why). that's the bar.",
    "data-intern::t2-reject": () => "the dashboard renders but the date filter is in pandas, not in SQL. on 10M rows it will take 30s. push the filter down to the query.",
    "data-intern::t2-approve": () => "shipped. SQL-side filter, cache is correct, charts are sorted. moving you to T3.",
    "data-intern::t3-reject": () => "the duplicate count is right but the recommendation is 'delete them'. some of those are a pipeline bug, not a data issue. split the recommendation.",
    "data-intern::t3-approve": () => "shipped. you distinguished the 4 issue types, named the divergence metric, and the recommendations are specific. this is the bar.",
    "data-intern::t4-reject": () => "the dictionary is good but no column has a freshness SLA. a SLA without a metric is a wish. add a metric + an owner per column.",
    "data-intern::t4-approve": () => "shipped. the dictionary has owners, the dbt tests cover the rules, and the SLA has a metric. this is what a data dictionary looks like in production.",
  },
  oneOnOneScript: [
    { speaker: "manager", text: "how's the sprint going? what's the one thing that's harder than you expected?" },
    { speaker: "user", prompt: true, key: "blocker" },
    { speaker: "manager", text: "got it. one thing to push back on: data work feels invisible until you write the doc that someone else can act on. the dictionary is the test." },
    { speaker: "user", prompt: true, key: "concern" },
    { speaker: "manager", text: "thanks. last one: after this sprint, what's the one thing you want to learn next — query optimization, lineage, dbt, data quality?" },
    { speaker: "user", prompt: true, key: "next" },
    { speaker: "manager", text: "noted. let's reconnect after the sprint. ship it." },
  ],
  reviewer: {
    name: "Arjun S V",
    title: "Founder, DreamClerk",
    linkedin: "https://www.linkedin.com/in/arjun-sv-6bbb8a316/",
  },
};

export const TRACKS = [AIML, BACKEND, FRONTEND, DATA];

// Back-compat for any code that still reads BETA.foo (the AIML track was the
// only one pre-v0.2; many call sites haven't been updated). TRACKS[0] === AIML.
export const BETA = AIML;

export const TRACK_IDS = TRACKS.map((t) => t.id);

export function getTrack(trackId) {
  return TRACKS.find((t) => t.id === trackId) || AIML;
}

// ─── pricing gate (D-paid) ──────────────────────────────────────────────────
// Per §11 — beta is free, post-beta is ₹999.
export const PRICING = {
  betaPriceInr: 0,
  postBetaPriceInr: 999,
  postBetaPriceInrNote: "estimated v0.2 launch price. confirmed at retro on 2026-07-06.",
};

// ─── helper: deterministic run number from token ───────────────────────────
// Each invite token is single-use for a single sprint run. Re-runs get a new
// run number but the same token. v0.2 will tie this to a real DB row.
export function runNumberForToken(token) {
  if (!token) return 0;
  let h = 0;
  for (let i = 0; i < token.length; i++) h = (h * 31 + token.charCodeAt(i)) | 0;
  return Math.abs(h) % 1000;
}
