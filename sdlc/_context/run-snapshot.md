# Run snapshot

- repo: vadymsemchukaccenture/todo-react
- base branch: main
- base commit: 5318efde9e7c33403f067dac9c98f05d1123d7ee
- work branch: sdlc/run/9409a70f-2934-44c0-ab12-c5d2637edc07
- stack: node
- test command: (none declared; the target repo can declare one in .sdlc/project.yaml) (run from `app/`)
- target repo is checked out under `app/`; SDLC artefacts go to `sdlc/`
- design paths are relative to the target repo: `app/` + path in the work dir (read_file accepts both)

## Project commands

- no setup declared: dependencies are NOT installed and tooling may be missing. Do not spend turns hunting for a linter or test runner; say in your report that you could not verify.
- build/lint gate run by the pipeline after each Coder pass: none declared

## Files
- app/.editorconfig
- app/.eslintrc.cjs
- app/.github/CODEOWNERS
- app/.github/ISSUE_TEMPLATE/bug.yml
- app/.github/ISSUE_TEMPLATE/config.yml
- app/.github/PULL_REQUEST_TEMPLATE.md
- app/.github/workflows/auto-merge.yml
- app/.github/workflows/deploy.yml
- app/.gitignore
- app/.nvmrc
- app/CODE_OF_CONDUCT.md
- app/CONTRIBUTING.md
- app/LICENSE
- app/README.md
- app/REVIEWING.md
- app/SECURITY.md
- app/index.html
- app/package.json
- app/public/vite.svg
- app/src/App.jsx
- app/src/components/FilterButton.jsx
- app/src/components/Form.jsx
- app/src/components/Todo.jsx
- app/src/index.css
- app/src/main.jsx
- app/vite.config.js
- app/yarn.lock
