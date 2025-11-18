/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useState, useEffect, useRef } from "react";

import TextInput from "./components/TextInput";
import ToneSelector from "./components/ToneSelector";
import LanguageSelector from "./components/LanguageSelector";
import ActionButton from "./components/ActionButton";
import Loader from "./components/Loader";
import OutputDisplay from "./components/OutputDisplay";
import { reformulateTextWithRetry } from "../services/geminiService";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { ERROR_MESSAGES } from "./constants/errorMessage";
import { LOADING_MESSAGES } from "./constants/loadingMessage";
import type { AppState } from "./types/appstate.interface";
import Cta from "./components/Cta";
import { ToneValues } from "./constants/ToneValues";
import { LanguageValues } from "./constants/LanguageValues";
import type {
  ToneInterface,
  LanguageInterface,
  CustomToneInterface,
} from "./types/types";
import {
  loadCustomTones,
  addCustomTone,
  removeCustomTone,
} from "./utils/localStorageService";

function App() {
  // State consolidé pour une meilleure gestion
  const [state, setState] = useState<AppState>({
    inputText: "",
    selectedTone: ToneValues[1], // Sarcastique par défaut
    selectedLanguage: LanguageValues[0], // Français par défaut
    customTones: [],
    isLoading: false,
    error: null,
    outputText: "",
    loadingMessage: LOADING_MESSAGES[0],
    retryCount: 0,
  });

  // Refs pour les animations et focus
  const outputRef = useRef<HTMLDivElement>(null);
  const loadingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Charger les tons personnalisés au démarrage
  useEffect(() => {
    const customTones = loadCustomTones();
    setState((prev) => ({ ...prev, customTones }));
  }, []);

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
          state.selectedTone,
          state.selectedLanguage
        );

        setState((prev) => ({
          ...prev,
          outputText: result,
          isLoading: false,
          error: null,
        }));
      } catch (error) {
        handleError(error, retryAttempt);
      }
    },
    [state.inputText, state.selectedTone, state.selectedLanguage]
  );

  // Gestion d'erreur intelligente avec retry automatique
  const handleError = useCallback(
    (error: unknown, attempt: number = 0) => {
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
    },
    [handleReformulateInternal]
  );

  // Fonction publique de reformulation
  const handleReformulate = useCallback(() => {
    handleReformulateInternal(0);
  }, [handleReformulateInternal]);

  // Gestion des raccourcis clavier
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Ctrl+Enter pour reformuler
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

  const updateSelectedTone = useCallback(
    (tone: ToneInterface | CustomToneInterface) => {
      setState((prev) => ({ ...prev, selectedTone: tone }));
    },
    []
  );

  const updateSelectedLanguage = useCallback((language: LanguageInterface) => {
    setState((prev) => ({ ...prev, selectedLanguage: language }));
  }, []);

  // Gestion des tons personnalisés
  const handleCustomToneAdd = useCallback((customTone: CustomToneInterface) => {
    setState((prev) => ({
      ...prev,
      customTones: addCustomTone(prev.customTones, customTone),
    }));
  }, []);

  const handleCustomToneDelete = useCallback((toneId: string) => {
    setState((prev) => ({
      ...prev,
      customTones: removeCustomTone(prev.customTones, toneId),
    }));
  }, []);

  // Clear output et reset
  const handleClearAll = useCallback(() => {
    setState((prev) => ({
      ...prev,
      inputText: "",
      outputText: "",
      error: null,
    }));
  }, []);

  return (
    <div className="flex flex-col">
      <Header />

      <main className="grow container mx-auto px-4 mb-2">
        {/* CTA en haut */}

        <LanguageSelector
          selectedLanguage={state.selectedLanguage}
          onLanguageChange={updateSelectedLanguage}
          disabled={state.isLoading}
          className="m-2 flex justify-center"
        />
        <Cta link="https://kevine-dev.link/" title="Découvrir mon profil" />
        {/* Sélecteur de langue */}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Colonne gauche - Input */}
          <div className="lg:w-1/2 flex flex-col gap-6">
            <TextInput
              value={state.inputText}
              onChange={(e) => updateInputText(e.target.value)}
            />

            <ToneSelector
              selectedTone={state.selectedTone}
              onToneChange={updateSelectedTone}
              customTones={state.customTones}
              onCustomToneAdd={handleCustomToneAdd}
              onCustomToneDelete={handleCustomToneDelete}
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
                ) : state.selectedLanguage.code === "fr" ? (
                  "Déchiffrer ce charabia"
                ) : (
                  "Decode this gibberish"
                )}
              </ActionButton>
              <div>
                {state.inputText && (
                  <ActionButton
                    onClick={handleClearAll}
                    disabled={state.isLoading}
                    aria-label={
                      state.selectedLanguage.code === "fr"
                        ? "Effacer tout le texte"
                        : "Clear all text"
                    }
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
                className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                {state.selectedLanguage.code === "fr"
                  ? `Réessayer (${3 - state.retryCount} tentatives restantes)`
                  : `Retry (${3 - state.retryCount} attempts remaining)`}
              </button>
            )}
          </div>

          <div className="lg:w-1/2 flex flex-col text-white" ref={outputRef}>
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-1 grow min-h-[300px] lg:min-h-0 relative overflow-hidden">
              {state.isLoading ? (
                <div className="flex flex-col items-center justify-center h-full p-8 space-y-4">
                  <Loader />
                  <p className="text-gray-100 text-center animate-pulse">
                    {state.loadingMessage}
                  </p>
                  {state.retryCount > 0 && (
                    <p className="text-xs text-yellow-400">
                      {state.selectedLanguage.code === "fr"
                        ? `Tentative automatique #${state.retryCount + 1}/3`
                        : `Automatic attempt #${state.retryCount + 1}/3`}
                    </p>
                  )}
                </div>
              ) : (
                <OutputDisplay
                  outputText={state.outputText}
                  error={state.error}
                  language={state.selectedLanguage}
                />
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;
