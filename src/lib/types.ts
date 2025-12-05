export interface LibraryEntry {
  id: string;
  name: string;
  input: string;
  prompt: string;
  voice: string;
}

export interface LibraryLocalizedFields {
  name?: string;
  input?: string;
  prompt?: string;
}

export type PartialLibraryTranslation = Partial<
  Record<string, LibraryLocalizedFields>
>;
