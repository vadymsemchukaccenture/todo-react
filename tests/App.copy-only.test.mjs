import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const testsDirectory = path.dirname(fileURLToPath(import.meta.url));
const appRoot = path.resolve(testsDirectory, "..");
const baseCommit = "5318efde9e7c33403f067dac9c98f05d1123d7ee";

function readAppFile() {
  return readFileSync(path.join(appRoot, "src", "App.jsx"), "utf8");
}

function readBaseFile(relativePath) {
  return execFileSync("git", ["show", `${baseCommit}:${relativePath}`], {
    cwd: appRoot,
    encoding: "utf8",
  });
}

test("AC-1: the main h1 reads exactly My Tasks and not TodoMatic", () => {
  const source = readAppFile();
  const headingMatches = [...source.matchAll(/<h1(?:\s[^>]*)?>(.*?)<\/h1>/gs)];

  assert.equal(headingMatches.length, 1, "the application must contain one h1");
  assert.equal(headingMatches[0][1], "My Tasks");
  assert.doesNotMatch(headingMatches[0][1], /TodoMatic/);
});

test("AC-2: only the visible h1 text changed in App.jsx", () => {
  const baseline = readBaseFile("src/App.jsx");
  const expected = baseline.replace(
    "<h1>TodoMatic</h1>",
    "<h1>My Tasks</h1>",
  );

  assert.notEqual(expected, baseline, "the baseline heading must be present");
  assert.equal(readAppFile(), expected);
});

test("AC-2: the browser title remains unchanged", () => {
  const baseline = readBaseFile("index.html");
  const current = readFileSync(path.join(appRoot, "index.html"), "utf8");
  const baselineTitle = baseline.match(/<title>(.*?)<\/title>/s)?.[1];
  const currentTitle = current.match(/<title>(.*?)<\/title>/s)?.[1];

  assert.equal(currentTitle, baselineTitle);
  assert.equal(currentTitle, "TodoMatic");
});

test("AC-2: src/App.jsx is the only changed production file", () => {
  const changedFiles = execFileSync(
    "git",
    ["diff", "--name-only", `${baseCommit}...HEAD`],
    { cwd: appRoot, encoding: "utf8" },
  )
    .trim()
    .split("\n")
    .filter(Boolean)
    .filter(
      (file) =>
        file.startsWith("src/") ||
        file.startsWith("public/") ||
        ["index.html", "package.json", "vite.config.js"].includes(file),
    );

  assert.deepEqual(changedFiles, ["src/App.jsx"]);
});
