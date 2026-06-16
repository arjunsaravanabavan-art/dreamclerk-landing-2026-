// 24 gigs, 8 tracks × 3 each — all the rich mock content lives here
// so the JSX in WorkspacePage.jsx stays a thin renderer.

// ═══════════════════════════════════════════════════════════════════════════
// SOURCE STRINGS — code/YAML/SQL/markdown blocks for the code IDE tracks
// ═══════════════════════════════════════════════════════════════════════════

const AUTH_TS = "import { sign } from './auth';\n\nexport async function issue(claims) {\n  const token = await sign({\n    sub: claims.userId,\n    exp: Date.now() + 3600_000,\n    jti: crypto.randomUUID(),\n  });\n  return token;\n}";

const AUTH_TEST_TS = "import { describe, it, expect } from 'vitest';\nimport { issue, verify } from './auth';\n\ndescribe('auth.issue', () => {\n  it('rejects expired tokens', async () => {\n    const tok = await issue({ sub: 1, exp: -1 });\n    await expect(verify(tok)).rejects.toThrow();\n  });\n});";

const PKG_JSON = '{\n  "name": "@nexara/auth",\n  "version": "1.4.2",\n  "dependencies": {\n    "vitest": "^1.0.0",\n    "jose": "^5.0.0"\n  }\n}';

const T_BE_IDE = "$ npm test\n> vitest run\n\n ✓ auth.test.ts (4)\n   ✓ rejects expired\n   ✓ rejects replayed\n   ✓ rejects malformed\n   ✓ signs roundtrip\n\n tests  4 passed (412ms)";

const MAIN_SH = "#!/bin/bash\n# sprint 4 — refactor a kafka consumer\nset -euo pipefail\n\nkafka-topics --create --topic events.user.signup --partitions 3\nkafka-console-consumer --topic events.user.signup --from-beginning";

const CONFIG_TOML = '[kafka]\nbootstrap_servers = "kafka.nexara.internal:9092"\nconsumer_group = "auth-svc-v3"\nauto_offset_reset = "earliest"';

const T_BE_TERM = "$ ./main.sh\n[INFO] connecting to kafka.nexara.internal:9092\n[INFO] consumer joined group auth-svc-v3\n[INFO] partition 0: offset 0 → 1247 events\n[INFO] partition 1: offset 0 → 1102 events\n[INFO] partition 2: offset 0 → 1156 events";

const DOCKERFILE = "FROM node:20-alpine\nRUN apk add --no-cache python3 make g++\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci --only=production\nCOPY . .\nEXPOSE 3000\nCMD [\"node\", \"src/index.js\"]";

const REQS_TXT = "fastapi==0.110.0\npydantic==2.6.0\nuvicorn==0.27.0";

const T_BE_RT = "$ node --version\nv20.11.1\n$ python --version\nPython 3.12.4\n$ go version\ngo version go1.22.0\n$ java --version\nopenjdk 21.0.2 2024-01-16";

const BUTTON_TSX = "import { forwardRef } from 'react';\n\ntype Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {\n  variant?: 'solid' | 'ghost';\n  size?: 'sm' | 'md' | 'lg';\n};\n\nexport const Button = forwardRef<HTMLButtonElement, Props>(\n  ({ variant = 'solid', size = 'md', children, ...rest }, ref) => (\n    <button\n      ref={ref}\n      data-variant={variant}\n      data-size={size}\n      {...rest}\n    >\n      {children}\n    </button>\n  )\n);";

const BUTTON_STORIES = "import { Button } from './Button';\n\nexport default { title: 'Button', component: Button };\n\nexport const Solid = () => <Button>click me</Button>;\nexport const Ghost = () => <Button variant=\"ghost\">cancel</Button>;\nexport const Sizes = () => (\n  <div>\n    <Button size=\"sm\">sm</Button>\n    <Button size=\"md\">md</Button>\n    <Button size=\"lg\">lg</Button>\n  </div>\n);";

const T_FE_CANVAS = "$ npm run storybook\n> react-vite-storybook@1.0.0 storybook\n> storybook dev -p 6006\n\n✓ started in 1.8s\n● chromatic · 12 visual tests queued\n● a11y pass · axe-core 0 violations";

const LIGHTHOUSE_RC = '{\n  "ci": {\n    "collect": { "url": ["https://vivacity.in/"] },\n    "assert": {\n      "preset": "lighthouse:no-pwa",\n      "assertions": {\n        "categories:performance": ["error", { "minScore": 0.95 }],\n        "categories:accessibility": ["error", { "minScore": 0.95 }],\n        "first-contentful-paint": ["error", { "maxNumericValue": 1200 }],\n        "largest-contentful-paint": ["error", { "maxNumericValue": 1800 }]\n      }\n    }\n  }\n}';

