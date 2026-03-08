import { Trash2 } from "lucide-react";

/* eslint-disable react-hooks/exhaustive-deps */
import {
  useCallback,
  useState,
  useEffect,
  useRef,
  lazy,
  Suspense,
} from "react";

import TextInput from "./components/TextInput";
import ToneSelector from "./components/ToneSelector";
import LanguageSelector from "./components/LanguageSelector";
import ActionButton from "./components/ActionButton";
import Loader from "./components/Loader";
import Header from "./components/Header";
import Cta from "./components/Cta";
import GlitchText from "./components/GlitchText";

const OutputDisplay = lazy(() => import("./components/OutputDisplay"));
const Footer = lazy(() => import("./components/Footer"));
const KonamiEasterEgg = lazy(() => import("./components/KonamiEasterEgg"));

import { reformulateTextWithRetry } from "../services/geminiService";
import { ERROR_MESSAGES } from "./constants/errorMessage";
import { LOADING_MESSAGES } from "./constants/loadingMessage";
import { ToneValues } from "./constants/ToneValues";
import { LanguageValues } from "./constants/LanguageValues";

import { TranslationProvider, useTranslation } from "./i18n/TranslationContext";
import type { AppState } from "./types/appstate.interface";
import type { ToneInterface, LanguageInterface } from "./types/types";
import type { TranslationKey } from "./i18n/translations";

