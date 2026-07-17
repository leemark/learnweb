const pathData = {
  platform: {
    title: "Modern Web Platform",
    label: "HTML / CSS / JavaScript",
    symbol: "{ }",
    accent: "#d9ff43",
    description: "The durable core: semantic markup, resilient styling, progressive enhancement, browser APIs, performance, and shipping.",
    outcome: "Ship a fast, accessible interface that uses the platform first and remains useful when newer capabilities are unavailable.",
    modules: [
      ["HTML that works harder", "Use landmarks, forms, dialog, popover, disclosure, and native controls before reaching for custom widgets.", "70 min"],
      ["Layout without page breakpoints", "Compose with Grid, subgrid, container queries, logical properties, and intrinsic sizing.", "85 min"],
      ["CSS as an interface language", "Practice cascade layers, nesting, style queries, anchor positioning, color spaces, and resilient fallbacks.", "95 min"],
      ["JavaScript as enhancement", "Build with modules, events, workers, the Navigation API, Trusted Types, and capability detection.", "95 min"],
      ["Performance is product design", "Budget LCP, INP, and CLS; inspect the critical path; make expensive work visible.", "70 min"],
      ["Capstone: the resilient interface", "Ship one useful workflow that works with keyboard, touch, slow networks, and reduced motion.", "120 min"]
    ]
  },
  ux: {
    title: "UX & Product Design",
    label: "Research / Structure / Validation",
    symbol: "◎",
    accent: "#ff5c39",
    description: "A practical product-design path grounded in evidence, clear information, honest interaction, and real-world validation.",
    outcome: "Turn an ambiguous problem into a testable product flow, then improve it with evidence instead of opinion.",
    modules: [
      ["Frame the outcome", "Separate the user’s job, the business constraint, and the behavior that would prove the design works.", "55 min"],
      ["Research without theater", "Plan interviews, observation, surveys, and analytics around decisions you genuinely need to make.", "75 min"],
      ["Make information findable", "Model content, vocabulary, navigation, and search around how people think—not your org chart.", "70 min"],
      ["Prototype the risky part", "Choose fidelity by uncertainty. Prototype decisions and edge cases before decorating screens.", "80 min"],
      ["Design systems with judgment", "Build tokens, components, content rules, states, and escape hatches that support coherent work.", "75 min"],
      ["Test, synthesize, decide", "Run a five-person usability study, separate signals from anecdotes, and prioritize the next iteration.", "90 min"]
    ]
  },
  accessibility: {
    title: "Accessibility",
    label: "WCAG 2.2 / Inclusive Design",
    symbol: "◉",
    accent: "#64dcf2",
    description: "Accessibility as a design and engineering practice—not a checklist added after launch.",
    outcome: "Audit and repair a real interface through automated checks, keyboard use, screen-reader testing, zoom, and human evaluation.",
    modules: [
      ["People before criteria", "Understand disability, assistive technology, situational constraints, and the limits of conformance.", "55 min"],
      ["Semantic structure and names", "Create a reliable accessibility tree with native HTML, useful labels, and disciplined ARIA.", "75 min"],
      ["Keyboard and focus systems", "Design logical order, visible focus, unobscured targets, skip paths, and robust modal behavior.", "80 min"],
      ["Visual access and reflow", "Test contrast, text spacing, zoom, motion, color independence, forced colors, and responsive reflow.", "70 min"],
      ["Forms, errors, and authentication", "Make instructions, validation, recovery, target sizes, and sign-in flows understandable.", "75 min"],
      ["Test beyond the scanner", "Combine axe-style automation, keyboard checks, screen readers, browser zoom, and user testing.", "95 min"]
    ]
  },
  search: {
    title: "Search & AI Discovery",
    label: "SEO / GEO / Information Quality",
    symbol: "⌕",
    accent: "#a88bff",
    description: "Create information that is technically discoverable, genuinely original, easy to verify, and worth recommending.",
    outcome: "Publish an evidence-rich guide with strong information architecture, technical foundations, structured data, and a measurement plan.",
    modules: [
      ["How discovery systems work", "Map crawling, indexing, retrieval, ranking, grounding, citation, and the user intents behind them.", "60 min"],
      ["Technical foundations", "Control status codes, canonicals, robots, sitemaps, metadata, rendering, internal links, and performance.", "75 min"],
      ["Structure for humans and machines", "Use headings, entities, tables, schema, media, and source attribution to reduce ambiguity.", "70 min"],
      ["Original value beats commodity pages", "Add first-hand experience, evidence, examples, tools, and judgment that scaled generation cannot fake.", "80 min"],
      ["Generative discovery without myths", "Apply core SEO to AI features; make claims citeable; support shopping, local, image, video, and agent use cases.", "70 min"],
      ["Measure outcomes, not folklore", "Connect Search Console, analytics, conversions, crawl signals, and qualitative feedback to decisions.", "75 min"]
    ]
  },
  ai: {
    title: "AI Product Engineering",
    label: "Context / Tools / Evals / Safety",
    symbol: "✦",
    accent: "#ff8fd8",
    description: "Design AI features as probabilistic systems with explicit value, observable behavior, and meaningful human control.",
    outcome: "Prototype and evaluate an AI-assisted workflow with streaming feedback, grounded context, tool boundaries, and a safe failure mode.",
    modules: [
      ["Find the right product seam", "Choose work where ambiguity is useful, review is possible, and the model improves an existing outcome.", "60 min"],
      ["Context is the interface", "Design instructions, examples, retrieval, state, structured outputs, and context budgets deliberately.", "80 min"],
      ["Streaming and uncertain UX", "Communicate latency, sources, confidence, interruption, editing, retry, and graceful failure.", "75 min"],
      ["Retrieval, tools, and agents", "Ground answers, constrain actions, design permissions, and separate planning from consequential execution.", "95 min"],
      ["Safety, privacy, and abuse", "Threat-model prompt injection, data exposure, harmful outputs, overreliance, and irreversible actions.", "85 min"],
      ["Evals before vibes", "Build representative test sets, graders, traces, red-team cases, and release criteria tied to user outcomes.", "105 min"]
    ]
  }
};

