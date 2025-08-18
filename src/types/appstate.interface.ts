import type { ToneInterface } from "./types";

export interface AppState {
  inputText: string;
  selectedTone: ToneInterface;
  isLoading: boolean;
  error: string | null;
  outputText: string;
  loadingMessage: string;
  retryCount: number;
}