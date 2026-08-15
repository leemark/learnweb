// smoke-test.mjs — Playwright-driven verification of the interactive app.
// Run: node smoke-test.mjs  (requires `npm i -D playwright` + `npx playwright install chromium`)

import { chromium } from "playwright";

const base = process.env.BASE_URL || "http://127.0.0.1:4173";
const failures = [];
const log = (ok, label) => {
  console.log(`${ok ? "PASS" : "FAIL"}  ${label}`);
  if (!ok) failures.push(label);
};

const browser = await chromium.launch();
const page = await browser.newPage();
const consoleErrors = [];
page.on("console", (msg) => { if (msg.type() === "error") consoleErrors.push(msg.text()); });
page.on("pageerror", (error) => consoleErrors.push(`pageerror: ${error.message}`));

// 1. Homepage loads cleanly
await page.goto(base, { waitUntil: "networkidle" });
log((await page.locator("h1").first().isVisible()), "homepage h1 visible");
log((await page.locator(".path-card").count()) === 6, "six path cards rendered");
log((await page.locator(".progress-pill").innerText()).includes("/36"), "progress pill shows /36");

// 2. Static lesson page
const lessonUrl = `${base}/learn/platform/html-that-works-harder/`;
await page.goto(lessonUrl, { waitUntil: "networkidle" });
log((await page.locator("h1").innerText()) === "HTML that works harder", "static lesson h1");
log((await page.locator(".static-objectives li").count()) === 3, "static lesson objectives");
log((await page.locator(".static-quiz fieldset").count()) === 2, "static lesson has 2 quiz questions");
log((await page.locator("script[type='application/ld+json']").count()) >= 1, "lesson JSON-LD present");

// 2b. Editor keyboard escape (A11Y-001): Tab navigates by default, mode is explicit
await page.goto(base, { waitUntil: "networkidle" });
const htmlEditor = page.locator('[data-editor="html"]');
await htmlEditor.focus();
await page.keyboard.press("Tab");
const afterTab = await page.evaluate(() => document.activeElement?.dataset?.editor || document.activeElement?.id || "other");
log(afterTab !== "html", `Tab leaves editor by default (active: ${afterTab})`);
await page.locator("[data-editor-mode]").click();
log((await page.locator("[data-editor-mode]").getAttribute("aria-pressed")) === "true", "insert-spaces mode engages");
const before = await htmlEditor.inputValue();
await htmlEditor.focus();
await page.keyboard.press("Tab");
log((await htmlEditor.inputValue()).length > before.length, "Tab inserts spaces in mode");
await page.keyboard.press("Escape");
log((await page.locator("[data-editor-mode]").getAttribute("aria-pressed")) === "false", "Escape exits insert mode");
await htmlEditor.focus();
await page.keyboard.press("Tab");
const afterExit = await page.evaluate(() => document.activeElement?.dataset?.editor || document.activeElement?.id || "other");
log(afterExit !== "html", "Tab navigates again after exit");
const mainSandbox = await page.locator(".lab-frame").getAttribute("sandbox");
log(mainSandbox.includes("allow-scripts") && !mainSandbox.includes("allow-modals"), "main lab sandbox excludes modals");
await page.locator(".stop-code").click();
log((await page.locator(".run-status").innerText()) === "Stopped", "main lab Stop control resets runner");
await page.locator(".run-code").click();
await page.waitForTimeout(300);
log((await page.locator(".run-status").innerText()) === "Rendered", "main lab can run again after Stop");

// 3. Open path dialog + lesson dialog, quiz gate behavior
await page.goto(base, { waitUntil: "networkidle" });
await page.locator('[data-open-path="platform"]').first().click();
log(await page.locator("#path-dialog").isVisible(), "path dialog opens");
log((await page.locator(".module-item").count()) === 6, "path dialog lists 6 modules");
await page.locator(".start-lesson").first().click();
log(await page.locator("#lesson-dialog").isVisible(), "lesson dialog opens");
log((await page.locator(".quiz-group").count()) === 2, "two quiz groups rendered");
const completeButton = page.locator(".complete-lesson");
log(await completeButton.isDisabled(), "complete button disabled initially");

// 4. Answer quiz correctly (platform lesson 1: correct answers are both B)
await page.locator('.quiz-group').nth(0).locator('input').nth(1).check();
await page.locator('.quiz-group').nth(1).locator('input').nth(1).check();
await page.locator(".check-answer").click();
log((await page.locator(".quiz-feedback.is-correct").count()) === 2, "both quiz feedbacks correct");
log(await completeButton.isDisabled(), "complete still disabled (artifact not submitted)");