const studioMissions = {
  platform: [
    ["Rebuild one custom menu with native disclosure or popover HTML.", "It remains understandable before JavaScript loads and exposes the right name, role, and state."],
    ["Create a card rail that changes composition from its own available width.", "The component works in a sidebar and a full page without viewport-specific overrides."],
    ["Anchor a callout, animate one reveal, and add a deliberate fallback.", "The core task still works in a browser that ignores every enhancement."],
    ["Add client-side navigation or filtering without taking ownership away from links and history.", "Back, forward, refresh, deep links, and keyboard activation remain reliable."],
    ["Measure one slow interaction and remove its largest block of main-thread work.", "You can explain which user-visible delay changed and why—not only quote a score."],
    ["Ship a compact tool for a real person on an old phone and an unstable connection.", "They can finish the task with keyboard, touch, 200% zoom, and reduced motion."]
  ],
  ux: [
    ["Write a one-page opportunity brief for a problem you can observe this week.", "It names a user, situation, desired progress, constraint, and disconfirming signal."],
    ["Run three short interviews using behavior-first questions, then affinity-map the evidence.", "Findings distinguish observed patterns, quotes, assumptions, and unanswered questions."],
    ["Card-sort a messy collection of at least 25 items and propose a navigation model.", "Labels use the audience’s vocabulary and every high-priority item has an obvious home."],
    ["Prototype only the least-certain moment in a flow, including loading, empty, and error states.", "A teammate can test the risky decision without being distracted by visual polish."],
    ["Document one component’s anatomy, content rules, states, tokens, and escape hatch.", "Another maker can use it correctly without copying a screenshot."],
    ["Facilitate five task-based sessions and turn observations into ranked changes.", "Every recommendation points to evidence, severity, frequency, and product intent."]
  ],
  accessibility: [
    ["Interview or learn from one person whose access needs differ from yours.", "Your notes describe barriers and strategies without reducing the person to a persona stereotype."],
    ["Inspect and repair the accessibility tree of a real page.", "Landmarks, headings, control names, relationships, and reading order match the visible experience."],
    ["Complete the page’s primary task with only Tab, Shift+Tab, arrows, Enter, Space, and Escape.", "Focus never disappears, becomes trapped, or lands beneath sticky content."],
    ["Test at 200% and 400% zoom, forced colors, increased text spacing, and reduced motion.", "Nothing essential clips, overlaps, vanishes, or depends on color or animation alone."],
    ["Build a form that survives a mistake and supports password managers and paste.", "Errors identify the field, explain recovery, preserve valid work, and never demand memory puzzles."],
    ["Create an audit report with automated results and four manual test passes.", "The report separates confirmed barriers, tool warnings, false positives, and untested risk."]
  ],
  search: [
    ["Diagram how one important question moves from crawl to retrieval to answer or result.", "The diagram separates what you control, what you can measure, and what remains opaque."],
    ["Audit one URL from response code through rendered content, canonicals, links, and sitemap.", "Every issue includes evidence, user impact, and the smallest safe correction."],
    ["Rewrite one dense article around clear entities, questions, claims, sources, and useful media.", "A reader can scan it, verify it, and extract the right answer without losing context."],
    ["Add a first-hand test, original data point, working tool, or expert judgment to a generic page.", "The contribution is difficult to reproduce through paraphrase alone."],
    ["Prepare one guide for AI-assisted discovery without inventing special GEO tricks.", "It is crawlable, original, well sourced, technically sound, and explicit about who created it."],
    ["Define a monthly discovery scorecard tied to a meaningful product outcome.", "Metrics connect visibility and engagement to decisions instead of rewarding traffic in isolation."]
  ],
  ai: [
    ["Evaluate three candidate AI features and reject at least one.", "The selected use case tolerates uncertainty, supports review, and improves a measurable outcome."],
    ["Create a context contract that lists instructions, evidence, examples, state, tools, and output schema.", "Every included token has a job, and missing or conflicting context has an explicit policy."],
    ["Prototype streaming, stop, retry, edit, citation, and failure states before connecting a model.", "A user always knows what is happening, what is uncertain, and what control remains theirs."],
    ["Design one tool call with a narrow schema, permission boundary, preview, and confirmation step.", "Untrusted content cannot silently expand authority or trigger an irreversible action."],
    ["Threat-model your feature for prompt injection, disclosure, harmful output, and overreliance.", "Each high-risk path has prevention, detection, containment, and recovery—not only a warning label."],
    ["Build a 30-case evaluation set from real tasks, edge cases, and adversarial inputs.", "Release criteria cover task success, groundedness, safety, latency, cost, and regression."]
  ]
};

