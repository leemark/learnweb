// smoke-test.mjs — Playwright-driven verification of the interactive app.
// Run: node smoke-test.mjs  (requires `npm i -D playwright` + `npx playwright install chromium`)

import { chromium } from "playwright";

const base = "http://127.0.0.1:4173";
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
await page.locator(".lesson-close").click();
await page.waitForTimeout(200);
const studio = page.locator("[data-studio]");
log((await studio.locator("[data-studio-complete]").innerText()) === "1", "studio shows 1 complete");

// 7. Placement check
await page.locator("[data-open-placement]").first().click();
log(await page.locator("#placement-dialog").isVisible(), "placement dialog opens");
const placementGroups = page.locator(".placement-question");
log((await placementGroups.count()) === 4, "placement has 4 questions");
for (let i = 0; i < 4; i += 1) {
  await placementGroups.nth(i).locator("input").nth(0).check();
}
await page.locator("[data-placement-submit]").click();
log(await page.locator("[data-placement-result].is-ready").isVisible(), "placement recommendation shown");
await page.locator("#placement-dialog button:has-text('Open this path')").click();
log(await page.locator("#path-dialog").isVisible(), "placement opens a path");

// 8. Changelog dialog
await page.locator(".dialog-close").first().click();
await page.waitForTimeout(200);
await page.locator("[data-open-changelog]").first().click();
log(await page.locator("#changelog-dialog").isVisible(), "changelog dialog opens");
log((await page.locator(".changelog-entry").count()) >= 1, "changelog has entries");

// 9. Search finds new features
await page.locator("#changelog-dialog .dialog-close").click();
await page.waitForTimeout(200);
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

// 11. No console errors
const relevant = consoleErrors.filter((error) => !error.includes("favicon"));
log(relevant.length === 0, `no console errors (${relevant.length})`);
if (relevant.length) console.error(relevant.join("\n"));

await browser.close();

if (failures.length) {
  console.error(`\n${failures.length} FAILURES:\n- ${failures.join("\n- ")}`);
  process.exit(1);
}
console.log("\nAll smoke checks passed.");