// 5. Submit the studio artifact (record lessons need 3 responses >= 30 chars)
// platform lesson 1 is a code workspace: type into all three editors
await page.locator('[data-workspace-editor="html"]').fill("<!-- changed -->\n" + (await page.locator('[data-workspace-editor="html"]').inputValue()));
await page.locator('[data-workspace-editor="html"]').fill((await page.locator('[data-workspace-editor="html"]').inputValue()) + "\n<p>real change for the artifact</p>");
const checks = page.locator("[data-workspace-checks] li");
await page.waitForFunction(() => {
  const items = document.querySelectorAll("[data-workspace-checks] li");
  return items.length > 0 && [...items].every((item) => item.dataset.complete === "true");
});
log(true, "workspace quality signals met");
await page.locator("[data-submit-workspace]").click();
log((await page.locator("[data-submit-workspace]").innerText()).includes("submitted"), "artifact submitted");
await page.waitForTimeout(300);
log(!(await completeButton.isDisabled()), "complete button enabled after quiz + artifact");

// 6. Complete lesson -> progress updates
await completeButton.click();
await page.waitForTimeout(300);
log((await page.locator(".progress-pill").innerText()).includes("1/36"), "progress counts 1/36");

// 6b. Notes survive immediate close (NOTES-001): type, close without debounce, reopen
const noteText = "Reflection saved before the debounce could fire";
await page.locator("#lesson-note").fill(noteText);
await page.locator(".lesson-close").click();
await page.waitForTimeout(150);
await page.locator(".progress-pill").click();
await page.keyboard.press("Escape");
await page.waitForTimeout(150);
await page.locator('[data-open-path="platform"]').first().click();
await page.locator(".start-lesson").first().click();
log((await page.locator("#lesson-note").inputValue()) === noteText, "note survives immediate close (flush)");

// 6c. Preview hardening (LAB-001/002): sandbox, auto-run default, alerts, errors, stop
const previewFrame = page.frameLocator(".lesson-code-preview iframe");
const sandbox = await page.locator(".lesson-code-preview iframe").getAttribute("sandbox");
log(sandbox.includes("allow-scripts") && !sandbox.includes("allow-modals"), "workspace sandbox excludes modals (LAB-002)");
log((await page.locator(".workspace-mini-action:has-text('Auto-run')").getAttribute("aria-pressed")) === "false", "auto-run off by default (LAB-001)");
const jsTab = async () => { await page.locator('[data-workspace-tab="js"]').click(); await page.waitForTimeout(100); };
await jsTab();
await page.locator('[data-workspace-editor="js"]').fill('document.body.textContent = "auto-ran";');
await page.waitForTimeout(800);
log(!(await previewFrame.locator("body").innerText()).includes("auto-ran"), "no auto re-run while typing (LAB-001)");
await page.locator(".workspace-mini-action:has-text('Run preview')").click();
await page.waitForTimeout(300);
log((await previewFrame.locator("body").innerText()).includes("auto-ran"), "manual run renders latest code");
await jsTab();
await page.locator('[data-workspace-editor="js"]').fill('alert("blocked"); document.body.textContent = "after-alert";');
await page.locator(".workspace-mini-action:has-text('Run preview')").click();
await page.waitForTimeout(300);
log((await previewFrame.locator("body").innerText()).includes("after-alert"), "alert ignored, frame still runs (LAB-002)");
log((await page.locator(".lesson-code-preview").isVisible()), "parent page responsive after alert attempt");
await jsTab();
await page.locator('[data-workspace-editor="js"]').fill('function ( {');
await page.locator(".workspace-mini-action:has-text('Run preview')").click();
await page.waitForTimeout(300);
log((await previewFrame.locator("body").innerText()).includes("SyntaxError"), "syntax errors surfaced in preview");
await jsTab();
await page.locator('[data-workspace-editor="js"]').fill('Promise.reject(new Error("boom"));');
await page.locator(".workspace-mini-action:has-text('Run preview')").click();
await page.waitForTimeout(300);
log((await previewFrame.locator("body").innerText()).includes("Unhandled promise rejection"), "unhandled rejections surfaced");
await page.locator(".workspace-mini-action:has-text('Stop')").click();
await page.waitForTimeout(200);
log((await previewFrame.locator("body").innerText()).trim() === "", "Stop button clears the preview");
await page.locator(".lesson-close").click();
await page.waitForTimeout(150);
log((await page.locator(".progress-pill").innerText()).includes("1/36"), "progress still counts 1/36 after note test");
const studio = page.locator("[data-studio]");
log((await studio.locator("[data-studio-complete]").innerText()) === "1", "studio shows 1 complete");

// 7. Placement check — every trigger instance works (FUNC-001)
const placementTriggers = page.locator("[data-open-placement]");
log((await placementTriggers.count()) >= 3, `placement triggers everywhere (${await placementTriggers.count()} found)`);
for (let i = 0; i < (await placementTriggers.count()); i += 1) {
  await placementTriggers.nth(i).click();
  log(await page.locator("#placement-dialog").isVisible(), `placement trigger ${i + 1} opens dialog`);
  await page.locator("#placement-dialog .dialog-close").click();
  await page.waitForTimeout(150);
}
log((await page.locator("#placement-dialog").isHidden()), "placement dialog closes cleanly");
const placementGroups = page.locator(".placement-question");
await placementTriggers.first().click();
log((await placementGroups.count()) === 4, "placement has 4 questions");
for (let i = 0; i < 4; i += 1) {
  await placementGroups.nth(i).locator("input").nth(0).check();
}
await page.locator("[data-placement-submit]").click();
log(await page.locator("[data-placement-result].is-ready").isVisible(), "placement recommendation shown");
await page.locator("#placement-dialog button:has-text('Open this path')").click();
log(await page.locator("#path-dialog").isVisible(), "placement opens a path");
await page.locator("#path-dialog .dialog-close").click();
await page.waitForTimeout(150);

