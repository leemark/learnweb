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

// Decoded request path, or null when the URL is malformed (e.g. "/%").
function requestPath(request) {
  try {
    return decodeURIComponent(new URL(request.url, "http://localhost").pathname);
  } catch {
    return null;
  }
}

// Map a request path onto a file inside `base`, or null if it would escape
// `base` (e.g. "/..%2f..%2fsecret", which the URL parser leaves encoded).
function fileInside(base, pathname, indexFile) {
  const file = path.join(base, pathname === "/" ? indexFile : pathname.slice(1));
  const relative = path.relative(base, file);
  if (relative === ".." || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) return null;
  return file;
}

function badRequest(response) {
  response.writeHead(400, { "content-type": "text/plain; charset=utf-8" });
  response.end("bad request");
}

createServer(async (request, response) => {
  const pathname = requestPath(request);
  if (pathname === null) return badRequest(response);
  try {
    let file = fileInside(root, pathname, "index.html");
    if (!file) throw new Error("outside root");
    let fileStat;
    try {
      fileStat = await stat(file);
    } catch {
      const fallback = fileInside(path.join(root, "public"), pathname, "index.html");
      if (!fallback) throw new Error("outside public");
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

// Second origin on port+1: the preview runner must be cross-origin from the
// app even in local development, so a learner's while(true) can never freeze
// the app's own main thread.
createServer((request, response) => {
  const pathname = requestPath(request);
  if (pathname === null) return badRequest(response);
  const file = fileInside(root, pathname, "lab-runner.htm");
  (file ? stat(file) : Promise.reject(new Error("outside root")))
    .then((fileStat) => {
      if (!fileStat.isFile()) throw new Error("not a file");
      return readFile(file).then((contents) => {
        response.writeHead(200, {
          "content-type": types[path.extname(file)] || "application/octet-stream",
          "cache-control": "no-store"
        });
        response.end(contents);
      });
    })
    .catch(() => {
      response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
      response.end("not found");
    });
}).listen(port + 1, "127.0.0.1", () => {
  console.log(`Preview runner origin: http://127.0.0.1:${port + 1}`);
});