const featureSearchData = [
  ["Anchor positioning", "Feature", "Position menus and callouts relative to their triggers.", "#now"],
  ["Container style queries", "Feature", "Respond to component state through custom properties.", "#now"],
  [":open pseudo-class", "Feature", "Style open dialog, details, select, and picker states.", "#now"],
  ["Navigation API", "Feature", "Coordinate browser navigations through one modern interface.", "#now"],
  ["Trusted Types", "Feature", "Enforce safer values at DOM injection sinks.", "#now"],
  ["Scroll-driven animation", "Feature", "Connect motion to scroll progress with CSS.", "#now"],
  ["Live code lab", "Practice", "Edit HTML, CSS, and JavaScript in a sandboxed preview.", "#lab"],
  ["Learning methodology", "Method", "Build, break, explain, and ship.", "#manifesto"]
];

const storageKey = "learnweb-progress-v2";
const themeKey = "learnweb-theme-v2";
const progress = new Set(readStorage(storageKey, []));
const pathDialog = document.querySelector("#path-dialog");
const searchDialog = document.querySelector("#search-dialog");
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)");

function readStorage(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}

function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // The experience remains functional when storage is unavailable.
  }
}

function runTransition(update) {
  if (!document.startViewTransition || reduceMotion.matches) {
    update();
    return;
  }
  document.startViewTransition(update);
}

