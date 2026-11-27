import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import React from "react";
import { act, Simulate } from "react-dom/test-utils";
import { createRoot } from "react-dom/client";
import { JSDOM } from "jsdom";
import { createServer } from "vite";

const testsDirectory = path.dirname(fileURLToPath(import.meta.url));
const appRoot = path.resolve(testsDirectory, "..");
const baseCommit = "5318efde9e7c33403f067dac9c98f05d1123d7ee";
const tasks = [
  { id: "todo-0", name: "Eat", completed: true },
  { id: "todo-1", name: "Sleep", completed: false },
  { id: "todo-2", name: "Repeat", completed: false },
];

function installDom(dom) {
  for (const [name, value] of Object.entries({
    window: dom.window,
    document: dom.window.document,
    navigator: dom.window.navigator,
    HTMLElement: dom.window.HTMLElement,
    HTMLInputElement: dom.window.HTMLInputElement,
    Event: dom.window.Event,
    MouseEvent: dom.window.MouseEvent,
    Node: dom.window.Node,
    getComputedStyle: dom.window.getComputedStyle.bind(dom.window),
    requestAnimationFrame: (callback) => setTimeout(callback, 0),
    cancelAnimationFrame: (id) => clearTimeout(id),
    IS_REACT_ACT_ENVIRONMENT: true,
  })) {
    Object.defineProperty(globalThis, name, {
      configurable: true,
      writable: true,
      value,
    });
  }
  dom.window.HTMLElement.prototype.attachEvent = function attachEvent() {};
  dom.window.HTMLElement.prototype.detachEvent = function detachEvent() {};
}

async function serverForRender() {
  return createServer({
    root: appRoot,
    server: { middlewareMode: true },
    appType: "custom",
  });
}

async function renderEntryPoint(server) {
  const dom = new JSDOM("<!doctype html><div id='root'></div>", {
    url: "http://localhost/",
  });
  installDom(dom);
  await server.ssrLoadModule("/src/main.jsx?entry-point-test");
  await new Promise((resolve) => setTimeout(resolve, 25));
  return dom;
}

async function renderComponent(server, modulePath, css = "") {
  const dom = new JSDOM(`<!doctype html><style>${css}</style><div id='root'></div>`, {
    url: "http://localhost/",
  });
  installDom(dom);
  const { default: App } = await server.ssrLoadModule(modulePath);
  await act(async () => {
    createRoot(dom.window.document.getElementById("root")).render(
      React.createElement(App, { tasks }),
    );
  });
  return dom;
}

function normalizedSnapshot(dom) {
  return dom.window.document.getElementById("root").innerHTML.replace(
    "My Tasks",
    "TodoMatic",
  );
}

function headingStyle(dom) {
  const style = dom.window.getComputedStyle(dom.window.document.querySelector("h1"));
  return {
    display: style.display,
    marginBottom: style.marginBottom,
    maxWidth: style.maxWidth,
    textAlign: style.textAlign,
  };
}

test("AC-1: normal entry point renders the visible main h1 with exact My Tasks text", async () => {
  const server = await serverForRender();
  try {
    const dom = await renderEntryPoint(server);
    const heading = dom.window.document.querySelector("h1");
    assert.ok(heading);
    assert.equal(heading.textContent, "My Tasks");
    assert.doesNotMatch(heading.textContent, /TodoMatic/);
    assert.equal(heading, dom.window.document.querySelector(".todoapp").firstElementChild);
  } finally {
    await server.close();
  }
});

test("AC-2: rendered screen preserves baseline structure, visible copy, styles, and layout position", async () => {
  const baselineSource = execFileSync("git", ["show", `${baseCommit}:src/App.jsx`], {
    cwd: appRoot,
    encoding: "utf8",
  });
  const baselinePath = path.join(testsDirectory, `.baseline-App-${process.pid}.jsx`);
  writeFileSync(
    baselinePath,
    baselineSource.replaceAll('from "./components/', 'from "../src/components/'),
  );
  const server = await serverForRender();

  try {
    const css = readFileSync(path.join(appRoot, "src", "index.css"), "utf8");
    const current = await renderComponent(server, "/src/App.jsx?screen=current", css);
    const baseline = await renderComponent(
      server,
      `/tests/${path.basename(baselinePath)}`,
      css,
    );
    const currentHeading = current.window.document.querySelector("h1");
    const baselineHeading = baseline.window.document.querySelector("h1");

    assert.equal(normalizedSnapshot(current), normalizedSnapshot(baseline));
    assert.deepEqual(headingStyle(current), headingStyle(baseline));
    assert.equal(currentHeading.parentElement.className, baselineHeading.parentElement.className);
    assert.equal(
      [...currentHeading.parentElement.children].indexOf(currentHeading),
      [...baselineHeading.parentElement.children].indexOf(baselineHeading),
    );
    assert.equal(currentHeading.tagName, baselineHeading.tagName);
    assert.equal(current.window.document.querySelectorAll("h1").length, 1);
  } finally {
    await server.close();
    rmSync(baselinePath, { force: true });
  }
});

test("AC-2: rendered add, edit, complete, delete, and filter behavior is preserved", async () => {
  const server = await serverForRender();
  try {
    const dom = await renderComponent(server, "/src/App.jsx?flows=current");
    const { document } = dom.window;
    const click = (element) => act(() => {
      element.dispatchEvent(new dom.window.MouseEvent("click", { bubbles: true }));
    });
    const input = (element, value) => act(() => {
      Object.getOwnPropertyDescriptor(
        dom.window.HTMLInputElement.prototype,
        "value",
      ).set.call(element, value);
      Simulate.change(element, { target: { value } });
    });
    const buttonContaining = (text, scope = document) =>
      [...scope.querySelectorAll("button")].find((button) =>
        button.textContent.includes(text),
      );

    input(document.querySelector("#new-todo-input"), "New task");
    click(document.querySelector('form button[type="submit"]'));
    assert.equal(document.querySelectorAll("li.todo").length, 4);

    const newTask = [...document.querySelectorAll("li.todo")].find((item) =>
      item.textContent.includes("New task"),
    );
    click(buttonContaining("Edit", newTask));
    input(newTask.querySelector('input[type="text"]'), "Updated task");
    click(newTask.querySelector('button[type="submit"]'));

    const updatedTask = [...document.querySelectorAll("li.todo")].find((item) =>
      item.textContent.includes("Updated task"),
    );
    click(updatedTask.querySelector('input[type="checkbox"]'));
    click(buttonContaining("Active"));
    assert.equal(document.body.textContent.includes("Updated task"), false);

    click(buttonContaining("Completed"));
    assert.equal(document.querySelectorAll("li.todo").length, 2);
    const completedTask = [...document.querySelectorAll("li.todo")].find((item) =>
      item.textContent.includes("Updated task"),
    );
    click(buttonContaining("Delete", completedTask));
    assert.equal(document.querySelectorAll("li.todo").length, 1);

    click(buttonContaining("All"));
    assert.equal(document.querySelectorAll("li.todo").length, 3);
  } finally {
    await server.close();
  }
});
