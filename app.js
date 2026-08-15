import { pathData, studioMissions, workspaceBlueprints, codeStarters, lessonGuides, hints, featureSearchData, placementQuiz, changelog, pathOrder, lessonUrl, pathUrl, totalLessonCount, siteUrl } from "./curriculum.js";

const storageKey = "learnweb-progress-v2";
const themeKey = "learnweb-theme-v2";
const notesKey = "learnweb-lesson-notes-v1";
const workspacesKey = "learnweb-studio-workspaces-v1";
const certificateDateKey = "learnweb-certificate-awarded-at-v1";
const canonicalLessonIdList = Object.entries(pathData).flatMap(([pathId, path]) =>
  path.modules.map((_, index) => `${pathId}-${index + 1}`)
);
const canonicalLessonIds = new Set(canonicalLessonIdList);
const lessonOrder = new Map(canonicalLessonIdList.map((id, index) => [id, index]));
let storageWriteFailed = false;
const storedProgress = readStorage(storageKey, []);
const progress = new Set(normalizeProgress(storedProgress));
const lessonNotes = sanitizeNotes(readStorage(notesKey, {}));
const lessonWorkspaces = sanitizeWorkspaces(readStorage(workspacesKey, {}));
let certificateAwardedAt = readStorage(certificateDateKey, null);
if (!isValidTimestamp(certificateAwardedAt) || progress.size !== canonicalLessonIdList.length) certificateAwardedAt = null;
const pathDialog = document.querySelector("#path-dialog");
const lessonDialog = document.querySelector("#lesson-dialog");
const searchDialog = document.querySelector("#search-dialog");
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)");
let activeLesson = null;
let lessonQuizResults = [];
let lessonArtifactSubmitted = false;
let noteSaveTimer;
let workspaceSaveTimer;
let workspacePreviewTimer;
let pendingNoteLessonId = null;
let pendingNoteValue = null;
let editorInsertMode = false;

function readStorage(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    markStorageUnavailable();
    return fallback;
  }
}

function markStorageUnavailable() {
  storageWriteFailed = true;
  document.querySelectorAll("[data-storage-status]").forEach((status) => {
    status.textContent = "Local changes may not persist on this device.";
  });
}

function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    markStorageUnavailable();
    return false;
  }
}

function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isValidTimestamp(value) {
  return typeof value === "string" && Number.isFinite(Date.parse(value));
}

function normalizeProgress(value) {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.filter((id) => canonicalLessonIds.has(id)))].sort((a, b) => lessonOrder.get(a) - lessonOrder.get(b));
}

function lessonParts(lessonId) {
  const match = /^([a-z]+)-([1-9])$/.exec(lessonId);
  if (!match || !canonicalLessonIds.has(lessonId)) return null;
  return { pathId: match[1], index: Number(match[2]) - 1 };
}

function workspaceKind(pathId, index) {
  if (codeStarters[pathId]?.[index]) return "code";
  if (workspaceBlueprints[pathId]?.lenses?.[index]) return "record";
  return null;
}

function normalizeWorkspaceState(lessonId, value) {
  const parts = lessonParts(lessonId);
  if (!parts || !isRecord(value) || value.submitted !== Boolean(value.submitted)) return null;
  const kind = workspaceKind(parts.pathId, parts.index);
  if (value.type !== kind) return null;
  const updatedAt = Number.isFinite(value.updatedAt) ? value.updatedAt : 0;
  if (kind === "code") {
    if (![value.html, value.css, value.js].every((item) => typeof item === "string" && item.length <= 500_000)) return null;
    return { type: "code", html: value.html, css: value.css, js: value.js, submitted: value.submitted, updatedAt };
  }
  if (!Array.isArray(value.responses) || value.responses.length !== 3 || !value.responses.every((item) => typeof item === "string" && item.length <= 100_000)) return null;
  return { type: "record", responses: [...value.responses], submitted: value.submitted, updatedAt };
}

function sanitizeNotes(value) {
  if (!isRecord(value)) return {};
  return Object.fromEntries(Object.entries(value)
    .filter(([lessonId, note]) => canonicalLessonIds.has(lessonId) && typeof note === "string" && note.length <= 100_000));
}

function sanitizeWorkspaces(value) {
  if (!isRecord(value)) return {};
  return Object.fromEntries(Object.entries(value)
    .map(([lessonId, state]) => [lessonId, normalizeWorkspaceState(lessonId, state)])
    .filter(([, state]) => state));
}

function validateBackupPayload(payload) {
  if (!isRecord(payload) || payload.app !== "learnweb") throw new Error("This is not a learn.web backup.");
  const version = payload.version === undefined ? 1 : payload.version;
  if (version !== 1 && version !== 2) throw new Error("This backup version is not supported.");
  const allowedKeys = new Set(["app", "version", "exportedAt", "progress", "notes", "workspaces", "certificateAwardedAt"]);
  if (Object.keys(payload).some((key) => !allowedKeys.has(key))) throw new Error("The backup contains unknown fields.");
  if (!Array.isArray(payload.progress) || payload.progress.some((id) => typeof id !== "string" || !canonicalLessonIds.has(id))) {
    throw new Error("The backup contains an unknown lesson ID.");
  }
  if (new Set(payload.progress).size !== payload.progress.length) throw new Error("The backup contains duplicate lesson IDs.");
  const notes = sanitizeNotes(payload.notes);
  if (!isRecord(payload.notes) || Object.keys(notes).length !== Object.keys(payload.notes).length) throw new Error("The backup contains invalid notes.");
  const workspaces = sanitizeWorkspaces(payload.workspaces);
  if (!isRecord(payload.workspaces) || Object.keys(workspaces).length !== Object.keys(payload.workspaces).length) throw new Error("The backup contains invalid workspaces.");
  const certificate = payload.certificateAwardedAt ?? null;
  if (certificate !== null && !isValidTimestamp(certificate)) throw new Error("The certificate timestamp is invalid.");
  if (certificate && payload.progress.length !== canonicalLessonIdList.length) throw new Error("The certificate does not match completion state.");
  return {
    progress: normalizeProgress(payload.progress),
    notes,
    workspaces,
    certificateAwardedAt: certificate
  };
}

