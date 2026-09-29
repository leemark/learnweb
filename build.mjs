import { cp, mkdir, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const dist = path.join(root, "dist");
const client = path.join(dist, "client");
const publicFiles = [
  "index.html",
  "styles.css",
  "static.css",
  "lab-runner.htm",
  "offline.html",
  "about.html",
  "404.html",
  "app.js",
  "curriculum.js",
  "manifest.webmanifest",
  "icon.svg",
  "sw.js",
  "robots.txt",
  "sitemap.xml",
  "feed.xml"
];

await rm(dist, { recursive: true, force: true });
await mkdir(path.join(dist, "server"), { recursive: true });
await mkdir(client, { recursive: true });

for (const file of publicFiles) {
  await cp(path.join(root, file), path.join(client, file));
}

await cp(path.join(root, "worker.mjs"), path.join(dist, "server", "index.js"));

if (existsSync(path.join(root, "public"))) {
  await cp(path.join(root, "public"), client, { recursive: true });
}

if (existsSync(path.join(root, ".openai", "hosting.json"))) {
  await mkdir(path.join(dist, ".openai"), { recursive: true });
  await cp(path.join(root, ".openai", "hosting.json"), path.join(dist, ".openai", "hosting.json"));
}

console.log(`Built ${publicFiles.length} client files, the server worker, and static pages in ${dist}`);
