// shots.mjs — capture screenshots for visual review. Run: node shots.mjs
import { chromium } from "playwright";

const base = "http://127.0.0.1:4173";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

await page.goto(base, { waitUntil: "networkidle" });
await page.screenshot({ path: "shot-home.png", fullPage: false });
await page.evaluate(() => document.querySelector("#paths").scrollIntoView());
await page.waitForTimeout(500);
await page.screenshot({ path: "shot-paths.png" });

await page.goto(`${base}/learn/platform/html-that-works-harder/`, { waitUntil: "networkidle" });
await page.screenshot({ path: "shot-lesson.png", fullPage: true });

await page.goto(`${base}/learn/`, { waitUntil: "networkidle" });
await page.screenshot({ path: "shot-hub.png", fullPage: false });

await browser.close();
console.log("screenshots saved");
