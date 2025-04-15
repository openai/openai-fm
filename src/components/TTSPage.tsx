"use client";
import React, { useState } from "react";
import {
  getRandomLibrarySet,
  getRandomVoice,
  LIBRARY,
  VOICES,
} from "../lib/library";
import { Block } from "./ui/Block";
import { Footer } from "./ui/Footer";

import { Header } from "./ui/Header";
import { DevMode } from "./ui/DevMode";

import { Regenerate, Shuffle, Star } from "./ui/Icons";
import { useBodyScrollable } from "@/hooks/useBodyScrollable";
import { Button, ButtonLED } from "./ui/Button";
import { appStore } from "@/lib/store";
import BrowserNotSupported from "./ui/BrowserNotSupported";

const EXPRESSIVE_VOICES = ["ash", "ballad", "coral", "sage", "verse"];

export default function TtsPage() {
  const [devMode, setDevMode] = useState(false);
  const isScrollable = useBodyScrollable();

  return (
    <div
      data-scrollable={isScrollable}
      className="flex flex-col gap-x-3 min-h-screen px-5 pt-6 pb-32 md:pb-24 selection:bg-primary/20"
    >
      <Header devMode={devMode} setDevMode={setDevMode} />
      {devMode ? <DevMode /> : <Board />}
      <Footer devMode={devMode} />
    </div>
  );
}

const Board = () => {
  const voice = appStore.useState((state) => state.voice);
  const input = appStore.useState((state) => state.input);
  const inputDirty = appStore.useState((state) => state.inputDirty);
  const prompt = appStore.useState((state) => state.prompt);
  const selectedEntry = appStore.useState((state) => state.selectedEntry);
  const librarySet = appStore.useState((state) => state.librarySet);
  const browserNotSupported = appStore.useState(
    () => !("serviceWorker" in navigator)
  );

  const handleRefreshLibrarySet = () => {
    const nextSet = getRandomLibrarySet();

    appStore.setState((draft) => {
      draft.librarySet = nextSet;

      // When the user has changes, don't update the script.
      if (!draft.inputDirty) {
        draft.input = nextSet[0].input;
      }

      draft.prompt = nextSet[0].prompt;
      draft.selectedEntry = nextSet[0];
      draft.latestAudioUrl = null;
    });
  };

  const handlePresetSelect = (name: string) => {
    const entry = LIBRARY[name];

    appStore.setState((draft) => {
      // When the user has changes, don't update the script.
      if (!inputDirty) {
        draft.input = entry.input;
      }

      draft.prompt = entry.prompt;
      draft.selectedEntry = entry;
      draft.latestAudioUrl = null;
    });
  };

  return (
    <main className="flex-1 flex flex-col gap-x-3 w-full max-w-(--page-max-width) mx-auto">
      {browserNotSupported && (
        <BrowserNotSupported
          open={browserNotSupported}
          onOpenChange={() => {}}
        />
      )}
      <div className="flex flex-row">
        <Block title="Voice">
          <div className="grid grid-cols-12 gap-3">
            {VOICES.map((newVoice) => (
              <div
                key={newVoice}
                className="col-span-4 sm:col-span-3 md:col-span-2 xl:col-span-1 relative"
              >
                <Button
                  block
                  color="default"
                  onClick={() => {
                    appStore.setState((draft) => {
                      draft.voice = newVoice;
                      draft.latestAudioUrl = null;
                    });
                  }}
                  selected={newVoice === voice}
                  className="aspect-4/3 sm:aspect-2/1 lg:aspect-2.5/1 xl:aspect-square min-h-[60px] max-h-[100px] flex-col items-start justify-between relative"
                >
                  <span>
                    {newVoice[0].toUpperCase()}
                    {newVoice.substring(1)}
                  </span>
                  <div className="absolute left-[0.93rem] bottom-[0.93rem]">
                    <ButtonLED />
                  </div>
                  {EXPRESSIVE_VOICES.includes(newVoice) && (
                    <div className="absolute right-[13px] bottom-[10.5px]">
                      <Star className="w-[12px] h-[12px]" />
                    </div>
                  )}
                </Button>
              </div>
            ))}
            <div className="col-span-4 sm:col-span-3 md:col-span-2 xl:col-span-1">
              <Button
                block
                color="neutral"
                onClick={() => {
                  const randomVoice = getRandomVoice(voice);
                  appStore.setState((draft) => {
                    draft.voice = randomVoice;
                    draft.latestAudioUrl = null;
                  });
                }}
                className="aspect-4/3 sm:aspect-2/1 lg:aspect-2.5/1 xl:aspect-square max-h-[100px]"
                aria-label="Select random voice"
              >
                <Shuffle />
              </Button>
            </div>
          </div>
        </Block>
      </div>
      <div className="flex flex-col md:flex-row gap-3">
        <Block title="Vibe">
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {librarySet.map((entry) => (
                <Button
                  key={entry.name}
                  block
                  color="default"
                  onClick={() => handlePresetSelect(entry.name)}
                  selected={selectedEntry?.name === entry.name}
                  className="aspect-4/3 sm:aspect-2/1 lg:aspect-2.5/1 min-h-[60px] max-h-[100px] flex-col items-start justify-between relative"
                >
                  <span className="break-words pr-1">{entry.name}</span>
                  <div className="absolute left-[0.93rem] bottom-[0.93rem]">
                    <ButtonLED />
                  </div>
                </Button>
              ))}
              <Button
                block
                color="neutral"
                onClick={handleRefreshLibrarySet}
                className="aspect-4/3 sm:aspect-2/1 lg:aspect-2.5/1 min-h-[60px] max-h-[100px]"
                aria-label="Generate new list of vibes"
              >
                <Regenerate />
              </Button>
            </div>
            <textarea
              id="input"
              rows={8}
              maxLength={999}
              className="w-full resize-none outline-none focus:outline-none bg-screen p-4 rounded-lg shadow-textarea text-[16px] md:text-[14px]"
              value={prompt}
              onChange={({ target }) => {
                appStore.setState((draft) => {
                  draft.selectedEntry = null;
                  draft.prompt = target.value;
                  draft.latestAudioUrl = null;
                });
              }}
              required
            />
          </div>
        </Block>
        <Block title="Script">
          <div className="relative flex flex-col h-full w-full">
            <textarea
              id="prompt"
              rows={8}
              maxLength={999}
              className="w-full h-full min-h-[220px] resize-none outline-none focus:outline-none bg-screen p-4 rounded-lg shadow-textarea text-[16px] md:text-[14px]"
              value={input}
              onChange={({ target }) => {
                const nextValue = target.value;

                appStore.setState((draft) => {
                  draft.inputDirty =
                    !!nextValue && selectedEntry?.input !== nextValue;
                  draft.input = nextValue;
                  draft.latestAudioUrl = null;
                });
              }}
            />
            {inputDirty && (
              <span
                className="absolute bottom-[-27px] sm:bottom-3 left-4 z-10 cursor-pointer uppercase hover:text-current/70 transition-colors"
                onClick={() => {
                  appStore.setState((draft) => {
                    draft.inputDirty = false;
                    draft.input = selectedEntry?.input ?? input;
                    draft.latestAudioUrl = null;
                  });
                }}
              >
                Reset
              </span>
            )}
            <span className="absolute bottom-3 right-4 z-10 opacity-30 hidden sm:block">
              {input.length}
            </span>
          </div>
        </Block>
      </div>
    </main>
  );
};
