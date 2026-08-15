# learn.web — Reconciled QA Backlog

Sources: `learnweb-qa-audit-2026-08-14.md` (authoritative audit) and
`learnweb-priority-backlog-2026-08-14.md` (initial inventory). Baseline:
`main` at `e7891a87390be31fdae506265a68f077cff3da0b`.

## Reconciliation

The backlog is treated as the task inventory. The audit is authoritative for
facts. Items from the audit that were **missing from the backlog** are added
below with their audit IDs:

| New ID | Audit ref | Finding | Action |
|---|---|---|---|
| NOTES-001 | P1-02 | Lesson-note autosave reads `event.currentTarget` after dispatch; notes can fail to save and emit a console error | Capture value synchronously; flush on close/pagehide/export; report real write status |
| STATIC-001 | P2-04 | `static.css` uses undefined `--font-mono`; `.wordmark i` selector targets markup that is a `<span>` | Define `--font-mono` in `:root`; align selector with generated markup |
| STATIC-002 | P2-05 | Static quiz summaries expose the correct answer letter before reveal | Move answer label inside the expanded content |
| SEC-001 | §9 | Certificate print button uses inline `onclick` | Move handler into `app.js` |
| SEC-002 | §9 | Workspace preview escapes `</script` but not `</style`; learner CSS can break out of the style element | Escape `</style` in preview CSS; keep escaping consistent in both runners |
| LAB-001* | §6.3, §9 | Sync infinite loops in a same-origin frame freeze the shared main thread; no true isolation exists in-origin | Production now uses a cross-origin static runner with manual Run, Stop/reload, and heartbeat recovery; local development uses the checked-in runner |
| TRUST-004* | P2-08 | Certificate date is the open date, not the completion date | Persist completion timestamp at award time |

\* Already in backlog; listed for completeness of the P0 work order.

## Work order (small, testable commits)

### P0 — release blockers

1. **FUNC-001** — wire every duplicate control (`data-open-placement`,
   `data-export-backup`, `data-import-backup`, `data-open-changelog`,
   `data-open-certificate`) via `querySelectorAll`; per-location status
   announcement; test clicks every visible instance.
2. **NOTES-001** — synchronous value capture, flush on close/pagehide/export,
   truthful "Saved" status.
3. **A11Y-001** — editor Tab escape: Tab navigates by default; explicit
   "Tab inserts spaces" mode; Escape exits mode; visible instruction; tests.
4. **LAB-002** — remove `allow-modals` from both preview frames.
5. **LAB-001** — production cross-origin runner, manual run mode, Stop/reload
   preview, heartbeat watchdog, no auto-run while busy; tests for
   modal/syntax/alert cases.
6. **PRIV-001** — publish accurate privacy/analytics model: About & privacy
   dialog (GA4, fonts, local-only learner data), copy and docs alignment,
   changelog entry.
7. **STATIC-001/002, SEC-001/002, A11Y-008** — generated-page CSS/markup
   fixes, hidden answer letters, no inline handlers, `</style` escaping.

### P1 — high impact (next batches)

Persistence (DATA-001…005, TRUST-004) → Service worker (SW-001…003) →
Navigation/UX (UX-001…004) → Accessibility (A11Y-002…004, SEARCH-001/004,
A11Y-005) → Content/dates (CONTENT-001…004) → Trust/discovery
(TRUST-001/002, SEO-002…005, SCHEMA-001/002) → QA gates (QA-001…007).

### Not before P0/P1 resolve

All P2/P3 enhancements, including UX-005…008, SEARCH-002/003, CONTENT-006…008,
AEO-001…004, PERF-002…006, PWA-001, ANALYTICS-001…004, QA-008…010, REPO-001/002.

## Environment notes (QA-006, SW-003, AEO-003)

- The infinite-loop isolation test verifies the cross-origin runner mechanism in
  every engine; the live-freeze assertion runs only where the environment
  process-isolates iframes (this headless setup does not). Real desktop/mobile
  browsers isolate cross-origin frames, so production behavior is covered.
- Firefox's offline emulation does not block loopback; WebKit's service worker
  resolves cache-miss fallbacks unreliably in Playwright's build. Chromium runs
  the full offline contract; the other engines run the rest of the suite.
- Service-worker update detection (waiting-worker banner) is browser machinery
  that cannot be forced from a test; the banner wiring and dismissal are tested,
  and the updatefound handler path is structurally verified by check.mjs.
