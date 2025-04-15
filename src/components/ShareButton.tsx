import { useState } from "react";
import { useCopiedDelay } from "@/hooks/useCopiedDelay";
import { copyText } from "../lib/copyText";
import { appStore } from "@/lib/store";
import { Share } from "./ui/Icons";
import { Button } from "./ui/Button";
import ShareDialog from "./ShareDialog";

export const ShareButton = () => {
  const { copied, trigger } = useCopiedDelay();
  const [open, setOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const handleShare = async () => {
    const { input, prompt, voice } = appStore.getState();

    try {
      const res = await fetch("/api/share", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input, prompt, voice }),
      });
      if (!res.ok) {
        alert("Error sharing. Please try again.");
        return;
      }
      const data = await res.json();
      const hash = data.id;
      const shareUrl = `${window.location.origin}${window.location.pathname}#${hash}`;
      // Copy share URL to clipboard to share with others.
      await copyText(shareUrl);
      setShareUrl(shareUrl);
      setOpen(true);
    } catch (err) {
      console.error("Error creating share link:", err);
      alert("Error creating share link. Please try again.");
    }
  };

  return (
    <>
      <Button
        color="secondary"
        onClick={() => {
          if (copied) return;
          trigger();
          handleShare();
        }}
      >
        <span className="flex gap-2 items-center justify-center">
          <Share />
          <span className="uppercase hidden md:inline pr-3">Share</span>
        </span>
      </Button>
      <ShareDialog shareUrl={shareUrl} open={open} onOpenChange={setOpen} />
    </>
  );
};
