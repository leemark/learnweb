// Narrow data-safety and preview regression checks.
// Run: node resilience-test.mjs [--browser=firefox|webkit]
// Requires the app and runner servers at BASE_URL (default http://127.0.0.1:4173).

import fs from "node:fs/promises";
import { chromium, firefox, webkit } from "playwright";

const base = process.env.BASE_URL || "http://127.0.0.1:4173";
const browserFlagIndex = process.argv.findIndex((arg) => arg === "--browser" || arg.startsWith("--browser="));
const browserFlag = browserFlagIndex === -1
  ? undefined
  : process.argv[browserFlagIndex].includes("=")
    ? process.argv[browserFlagIndex].split("=")[1]
    : process.argv[browserFlagIndex + 1];
const browserName = (process.env.BROWSER || browserFlag || "chromium").toLowerCase();
const engines = { chromium, firefox, webkit };
if (!engines[browserName]) {
  console.error(`Unknown browser "${browserName}". Use chromium, firefox, or webkit.`);
  process.exit(1);
}

const failures = [];
function check(condition, label, detail = "") {
  if (condition) console.log(`PASS  ${label}`);
  else {
    const message = detail ? `${label}: ${detail}` : label;
    failures.push(message);
    console.error(`FAIL  ${message}`);
  }
}

async function waitForRunner(page, selector) {
  await page.waitForFunction((target) => document.querySelector(target)?.dataset.runnerState === "ready", selector, { timeout: 7000 });
}

async function runPreview(page, editorSelector, code, frameSelector = ".lab-frame") {
  const editor = page.locator(editorSelector);
  const language = await editor.getAttribute("data-editor");
  if (language) await page.locator(`#tab-${language}`).click();
  await editor.fill(code);
  await page.locator(".run-code").click();
  await waitForRunner(page, frameSelector);
  return page.frameLocator(frameSelector);
}

async function frameUrl(page, selector) {
  const handle = await page.locator(selector).elementHandle();
  const frame = await handle?.contentFrame();
  if (!frame) throw new Error(`No content frame for ${selector}`);
  return frame.url();
}

async function uploadBackup(page, payload, { accept = false, dismiss = false } = {}) {
  const dialogHandler = (dialog) => {
    if (accept) return dialog.accept();
    if (dismiss) return dialog.dismiss();
    return dialog.dismiss();
  };
  if (accept || dismiss) page.once("dialog", dialogHandler);
  const input = page.locator("[data-import-backup]").first();
  await input.setInputFiles({
    name: "resilience-backup.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify(payload))
  });
  await page.waitForTimeout(250);
}

async function navigateWithStorageSeed(page, raw, flag) {
  await page.addInitScript(({ values, seedFlag }) => {
    if (sessionStorage.getItem(seedFlag) === "1") return;
    sessionStorage.setItem(seedFlag, "1");
    localStorage.clear();
    Object.entries(values).forEach(([key, value]) => localStorage.setItem(key, value));
  }, { values: raw, seedFlag: flag });
  const seedUrl = new URL(base);
  seedUrl.searchParams.set("resilience-seed", flag);
  await page.goto(seedUrl.toString(), { waitUntil: "domcontentloaded" });
}

async function downloadBackup(page) {
  const visibleExport = page.locator("[data-export-backup]:visible");
  if (!(await visibleExport.count())) await page.locator(".progress-pill").click();
  const downloadWait = page.waitForEvent("download");
  await page.locator("[data-export-backup]:visible").first().click();
  const download = await downloadWait;
  const filePath = await download.path();
  if (!filePath) throw new Error("Export did not produce a readable download.");
  return JSON.parse(await fs.readFile(filePath, "utf8"));
}

