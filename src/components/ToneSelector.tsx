import { ToneValues } from "../constants/ToneValues";
import type { ToneInterface } from "../types/types";

interface ToneSelectorProps {
  selectedTone: ToneInterface;
  onToneChange: (tone: ToneInterface) => void;
  disabled?: boolean;
  className?: string;
}

function ToneSelector({
  selectedTone,
  onToneChange,
  disabled = false,
  className = "",
}: ToneSelectorProps) {
  const handleToneChange = (tone: ToneInterface) => {
    if (!disabled) {
      onToneChange(tone);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent, tone: ToneInterface) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleToneChange(tone);
    }
  };

  return (
    <div className={className}>
      <label className="block text-lg font-medium text-gray-300 mb-2">
        Choisir le ton de la traduction
      </label>
      <div
        role="radiogroup"
        className="grid grid-cols-2 md:grid-cols-4 gap-3"
        aria-label="Sélection du ton de traduction"
      >
        {ToneValues.map((tone) => {
          const isSelected = selectedTone.toneText === tone.toneText;
          return (
            <div key={tone.toneText} className="relative">
              <button
                type="button"
                role="radio"
                aria-checked={isSelected}
                aria-label={`Ton ${tone.toneText}${
                  tone.tonePref ? " (recommandé)" : ""
                }`}
                disabled={disabled}
                onClick={() => handleToneChange(tone)}
                onKeyDown={(e) => handleKeyDown(e, tone)}
                className={`
                  w-full text-xs md:text-sm lg:text-base
                  cursor-pointer flex items-center justify-center 
                  text-center py-3 px-4 rounded-lg font-medium 
                  transition-all duration-200 
                  focus:outline-none focus:ring-2 focus:ring-offset-2 
                  focus:ring-offset-gray-900 focus:ring-emerald-500
                  disabled:opacity-50 disabled:cursor-not-allowed
                  ${
                    isSelected
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:hover:bg-gray-700"
                  }
                `
                  .replace(/\s+/g, " ")
                  .trim()}
              >
                {tone.toneText}
              </button>

              {tone.tonePref && (
                <div
                  className="absolute -top-2 -right-0
                  rounded-full    shadows-lg bg-white px-1.5"
                  aria-hidden="true"
                  title="Meilleur choix"
                >
                  <p className="text-emerald-600 flex justify-between items-center gap-1">
                    <span className="text-xs" >Meilleur choix</span>
                    <span className="text-sm ">★</span>
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ToneSelector;
