export type Language = "en" | "de";

export const SUPPORTED_LANGUAGES: { code: Language; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "de", label: "DE" },
];

const messages = {
  en: {
    headerDescription:
      "An interactive demo for developers to try the new text-to-speech model in the OpenAI API.",
    startBuilding: "Start building",
    voice: "Voice",
    vibe: "Vibe",
    script: "Script",
    reset: "Reset",
    randomVoiceAria: "Select random voice",
    regenerateAria: "Generate new list of vibes",
    browserNotSupportedTitle: "Browser not supported",
    browserNotSupportedBody:
      "Please open openai.fm directly in a modern browser to enjoy the full audio experience.",
    docs: "Docs",
    share: "Share",
    download: "Download",
    copy: "Copy",
    copied: "Copied",
    shareLinkTitle: "Share Link",
    shareLinkDescription: "Copy the link below to share with others.",
    close: "Close",
    play: "Play",
    busy: "Busy",
    stop: "Stop",
    shareError: "Error sharing. Please try again.",
    shareCreateError: "Error creating share link. Please try again.",
  },
  de: {
    headerDescription:
      "Eine interaktive Demo für Entwickler, um das neue Text-zu-Sprache-Modell der OpenAI API auszuprobieren.",
    startBuilding: "Loslegen",
    voice: "Stimme",
    vibe: "Stimmung",
    script: "Skript",
    reset: "Zurücksetzen",
    randomVoiceAria: "Zufällige Stimme auswählen",
    regenerateAria: "Neue Liste von Stimmungen erzeugen",
    browserNotSupportedTitle: "Browser wird nicht unterstützt",
    browserNotSupportedBody:
      "Öffne openai.fm in einem modernen Browser, um das volle Audio-Erlebnis zu nutzen.",
    docs: "Dokumentation",
    share: "Teilen",
    download: "Download",
    copy: "Kopieren",
    copied: "Kopiert",
    shareLinkTitle: "Teil-Link",
    shareLinkDescription: "Kopiere den Link unten, um ihn zu teilen.",
    close: "Schließen",
    play: "Abspielen",
    busy: "Beschäftigt",
    stop: "Stopp",
    shareError: "Fehler beim Teilen. Bitte versuche es erneut.",
    shareCreateError:
      "Fehler beim Erstellen des Teil-Links. Bitte versuche es erneut.",
  },
} satisfies Record<Language, Record<string, string>>;

export type MessageKey = keyof typeof messages.en;

export const translate = (key: MessageKey, language: Language) =>
  messages[language]?.[key] ?? messages.en[key];

export const languageFromPath = (pathname: string): Language | null => {
  const maybeSegment = pathname.split("/")[1];
  const hit = SUPPORTED_LANGUAGES.find((lang) => lang.code === maybeSegment);
  return hit ? hit.code : null;
};

export const detectLanguage = (): Language => {
  if (typeof window === "undefined") return "en";

  const fromPath = languageFromPath(window.location.pathname);
  if (fromPath) return fromPath;

  const stored = window.localStorage.getItem("openai-fm-language");
  if (stored === "de" || stored === "en") {
    return stored;
  }
  return window.navigator.language.toLowerCase().startsWith("de") ? "de" : "en";
};
