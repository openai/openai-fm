import { Copy, Check } from "./ui/Icons";
import { Button } from "./ui/Button";
import { copyText } from "../lib/copyText";
import { appStore } from "@/lib/store";
import { getCodeSnippet } from "@/lib/codeSnippet";
import { useCopiedDelay } from "@/hooks/useCopiedDelay";

export const CodeCopyButton = () => {
  const { copied, trigger } = useCopiedDelay();

  const handleCopy = () => {
    if (copied) {
      return;
    }

    const { input, prompt, voice, codeView } = appStore.getState();
    const codeValue = getCodeSnippet(codeView, { input, prompt, voice });
    copyText(codeValue);
  };

  return (
    <Button
      color="secondary"
      onClick={() => {
        if (copied) return;
        trigger();
        handleCopy();
      }}
    >
      {copied ? (
        <span className="h-full flex gap-2 items-center justify-center">
          <Check />
          <span className="uppercase hidden md:inline pr-3">Copied</span>
        </span>
      ) : (
        <span className="flex gap-2 items-center justify-center">
          <Copy /> <span className="uppercase hidden md:inline pr-3">Copy</span>
        </span>
      )}
    </Button>
  );
};
