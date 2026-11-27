# Technical design: Change the main application title to My Tasks

## 1. Overview

Change the visible main application title from the repository's current `TodoMatic` text to exactly `My Tasks`. This is a text-only change: preserve the existing `<h1>` element, attributes, classes, layout, styling, task behavior, and all other visible copy.

## 2. Architecture changes

No architectural change is required. `App` continues to render the same static heading element and all state, props, task operations, filtering, and persistence remain unchanged.

## 3. Files to create or modify

| File | Action | Purpose |
|---|---|---|
| `src/App.jsx` | Modify | Replace the visible `<h1>` text `TodoMatic` with `My Tasks`, without changing surrounding JSX. |

No test files are deliverables. The repository has no declared test command or existing test suite, and adding test infrastructure would exceed the copy-only scope.

## 4. Implementation plan

1. In `src/App.jsx`, locate the `<h1>TodoMatic</h1>` returned by `App`.
2. Replace only `TodoMatic` with `My Tasks`, retaining `<h1>` and its exact position and formatting.
3. Do not modify `index.html`'s browser-tab metadata, CSS, child components, state, handlers, filters, task copy, or any other file.
4. Inspect the diff and confirm the only production code change is the heading text-node replacement.
5. If dependencies and tooling are available, build or run the application and perform section 8 verification; otherwise report runtime verification as unavailable because the snapshot declares no setup command and dependencies may not be installed.

## 5. Data model changes

None. No task fields, initial data, storage, state shape, or domain relationships change.

## 6. API design

None. The change introduces no endpoints or client-server calls; the title is static JSX rendered by the existing React application.

## 7. Error handling

No new runtime or HTTP errors are introduced. A heading that is absent or does not read exactly `My Tasks` is an acceptance failure; correct the literal change rather than adding fallback or error UI.

## 8. Testing strategy

1. **AC-1:** Open or render the application through its normal entry point and assert that the existing main `<h1>` is visible with exact text content `My Tasks` and that the visible heading no longer contains `TodoMatic`.
2. **AC-2:** Compare the updated screen to the baseline and verify the same `<h1>` occupies the same location with unchanged styling, layout, and semantics; no other visible text changes.
3. **AC-2:** Exercise the existing add, edit, complete, delete, and filter flows if runtime tooling is available, and verify behavior is unchanged.
4. **AC-2:** Review the source diff and assert `src/App.jsx` is the sole modified production file and the only change is `TodoMatic` → `My Tasks` in the `<h1>`.

## 9. Environment variables

None. This feature adds, consumes, or changes no environment variables.

## 10. Risks and mitigations

- **Wrong occurrence changed:** edit only the `<h1>` in `src/App.jsx` and review the one-line diff.
- **Unintended layout or semantics change:** preserve the existing `<h1>` element and surrounding JSX exactly.
- **Browser-tab title changed accidentally:** leave `app/index.html` and its `<title>TodoMatic</title>` unchanged because the requirement concerns the displayed main application title.
- **Intent/code wording mismatch:** the intent says the prior text is `Todo`, but the indexed and read source proves the visible heading is `TodoMatic`; the required final text remains unambiguous as `My Tasks`.
- **No automated verification:** the snapshot declares no test or setup command; use source-diff checks and runtime/manual verification when tooling is available without adding infrastructure.

## 11. Guidelines consulted

No relevant company guideline document was available. Searches run: “UI content changes headings application title wording” and “frontend accessibility and testing guidelines React user-visible text change”. The design still preserves the existing semantic heading and accessible structure and applies the exact requested wording, avoiding any interaction or layout change.

## 11. Out of scope

- Changing browser-tab/document `<title>` metadata in `index.html`.
- Changing task behavior, state, initial task data, or storage.
- Changing filters, forms, placeholders, counts, or any other visible wording.
- Changing CSS, layout, typography, spacing, responsiveness, or animation.
- Adding routes, APIs, dependencies, tests, or project configuration.
- Refactoring or reformatting unrelated code.
