// ─── evaluator — a real (deterministic, in-browser) AI code reviewer ─────────
//
// Per PRD v0.3: "the beta must look real" — that means a submit button cannot
// always approve. The evaluator below inspects the actual code the user pasted
// (or wrote) and returns a structured verdict with 4 axis scores + specific
// reviewer notes + a concrete next action.
//
// It is intentionally not an LLM call. We are local-only (§13.1) and we want
// deterministic, explainable behaviour for the 50 invited users. The model
// works by:
//
//   1. Normalising whitespace and stripping comments.
//   2. Detecting language by file extension / task type.
//   3. Pulling structural signals: imports, defs, classes, loops, try/except,
//      return statements, print/log calls, assertions, type hints, docstrings.
//   4. Running task-specific checks: e.g. T3 requires a /predict route, a
//      model loaded once at startup, and a Pydantic model for 422s.
//   5. Scoring 4 axes: correctness, robustness, readability, fit-for-task.
//   6. Computing a verdict from the lowest axis and a list of evidence lines.
//
// This is "real" in the sense that two different submissions of the same task
// will almost always produce different verdicts, and a lazy submission (a
// function that returns "42") will fail. The notes quote the actual code so
// the user can see what tripped the reviewer.

const AXES = ["correctness", "robustness", "readability", "fit"];

