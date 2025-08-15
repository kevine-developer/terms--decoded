import type { Tone } from "./types";

export interface AppState {
  inputText: string;
  selectedTone: Tone;
  isLoading: boolean;
  error: string | null;
  outputText: string;
  loadingMessage: string;
  retryCount: number;
}