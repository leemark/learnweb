import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const port = Number(process.env.PORT || 4173);
const types = {
  ".html": "text/html; charset=utf-8",
  ".htm": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".webmanifest": "application/manifest+json",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8"
};

createServer(async (request, response) => {
  try {
    const url = new URL(request.url, `http://${request.headers.host}`);
    const pathname = decodeURIComponent(url.pathname);
    let file = path.join(root, pathname === "/" ? "index.html" : pathname.slice(1));
    let fileStat;
    try {
      fileStat = await stat(file);
    } catch {
      const fallback = path.join(root, "public", pathname === "/" ? "index.html" : pathname.slice(1));
      const fallbackStat = await stat(fallback);
      file = fallbackStat.isDirectory() ? path.join(fallback, "index.html") : fallback;
      fileStat = await stat(file);
    }
    if (fileStat.isDirectory()) file = path.join(file, "index.html");
    response.writeHead(200, {
      "content-type": types[path.extname(file)] || "application/octet-stream",
      "cache-control": "no-store"
    });
    response.end(await readFile(file));
  } catch {
    response.writeHead(404, { "content-type": "text/html; charset=utf-8" });
    response.end(await readFile(path.join(root, "index.html")));
  }
}).listen(port, "127.0.0.1", () => {
  console.log(`Local URL: http://127.0.0.1:${port}`);
});
