export default {
  async fetch(request, env) {
    if (env?.ASSETS?.fetch) {
      return env.ASSETS.fetch(request);
    }

    return new Response(
      "<!doctype html><title>learn.web</title><main><h1>learn.web</h1><p>The site assets are not connected yet.</p></main>",
      {
        status: 503,
        headers: {
          "content-type": "text/html; charset=utf-8",
          "cache-control": "no-store"
        }
      }
    );
  }
};
