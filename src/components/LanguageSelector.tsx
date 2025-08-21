// src/components/LanguageSelector.tsx
import { LanguageValues } from "../constants/LanguageValues";
import type { LanguageInterface } from "../types/types";

interface LanguageSelectorProps {
  selectedLanguage: LanguageInterface;
  onLanguageChange: (language: LanguageInterface) => void;
  disabled?: boolean;
  className?: string;
}

function LanguageSelector({
  selectedLanguage,
  onLanguageChange,
  disabled = false,
  className = "",
}: LanguageSelectorProps) {
  const handleLanguageChange = (language: LanguageInterface) => {
    if (!disabled) {
      onLanguageChange(language);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent, language: LanguageInterface) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleLanguageChange(language);
    }
  };

  return (
    <div className={className}>
      <div
        role="radiogroup"
        className="flex gap-3"
        aria-label="Sélection de la langue de réponse"
      >
        {LanguageValues.map((language) => {
          const isSelected = selectedLanguage.code === language.code;
          return (
            <div key={language.code} className="relative">
              <button
                type="button"
                role="radio"
                aria-checked={isSelected}
                aria-label={`Langue ${language.label}`}
                disabled={disabled}
                onClick={() => handleLanguageChange(language)}
                onKeyDown={(e) => handleKeyDown(e, language)}
                className={`
                  flex items-center gap-2 p-1 rounded-lg font-medium 
                  transition-all duration-200 cursor-pointer
                  focus:outline-none focus:ring-2 focus:ring-offset-2 
                  focus:ring-offset-gray-900 focus:ring-emerald-500
                  disabled:opacity-50 disabled:cursor-not-allowed
                  ${
                    isSelected
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:hover:bg-gray-700"
                  }
                `}
              >
                <span className="text-sm">{language.label}</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default LanguageSelector;