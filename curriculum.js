// curriculum.js — single source of truth for learn.web content.
// Imported by app.js (runtime), generate.mjs (static pages), and check.mjs (validation).

export const siteUrl = "https://learnweb.cc";

export const pathOrder = ["foundations", "platform", "ux", "accessibility", "search", "ai"];

export const pathData = {
  foundations: {
    title: "Web Foundations",
    label: "First steps on the web",
    symbol: "▣",
    accent: "#ffb020",
    description: "The honest starting point: how the web works, how to use the browser as a studio, and the HTML, CSS, and JavaScript you need to build your first real page.",
    outcome: "Build and publish a personal page that works for a real person, using only the platform's own tools.",
    modules: [
      ["How the web works", "Follow a request from URL to pixels: DNS, HTTP, servers, and the three languages of the web.", "45 min"],
      ["Your browser is a studio", "Make live edits, read errors, and measure any page with the tools already in your browser.", "55 min"],
      ["HTML: the skeleton", "Write meaningful markup for structure, links, images, lists, and forms.", "70 min"],
      ["CSS: the skin", "Control layout, color, and typography with the cascade, the box model, and flexbox.", "80 min"],
      ["JavaScript: the behavior", "Make pages respond to people with variables, functions, events, and the DOM.", "80 min"],
      ["Capstone: your first artifact", "Combine the three languages into one page that does something real, then publish it.", "90 min"]
    ]
  },
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

export const studioMissions = {
  foundations: [
    ["Map one page-load journey in plain language, from URL to pixels.", "Your notes name DNS, a request and response, HTML parsing, and one real network resource with its status code."],
    ["Audit one real page with the browser's own tools.", "Your notes capture one live edit, one console finding, and three measurable improvement candidates."],
    ["Build a semantic personal profile page from scratch.", "It uses header, nav, main, and footer, real links, an image with alt text, and reads sensibly without CSS."],
    ["Style your profile page into a calm, readable layout.", "It uses the box model deliberately, one flex or grid layout, a visible spacing rhythm, and a responsive rule."],
    ["Add one genuine interaction to your page.", "A person can change something on the page by clicking or typing, and the core content still works with JavaScript blocked."],
    ["Publish your artifact and test it with a real person.", "The page loads over the network, and a person completes the intended task with keyboard, touch, and no coaching."]
  ],
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

export const workspaceBlueprints = {
  foundations: {
    artifact: "Field note",
    lenses: [
      ["Request story", "Walk through what happens when you type a URL and press Enter, naming each system involved.", "Real evidence", "Capture one actual request from DevTools: URL, status code, size, and load time.", "Status codes", "Describe what 200, 301, and 404 mean, with one real example of each."],
      ["Live edits", "Change one element's text and one style in DevTools on a real page.", "What you changed", "Record the exact before and after, and why the change mattered.", "Console findings", "Open the console on a real page and describe errors, warnings, or useful messages."],
      null,
      null,
      null,
      null
    ]
  },
  ux: {
    artifact: "Product decision brief",
    lenses: [
      ["Observed situation", "Who is trying to make progress, in what situation, and what did you directly observe?", "Outcome and constraint", "What change would count as progress, and what constraint must the design respect?", "Disconfirming signal", "What evidence would prove that this opportunity is not worth pursuing?"],
      ["Behavioral evidence", "Capture three specific behaviors or quotes. Separate what happened from your interpretation.", "Pattern map", "What repeated, contradicted, or remained uncertain across the conversations?", "Decision", "What will you change, preserve, or investigate next because of this evidence?"],
      ["Content inventory", "List the highest-priority items people must find and the language they use for them.", "Proposed model", "Group the items and name each group in audience language. Explain the organizing principle.", "Stress test", "Where could an item reasonably belong in two places, and how will navigation or search recover?"],
      ["Risky moment", "Name the least-certain decision in the flow and the assumption the prototype must test.", "State model", "Describe the default, loading, empty, error, and recovery states needed for a realistic test.", "Test script", "Write one neutral task prompt and the behavior that would support or challenge the design."],
      ["Component contract", "Describe anatomy, required content, optional regions, and the component’s core job.", "States and tokens", "Document interaction states, responsive behavior, accessibility needs, and token decisions.", "Escape hatch", "When should a maker not use this component, and what sanctioned alternative exists?"],
      ["Study evidence", "Record task outcomes and critical observations without turning each participant into a vote.", "Prioritization", "Rank issues using severity, frequency, confidence, and product intent.", "Next iteration", "State the smallest design change, the evidence behind it, and what you will test next."]
    ]
  },
  accessibility: {
    artifact: "Inclusive access report",
    lenses: [
      ["Perspective and context", "Describe the person, source, or lived-experience account you learned from without reducing it to a diagnosis.", "Barrier and strategy", "What barrier appeared, and what strategy, tool, or adaptation helped?", "Design implication", "What should a product team change or investigate, and what assumption must remain open?"],
      ["Tree evidence", "Record the page, task, and mismatches you found in landmarks, headings, names, roles, states, or relationships.", "Repair plan", "For each confirmed issue, state the smallest semantic or labeling correction.", "Verification", "Explain how you will inspect the accessibility tree and complete the task after the repair."],
      ["Keyboard trace", "Record the focus sequence for the primary task, including entry, action, dismissal, and return.", "Failure log", "Where was focus invisible, trapped, obscured, surprising, or dependent on a pointer?", "Repair and retest", "Describe the focus behavior you will implement and the exact keyboard pass that proves it."],
      ["Visual test matrix", "Capture results at 200% and 400% zoom, increased text spacing, forced colors, and reduced motion.", "Confirmed barriers", "What clipped, overlapped, vanished, became ambiguous, or relied on color or motion alone?", "Correction", "Name the resilient CSS or content change and how each affected mode will be retested."],
      ["Error journey", "Describe the form task, the mistake you introduced, and what the interface announced or preserved.", "Recovery design", "Write the field-level message, summary behavior, focus decision, and data-preservation rule.", "Authentication check", "Record support for paste, password managers, autocomplete, and a non-cognitive alternative."],
      ["Test coverage", "List automated, keyboard, screen reader, zoom/reflow, and content checks completed.", "Issue register", "Separate confirmed barriers, warnings that need judgment, false positives, and untested risk.", "Release decision", "State severity, affected users, owner, correction, verification method, and release recommendation."]
    ]
  },
  search: {
    artifact: "Discovery evidence dossier",
    lenses: [
      ["Question and journey", "State one important audience question and map crawl, index, retrieval, ranking, and answer stages.", "Control and evidence", "At each stage, separate what you control from what you can observe or measure.", "Unknowns", "Name what remains opaque and the experiment that could reduce uncertainty without inventing certainty."],
      ["URL evidence", "Record the URL, response, rendered content, canonical, robots state, sitemap presence, and key internal links.", "Impact analysis", "Connect each confirmed issue to discovery, user experience, or measurement impact.", "Smallest correction", "Propose the least risky repair and the specific check that will verify it."],
      ["Entity and intent map", "Name the primary entity, audience questions, supporting concepts, and the page’s intended job.", "Claim and source ledger", "Write the key claims, their evidence, attribution, and freshness requirements.", "Structure plan", "Outline headings, table or media opportunities, and internal links that reduce ambiguity."],
      ["Original contribution", "Describe the first-hand test, data, tool, example, or expert judgment you will add.", "Method and evidence", "Explain how it was produced, its limits, and what a reader can independently verify.", "Editorial decision", "Show how this contribution changes the page rather than becoming a decorative paragraph."],
      ["AI discovery readiness", "Audit crawlability, originality, authorship, claims, sources, structured data, and useful media.", "Myth filter", "List any proposed GEO tactic that lacks evidence and the durable publishing practice that replaces it.", "Improvement brief", "Prioritize changes that help people verify, understand, and act on the information."],
      ["Outcome model", "Name the product outcome and the discovery behaviors that plausibly contribute to it.", "Scorecard", "Define visibility, engagement, conversion, crawl, and qualitative measures with owners and cadence.", "Decision rule", "State what change in the evidence would trigger action, investigation, or no change."]
    ]
  },
  ai: {
    artifact: "AI system design record",
    lenses: [
      ["Candidate seams", "Describe three possible AI-assisted moments, the existing workflow, and why uncertainty may be useful.", "Reject one", "Reject at least one candidate using reviewability, reversibility, data, risk, or measurable value.", "Selected outcome", "Define the user outcome, human control, baseline, and success measure for the strongest candidate."],
      ["Context inventory", "List instructions, evidence, examples, state, tools, and output schema. Give every item a job.", "Conflict policy", "What happens when instructions conflict, evidence is missing, or the context budget is exceeded?", "Output contract", "Define a structured result, uncertainty behavior, citations, and validation before the result reaches a user."],
      ["Interaction timeline", "Describe the states from request through streaming, interruption, completion, editing, and retry.", "Uncertainty language", "Write interface copy for latency, partial output, missing evidence, and graceful failure.", "Control map", "Explain when the person can stop, revise, compare, inspect sources, or recover prior work."],
      ["Tool contract", "Define the narrow tool purpose, input schema, output schema, and explicit non-goals.", "Authority boundary", "Separate read, draft, preview, and execute permissions; identify where confirmation is mandatory.", "Adversarial case", "Show how untrusted content could attempt to expand authority and how the system contains it."],
      ["Threat model", "Trace prompt injection, data disclosure, harmful output, overreliance, and irreversible-action paths.", "Controls", "For each high-risk path, describe prevention, detection, containment, and recovery.", "Residual risk", "State what remains possible, who owns the decision, and when the feature must fail closed."],
      ["Evaluation set", "Define representative tasks, edge cases, adversarial cases, and the real-world distribution they approximate.", "Measures and graders", "Specify task success, groundedness, safety, latency, cost, and where human judgment is required.", "Release gate", "Set thresholds, regression rules, trace review, and the decision process when metrics disagree."]
    ]
  }
};

export const codeStarters = {
  foundations: [
    null,
    null,
    {
      html: `<main>
  <h1>Your name</h1>
  <img src="https://placehold.co/240x240" width="240" height="240">
  <div class="links"><a href="#about">About</a><a href="#projects">Projects</a></div>
  <section id="about">
    <h2>About</h2>
    <p>A short paragraph about you, written in your own words.</p>
  </section>
  <section id="projects">
    <h2>Projects</h2>
    <p>List what you make or want to make.</p>
  </section>
  <div class="end">Made with learn.web</div>
</main>`,
      css: `body { font: 16px/1.6 system-ui; margin: 0 auto; max-width: 40rem; padding: 2rem; }
.links { display: flex; gap: 1rem; }
img { border-radius: .75rem; }`,
      js: ``
    },
    {
      html: `<header><h1>Your name</h1></header>
<nav aria-label="Primary">
  <a href="#about">About</a><a href="#projects">Projects</a>
</nav>
<main>
  <section id="about"><h2>About</h2><p>A short paragraph about you, written in your own words.</p></section>
  <section id="projects"><h2>Projects</h2>
    <ul><li>One thing you made</li><li>One thing you're learning</li></ul>
  </section>
</main>
<footer><p>Made with learn.web</p></footer>`,
      css: `body { font: 16px/1.6 system-ui; margin: 0; padding: 2rem; }
nav a { margin-right: 1rem; }
h1 { font-size: 1.8rem; }`,
      js: ``
    },
    {
      html: `<main>
  <h1>Say hello</h1>
  <button type="button">Hello</button>
  <output aria-live="polite">Nobody has said hello yet.</output>
</main>`,
      css: `body { font: 16px/1.6 system-ui; margin: 0; min-height: 100vh; display: grid; place-items: center; }
button { font: inherit; padding: .8rem 1.2rem; border-radius: .5rem; border: 0; background: #ffb020; color: #17181d; cursor: pointer; }
output { display: block; margin-top: 1rem; text-align: center; }`,
      js: `const button = document.querySelector("button");
const output = document.querySelector("output");
button.addEventListener("click", () => {
  // Complete the interaction: update the output.
});`
    },
    {
      html: `<main class="card">
  <header><h1>Hello, I'm building on the web.</h1></header>
  <p>This card should do something small and useful. Pick one task and make it real.</p>
  <form>
    <label>Your name <input name="name" type="text" autocomplete="name"></label>
    <button type="submit">Greet me</button>
  </form>
  <output aria-live="polite"></output>
  <footer><a href="/">Back to learn.web</a></footer>
</main>`,
      css: `body { font: 16px/1.6 system-ui; margin: 0; min-height: 100vh; display: grid; place-items: center; background: #17181d; color: #f5f4ed; }
.card { width: min(28rem, 100% - 2rem); padding: 2rem; border-radius: 1rem; background: #22242d; }
form { display: grid; gap: .5rem; }
input, button { font: inherit; padding: .6rem; }
button { background: #ffb020; border: 0; color: #17181d; cursor: pointer; }
output { display: block; margin-top: 1rem; min-height: 1.5em; }
footer { margin-top: 2rem; font-size: .85rem; }
footer a { color: #ffb020; }`,
      js: `const form = document.querySelector("form");
const output = document.querySelector("output");
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = new FormData(form).get("name");
  // Complete the interaction: greet the person.
});`
    }
  ],
  platform: [
    {
      html: `<main class="demo-shell">
  <h1>Native menu</h1>
  <button popovertarget="project-menu">Project actions</button>
  <div id="project-menu" popover>
    <nav aria-label="Project actions">
      <a href="#rename">Rename project</a>
      <button type="button">Duplicate project</button>
    </nav>
  </div>
  <p id="rename">The essential content is useful before JavaScript runs.</p>
</main>`,
      css: `body { font: 16px/1.5 system-ui; margin: 0; background: #f4f1e8; color: #17181d; }
.demo-shell { width: min(42rem, 100% - 2rem); margin: 4rem auto; }
button, a { font: inherit; }
[popover] { border: 1px solid #aaa; border-radius: .75rem; padding: .5rem; }
nav { display: grid; gap: .35rem; }
nav > * { padding: .7rem; }`,
      js: `document.querySelector('[popover] button').addEventListener('click', () => {
  console.log('A convenience enhancement; the control already works.');
});`
    },
    {
      html: `<main>
  <h1>Container-aware cards</h1>
  <section class="rail" aria-label="Field notes">
    <article class="card"><span>01</span><div><h2>Intrinsic first</h2><p>This card responds to the space its parent gives it.</p></div></article>
    <article class="card"><span>02</span><div><h2>Stress the content</h2><p>Make this title much longer and resize the preview.</p></div></article>
  </section>
</main>`,
      css: `body { font: 16px/1.5 system-ui; margin: 0; padding: 2rem; background: #f4f1e8; color: #17181d; }
.rail { container-type: inline-size; display: grid; gap: 1rem; }
.card { display: grid; gap: 1rem; padding: 1rem; border: 1px solid #777; }
.card span { font: 700 .75rem monospace; }
@container (width > 34rem) {
  .card { grid-template-columns: 6rem 1fr; align-items: start; padding: 2rem; }
}`,
      js: ``
    },
    {
      html: `<main>
  <button class="trigger" popovertarget="tip">Inspect the new CSS</button>
  <aside class="tip" id="tip" popover>Anchored when supported; centered top-layer fallback otherwise.</aside>
  <p>Keep this task usable with the enhancement removed.</p>
</main>`,
      css: `body { min-height: 100vh; display: grid; place-items: center; font: 16px/1.5 system-ui; margin: 0; }
.trigger { anchor-name: --trigger; padding: 1rem; }
.tip { padding: 1rem; border: 2px solid #7a38ff; }
@supports (position-area: block-end) {
  .tip { position-anchor: --trigger; position-area: block-end; margin: .5rem 0; }
}
@media (prefers-reduced-motion: no-preference) {
  .tip:popover-open { animation: reveal .25s ease-out; }
  @keyframes reveal { from { opacity: 0; translate: 0 -.5rem; } }
}`,
      js: ``
    },
    {
      html: `<main>
  <h1>Progressive project filter</h1>
  <form action="#projects">
    <label>Filter <input name="q" type="search"></label>
    <button>Apply</button>
  </form>
  <ul id="projects">
    <li><a href="#alpha">Alpha accessibility audit</a></li>
    <li><a href="#beta">Beta performance review</a></li>
    <li><a href="#gamma">Gamma content model</a></li>
  </ul>
</main>`,
      css: `body { font: 16px/1.5 system-ui; margin: 0; padding: 2rem; }
form { display: flex; gap: .5rem; flex-wrap: wrap; }
input, button { font: inherit; padding: .6rem; }
li { margin-block: .75rem; }`,
      js: `const form = document.querySelector('form');
const items = [...document.querySelectorAll('li')];
form.addEventListener('submit', (event) => {
  event.preventDefault();
  const query = new FormData(form).get('q').toLowerCase();
  items.forEach((item) => item.hidden = !item.textContent.toLowerCase().includes(query));
  history.replaceState(null, '', query ? '?q=' + encodeURIComponent(query) : location.pathname);
});`
    },
    {
      html: `<main>
  <h1>Interaction budget</h1>
  <button id="work">Run expensive work</button>
  <output id="result" aria-live="polite">Ready</output>
  <p>Profile this interaction, then divide or defer the work while keeping feedback immediate.</p>
</main>`,
      css: `body { font: 16px/1.5 system-ui; margin: 0; padding: 2rem; }
button { font: inherit; padding: .8rem 1rem; }
output { display: block; margin-block: 1rem; font-weight: 700; }`,
      js: `const button = document.querySelector('#work');
const result = document.querySelector('#result');
button.addEventListener('click', () => {
  result.value = 'Working…';
  const start = performance.now();
  let total = 0;
  for (let i = 0; i < 18_000_000; i++) total += Math.sqrt(i);
  result.value = 'Finished in ' + Math.round(performance.now() - start) + ' ms';
});`
    },
    {
      html: `<main>
  <h1>Resilient field kit</h1>
  <form>
    <label>Observation <textarea name="observation" required></textarea></label>
    <button>Save observation</button>
  </form>
  <p id="status" role="status">Nothing saved yet.</p>
  <ul id="observations"></ul>
</main>`,
      css: `body { font: 18px/1.6 system-ui; margin: 0; background: #f4f1e8; color: #17181d; }
main { width: min(38rem, 100% - 2rem); margin: 2rem auto; }
label, textarea { display: block; width: 100%; }
textarea { min-height: 8rem; box-sizing: border-box; font: inherit; }
button { min-height: 44px; margin-top: 1rem; font: inherit; }
@media (prefers-reduced-motion: reduce) { * { scroll-behavior: auto; } }`,
      js: `const form = document.querySelector('form');
const list = document.querySelector('#observations');
form.addEventListener('submit', (event) => {
  event.preventDefault();
  const value = new FormData(form).get('observation');
  list.append(Object.assign(document.createElement('li'), { textContent: value }));
  document.querySelector('#status').textContent = 'Observation saved on this device.';
  form.reset();
});`
    }
  ]
};

export const hints = {
  foundations: [
    null,
    null,
    "Start from meaning: header, nav, main, and footer. Every image needs alt text, every link needs a real href, and the page should read sensibly with styles removed.",
    "Build rhythm first: a type scale, two or three colors, consistent padding and margin. Then one flexbox layout, then one media query. Test at 200% zoom.",
    "Use querySelector to find an element, addEventListener to listen, and textContent or classList to update it. Verify the page still works with JavaScript blocked.",
    "Prove the core task without enhancements first. Then add styling, one behavior, and the release checks—and hand the URL to a person without coaching."
  ],
  platform: [
    "Start with the native element that matches the task: popover or details/summary. popovertarget gives you focus management and dismissal for free.",
    "Declare container-type: inline-size on the rail, then write @container (width > …) rules for composition changes. Resize the preview to see it respond.",
    "Write the plain fallback first (fixed or absolute position), then layer anchor-name and position-anchor inside @supports so older browsers keep the fallback.",
    "Keep the real link or form in the HTML. Intercept only when 'navigation' in window, and update the URL with history.replaceState so refresh and deep links still work.",
    "Profile the click in the Performance panel, find the long task, then split, defer, or move it off the main thread while keeping immediate feedback such as a disabled button.",
    "Write the release checklist before polishing: keyboard task, 400% zoom, slow-network feedback, no-JS core, reduced motion. The boundary conditions are the brief."
  ]
};

export const lessonGuides = {
  foundations: [
    {
      objectives: ["Describe what happens between pressing Enter and seeing a page", "Name URL, DNS, HTTP, and the roles of HTML, CSS, and JavaScript", "Read a network request and its status code"],
      understand: ["A page is a journey, not a file", [
        "When you type a URL and press Enter, your browser asks a directory system (DNS) where the site's server lives, opens a connection, sends an HTTP request, and receives a response containing the page. The browser then turns that response into pixels.",
        "HTML provides the structure, CSS the appearance, and JavaScript the behavior. They travel together in the response, and each has a clear job. Knowing which job is which is the foundation of building for the web."
      ]],
      principle: "Every web page is a document, a style sheet, and a program arriving over a network.",
      apply: ["Follow one request with your own eyes", [
        "Open the Network panel, reload a page, and find the document request—usually the first row, the same URL you typed. Its status code tells you what happened: 200 means success, 301 a redirect, 404 a missing page.",
        "Click the row to see the response body: the HTML is right there, plain text your browser interpreted into a page. That is the whole trick of the web—it is open and inspectable by design."
      ]],
      example: `curl -I https://learnweb.cc

HTTP/2 200
content-type: text/html`,
      steps: ["Type a URL and open DevTools before reloading.", "Find the document request in the Network panel.", "Note its status code, size, and load time.", "Explain to someone what each step did."],
      quiz: [
        ["What does DNS do when you enter a URL?", ["Guarantees the page loads faster", "Resolves the domain name into a server address", "Styles the page"], 1, "DNS translates a name people can remember into an address a browser can reach."],
        ["A page returns status 404. What does it mean?", ["The page was not found", "The server is unreachable", "The page is forbidden"], 0, "404 means the requested resource does not exist at that address."]
      ]
    },
    {
      objectives: ["Inspect and edit any page's HTML and CSS live", "Read errors and messages in the console", "Measure a page with Lighthouse"],
      understand: ["DevTools are the maker's workbench", [
        "Every modern browser includes professional tools. The Elements panel shows the live DOM: you can edit text, move elements, and restyle anything, and the change is instantly visible. Nothing you do there is saved—it is a safe sandbox for learning.",
        "The Console shows errors, warnings, and messages from the page, and accepts JavaScript commands you type. The Network panel shows every request. Lighthouse audits performance, accessibility, and best practices in one click."
      ]],
      principle: "The browser is the fastest feedback loop you will ever have.",
      apply: ["Practice on a page you like", [
        "Open DevTools on any site, select an element, and change its text and color. Refresh to prove the original is untouched. Break something on purpose, then find the error in the console.",
        "Then run Lighthouse on your own page and read the results as a to-do list, not a verdict. Each failing audit names the file, the rule, and usually the fix."
      ]],
      example: `document.querySelector("h1").textContent = "I edited this live"; // try it in the Console`,
      steps: ["Open a site you admire and change one element's text and one style.", "Type a one-line script into the console and run it.", "Find and read one error or warning on a real page.", "Run Lighthouse and write down the three lowest-scoring audits."],
      quiz: [
        ["Which panel lets you edit a page's HTML and CSS live?", ["Network", "Elements", "Application"], 1, "The Elements panel shows the live DOM and computed styles you can edit in place."],
        ["What is Lighthouse best for?", ["Measuring performance, accessibility, and best practices in one pass", "Editing images", "Managing browser extensions"], 0, "Lighthouse runs a battery of audits and scores the page against them."]
      ]
    },
    {
      objectives: ["Write semantic structure with header, nav, main, and footer", "Add links, images, lists, and headings that mean something", "Know when an element is the right tool"],
      understand: ["HTML is meaning, not appearance", [
        "HTML describes what content is: a heading, a list, a link, an image, a region of navigation. Browsers, screen readers, and search engines read this meaning. Choose elements for what they mean, and styling can follow later.",
        "A link uses an href; an image needs src and, for people who cannot see it, alt describing its purpose. Lists structure items; headings create an outline. These small habits make pages usable for everyone."
      ]],
      principle: "Choose elements for what they mean, not what they look like.",
      apply: ["Build the skeleton of a profile page", [
        "Structure a page with header, nav, main, and footer; give it a single h1 and a clear section for each topic; link to your real or future projects; add one image with a useful alt description.",
        "Then look at the page without CSS. If the meaning is still clear, the skeleton is good. Every later lesson will build on this shape."
      ]],
      example: `<header><h1>Your name</h1></header>
<nav aria-label="Primary">
  <a href="#about">About</a> <a href="#projects">Projects</a>
</nav>
<main>
  <section id="about">…</section>
  <section id="projects">…</section>
</main>
<footer>…</footer>`,
      steps: ["Write a profile page with header, nav, main, sections, and footer.", "Add one real link, one list, and one image with alt text.", "Validate the markup with the W3C validator.", "Read the page without CSS and confirm the meaning survives."],
      quiz: [
        ["Which element is the right tool for a site's primary navigation?", ["div", "nav", "section"], 1, "nav marks navigation regions so people and tools can find them and skip them."],
        ["What is alt text for?", ["Describing an image when it cannot be seen", "Making images load faster", "Styling the image"], 0, "alt gives images a textual description for people who cannot see them and for search engines."]
      ]
    },
    {
      objectives: ["Use the box model to control spacing", "Write selectors with the cascade in mind", "Build a simple responsive layout with flexbox"],
      understand: ["CSS is the presentation layer", [
        "CSS turns the skeleton into a designed page. Every element is a box with content, padding, border, and margin—the box model. Spacing, alignment, and rhythm come from controlling these boxes, not from guessing pixels.",
        "The cascade resolves conflicting rules: later rules and more specific selectors win. A simple way to keep it calm: style elements directly, use classes for repeated components, and keep one source of truth in your own stylesheet."
      ]],
      principle: "Style follows structure: CSS changes appearance, never meaning.",
      apply: ["Give your profile a calm, readable design", [
        "Start with a type scale: one size for headings, one for body text, comfortable line height. Choose two or three colors and use them deliberately. Add padding and margin consistently so spacing feels intentional.",
        "Use flexbox to lay out navigation and simple rows. Add one media query so the layout still works on a narrow phone. Check it at 200% zoom—text should reflow, not break."
      ]],
      example: `.profile-card {
  display: flex;
  gap: 1rem;
  padding: 1.25rem;
  border: 1px solid #ddd;
  border-radius: .75rem;
}
@media (max-width: 40rem) {
  .profile-card { flex-direction: column; }
}`,
      steps: ["Establish a type scale and a two- or three-color palette.", "Add padding, margin, and borders until spacing feels deliberate.", "Lay out one section with flexbox.", "Add one media query and test at 200% zoom."],
      quiz: [
        ["Which parts make up the box model?", ["Content, padding, border, and margin", "Header, body, and footer", "HTML, CSS, and JavaScript"], 0, "Every element renders as content surrounded by padding, border, and margin."],
        ["Two rules target the same element; which one wins?", ["The first rule in the file", "The more specific selector", "The shortest selector"], 1, "More specific selectors win in the cascade, then source order decides ties."]
      ]
    },
    {
      objectives: ["Select elements and change them with JavaScript", "Respond to clicks and input with events", "Keep the page working when JavaScript is blocked"],
      understand: ["JavaScript makes pages respond", [
        "JavaScript runs in the browser and can read and change the page. The usual recipe: select an element with querySelector, listen for an event with addEventListener, and update the page with textContent or classList.",
        "Treat JavaScript as an enhancement. A page whose links, forms, and content work without scripts is robust, and its interactive layer can only improve on that."
      ]],
      principle: "JavaScript enhances a page that already works without it.",
      apply: ["Add one real interaction", [
        "Choose a small, genuine interaction: a button that counts, a greeting that changes, a list you can add to, a theme that toggles. Write the HTML for it first, then attach behavior in a separate script.",
        "Test with JavaScript blocked: the content must remain readable and the page must not be broken. Then turn JavaScript back on and confirm the interaction works."
      ]],
      example: `const button = document.querySelector("button");
const output = document.querySelector("output");
let count = 0;
button.addEventListener("click", () => {
  count += 1;
  output.textContent = count;
});`,
      steps: ["Pick one small interaction and write its HTML first.", "Select the elements and attach an event listener.", "Update the page and keep the interaction state in the page itself.", "Verify the core page works with JavaScript blocked."],
      quiz: [
        ["Which method selects the first element matching a CSS selector?", ["querySelector", "querySelectorAll", "getElement"], 0, "querySelector returns the first matching element; querySelectorAll returns all."],
        ["Which event fires when a person clicks an element?", ["submit", "click", "load"], 1, "click fires on activation; submit is specific to forms."]
      ]
    },
    {
      objectives: ["Combine HTML, CSS, and JavaScript into one page", "Test the page like a user, not an author", "Publish it somewhere real"],
      understand: ["Your first artifact is proof, not perfection", [
        "The capstone combines everything: a meaningful page built from semantic HTML, styled with deliberate CSS, and given one genuine behavior with JavaScript. Its job is to work for a real person, not to win a design award.",
        "Testing like a user means completing the task the way a visitor would: keyboard, touch, zoomed text, slow network. Watch for moments where you, the author, would know what to do but a stranger would not."
      ]],
      principle: "The first artifact is proof, not perfection.",
      apply: ["Ship it", [
        "Choose the smallest real purpose: introduce yourself, collect a note, compare two options, or share a resource list. Build the core task first, then style it, then add the behavior.",
        "Publish on any free static host, send the link to one person, and ask them to complete the task without coaching. Your notes on what surprised you are part of the artifact."
      ]],
      example: `const releaseChecks = [
  "Core task works without JavaScript",
  "Keyboard can complete the task",
  "200% zoom still reads well",
  "A real person completes it uncoached"
];`,
      steps: ["Choose one small, real purpose for the page.", "Build the HTML core first, then CSS, then one behavior.", "Run the release checks above.", "Publish, share the URL with one person, and write down what surprised you."],
      quiz: [
        ["What should work before JavaScript loads?", ["The core content and task", "All animations", "Nothing—the page is a shell"], 0, "Enhancement means the essential experience exists without scripts."],
        ["Which is the strongest test of a small page?", ["Another person completes the real task uncoached", "The page matches the mockup", "It uses the newest frameworks"], 0, "Uncoached task completion by a real person is the artifact's true test."]
      ]
    }
  ],
  platform: [
    {
      objectives: ["Choose native HTML before recreating a control", "Explain the accessible name, role, and state of an element", "Use JavaScript as an enhancement instead of a prerequisite"],
      understand: ["Start with behavior, not appearance", [
        "HTML is not a collection of neutral boxes. A button already knows how to receive focus, react to keyboard and pointer input, participate in forms, and announce itself to assistive technology. Rebuilding that behavior on a div means accepting responsibility for every interaction the browser previously handled.",
        "Before choosing an element, write the user action as a sentence: submit information, navigate somewhere, reveal optional content, choose one option, or open a temporary layer. That verb usually points to a native element. Use ARIA to clarify a gap, not to repaint the identity of convenient markup."
      ]],
      principle: "The most robust custom control is often the native control you did not replace.",
      apply: ["Progressive enhancement in three layers", [
        "Layer one is meaningful HTML that completes the essential task. Layer two is CSS that improves composition without changing meaning. Layer three is JavaScript that adds convenience while preserving links, forms, history, and browser conventions.",
        "Test the boundary by blocking the script, tabbing through the interface, and inspecting the accessibility tree. A resilient experience may be less polished without enhancement, but it must remain understandable and useful."
      ]],
      example: `<button popovertarget="lesson-tip">Why native?</button>
<aside id="lesson-tip" popover>
  Focus, dismissal, and top-layer behavior are built in.
</aside>`,
      steps: ["Find one custom menu, disclosure, modal, or clickable div.", "Name the user action and select the closest native element.", "Rebuild the smallest version with HTML first, then style it.", "Disable JavaScript and complete the task with a keyboard."],
      quiz: [
        ["A card navigates to a detailed page. What should its primary interactive element be?", ["A div with role=\"button\"", "A link with a real href", "A button with a click handler"], 1, "Navigation changes location, so a real link communicates intent, supports browser conventions, and works before JavaScript."],
        ["A “Show more” control reveals optional content. Which element fits best?", ["A span with a click handler", "details with a summary", "A div with tabindex=\"0\""], 1, "details/summary provides native disclosure: toggle behavior, keyboard support, and semantics for free."]
      ]
    },
    {
      objectives: ["Distinguish viewport and component responsiveness", "Use intrinsic sizing before adding breakpoints", "Build a component that responds to its container"],
      understand: ["The viewport is not the component", [
        "A viewport media query knows the browser width, not the space a component actually receives. The same card may live in a full-width page, a split panel, or a narrow sidebar at the same viewport size. Container queries let the card respond to its own layout context.",
        "Begin with intrinsic rules: minmax(), min(), max(), clamp(), flex wrapping, and grid auto-placement. They allow content to negotiate space without a list of device guesses. Add a container query only when the component needs a meaningful change in composition."
      ]],
      principle: "Responsive design is a negotiation with available space, not a catalog of popular devices.",
      apply: ["A component owns its adaptation", [
        "Declare container-type on the component’s parent, then query that container with inline-size. Keep breakpoints local and name them after the design change—stacked card, roomy card—not a device.",
        "Stress-test with long titles, translated text, 200% zoom, missing images, and a very narrow parent. The useful breakpoint is where the content stops working, not where a framework says tablet begins."
      ]],
      example: `.card-region { container-type: inline-size; }
.card { display: grid; gap: 1rem; }
@container (width > 34rem) {
  .card { grid-template-columns: 12rem 1fr; }
}`,
      steps: ["Place the same component in one narrow and one wide parent.", "Use intrinsic sizing to remove avoidable overflow.", "Add one container query for a genuine composition change.", "Test long content, zoom, and a missing optional element."],
      quiz: [
        ["When is a container query most appropriate?", ["When a component changes because of its own available width", "Whenever the viewport is below 768px", "To replace every flex-wrap rule"], 0, "Container queries are strongest when reusable components need to adapt independently of the viewport."],
        ["Which declaration makes an element a container for inline-size queries?", ["container-type: inline-size", "display: container", "position: container"], 0, "container-type: inline-size opts the element into container queries for its inline axis."]
      ]
    },
    {
      objectives: ["Layer new CSS behind a working baseline", "Use anchor positioning for relational layout", "Respect user motion preferences"],
      understand: ["Modern CSS is a capability ladder", [
        "New CSS does not require an all-or-nothing browser target. Write the dependable layout first, then add a sharper behavior inside @supports. Browsers that understand the feature get the enhancement; the rest ignore it without breaking the task.",
        "Anchor positioning is a good example. A popover can have a normal fixed or absolute fallback, then position itself relative to its trigger when anchor-name and position-area are supported. The relationship lives in CSS instead of JavaScript coordinates."
      ]],
      principle: "Progressive enhancement turns browser diversity from a blocker into a design constraint.",
      apply: ["Motion should explain change", [
        "View transitions and scroll-driven animations can communicate continuity, hierarchy, and progress. They become noise when they animate everything or delay control. Define the information the motion carries before choosing an effect.",
        "Use prefers-reduced-motion to remove nonessential movement, not merely shorten it. Verify that content order, focus, and task completion make sense with all animation disabled."
      ]],
      example: `.trigger { anchor-name: --tip; }
.tip { position: absolute; }
@supports (position-area: block-start) {
  .tip {
    position-anchor: --tip;
    position-area: block-start;
  }
}`,
      steps: ["Choose one tooltip or callout with brittle JavaScript coordinates.", "Create a simple non-anchored fallback.", "Enhance it with anchor positioning and a position fallback.", "Disable the feature and reduced-motion animations to verify the task."],
      quiz: [
        ["What belongs inside @supports?", ["The only version of essential content", "An enhancement whose fallback already works", "All design tokens"], 1, "Feature queries are ideal for enhancements layered over a complete baseline."],
        ["In a browser without position-area support, what happens?", ["The rule is ignored and the fallback stays", "The page fails to load", "The browser downloads a polyfill"], 0, "Unsupported declarations are ignored, which is exactly what makes progressive enhancement work."]
      ]
    },
    {
      objectives: ["Preserve browser navigation semantics", "Detect capabilities instead of browser brands", "Recognize dangerous DOM injection boundaries"],
      understand: ["Enhancement must not erase the browser", [
        "JavaScript can make an interaction faster while accidentally breaking deep links, Back and Forward, refresh, focus, or open-in-new-tab. Start with real URLs and form submissions. Intercept only when the enhanced path is available, and update history in a way the browser can restore.",
        "Capability detection asks whether the needed API exists. Browser sniffing guesses from a name and version, then becomes stale. A small feature test and a working fallback are easier to reason about."
      ]],
      principle: "If JavaScript improves navigation, the browser’s own navigation must remain the source of truth.",
      apply: ["Treat HTML injection as a security boundary", [
        "innerHTML and similar sinks interpret strings as markup. If an attacker can influence the string, they may create executable or misleading content. Prefer textContent and DOM construction. When an application genuinely needs HTML, sanitize it and consider enforcing Trusted Types.",
        "Security is not a final audit. The safest interface makes the dangerous path difficult to call and the ordinary path safe by default."
      ]],
      example: `const update = () => {
  document.querySelector("output").textContent = userValue;
};

if ("navigation" in window) {
  navigation.addEventListener("navigate", enhanceNavigation);
}`,
      steps: ["Find one interaction that changes URL or page content.", "Confirm the unenhanced link or form works.", "Add the enhancement using capability detection.", "Test Back, Forward, refresh, focus restoration, and an untrusted string."],
      quiz: [
        ["Which assignment is safest for displaying untrusted plain text?", ["element.innerHTML = value", "element.outerHTML = value", "element.textContent = value"], 2, "textContent displays text without parsing it as markup."],
        ["What is the safest way to show untrusted plain text?", ["element.textContent = value", "element.innerHTML = value", "document.write(value)"], 0, "textContent renders the value as text; innerHTML and document.write parse it as markup."]
      ]
    },
    {
      objectives: ["Connect performance metrics to human experience", "Identify the critical rendering path", "Reduce main-thread work behind a slow interaction"],
      understand: ["Performance is what waiting feels like", [
        "Largest Contentful Paint describes when the main content becomes visible. Interaction to Next Paint describes how quickly the page responds after a person acts. Cumulative Layout Shift describes visual stability. They are proxies for experiences—arrival, response, and trust—not trophies.",
        "Field data matters because real devices, networks, caches, and interactions differ from a lab run. Use lab tools to diagnose a problem and real-user measurement to understand its prevalence."
      ]],
      principle: "Optimize the delay a person can feel, then use metrics to verify the improvement.",
      apply: ["Protect the main thread", [
        "A slow interaction often contains input delay, JavaScript execution, style and layout, then paint. Break up long tasks, avoid rendering work the user cannot see, defer noncritical scripts, and keep DOM changes focused.",
        "Performance budgets turn intent into a constraint. Set budgets for page weight, third-party work, image dimensions, and interaction latency before the page grows expensive."
      ]],
      example: `button.addEventListener("click", async () => {
  button.disabled = true;
  await scheduler.yield?.();
  renderOnlyWhatChanged();
  button.disabled = false;
});`,
      steps: ["Record one noticeably slow interaction.", "Name the largest blocking task and the user-visible delay it causes.", "Remove, defer, split, or reduce that work.", "Measure again under the same conditions and document the tradeoff."],
      quiz: [
        ["Which metric focuses on responsiveness after user interaction?", ["LCP", "INP", "CLS"], 1, "INP summarizes interaction responsiveness by measuring the latency of user interactions."],
        ["A long main-thread task most directly harms which experience?", ["Interaction responsiveness", "First paint", "Page weight"], 0, "Long tasks block the main thread and delay responses to user interaction, the INP experience."]
      ]
    },
    {
      objectives: ["Define resilience across input, network, and browser conditions", "Create a small release checklist", "Ship and learn from a real user"],
      understand: ["A capstone is a system, not a screenshot", [
        "Choose one narrow workflow: compare two options, calculate a result, submit a request, or organize a small set of information. Make the essential path obvious and complete before adding visual ambition.",
        "Write failure states early. What happens offline, during a slow request, with empty data, after invalid input, at 400% zoom, or when storage is unavailable? A resilient interface makes uncertainty visible and recovery possible."
      ]],
      principle: "The quality of an interface is revealed at its boundaries, not in its ideal screenshot.",
      apply: ["Ship a testable claim", [
        "Define success as a behavior another person can demonstrate. Give them the URL and a task without coaching. Observe where the design’s assumptions collide with their behavior.",
        "After shipping, write a short changelog: what you expected, what happened, what you changed, and what remains uncertain. That explanation is part of the artifact."
      ]],
      example: `const releaseChecks = [
  "Keyboard task complete",
  "400% zoom reflows",
  "Slow network has feedback",
  "No-JS core path works",
  "Reduced motion respected"
];`,
      steps: ["Choose one useful workflow and write its definition of done.", "Implement the semantic baseline and one meaningful enhancement.", "Test the five boundary conditions in the release checklist.", "Give the task to another person, observe, revise, and publish your notes."],
      quiz: [
        ["What is the strongest capstone success criterion?", ["It matches the mockup exactly", "A real person can complete the intended task under stated constraints", "It uses the largest number of new APIs"], 1, "A capstone proves capability through a usable outcome, including the constraints you designed for."],
        ["Which check belongs in every release list?", ["Reduced motion is respected and the keyboard completes the core task", "The page uses the newest APIs", "Every element has a shadow"], 0, "Resilience checks—keyboard, motion, zoom, no-JS—protect real users in real conditions."]
      ]
    }
  ],
  ux: [
    {
      objectives: ["Separate outcomes from requested features", "Write a falsifiable problem frame", "Choose evidence that could change the plan"],
      understand: ["Requests are clues, not requirements", [
        "“Add a dashboard” describes a solution. Ask what decision the dashboard should improve, who makes it, what they do today, and what cost or risk exists. The answer may still be a dashboard, but now the team can judge whether it works.",
        "A useful problem frame names the person, situation, desired progress, constraints, and evidence of success. It also names what would disprove the opportunity. Without a disconfirming signal, research becomes a search for agreement."
      ]],
      principle: "Frame the change in human behavior before choosing the shape of the interface.",
      apply: ["Turn ambiguity into a learning plan", [
        "List assumptions about value, usability, feasibility, and viability. Rank them by uncertainty and consequence. The riskiest assumption determines what to learn first.",
        "Match evidence to the decision: interviews for motives and language, observation for actual behavior, analytics for patterns at scale, and prototypes for comprehension and usability."
      ]],
      steps: ["Rewrite a feature request as an outcome.", "List five assumptions and rank them by uncertainty and consequence.", "Choose one method that could disprove the riskiest assumption.", "Define the behavior or evidence that would change your decision."],
      quiz: [
        ["Which problem statement is most useful?", ["Users need an AI dashboard", "Support agents need to find verified policy answers during a call without switching tools", "We should modernize the interface"], 1, "It names a person, situation, desired progress, and constraint without locking the team into one solution."],
        ["Which statement is a useful disconfirming signal?", ["“Even after three attempts, support agents still switch tools to answer a policy question”", "“Users say the dashboard looks modern”", "“The team is excited about the roadmap”"], 0, "A disconfirming signal describes evidence that would disprove the opportunity."]
      ]
    },
    {
      objectives: ["Ask for behavior rather than predictions", "Select a method that fits the decision", "Separate evidence from interpretation"],
      understand: ["Memory beats speculation", [
        "People are poor predictors of what they will do, especially when they want to be helpful. Ask for the last real occasion: what triggered it, what happened next, what tools were involved, and where the work became difficult.",
        "An interview reveals meaning and language. Observation reveals workarounds and context. A survey estimates a known pattern. Analytics show what happened but rarely why. Combine methods only when each closes a real evidence gap."
      ]],
      principle: "Ask about a specific past behavior before asking for a future preference.",
      apply: ["Synthesis is disciplined compression", [
        "Keep raw observations, participant words, interpretations, and recommendations distinct. Affinity mapping helps reveal repeated behavior, but frequency alone does not determine importance.",
        "A finding should connect evidence to an implication: what was observed, why it matters, who it affects, and what decision it informs. Preserve contradictions instead of smoothing them away."
      ]],
      steps: ["Write five behavior-first interview questions.", "Run three short conversations or observations.", "Capture facts and quotes separately from interpretations.", "Create three findings, each with evidence and a decision implication."],
      quiz: [
        ["Which question is least leading?", ["Would you use a faster dashboard?", "Tell me about the last time you prepared this report", "Do you agree the current flow is confusing?"], 1, "A recent concrete event produces more reliable detail than a hypothetical preference."],
        ["Which question is most leading?", ["Tell me about the last time you prepared this report", "Don't you agree the current flow is confusing?", "What tools did you use last week?"], 1, "Leading questions suggest the expected answer; “Don't you agree…” invites agreement."]
      ]
    },
    {
      objectives: ["Model content before drawing navigation", "Use audience language for labels", "Evaluate findability with representative tasks"],
      understand: ["Information architecture is a prediction", [
        "Every category and navigation label predicts where a person will look. Start by inventorying the content and identifying entities, tasks, relationships, and lifecycle. An org chart is rarely a useful model for people outside the organization.",
        "Labels carry more weight than icons. Use familiar, specific language and avoid forcing one item into several ambiguous categories. Search and navigation complement each other; neither repairs unclear content."
      ]],
      principle: "Good information architecture makes the next place feel obvious before a person clicks.",
      apply: ["Test the structure without visual design", [
        "Open card sorting reveals how participants group information. Closed sorting tests an existing structure. Tree testing asks where people would look for specific items without interface decoration.",
        "Measure first-click confidence, success, directness, and the language participants use. A wrong but popular location may signal that the model—not the user—needs to change."
      ]],
      steps: ["Inventory at least 25 content items.", "Identify the top tasks and vocabulary used by your audience.", "Run a small card sort or tree test.", "Revise labels and structure based on failed paths and hesitation."],
      quiz: [
        ["What should primarily determine a navigation label?", ["Internal department names", "Words the intended audience expects for the task or content", "The shortest possible abbreviation"], 1, "Labels work when they match the audience’s information scent and vocabulary."],
        ["A “wrong but popular” location in a tree test most likely means…", ["The participant is wrong", "The information model, not the user, needs to change", "The test is broken"], 1, "Repeated expected-looking placement is a signal about the model, and the model is the thing to revise."]
      ]
    },
    {
      objectives: ["Match prototype fidelity to uncertainty", "Include states beyond the happy path", "Write a task that tests behavior rather than opinion"],
      understand: ["Prototype the question", [
        "A prototype is an instrument for learning. If the uncertainty is whether people understand the sequence, paper may be enough. If the uncertainty is keyboard behavior or perceived latency, a coded prototype may be necessary.",
        "High visual polish can make a weak concept feel finished and discourage honest critique. Spend fidelity only where it helps answer the current question."
      ]],
      principle: "The right prototype is the cheapest artifact that can answer the riskiest question.",
      apply: ["States are part of the design", [
        "Include loading, empty, partial, invalid, permission-denied, offline, and success states when they affect the decision. A single golden path hides the moments where trust is won or lost.",
        "Give participants a goal and context, not click instructions. Observe where they start, what they expect, and how they recover. Ask them to explain what they think happened after acting."
      ]],
      steps: ["Name one uncertain product decision.", "Choose the minimum fidelity required to test it.", "Prototype the core path plus two risky states.", "Run a task without coaching and record expectations, errors, and recovery."],
      quiz: [
        ["When is a high-fidelity prototype justified?", ["Whenever presenting to leadership", "When the research question depends on realistic interaction or visual perception", "At the start of every project"], 1, "Fidelity should serve the learning question, not status or habit."],
        ["Which state should a prototype include before testing?", ["Loading and empty states", "Only the perfect first-run flow", "Every marketing asset"], 0, "The moments where trust is won or lost are loading, empty, error, and recovery states."]
      ]
    },
    {
      objectives: ["Distinguish tokens, components, and patterns", "Document behavior and content rules", "Design exceptions deliberately"],
      understand: ["A system is shared reasoning", [
        "A component library stores reusable interface pieces. A design system also stores principles, tokens, content guidance, accessibility behavior, contribution rules, and decisions. Its value is faster coherent judgment, not identical screens.",
        "Tokens give names to repeated choices such as color, spacing, type, and motion. Components combine those choices with structure and states. Patterns explain how components work together to solve recurring tasks."
      ]],
      principle: "A design system succeeds when it improves decisions, not when it maximizes reuse.",
      apply: ["Document the invisible parts", [
        "Show anatomy, required and optional content, states, responsive behavior, keyboard interaction, accessible names, and examples of misuse. A screenshot documents appearance but not behavior.",
        "Create an escape hatch for valid exceptions and a path for improvements to return to the system. Teams bypass systems that cannot represent real needs."
      ]],
      steps: ["Select one repeated component.", "Document anatomy, tokens, content rules, states, and keyboard behavior.", "Add one misuse example and one valid exception.", "Ask another maker to use the documentation without your help."],
      quiz: [
        ["Which item is a design token?", ["A checkout flow", "The named spacing value space-4", "A modal dialog component"], 1, "A token names a reusable design decision; components and patterns consume tokens."],
        ["What is an escape hatch for?", ["Allowing a sanctioned exception when the component cannot represent the need", "Letting anyone write any CSS", "Hiding documentation"], 0, "Escape hatches keep the system honest by representing valid exceptions explicitly."]
      ]
    },
    {
      objectives: ["Write neutral usability tasks", "Identify severity using impact and frequency", "Turn observations into prioritized changes"],
      understand: ["A usability test evaluates the design", [
        "Five thoughtful sessions can reveal many severe interaction problems, but the number is not a universal law. Recruit people who resemble the intended audience and test representative tasks.",
        "Avoid teaching the interface through the task. “Find out whether this plan supports guests” is better than “Click Pricing, then compare plans.” Ask participants to think aloud without turning the session into an interview."
      ]],
      principle: "When a participant struggles, investigate the design before explaining it.",
      apply: ["Findings need a decision", [
        "Record observable behavior: path taken, hesitation, error, recovery, and outcome. A participant saying “I like it” is feedback; failing to find the save action is usability evidence.",
        "Prioritize by severity, frequency, reach, and confidence. Recommend the smallest change that addresses the cause, then retest. Do not convert every comment into a feature."
      ]],
      steps: ["Write three realistic, neutral tasks.", "Run sessions with five representative participants where practical.", "Log observable behavior and quotes separately.", "Rank findings, revise the highest-severity issue, and retest it."],
      quiz: [
        ["Which observation is strongest usability evidence?", ["Three participants could not find how to save and abandoned the task", "One participant preferred blue", "A stakeholder called the page clean"], 0, "Repeated task failure directly connects interface behavior to an intended outcome."],
        ["When is a usability finding strongest?", ["Several participants fail the same task and it blocks the intended outcome", "One participant calls the page clean", "A stakeholder prefers a different color"], 0, "Repeated, observable task failure tied to an intended outcome is the strongest evidence."]
      ]
    }
  ],
  accessibility: [
    {
      objectives: ["Describe disability as an interaction with barriers", "Distinguish conformance from lived usability", "Include disabled people in evaluation"],
      understand: ["Accessibility is a quality of the interaction", [
        "A person is not the edge case. Barriers emerge when a product assumes one way of seeing, hearing, moving, understanding, or communicating. The same barrier may affect permanent disability, a temporary injury, or someone using a phone in glare.",
        "WCAG gives testable requirements and a shared baseline. Conformance is valuable, but it cannot guarantee that every person can use a product. Automated tools find only a subset of problems; human testing supplies context and strategies."
      ]],
      principle: "Design for human variation from the beginning; do not bolt accessibility onto finished screens.",
      apply: ["Use standards and lived evidence together", [
        "Organize checks around perceivable, operable, understandable, and robust. Then test real tasks with keyboard, screen readers, zoom, voice input, and people whose access needs differ from yours.",
        "Describe barriers precisely: the control has no accessible name; focus moves behind the dialog; the error is conveyed by color only. Precision makes repair possible."
      ]],
      steps: ["Choose one important task.", "List the sensory, motor, cognitive, and situational assumptions it makes.", "Test the task with two different access methods.", "Document barriers as observable cause and impact."],
      quiz: [
        ["What does WCAG conformance guarantee?", ["Perfect usability for every disabled person", "Meeting a defined set of testable accessibility requirements", "Passing every automated scanner"], 1, "Conformance is a valuable baseline, but human needs and usability extend beyond any checklist."],
        ["Which situation is an example of a situational barrier?", ["Using a phone in bright sunlight", "Being unable to speak", "Living without internet"], 0, "Barriers are interactions between people and conditions; glare on a phone is a classic situational case."]
      ]
    },
    {
      objectives: ["Read an accessibility tree", "Create useful names and relationships", "Use ARIA only where native semantics are insufficient"],
      understand: ["Assistive technology receives a model", [
        "Browsers transform DOM and CSS into an accessibility tree containing roles, names, states, and relationships. A visually clear control can be silent or misleading if that model is wrong.",
        "Native HTML supplies semantics automatically. Labels connect instructions to form controls. Headings create navigable structure. Landmarks divide regions. ARIA can add missing information, but a role does not add keyboard behavior."
      ]],
      principle: "No ARIA is better than bad ARIA, and native HTML is usually better than equivalent ARIA.",
      apply: ["Name things by their purpose", [
        "An accessible name should distinguish the control in context: “Remove Maya from project” is more useful than six buttons named “Remove.” Visible text should normally be part of the accessible name.",
        "Inspect the tree, then navigate by headings and landmarks with a screen reader. Fix the DOM model rather than hiding symptoms with extra announcements."
      ]],
      example: `<label for="email">Work email</label>
<input id="email" name="email" type="email"
       autocomplete="email" required>`,
      steps: ["Open the accessibility tree for one page.", "Check landmark, heading, control name, role, state, and relationship.", "Replace avoidable ARIA with native HTML.", "Navigate the result by headings, landmarks, and form controls."],
      quiz: [
        ["What does role=\"button\" add to a div by itself?", ["Button semantics only", "Full keyboard and form behavior", "Automatic focus and Space-key handling"], 0, "ARIA changes the exposed role; the author must still implement focus, keyboard behavior, and state."],
        ["An input's accessible name should normally…", ["Include its visible label text", "Be hidden from all users", "Match its placeholder exactly"], 0, "A visible label is the most reliable source of an accessible name."]
      ]
    },
    {
      objectives: ["Complete an interface by keyboard", "Manage focus during dynamic changes", "Keep focused controls visible"],
      understand: ["Keyboard access is interaction architecture", [
        "Tab should move through interactive elements in a logical order. Arrow keys often move within composite widgets such as tabs or menus. Enter and Space activate according to native conventions. Avoid positive tabindex values, which create a second fragile reading order.",
        "Visible focus is location information. It must remain distinguishable and not be hidden under sticky headers, cookie banners, or dialogs. WCAG 2.2 adds explicit focus-not-obscured requirements."
      ]],
      principle: "Focus should follow the user’s task, not the order in which elements happened to be coded.",
      apply: ["Move focus only for a reason", [
        "When a modal opens, focus moves inside; when it closes, focus returns to the trigger. After deleting an item, focus moves to a sensible neighbor or status. Routine content updates should not steal focus.",
        "Test forward and backward, at zoom, and after every dynamic action. A keyboard trap is any state a person cannot leave using the same input method."
      ]],
      steps: ["Put the mouse away and complete the primary task.", "Record missing, hidden, illogical, or trapped focus.", "Repair with native controls and deliberate focus movement.", "Repeat backward and at 200% zoom."],
      quiz: [
        ["After closing a modal dialog, where should focus usually go?", ["The top of the page", "Back to the element that opened it", "The browser address bar"], 1, "Returning to the trigger preserves context and lets the user continue from where they started."],
        ["A keyboard trap is…", ["A state a person cannot leave using the keyboard", "An element with tabindex", "A page without links"], 0, "A trap blocks keyboard escape; every state must be leaveable with the same input method."]
      ]
    },
    {
      objectives: ["Test contrast without relying on color alone", "Verify reflow at zoom", "Respect forced colors and reduced motion"],
      understand: ["Visual access is more than contrast", [
        "Contrast helps text and controls remain distinguishable, but color cannot be the only signal for errors, status, or selection. Pair color with text, shape, iconography, or position.",
        "At 400% zoom a desktop layout effectively becomes narrow. Content should reflow without two-dimensional scrolling for ordinary reading. Fixed heights, clipped text, and rigid columns often fail first."
      ]],
      principle: "A visual system is resilient when meaning survives changed color, scale, motion, and viewport.",
      apply: ["Let user preferences win", [
        "Forced-colors mode may replace your palette. Use semantic borders and system colors where needed. Reduced motion should remove effects that imply movement through space or trigger discomfort.",
        "Test with browser zoom, text-only spacing changes, high contrast, grayscale, and motion reduction. Do not infer accessibility from a design token’s name."
      ]],
      steps: ["Identify every place color communicates meaning.", "Add a non-color cue and test contrast.", "Test 200% and 400% zoom plus text spacing.", "Enable forced colors and reduced motion, then repair lost meaning."],
      quiz: [
        ["Which error treatment is most robust?", ["A red border only", "A red border, error icon, and specific text linked to the field", "A brief shake animation"], 1, "Multiple cues and an explicit message preserve meaning across visual conditions and assistive technology."],
        ["At 400% zoom, a well-built page should…", ["Reflow without two-dimensional scrolling for reading", "Hide the navigation", "Remain pixel-identical"], 0, "At 400% zoom the layout effectively narrows; content must reflow to fit."]
      ]
    },
    {
      objectives: ["Write clear instructions and errors", "Support autocomplete and password managers", "Design recovery without repeated entry"],
      understand: ["A form is a conversation about recovery", [
        "Labels explain what to provide; instructions explain format or constraints before failure; errors identify what went wrong and how to fix it. Placeholder text is not a replacement for a persistent label.",
        "Validate at a helpful moment. Premature errors punish unfinished input; validation only after submission may create a long recovery loop. Preserve valid values and move focus or provide a summary when submission fails."
      ]],
      principle: "An accessible form helps people recover from mistakes without losing work or proving they are human again.",
      apply: ["Authentication should work with tools people rely on", [
        "Allow paste, password managers, and autocomplete. Avoid cognitive-function tests unless an accessible alternative exists. Use the correct autocomplete tokens so browsers can assist.",
        "Touch targets need enough size and spacing. Required state, errors, and success must be available to screen readers without unexpected focus theft."
      ]],
      example: `<input id="password" type="password"
  autocomplete="current-password"
  aria-describedby="password-help">
<p id="password-help">At least 12 characters.</p>`,
      steps: ["Complete the form with intentional mistakes.", "Rewrite instructions and errors as specific recovery steps.", "Add labels, autocomplete, error relationships, and a summary.", "Test paste, password manager behavior, zoom, keyboard, and touch targets."],
      quiz: [
        ["Why should a sign-in form allow password paste?", ["It makes the page faster to animate", "It supports password managers and reduces memory burden", "It prevents browser autofill"], 1, "Paste and password managers support stronger credentials and accessible authentication."],
        ["The autocomplete attribute helps because…", ["It lets password managers and assistive tools fill fields correctly", "It makes forms prettier", "It disables paste"], 0, "Correct autocomplete tokens support password managers, paste, and assistive technology."]
      ]
    },
    {
      objectives: ["Combine automated and manual testing", "Prioritize barriers by user impact", "Write reproducible accessibility findings"],
      understand: ["Automation is a fast first pass", [
        "Automated tools are excellent at deterministic checks such as missing names, invalid relationships, and some contrast failures. They cannot decide whether alternative text is useful, focus order makes sense, or a workflow is understandable.",
        "A credible audit records scope, browser, assistive technology, viewport, tasks, and known limits. Retest fixes instead of treating the report as the end."
      ]],
      principle: "A scanner reports code patterns; an accessibility test evaluates whether people can complete tasks.",
      apply: ["Write findings people can reproduce", [
        "Include the barrier, affected users, steps, actual result, expected result, standard reference, severity, and a focused recommendation. Separate confirmed failures from risks that need more testing.",
        "Prioritize blockers in core tasks, then widespread and severe barriers. Cosmetic rule violations with little impact should not outrank an unlabeled payment control."
      ]],
      steps: ["Define three representative tasks and the test environment.", "Run automation, keyboard, zoom, and one screen-reader pass.", "Write each confirmed finding with reproduction and impact.", "Fix the highest-severity issue and retest the original task."],
      quiz: [
        ["Which problem is an automated scanner least able to judge?", ["A form control has no programmatic label", "Alternative text accurately communicates the image’s purpose", "An ID is duplicated"], 1, "The usefulness of alternative text depends on content and context, which requires human judgment."],
        ["A reproducible finding includes…", ["Steps to reproduce and the impact on users", "Only a screenshot", "Only the automated tool name"], 0, "Reproduction and impact let others verify severity and prioritization."]
      ]
    }
  ],
  search: [
    {
      objectives: ["Explain crawl, index, retrieve, and rank", "Map search intent to content purpose", "Separate controllable signals from myths"],
      understand: ["Discovery is a sequence of gates", [
        "A system must discover a URL, fetch it, understand and index its content, retrieve it for a relevant query, then decide how to present it. A failure at an early gate cannot be repaired by polishing a later one.",
        "Generative search still relies on retrieval and quality systems. Answers may combine multiple passages and queries, but crawlability, clear content, reputation, and original value remain foundational."
      ]],
      principle: "Make useful information accessible to people and machines before trying to influence how it ranks.",
      apply: ["Intent is the job behind the query", [
        "Queries may seek an explanation, comparison, action, location, product, or reassurance. Analyze the result landscape and the decisions a reader must make, then choose a format that serves them.",
        "Do not confuse correlation with control. Document what the platform states, what your data shows, and what remains a hypothesis."
      ]],
      steps: ["Choose one important audience question.", "Map discovery, crawl, index, retrieval, presentation, and conversion.", "Identify the likely task and required evidence.", "Mark every assumption as documented, observed, or unknown."],
      quiz: [
        ["If a useful page is blocked from crawling, what should you fix first?", ["Add more keywords", "Restore crawler access", "Increase the word count"], 1, "The content cannot enter later discovery stages until the system can fetch it."],
        ["Which discovery gate comes first?", ["Crawling", "Ranking", "Citation"], 0, "A system must first find and fetch the URL before any later gate matters."]
      ]
    },
    {
      objectives: ["Trace one URL through technical signals", "Use canonical and robots controls correctly", "Protect rendering and performance"],
      understand: ["Technical SEO removes ambiguity", [
        "A successful URL returns the intended status, is crawlable, renders meaningful content, declares a consistent canonical, appears in internal links, and avoids accidental duplication. Sitemaps help discovery but do not replace links or guarantee indexing.",
        "Robots.txt controls crawling, not reliable removal from search. noindex controls indexing only when the crawler can fetch the page. Canonicals are hints that work best when redirects, links, and sitemaps agree."
      ]],
      principle: "Technical signals are strongest when status, links, canonicals, and sitemaps tell the same story.",
      apply: ["Render the answer early", [
        "Critical content should not depend on a fragile client-only chain. Server-rendered or static HTML improves resilience for people, crawlers, link unfurlers, and slow devices.",
        "Performance supports both experience and discovery. Optimize the primary content, response path, and interaction rather than hiding useful text behind decorative loading states."
      ]],
      steps: ["Inspect status, robots, noindex, canonical, rendered HTML, and internal links for one URL.", "Compare the URL against sitemap and redirect signals.", "Check the page’s main content without client JavaScript.", "Document conflicts and make the smallest consistent correction."],
      quiz: [
        ["What does a canonical link primarily communicate?", ["A guaranteed ranking boost", "The preferred representative among similar URLs", "A command that blocks crawling"], 1, "Canonicalization helps consolidate duplicate or similar URLs around a preferred representative."],
        ["robots.txt can…", ["Block crawling of a URL", "Guarantee removal from search", "Boost rankings"], 0, "robots.txt controls crawling; removal from the index is a separate process."]
      ]
    },
    {
      objectives: ["Structure claims for scanning and verification", "Use structured data as description, not decoration", "Connect entities with unambiguous language"],
      understand: ["Structure reduces interpretation cost", [
        "Descriptive titles, a clear heading hierarchy, direct answers, tables, definitions, and examples help readers locate meaning. They also help systems identify passages and relationships.",
        "Structured data describes visible content in a machine-readable vocabulary. It should match the page, use the most specific relevant type, and never invent ratings, authorship, or facts."
      ]],
      principle: "Structure makes truth easier to find; it does not compensate for weak or unsupported claims.",
      apply: ["Write citeable units without fragmenting thought", [
        "State the claim, scope, evidence, date, and source near one another. Define entities before using ambiguous pronouns. Use tables for genuine comparisons, not layout.",
        "Media should add evidence or explanation and include useful alternatives. Captions, transcripts, and surrounding context improve access and comprehension."
      ]],
      steps: ["Choose one dense article and outline the reader’s questions.", "Rewrite headings and opening answers for clear information scent.", "Place evidence, dates, and sources beside important claims.", "Add only structured data that accurately describes visible content."],
      quiz: [
        ["When should structured data be added?", ["Whenever a schema type might attract clicks", "When it accurately describes relevant visible page content", "Only after the page ranks"], 1, "Structured data should be truthful, relevant, and consistent with what people can see."],
        ["Structured data should…", ["Accurately describe visible page content", "Invent ratings to attract clicks", "Match the last article you read"], 0, "Markup that contradicts visible content misleads systems and can harm trust."]
      ]
    },
    {
      objectives: ["Identify commodity content", "Add first-hand evidence or utility", "Make authorship and method transparent"],
      understand: ["Original value is the defensible advantage", [
        "A summary of existing summaries is easy to reproduce. Strong pages contribute a test, dataset, tool, demonstration, firsthand experience, expert analysis, or unusually clear synthesis.",
        "AI can assist research and structure, but scaled generation without editorial value creates pages that are interchangeable and difficult to trust. Review claims, sources, and usefulness before publishing."
      ]],
      principle: "Do not ask how to make generic content rank; ask what the page contributes that did not exist before.",
      apply: ["Show how you know", [
        "Name the author, method, date, limitations, and update policy when they matter. Link to primary evidence. Correct errors visibly. Trust grows from accountable process, not badges.",
        "A useful tool or worked example can outperform another thousand words. Match the contribution to the decision the reader needs to make."
      ]],
      steps: ["Audit a page for claims anyone could paraphrase.", "Choose one original contribution: test, data, tool, example, or expert judgment.", "Document method, author, date, sources, and limitations.", "Ask a target reader what decision the new contribution helps them make."],
      quiz: [
        ["Which addition creates the strongest original value?", ["Rewriting ten competing articles", "Publishing your repeatable test method and results", "Adding more generic FAQs"], 1, "A transparent original test contributes evidence that readers and other sources can evaluate."],
        ["A page becomes interchangeable when…", ["It only paraphrases other summaries", "It is short", "It has images"], 0, "Without original contribution, content offers no reason to be chosen over the others."]
      ]
    },
    {
      objectives: ["Apply SEO fundamentals to generative discovery", "Reject unsupported GEO shortcuts", "Prepare content for grounded answers and agents"],
      understand: ["There is no separate magic layer", [
        "Google’s current guidance says core SEO practices remain relevant to generative features. Systems retrieve from indexed content, evaluate quality, and combine sources. There is no special file or markup that guarantees citation.",
        "Clear claims, original evidence, accessible pages, strong media, and accurate structured data make information easier to retrieve and verify. They are good publishing practices regardless of interface."
      ]],
      principle: "Optimize for being useful, retrievable, and verifiable—not for a guessed citation formula.",
      apply: ["Support the next action", [
        "For local, shopping, image, and video experiences, keep business, product, media, and availability data accurate. For agents, expose clear task paths and avoid blocking legitimate user-controlled access.",
        "Track AI-feature traffic and conversions where platforms expose them, but do not invent precision the data cannot support."
      ]],
      steps: ["Choose one page likely to answer a complex question.", "Verify crawlability, originality, evidence, authorship, and current facts.", "Improve passage clarity and media or structured data where relevant.", "Record what is documented guidance versus your experiment."],
      quiz: [
        ["According to current Google guidance, what remains foundational for AI search features?", ["A special GEO meta tag", "Core SEO and valuable original content", "Publishing the largest number of pages"], 1, "Generative features are rooted in core search systems; established SEO and content quality remain foundational."],
        ["For AI-assisted search features, current Google guidance says…", ["Core SEO and original value remain foundational", "A special GEO tag guarantees citations", "Meta keywords decide answers"], 0, "Generative features build on core retrieval and quality systems."]
      ]
    },
    {
      objectives: ["Connect visibility to meaningful outcomes", "Use field and search data together", "Design an experiment with a decision rule"],
      understand: ["Measurement needs a causal story", [
        "Impressions, clicks, position, engaged sessions, conversions, and retention describe different stages. A traffic increase is not success if the audience cannot finish the intended task.",
        "Search Console reports search visibility; analytics reports behavior after arrival; crawl logs reveal fetching; qualitative research explains confusion and trust. No single dashboard supplies the whole story."
      ]],
      principle: "A metric is useful when a change in it would lead to a specific decision.",
      apply: ["Run smaller, accountable experiments", [
        "State the page, audience, change, expected mechanism, primary metric, guardrails, time window, and decision threshold. Annotate launches and external events.",
        "Avoid changing many variables and then claiming one caused the result. When certainty is impossible, label the result as directional."
      ]],
      steps: ["Draw a measurement chain from impression to meaningful outcome.", "Choose one primary metric and two guardrails.", "Write a content or technical experiment with a decision threshold.", "Schedule a review that records result, confidence, and next action."],
      quiz: [
        ["Which is the best primary metric for a guide meant to generate qualified consultations?", ["Total page views", "Consultation requests from readers who viewed the guide", "Average word count"], 1, "The metric connects discovery and content engagement to the intended product outcome."],
        ["A metric is most useful when…", ["A change in it triggers a specific decision", "It is the largest number on the dashboard", "It has been reported for years"], 0, "A useful metric is connected to a decision, per the lesson's own test."]
      ]
    }
  ],
  ai: [
    {
      objectives: ["Identify tasks that tolerate uncertainty", "Define human review and failure cost", "Reject weak AI use cases"],
      understand: ["Start with the workflow, not the model", [
        "AI is useful where interpretation, generation, classification, or transformation creates value and a person or system can evaluate the result. It is weaker where exactness is mandatory and errors are hard to detect.",
        "Map the existing workflow, frequency, pain, available context, review point, and cost of failure. Compare the AI concept against a simpler search, rule, template, or interface improvement."
      ]],
      principle: "Use AI where uncertainty is tolerable and review is possible—not where the word AI makes a roadmap sound modern.",
      apply: ["Write a value and risk contract", [
        "Define the user outcome, baseline, success measure, unacceptable failure, escalation path, and authority boundary. The model should not quietly gain more power than the user intended.",
        "Prototype the workflow with human-generated outputs before integrating a model. If the interaction is not useful with good outputs, better model quality will not rescue it."
      ]],
      steps: ["List three candidate AI features in an existing workflow.", "Score value, uncertainty tolerance, reviewability, and failure cost.", "Compare the strongest idea with a non-AI alternative.", "Prototype the workflow and reject at least one candidate explicitly."],
      quiz: [
        ["Which task is the strongest AI candidate?", ["Calculating an exact tax total with no verification", "Drafting a support reply that an agent reviews before sending", "Silently approving medical treatment"], 1, "Drafting supports judgment while preserving human review before a consequential action."],
        ["Which AI failure is hardest for a user to detect?", ["A fluent but wrong answer in an expert domain", "A blank screen", "An obvious grammar error"], 0, "Plausible errors in expert domains are exactly why review and grounding matter."]
      ]
    },
    {
      objectives: ["Design a context contract", "Separate instructions, evidence, and user data", "Use structured outputs for downstream work"],
      understand: ["Context shapes behavior more than clever phrasing", [
        "A model sees only the context supplied for the current task: instructions, user input, retrieved evidence, examples, tools, state, and output constraints. Missing or conflicting context creates unstable behavior.",
        "Place durable policy above task-specific requests. Delimit untrusted content and state that it is data, not instruction. Include only evidence relevant to the decision; more context can add distraction and cost."
      ]],
      principle: "Treat context as product infrastructure: scoped, versioned, observable, and tested.",
      apply: ["Make outputs easier to verify", [
        "Structured schemas reduce ambiguity when software consumes the result. Require source references, uncertainty, or missing fields where appropriate. Reject invalid output rather than guessing.",
        "Examples teach format and boundaries, but they can overfit behavior. Test with novel and adversarial cases, not only examples that resemble the prompt."
      ]],
      steps: ["Inventory instructions, user data, retrieved evidence, examples, state, and tools.", "Define precedence and how untrusted text is delimited.", "Specify a structured output with required uncertainty or citations.", "Test missing, conflicting, irrelevant, and adversarial context."],
      quiz: [
        ["How should retrieved webpage text be treated?", ["As higher-priority instructions", "As untrusted evidence that may contain hostile instructions", "As automatically verified truth"], 1, "Retrieved content is data from outside the trust boundary and may attempt prompt injection."],
        ["Why delimit untrusted retrieved content?", ["So it is treated as data, not instructions", "To make prompts prettier", "To reduce token cost"], 0, "Delimiting marks external text as data and reduces prompt-injection risk."]
      ]
    },
    {
      objectives: ["Design streaming and latency feedback", "Keep users in control of generated work", "Communicate uncertainty without false precision"],
      understand: ["Waiting is part of the interface", [
        "AI responses may take seconds and can fail after partial output. Show that work started, allow cancellation, preserve the user’s input, and distinguish waiting, streaming, tool use, completion, and failure.",
        "Streaming improves perceived speed but can expose unverified claims as they arrive. Reserve consequential actions until validation completes and make final status clear."
      ]],
      principle: "An AI interface should never leave the user unsure whether it is waiting, working, finished, or acting.",
      apply: ["Generated content needs agency", [
        "Support edit, retry, compare, cite, undo, and dismiss. Do not replace a user’s work without preserving the original. Explain sources and limitations close to the output.",
        "Avoid decorative confidence scores. Communicate what evidence was used, what is missing, and which claims need review."
      ]],
      steps: ["Storyboard idle, submitted, waiting, streaming, validating, success, stopped, and failure states.", "Add stop, retry, edit, and source inspection.", "Preserve the original input and any user edits.", "Test a slow response, partial failure, and unsupported claim."],
      quiz: [
        ["What should happen if a streamed answer later fails validation?", ["Show it as complete anyway", "Clearly mark the failure and prevent consequential use", "Delete the entire conversation silently"], 1, "The interface must distinguish unvalidated partial output from a trustworthy completed result."],
        ["A decorative confidence score…", ["Communicates false precision", "Improves grounding", "Replaces citations"], 0, "Without evidence behind it, a percentage implies precision the system does not have."]
      ]
    },
    {
      objectives: ["Separate retrieval from generation", "Constrain tool authority", "Require confirmation for consequential actions"],
      understand: ["Grounding and action are different systems", [
        "Retrieval selects evidence; generation synthesizes an answer. Evaluate both: did retrieval find the right sources, and did the answer stay faithful to them? A fluent answer cannot repair missing evidence.",
        "Tools let a model read data or perform actions. Each tool needs a narrow purpose, schema, permission check, timeout, error policy, and observable trace."
      ]],
      principle: "The model may propose; trusted application code decides what is allowed and what actually runs.",
      apply: ["Design the authority boundary", [
        "Use least privilege and separate read from write tools. Show a preview before sending, deleting, purchasing, or publishing. Confirmation must describe the exact action and target.",
        "Treat tool results as untrusted data. Prevent retrieved text from changing permissions or bypassing confirmation. Idempotency and undo reduce damage from retries."
      ]],
      steps: ["Draw retrieval, generation, tool, permission, and confirmation boundaries.", "Define one narrow tool schema and validation rules.", "Add preview and explicit confirmation for writes.", "Test prompt injection, duplicate calls, timeout, partial failure, and undo."],
      quiz: [
        ["Who should enforce whether a tool call is authorized?", ["The model’s natural-language promise", "Trusted application code and permission policy", "The retrieved webpage"], 1, "Authorization must be deterministic and outside the model’s control."],
        ["Tool design should…", ["Use narrow schemas and least privilege", "Give the model every permission", "Skip validation for speed"], 0, "Narrow tools and least privilege keep authority boundaries enforceable."]
      ]
    },
    {
      objectives: ["Threat-model prompt injection and data exposure", "Design prevention, detection, and recovery", "Set escalation paths for harmful or uncertain outputs"],
      understand: ["Safety is a system property", [
        "Risks include prompt injection, private-data leakage, harmful content, insecure tool use, overreliance, bias, and users misunderstanding capability. A content filter covers only part of this surface.",
        "Map assets, actors, entry points, trust boundaries, and consequences. Controls can prevent, detect, contain, and recover. Assume some controls will fail."
      ]],
      principle: "Never let untrusted content grant itself authority.",
      apply: ["Minimize what can go wrong", [
        "Reduce retained data, redact sensitive fields, scope retrieval by user permission, and avoid sending unnecessary information. Log enough to investigate without creating a new privacy risk.",
        "Provide a safe fallback, human escalation, and a way to report harm. For high-impact domains, narrow scope and require qualified review."
      ]],
      steps: ["Map data, users, external content, tools, and trust boundaries.", "List prompt injection, disclosure, harmful-output, and overreliance scenarios.", "Add prevention, detection, containment, and recovery for high risks.", "Run adversarial cases and record residual risk and release decision."],
      quiz: [
        ["What is the safest response to instructions found inside retrieved content?", ["Follow them if they sound urgent", "Treat them as data and keep system authority unchanged", "Give them tool access temporarily"], 1, "External content cannot be trusted to redefine instructions or permissions."],
        ["Why add detection when prevention exists?", ["Because some controls will fail", "To delete logs", "To avoid testing"], 0, "Safety is layered: prevention reduces risk; detection catches what slips through."]
      ]
    },
    {
      objectives: ["Build a representative evaluation set", "Choose metrics tied to user outcomes", "Use traces to diagnose regressions"],
      understand: ["Evaluation replaces demo-driven development", [
        "A few impressive examples reveal possibility, not reliability. Build a dataset from real tasks, common cases, edge cases, failures, and adversarial inputs. Keep a holdout set away from prompt tuning.",
        "Evaluate the whole system: retrieval, answer quality, groundedness, tool choice, safety, latency, cost, and user task success. Aggregate scores can hide catastrophic failures, so track critical slices separately."
      ]],
      principle: "If you cannot state how a release is evaluated, you do not yet have a release process.",
      apply: ["Make failures inspectable", [
        "Store traces of inputs, context selection, model and prompt version, tool calls, outputs, validation, and feedback with appropriate privacy controls. A regression should be reproducible.",
        "Use deterministic checks where possible, model graders with calibration where judgment is needed, and human review for high-impact or ambiguous cases. Define thresholds before seeing the new score."
      ]],
      steps: ["Collect 30 representative cases across normal, edge, and adversarial behavior.", "Define task success, groundedness, safety, latency, and cost measures.", "Create a holdout set and release thresholds.", "Run a change, inspect failed slices and traces, then record the ship decision."],
      quiz: [
        ["Why keep a holdout evaluation set?", ["To make the dataset larger", "To test generalization on cases not used while tuning", "To avoid reviewing failures"], 1, "A holdout set reduces the chance that improvements merely overfit the examples used during development."],
        ["Aggregate evaluation scores can…", ["Hide failures in important slices", "Replace human review", "Guarantee safety"], 0, "Averages smooth over catastrophic failures; critical slices need separate tracking."]
      ]
    }
  ]
};

export const featureSearchData = [
  ["Anchor positioning", "Feature", "Position menus and callouts relative to their triggers.", "#now"],
  ["Container style queries", "Feature", "Respond to component state through custom properties.", "#now"],
  [":open pseudo-class", "Feature", "Style open dialog, details, select, and picker states.", "#now"],
  ["Navigation API", "Feature", "Coordinate browser navigations through one modern interface.", "#now"],
  ["Trusted Types", "Feature", "Enforce safer values at DOM injection sinks.", "#now"],
  ["Scroll-driven animation", "Feature", "Connect motion to scroll progress with CSS.", "#now"],
  ["Live code lab", "Practice", "Edit HTML, CSS, and JavaScript in a sandboxed preview.", "#lab"],
  ["Learning methodology", "Method", "Build, break, explain, and ship.", "#manifesto"],
  ["Web Foundations", "Path", "Start here: how the web works through your first published page.", "#paths"],
  ["Placement check", "Tool", "Not sure where to start? Answer four quick questions and get a recommended path.", "placement"],
  ["Where should I start?", "Tool", "Placement check — four quick questions, one recommended path.", "placement"],
  ["My Studio", "Feature", "Your artifacts, lesson progress, backups, and certificate.", "#studio"],
  ["Certificate", "Feature", "Claim a printable certificate when all lessons are complete.", "#studio"],
  ["Changelog", "Site", "What changed in each release of the field guide.", "changelog"],
  ["Export progress", "Feature", "Back up progress, notes, and artifacts to a file.", "#studio"]
];

export const placementQuiz = [
  {
    question: "How much have you built for the web before?",
    options: [
      ["I've never written a line of code", "foundations"],
      ["I've dabbled in HTML or CSS", "platform"],
      ["I design or manage digital products", "ux"],
      ["I ship content or marketing", "search"],
      ["I want every user to feel included", "accessibility"],
      ["I prototype with AI tools", "ai"]
    ]
  },
  {
    question: "What excites you most about making things for the web?",
    options: [
      ["Understanding how browsers really work", "platform"],
      ["Designing products people love to use", "ux"],
      ["Building for everyone, in every situation", "accessibility"],
      ["Getting useful information found and trusted", "search"],
      ["Building features that use AI", "ai"],
      ["I'm still learning what's possible", "foundations"]
    ]
  },
  {
    question: "What would you like to have in three months?",
    options: [
      ["A published portfolio of working pages", "platform"],
      ["A tested product flow with real research", "ux"],
      ["An accessibility audit I can defend", "accessibility"],
      ["An evidence-rich guide that ranks and gets cited", "search"],
      ["A prototype AI feature with evaluations", "ai"],
      ["A solid grasp of the basics first", "foundations"]
    ]
  },
  {
    question: "Which describes your strongest skill today?",
    options: [
      ["Writing and explaining clearly", "search"],
      ["Attention to detail and quality", "accessibility"],
      ["Aesthetics and visual judgment", "ux"],
      ["Logic, code, and tinkering", "platform"],
      ["Working with data or AI models", "ai"],
      ["I'm not sure yet—that's why I'm here", "foundations"]
    ]
  }
];

export const changelog = [
  {
    date: "2026-08-14",
    title: "v3.0 — Indexable lessons, a beginner on-ramp, and My Studio",
    body: "Every lesson now has its own URL you can share and search engines can index. Web Foundations joins the curriculum (thirty-six lessons across six paths), knowledge checks doubled to two questions, code workspaces gained hints, and My Studio tracks your artifacts, backups, and a printable certificate."
  },
  {
    date: "2026-07-16",
    title: "v2.0 — The July 2026 curriculum",
    body: "Added the Modern Web Platform path alongside UX, accessibility, search and AI discovery, and AI product engineering. Reframed all thirty lessons around an artifact and a definition of done, added the live lab, command-palette search, capability detection, and local progress."
  },
  {
    date: "2026-06-02",
    title: "v1.0 — Launch",
    body: "The field guide launched as a free, project-based path through the modern web: accessible, search-aware, evidence-driven, and honest about what changes."
  }
];

export function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function lessonSlug(pathId, index) {
  return slugify(pathData[pathId].modules[index][0]);
}

export function lessonUrl(pathId, index) {
  return `/learn/${pathId}/${lessonSlug(pathId, index)}/`;
}

export function pathUrl(pathId) {
  return `/learn/${pathId}/`;
}

export function totalLessonCount() {
  return Object.values(pathData).reduce((sum, path) => sum + path.modules.length, 0);
}
