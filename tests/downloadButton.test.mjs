import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import test from "node:test";
import vm from "node:vm";
import React from "react";
import { act, create } from "react-test-renderer";
import ts from "typescript";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;
const require = createRequire(import.meta.url);
const source = readFileSync(new URL("../src/components/DownloadButton.tsx", import.meta.url), "utf8");
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
}).outputText;

for (const failure of ["network", "http", "body"]) {
  test(`download recovers from ${failure} failure and permits retry`, async () => {
    let fail = true;
    let downloads = 0;
    const alerts = [];
    const exports = {};
    const state = { input: "hello", prompt: "calm", voice: "alloy", latestAudioUrl: null };
    const context = {
      exports,
      require: (name) => {
        if (name === "./ui/Icons") return { Download: () => null };
        if (name === "./ui/Button") return { Button: (props) => React.createElement("button", props) };
        if (name === "@/lib/store") return { appStore: { useState: (select) => select(state), getState: () => state } };
        return require(name);
      },
      navigator: {},
      FormData,
      crypto: { randomUUID: () => "test-generation" },
      URL: { createObjectURL: () => "blob:audio", revokeObjectURL: () => {} },
      document: {
        createElement: () => ({ click: () => downloads++ }),
        body: { appendChild: () => {}, removeChild: () => {} },
      },
      fetch: async () => {
        if (fail && failure === "network") throw new Error("offline");
        return {
          ok: !(fail && failure === "http"),
          status: 500,
          blob: async () => {
            if (fail && failure === "body") throw new Error("interrupted body");
            return new Blob(["audio"]);
          },
        };
      },
      alert: (message) => alerts.push(message),
      console: { error: () => {} },
    };
    vm.runInNewContext(compiled, context);
    let renderer;
    try {
      await act(async () => { renderer = create(React.createElement(exports.default)); });
      await act(async () => { await renderer.root.findByType("button").props.onClick(); });
      assert.equal(downloads, 0, "an error must not be saved as audio");
      assert.equal(renderer.root.findByType("button").props.disabled, false);
      assert.equal(alerts.length, 1);
      fail = false;
      await act(async () => { await renderer.root.findByType("button").props.onClick(); });
      assert.equal(downloads, 1);
      assert.equal(renderer.root.findByType("button").props.disabled, false);
    } finally {
      if (renderer) await act(async () => renderer.unmount());
    }
  });
}
