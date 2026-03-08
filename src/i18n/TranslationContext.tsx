import { createContext, useContext } from "react";
import type { ReactNode } from "react";
import { translations } from "./translations";
import type { LanguageKey, TranslationKey } from "./translations";
import type { LanguageCode } from "../constants/constants";

interface TranslationContextType {
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
  language: LanguageKey;
}

const TranslationContext = createContext<TranslationContextType | undefined>(
  undefined,
);

export const TranslationProvider = ({
  children,
  language,
}: {
  children: ReactNode;
  language: LanguageCode;
}) => {
  const t = (
    key: TranslationKey,
    params?: Record<string, string | number>,
  ): string => {
    let text = translations[language as LanguageKey][key];

    if (!text) {
      console.warn(`Translation key not found: ${key}`);
      return key;
    }

    if (params) {
      Object.entries(params).forEach(([paramKey, value]) => {
        text = text.replace(`{${paramKey}}`, String(value));
      });
    }

    return text;
  };

  return (
    <TranslationContext.Provider
      value={{ t, language: language as LanguageKey }}
    >
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error("useTranslation must be used within a TranslationProvider");
  }
  return context;
};
