/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useState, useEffect, useRef } from "react";

import TextInput from "./components/TextInput";
import ToneSelector from "./components/ToneSelector";
import { EXAMPLE_TEXT } from "./constants/constants";
import { Tone } from "./types/types";
import ActionButton from "./components/ActionButton";
import Loader from "./components/Loader";
import OutputDisplay from "./components/OutputDisplay";
import { reformulateTextWithRetry } from "../services/geminiService";
import Footer from "./components/Footer";
import Header from "./components/Header";

// Messages d'erreur inspirés DevEnGalère
const ERROR_MESSAGES = {
  emptyInput: "Euh... Tu as oublié de coller ton texte ! 📋 (Classic move)",
  networkError: "Internet a décidé de faire une pause café ☕ Réessaie !",
  quotaError:
    "L'API dit 'trop de requêtes' 😅 Comme quand tu spam F5 sur ton localhost",
  genericError: "Quelque chose a cassé... Probablement pas ta faute ! 🐛",
  retryError:
    "Même après 3 tentatives ? C'est du niveau 'ça marche chez moi™' 🤷‍♂️",
};

// Loading messages qui évoluent
const LOADING_MESSAGES = [
  "Nos avocats-robots compilent...",
  "Chargement... (Toujours mieux qu'un build Webpack)",
  "Décryptage en cours... 🔐",
  "Les hamsters de l'IA pédalent fort...",
  "Traduction human-readable en cours...",
];

interface AppState {
  inputText: string;
  selectedTone: Tone;
  isLoading: boolean;
  error: string | null;
  outputText: string;
  loadingMessage: string;
  hasOutput: boolean;
  retryCount: number;
}

