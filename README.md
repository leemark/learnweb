# learn.web

A free, project-based field guide to the modern web, updated for August 2026.

## What this is

- **Six paths, thirty-six studio lessons**: Web Foundations, Modern Web Platform,
  UX & Product Design, Accessibility, Search & AI Discovery, and AI Product Engineering
- Every lesson is built around an artifact and a definition of done — read less, make more
- Interactive studio workspaces, a sandboxed HTML/CSS/JavaScript lab, knowledge checks,
  local progress, field notes, and a My Studio section (artifacts, backups, certificate)
- Every lesson also exists as a static, shareable, indexable page under `/learn/`

## What changed in v3

- Static lesson, path, and hub pages (`/learn/…`) with JSON-LD, canonical URLs, and
  per-path social images
- New **Web Foundations** on-ramp path plus a placement check ("where should I start?")
- Two-question knowledge checks and hints in code workspaces
- **My Studio**: submitted artifacts, progress backups (export/import JSON), printable certificate
- Atom feed (`/feed.xml`) and changelog dialog
- About & privacy disclosure: GA4 loads after the initial render for aggregate
  page-view measurement; learner notes, code, and artifacts remain local
- Content CC BY 4.0, code MIT

## Run locally

```sh
npm start
```

Open `http://127.0.0.1:4173`. Static pages, sitemap, feed, and OG images are
regenerated automatically before start (via `npm run generate`).

## Validate

```sh
npm run check   # HTML/CSS/JS invariants + curriculum data integrity (36 lessons, quizzes, slugs, workspaces)
npm run build   # generates assets and emits dist/
```

## License

Content is licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
Code is MIT. See `LICENSE`.