function equalJson(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

const browser = await engines[browserName].launch();
const context = await browser.newContext();
const page = await context.newPage();
await page.emulateMedia({ reducedMotion: "reduce" });

try {
  await page.goto(base, { waitUntil: "domcontentloaded" });
  await page.locator('[data-editor="js"]').waitFor({ state: "attached" });

  // Fresh-realm behavior, timer disposal, watchdog health, and stale nonce rejection.
  const firstFrame = await runPreview(page, '[data-editor="js"]', "const marker = 1; document.body.textContent = 'FIRST';");
  await firstFrame.locator("body").filter({ hasText: "FIRST" }).waitFor();
  const firstNonce = new URL(await frameUrl(page, ".lab-frame")).searchParams.get("learnwebRun");
  const historyBeforeRuns = await page.evaluate(() => history.length);

  await runPreview(page, '[data-editor="js"]', "const marker = 1; document.body.textContent = 'SECOND';");
  await page.frameLocator(".lab-frame").locator("body").filter({ hasText: "SECOND" }).waitFor();
  const secondNonce = new URL(await frameUrl(page, ".lab-frame")).searchParams.get("learnwebRun");
  check(Boolean(firstNonce && secondNonce && firstNonce !== secondNonce), "each run receives a distinct navigation nonce");
  check((await page.evaluate(() => history.length)) === historyBeforeRuns, "repeated preview runs do not add browser history entries");

  await runPreview(page, '[data-editor="js"]', "setInterval(() => { document.body.textContent = 'OLD TIMER'; }, 40);");
  await page.frameLocator(".lab-frame").locator("body").filter({ hasText: "OLD TIMER" }).waitFor();
  await runPreview(page, '[data-editor="js"]', "const marker = 2; document.body.textContent = 'FRESH';");
  await page.waitForTimeout(250);
  check((await page.frameLocator(".lab-frame").locator("body").innerText()) === "FRESH", "old preview interval cannot modify the next run");

  await runPreview(page, '[data-editor="js"]', "setInterval(() => { document.body.textContent = 'HEALTHY'; }, 100);");
  await page.waitForTimeout(3500);
  check(await page.locator(".lab-frame").getAttribute("data-runner-state") === "ready", "ordinary long-running preview survives the watchdog");
  check((await page.frameLocator(".lab-frame").locator("body").innerText()) === "HEALTHY", "healthy preview remains rendered after watchdog window");

  // A heartbeat carrying the old nonce must not update the new navigation's readiness state.
  const currentNonce = new URL(await frameUrl(page, ".lab-frame")).searchParams.get("learnwebRun");
  const frameHandle = await page.locator(".lab-frame").elementHandle();
  const runnerFrame = await frameHandle?.contentFrame();
  if (!runnerFrame) throw new Error("No active preview frame for stale heartbeat test.");
  await runnerFrame.evaluate(() => {
    // The runner has only a heartbeat timer plus the learner's healthy timer.
    // Allocate one interval to learn the latest numeric ID, then clear every
    // interval through it so the timestamp assertion cannot race a heartbeat.
    const latestIntervalId = window.setInterval(() => {}, 1000);
    for (let intervalId = 1; intervalId <= latestIntervalId; intervalId += 1) window.clearInterval(intervalId);
  });
  await page.locator(".lab-frame").evaluate((frame) => { frame._learnwebLastHeartbeat = 123456; });
  await runnerFrame.evaluate((stale) => parent.postMessage({ learnwebHeartbeat: true, learnwebNavigationNonce: stale }, "*"), firstNonce);
  await page.waitForTimeout(120);
  check(
    (await page.locator(".lab-frame").evaluate((frame) => frame._learnwebLastHeartbeat)) === 123456,
    "stale nonce heartbeat cannot mark a replacement runner ready"
  );
  await runnerFrame.evaluate((current) => parent.postMessage({ learnwebHeartbeat: true, learnwebNavigationNonce: current }, "*"), currentNonce);
  await page.waitForFunction(() => document.querySelector(".lab-frame")?._learnwebLastHeartbeat !== 123456, null, { timeout: 1000 });
  check(
    (await page.locator(".lab-frame").evaluate((frame) => frame._learnwebLastHeartbeat)) !== 123456,
    "current nonce heartbeat is accepted after stale heartbeat rejection"
  );
  await page.locator(".stop-code").click();

  // Seed a known, nonempty browser state for confirmation/cancellation and rollback tests.
  const oldRaw = {
    "learnweb-progress-v2": JSON.stringify(["foundations-1"]),
    "learnweb-lesson-notes-v1": JSON.stringify({ "foundations-1": "old visible note" }),
    "learnweb-studio-workspaces-v1": JSON.stringify({
      "foundations-1": { type: "record", responses: ["old response one", "old response two", "old response three"], submitted: false, updatedAt: 101 }
    }),
    "learnweb-certificate-awarded-at-v1": "null",
    "learnweb-last-lesson-v1": JSON.stringify("foundations-1")
  };
  await navigateWithStorageSeed(page, oldRaw, "__resilience_seed_original");
  await page.locator(".progress-pill").waitFor();
  check((await page.locator(".progress-pill").innerText()).includes("1/36"), "seeded original progress is visible before backup tests");

  const replacement = {
    app: "learnweb",
    version: 2,
    progress: ["platform-1"],
    notes: { "platform-1": "replacement note" },
    workspaces: {},
    certificateAwardedAt: null,
    lastLessonId: "platform-1"
  };
  await uploadBackup(page, replacement, { dismiss: true });
  check((await page.locator(".progress-pill").innerText()).includes("1/36"), "cancelled backup confirmation keeps old visible progress");
  const afterCancel = await page.evaluate(() => Object.fromEntries([
    "learnweb-progress-v2", "learnweb-lesson-notes-v1", "learnweb-studio-workspaces-v1", "learnweb-certificate-awarded-at-v1", "learnweb-last-lesson-v1"
  ].map((key) => [key, localStorage.getItem(key)])));
  check(equalJson(afterCancel, oldRaw), "cancelled backup leaves all original raw storage values", `before=${JSON.stringify(oldRaw)} after=${JSON.stringify(afterCancel)}`);

  await uploadBackup(page, replacement, { accept: true });
  check((await page.locator(".progress-pill").innerText()).includes("1/36"), "confirmed valid backup import updates visible progress");
  check(await page.evaluate(() => JSON.parse(localStorage.getItem("learnweb-progress-v2"))[0] === "platform-1"), "confirmed valid backup import stores the replacement progress identity");
  check(await page.evaluate(() => JSON.parse(localStorage.getItem("learnweb-lesson-notes-v1"))["platform-1"] === "replacement note"), "confirmed valid backup import updates notes");

  // Re-seed old state and force the workspaces write to fail after earlier writes succeed.
  await navigateWithStorageSeed(page, oldRaw, "__resilience_seed_failure");
  await page.locator(".progress-pill").waitFor();
  const beforeFailure = await page.evaluate(() => Object.fromEntries([
    "learnweb-progress-v2", "learnweb-lesson-notes-v1", "learnweb-studio-workspaces-v1", "learnweb-certificate-awarded-at-v1", "learnweb-last-lesson-v1"
  ].map((key) => [key, localStorage.getItem(key)])));
  await page.evaluate(() => {
    window.__resilienceOriginalSetItem = Storage.prototype.setItem;
    Storage.prototype.setItem = function (key, value) {
      if (key === "learnweb-studio-workspaces-v1") throw new DOMException("QuotaExceededError", "QuotaExceededError");
      return window.__resilienceOriginalSetItem.call(this, key, value);
    };
  });
  const failingReplacement = {
    app: "learnweb",
    version: 2,
    progress: ["platform-2"],
    notes: { "platform-2": "should not survive failed restore" },
    workspaces: {},
    certificateAwardedAt: null,
    lastLessonId: "platform-2"
  };
  await uploadBackup(page, failingReplacement, { accept: true });
  const failureStatus = await page.locator("[data-backup-status]").first().innerText();
  check(failureStatus.toLowerCase().includes("storage") || failureStatus.toLowerCase().includes("saved"), "storage failure reports a useful persistent backup error");
  const afterFailure = await page.evaluate(() => Object.fromEntries([
    "learnweb-progress-v2", "learnweb-lesson-notes-v1", "learnweb-studio-workspaces-v1", "learnweb-certificate-awarded-at-v1", "learnweb-last-lesson-v1"
  ].map((key) => [key, localStorage.getItem(key)])));
  check(equalJson(afterFailure, beforeFailure), "failed backup restores every original raw storage key");
  check((await page.locator(".progress-pill").innerText()).includes("1/36"), "failed backup preserves old visible progress in memory");

  await page.evaluate(() => { Storage.prototype.setItem = window.__resilienceOriginalSetItem; });
  const failedExport = await downloadBackup(page);
  check(equalJson(failedExport.progress, JSON.parse(oldRaw["learnweb-progress-v2"])), "export after failed restore matches original progress memory");
  check(equalJson(failedExport.notes, JSON.parse(oldRaw["learnweb-lesson-notes-v1"])), "export after failed restore matches original notes memory");
  check(equalJson(failedExport.workspaces, JSON.parse(oldRaw["learnweb-studio-workspaces-v1"])), "export after failed restore matches original workspace memory");

  await page.reload({ waitUntil: "domcontentloaded" });
  check((await page.locator(".progress-pill").innerText()).includes("1/36"), "reload remains on original progress after failed restore");

  // Ordinary export/import round-trip in a clean state.
  const roundTrip = await downloadBackup(page);
  await navigateWithStorageSeed(page, {}, "__resilience_seed_clean_roundtrip");
  await uploadBackup(page, roundTrip, { accept: false });
  check((await page.locator(".progress-pill").innerText()).includes("1/36"), "ordinary exported backup imports successfully after reload");
  check(await page.evaluate(() => JSON.parse(localStorage.getItem("learnweb-lesson-notes-v1"))["foundations-1"] === "old visible note"), "ordinary backup round-trip restores notes");

  // Native limits must match the accepted sanitizer limits.
  check(await page.locator("[data-editor]").evaluateAll((els) => els.every((el) => el.maxLength === 500000)), "homepage code inputs use the 500,000-character sanitizer cap");
  check(await page.locator("#lesson-note").count() === 0 || await page.locator("#lesson-note").evaluate((el) => el.maxLength === 100000), "lesson note uses the 100,000-character sanitizer cap");
  await page.locator('[data-open-path="foundations"]').first().click();
  await page.locator(".start-lesson").first().click();
  check(await page.locator("#lesson-note").evaluate((el) => el.maxLength === 100000), "open lesson note uses the 100,000-character sanitizer cap");
  check(await page.locator(".workspace-record textarea").evaluateAll((els) => els.length === 3 && els.every((el) => el.maxLength === 100000)), "record inputs use the 100,000-character sanitizer cap");
  await page.locator(".lesson-close").click();
  await page.locator("#path-dialog .dialog-close").click();
  await page.locator('[data-open-path="platform"]').first().click();
  await page.locator(".start-lesson").first().click();
  check(await page.locator("[data-workspace-editor]").evaluateAll((els) => els.length === 3 && els.every((el) => el.maxLength === 500000)), "workspace code inputs use the 500,000-character sanitizer cap");
} catch (error) {
  failures.push(`unexpected test error: ${error.stack || error.message}`);
  console.error(`FAIL  unexpected test error: ${error.stack || error.message}`);
} finally {
  await context.close();
  await browser.close();
}

if (failures.length) {
  console.error(`\n${failures.length} resilience test failure${failures.length === 1 ? "" : "s"}.`);
  process.exitCode = 1;
} else {
  console.log("\nAll resilience checks passed.");
}