function replaceObject(target, source) {
  Object.keys(target).forEach((key) => delete target[key]);
  Object.assign(target, source);
}

function flushPendingSaves() {
  clearTimeout(noteSaveTimer);
  clearTimeout(workspaceSaveTimer);
  if (pendingNoteLessonId !== null) {
    lessonNotes[pendingNoteLessonId] = pendingNoteValue;
    pendingNoteLessonId = null;
    pendingNoteValue = null;
  }
  writeStorage(notesKey, lessonNotes);
  writeStorage(workspacesKey, lessonWorkspaces);
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
  const total = totalLessonCount();
  document.querySelectorAll("[data-completed-count]").forEach((node) => {
    node.textContent = count;
  });
  document.querySelectorAll("[data-completed-total]").forEach((node) => {
    node.textContent = `/${total}`;
  });
  document.querySelectorAll("[data-progress-bar]").forEach((bar) => {
    bar.style.width = `${(count / total) * 100}%`;
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

    const status = document.createElement("span");
    status.className = "module-status";
    status.dataset.lessonId = lessonId;
    status.classList.toggle("is-complete", progress.has(lessonId));
    status.setAttribute("aria-label", progress.has(lessonId) ? `${title} completed` : `${title} not completed`);
    status.textContent = progress.has(lessonId) ? "✓" : String(index + 1).padStart(2, "0");

    const copy = document.createElement("div");
    copy.className = "module-copy";
    const strong = document.createElement("strong");
    strong.textContent = title;
    const description = document.createElement("p");
    description.textContent = detail;
    const start = document.createElement("button");
    start.className = "start-lesson";
    start.type = "button";
    start.textContent = progress.has(lessonId) ? "Review lesson →" : "Start lesson →";
    start.addEventListener("click", () => openLesson(pathId, index));
    copy.append(strong, description, start);

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

    item.append(status, copy, duration, brief);
    list.append(item);
  });

  updateDialogProgress(pathId);
  if (!pathDialog.open) pathDialog.showModal();
  history.replaceState(null, "", `#path-${pathId}`);
}

function appendParagraphs(container, paragraphs) {
  container.replaceChildren();
  paragraphs.forEach((text) => {
    const paragraph = document.createElement("p");
    paragraph.textContent = text;
    container.append(paragraph);
  });
}

function makeElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

function getWorkspaceState(lessonId, pathId, index) {
  if (lessonWorkspaces[lessonId]) return lessonWorkspaces[lessonId];
  const starter = codeStarters[pathId]?.[index];
  if (starter) {
    lessonWorkspaces[lessonId] = {
      type: "code",
      html: starter.html,
      css: starter.css,
      js: starter.js,
      submitted: false,
      updatedAt: Date.now()
    };
  } else {
    lessonWorkspaces[lessonId] = {
      type: "record",
      responses: ["", "", ""],
      submitted: false,
      updatedAt: Date.now()
    };
  }
  writeStorage(workspacesKey, lessonWorkspaces);
  return lessonWorkspaces[lessonId];
}

function persistWorkspace(lessonId, state, immediate = false) {
  state.updatedAt = Date.now();
  lessonWorkspaces[lessonId] = state;
  clearTimeout(workspaceSaveTimer);
  const save = () => writeStorage(workspacesKey, lessonWorkspaces);
  if (immediate) return save();
  workspaceSaveTimer = setTimeout(save, 250);
  return true;
}

function workspaceChecks(state, pathId, index) {
  if (state.type === "code") {
    const starter = codeStarters[pathId][index];
    const total = state.html.trim().length + state.css.trim().length + state.js.trim().length;
    const changedCharacters = ["html", "css", "js"].reduce((sum, key) => {
      const before = starter[key];
      const after = state[key];
      const sharedLength = Math.min(before.length, after.length);
      let differences = Math.abs(before.length - after.length);
      for (let character = 0; character < sharedLength; character += 1) {
        if (before[character] !== after[character]) differences += 1;
      }
      return sum + differences;
    }, 0);
    return [
      ["A working HTML foundation is present", /<([a-z][\w-]*)\b/i.test(state.html)],
      ["You made a meaningful change to the starter", changedCharacters >= 20],
      ["The artifact contains enough implementation to review", total >= 220]
    ];
  }
  const blueprint = workspaceBlueprints[pathId].lenses[index];
  return state.responses.map((response, responseIndex) => [
    `${blueprint[responseIndex * 2]} has specific evidence`,
    response.trim().length >= 30
  ]);
}

function updateWorkspaceReadiness(mount, state, pathId, index) {
  const checks = workspaceChecks(state, pathId, index);
  const completeCount = checks.filter(([, complete]) => complete).length;
  const ready = completeCount === checks.length;
  const meter = mount.querySelector("[data-workspace-meter]");
  const status = mount.querySelector("[data-workspace-status]");
  const submit = mount.querySelector("[data-submit-workspace]");
  const checklist = mount.querySelector("[data-workspace-checks]");

  meter.style.width = `${(completeCount / checks.length) * 100}%`;
  checklist.replaceChildren(...checks.map(([label, complete]) => {
    const item = makeElement("li", complete ? "is-ready" : "", label);
    item.dataset.complete = String(complete);
    return item;
  }));

  submit.disabled = !ready || state.submitted;
  submit.textContent = state.submitted ? "Artifact submitted ✓" : "Submit studio artifact";
  status.className = `workspace-state${state.submitted ? " is-submitted" : ready ? " is-ready" : ""}`;
  status.textContent = state.submitted
    ? storageWriteFailed ? "Submitted for this session · storage unavailable" : "Submitted · saved on this device"
    : ready
      ? "Ready to submit"
      : `${completeCount} of ${checks.length} quality signals met`;

  const lessonId = `${pathId}-${index + 1}`;
  lessonArtifactSubmitted = state.submitted || progress.has(lessonId);
  updateLessonGate();
}

