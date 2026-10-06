// Focused learner-journey regressions. Requires the local app + runner servers.
import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { chromium, firefox, webkit } from "playwright";
import { AxeBuilder } from "@axe-core/playwright";
import { pathOrder, pathData, lessonGuides, lessonUrl, pathUrl } from "./curriculum.js";

const base = process.env.BASE_URL || "http://127.0.0.1:4173";
const engine = process.env.BROWSER || "chromium";
assert.ok(["chromium", "firefox", "webkit"].includes(engine), "supported browser");
const browser = await ({ chromium, firefox, webkit })[engine].launch();
const context = await browser.newContext({ reducedMotion: "reduce" });
const page = await context.newPage();
page.setDefaultTimeout(10_000);
const errors = [];
page.on("pageerror", error => errors.push(error.message));
const pass = label => console.log(`PASS  ${label}`);
const artifactDir = "output/playwright";
await mkdir(artifactDir, { recursive: true });

async function cleanAxe(label, targetPage = page) {
  // Theme color transitions are not the steady-state reading contrast.
  await targetPage.waitForTimeout(1200);
  const result = await new AxeBuilder({ page: targetPage }).analyze();
  const violations = result.violations.filter(v => ["serious", "critical"].includes(v.impact));
  if (violations.length) console.error(JSON.stringify(violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => ({ target: n.target, summary: n.failureSummary })) })), null, 2));
  assert.deepEqual(violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target) })), [], label);
  pass(`axe ${label}`);
}

async function noHorizontalOverflow(label, selector = "html") {
  await page.locator(selector).waitFor({ state: "visible" });
  await page.evaluate(() => document.fonts.ready);
  try {
    await page.waitForFunction(target => {
      const el = document.querySelector(target);
      return el && el.clientWidth > 0 && el.scrollWidth <= el.clientWidth + 1;
    }, selector);
  } catch (error) {
    console.error(label, await page.locator(selector).evaluate(el => {
      const box = el.getBoundingClientRect();
      return { scroll: el.scrollWidth, client: el.clientWidth, overflowing: [...el.querySelectorAll("*")].map(node => {
        const rect = node.getBoundingClientRect();
        return { tag: node.tagName, class: node.className, x: rect.x, right: rect.right, text: node.textContent?.slice(0, 60) };
      }).filter(item => item.right > box.right + 1 || item.x < box.x - 1).slice(0, 20) };
    }));
    await page.screenshot({ path: `${artifactDir}/${engine}-overflow-failure.png` });
    throw error;
  }
  const size = await page.locator(selector).evaluate(el => ({ scroll: el.scrollWidth, client: el.clientWidth }));
  assert.ok(size.scroll <= size.client + 1, `${label}: no horizontal overflow (${size.scroll}/${size.client})`);
}