const PERF_BUDGET = '{\n  "js": "120kb",\n  "css": "20kb",\n  "image-per-route": "180kb",\n  "ttfb": "200ms"\n}';

const T_FE_PERF = "$ lhci autorun\n✓ /              score 97\n✓ /dashboard     score 96\n✓ /pricing       score 95\n✗ /legacy        score 78  ← budget fail, will block merge\n\n bundlesize · 118kb js / 18kb css / within budget";

const A11Y_TEST = "import { axe, toHaveNoViolations } from 'jest-axe';\nimport { render, screen } from '@testing-library/react';\nimport { Login } from './Login';\n\nexpect.extend(toHaveNoViolations);\n\ntest('login form is accessible', async () => {\n  const { container } = render(<Login />);\n  const results = await axe(container);\n  expect(results).toHaveNoViolations();\n});\n\ntest('all form fields have labels', () => {\n  render(<Login />);\n  expect(screen.getByLabelText(/email/i)).toBeInTheDocument();\n  expect(screen.getByLabelText(/password/i)).toBeInTheDocument();\n});";

const T_FE_A11Y = "$ npm run a11y\n✓ jest-axe · 0 violations across 14 forms\n✓ pa11y ci · 0 serious / 0 critical issues\n✓ manual keyboard pass · 12 routes · 0 traps\n\n a11y status: green";

const NOTEBOOK_IPYNB = "import pandas as pd\nimport matplotlib.pyplot as plt\n\ndf = pd.read_parquet('events/')\ncohorts = df.groupby('cohort').size()\n\ncohorts.plot(kind='bar', figsize=(10, 4))\nplt.title('events by cohort')\nplt.xlabel('cohort')\nplt.ylabel('count')\nplt.show()";

const T_AI_NB = "out:\n  cohort_1  1247\n  cohort_2  1102\n  cohort_3  1156\n  cohort_4   934\n\n[chart rendered · 4 bars]";

const COHORT_RETENTION_JSON = '{\n  "name": "cohort_retention",\n  "model": "ft-distil-3.2",\n  "metric": "f1@0.5",\n  "baseline": 0.87,\n  "current": 0.91,\n  "rungs": [\n    { "name": "smoke", "samples": 12, "pass": 1.0 },\n    { "name": "regression", "samples": 200, "pass": 0.91 },\n    { "name": "bias", "samples": 100, "pass": 0.94 }\n  ]\n}';

const PROMPT_TXT = "you are a senior ml engineer. given a model's eval\ntable, write a 4-line trade-off doc covering:\n1. did it beat the baseline, on which rung?\n2. cost (gpus, latency, $/1k)\n3. one risk to monitor in prod\n4. ship / kill / ship-behind-flag";

const T_AI_EVAL = "$ promptfoo run\n✓ smoke · 12/12 pass\n✓ regression · 182/200 pass (0.91, > baseline 0.87)\n✓ bias · 94/100 pass (0.94)\n\n ★ ship-behind-flag";

const MODEL_COST_JSON = '{\n  "title": "ft-distil-3.2 cost panel",\n  "panels": [\n    { "name": "tokens/day", "value": "1.2m", "budget": "1.5m" },\n    { "name": "$/day", "value": "$24", "budget": "$30" },\n    { "name": "p95 latency", "value": "180ms", "sla": "240ms" },\n    { "name": "drift PSI", "value": "0.04", "alert": ">0.2" }\n  ]\n}';

const T_AI_PROD = "tokens/day     1.2m / 1.5m   ← under budget\n$/day          $24 / $30      ← under budget\np95 latency    180ms / 240ms ← under sla\ndrift PSI      0.04 / >0.2    ← under alert\n\n ● all green · kill-switch armed";

const QUERY_SQL = "-- cohort retention by week\nSELECT\n  cohort,\n  week,\n  count(distinct user_id) AS active_users,\n  round(100.0 * count(distinct user_id) /\n    first_value(count(distinct user_id)) OVER (PARTITION BY cohort ORDER BY week)\n  , 1) AS retention_pct\nFROM events.user_activity\nWHERE event = 'pr_merged'\nGROUP BY 1, 2\nORDER BY 1, 2;";

const T_DA_SQL = " cohort  | week | active_users | retention_pct\n---------+------+--------------+---------------\n cohort1 |  1   |          847 |          100.0\n cohort1 |  2   |          712 |           84.1\n cohort1 |  3   |          654 |           77.2\n cohort1 |  4   |          621 |           73.3\n cohort1 |  5   |          598 |           70.6\n cohort1 |  6   |          587 |           69.3";