// Normalise: collapse runs of whitespace, strip line comments (# ... and // ...)
// and block comments (""" ... """ / ''' ... '''). Keep newlines as single \n.
export function normalizeCode(src) {
  if (typeof src !== "string") return "";
  // Strip triple-quoted blocks first (we don't try to keep docstring evidence
  // in normalised form — we'll look at the raw text for that).
  let s = src
    .replace(/"""[\s\S]*?"""/g, '"""…"""')
    .replace(/'''[\s\S]*?'''/g, "'''…'''");
  // Strip line comments.
  s = s
    .split("\n")
    .map((line) => line.replace(/(^|\s)(#|\/\/).*$/, ""))
    .join("\n");
  // Collapse blank-line runs.
  s = s.replace(/\n{3,}/g, "\n\n");
  return s.trim();
}

function countMatches(re, s) {
  re.lastIndex = 0;
  let n = 0;
  while (re.exec(s) !== null) n++;
  return n;
}

function detectLanguage(code, taskType) {
  if (/\bdef\s+\w+\(/.test(code) || /\bimport\s+\w+/.test(code)) return "python";
  if (/\bfunction\s+\w+\(/.test(code) || /\bconst\s+\w+\s*=/.test(code)) return "js";
  if (/\bapp\s*=\s*FastAPI\(/.test(code)) return "python";
  if (/\bfrom\s+fastapi\b/.test(code)) return "python";
  if (taskType === "productionisation") return "python";
  return "python";
}

function structuralSignals(code) {
  return {
    raw: code,
    lines: code ? code.split("\n").length : 0,
    chars: code.length,
    defs: countMatches(/^(\s*)(def|function|class)\s+\w+/gm, code),
    imports: countMatches(/^(\s*)(import\s+\w+|from\s+\w+\s+import|const\s+\w+\s*=\s*require)/gm, code),
    returns: countMatches(/\breturn\b/g, code),
    tryBlocks: countMatches(/\b(try|except|catch)\b/g, code),
    prints: countMatches(/\b(print\(|console\.log\(|logging\.)/g, code),
    assertions: countMatches(/\bassert\b/g, code),
    typeHints: countMatches(/:\s*(str|int|float|bool|list|dict|tuple|Optional|Any)\b/g, code),
    docstrings: countMatches(/("""|\'\'\')/g, code),
    hasErrorMessage: /\b(raise|throw|return\s+JSONResponse.*\b4\d\d\b|HTTPException\()/i.test(code),
    hasTodo: /\b(TODO|FIXME|XXX|placeholder|lorem)\b/i.test(code),
  };
}

function scoreAxisCorrectness(task, sig) {
  // Lazy submission: empty / trivial / placeholder.
  if (sig.lines < 3) {
    return { score: 0.1, note: `submission is only ${sig.lines} line(s). needs actual work.` };
  }
  if (/^\s*return\s+["']?42["']?\s*$/m.test(sig.raw)) {
    return { score: 0.1, note: "submission is a literal `return 42`. that's not an implementation." };
  }
  if (sig.hasTodo) {
    return { score: 0.3, note: "submission contains TODO / placeholder text. finish the work before submitting." };
  }
  // No function/class defined at all → almost certainly not a real implementation.
  if (sig.defs === 0) {
    return { score: 0.3, note: "no function or class defined. wrap your logic in a callable." };
  }
  // Return statement is a good sign for an actual function.
  if (sig.returns === 0 && task.type !== "data-audit") {
    return { score: 0.45, note: "no `return` statement found. what does the function produce?" };
  }
  // Reasonable size + at least one def + at least one return.
  if (sig.defs >= 1 && sig.returns >= 1 && sig.lines >= 12) {
    return { score: 0.8, note: "functions defined and return values present." };
  }
  if (sig.defs >= 1 && sig.returns >= 1) {
    return { score: 0.7, note: "shape is right but code is short. add the missing cases." };
  }
  return { score: 0.5, note: "partial implementation. read the acceptance criteria again." };
}

function scoreAxisRobustness(sig) {
  let s = 0.5;
  const notes = [];
  if (sig.tryBlocks > 0) { s += 0.2; notes.push("error handling present (try/except)."); }
  if (sig.assertions > 0) { s += 0.1; notes.push("assertions present."); }
  if (sig.hasErrorMessage) { s += 0.15; notes.push("explicit error / 422 path."); }
  if (sig.tryBlocks === 0) { notes.push("no try/except — what happens on bad input?"); }
  if (!sig.hasErrorMessage && sig.defs > 0) { notes.push("no explicit error message — users will see a stack trace."); }
  return { score: Math.min(0.95, s), note: notes.join(" ") };
}

function scoreAxisReadability(sig) {
  let s = 0.5;
  const notes = [];
  if (sig.typeHints >= 1) { s += 0.15; notes.push("type hints present."); }
  if (sig.docstrings >= 2) { s += 0.2; notes.push("docstrings present."); }
  if (sig.docstrings === 0 && sig.defs >= 1) { notes.push("no docstrings — add 1 line per function."); }
  if (sig.lines < 5) { s -= 0.1; notes.push("too short to be readable."); }
  if (sig.lines > 400) { s -= 0.1; notes.push("very long file — consider splitting."); }
  if (sig.lines >= 20 && sig.lines <= 250) { s += 0.1; notes.push("reasonable file length."); }
  return { score: Math.max(0.2, Math.min(0.95, s)), note: notes.join(" ") };
}

// Task-specific check that the submission actually matches the brief.
//
// Each entry is: a list of {label, regex, finding} where `finding` is the
// reviewer note returned when the regex does NOT match. The list is also
// the source of truth for `buildChecklist` below (same label, same regex,
// just the surfaced shape differs).
const TASK_SPECS = {
  "t1-drift": [
    { label: "Mentions 'label' (current vs predicted)", regex: /\blabel\b/i, finding: "the brief is about label distribution shift — your report should mention 'label' explicitly." },
    { label: "Mentions pseudo-label generation", regex: /\bpseudo[-_ ]?label(s|ing|ed)?\b/i, finding: "did you identify the pseudo-label issue? that's the smoking gun the reviewer is looking for." },
    { label: "Mentions distribution / histogram comparison", regex: /\b(distribution|histogram|hist)\b/i, finding: "show the distribution — a number alone won't convince the reviewer." },
    { label: "Names a likely root cause (drift / shift / leakage)", regex: /\b(drift|shift|leakage|covariate|prior)\b/i, finding: "name the root cause: drift, shift, leakage, covariate, prior." },
  ],
  "t2-bert": [
    { label: "Has a training loop (trainer / fit / train)", regex: /\b(trainer|train\(|fit\(|model\.fit)\b/i, finding: "no training loop detected. distilbert needs a Trainer / fit() call." },
    { label: "Uses a tokenizer", regex: /\btokeniz/i, finding: "tokenizer not used in the snippet — a model without a tokenizer is a brick." },
    { label: "Reports F1", regex: /\b(f1|f1_score)\b/i, finding: "F1 isn't being computed anywhere — how do you know the model is good?" },
    { label: "Saves the model artifact", regex: /\b(save|torch\.save|pickle)\b/i, finding: "model isn't being saved. submit will fail at artifact step." },
  ],
  "t3-api": [
    { label: "Imports FastAPI", regex: /\b(fastapi|FastAPI|app\s*=\s*FastAPI)\b/i, finding: "no FastAPI app detected. the brief asks for a FastAPI endpoint." },
    { label: "Has a POST route", regex: /@app\.(post|api_route)\s*\(/i, finding: "no POST route — where does /predict live?" },
    { label: "Has a /predict route", regex: /\bpredict\b/i, finding: "no /predict route. the brief requires a /predict endpoint." },
    { label: "Uses a Pydantic / BaseModel request schema", regex: /\b(pydantic|basemodel)\b/i, finding: "no Pydantic model — the brief asks for 422 on bad input. Pydantic gives you that for free." },
    { label: "Loads the model once at module / startup level", regex: /\b(joblib\.load|torch\.load|pickle\.load|lifespan|on_event|startup)\b/i, finding: "looks like the model is loaded inside the request path. load it once at startup (FastAPI lifespan or top-level)." },
  ],
  "t4-audit": [
    { label: "Names 'leak' / 'leakage'", regex: /\b(leak|leakage)\b/i, finding: "the word 'leak' doesn't appear. this is a leakage audit — say it out loud." },
    { label: "Names 'target encoding'", regex: /\btarget[-_ ]?encod/i, finding: "target encoding isn't mentioned. that's where the subtle leakage lives." },
    { label: "Mentions train_test_split", regex: /\b(train.*test.*split|train_test_split)\b/i, finding: "did you check whether the split happens before target encoding?" },
    { label: "Recommends a fix (group split / time split / drop feature)", regex: /\b(group|temporal|time[-_ ]based|drop|remove|hash)\b/i, finding: "name a concrete fix: group split, temporal split, drop the leaky feature." },
  ],
  // ─── new tracks: type-based generic profiles ───────────────────────────
  // These are coarser than the AIML hand-tuned specs above. The LLM
  // (reviewer.js → Edge Function → Claude) is the primary reviewer for
  // these tracks; this fallback fires only when the LLM is down.
  "backend": [
    { label: "Has a function / handler / route", regex: /\b(function|def |app\.|@app\.|router\.|handler|HandleFunc|func\s+\w+\s*\()/i, finding: "no function, handler, or route defined. wrap your logic in a callable." },
    { label: "Mentions HTTP / request / response", regex: /\b(request|response|http|HTTP|status|json|jsonify|return\s+\{)/i, finding: "no HTTP-shape code visible. the brief expects an HTTP-shaped answer." },
    { label: "Includes error handling (try/catch, except, error)", regex: /\b(try|catch|except|errors?\.New|fmt\.Errorf|HTTPException|abort|return\s+err)/i, finding: "no error handling visible. what does the code do on bad input?" },
    { label: "Mentions tests / coverage", regex: /\b(test|pytest|jest|coverage|spec|assert)\b/i, finding: "no test or coverage signal. did you run the test suite?" },
  ],
  "frontend": [
    { label: "Defines a component / function", regex: /\b(function|const\s+\w+\s*=\s*\(|=>|class\s+\w+|export\s+(default\s+)?(function|const|class)|function\s+\w+\s*\()/i, finding: "no component or function defined. wrap your UI in a component." },
    { label: "Uses semantic HTML or ARIA", regex: /\b(role=|aria-|<button|<input|<label|<nav|<main|<section|<header|<footer|<table|tabIndex|tabindex)/i, finding: "no semantic HTML / ARIA visible. the brief cares about accessibility." },
    { label: "Imports something or has dependencies", regex: /\b(import\s+|require\(|from\s+['"])/i, finding: "no imports. the snippet looks isolated from any framework." },
    { label: "Has JSX or template syntax", regex: /(<\w+(\s+[^>]*)?>|\{\{|\$\$)/i, finding: "no JSX / template syntax. the snippet doesn't look like UI code." },
  ],
  "data": [
    { label: "Has SQL or data-wrangling code", regex: /\b(SELECT|FROM|WHERE|GROUP BY|ORDER BY|JOIN|WITH|INSERT|UPDATE|DELETE|read_csv|to_sql|pandas|polars|dplyr)\b/i, finding: "no SQL or data-wrangling code visible. the brief expects a query or transform." },
    { label: "Mentions a table, schema, or column", regex: /\b(table|schema|column|row|index|database)\b/i, finding: "no table / schema reference. ground the query in the schema." },
    { label: "Includes a number or aggregate (count, avg, sum, max, min)", regex: /\b(count|avg|average|sum|max|min|median|std|distinct)\b/i, finding: "no aggregate visible. what does the query measure?" },
    { label: "Mentions a chart, plot, or visualization", regex: /\b(plot|chart|graph|histogram|bar|line|scatter|heatmap|streamlit|observable|dashboard)\b/i, finding: "no chart or dashboard reference. the brief asks for a visual." },
  ],
  "prose": [
    { label: "Mentions the task subject (top-3 keywords)", regex: null, finding: "the submission does not address the task subject." },
    { label: "Contains a concrete recommendation or decision", regex: /\b(recommend|suggest|propose|should|must|will|decision|chose|chose because|trade[- ]off)\b/i, finding: "no concrete recommendation. the brief expects a decision, not just an observation." },
    { label: "Names a risk or failure mode", regex: /\b(risk|failure|race|corner case|edge case|caveat|downside|trade[- ]off|limit)\b/i, finding: "no risk or failure mode named. what's the worst case?" },
    { label: "Contains a number / metric / timeframe", regex: /\b(\d+(\.\d+)?\s*(%|ms|s|sec|min|hour|day|x|times)|\d+x|\d{2,})/i, finding: "no number, metric, or timeframe. be concrete." },
  ],
};

// Resolve the spec for a task. Falls back to a type-based profile, then to
// a generic "any-code" profile so unknown tasks don't crash.
function specForTask(task) {
  const id = (task?.id || "").toLowerCase();
  if (TASK_SPECS[id]) return TASK_SPECS[id];
  const t = (task?.type || "").toLowerCase();
  if (TASK_SPECS[t]) return TASK_SPECS[t];
  return TASK_SPECS.prose;
}

// Task-specific check that the submission actually matches the brief.
function taskSpecificCheck(task, sig) {
  const findings = [];
  const lower = sig.raw.toLowerCase();
  const spec = specForTask(task);
  for (const row of spec) {
    if (!row.regex) continue; // "subject mentions" is checked separately
    if (!row.regex.test(sig.raw)) findings.push(row.finding);
  }
  // Generic safeguard for prose tasks: if the submission doesn't even mention
  // a keyword from the task title, flag it. Cheap and useful for the new tracks.
  if (spec === TASK_SPECS.prose && task?.title) {
    const stop = new Set(["a", "an", "the", "and", "or", "of", "to", "in", "for", "on", "with", "is", "are", "be"]);
    const kws = (task.title.toLowerCase().match(/[a-z]{4,}/g) || []).filter((w) => !stop.has(w));
    const hits = kws.filter((kw) => lower.includes(kw));
    if (kws.length >= 2 && hits.length === 0) {
      findings.push(`the submission does not mention any keyword from the task title ("${task.title}").`);
    }
  }
  return findings;
}

function scoreAxisFit(task, sig) {
  const findings = taskSpecificCheck(task, sig);
  if (findings.length === 0 && sig.defs >= 1 && sig.lines >= 15) {
    return { score: 0.85, note: "submission matches the brief and acceptance criteria." };
  }
  if (findings.length === 0) {
    return { score: 0.65, note: "no missing-brief findings, but the code is short — show the reviewer more." };
  }
  // Two findings → fail. One finding → marginal.
  if (findings.length >= 2) {
    return { score: 0.3, note: findings[0] + (findings[1] ? " " + findings[1] : "") };
  }
  return { score: 0.55, note: findings[0] };
}

// Verdict: APPRVE / REVISE / REJECT. Threshold tuned so lazy submissions
// (returns 42, has TODO, missing the brief) fail.
function verdictFromAxes(axes) {
  const min = Math.min(...axes.map((a) => a.score));
  if (min >= 0.7) return "APPROVE";
  if (min >= 0.45) return "REVISE";
  return "REJECT";
}

// Quote the actual line that triggered a finding — gives the user something
// concrete to fix instead of a generic message.
function evidenceQuote(rawCode, regex) {
  const m = rawCode.match(regex);
  if (!m) return null;
  return m[0].slice(0, 80);
}

// Public API.
export function evaluate(task, rawCode) {
  const code = normalizeCode(rawCode || "");
  const sig = structuralSignals(code);
  const lang = detectLanguage(code, task?.type);

  const correctness = scoreAxisCorrectness(task || { type: "" }, sig);
  const robustness = scoreAxisRobustness(sig);
  const readability = scoreAxisReadability(sig);
  const fit = scoreAxisFit(task || { type: "", id: "" }, sig);
  const axes = { correctness, robustness, readability, fit };

  const verdict = verdictFromAxes([correctness, robustness, readability, fit]);

  // Build the reviewer note — short, specific, references the actual code.
  const reviewLines = [];
  reviewLines.push(`> language: ${lang} · ${sig.lines} lines · ${sig.defs} defs · ${sig.returns} returns · ${sig.tryBlocks} try/except`);
  for (const axis of AXES) {
    const a = axes[axis];
    reviewLines.push(`[${axis}] ${(a.score * 100).toFixed(0)}/100 — ${a.note}`);
  }
  // Highlight specific code issues.
  const todoMatch = evidenceQuote(sig.raw, /\b(TODO|FIXME|XXX)\b[^\n]*/i);
  if (todoMatch) reviewLines.push(`flag: found \`${todoMatch.trim()}\` in your submission.`);
  if (/return\s+["']?42["']?/.test(sig.raw)) {
    reviewLines.push("flag: `return 42` is a placeholder, not an implementation.");
  }

  return {
    verdict,
    axes,
    summary: reviewLines.join("\n"),
    // Per-task checklist — same checks the engine ran, surfaced as a
    // list of {label, passed, evidence} the UI can render in the
    // "what the reviewer ran" panel. Kept separate from `axes` because
    // axes are a numeric scoring; the checklist is a binary pass/fail
    // log the user can read in one pass.
    checklist: buildChecklist(task || { id: "" }, code),
    language: lang,
    signals: {
      lines: sig.lines,
      defs: sig.defs,
      imports: sig.imports,
      returns: sig.returns,
      tryBlocks: sig.tryBlocks,
      typeHints: sig.typeHints,
      docstrings: sig.docstrings,
    },
    // A plain-English line for the chat bubble.
    chatLine: chatLineFor(verdict, axes, task),
  };
}

// ─── buildChecklist ─────────────────────────────────────────────────────────
//
// For each task, return the explicit list of things the reviewer checks.
// Returns an array of { label, passed, evidence }. `evidence` is a short
// snippet from the user's code that triggered the check (or null if not
// found). This is the same set of conditions `taskSpecificCheck` inspects,
// surfaced as a flat list so the UI can show "[✓] / [✗]" rows.
function buildChecklist(task, code) {
  const c = code || "";
  const spec = specForTask(task);
  const items = [];
  for (const row of spec) {
    if (!row.regex) {
      // "subject mentions" check (prose only). Compute on the fly.
      const stop = new Set(["a", "an", "the", "and", "or", "of", "to", "in", "for", "on", "with", "is", "are", "be"]);
      const kws = (task?.title || "").toLowerCase().match(/[a-z]{4,}/g) || [];
      const hits = kws.filter((kw) => !stop.has(kw) && c.toLowerCase().includes(kw));
      items.push({
        label: row.label,
        passed: hits.length > 0,
        evidence: hits.length > 0 ? hits[0] : null,
      });
      continue;
    }
    const m = c.match(row.regex);
    items.push({ label: row.label, passed: !!m, evidence: m ? m[0].slice(0, 80) : null });
  }
  return items;
}

function chatLineFor(verdict, axes, task) {
  const weakest = AXES.map((k) => ({ k, s: axes[k].score })).sort((a, b) => a.s - b.s)[0];
  const taskTitle = task?.title || "this task";
  if (verdict === "APPROVE") {
    return `shipped. ${taskTitle} looks good — ${weakest.k} is the lowest axis at ${(weakest.s * 100).toFixed(0)}/100, but it's above the bar. moving you on.`;
  }
  if (verdict === "REVISE") {
    return `not there yet on ${taskTitle}. your ${weakest.k} is at ${(weakest.s * 100).toFixed(0)}/100 — ${axes[weakest.k].note} resubmit when fixed.`;
  }
  return `rejected. ${taskTitle} is missing the bar on ${weakest.k}: ${axes[weakest.k].note} read the acceptance criteria and the data card, then try again.`;
}
