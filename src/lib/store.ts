import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { LibraryEntry } from "./types";
import {
  DEFAULT_VOICE,
  getLibraryByPrompt,
  getRandomLibrarySet,
  localizeEntry,
  LIBRARY,
} from "./library";
import { detectLanguage, Language } from "./i18n";

export interface AppState {
  voice: string;
  input: string;
  inputDirty: boolean;
  prompt: string;
  codeView: string;
  selectedEntry: LibraryEntry | null;
  librarySet: LibraryEntry[];
  latestAudioUrl: string | null;
  language: Language;
}

const INITIAL_STATE: AppState = {
  voice: DEFAULT_VOICE,
  input: "",
  inputDirty: false,
  prompt: "",
  codeView: "py",
  selectedEntry: null,
  librarySet: [],
  latestAudioUrl: null,
  language: "en",
};

class AppStore {
  private store = create(immer(() => INITIAL_STATE));

  constructor() {
    const initialLanguage = detectLanguage();
    const randomSet = getRandomLibrarySet();
    const localizedDefault = localizeEntry(randomSet[0], initialLanguage);

    this.store.setState((draft) => {
      draft.librarySet = randomSet;
      draft.selectedEntry = randomSet[0];
      draft.input = localizedDefault.input;
      draft.prompt = localizedDefault.prompt;
      draft.language = initialLanguage;
    });

    if (typeof window === "undefined") {
      return;
    }

    const hash = window.location.hash.slice(1);
    if (!hash) {
      return;
    }

    fetch(`/api/share?hash=${hash}`)
      .then((res) => {
        if (!res.ok) {
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data) {
          this.store.setState((draft) => {
            draft.input = data.input;
            draft.prompt = data.prompt;
            draft.voice = data.voice;

            const maybeSpecificVibe = getLibraryByPrompt(data.prompt);
            if (maybeSpecificVibe) {
              const exists = draft.librarySet.find(
                (lib) => lib.prompt === maybeSpecificVibe.prompt
              );
              if (!exists) {
                draft.librarySet[0] = maybeSpecificVibe;
                draft.selectedEntry = maybeSpecificVibe;
              }
            }
          });
        }
      })
      .catch((err) => {
        console.error("Error loading shared params:", err);
      });
  }

  setLanguage(language: Language) {
    this.store.setState((draft) => {
      draft.language = language;

      if (!draft.inputDirty) {
        const targetEntry =
          draft.selectedEntry
            ? LIBRARY[draft.selectedEntry.id]
            : draft.librarySet[0];
        if (targetEntry) {
          const localized = localizeEntry(targetEntry, language);
          draft.input = localized.input;
          draft.prompt = localized.prompt;
        }
      }
    });

    if (typeof window !== "undefined") {
      window.localStorage.setItem("openai-fm-language", language);
    }
  }

  useState = this.store;
  setState = this.store.setState;
  getState = this.store.getState;
  subscribe = this.store.subscribe;
}

export const appStore = new AppStore() as Readonly<AppStore>;