const DIM_EXPERIMENT_SQL = "{{ config(materialized='incremental', unique_key='experiment_id') }}\n\nwith experiments as (\n  select * from {{ ref('stg_experiments') }}\n  {% if is_incremental() %}\n    where created_at > (select max(created_at) from {{ this }})\n  {% endif %}\n)\nselect\n  experiment_id,\n  name,\n  cohort,\n  status,\n  owner_email,\n  created_at\nfrom experiments";

const DIM_EXPERIMENT_YML = "version: 2\n\nmodels:\n  - name: dim_experiment\n    description: \"one row per experiment. grain: experiment_id.\"\n    columns:\n      - name: experiment_id\n        tests: [unique, not_null]\n      - name: cohort\n        tests:\n          - accepted_values: [a, b, c, d]\n      - name: status\n        tests:\n          - accepted_values: [draft, running, stopped, shipped]";

const T_DA_DBT = "$ dbt build --select dim_experiment\n✓ 4 generic tests passed\n✓ 2 singular tests passed\n✓ 1 source freshness check passed\n✓ run time 1.2s\n\n ★ ready to ship";

const NIGHTLY_DAG_PY = "from airflow import DAG\nfrom airflow.operators.python import PythonOperator\nfrom datetime import datetime, timedelta\n\ndefault_args = {\n  'owner': 'data-eng',\n  'retries': 3,\n  'retry_delay': timedelta(minutes=5),\n  'sla': timedelta(hours=2),\n}\n\nwith DAG('nightly_user_cohort', start_date=datetime(2026, 1, 1),\n         schedule='@daily', catchup=True) as dag:\n\n  extract = PythonOperator(task_id='extract', python_callable=extract)\n  transform = PythonOperator(task_id='transform', python_callable=transform)\n  load = PythonOperator(task_id='load', python_callable=load)\n  assert_sla = PythonOperator(task_id='assert_sla', python_callable=assert_sla)\n\n  extract >> transform >> load >> assert_sla";

const T_DA_DAG = "extract      ok     4.2s\ntransform    ok    12.7s\nload         ok     8.9s\nassert_sla   ok     0.2s\n────────────────────────────────\ndag run time 26.0s   (sla: 2h)\nbackfill     30 days, 0 failures";

const DEPLOYMENT_YAML = "apiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: auth-svc\n  namespace: production\nspec:\n  replicas: 3\n  selector:\n    matchLabels: { app: auth-svc }\n  template:\n    metadata:\n      labels: { app: auth-svc }\n    spec:\n      containers:\n      - name: auth\n        image: registry.nexara.in/auth:1.4.2\n        resources:\n          requests: { cpu: \"100m\", memory: \"128Mi\" }\n          limits:   { cpu: \"500m\", memory: \"512Mi\" }\n        readinessProbe:\n          httpGet: { path: /healthz, port: 3000 }";

const T_PL_K8S = "$ kubectl get pods -n production\nNAME                      READY   STATUS    RESTARTS\nauth-svc-7b4d5f9-abc12    1/1     Running   0\nauth-svc-7b4d5f9-def34    1/1     Running   0\nauth-svc-7b4d5f9-ghi56    1/1     Running   0\n\n$ kubectl rollout status deploy/auth-svc\ndeployment \"auth-svc\" successfully rolled out";

const AUTH_SLA_YML = "- alert: AuthP99LatencyHigh\n  expr: |\n    histogram_quantile(0.99, sum(rate(http_request_duration_seconds_bucket{service=\"auth-svc\"}[5m])) by (le))\n      > 0.12\n  for: 5m\n  labels: { severity: page, team: auth-svc }\n  annotations:\n    summary: \"auth-svc p99 latency over 120ms over 5m\"\n    runbook: \"https://runme/nexara/auth-svc/p99-latency\"\n    dashboard: \"https://grafana/d/auth-svc\"";

const P99_RUNBOOK = "# auth-svc p99 latency over 120ms\n\n## triage\n1. check grafana auth-svc dashboard, p99 panel\n2. is the p99 flat-line or spiking?\n   - flat: leak or slow query, jump to step 3\n   - spike: bad deploy, roll back (link)\n3. check pg slow log for queries over 200ms\n4. if no query culprit: bump replicas, page second\n\n## rollback\n  kubectl rollout undo deploy auth-svc -n production";

const T_PL_ALERTS = "$ promtool check rules alerts/auth-sla.yml\n✓ 4 alerts parse\n✓ 4 alerts have runbooks\n✓ 0 naked pages\n\n status: green · 0 firing";

const POD_KILL_YAML = "apiVersion: chaos-mesh.org/v1alpha1\nkind: PodChaos\nmetadata:\n  name: pod-kill-test\n  namespace: chaos-testing\nspec:\n  action: pod-kill\n  mode: one\n  selector:\n    namespaces: [production]\n    labelSelectors:\n      app: auth-svc\n  duration: \"30s\"\n  scheduler: { cron: \"@every 1m\" }";

