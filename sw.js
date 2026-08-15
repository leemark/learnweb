const CACHE = "learnweb-2026-08-v5";
const CORE = [
  "/",
  "/offline.html",
  "/styles.css",
  "/static.css",
  "/app.js",
  "/curriculum.js",
  "/manifest.webmanifest",
  "/icon.svg",
  "/lab-runner.htm",
  "/learn/"
];

self.addEventListener("install", (event) => {
  // Deliberately no skipWaiting: the new worker waits until the page asks for
  // it (SKIP_WAITING), so an active learning session never mixes versions.
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => cache.addAll(CORE))
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE).then((cache) => cache.put(event.request, copy));
          }
          return response;
        })
        .catch(() =>
          caches.match(event.request)
            .then((cached) => cached || caches.match("/offline.html"))
        )
    );
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put(event.request, copy));
        }
        return response;
      })
      .catch(() =>
        caches.match(event.request).then((cached) => cached || Response.error())
      )
  );
});