function buildWorkspaceChrome(pathId, index, state) {
  const fragment = document.createDocumentFragment();
  const head = makeElement("div", "workspace-head");
  const titleBlock = makeElement("div");
  titleBlock.append(
    makeElement("p", "workspace-eyebrow", pathId === "platform" ? "Live implementation lab" : workspaceBlueprints[pathId].artifact),
    makeElement("h3", "", pathId === "platform" ? "Build and test it here." : "Build the evidence here.")
  );
  const stateLabel = makeElement("span", "workspace-state", "");
  stateLabel.dataset.workspaceStatus = "";
  stateLabel.setAttribute("role", "status");
  stateLabel.setAttribute("aria-live", "polite");
  head.append(titleBlock, stateLabel);

  const progressTrack = makeElement("div", "workspace-readiness");
  const progressBar = makeElement("span");
  progressBar.dataset.workspaceMeter = "";
  progressTrack.append(progressBar);

  fragment.append(head, progressTrack);
  return fragment;
}

const previewRunnerUrl = ["localhost", "127.0.0.1"].includes(location.hostname)
  ? "/lab-runner.htm"
  : "https://raw.githack.com/leemark/learnweb/main/lab-runner.htm";

function postPreviewState(frame, state) {
  const message = { learnwebRun: true, html: state.html, css: state.css, js: state.js };
  frame._learnwebPendingState = message;
  if (frame.dataset.runnerState === "ready") {
    frame.contentWindow?.postMessage(message, "*");
    return;
  }
  if (frame.dataset.runnerState === "loading") return;
  frame.dataset.runnerState = "loading";
  frame.addEventListener("load", () => {
    frame.dataset.runnerState = "ready";
    if (frame._learnwebPendingState) frame.contentWindow?.postMessage(frame._learnwebPendingState, "*");
  }, { once: true });
  frame.src = previewRunnerUrl;
}

function clearPreviewState(frame) {
  frame._learnwebPendingState = null;
  frame.dataset.runnerState = "loading";
  frame.src = previewRunnerUrl;
}

function runCodePreview(frame, state) {
  postPreviewState(frame, state);
}

function renderCodeWorkspace(mount, lessonId, pathId, index, state) {
  mount.append(buildWorkspaceChrome(pathId, index, state));

  const lab = makeElement("div", "lesson-code-lab");
  const labBar = makeElement("div", "lesson-code-bar");
  const tabs = makeElement("div", "lesson-code-tabs");
  tabs.setAttribute("role", "tablist");
  const run = makeElement("button", "workspace-mini-action", "Run preview");
  run.type = "button";
  const stop = makeElement("button", "workspace-mini-action", "Stop");
  stop.type = "button";
  stop.setAttribute("aria-label", "Stop the preview");
  const auto = makeElement("button", "workspace-mini-action", "Auto-run: off");
  auto.type = "button";
  auto.setAttribute("aria-pressed", "false");
  auto.title = "When on, the preview re-runs as you type; when off, press Run preview.";
  const sizes = makeElement("div", "workspace-preview-sizes");
  ["Compact", "Wide"].forEach((label, sizeIndex) => {
    const button = makeElement("button", sizeIndex ? "" : "is-active", label);
    button.type = "button";
    button.dataset.workspaceSize = sizeIndex ? "wide" : "compact";
    sizes.append(button);
  });
  labBar.append(tabs, auto, sizes, run, stop);

  const stage = makeElement("div", "lesson-code-stage");
  const editorWrap = makeElement("div", "lesson-code-editor");
  const previewWrap = makeElement("div", "lesson-code-preview");
  previewWrap.dataset.previewSize = "compact";
  const frame = document.createElement("iframe");
  frame.title = "Studio task preview";
  frame.setAttribute("sandbox", "allow-scripts allow-forms");
  previewWrap.append(frame);

  let autoRun = false;
  let lastHeartbeat = Date.now();
  let watchdogTimer = null;

  const startWatchdog = () => {
    clearInterval(watchdogTimer);
    lastHeartbeat = Date.now();
    watchdogTimer = setInterval(() => {
      if (frame.dataset.runnerState !== "ready") return;
      if (Date.now() - lastHeartbeat > 2500) {
        clearInterval(watchdogTimer);
        stopPreview("The preview stopped responding, so it was reset.");
      }
    }, 1000);
  };

  const stopPreview = (message) => {
    clearInterval(watchdogTimer);
    clearPreviewState(frame);
    if (message) {
      const status = mount.querySelector("[data-workspace-status]");
      if (status) status.textContent = message;
    }
  };

  window.addEventListener("message", (event) => {
    if (event.source === frame.contentWindow && event.data?.learnwebHeartbeat) {
      lastHeartbeat = Date.now();
    }
  });

  ["html", "css", "js"].forEach((language, languageIndex) => {
    const tab = makeElement("button", languageIndex === 0 ? "is-active" : "", language.toUpperCase());
    tab.type = "button";
    tab.setAttribute("role", "tab");
    tab.setAttribute("aria-selected", String(languageIndex === 0));
    tab.dataset.workspaceTab = language;
    tabs.append(tab);

    const label = makeElement("label", "sr-only", `${language.toUpperCase()} editor`);
    const textarea = document.createElement("textarea");
    textarea.className = `workspace-code-input${languageIndex === 0 ? " is-active" : ""}`;
    textarea.dataset.workspaceEditor = language;
    textarea.hidden = languageIndex !== 0;
    textarea.spellcheck = false;
    textarea.value = state[language];
    textarea.addEventListener("input", () => {
      state[language] = textarea.value;
      state.submitted = false;
      persistWorkspace(lessonId, state);
      clearTimeout(workspacePreviewTimer);
      if (autoRun) {
        workspacePreviewTimer = setTimeout(() => {
          runCodePreview(frame, state);
          startWatchdog();
        }, 450);
      }
      updateWorkspaceReadiness(mount, state, pathId, index);
    });
    editorWrap.append(label, textarea);
  });

  tabs.addEventListener("click", (event) => {
    const tab = event.target.closest("[data-workspace-tab]");
    if (!tab) return;
    const selected = tab.dataset.workspaceTab;
    tabs.querySelectorAll("button").forEach((button) => {
      const active = button === tab;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-selected", String(active));
    });
    editorWrap.querySelectorAll("[data-workspace-editor]").forEach((editor) => {
      const active = editor.dataset.workspaceEditor === selected;
      editor.hidden = !active;
      editor.classList.toggle("is-active", active);
    });
    editorWrap.querySelector(`[data-workspace-editor="${selected}"]`).focus();
  });
  sizes.addEventListener("click", (event) => {
    const button = event.target.closest("[data-workspace-size]");
    if (!button) return;
    sizes.querySelectorAll("button").forEach((item) => item.classList.toggle("is-active", item === button));
    previewWrap.dataset.previewSize = button.dataset.workspaceSize;
  });
  run.addEventListener("click", () => {
    runCodePreview(frame, state);
    startWatchdog();
  });
  stop.addEventListener("click", () => stopPreview("Preview stopped."));
  auto.addEventListener("click", () => {
    autoRun = !autoRun;
    auto.setAttribute("aria-pressed", String(autoRun));
    auto.textContent = autoRun ? "Auto-run: on" : "Auto-run: off";
    if (autoRun) {
      runCodePreview(frame, state);
      startWatchdog();
    }
  });

  stage.append(editorWrap, previewWrap);
  lab.append(labBar, stage);
  mount.append(lab);
  runCodePreview(frame, state);
  startWatchdog();
}

