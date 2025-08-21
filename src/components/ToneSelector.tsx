// src/components/ToneSelector.tsx
import { useState } from "react";
import { ToneValues } from "../constants/ToneValues";
import type { ToneInterface, CustomToneInterface } from "../types/types";
import CustomToneModal from "./CustomToneModal";

interface ToneSelectorProps {
  selectedTone: ToneInterface | CustomToneInterface;
  onToneChange: (tone: ToneInterface | CustomToneInterface) => void;
  customTones: CustomToneInterface[];
  onCustomToneAdd: (customTone: CustomToneInterface) => void;
  onCustomToneDelete: (toneId: string) => void;
  disabled?: boolean;
  className?: string;
}

function ToneSelector({
  selectedTone,
  onToneChange,
  customTones,
  onCustomToneAdd,
  onCustomToneDelete,
  disabled = false,
  className = "",
}: ToneSelectorProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleToneChange = (tone: ToneInterface | CustomToneInterface) => {
    if (!disabled) {
      onToneChange(tone);
    }
  };

  const handleKeyDown = (
    event: React.KeyboardEvent,
    tone: ToneInterface | CustomToneInterface
  ) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleToneChange(tone);
    }
  };

  const handleCustomToneAdd = (customTone: CustomToneInterface) => {
    onCustomToneAdd(customTone);
    // Sélectionner automatiquement le nouveau ton créé
    onToneChange(customTone);
  };

  const handleDeleteCustomTone = (e: React.MouseEvent, toneId: string) => {
    e.stopPropagation(); // Empêcher la sélection du ton
    if (
      window.confirm("Êtes-vous sûr de vouloir supprimer ce ton personnalisé ?")
    ) {
      onCustomToneDelete(toneId);

      // Si le ton supprimé était sélectionné, sélectionner le premier ton par défaut
      if ("id" in selectedTone && selectedTone.id === toneId) {
        onToneChange(ToneValues[1]); // Sarcastique par défaut
      }
    }
  };

  const isSelected = (tone: ToneInterface | CustomToneInterface): boolean => {
    if ("id" in tone && "id" in selectedTone) {
      return tone.id === selectedTone.id;
    }
    if ("toneText" in tone && "toneText" in selectedTone) {
      return tone.toneText === selectedTone.toneText;
    }
    return false;
  };

  const allTones = [...ToneValues, ...customTones];

  return (
    <div className={className}>
      <div className="flex justify-between items-center mb-2">
        <label className="block text-lg font-medium text-gray-300">
          Choisir le ton de la traduction
        </label>
        <button
          onClick={() => setIsModalOpen(true)}
          disabled={disabled}
          className="text-sm bg-emerald-600 cursor-pointer hover:bg-emerald-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-3 py-1 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          Ajouter un ton
        </button>
      </div>

      <div
        role="radiogroup"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3"
        aria-label="Sélection du ton de traduction"
      >
        {allTones.map((tone) => {
          const selected = isSelected(tone);
          const isCustomTone = "id" in tone;
          const displayName = isCustomTone ? tone.name : tone.toneText;
          const isPreferred =
            !isCustomTone && "tonePref" in tone && tone.tonePref;

          return (
            <div
              key={isCustomTone ? tone.id : tone.toneText}
              className="relative"
            >
              {/* Bouton principal (sélection du ton) */}
              <button
                type="button"
                role="radio"
                aria-checked={selected}
                aria-label={`Ton ${displayName}${
                  isPreferred ? " (recommandé)" : ""
                }`}
                disabled={disabled}
                onClick={() => handleToneChange(tone)}
                onKeyDown={(e) => handleKeyDown(e, tone)}
                className={`
          w-full text-xs sm:text-sm lg:text-base
          cursor-pointer flex items-center justify-center 
          text-center py-2 px-2 rounded-lg font-medium 
          transition-all duration-200 relative
          disabled:opacity-50 disabled:cursor-not-allowed
          ${
            selected
              ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:hover:bg-gray-700"
          }
          ${isCustomTone ? "border-1 border-emerald-500/30" : ""}
        `}
              >
                <span className="flex-1 truncate">{displayName}</span>
              </button>

              {/* Bouton de suppression positionné en absolu */}
              {isCustomTone && !disabled && (
                <button
                  onClick={(e) => handleDeleteCustomTone(e, tone.id)}
                  className="absolute top-1 right-1 p-1 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-900/20 rounded transition-colors"
                  aria-label={`Supprimer le ton ${tone.name}`}
                  title="Supprimer ce ton personnalisé"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}

              {/* Badge "Meilleur choix" */}
              {isPreferred && (
                <div
                  className="absolute -top-2 -right-0 rounded-full shadows-lg bg-white px-1.5"
                  aria-hidden="true"
                  title="Meilleur choix"
                >
                  <p className="text-emerald-600 flex justify-between items-center gap-1">
                    <span className="text-xs">Populaire</span>
                    <span className="text-sm">★</span>
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Tooltip/Info sur les tons personnalisés */}
      {customTones.length > 0 && (
        <div className="mt-3 p-2 bg-emerald-900/10 border border-emerald-500/20 rounded-lg">
          <p className="text-xs text-emerald-300">
            Les tons personnalisés sont générés par IA et sauvegardés
            localement. Supprimez-les avec <span className="text-sm">x</span>
          </p>
        </div>
      )}

      {/* Modal pour créer un ton personnalisé */}
      <CustomToneModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleCustomToneAdd}
      />
    </div>
  );
}

export default ToneSelector;
