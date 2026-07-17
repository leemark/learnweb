import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const dist = path.join(root, "dist");
const publicFiles = [
  "index.html",
  "styles.css",
  "app.js",
  "manifest.webmanifest",
  "icon.svg",
  "sw.js",
  "robots.txt",
  "sitemap.xml"
];

await rm(dist, { recursive: true, force: true });
await mkdir(path.join(dist, "server"), { recursive: true });

for (const file of publicFiles) {
  await cp(path.join(root, file), path.join(dist, file));
}

await cp(path.join(root, "index.html"), path.join(dist, "404.html"));
await cp(path.join(root, "worker.mjs"), path.join(dist, "server", "index.js"));

if (existsSync(path.join(root, "public"))) {
  await cp(path.join(root, "public"), dist, { recursive: true });
}

if (existsSync(path.join(root, ".openai", "hosting.json"))) {
  await mkdir(path.join(dist, ".openai"), { recursive: true });
  await cp(path.join(root, ".openai", "hosting.json"), path.join(dist, ".openai", "hosting.json"));
}

const html = await readFile(path.join(dist, "index.html"), "utf8");
await writeFile(path.join(dist, "index.html"), html.replace('href="/', 'href="/'));

console.log(`Built ${publicFiles.length + 3} deployable files in ${dist}`);