try {
  await page.goto(base);
  const primary = page.locator("[data-home-primary]");
  assert.match(await primary.innerText(), /Start learning/);
  assert.equal(await primary.getAttribute("href"), lessonUrl("foundations", 0));
  await primary.click();
  await page.waitForFunction(() => document.activeElement?.id === "lesson-title");
  assert.match(page.url(), /#lesson-foundations-1$/);
  pass("first lesson is one action away, with a real fallback URL and heading focus");

  for (const [section, heading] of [["build", "practice-title"], ["check", "check-title"], ["notes", "lesson-notes-title"]]) {
    await page.locator(`[data-lesson-section="${section}"]`).click();
    await page.waitForFunction(id => document.activeElement?.id === id, heading);
    const target = await page.locator(`#${heading}`).boundingBox();
    const nav = await page.locator("[data-lesson-section-nav]").boundingBox();
    assert.ok(target && nav && target.y >= nav.y + nav.height - 1, `${section} heading is not hidden under sticky navigation`);
    assert.ok((await page.locator(".lesson-header").boundingBox()).y >= 0, "lesson close controls remain pinned");
    assert.match(page.url(), /#lesson-foundations-1$/);
  }
  pass("section shortcuts reveal and focus their headings without changing the lesson URL");

  await page.locator('[data-lesson-section="check"]').click();
  await page.locator(".check-answer").click();
  assert.match(await page.locator(".quiz-feedback").first().innerText(), /choose|select|answer/i);
  await page.waitForFunction(() => document.querySelector(".quiz-group input") === document.activeElement);
  assert.ok(await page.locator(".quiz-group input").first().evaluate(el => el === document.activeElement));
  pass("unanswered knowledge checks explain the problem and focus the first missing answer");

  const responses = page.locator(".workspace-record textarea");
  assert.equal(await responses.count(), 3);
  for (let i = 0; i < 3; i++) await responses.nth(i).fill(`My observation ${i + 1}: the browser requests a document and turns its content into an accessible page.`);
  await page.locator("[data-submit-workspace]").click();
  assert.ok(await page.locator(".complete-lesson").isDisabled());
  for (let i = 0; i < 2; i++) {
    await page.locator(".quiz-group").nth(i).locator("input").nth(lessonGuides.foundations[0].quiz[i][2]).check();
  }
  await page.locator(".check-answer").click();
  await page.locator(".complete-lesson").click();
  assert.match(await page.locator("[data-completion-feedback]").innerText(), /complete|finished|saved/i);
  const next = page.locator("[data-next-lesson-action]");
  assert.ok(await next.isVisible());
  assert.equal(await next.getAttribute("href"), lessonUrl("foundations", 1));
  await next.click();
  assert.equal(await page.locator("#lesson-title").innerText(), pathData.foundations.modules[1][0]);
  pass("completion still requires both proofs and offers a clear next lesson");

  await page.locator("#lesson-note").fill("A note to return to in the next session.");
  await page.locator(".lesson-close").click();
  await page.locator("#path-dialog .dialog-close").click();
  await page.reload();
  assert.match(await primary.innerText(), /Continue learning/);
  assert.equal(await primary.getAttribute("href"), lessonUrl("foundations", 1));
  await primary.click();
  assert.equal(await page.locator("#lesson-note").inputValue(), "A note to return to in the next session.");
  pass("returning learner resumes the correct lesson and saved notes");
  await page.locator(".lesson-close").click();
  await page.locator("#path-dialog .dialog-close").click();

  const importButton = page.locator('[data-import-trigger="import-backup"]');
  await importButton.focus();
  assert.ok(await importButton.evaluate(el => el === document.activeElement && el.tagName === "BUTTON"));
  const chooser = page.waitForEvent("filechooser");
  await page.keyboard.press("Enter");
  await chooser;
  pass("backup import is a keyboard-operable button");

  await page.locator(".search-trigger").click();
  const search = page.locator("#site-search");
  for (const query of ["CSS", "HTML"]) {
    await search.fill(query);
    assert.match(await page.locator(".result-title").first().innerText(), new RegExp(query, "i"));
  }
  await search.fill("container responsive");
  assert.ok((await page.locator(".search-result").count()) > 0, "separated search terms match relevant content");
  await search.fill("the");
  const count = await page.locator(".search-result").count();
  assert.ok(count > 12, "all matches are reachable, not silently capped at twelve");
  assert.match(await page.locator(".search-count").innerText(), new RegExp(`\\b${count}\\b`));
  await search.fill("CSS");
  const titles = await page.locator(".result-title").allTextContents();
  await page.keyboard.press("Escape");
  await page.locator(".search-trigger").click();
  assert.equal(await search.inputValue(), "CSS");
  assert.deepEqual(await page.locator(".result-title").allTextContents(), titles);
  await search.press("ArrowDown");
  assert.ok(await page.locator(".search-result").first().evaluate(el => el === document.activeElement));
  await page.keyboard.press("ArrowUp");
  assert.ok(await search.evaluate(el => el === document.activeElement));
  await search.press("Enter");
  assert.equal(await page.locator("#lesson-title").innerText(), titles[0]);
  pass("search ranks titles, matches multiple terms, exposes all results and supports the keyboard");

  // Responsive and accessibility checks use real layout, not source assertions.
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(`${base}/#lesson-foundations-1`);
    await noHorizontalOverflow(`lesson at ${width}px`, ".lesson-reader");
    assert.equal(await page.locator(".lesson-dialog").evaluate(el => getComputedStyle(el).overflowY), "clip");
    assert.ok(await page.locator(".lesson-position").isVisible(), "mobile lesson position remains available");
    await page.locator('[data-lesson-section="build"]').click();
    await noHorizontalOverflow(`workspace at ${width}px`, ".studio-workspace");
    await page.screenshot({ path: `${artifactDir}/${engine}-lesson-${width}.png` });
    if (width === 390 || width === 1440) await cleanAxe(`lesson ${width}px`);
    await page.goto(`${base}/#lesson-platform-1`);
    await page.locator('[data-lesson-section="build"]').click();
    const editor = page.locator('[data-workspace-editor="html"]');
    await editor.scrollIntoViewIfNeeded();
    const editorBox = await editor.boundingBox();
    const limitBox = await page.locator(".workspace-code-panel:not([hidden]) .workspace-input-limit").boundingBox();
    assert.ok(editorBox.height >= 280, "code editor has usable height above the preview");
    assert.ok(limitBox.y >= editorBox.y + editorBox.height - 1, "input limit does not overlap code");
    assert.ok((await page.locator(".lesson-header").boundingBox()).y >= 0, "editor focus cannot hide close controls");
    await noHorizontalOverflow(`code workspace at ${width}px`, ".lesson-reader");
    if (width === 390) {
      await page.screenshot({ path: `${artifactDir}/${engine}-editor-${width}.png` });
      await cleanAxe("mobile code workspace");
    }
    await page.goto(base);
    await noHorizontalOverflow(`homepage at ${width}px`);
    if (width === 390 || width === 1440) {
      await page.screenshot({ path: `${artifactDir}/${engine}-home-${width}.png` });
      for (const theme of ["ink", "paper"]) {
        if (await page.locator("html").getAttribute("data-theme") !== theme) await page.locator(".theme-toggle").click();
        assert.equal(await page.locator("html").getAttribute("data-theme"), theme);
        assert.ok(await page.evaluate(() => {
          const foreground = getComputedStyle(document.body).color;
          return [...document.querySelectorAll(".path-card h3, .studio-artifact strong")]
            .every(el => getComputedStyle(el).color === foreground);
        }), "theme switch updates inherited card text colors");
        // Keep contrast scans independent of previous theme/style caches while
        // retaining this learner's progress, drafts, and chosen theme.
        const themeContext = await browser.newContext({
          viewport: { width, height: 900 }, reducedMotion: "reduce",
          colorScheme: theme === "ink" ? "dark" : "light",
          storageState: await context.storageState()
        });
        try {
          const themePage = await themeContext.newPage();
          await themePage.goto(base);
          assert.equal(await themePage.locator("html").getAttribute("data-theme"), theme, "theme choice survives a new session");
          // Include the normally hidden update state in both theme audits.
          await themePage.locator("[data-update-banner]").evaluate(el => { el.hidden = false; });
          await cleanAxe(`home ${width}px ${theme}`, themePage);
        } finally {
          await themeContext.close();
        }
      }
    }
  }
  pass("home, lesson and workspace fit 320, 390, 768 and 1440 pixel viewports");

  // Browser-rendered static output: all paths/lessons, independent of JavaScript.
  const urls = ["/learn/", ...pathOrder.flatMap(id => [pathUrl(id), ...pathData[id].modules.map((_, index) => lessonUrl(id, index))])];
  await page.setViewportSize({ width: 390, height: 844 });
  for (const url of urls) {
    const response = await page.goto(`${base}${url}`, { waitUntil: "domcontentloaded" });
    assert.equal(response.status(), 200, url);
    assert.equal(await page.locator("h1").count(), 1, `${url} has a single main heading`);
    assert.equal(await page.locator('link[rel="canonical"]').getAttribute("href"), `https://learnweb.cc${url}`);
    await noHorizontalOverflow(url);
    if (url.split("/").filter(Boolean).length === 3) {
      assert.equal(await page.locator('.static-quiz ol[type="A"]').count(), 2);
    }
  }
  await cleanAxe("static lesson mobile");
  pass("43 static pages load with canonical URLs, headings, quiz labels and mobile reflow");
  assert.deepEqual(errors, [], "no unhandled page errors");
  console.log(`\nAll UX checks passed (${engine}).`);
} finally {
  await browser.close();
}
