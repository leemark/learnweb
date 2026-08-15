import { chromium } from "playwright";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
await page.goto("http://127.0.0.1:4173/", { waitUntil: "networkidle" });
const state = await page.evaluate(() => {
  const details = document.querySelector(".nav-details");
  const nav = details.querySelector("nav");
  const header = document.querySelector(".site-header");
  const a = nav.querySelector("a");
  return {
    headerGrid: getComputedStyle(header).gridTemplateColumns,
    detailsRect: details.getBoundingClientRect().width,
    navWidth: getComputedStyle(nav).width,
    navRect: nav.getBoundingClientRect().width,
    aRect: a.getBoundingClientRect().width,
    aDisplay: getComputedStyle(a).display,
    detailsChildren: [...details.children].map((c) => ({ tag: c.tagName, w: c.getBoundingClientRect().width }))
  };
});
console.log(JSON.stringify(state, null, 2));
await browser.close();