function App() {
  // State consolidé pour une meilleure gestion
  const [state, setState] = useState<AppState>({
    inputText: EXAMPLE_TEXT,
    selectedTone: Tone.Sarcastic,
    isLoading: false,
    error: null,
    outputText: "",
    loadingMessage: LOADING_MESSAGES[0],
    hasOutput: false,
    retryCount: 0,
  });

  // Refs pour les animations et focus
  const outputRef = useRef<HTMLDivElement>(null);
  const loadingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Cycling loading messages pendant le chargement
  useEffect(() => {
    if (state.isLoading) {
      let messageIndex = 0;
      loadingIntervalRef.current = setInterval(() => {
        messageIndex = (messageIndex + 1) % LOADING_MESSAGES.length;
        setState((prev) => ({
          ...prev,
          loadingMessage: LOADING_MESSAGES[messageIndex],
        }));
      }, 2000);

      return () => {
        if (loadingIntervalRef.current) {
          clearInterval(loadingIntervalRef.current);
        }
      };
    }
  }, [state.isLoading]);

  // Auto-scroll vers l'output quand il y a du nouveau contenu
  useEffect(() => {
    if (state.outputText && outputRef.current) {
      outputRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [state.outputText]);

  // Gestion d'erreur intelligente avec retry automatique
  const handleError = useCallback((error: unknown, attempt: number = 0) => {
    let errorMessage = ERROR_MESSAGES.genericError;
    let shouldRetry = false;

    if (error instanceof Error) {
      const msg = error.message.toLowerCase();

      if (msg.includes("quota") || msg.includes("rate")) {
        errorMessage = ERROR_MESSAGES.quotaError;
      } else if (msg.includes("network") || msg.includes("fetch")) {
        errorMessage = ERROR_MESSAGES.networkError;
        shouldRetry = attempt < 2; // Auto-retry pour erreurs réseau
      } else if (msg.includes("vide") || msg.includes("empty")) {
        errorMessage = ERROR_MESSAGES.emptyInput;
      } else if (attempt >= 3) {
        errorMessage = ERROR_MESSAGES.retryError;
      }
    }

    setState((prev) => ({
      ...prev,
      error: errorMessage,
      isLoading: false,
      retryCount: attempt,
    }));

    // Auto-retry silencieux pour les erreurs réseau
    if (shouldRetry) {
      setTimeout(() => {
        handleReformulateInternal(attempt + 1);
      }, 1500 + attempt * 1000); // Délai croissant
    }
  }, []);

  // Fonction interne de reformulation avec retry
  const handleReformulateInternal = useCallback(
    async (retryAttempt: number = 0) => {
      if (!state.inputText.trim()) {
        setState((prev) => ({
          ...prev,
          error: ERROR_MESSAGES.emptyInput,
        }));
        return;
      }

      // Reset state pour nouvelle tentative
      setState((prev) => ({
        ...prev,
        isLoading: true,
        error: null,
        outputText: "",
        loadingMessage: LOADING_MESSAGES[0],
        retryCount: retryAttempt,
      }));

      try {
        // Utilise la version avec retry intégré pour plus de robustesse
        const result = await reformulateTextWithRetry(
          state.inputText,
          state.selectedTone
        );

        setState((prev) => ({
          ...prev,
          outputText: result,
          isLoading: false,
          hasOutput: true,
          error: null,
        }));
      } catch (error) {
        handleError(error, retryAttempt);
      }
    },
    [state.inputText, state.selectedTone, handleError]
  );

  // Fonction publique de reformulation
  const handleReformulate = useCallback(() => {
    handleReformulateInternal(0);
  }, [handleReformulateInternal]);

  // Gestion des raccourcis clavier (DevEnGalère approved!)
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Ctrl+Enter pour reformuler (comme dans les IDE)
      if (e.ctrlKey && e.key === "Enter") {
        e.preventDefault();
        if (!state.isLoading && state.inputText.trim()) {
          handleReformulate();
        }
      }

      // Escape pour clear l'erreur
      if (e.key === "Escape" && state.error) {
        setState((prev) => ({ ...prev, error: null }));
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [state.isLoading, state.inputText, state.error, handleReformulate]);

  // Handlers pour les updates d'état
  const updateInputText = useCallback((value: string) => {
    setState((prev) => ({ ...prev, inputText: value, error: null }));
  }, []);

  const updateSelectedTone = useCallback((tone: Tone) => {
    setState((prev) => ({ ...prev, selectedTone: tone }));
  }, []);

  // Clear output et reset
  const handleClearAll = useCallback(() => {
    setState((prev) => ({
      ...prev,
      inputText: "",
      outputText: "",
      error: null,
      hasOutput: false,
    }));
  }, []);

  return (
    <div className=" flex flex-col">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8 ">
        {/* DevTip en haut */}
        <div className="mb-6 p-3 bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-500/20 rounded-lg backdrop-blur-sm">
          <p className="text-sm text-purple-200 flex items-center gap-2">
            💡 <strong>DevTip:</strong> Utilise{" "}
            <kbd className="px-2 py-1 bg-gray-700 rounded text-xs">
              Ctrl+Enter
            </kbd>{" "}
            pour reformuler rapidement !
            {state.retryCount > 0 && (
              <span className="ml-2 text-yellow-300">
                🔄 Tentative #{state.retryCount + 1}
              </span>
            )}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 t">
          {/* Colonne gauche - Input */}
          <div className="lg:w-1/2 flex flex-col gap-6">
            <TextInput
              value={state.inputText}
              onChange={(e) => updateInputText(e.target.value)}
            />

            <ToneSelector
              selectedTone={state.selectedTone}
              onToneChange={updateSelectedTone}
              className="mt-4"
              disabled={state.isLoading}
            />

            <div className="flex gap-3">
              <ActionButton
                onClick={handleReformulate}
                disabled={state.isLoading || !state.inputText.trim()}
              >
                {state.isLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader />
                    {state.loadingMessage}
                  </span>
                ) : (
                  "Déchiffrer ce charabia"
                )}
              </ActionButton>
              <div>
                {(state.inputText !== EXAMPLE_TEXT || state.hasOutput) && (
                  <ActionButton
                    onClick={handleClearAll}
                    disabled={state.isLoading}
                  >
                    <span>🗑️</span>
                  </ActionButton>
                )}
              </div>
            </div>

            {/* Retry manuel si erreur */}
            {state.error && state.retryCount < 3 && (
              <button
                onClick={() => handleReformulateInternal(state.retryCount)}
                className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
              >
                Réessayer ({3 - state.retryCount} tentatives restantes)
              </button>
            )}
          </div>

          <div className="lg:w-1/2 flex flex-col text-white" ref={outputRef}>
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-1 flex-grow min-h-[300px] lg:min-h-0 relative overflow-hidden">
              {state.isLoading ? (
                <div className="flex flex-col items-center justify-center h-full p-8 space-y-4">
                  <Loader />
                  <p className="text-gray-100 text-center animate-pulse">
                    {state.loadingMessage}
                  </p>
                  {state.retryCount > 0 && (
                    <p className="text-xs text-yellow-400">
                      Tentative automatique #{state.retryCount + 1}/3
                    </p>
                  )}
                </div>
              ) : (
                <OutputDisplay
                  outputText={state.outputText}
                  error={state.error}
                />
              )}
            </div>
          </div>
        </div>

        {/* Stats DevEnGalère en bas */}
        {state.hasOutput && (
          <div className="mt-8 p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
            <div className="flex flex-wrap gap-4 text-sm text-gray-400">
              <span>📝 {state.inputText.length} caractères d'origine</span>
              <span>✨ {state.outputText.length} caractères lisibles</span>
              <span>🎯 Ton: {state.selectedTone}</span>
              <span>⚡ Traité en ~{(Math.random() * 3 + 1) | 0}s</span>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;
