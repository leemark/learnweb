# learn.web — Growth & Learner-Value PRD

Version: 3.0.0 · Status: In implementation · Author: Mark Lee

## 1. Vision

Make learn.web the first resource people find when they want to *become* a modern web
maker — discovered by search, shared between learners, and structured so that complete
beginners and working practitioners both leave with proof of capability.

## 2. Goals

| Goal | How we measure it |
| --- | --- |
| Discoverable | Every lesson indexable at its own URL; rich results for course queries; sitemap covers all pages |
| Beginner-inclusive | A Foundations on-ramp path plus a placement check so new learners start in the right place |
| Shareable | Stable per-lesson URLs, per-path social cards, artifact share text, backup export |
| Returnable | Atom feed + changelog so "living curriculum" updates reach people who already visited |
| Trustworthy | Open license, about/contribute section, explicit how-it-stays-current statement |
| Deeper learning | Two-question knowledge checks with explanations, hints in code workspaces |
| Ownable | A My Studio section: artifacts, certificate, local-first backups |

## 3. Non-goals (v3)

- Accounts, logins, or server-side progress sync (privacy is a feature)
- Video lessons or hosted discussions (links to GitHub Discussions instead)
- Server-rendered app (static pages are generated at build time)
- True spaced-repetition scheduler (simple "review" affordances only)

## 4. Feature specifications

### 4.1 Static lesson, path, and hub pages (P0 — SEO + sharing)

- `generate.mjs` emits, from a shared `curriculum.js` data module:
  - `/learn/` — hub listing all paths and lessons
  - `/learn/<path>/` — path page (course overview + module list)
  - `/learn/<path>/<slug>/` — full lesson content, prev/next paging, breadcrumbs
- Each page: canonical URL, meta description, per-path OG image, JSON-LD
  (`LearningResource` per lesson with `teaches`, `timeRequired`, `educationalLevel`;
  `Course` per path).
- Homepage gains `WebSite` + `Course` JSON-LD, `og:url`, feed `<link>`.
- Sitemap regenerated with all URLs; `noscript` copy points to `/learn/`.
- Acceptance: every lesson URL returns 200 with the lesson body crawlable; no
  duplicate-tag or broken-internal-link warnings from a validator pass.

### 4.2 Foundations path (P0 — beginner on-ramp)

- Sixth path, `Web Foundations`, 6 lessons (how the web works, browser as studio,
  HTML, CSS, JavaScript, first-artifact capstone).
- Full parity with existing paths: guides, studio missions, workspaces
  (record lenses for lessons 1–2, code starters for lessons 3–6), quizzes.
- Homepage gets a 6th path card; totals become 36 lessons.
- Acceptance: `npm run check` validates the new path with the same data-integrity
  rules as all other paths.

### 4.3 Placement check (P1)

- 4-question dialog ("Where should I start?") recommending one of the six paths.
- Scored by vote; ties resolve in curriculum order.
- Entry points: paths section heading link + search ("where should I start").
- Acceptance: any answer set opens a path dialog within one click.

### 4.4 Richer knowledge checks (P1)

- Every lesson has exactly 2 questions (data validated in `check.mjs`).
- Each question renders as its own fieldset with inline feedback; "Check answers"
  evaluates all; completion gate requires all correct.
- Acceptance: gate stays locked until both questions are answered correctly.

### 4.5 Code workspace hints (P2)

- `hints` data keyed by path/lesson for code workspaces; rendered as an
  always-safe `<details>Need a hint?</details>` under the workspace actions.
- Acceptance: hint present for all 10 code lessons, absent elsewhere.

### 4.6 My Studio section (P1 — portfolio & return value)

- Homepage section `#studio`: per-path submitted artifacts, open/export/share per
  artifact, lesson-complete counts.
- Backup tools: export all (JSON bundle of progress + notes + workspaces),
  import from file, with shape validation.
- Certificate: when all 36 lessons complete, "Claim your certificate" opens a
  printable certificate (name stored locally, print CSS isolates the page).
- Acceptance: completing one lesson's artifact and exporting/reimporting round-trips
  with no data loss.

### 4.7 Feed + changelog (P1 — return loop)

- `changelog` array in `curriculum.js`; rendered into a changelog dialog; emitted as
  `feed.xml` (Atom) by `generate.mjs`; `<link rel="alternate">` in head.
- Footer gains About / Updates / Source / License links.
- Acceptance: feed validates as Atom XML with ≥1 entry; changelog dialog renders.

### 4.8 Trust & license (P2)

- `LICENSE` file (content CC BY 4.0, code MIT), footer + About dialog mention it.
- About dialog: method, how content stays current, contribution path (GitHub repo,
  issues/discussions), no-tracking privacy note.

### 4.9 Performance & meta hygiene (P2)

- New generated `og.png` + `og-<path>.png` at 1200×630 (target < 50 KB each),
  replacing the 1.6 MB asset; add `og:image:width/height`, `og:url`.
- Keyword-aware title/description on homepage while preserving brand.
- Acceptance: total image payload of the homepage below 100 KB.

## 5. Architecture decisions

- `curriculum.js` becomes the single source of truth (data + slugs + changelog),
  imported by `app.js`, `generate.mjs`, and `check.mjs`; `build.mjs` copies it to
  `dist/client/`.
- Generated pages live under `public/learn/` (already copied by `build.mjs`), so the
  dev server serves them without changes.
- PNG generation is dependency-free: a minimal PNG encoder (zlib + CRC32) with a
  5×7 bitmap font and geometric symbol rasterization.
- No new runtime dependencies; no backend.

## 6. Risks

- Quiz data restructure could break the completion gate → covered by `check.mjs`
  invariants + manual gate test.
- Lesson URLs must survive renaming → slugs derived from module titles; renames
  change URLs (acceptable pre-1.0 growth; noted in changelog).
- Generated OG images are plain by design → consistent with brand, verified by size
  and visual review before ship.
