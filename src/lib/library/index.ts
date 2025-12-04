import { LibraryEntry, LibraryLocalizedFields } from "../types";
import { Language } from "../i18n";
import { LIBRARY_BASE, VOICES, DEFAULT_VOICE } from "./base";
import { LIBRARY_DE } from "./lang/de";

const TRANSLATIONS: Record<Language, Record<string, LibraryLocalizedFields>> = {
  en: {},
  de: LIBRARY_DE,
};

export { VOICES, DEFAULT_VOICE };

export const LIBRARY = LIBRARY_BASE;

export const getRandomLibrarySet = (count = 5): LibraryEntry[] => {
  const availableLibrary = Object.values(LIBRARY_BASE);
  return availableLibrary.sort(() => Math.random() - 0.5).slice(0, count);
};

export const getRandomVoice = (currentVoice: string): string => {
  const availableVoices = VOICES.filter((voice) => voice !== currentVoice);
  return availableVoices[Math.floor(Math.random() * availableVoices.length)];
};

export const localizeEntry = (
  entry: LibraryEntry,
  language: Language
): LibraryEntry => {
  if (!entry) return entry;
  const localized = TRANSLATIONS[language]?.[entry.id];
  if (!localized) return entry;
  return { ...entry, ...localized };
};

export const getLibraryByPrompt = (
  maybePrompt: string
): LibraryEntry | null => {
  for (const entry of Object.values(LIBRARY_BASE)) {
    if (entry.prompt === maybePrompt) return entry;
    const trPrompt = LIBRARY_DE[entry.id]?.prompt;
    if (trPrompt && trPrompt === maybePrompt) return entry;
  }
  return null;
};
