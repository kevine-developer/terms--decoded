// src/types/appstate.interface.ts
import type { ToneInterface, LanguageInterface, CustomToneInterface } from "./types";

export interface AppState {
  inputText: string;
  selectedTone: ToneInterface | CustomToneInterface;
  selectedLanguage: LanguageInterface;
  customTones: CustomToneInterface[];
  isLoading: boolean;
  error: string | null;
  outputText: string;
  loadingMessage: string;
  retryCount: number;
}