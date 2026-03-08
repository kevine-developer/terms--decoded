// src/types/appstate.interface.ts
import type { ToneInterface, LanguageInterface } from "./types";
import type { TranslationKey } from "../i18n/translations";

export interface AppState {
  inputText: string;
  selectedTone: ToneInterface;
  selectedLanguage: LanguageInterface;
  isLoading: boolean;
  error: string | null;
  outputText: string;
  loadingMessageKey: TranslationKey;
  retryCount: number;
}
