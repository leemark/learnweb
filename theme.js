// Applies the learner's saved theme (or the system preference) before first
// paint. Loaded as a small blocking script on every page so nothing flashes
// in the wrong theme; app.js owns the toggle and uses the same storage key.
(() => {
  let theme = null;
  try {
    theme = JSON.parse(localStorage.getItem("learnweb-theme-v2"));
  } catch {
    // Storage blocked or unreadable: fall through to the system preference.
  }
  if (theme !== "paper" && theme !== "ink") {
    theme = matchMedia("(prefers-color-scheme: light)").matches ? "paper" : "ink";
  }
  document.documentElement.dataset.theme = theme;
  const themeColor = document.querySelector('meta[name="theme-color"]');
  if (themeColor) themeColor.content = theme === "paper" ? "#f2efe6" : "#0b0b0e";
})();