function renderRecordWorkspace(mount, lessonId, pathId, index, state) {
  mount.append(buildWorkspaceChrome(pathId, index, state));
  const blueprint = workspaceBlueprints[pathId];
  const prompts = blueprint.lenses[index];
  const form = makeElement("div", "workspace-record");

  state.responses.forEach((response, responseIndex) => {
    const field = makeElement("label", "workspace-field");
    const number = makeElement("span", "workspace-field-number", String(responseIndex + 1).padStart(2, "0"));
    const copy = makeElement("span", "workspace-field-copy");
    copy.append(
      makeElement("strong", "", prompts[responseIndex * 2]),
      makeElement("small", "", prompts[responseIndex * 2 + 1])
    );
    const textarea = document.createElement("textarea");
    textarea.rows = 6;
    textarea.placeholder = "Write concrete evidence, a decision, and enough context for someone else to review it…";
    textarea.value = response;
    textarea.addEventListener("input", () => {
      state.responses[responseIndex] = textarea.value;
      state.submitted = false;
      persistWorkspace(lessonId, state);
      updateWorkspaceReadiness(mount, state, pathId, index);
    });
    field.append(number, copy, textarea);
    form.append(field);
  });
  mount.append(form);
}

function exportWorkspaceArtifact(lessonId, pathId, index, state) {
  const title = pathData[pathId].modules[index][0];
  let contents;
  let extension;
  let mime;
  if (state.type === "code") {
    const safeCss = state.css.replace(/<\/style/gi, "<\\/style");
    const safeJs = state.js.replace(/<\/script/gi, "<\\/script");
    contents = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title><style>${safeCss}</style></head><body>${state.html}<script>${safeJs}<\/script></body></html>`;
    extension = "html";
    mime = "text/html";
  } else {
    const prompts = workspaceBlueprints[pathId].lenses[index];
    contents = `# ${title}\n\n**Studio task:** ${studioMissions[pathId][index][0]}\n\n${state.responses.map((response, responseIndex) =>
      `## ${prompts[responseIndex * 2]}\n\n${response || "_Not answered_"}`
    ).join("\n\n")}\n\n## Definition of done\n\n${studioMissions[pathId][index][1]}\n`;
    extension = "md";
    mime = "text/markdown";
  }
  const blob = new Blob([contents], { type: `${mime};charset=utf-8` });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${lessonId}-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}.${extension}`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(link.href), 1000);
}

function renderWorkspaceFooter(mount, lessonId, pathId, index, state) {
  const review = makeElement("div", "workspace-review");
  const checklist = document.createElement("ul");
  checklist.className = "workspace-checks";
  checklist.dataset.workspaceChecks = "";

  const actions = makeElement("div", "workspace-actions");
  const reset = makeElement("button", "button button-ghost", "Reset workspace");
  const download = makeElement("button", "button button-ghost", "Export artifact");
  const submit = makeElement("button", "button button-primary", "Submit studio artifact");
  [reset, download, submit].forEach((button) => { button.type = "button"; });
  submit.dataset.submitWorkspace = "";

  const hintText = hints[pathId]?.[index];
  if (hintText) {
    const hint = document.createElement("details");
    hint.className = "workspace-hint";
    const summary = document.createElement("summary");
    summary.textContent = "Need a hint?";
    hint.append(summary, Object.assign(document.createElement("p"), { textContent: hintText }));
    actions.append(hint);
  }

  actions.append(reset, download, submit);
  review.append(checklist, actions);
  mount.append(review);

  reset.addEventListener("click", () => {
    if (!confirm("Reset this workspace? Your current draft for this lesson will be replaced.")) return;
    delete lessonWorkspaces[lessonId];
    writeStorage(workspacesKey, lessonWorkspaces);
    renderStudioWorkspace(pathId, index);
  });
  download.addEventListener("click", () => exportWorkspaceArtifact(lessonId, pathId, index, state));
  submit.addEventListener("click", () => {
    if (!workspaceChecks(state, pathId, index).every(([, complete]) => complete)) return;
    state.submitted = true;
    persistWorkspace(lessonId, state, true);
    lessonArtifactSubmitted = true;
    updateWorkspaceReadiness(mount, state, pathId, index);
    mount.querySelector("[data-workspace-status]").focus?.();
  });
}

function renderStudioWorkspace(pathId, index) {
  const lessonId = `${pathId}-${index + 1}`;
  const mount = lessonDialog.querySelector("[data-workspace]");
  const state = getWorkspaceState(lessonId, pathId, index);
  mount.replaceChildren();
  if (state.type === "code") renderCodeWorkspace(mount, lessonId, pathId, index, state);
  else renderRecordWorkspace(mount, lessonId, pathId, index, state);
  renderWorkspaceFooter(mount, lessonId, pathId, index, state);
  updateWorkspaceReadiness(mount, state, pathId, index);
}

function openLesson(pathId, index) {
  const path = pathData[pathId];
  const guide = lessonGuides[pathId]?.[index];
  const module = path?.modules[index];
  if (!path || !guide || !module) return;

  activeLesson = { pathId, index };
  flushPendingSaves();
  const lessonId = `${pathId}-${index + 1}`;
  const isComplete = progress.has(lessonId);
  lessonQuizResults = guide.quiz.map(() => isComplete);
  lessonArtifactSubmitted = isComplete;

  if (pathDialog.open) pathDialog.close();
  lessonDialog.style.setProperty("--lesson-accent", path.accent);
  lessonDialog.querySelector(".lesson-path-label").textContent = path.title;
  lessonDialog.querySelector(".lesson-position").textContent = `Lesson ${index + 1} of ${path.modules.length}`;
  lessonDialog.querySelector(".lesson-header-progress .meter span").style.width = `${((index + 1) / path.modules.length) * 100}%`;
  lessonDialog.querySelector(".lesson-kicker").textContent = `${path.label} / ${String(index + 1).padStart(2, "0")}`;
  lessonDialog.querySelector("#lesson-title").textContent = module[0];
  lessonDialog.querySelector(".lesson-dek").textContent = module[1];
  lessonDialog.querySelector(".lesson-time").textContent = module[2];
  lessonDialog.querySelector(".lesson-state").textContent = isComplete ? "Complete" : "In progress";

  const objectives = lessonDialog.querySelector(".lesson-objective-list");
  objectives.replaceChildren();
  guide.objectives.forEach((text) => {
    const item = document.createElement("li");
    item.textContent = text;
    objectives.append(item);
  });

  lessonDialog.querySelector("#chapter-one-title").textContent = guide.understand[0];
  appendParagraphs(lessonDialog.querySelector(".chapter-one-copy"), guide.understand[1]);
  lessonDialog.querySelector(".lesson-principle").textContent = guide.principle;
  lessonDialog.querySelector("#chapter-two-title").textContent = guide.apply[0];
  appendParagraphs(lessonDialog.querySelector(".chapter-two-copy"), guide.apply[1]);

  const example = lessonDialog.querySelector(".lesson-example");
  example.hidden = !guide.example;
  example.querySelector("code").textContent = guide.example || "";

  const [mission, proof] = studioMissions[pathId][index];
  lessonDialog.querySelector(".practice-mission").textContent = mission;
  lessonDialog.querySelector(".practice-proof").textContent = proof;
  const steps = lessonDialog.querySelector(".practice-steps");
  steps.replaceChildren();
  guide.steps.forEach((text) => {
    const item = document.createElement("li");
    item.textContent = text;
    steps.append(item);
  });

  renderStudioWorkspace(pathId, index);

  const note = lessonDialog.querySelector("#lesson-note");
  note.value = lessonNotes[lessonId] || "";
  lessonDialog.querySelector(".note-status").textContent = note.value ? "Saved locally" : "Ready";

  renderQuiz(guide.quiz, lessonId);
  renderLessonRail(pathId, index);
  renderLessonPager(pathId, index);
  updateLessonGate();

  if (!lessonDialog.open) lessonDialog.showModal();
  lessonDialog.querySelector(".lesson-reader").scrollTop = 0;
  history.replaceState(null, "", `#lesson-${lessonId}`);
}

