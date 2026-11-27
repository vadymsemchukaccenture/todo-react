# Test results

## Summary
Passed: 7 | Failed: 0 | Skipped: 0 | Duration: not reported by the spec reporter

Commands run from `app/`:
- `node --test --test-reporter=spec --test-concurrency=1 tests/*.test.mjs`
- `npm run build`
- `npm run lint`

## Test cases
| Test | Status | New/Updated/Existing | Description |
|---|---|---|---|
| `AC-1: the main h1 reads exactly My Tasks and not TodoMatic` | PASS | Existing QA probe | Checks the exact heading literal and removal of the old literal. |
| `AC-2: only the visible h1 text changed in App.jsx` | PASS | Existing QA probe | Whole-file source comparison against the baseline. |
| `AC-2: the browser title remains unchanged` | PASS | Existing QA probe | Confirms the browser-tab title remains `TodoMatic`. |
| `AC-2: src/App.jsx is the only changed production file` | PASS | Updated | Confirms production-file scope is limited to `src/App.jsx`. |
| `AC-1: normal entry point renders the visible main h1 with exact My Tasks text` | PASS | New | Loads `src/main.jsx` through Vite into JSDOM and checks the rendered semantic heading. |
| `AC-2: rendered screen preserves baseline structure, visible copy, styles, and layout position` | PASS | New | Renders baseline/current components and compares normalized DOM, heading style, tag, parent, and position. |
| `AC-2: rendered add, edit, complete, delete, and filter behavior is preserved` | PASS | New | Exercises the existing interaction flows through rendered React controls. |

## Regression report
| Existing test | Result | Classification | Notes |
|---|---|---|---|
| No pre-existing test suite was present | N/A | PRE-EXISTING | No baseline file or declared project test command exists. |

## Coverage areas
- AC-1 exact `My Tasks` copy and absence of `TodoMatic` from the main heading.
- AC-1 normal-entry-point React rendering of the semantic main heading.
- AC-2 unchanged rendered structure, visible copy, computed heading styles, and heading location against baseline.
- AC-2 rendered add/edit/complete/delete/filter flows.
- AC-2 unchanged browser-title source and production-file scope.
- Build and lint gates.

## Implementation bugs found
None

## Non-blocking observations
- [note] No system Chromium runtime was available because required shared OS libraries could not be installed; render-level browser-semantics and visual-source preservation are covered with Vite plus JSDOM rather than a real-browser screenshot.
- [note] Runtime test dependencies were installed with `--no-save`; package metadata and production files remain unchanged.

A = 0
B = 0
All 7 copy-only, render-level, and interaction tests pass; build and lint are clean.
APPROVED