function App() {
  // State Consolidé
  const [state, setState] = useState<AppState>({
    inputText: "",
    selectedTone: ToneValues[1], // Sarcastique par défaut
    selectedLanguage: LanguageValues[0], // Français par défaut
    isLoading: false,
    error: null,
    outputText: "",
    loadingMessageKey: "load_1" as TranslationKey,
    retryCount: 0,
  });

  // Refs
  const outputRef = useRef<HTMLElement>(null);
  const loadingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Cycle des messages de chargement
  useEffect(() => {
    if (state.isLoading) {
      let messageIndex = 0;
      loadingIntervalRef.current = setInterval(() => {
        messageIndex = (messageIndex + 1) % LOADING_MESSAGES.length;
        const newKey = `load_${messageIndex + 1}` as TranslationKey;
        setState((prev) => ({
          ...prev,
          loadingMessageKey: newKey,
        }));
      }, 2500);

      return () => {
        if (loadingIntervalRef.current)
          clearInterval(loadingIntervalRef.current);
      };
    }
  }, [state.isLoading]);

  // Scroll automatique vers l'output
  useEffect(() => {
    if (state.outputText && outputRef.current) {
      outputRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [state.outputText]);

  const handleReformulateInternal = useCallback(
    async (retryAttempt: number = 0) => {
      if (!state.inputText.trim()) {
        setState((prev) => ({ ...prev, error: ERROR_MESSAGES.emptyInput }));
        return;
      }

      setState((prev) => ({
        ...prev,
        isLoading: true,
        error: null,
        outputText: "",
        loadingMessageKey: "load_1" as TranslationKey,
        retryCount: retryAttempt,
      }));

      try {
        const result = await reformulateTextWithRetry(
          state.inputText,
          state.selectedTone,
          state.selectedLanguage,
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
    [state.inputText, state.selectedTone, state.selectedLanguage],
  );

  const handleError = useCallback(
    (error: unknown, attempt: number = 0) => {
      let errorMessage = ERROR_MESSAGES.genericError;
      let shouldRetry = false;

      if (error instanceof Error) {
        const msg = error.message.toLowerCase();
        if (msg.includes("quota") || msg.includes("rate"))
          errorMessage = ERROR_MESSAGES.quotaError;
        else if (msg.includes("network") || msg.includes("fetch")) {
          errorMessage = ERROR_MESSAGES.networkError;
          shouldRetry = attempt < 2;
        } else if (msg.includes("vide") || msg.includes("empty"))
          errorMessage = ERROR_MESSAGES.emptyInput;
        else if (attempt >= 3) errorMessage = ERROR_MESSAGES.retryError;
      }

      setState((prev) => ({
        ...prev,
        error: errorMessage,
        isLoading: false,
        retryCount: attempt,
      }));

      if (shouldRetry) {
        setTimeout(
          () => handleReformulateInternal(attempt + 1),
          1500 + attempt * 1000,
        );
      }
    },
    [handleReformulateInternal],
  );

  const handleReformulate = useCallback(() => {
    handleReformulateInternal(0);
  }, [handleReformulateInternal]);

  // Raccourcis clavier (Ctrl+Enter)
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "Enter") {
        e.preventDefault();
        if (!state.isLoading && state.inputText.trim()) handleReformulate();
      }
      if (e.key === "Escape" && state.error)
        setState((prev) => ({ ...prev, error: null }));
    };
    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [state.isLoading, state.inputText, state.error, handleReformulate]);

  // Handlers
  const updateInputText = useCallback((value: string) => {
    setState((prev) => ({ ...prev, inputText: value, error: null }));
  }, []);

  const updateSelectedTone = useCallback((tone: ToneInterface) => {
    setState((prev) => ({ ...prev, selectedTone: tone }));
  }, []);

  const updateSelectedLanguage = useCallback((language: LanguageInterface) => {
    setState((prev) => ({ ...prev, selectedLanguage: language }));
  }, []);

  const handleClearAll = useCallback(() => {
    setState((prev) => ({
      ...prev,
      inputText: "",
      outputText: "",
      error: null,
    }));
  }, []);

  return (
    <TranslationProvider language={state.selectedLanguage.code}>
      <AppContent
        state={state}
        setState={setState}
        handleReformulate={handleReformulate}
        handleReformulateInternal={handleReformulateInternal}
        updateInputText={updateInputText}
        updateSelectedTone={updateSelectedTone}
        updateSelectedLanguage={updateSelectedLanguage}
        handleClearAll={handleClearAll}
        outputRef={outputRef}
      />
    </TranslationProvider>
  );
}

function AppContent({
  state,
  handleReformulate,
  handleReformulateInternal,
  updateInputText,
  updateSelectedTone,
  updateSelectedLanguage,
  handleClearAll,
  outputRef,
}: any) {
  const { t } = useTranslation();

  return (
    <div className="noise-bg min-h-screen flex flex-col">
      {/* Accessibilité : lien d'évitement */}
      <a href="#main-content" className="skip-link">
        Passer au contenu
      </a>

      {/* Easter Egg chargé paresseusement */}
      <Suspense fallback={null}>
        <KonamiEasterEgg />
      </Suspense>

      <Header />

      <main
        id="main-content"
        className="grow flex flex-col gap-6 md:gap-12 max-w-4xl mx-auto px-4 py-4 md:py-8 w-full"
      >
        {/* Top bar: Language + CTA */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <LanguageSelector
            selectedLanguage={state.selectedLanguage}
            onLanguageChange={updateSelectedLanguage}
            disabled={state.isLoading}
          />
          <Cta link="https://kevine-dev.link/" title={t("cta_profile")} />
        </div>

        {/* Section 1: Input */}
        <section className="flex flex-col gap-8 animate-[fade-in-up_600ms_ease-out]">
          <TextInput
            value={state.inputText}
            onChange={(e) => updateInputText(e.target.value)}
            disabled={state.isLoading}
          />

          <ToneSelector
            selectedTone={state.selectedTone}
            onToneChange={updateSelectedTone}
            disabled={state.isLoading}
          />

          <div className="flex flex-col items-center gap-4 mt-4">
            <div className="flex items-center gap-3 w-full max-w-md">
              <ActionButton
                onClick={handleReformulate}
                disabled={state.isLoading || !state.inputText.trim()}
              >
                {state.isLoading ? (
                  <span className="flex items-center gap-3">
                    <Loader />
                    <GlitchText text={t(state.loadingMessageKey)} isAnimating />
                  </span>
                ) : (
                  <span>{t("btn_decode")}</span>
                )}
              </ActionButton>

              {state.inputText && !state.isLoading && (
                <button
                  onClick={handleClearAll}
                  className="p-4 rounded-md border border-(--color-slate) hover:border-(--color-coral) hover:text-(--color-coral) transition-all cursor-pointer flex items-center justify-center"
                  style={{ background: "var(--color-graphite)" }}
                  aria-label={t("btn_clear")}
                >
                  <Trash2 className="w-5 h-5" aria-hidden="true" />
                </button>
              )}
            </div>

            {state.error && state.retryCount < 3 && (
              <button
                onClick={() => handleReformulateInternal(state.retryCount)}
                className="font-mono text-xs underline underline-offset-4 decoration-(--color-acid-lime)"
                style={{ color: "var(--color-acid-lime)" }}
              >
                {t("btn_retry", { count: 3 - state.retryCount })}
              </button>
            )}
          </div>
        </section>

        {/* Section 2: Output */}
        {(state.outputText || state.error || state.isLoading) && (
          <section
            id="output-section"
            ref={outputRef}
            className="w-full bg-(--color-graphite) border border-(--color-slate) rounded-lg min-h-[300px] overflow-hidden"
            style={{
              boxShadow: "0 4px 30px rgba(0,0,0,0.5)",
              animation: "fade-in-up 800ms ease-out",
            }}
          >
            {state.isLoading ? (
              <div className="flex flex-col items-center justify-center p-20 gap-6">
                <Loader />
                <div className="text-center">
                  <p className="font-display font-bold text-xl uppercase tracking-widest text-(--color-acid-lime) mb-2">
                    {t("btn_decoding")}
                  </p>
                  <p className="font-mono text-xs text-(--color-warm-gray)">
                    <GlitchText text={t(state.loadingMessageKey)} isAnimating />
                  </p>
                </div>
              </div>
            ) : (
              <Suspense
                fallback={
                  <div className="flex flex-col items-center justify-center p-20 gap-6">
                    <Loader />
                  </div>
                }
              >
                <OutputDisplay
                  outputText={state.outputText}
                  error={state.error}
                />
              </Suspense>
            )}
          </section>
        )}
      </main>

      <Suspense fallback={<div className="h-20" />}>
        <Footer />
      </Suspense>
    </div>
  );
}

export default App;