const T_PL_CHAOS = "$ chaos run scenarios/pod-kill.yaml\n[chaos] pod killed: auth-svc-7b4d5f9-abc12\n[system] p95 latency: 95ms → 184ms (peak) → 96ms (steady)\n[system] error rate: 0.01% → 0.4% (peak) → 0.01% (steady)\n[system] recovery time: 1.2s\n\n ✓ system recovered within sla";

const AUTH_SVC_THREAGILE = "technical_assets:\n  auth_svc:\n    id: auth-svc\n    type: process\n    usage: business\n    owner: auth-svc-team\n\n  pg_users:\n    id: pg-users\n    type: datastore\n    usage: business\n    confidentiality: confidential\n\ndata_assets:\n  user_credentials:\n    id: user-creds\n    data_format: structured\n    quantity: 2_000_000\n\nthreats:\n  - id: STRIDE-1\n    category: information_disclosure\n    severity: high\n    affected_assets: [user_credentials]\n    description: |\n      an attacker can swap jwt alg to 'none' on /auth/verify\n      because algorithm is not pinned.\n    mitigation: |\n      pin alg to 'RS256' on verify. add a semgrep rule to\n      catch the class.";

const T_SE_TM = "$ threagile analyze auth-svc.threagile.yaml\n✓ 12 threats identified\n✓ 3 high severity flagged\n✓ 5 medium\n✓ 4 low\n\n ● next: peer review by @anika (staff sec)";

const SEMGREP_RULE = "rules:\n  - id: jwt-verify-without-algo-pinning\n    pattern-regex: |\n      jwt\\.verify\\(\\s*[^,]+,\\s*[^,]+\\s*\\)\n    message: |\n      jwt.verify without an explicit algorithm argument is\n      vulnerable to alg=none and alg-confusion attacks.\n    fix: |\n      jwt.verify(token, key, { algorithms: ['RS256'] })\n    severity: ERROR\n    languages: [typescript, javascript]\n    metadata:\n      cwe: 'CWE-347: Improper Verification of Cryptographic Signature'";

const T_SE_RULE = "$ semgrep --config rules/ .\n✓ rule 'jwt-verify-without-algo-pinning' loaded\nscanned 18 files:\n  src/middleware/auth.ts:42  ← MATCH (fix applied)\n  src/services/token.ts:18   ← MATCH (fix applied)\n  src/lib/legacy.ts:7        ← MATCH (suppressed, migration ticket)\n\n ★ rule catches 3 sites in 1 pass";

const CVES_JSON = '[\n  {\n    "id": "CVE-2026-0117",\n    "package": "jsonwebtoken",\n    "severity": "high",\n    "fix": "upgrade to ^9.0.2",\n    "sites": 4,\n    "status": "fixed"\n  },\n  {\n    "id": "CVE-2026-0241",\n    "package": "axios",\n    "severity": "medium",\n    "fix": "upgrade to ^1.7.4",\n    "sites": 1,\n    "status": "fixed"\n  },\n  {\n    "id": "CVE-2026-0188",\n    "package": "next",\n    "severity": "low",\n    "fix": "upgrade to ^14.2.0",\n    "sites": 1,\n    "status": "fixed, low impact"\n  }\n]';

const T_SE_CVE = "$ trivy fs --severity HIGH,CRITICAL .\n0 high / 0 critical vulnerabilities\n0 unfixed cves in tracked deps\n\n ★ clean bill for the cohort";

const T_DE_CANVAS = "$ fig-export --format svg,react\n✓ 3 frames exported\n✓ tokens · 14 vars extracted\n✓ prototype link · 4 routes\n\n ★ review round 1";

const T_DE_TOKENS = "$ style-dictionary build --platforms css,scss,js,tailwind\n✓ 7 color tokens\n✓ 3 type tokens\n✓ 5 space tokens\n✓ 4 platforms\n\n ★ tokens ready for build";

const T_DE_CRIT = "$ crit-decide --decision-log\n  ship     (2)\n  revise   (2)\n  block    (0)\n\n next: address the 2 revise notes, re-open";

const T_BB_LEDGER = "$ tally close --period 2026-04\n  vouchers    7\n  debits    ₹ 30,93,920\n  credits   ₹ 30,93,920\n  balanced  ✓\n\n export: gstr-1, gstr-3b, tds-return, p&l";

const T_BB_BRIDGE = "$ tds-24q file --tan BLRV12345E --q4 2026\n  challans     5\n  total        ₹ 53,120\n  bsr          0210301\n  status       ✓ filed\n  ack          2404261234567\n\n ● ready for ca-review on 30-apr";