function setTheme(theme, persist = true) {
  document.documentElement.dataset.theme = theme;
  const light = theme === "paper";
  document.querySelector(".theme-toggle").setAttribute("aria-label", light ? "Switch to dark theme" : "Switch to light theme");
  document.querySelector(".theme-icon").textContent = light ? "◑" : "◐";
  document.querySelector('meta[name="theme-color"]').content = light ? "#f2efe6" : "#0b0b0e";
  if (persist) writeStorage(themeKey, theme);
}

function initializeTheme() {
  const saved = readStorage(themeKey, null);
  if (saved === "paper" || saved === "ink") {
    setTheme(saved, false);
  } else {
    setTheme(matchMedia("(prefers-color-scheme: light)").matches ? "paper" : "ink", false);
  }
}

function updateProgressUI() {
  const count = progress.size;
  document.querySelectorAll("[data-completed-count]").forEach((node) => {
    node.textContent = count;
  });
  document.querySelectorAll("[data-progress-bar]").forEach((bar) => {
    bar.style.width = `${(count / 30) * 100}%`;
  });
  writeStorage(storageKey, [...progress]);
}

function openPath(pathId) {
  const path = pathData[pathId];
  if (!path) return;

  const sidebar = pathDialog.querySelector(".dialog-sidebar");
  sidebar.style.setProperty("--dialog-accent", path.accent);
  pathDialog.querySelector(".dialog-symbol").textContent = path.symbol;
  pathDialog.querySelector(".dialog-label").textContent = path.label;
  pathDialog.querySelector(".dialog-description").textContent = path.description;
  pathDialog.querySelector(".dialog-overline").textContent = `${path.modules.length} studio lessons · project based`;
  pathDialog.querySelector("#path-dialog-title").textContent = path.title;
  pathDialog.querySelector(".dialog-outcome").textContent = path.outcome;

  const list = pathDialog.querySelector(".module-list");
  list.replaceChildren();
  path.modules.forEach(([title, detail, time], index) => {
    const lessonId = `${pathId}-${index + 1}`;
    const item = document.createElement("li");
    item.className = "module-item";

    const check = document.createElement("button");
    check.className = "module-check";
    check.type = "button";
    check.dataset.lessonId = lessonId;
    check.setAttribute("aria-label", `Mark ${title} complete`);
    check.setAttribute("aria-pressed", String(progress.has(lessonId)));
    check.textContent = "✓";
    check.addEventListener("click", () => toggleLesson(pathId, lessonId, check));

    const copy = document.createElement("div");
    copy.className = "module-copy";
    const strong = document.createElement("strong");
    strong.textContent = `${String(index + 1).padStart(2, "0")} · ${title}`;
    const description = document.createElement("p");
    description.textContent = detail;
    copy.append(strong, description);

    const duration = document.createElement("span");
    duration.className = "module-time";
    duration.textContent = time;

    const [mission, proof] = studioMissions[pathId][index];
    const brief = document.createElement("details");
    brief.className = "studio-brief";
    const briefLabel = document.createElement("summary");
    briefLabel.textContent = "Open studio brief";
    const make = document.createElement("p");
    make.append(Object.assign(document.createElement("strong"), { textContent: "Make — " }), mission);
    const verify = document.createElement("p");
    verify.append(Object.assign(document.createElement("strong"), { textContent: "Done when — " }), proof);
    brief.append(briefLabel, make, verify);

    item.append(check, copy, duration, brief);
    list.append(item);
  });

  updateDialogProgress(pathId);
  if (!pathDialog.open) pathDialog.showModal();
  history.replaceState(null, "", `#path-${pathId}`);
}

function toggleLesson(pathId, lessonId, button) {
  if (progress.has(lessonId)) {
    progress.delete(lessonId);
  } else {
    progress.add(lessonId);
  }
  button.setAttribute("aria-pressed", String(progress.has(lessonId)));
  updateProgressUI();
  updateDialogProgress(pathId);
}