// 7b. Backup export — every instance downloads (FUNC-001)
const exportButtons = page.locator("[data-export-backup]");
log((await exportButtons.count()) === 2, "two export backup instances");
await page.locator(".progress-pill").click();
const popoverDownload = page.waitForEvent("download");
await page.locator(".progress-popover [data-export-backup]").click();
const popoverFile = await popoverDownload;
log(popoverFile.suggestedFilename().startsWith("learnweb-backup-"), "popover export downloads backup");
await page.keyboard.press("Escape");
await page.waitForTimeout(150);
const studioDownload = page.waitForEvent("download");
await page.locator("[data-studio] [data-export-backup]").click();
const studioFile = await studioDownload;
log(studioFile.suggestedFilename().startsWith("learnweb-backup-"), "studio export downloads backup");

// 7c. Backup import — both controls restore and announce locally (FUNC-001)
const importInputs = page.locator("[data-import-backup]");
log((await importInputs.count()) === 2, "two import backup instances");
const backupJson = JSON.stringify({
  app: "learnweb",
  version: 1,
  progress: ["platform-1"],
  notes: {},
  workspaces: {}
});
await page.locator(".progress-pill").click();
await importInputs.nth(0).setInputFiles({ name: "backup.json", mimeType: "application/json", buffer: Buffer.from(backupJson) });
await page.waitForTimeout(300);
log((await page.locator(".progress-popover [data-backup-status]").innerText()).includes("Backup restored"), "popover import announces restore");
log((await page.locator(".progress-pill").innerText()).includes("1/36"), "imported progress reflected");
await page.keyboard.press("Escape");
await page.waitForTimeout(150);
await importInputs.nth(1).setInputFiles({ name: "backup.json", mimeType: "application/json", buffer: Buffer.from(backupJson) });
await page.waitForTimeout(300);
log((await page.locator("[data-studio] [data-backup-status]").innerText()).includes("Backup restored"), "studio import announces restore");
const badBackup = JSON.stringify({ app: "not-learnweb" });
await importInputs.nth(1).setInputFiles({ name: "bad.json", mimeType: "application/json", buffer: Buffer.from(badBackup) });
await page.waitForTimeout(300);
log((await page.locator("[data-studio] [data-backup-status]").innerText()).includes("did not look like"), "malformed backup rejected with message");

// 8. Changelog dialog
await page.locator("[data-open-changelog]").first().click();
log(await page.locator("#changelog-dialog").isVisible(), "changelog dialog opens");
log((await page.locator(".changelog-entry").count()) >= 1, "changelog has entries");

// 9. Search finds new features
await page.locator("#changelog-dialog .dialog-close").click();
await page.waitForTimeout(200);
await page.locator("[data-open-about]").first().click();
log(await page.locator("#about-dialog").isVisible(), "about and privacy dialog opens");
log((await page.locator("#about-dialog").innerText()).includes("Google Analytics 4"), "privacy disclosure names GA4");
log((await page.locator("#about-dialog").innerText()).includes("never leave your device"), "privacy disclosure explains local learner data");
await page.locator("#about-dialog .dialog-close").click();
await page.waitForTimeout(150);
await page.locator(".search-trigger").first().click();
await page.locator("#site-search").fill("where should I start");
await page.waitForTimeout(200);
log((await page.locator(".search-result").count()) >= 1, "search finds placement check");
await page.keyboard.press("Escape");

// 10. Static hub + path pages
await page.goto(`${base}/learn/`, { waitUntil: "networkidle" });
log((await page.locator(".learn-path").count()) === 6, "hub lists 6 paths");
await page.goto(`${base}/learn/foundations/`, { waitUntil: "networkidle" });
log((await page.locator("h1").innerText()) === "Web Foundations", "foundations path page h1");

// 11. No console errors (excluding expected preview-frame errors)
const expectedFrameErrors = ["Function statements require a function name", "SyntaxError", "allow-modals"];
const relevant = consoleErrors.filter((error) => {
  if (error.includes("favicon")) return false;
  return !expectedFrameErrors.some((known) => error.includes(known));
});
log(relevant.length === 0, `no console errors (${relevant.length})`);
if (relevant.length) console.error(relevant.join("\n"));

await browser.close();

if (failures.length) {
  console.error(`\n${failures.length} FAILURES:\n- ${failures.join("\n- ")}`);
  process.exit(1);
}
console.log("\nAll smoke checks passed.");