function renderQuiz(quiz, lessonId) {
  const container = lessonDialog.querySelector("[data-quiz-groups]");
  container.replaceChildren();
  quiz.forEach((question, questionIndex) => {
    const [questionText, options, , explanation] = question;
    const group = document.createElement("fieldset");
    group.className = "quiz-group";
    const legend = document.createElement("legend");
    legend.textContent = questionText;
    group.append(legend);

    const fieldset = document.createElement("div");
    fieldset.className = "quiz-options";
    options.forEach((text, index) => {
      const label = document.createElement("label");
      const input = document.createElement("input");
      input.type = "radio";
      input.name = `quiz-${lessonId}-${questionIndex}`;
      input.value = String(index);
      input.checked = lessonQuizResults[questionIndex] && index === question[2];
      const marker = document.createElement("span");
      marker.textContent = String.fromCharCode(65 + index);
      const copy = document.createElement("strong");
      copy.textContent = text;
      label.append(input, marker, copy);
      fieldset.append(label);
    });
    group.append(fieldset);

    const feedback = document.createElement("p");
    feedback.className = "quiz-feedback";
    feedback.setAttribute("role", "status");
    feedback.setAttribute("aria-live", "polite");
    if (lessonQuizResults[questionIndex]) {
      feedback.classList.add("is-correct");
      feedback.textContent = `Correct — ${explanation}`;
    }
    group.append(feedback);
    container.append(group);
  });
}

function renderLessonRail(pathId, activeIndex) {
  const list = lessonDialog.querySelector(".lesson-rail-list");
  list.replaceChildren();
  pathData[pathId].modules.forEach(([title], index) => {
    const lessonId = `${pathId}-${index + 1}`;
    const item = document.createElement("li");
    const button = document.createElement("button");
    button.type = "button";
    button.className = index === activeIndex ? "is-active" : "";
    button.setAttribute("aria-current", index === activeIndex ? "step" : "false");
    const number = document.createElement("span");
    number.textContent = progress.has(lessonId) ? "✓" : String(index + 1).padStart(2, "0");
    const text = document.createElement("strong");
    text.textContent = title;
    button.append(number, text);
    button.addEventListener("click", () => openLesson(pathId, index));
    item.append(button);
    list.append(item);
  });
}

function renderLessonPager(pathId, index) {
  const modules = pathData[pathId].modules;
  const previous = lessonDialog.querySelector(".lesson-prev");
  const next = lessonDialog.querySelector(".lesson-next");
  previous.hidden = index === 0;
  next.hidden = index === modules.length - 1;
  previous.querySelector("strong").textContent = index > 0 ? modules[index - 1][0] : "";
  next.querySelector("strong").textContent = index < modules.length - 1 ? modules[index + 1][0] : "";
}

function updateLessonGate() {
  if (!activeLesson) return;
  const lessonId = `${activeLesson.pathId}-${activeLesson.index + 1}`;
  const complete = progress.has(lessonId);
  const quizPassed = lessonQuizResults.length > 0 && lessonQuizResults.every(Boolean);
  const button = lessonDialog.querySelector(".complete-lesson");
  button.disabled = !(quizPassed && lessonArtifactSubmitted) || complete;
  const label = document.createTextNode(complete ? "Lesson complete " : "Complete lesson ");
  const icon = document.createElement("span");
  icon.setAttribute("aria-hidden", "true");
  icon.textContent = "✓";
  button.replaceChildren(label, icon);
  lessonDialog.querySelector(".lesson-state").textContent = complete ? "Complete" : "In progress";
}

