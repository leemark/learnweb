import { readFile } from "node:fs/promises";

const [html, css, js] = await Promise.all([
  readFile("index.html", "utf8"),
  readFile("styles.css", "utf8"),
  readFile("app.js", "utf8")
]);

const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]));
const duplicateIds = [...html.matchAll(/\sid="([^"]+)"/g)]
  .map((match) => match[1])
  .filter((id, index, all) => all.indexOf(id) !== index);
const localTargets = [...html.matchAll(/href="#([^"]+)"/g)].map((match) => match[1]);
const missingTargets = localTargets.filter((target) => !ids.has(target));
const required = [
  "<main",
  "<nav",
  "<h1",
  "skip-link",
  "prefers-reduced-motion",
  "showModal",
  "sandbox=\"allow-scripts\"",
  "lesson-dialog",
  "openLesson",
  "knowledge-check",
  "completeActiveLesson",
  "studio-workspace",
  "renderStudioWorkspace",
  "Submit studio artifact",
  "workspacesKey"
];
const corpus = `${html}\n${css}\n${js}`;
const missingRequired = required.filter((token) => !corpus.includes(token));

if (duplicateIds.length || missingTargets.length || missingRequired.length) {
  console.error({ duplicateIds, missingTargets, missingRequired });
  process.exit(1);
}

console.log(`Checks passed: ${ids.size} unique IDs, ${localTargets.length} local links, accessibility primitives present.`);
