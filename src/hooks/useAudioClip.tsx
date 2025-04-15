import { useEffect } from "react";

const CLIPS: Record<string, HTMLAudioElement> = {};

export const useAudioClip = (path: string) => {
  useEffect(() => {
    if (CLIPS[path]) {
      return;
    }

    // Initialize the clip
    const audio = new Audio(path);
    audio.preload = "auto";

    if (window.requestIdleCallback) {
      window.requestIdleCallback(() => {
        audio.load();
      });
    } else {
      audio.load();
    }
    CLIPS[path] = audio;
  }, [path]);

  return () => {
    const audio = CLIPS[path];

    // Impossible
    if (!audio) {
      return;
    }

    audio.volume = 0.2;
    audio.currentTime = 0;
    audio.play();
  };
};