function updateDialogProgress(pathId) {
  const complete = [...progress].filter((id) => id.startsWith(`${pathId}-`)).length;
  pathDialog.querySelector(".dialog-complete-count").textContent = complete;
  pathDialog.querySelector(".dialog-progress .meter span").style.width = `${(complete / 6) * 100}%`;
}

function closePath() {
  pathDialog.close();
  if (location.hash.startsWith("#path-")) history.replaceState(null, "", "#paths");
}

function buildSearchIndex() {
  const entries = [];
  Object.entries(pathData).forEach(([pathId, path]) => {
    entries.push({
      title: path.title,
      type: "Path",
      detail: path.description,
      action: () => openPath(pathId)
    });
    path.modules.forEach(([title, detail]) => {
      entries.push({
        title,
        type: path.title,
        detail,
        action: () => openPath(pathId)
      });
    });
  });
  featureSearchData.forEach(([title, type, detail, target]) => {
    entries.push({
      title,
      type,
      detail,
      action: () => {
        searchDialog.close();
        document.querySelector(target)?.scrollIntoView({ behavior: reduceMotion.matches ? "auto" : "smooth" });
      }
    });
  });
  return entries;
}

const searchIndex = buildSearchIndex();

function renderSearchResults(query = "") {
  const results = document.querySelector(".search-results");
  const normalized = query.trim().toLocaleLowerCase();
  const matches = (normalized
    ? searchIndex.filter((item) => `${item.title} ${item.type} ${item.detail}`.toLocaleLowerCase().includes(normalized))
    : searchIndex.slice(0, 8)
  ).slice(0, 12);

  results.replaceChildren();
  if (!matches.length) {
    const empty = document.createElement("p");
    empty.className = "empty-search";
    empty.textContent = "No exact match. Try a broader idea or browse a learning path.";
    results.append(empty);
    return;
  }

  const template = document.querySelector("#search-result-template");
  matches.forEach((item) => {
    const fragment = template.content.cloneNode(true);
    const button = fragment.querySelector(".search-result");
    fragment.querySelector(".result-type").textContent = item.type;
    fragment.querySelector(".result-title").textContent = item.title;
    fragment.querySelector(".result-detail").textContent = item.detail;
    button.addEventListener("click", () => {
      searchDialog.close();
      item.action();
    });
    results.append(fragment);
  });

  applySearchHighlight(normalized);
}

function applySearchHighlight(query) {
  if (!CSS.highlights) return;
  CSS.highlights.delete("search-hit");
  if (!query) return;

  const ranges = [];
  document.querySelectorAll(".result-title, .result-detail").forEach((element) => {
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      const text = node.textContent.toLocaleLowerCase();
      let start = text.indexOf(query);
      while (start !== -1) {
        const range = new Range();
        range.setStart(node, start);
        range.setEnd(node, start + query.length);
        ranges.push(range);
        start = text.indexOf(query, start + query.length);
      }
    }
  });
  if (ranges.length) CSS.highlights.set("search-hit", new Highlight(...ranges));
}

function openSearch() {
  if (!searchDialog.open) searchDialog.showModal();
  renderSearchResults();
  requestAnimationFrame(() => document.querySelector("#site-search").focus());
}

function initializeCapabilities() {
  const tests = [
    ["startViewTransition" in document, "View transitions"],
    [CSS.supports("anchor-name: --learnweb"), "Anchor position"],
    ["highlights" in CSS, "CSS highlights"],
    ["navigation" in window, "Navigation API"]
  ];
  document.querySelectorAll("[data-capabilities] div").forEach((row, index) => {
    const [supported, label] = tests[index];
    const output = row.querySelector("strong");
    row.querySelector("span").textContent = label;
    output.textContent = supported ? "ready" : "fallback";
    output.dataset.supported = String(supported);
  });
}

const starterCode = {};

