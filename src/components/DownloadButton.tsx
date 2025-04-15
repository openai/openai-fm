import React, { useEffect, useState } from "react";
import { Download } from "./ui/Icons";
import { Button } from "./ui/Button";
import { appStore } from "@/lib/store";

const PlayingWaveform = ({
  audioLoaded,
  amplitudeLevels,
}: {
  audioLoaded: boolean;
  amplitudeLevels: number[];
}) => (
  <div className="w-[36px] h-[16px] relative left-[4px]">
    {amplitudeLevels.map((level, idx) => {
      const height = `${Math.min(Math.max(level * 30, 0.2), 1.9) * 100}%`;
      return (
        <div
          key={idx}
          className={`w-[2px] bg-white transition-all duration-150 rounded-[2px] absolute top-1/2 -translate-y-1/2 ${
            audioLoaded ? "opacity-100" : "animate-wave"
          }`}
          style={{
            height,
            animationDelay: `${idx * 0.15}s`,
            left: `${idx * 6}px`,
          }}
        />
      );
    })}
  </div>
);

const IS_CHROME =
  // @ts-expect-error - it's a safe reach
  navigator.userAgentData?.brands?.some(
    (b: { brand: string }) => b.brand === "Google Chrome"
  ) === true;

export default function DownloadButton() {
  const latestAudioUrl = appStore.useState((s) => s.latestAudioUrl);
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!latestAudioUrl) return;

    let objectUrl = "";
    const handler = (e: MessageEvent) => {
      if (e.data.type === "ADD_TO_CACHE" && e.data.url === latestAudioUrl) {
        objectUrl = URL.createObjectURL(e.data.blob);
        setDataUrl(objectUrl);
      }
    };
    navigator.serviceWorker.addEventListener("message", handler);

    return () => {
      setDataUrl(null);
      URL.revokeObjectURL(objectUrl);
      navigator.serviceWorker.removeEventListener("message", handler);
    };
  }, [latestAudioUrl]);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        // update file name when updating the service worker to avoid cache issues
        .register("/worker-444eae9e2e1bdd6edd8969f319655e70.js")
        .catch((err) => console.error("SW registration failed", err));
    }
  }, []);

  const handleDownload = async () => {
    const {
      selectedEntry,
      input,
      prompt,
      voice,
      latestAudioUrl: storeUrl,
    } = appStore.getState();

    const vibe =
      selectedEntry?.name.toLowerCase().replace(/ /g, "-") ?? "audio";

    const filename = `openai-fm-${voice}-${vibe}.${IS_CHROME ? "wav" : "mp3"}`;

    if (!storeUrl) {
      setLoading(true);
      const form = new FormData();
      form.append("input", input);
      form.append("prompt", prompt);
      form.append("voice", voice);
      form.append("generation", crypto.randomUUID());
      form.append("vibe", vibe);

      const res = await fetch("/api/generate", { method: "POST", body: form });
      const blob = await res.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setLoading(false);
      return;
    }

    appStore.setState({ latestAudioUrl: null });

    if (!dataUrl) {
      setLoading(true);
      const handler = (e: MessageEvent) => {
        if (e.data.type === "ADD_TO_CACHE" && e.data.url === storeUrl) {
          navigator.serviceWorker.removeEventListener("message", handler);
          const link = document.createElement("a");
          link.href = URL.createObjectURL(e.data.blob);
          link.download = filename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          setLoading(false);
        }
      };
      navigator.serviceWorker.addEventListener("message", handler);
      return;
    }

    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Button color="tertiary" onClick={handleDownload} disabled={loading}>
      {loading ? (
        <PlayingWaveform
          audioLoaded={false}
          amplitudeLevels={[0.04, 0.04, 0.04, 0.04, 0.04]}
        />
      ) : (
        <Download />
      )}{" "}
      <span className="uppercase hidden md:inline pr-3">Download</span>
    </Button>
  );
}
