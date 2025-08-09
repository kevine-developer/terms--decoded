import type { Tone } from "../types/types";
import { Tone as ToneValues } from "../types/types";

interface ToneSelectorProps {
  selectedTone: Tone;
  onToneChange: (tone: Tone) => void;
  disabled?: boolean;
  className?: string;
}

function ToneSelector({
  selectedTone,
  onToneChange,
  disabled = false,
  className = "",
}: ToneSelectorProps) {
  const tones = Object.values(ToneValues) as readonly Tone[];

  const handleToneChange = (tone: Tone) => {
    if (!disabled) {
      onToneChange(tone);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent, tone: Tone) => {
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
        {tones.map((tone) => {
          const isSelected = selectedTone === tone;
          return (
            <button
              key={tone}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-label={`Ton ${tone}`}
              disabled={disabled}
              onClick={() => handleToneChange(tone)}
              onKeyDown={(e) => handleKeyDown(e, tone)}
              className={`
                w-full text-xs md:text-sm lg:text-base
                 cursor-pointer flex items-center justify-center 
                text-center py-3 px-4 rounded-lg font-medium 
                transition-all duration-200 
                focus:outline-none focus:ring-2 focus:ring-offset-2 
                focus:ring-offset-gray-900 focus:ring-purple-500
                disabled:opacity-50 disabled:cursor-not-allowed
                ${
                  isSelected
                    ? "bg-purple-600 hover:bg-purple-700 text-white shadow-lg"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:hover:bg-gray-700"
                }
              `
                .replace(/\s+/g, " ")
                .trim()}
            >
              {tone}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default ToneSelector;