function initializePlayground() {
  document.querySelectorAll("[data-editor]").forEach((editor) => {
    starterCode[editor.dataset.editor] = editor.value;
    editor.addEventListener("keydown", (event) => {
      if (event.key === "Tab") {
        event.preventDefault();
        const start = editor.selectionStart;
        const end = editor.selectionEnd;
        editor.setRangeText("  ", start, end, "end");
      }
      if ((event.metaKey || event.ctrlKey) && event.key === "Enter") runCode();
    });
  });
  runCode();
}

function runCode() {
  const html = document.querySelector('[data-editor="html"]').value;
  const css = document.querySelector('[data-editor="css"]').value.replaceAll("</style", "<\\/style");
  const js = document.querySelector('[data-editor="js"]').value.replaceAll("</script", "<\\/script");
  const frame = document.querySelector(".lab-frame");
  frame.srcdoc = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><style>${css}</style></head><body>${html}<script>${js}<\/script></body></html>`;
  const status = document.querySelector(".run-status");
  status.textContent = "Rendered";
  setTimeout(() => { status.textContent = "Ready"; }, 1200);
}

function resetCode() {
  Object.entries(starterCode).forEach(([name, value]) => {
    document.querySelector(`[data-editor="${name}"]`).value = value;
  });
  runCode();
}

function initializeNavigationState() {
  if (location.hash.startsWith("#path-")) {
    openPath(location.hash.replace("#path-", ""));
  }
}

document.querySelector(".theme-toggle").addEventListener("click", () => {
  const next = document.documentElement.dataset.theme === "ink" ? "paper" : "ink";
  runTransition(() => setTheme(next));
});

document.querySelectorAll("[data-open-path]").forEach((button) => {
  button.addEventListener("click", () => openPath(button.dataset.openPath));
});

document.querySelector(".dialog-close").addEventListener("click", closePath);
pathDialog.addEventListener("click", (event) => {
  if (event.target === pathDialog) closePath();
});
pathDialog.addEventListener("cancel", (event) => {
  event.preventDefault();
  closePath();
});

document.querySelectorAll(".search-trigger").forEach((button) => button.addEventListener("click", openSearch));
document.querySelector(".search-close").addEventListener("click", () => searchDialog.close());
document.querySelector("#site-search").addEventListener("input", (event) => renderSearchResults(event.currentTarget.value));
searchDialog.addEventListener("close", () => {
  document.querySelector("#site-search").value = "";
  CSS.highlights?.delete("search-hit");
});

document.addEventListener("keydown", (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLocaleLowerCase() === "k") {
    event.preventDefault();
    openSearch();
  }
});

document.querySelector(".reset-progress").addEventListener("click", () => {
  progress.clear();
  updateProgressUI();
  if (pathDialog.open) {
    const pathId = location.hash.replace("#path-", "");
    openPath(pathId);
  }
});

document.querySelectorAll("[data-editor-tab]").forEach((tab) => {
  tab.addEventListener("click", () => {
    const name = tab.dataset.editorTab;
    document.querySelectorAll("[data-editor-tab]").forEach((item) => item.setAttribute("aria-selected", String(item === tab)));
    document.querySelectorAll("[data-editor]").forEach((editor) => {
      const active = editor.dataset.editor === name;
      editor.classList.toggle("is-active", active);
      editor.hidden = !active;
    });
    document.querySelector(`[data-editor="${name}"]`).focus();
  });
});

document.querySelectorAll("[data-preview-size]").forEach((button) => {
  button.addEventListener("click", () => {
    const size = button.dataset.previewSize;
    document.querySelector("[data-playground]").dataset.size = size;
    document.querySelectorAll("[data-preview-size]").forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
  });
});

document.querySelector(".run-code").addEventListener("click", runCode);
document.querySelector(".reset-code").addEventListener("click", resetCode);

initializeTheme();
initializeCapabilities();
initializePlayground();
initializeNavigationState();
updateProgressUI();

if ("serviceWorker" in navigator && location.protocol === "https:") {
  addEventListener("load", () => navigator.serviceWorker.register("/sw.js").catch(() => {}), { once: true });
}
