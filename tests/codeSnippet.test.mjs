import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { test } from "node:test";
import vm from "node:vm";
import ts from "typescript";

const compiled = ts.transpileModule(
  readFileSync(new URL("../src/lib/codeSnippet.ts", import.meta.url), "utf8"),
  { compilerOptions: { module: ts.ModuleKind.CommonJS } }
);
const context = { exports: {} };
vm.runInNewContext(compiled.outputText, context);
const { getCodeSnippet } = context.exports;

test("curl snippet preserves apostrophes and literal shell syntax", () => {
  const input = "It's a test: $(printf injected) 'quoted'";
  const prompt = "Don't change the speaker's words.\nUse a calm voice.";
  const snippet = getCodeSnippet("curl", { input, prompt, voice: "alloy" });
  // Shell functions capture the payload without sending a request or playing audio.
  const script = `
curl() {
  while [ "$#" -gt 0 ]; do
    if [ "$1" = "-d" ]; then printf '%s' "$2"; return; fi
    shift
  done
}
ffplay() { cat; }
${snippet}`;
  const result = spawnSync(process.env.BASH || "bash", ["-s"], {
    input: script, encoding: "utf8",
  });
  assert.equal(result.status, 0, result.error?.message || result.stderr);
  assert.deepEqual(JSON.parse(result.stdout), {
    model: "gpt-4o-mini-tts", voice: "alloy", input, instructions: prompt,
    response_format: "wav",
  });
});