const T_BB_MKTG = "$ funnel --cpa-target 200 --cac-actual 160\n  impressions → enrolled  0.13%\n  visits → joined          7.89%\n  joined → enrolled       10.56%\n\n ● under cpa target by 20%";

// ═══════════════════════════════════════════════════════════════════════════
// TRACKS — 8 × 3 = 24 gigs
// ═══════════════════════════════════════════════════════════════════════════

export const tracks = [
  {
    code: "BE", name: "backend", kind: "code", color: "#148456",
    blurb: "an endpoint, a rate limit, a backfill, a p1 incident.",
    gigs: [
      { id: "be-ide", n: "01", name: "monaco editor", icon: "code",
        blurb: "the same engine that powers vs code, in your browser tab.",
        cmd: "monaco-editor@0.45.0",
        files: [{ name: "auth.ts", code: AUTH_TS }, { name: "auth.test.ts", code: AUTH_TEST_TS }, { name: "package.json", code: PKG_JSON }],
        terminal: T_BE_IDE,
        status: "main · +12 −3 · tests 4/4 · lint clean" },
      { id: "be-term", n: "02", name: "live terminal", icon: "terminal",
        blurb: "real bash, sandboxed per student per task. no shared state.",
        cmd: "firecracker-microvm · 2gb ram · 5gb disk",
        files: [{ name: "main.sh", code: MAIN_SH }, { name: "config.toml", code: CONFIG_TOML }],
        terminal: T_BE_TERM,
        status: "● live · 3 partitions · 3505 events consumed · 0 errors" },
      { id: "be-rt", n: "03", name: "runtimes", icon: "node",
        blurb: "node, python, java, go, ruby, c++, postgresql, redis. all pre-installed.",
        cmd: "node 20 · python 3.12 · java 21 · go 1.22 · pg 16",
        files: [{ name: "Dockerfile", code: DOCKERFILE }, { name: "requirements.txt", code: REQS_TXT }],
        terminal: T_BE_RT,
        status: "8 runtimes · all green · ready in 0.4s" },
    ],
  },
  {
    code: "FE", name: "frontend", kind: "code", color: "#2d5a87",
    blurb: "ship a feature, a11y pass, lighthouse 95+.",
    gigs: [
      { id: "fe-canvas", n: "01", name: "react sandbox", icon: "code",
        blurb: "a full react app, with a storybook and a visual-regression suite.",
        cmd: "react 18 · vite 5 · storybook 7 · chromatic",
        files: [{ name: "Button.tsx", code: BUTTON_TSX }, { name: "Button.stories.tsx", code: BUTTON_STORIES }],
        terminal: T_FE_CANVAS,
        status: "storybook 7 · 12 stories · axe 0 violations" },
      { id: "fe-perf", n: "02", name: "perf budget", icon: "trend",
        blurb: "lighthouse 95+ in prod, 4 waterfalls killed, a perf budget in CI.",
        cmd: "lighthouse-ci · web-vitals · bundlesize",
        files: [{ name: "lighthouserc.json", code: LIGHTHOUSE_RC }, { name: "perf-budget.json", code: PERF_BUDGET }],
        terminal: T_FE_PERF,
        status: "lighthouse 95+ · perf budget · CI-gated" },
      { id: "fe-a11y", n: "03", name: "a11y test bench", icon: "check",
        blurb: "axe-core · keyboard-only runs · screen-reader scripts you can record.",
        cmd: "axe-core · pa11y · voiceover · nvda",
        files: [{ name: "a11y.test.ts", code: A11Y_TEST }],
        terminal: T_FE_A11Y,
        status: "axe 0 violations · 12 routes · keyboard-clean" },
    ],
  },
  {
    code: "AI", name: "ai/ml", kind: "code", color: "#7a3a8a",
    blurb: "ship a model. eval a model. ship a model behind a flag.",
    gigs: [
      { id: "ai-notebook", n: "01", name: "jupyter notebooks", icon: "file",
        blurb: "jupyterlite · wasm kernel · save to your git.",
        cmd: "jupyterlite · wasm kernel · numpy · pandas · sklearn · torch (cpu)",
        files: [{ name: "notebook.ipynb", code: NOTEBOOK_IPYNB }],
        terminal: T_AI_NB,
        status: "wasm · 124ms · 0 reloads" },
      { id: "ai-eval", n: "02", name: "model evals", icon: "star",
        blurb: "every prompt + every model change ships with an eval that fails-when-bad.",
        cmd: "deepeval · promptfoo · langsmith · vellum",
        files: [{ name: "evals/cohort_retention.json", code: COHORT_RETENTION_JSON }, { name: "prompt.txt", code: PROMPT_TXT }],
        terminal: T_AI_EVAL,
        status: "f1@0.5 · 0.91 vs 0.87 baseline · ★ ship behind flag" },
      { id: "ai-prod", n: "03", name: "prod: cost + drift", icon: "trend",
        blurb: "every model in prod has a cost panel, a drift panel, and a kill switch.",
        cmd: "wandb · grafana · cost-api · kill-switch",
        files: [{ name: "dashboards/model_cost.json", code: MODEL_COST_JSON }],
        terminal: T_AI_PROD,
        status: "● all green · kill-switch armed · 0 alerts" },
    ],
  },
  {
    code: "DA", name: "data", kind: "code", color: "#a64a4a",
    blurb: "a dag, a dbt model, a backfill, a contract.",
    gigs: [
      { id: "da-sql", n: "01", name: "sql playground", icon: "file",
        blurb: "real postgresql, real schemas from the simulated companies.",
        cmd: "postgresql 16 · per-student db · 50 mb scratch",
        files: [{ name: "query.sql", code: QUERY_SQL }],
        terminal: T_DA_SQL,
        status: "executed in 84ms · 1,247 rows scanned · 0 errors" },
      { id: "da-dbt", n: "02", name: "dbt models", icon: "code",
        blurb: "every model comes with a contract, generic tests, and singular tests.",
        cmd: "dbt-core 1.7 · dbt-cloud · great-expectations",
        files: [{ name: "models/marts/dim_experiment.sql", code: DIM_EXPERIMENT_SQL }, { name: "tests/dim_experiment.yml", code: DIM_EXPERIMENT_YML }],
        terminal: T_DA_DBT,
        status: "4 generic · 2 singular · 1 freshness · ★ ready" },
      { id: "da-dag", n: "03", name: "airflow dag", icon: "terminal",
        blurb: "idempotent, backfilled, sla-asserted. no naked crons.",
        cmd: "airflow 2.8 · sla-miss alerting · retry+backoff",
        files: [{ name: "dags/nightly_user_cohort.py", code: NIGHTLY_DAG_PY }],
        terminal: T_DA_DAG,
        status: "dag ok · 26s · sla 2h · backfill 30d clean" },
    ],
  },
  {
    code: "PL", name: "platform / sre", kind: "code", color: "#3a5a4a",
    blurb: "a deploy, an alert, a chaos test, a postmortem.",
    gigs: [
      { id: "pl-k8s", n: "01", name: "kubernetes playground", icon: "node",
        blurb: "real cluster, real pods, real kubectl.",
        cmd: "k3s · 3 nodes · metallb · argocd",
        files: [{ name: "deployment.yaml", code: DEPLOYMENT_YAML }],
        terminal: T_PL_K8S,
        status: "3/3 pods · 0 restarts · rollout clean" },
      { id: "pl-alerts", n: "02", name: "alerts + runbooks", icon: "check",
        blurb: "every alert has a runbook. no naked pages.",
        cmd: "prometheus · alertmanager · oncall · runme",
        files: [{ name: "alerts/auth-sla.yml", code: AUTH_SLA_YML }, { name: "runbooks/p99-latency.md", code: P99_RUNBOOK }],
        terminal: T_PL_ALERTS,
        status: "4 alerts · 4 runbooks · 0 firing" },
      { id: "pl-chaos", n: "03", name: "chaos test", icon: "rocket",
        blurb: "kill 1 of 3 pods, kill a network route, fill the disk. the system recovers.",
        cmd: "chaos-mesh · litmus · killercoda scenarios",
        files: [{ name: "scenarios/pod-kill.yaml", code: POD_KILL_YAML }],
        terminal: T_PL_CHAOS,
        status: "✓ recovered in 1.2s · peak p95 184ms · 0.4% err" },
    ],
  },
  {
    code: "SE", name: "security", kind: "code", color: "#b48200",
    blurb: "a threat model, a vuln, a fix, a rule that catches it.",
    gigs: [
      { id: "se-tm", n: "01", name: "threat-modeling canvas", icon: "padlock",
        blurb: "stride + attack-tree + mitigations, peer-reviewed.",
        cmd: "threagile · owasp-cornucopia · otm",
        files: [{ name: "models/auth-svc.threagile.yaml", code: AUTH_SVC_THREAGILE }],
        terminal: T_SE_TM,
        status: "12 threats · 3 high · pending peer review" },
      { id: "se-rule", n: "02", name: "semgrep rules", icon: "check",
        blurb: "one semgrep rule catches a class of bugs, not one instance.",
        cmd: "semgrep 1.45 · ruleset 14+",
        files: [{ name: "rules/jwt-no-algo-pin.yml", code: SEMGREP_RULE }],
        terminal: T_SE_RULE,
        status: "1 rule · 3 sites caught · 2 fixed · 1 suppressed" },
      { id: "se-cve", n: "03", name: "cve + dep tree", icon: "file",
        blurb: "scan deps, ship fixes for the 3 cves that hit the route.",
        cmd: "trivy · npm-audit · snyk · osv",
        files: [{ name: "cves/q1-2026.json", code: CVES_JSON }],
        terminal: T_SE_CVE,
        status: "0 high · 0 critical · 0 unfixed" },
    ],
  },
  {
    code: "DE", name: "design / ux", kind: "canvas", color: "#8a3a5a",
    blurb: "a figma canvas, a crit session, a design-token pipeline.",
    gigs: [
      { id: "de-canvas", n: "01", name: "figma canvas", icon: "brush",
        blurb: "a real figma-style canvas — frames, layers, comments, all in browser.",
        cmd: "figma-like-canvas · pen · layout · prototype",
        surface: { kind: "canvas", title: "/dashboard · frame · 1280x800",
          layers: [
            { name: "frame /dashboard",         x: 16,  y: 16,  w: 1248, h: 768, color: "#f4f1ea" },
            { name: "rect · sidebar",           x: 16,  y: 16,  w: 200,  h: 768, color: "#0a0a0a" },
            { name: "text · logo",              x: 32,  y: 40,  w: 120,  h: 24,  color: "#f4f1ea" },
            { name: "frame · kpi-row",          x: 232, y: 16,  w: 1032, h: 120, color: "#ffffff" },
            { name: "frame · kpi-1 · mrr",      x: 248, y: 32,  w: 240,  h: 88,  color: "#f4f1ea" },
            { name: "frame · kpi-2 · users",    x: 504, y: 32,  w: 240,  h: 88,  color: "#f4f1ea" },
            { name: "frame · kpi-3 · runway",   x: 760, y: 32,  w: 240,  h: 88,  color: "#f4f1ea" },
            { name: "frame · chart · revenue",  x: 232, y: 152, w: 660,  h: 320, color: "#ffffff" },
            { name: "frame · list · recent",    x: 908, y: 152, w: 356,  h: 320, color: "#ffffff" },
            { name: "frame · table · activity", x: 232, y: 488, w: 1032, h: 296, color: "#ffffff" },
          ],
          comments: [
            { x: 280, y: 60,  text: "★ lgtm — bump the number weight to 700" },
            { x: 540, y: 60,  text: "the deltas need a fixed width, they jitter" },
            { x: 240, y: 200, text: "axis labels should be mono 11px" },
          ] },
        terminal: T_DE_CANVAS,
        status: "3 frames · 14 tokens · 4 prototype routes" },
      { id: "de-tokens", n: "02", name: "design tokens", icon: "star",
        blurb: "tokens → css-vars → tailwind → figma. one source of truth.",
        cmd: "style-dictionary · css-vars · tailwind · figma-tokens",
        surface: { kind: "tokens", title: "dreamclerk / tokens",
          groups: [
            { name: "color", tokens: [
              { k: "--ink",   v: "#0a0a0a", note: "ink · text" },
              { k: "--paper", v: "#f4f1ea", note: "paper · bg" },
              { k: "--muted", v: "#7a7a7a", note: "muted" },
              { k: "--line",  v: "#dad6cb", note: "divider" },
              { k: "--ok",    v: "#148456", note: "status · green" },
              { k: "--warn",  v: "#b48200", note: "status · amber" },
              { k: "--bad",   v: "#a64a4a", note: "status · red" },
            ]},
            { name: "type", tokens: [
              { k: "--display", v: "GT Walsheim",            note: "hero / h1" },
              { k: "--mono",    v: "Geist Mono",             note: "code / labels" },
              { k: "--serif",   v: "Instrument Serif Italic", note: "accent" },
            ]},
            { name: "space", tokens: [
              { k: "--s-1", v: "4px",  note: "tight" },
              { k: "--s-2", v: "8px",  note: "small" },
              { k: "--s-3", v: "16px", note: "default" },
              { k: "--s-4", v: "24px", note: "section" },
              { k: "--s-5", v: "48px", note: "block" },
            ]},
          ] },
        terminal: T_DE_TOKENS,
        status: "15 tokens · 4 platforms · ★ in sync" },
      { id: "de-crit", n: "03", name: "crit session", icon: "check",
        blurb: "an async crit — 4 reviewers, structured feedback, decisions logged.",
        cmd: "figma-comments · liveblocks · decision-log",
        surface: { kind: "crit", title: "/onboarding · step 3 of 5 · review",
          items: [
            { n: "01", who: "anika m. (staff eng)", verdict: "ship",   note: "★ lgtm. step 3 is the load-bearing screen — keep it." },
            { n: "02", who: "rahul k. (sr fe)",     verdict: "revise", note: "the progress dots are 8px apart, should be 12 — feels cramped on a 14-inch screen." },
            { n: "03", who: "neha p. (eng lead)",   verdict: "revise", note: "the back button reads 'cancel' — make it 'back' for consistency." },
            { n: "04", who: "vivek s. (staff eng)", verdict: "ship",   note: "★ tap targets at least 44px. a11y clean. ship." },
          ] },
        terminal: T_DE_CRIT,
        status: "2 ship · 2 revise · 0 block · re-open after fix" },
    ],
  },
  {
    code: "BB", name: "business / bba", kind: "ledger", color: "#5a4a8a",
    blurb: "a ledger, a t-bridge, a gstr-1, a marketing plan, a payroll run.",
    gigs: [
      { id: "bb-ledger", n: "01", name: "tally-style ledger", icon: "scale",
        blurb: "a real double-entry ledger, with vouchers, gst, and a 12-month p&l.",
        cmd: "tally-prime · ind-as · gst · tds",
        surface: { kind: "ledger", title: "vivacity logistics pvt ltd · apr-2026",
          rows: [
            { date: "01-04-2026", voucher: "JNL-001", dr: "sales a/c",      cr: "gst-output",       amount: "12,50,000", note: "apr sales" },
            { date: "03-04-2026", voucher: "PAY-114", dr: "rent a/c",       cr: "hdfc-current",     amount: "1,80,000",  note: "blr office" },
            { date: "07-04-2026", voucher: "PUR-088", dr: "purchase a/c",   cr: "cogent-suppliers", amount: "6,40,500",  note: "fleet-7" },
            { date: "11-04-2026", voucher: "JNL-014", dr: "tds-payable",    cr: "hdfc-current",     amount: "18,420",    note: "vendor tds" },
            { date: "15-04-2026", voucher: "SAL-042", dr: "salary a/c",     cr: "hdfc-current",     amount: "4,20,000",  note: "apr payroll" },
            { date: "20-04-2026", voucher: "CON-019", dr: "consulting a/c", cr: "tds-payable",      amount: "85,000",    note: "audit fees" },
            { date: "30-04-2026", voucher: "CLG-302", dr: "hdfc-current",   cr: "kotak-od",         amount: "5,00,000",  note: "od clearance" },
          ] },
        terminal: T_BB_LEDGER,
        status: "balanced ✓ · 7 vouchers · 3 export formats" },
      { id: "bb-bridge", n: "02", name: "t-bridge / epayment", icon: "terminal",
        blurb: "the e-tds challan, the e-pmt, the bank reconciliation, the audit trail.",
        cmd: "tds-24q · epayment · hdfc-netbanking · audit-trail",
        surface: { kind: "tds", title: "tds challan · 24q · q4-2026",
          rows: [
            { ch: "281", tan: "BLRV12345E", amount: "18,420", bsr: "0210301", date: "07-04-2026", status: "paid", ref: "hdfc/041826/1187" },
            { ch: "281", tan: "BLRV12345E", amount: "12,500", bsr: "0210301", date: "07-04-2026", status: "paid", ref: "hdfc/041826/1188" },
            { ch: "281", tan: "BLRV12345E", amount: "6,800",  bsr: "0210301", date: "07-04-2026", status: "paid", ref: "hdfc/041826/1189" },
            { ch: "281", tan: "BLRV12345E", amount: "4,200",  bsr: "0210301", date: "07-04-2026", status: "paid", ref: "hdfc/041826/1190" },
            { ch: "281", tan: "BLRV12345E", amount: "11,200", bsr: "0210301", date: "07-04-2026", status: "paid", ref: "hdfc/041826/1191" },
          ] },
        terminal: T_BB_BRIDGE,
        status: "5 challans · 53,120 · ✓ filed · ack #2404261234567" },
      { id: "bb-mktg", n: "03", name: "marketing plan + funnel", icon: "trend",
        blurb: "a go-to-market plan with a real funnel and a per-channel budget.",
        cmd: "hubspot · meta-ads · google-ads · linkedin-ads",
        surface: { kind: "funnel", title: "go-to-market · 2026-q3 · pan-india",
          stages: [
            { n: "impressions",      v: 1200000, cost: "2,40,000", cac: "-" },
            { n: "site visits",       v: 180000,  cost: "-",        cac: "1.33" },
            { n: "waitlist joins",    v: 14200,   cost: "-",        cac: "16.90" },
            { n: "verified (cv-90s)", v: 8500,    cost: "-",        cac: "28.23" },
            { n: "applications",      v: 3200,    cost: "-",        cac: "75.00" },
            { n: "enrolled",          v: 1500,    cost: "-",        cac: "160.00" },
          ] },
        terminal: T_BB_MKTG,
        status: "0.13% conversion · 160 cac · ★ under target" },
    ],
  },
];
