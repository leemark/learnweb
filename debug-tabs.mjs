import { chromium } from "playwright";
const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto("http://127.0.0.1:4173/", { waitUntil: "networkidle" });
const state = await page.evaluate(() => {
  const pane = document.querySelector(".editor-pane");
  const panel = document.querySelector("#panel-html");
  const editor = document.querySelector('[data-editor="html"]');
  const actions = document.querySelector(".editor-actions");
  const stage = document.querySelector(".playground-stage");
  return {
    stage: stage.getBoundingClientRect().height,
    pane: pane.getBoundingClientRect().height,
    panel: panel.getBoundingClientRect().height,
    panelDisplay: getComputedStyle(panel).display,
    editor: editor.getBoundingClientRect().height,
    actions: actions.getBoundingClientRect().height,
    paneChildren: [...pane.children].map((child) => ({ cls: child.className, h: child.getBoundingClientRect().height }))
  };
});
console.log(JSON.stringify(state, null, 2));
await browser.close();