function checkLessonAnswer() {
  if (!activeLesson) return;
  const guide = lessonGuides[activeLesson.pathId][activeLesson.index];
  const groups = lessonDialog.querySelectorAll(".quiz-group");
  lessonQuizResults = guide.quiz.map((question, questionIndex) => {
    const selected = groups[questionIndex]?.querySelector("input:checked");
    const feedback = groups[questionIndex]?.querySelector(".quiz-feedback");
    if (!selected || !feedback) return false;
    const correct = Number(selected.value) === question[2];
    feedback.className = `quiz-feedback ${correct ? "is-correct" : "is-incorrect"}`;
    feedback.textContent = correct
      ? `Correct — ${question[3]}`
      : "Not quite. Revisit the principle above, then try again.";
    return correct;
  });
  updateLessonGate();
}

function completeActiveLesson() {
  if (!activeLesson || !lessonQuizResults.every(Boolean) || !lessonArtifactSubmitted) return;
  const lessonId = `${activeLesson.pathId}-${activeLesson.index + 1}`;
  progress.add(lessonId);
  updateProgressUI();
  if (progress.size === canonicalLessonIdList.length && !certificateAwardedAt) {
    const awardedAt = new Date().toISOString();
    if (writeStorage(certificateDateKey, awardedAt)) certificateAwardedAt = awardedAt;
  }
  renderStudio();
  renderLessonRail(activeLesson.pathId, activeLesson.index);
  updateLessonGate();
  lessonDialog.querySelector(".lesson-finish").scrollIntoView({ behavior: reduceMotion.matches ? "auto" : "smooth", block: "center" });
}

function returnToPath() {
  if (!activeLesson) return;
  const { pathId } = activeLesson;
  flushPendingSaves();
  lessonDialog.close();
  openPath(pathId);
}

function closeLesson() {
  flushPendingSaves();
  lessonDialog.close();
  activeLesson = null;
  history.replaceState(null, "", "#paths");
}

