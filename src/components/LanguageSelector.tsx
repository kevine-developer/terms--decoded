import { memo } from "react";
import { LanguageValues } from "../constants/LanguageValues";
import type { LanguageInterface } from "../types/types";

interface LanguageSelectorProps {
  selectedLanguage: LanguageInterface;
  onLanguageChange: (language: LanguageInterface) => void;
  disabled?: boolean;
  className?: string;
}

/**
 * LanguageSelector — Standard language switcher styled for Brutalist Editorial.
 * A11y: radiogroup role, aria-checked, keyboard navigation.
 */
function LanguageSelectorComponent({
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

  const handleKeyDown = (
    event: React.KeyboardEvent,
    language: LanguageInterface,
  ) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleLanguageChange(language);
    }
  };

  return (
    <div className={className}>
      <div
        role="radiogroup"
        className="flex gap-2"
        aria-label="Sélection de la langue"
      >
        {LanguageValues.map((language) => {
          const isSelected = selectedLanguage.code === language.code;
          return (
            <button
              key={language.code}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-label={`Langue ${language.label}`}
              disabled={disabled}
              onClick={() => handleLanguageChange(language)}
              onKeyDown={(e) => handleKeyDown(e, language)}
              className={`
                px-3 py-1.5 rounded font-mono text-xs transition-all duration-200 cursor-pointer
                focus-visible:outline-2 focus-visible:outline-offset-2
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
              style={{
                background: isSelected
                  ? "var(--color-acid-lime)"
                  : "var(--color-slate)",
                color: isSelected
                  ? "var(--color-void)"
                  : "var(--color-off-white)",
                border: isSelected
                  ? "1px solid var(--color-acid-lime)"
                  : "1px solid var(--color-slate)",
                fontWeight: isSelected ? 600 : 400,
              }}
            >
              {language.code.toUpperCase()}
            </button>
          );
        })}
      </div>
    </div>
  );
}

const LanguageSelector = memo(LanguageSelectorComponent);
export default LanguageSelector;
