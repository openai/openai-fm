import { Block } from "./Block";
import CodeMirror from "@uiw/react-codemirror";
import { EditorView } from "@codemirror/view";
import { python } from "@codemirror/lang-python";
import { javascript } from "@codemirror/lang-javascript";
import { createTheme } from "@uiw/codemirror-themes";
import { tags as t } from "@lezer/highlight";
import s from "./DevMode.module.css";
import { appStore } from "@/lib/store";
import { getCodeSnippet } from "../../lib/codeSnippet";
import clsx from "clsx";

const fmTheme = createTheme({
  theme: "light",
  settings: {
    background: "transparent",
    backgroundImage: "",
    foreground: "#222",
    caret: "#5d00ff",
    selection: "#FF4A0033",
    selectionMatch: "#FF4A0033",
    lineHighlight: "#8a91991a",
    gutterBackground: "transparent",
    gutterForeground: "transparent",
  },
  styles: [
    { tag: t.comment, color: "#66666699" },
    { tag: t.variableName, color: "#171717" },
    { tag: [t.string, t.special(t.brace)], color: "#C58041" },
    { tag: t.number, color: "#C58041" },
    { tag: t.bool, color: "#C58041" },
    { tag: t.null, color: "#C58041" },
    { tag: t.keyword, color: "#F64700" },
    { tag: t.operator, color: "#aaaaaa" },
    { tag: t.className, color: "#F64700" },
    { tag: t.definition(t.typeName), color: "#aaaaaa" },
    { tag: t.typeName, color: "#aaaaaa" },
    { tag: t.angleBracket, color: "#00A67D" },
    { tag: t.tagName, color: "#00A67D" },
    { tag: t.attributeName, color: "#00A67D" },
  ],
});

export const DevMode: React.FC = () => {
  const voice = appStore.useState((state) => state.voice);
  const input = appStore.useState((state) => state.input);
  const prompt = appStore.useState((state) => state.prompt);
  const height = "563px";
  const codeView = appStore.useState((state) => state.codeView);

  const editorTheme = EditorView.theme({
    // Only highlight the line if the editor is in a focused state.
    "&.cm-editor:not(.cm-focused) .cm-activeLine": {
      backgroundColor: "transparent",
    },
    ".cm-content": {
      paddingTop: "12px",
      paddingBottom: "12px",
    },
    ".cm-line": {
      paddingLeft: "12px",
      paddingRight: "12px",
    },
  });

  const setup = {
    lineNumbers: false,
    foldGutter: false, // disables code folding
    highlightActiveLine: false,
  };

  return (
    <main className="flex-1 flex flex-col gap-3 w-full max-w-(--page-max-width) mx-auto">
      <Block
        value={codeView}
        onChange={(nextCodeView) => {
          appStore.setState({ codeView: nextCodeView });
        }}
        title="Code snippet"
        tabs={[
          { id: "py", labelMobile: "PY", labelDesktop: "Python" },
          { id: "js", labelMobile: "JS", labelDesktop: "JavaScript" },
          { id: "curl", labelMobile: "CURL", labelDesktop: "cURL" },
        ]}
      >
        <div id="py" className={clsx(s.Container, "bg-screen")}>
          <CodeMirror
            value={getCodeSnippet("py", { input, prompt, voice })}
            height={height}
            extensions={[python(), editorTheme]}
            basicSetup={setup}
            theme={fmTheme}
          />
        </div>
        <div id="js" className={clsx(s.Container, "bg-screen")}>
          <CodeMirror
            value={getCodeSnippet("js", { input, prompt, voice })}
            height={height}
            extensions={[javascript(), editorTheme]}
            basicSetup={setup}
            theme={fmTheme}
          />
        </div>
        <div id="curl" className={clsx(s.Container, "bg-screen")}>
          <CodeMirror
            value={getCodeSnippet("curl", { input, prompt, voice })}
            height={height}
            extensions={[editorTheme]}
            basicSetup={setup}
            theme={fmTheme}
          />
        </div>
      </Block>
    </main>
  );
};