function moveLesson(offset) {
  if (!activeLesson) return;
  const nextIndex = activeLesson.index + offset;
  if (nextIndex >= 0 && nextIndex < pathData[activeLesson.pathId].modules.length) {
    openLesson(activeLesson.pathId, nextIndex);
  }
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
    path.modules.forEach(([title, detail], index) => {
      entries.push({
        title,
        type: path.title,
        detail,
        action: () => openLesson(pathId, index)
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
        if (target === "placement") {
          openPlacement();
        } else if (target === "changelog") {
          openChangelog();
        } else if (target === "about") {
          openAbout();
        } else {
          document.querySelector(target)?.scrollIntoView({ behavior: reduceMotion.matches ? "auto" : "smooth" });
        }
      }
    });
  });
  Object.entries(pathData).forEach(([pathId, path]) => {
    path.modules.forEach(([title, detail], index) => {
      entries.push({
        title,
        type: `${path.title} · article`,
        detail: `Static lesson page — ${detail}`,
        action: () => window.open(lessonUrl(pathId, index), "_blank", "noopener")
      });
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

function setEditorMode(enabled) {
  editorInsertMode = enabled;
  document.querySelectorAll("[data-editor-mode]").forEach((button) => {
    button.setAttribute("aria-pressed", String(enabled));
    button.textContent = enabled ? "Tab: spaces (Esc exits)" : "Tab: navigate";
  });
}

function initializePlayground() {
  document.querySelectorAll("[data-editor]").forEach((editor) => {
    starterCode[editor.dataset.editor] = editor.value;
    editor.addEventListener("keydown", (event) => {
      if (event.key === "Tab" && editorInsertMode) {
        event.preventDefault();
        const start = editor.selectionStart;
        const end = editor.selectionEnd;
        editor.setRangeText("  ", start, end, "end");
      }
      if (event.key === "Escape" && editorInsertMode) {
        setEditorMode(false);
        event.stopPropagation();
      }
      if ((event.metaKey || event.ctrlKey) && event.key === "Enter") runCode();
    });
  });
  document.querySelectorAll("[data-editor-mode]").forEach((button) => {
    button.addEventListener("click", () => setEditorMode(button.getAttribute("aria-pressed") !== "true"));
  });
  setEditorMode(false);
  runCode();
}

function runCode() {
  const html = document.querySelector('[data-editor="html"]').value;
  const css = document.querySelector('[data-editor="css"]').value;
  const js = document.querySelector('[data-editor="js"]').value;
  const frame = document.querySelector(".lab-frame");
  postPreviewState(frame, { html, css, js });
  const status = document.querySelector(".run-status");
  status.textContent = "Rendered";
  setTimeout(() => { status.textContent = "Ready"; }, 1200);
}

function stopCode() {
  clearPreviewState(document.querySelector(".lab-frame"));
  document.querySelector(".run-status").textContent = "Stopped";
}

function resetCode() {
  Object.entries(starterCode).forEach(([name, value]) => {
    document.querySelector(`[data-editor="${name}"]`).value = value;
  });
  runCode();
}

function initializeNavigationState() {
  const lessonMatch = location.hash.match(/^#lesson-([a-z]+)-([1-6])$/);
  if (lessonMatch) {
    openLesson(lessonMatch[1], Number(lessonMatch[2]) - 1);
  } else if (location.hash.startsWith("#path-")) {
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

pathDialog.querySelector(".dialog-close").addEventListener("click", closePath);
["placement-dialog", "changelog-dialog", "certificate-dialog", "about-dialog"].forEach((id) => {
  document.querySelector(`#${id} .dialog-close`)?.addEventListener("click", () => document.querySelector(`#${id}`).close());
});
pathDialog.addEventListener("click", (event) => {
  if (event.target === pathDialog) closePath();
});
pathDialog.addEventListener("cancel", (event) => {
  event.preventDefault();
  closePath();
});

document.querySelector(".lesson-back").addEventListener("click", returnToPath);
document.querySelector(".lesson-close").addEventListener("click", closeLesson);
lessonDialog.addEventListener("cancel", (event) => {
  event.preventDefault();
  returnToPath();
});
document.querySelector(".check-answer").addEventListener("click", checkLessonAnswer);
document.querySelector(".complete-lesson").addEventListener("click", completeActiveLesson);
document.querySelector(".lesson-prev").addEventListener("click", () => moveLesson(-1));
document.querySelector(".lesson-next").addEventListener("click", () => moveLesson(1));
document.querySelector("#lesson-note").addEventListener("input", (event) => {
  if (!activeLesson) return;
  const lessonId = `${activeLesson.pathId}-${activeLesson.index + 1}`;
  pendingNoteLessonId = lessonId;
  pendingNoteValue = event.currentTarget.value;
  lessonDialog.querySelector(".note-status").textContent = "Saving…";
  clearTimeout(noteSaveTimer);
  noteSaveTimer = setTimeout(() => {
    lessonNotes[pendingNoteLessonId] = pendingNoteValue;
    pendingNoteLessonId = null;
    pendingNoteValue = null;
    const saved = writeStorage(notesKey, lessonNotes);
    lessonDialog.querySelector(".note-status").textContent = saved ? "Saved locally" : "Save failed — storage unavailable";
  }, 350);
});
document.querySelector(".copy-example").addEventListener("click", async (event) => {
  const code = lessonDialog.querySelector(".lesson-example code").textContent;
  try {
    await navigator.clipboard.writeText(code);
    event.currentTarget.textContent = "Copied";
    setTimeout(() => { event.currentTarget.textContent = "Copy"; }, 1200);
  } catch {
    event.currentTarget.textContent = "Select code to copy";
  }
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
  certificateAwardedAt = null;
  writeStorage(certificateDateKey, null);
  updateProgressUI();
  renderStudio();
  if (pathDialog.open) {
    const pathId = location.hash.replace("#path-", "");
    openPath(pathId);
  }
  if (lessonDialog.open && activeLesson) {
    lessonQuizResults = lessonGuides[activeLesson.pathId][activeLesson.index].quiz.map(() => false);
    lessonArtifactSubmitted = false;
    openLesson(activeLesson.pathId, activeLesson.index);
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
document.querySelector(".stop-code").addEventListener("click", stopCode);
document.querySelector(".reset-code").addEventListener("click", resetCode);

// ——— Placement check ———
function openPlacement() {
  const dialog = document.querySelector("#placement-dialog");
  if (!dialog) return;
  const container = dialog.querySelector("[data-placement-questions]");
  const result = dialog.querySelector("[data-placement-result]");
  container.replaceChildren();
  result.hidden = true;
  placementQuiz.forEach((item, questionIndex) => {
    const fieldset = document.createElement("fieldset");
    fieldset.className = "placement-question";
    const legend = document.createElement("legend");
    legend.textContent = `${questionIndex + 1}. ${item.question}`;
    fieldset.append(legend);
    item.options.forEach(([label, pathId]) => {
      const option = document.createElement("label");
      const input = document.createElement("input");
      input.type = "radio";
      input.name = `placement-${questionIndex}`;
      input.value = pathId;
      const copy = document.createElement("span");
      copy.textContent = label;
      option.append(input, copy);
      fieldset.append(option);
    });
    container.append(fieldset);
  });
  if (!dialog.open) dialog.showModal();
}

function scorePlacement() {
  const votes = {};
  pathOrder.forEach((pathId) => { votes[pathId] = 0; });
  let answered = 0;
  document.querySelectorAll("#placement-dialog .placement-question").forEach((fieldset) => {
    const selected = fieldset.querySelector("input:checked");
    if (selected) {
      votes[selected.value] += 1;
      answered += 1;
    }
  });
  const result = document.querySelector("[data-placement-result]");
  if (answered < placementQuiz.length) {
    result.hidden = false;
    result.className = "placement-result";
    result.textContent = `Answer all ${placementQuiz.length} questions to get a recommendation.`;
    return;
  }
  const best = [...pathOrder].sort((a, b) => votes[b] - votes[a])[0];
  const path = pathData[best];
  result.hidden = false;
  result.className = "placement-result is-ready";
  result.replaceChildren();
  result.append(
    Object.assign(document.createElement("strong"), { textContent: `Start with ${path.title}.` }),
    document.createTextNode(` ${path.description} `)
  );
  const open = document.createElement("button");
  open.className = "button button-primary";
  open.type = "button";
  open.textContent = "Open this path ↗";
  open.addEventListener("click", () => {
    document.querySelector("#placement-dialog").close();
    openPath(best);
  });
  result.append(open);
}

// ——— Changelog ———
function openChangelog() {
  const dialog = document.querySelector("#changelog-dialog");
  if (!dialog) return;
  const list = dialog.querySelector("[data-changelog-list]");
  list.replaceChildren();
  changelog.forEach((entry) => {
    const item = document.createElement("article");
    item.className = "changelog-entry";
    const date = document.createElement("time");
    date.dateTime = entry.date;
    date.textContent = entry.date;
    const heading = document.createElement("h3");
    heading.textContent = entry.title;
    const body = document.createElement("p");
    body.textContent = entry.body;
    item.append(date, heading, body);
    list.append(item);
  });
  if (!dialog.open) dialog.showModal();
}

function openAbout() {
  const dialog = document.querySelector("#about-dialog");
  if (dialog && !dialog.open) dialog.showModal();
}

// ——— My Studio ———
function submittedArtifacts() {
  return Object.entries(lessonWorkspaces).filter(([, state]) => state.submitted);
}

function artifactLesson(lessonId) {
  const match = lessonId.match(/^([a-z]+)-([1-9])$/);
  if (!match) return null;
  const [pathId, index] = [match[1], Number(match[2]) - 1];
  if (!pathData[pathId]?.modules[index]) return null;
  return { pathId, index };
}

function artifactShareText(pathId, index, title) {
  return `I finished "${title}" on learn.web — a free, project-based field guide to the modern web. Try it: ${siteUrl}${lessonUrl(pathId, index)}`;
}

function renderStudio() {
  const mount = document.querySelector("[data-studio]");
  if (!mount) return;
  const total = totalLessonCount();
  const completeCount = progress.size;
  const artifacts = submittedArtifacts();
  mount.querySelector("[data-studio-complete]").textContent = completeCount;
  mount.querySelector("[data-studio-total]").textContent = total;
  mount.querySelector("[data-studio-artifacts]").textContent = artifacts.length;

  const list = mount.querySelector("[data-studio-list]");
  list.replaceChildren();
  Object.entries(pathData).forEach(([pathId, path]) => {
    const section = document.createElement("section");
    section.className = "studio-path";
    section.append(Object.assign(document.createElement("h3"), { textContent: path.title }));
    let any = false;
    path.modules.forEach(([title], index) => {
      const lessonId = `${pathId}-${index + 1}`;
      const state = lessonWorkspaces[lessonId];
      if (!state?.submitted) return;
      any = true;
      const row = document.createElement("div");
      row.className = "studio-artifact";
      row.append(Object.assign(document.createElement("strong"), { textContent: title }));
      const actions = document.createElement("div");
      actions.className = "studio-artifact-actions";
      const openButton = makeElement("button", "", "Open");
      openButton.type = "button";
      openButton.addEventListener("click", () => openLesson(pathId, index));
      const exportButton = makeElement("button", "", "Export");
      exportButton.type = "button";
      exportButton.addEventListener("click", () => exportWorkspaceArtifact(lessonId, pathId, index, state));
      const shareButton = makeElement("button", "", "Copy share text");
      shareButton.type = "button";
      shareButton.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(artifactShareText(pathId, index, title));
          shareButton.textContent = "Copied";
          setTimeout(() => { shareButton.textContent = "Copy share text"; }, 1200);
        } catch {
          shareButton.textContent = "Copy failed";
        }
      });
      actions.append(openButton, exportButton, shareButton);
      row.append(actions);
      section.append(row);
    });
    if (!any) {
      section.append(Object.assign(document.createElement("p"), { className: "studio-empty", textContent: "No artifacts submitted yet in this path." }));
    }
    list.append(section);
  });

  mount.querySelector("[data-studio-certificate]").hidden = completeCount < total || !certificateAwardedAt;
}

// ——— Backups ———
function exportBackup() {
  flushPendingSaves();
  const payload = {
    app: "learnweb",
    version: 2,
    exportedAt: new Date().toISOString(),
    progress: [...progress],
    notes: lessonNotes,
    workspaces: lessonWorkspaces,
    certificateAwardedAt
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `learnweb-backup-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(link.href), 1000);
}

function importBackup(file, scope) {
  flushPendingSaves();
  const reader = new FileReader();
  reader.onload = () => {
    const status = scope?.querySelector("[data-backup-status]") || document.querySelector("[data-backup-status]");
    const announce = (message) => {
      if (status) {
        status.textContent = message;
        setTimeout(() => { if (status.textContent === message) status.textContent = ""; }, 5000);
      }
    };
    try {
      const normalized = validateBackupPayload(JSON.parse(reader.result));
      progress.clear();
      normalized.progress.forEach((id) => progress.add(id));
      replaceObject(lessonNotes, normalized.notes);
      replaceObject(lessonWorkspaces, normalized.workspaces);
      certificateAwardedAt = normalized.certificateAwardedAt;
      const stored = [
        writeStorage(storageKey, [...progress]),
        writeStorage(notesKey, lessonNotes),
        writeStorage(workspacesKey, lessonWorkspaces),
        writeStorage(certificateDateKey, certificateAwardedAt)
      ].every(Boolean);
      updateProgressUI();
      renderStudio();
      announce(stored ? "Backup restored ✓" : "Backup restored for this session; storage is unavailable.");
    } catch {
      announce("That file did not look like a learn.web backup.");
    }
  };
  reader.readAsText(file);
}

// ——— Certificate ———
function openCertificate() {
  const dialog = document.querySelector("#certificate-dialog");
  if (!dialog) return;
  const nameInput = dialog.querySelector("[data-certificate-name-input]");
  nameInput.value = readStorage("learnweb-certificate-name", "");
  renderCertificate(nameInput.value);
  if (!dialog.open) dialog.showModal();
}

function renderCertificate(name) {
  const display = document.querySelector("[data-certificate-name]");
  if (!display) return;
  display.textContent = name.trim() || "Your name";
  const date = certificateAwardedAt
    ? new Date(certificateAwardedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    : "Completion date unavailable";
  document.querySelector("[data-certificate-date]").textContent = date;
  document.querySelector("[data-certificate-count]").textContent = progress.size;
}

function saveCertificateName() {
  const input = document.querySelector("[data-certificate-name-input]");
  if (!input) return;
  writeStorage("learnweb-certificate-name", input.value);
  renderCertificate(input.value);
}

document.querySelectorAll("[data-open-placement]").forEach((button) => button.addEventListener("click", openPlacement));
document.querySelectorAll("[data-placement-submit]").forEach((button) => button.addEventListener("click", scorePlacement));
document.querySelectorAll("[data-open-changelog]").forEach((button) => button.addEventListener("click", openChangelog));
document.querySelectorAll("[data-open-about]").forEach((button) => button.addEventListener("click", openAbout));
document.querySelectorAll("[data-export-backup]").forEach((button) => button.addEventListener("click", exportBackup));
document.querySelectorAll("[data-import-backup]").forEach((input) => {
  input.addEventListener("change", (event) => {
    const file = event.currentTarget.files?.[0];
    if (file) importBackup(file, event.currentTarget.closest(".popover-tools, .studio-tools"));
    event.currentTarget.value = "";
  });
});
document.querySelectorAll("[data-open-certificate]").forEach((button) => button.addEventListener("click", openCertificate));
document.querySelectorAll("[data-print-certificate]").forEach((button) => button.addEventListener("click", () => window.print()));
document.querySelector(".update-banner-reload")?.addEventListener("click", () => location.reload());
document.querySelector("[data-certificate-name-input]")?.addEventListener("input", saveCertificateName);

initializeTheme();
initializeCapabilities();
initializePlayground();
initializeNavigationState();
updateProgressUI();
renderStudio();

if ("serviceWorker" in navigator && (location.protocol === "https:" || ["localhost", "127.0.0.1"].includes(location.hostname))) {
  addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {});
    navigator.serviceWorker.addEventListener("message", (event) => {
      if (event.data?.type === "LEARNWEB_UPDATE") {
        const banner = document.querySelector("[data-update-banner]");
        if (banner) banner.hidden = false;
      }
    });
  }, { once: true });
}

addEventListener("pagehide", flushPendingSaves);
