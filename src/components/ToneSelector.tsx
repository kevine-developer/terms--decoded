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
        onToneChange(ToneValues[1]); // Sarcastique par défaut (ou un autre choix par défaut)
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
      <div className="flex justify-between items-center mb-4">
        <label className="block text-xl font-semibold text-gray-100 tracking-wide">
           Ton de Traduction
        </label>
        <button
          onClick={() => setIsModalOpen(true)}
          disabled={disabled}
          className="text-sm bg-gray-700/50 backdrop-blur-sm cursor-pointer hover:bg-emerald-600/70 disabled:bg-gray-800 disabled:cursor-not-allowed text-emerald-300 hover:text-white border border-gray-600 hover:border-emerald-600 px-4 py-2 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 shadow-md"
        >
          <span className="font-medium">+ Ajouter un ton</span>
        </button>
      </div>

      <div
        role="radiogroup"
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
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
              className="relative group"
            >
              {/* Bouton principal (sélection du ton) */}
              <button
                type="button"
                role="radio"
                aria-checked={selected}
                aria-label={`Ton ${displayName}${
                  isPreferred ? " (populaire)" : ""
                }`}
                disabled={disabled}
                onClick={() => handleToneChange(tone)}
                onKeyDown={(e) => handleKeyDown(e, tone)}
                className={`
                  w-full text-base font-semibold 
                  cursor-pointer flex items-center justify-center 
                  text-center py-3 px-3 rounded-xl 
                  transition-all duration-300 transform 
                  disabled:opacity-40 disabled:cursor-not-allowed
                  
                  ${
                    selected
                      ? // État Sélectionné : Bordure accentuée, fond légèrement plus clair
                        "bg-emerald-600 text-white shadow-xl shadow-emerald-900/40 ring-2 ring-emerald-400/70"
                      : // État Normal : Fond sombre, bordure subtile
                        "bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700/70 hover:border-emerald-500/30 group-hover:-translate-y-0.5" // Ajout d'un petit effet de survol
                  }
                  ${isCustomTone ? "border-dashed border-emerald-500/40" : ""}
                `}
              >
                <span className="truncate">{displayName}</span>
              </button>

              {/* Bouton de suppression positionné en absolu */}
              {isCustomTone && !disabled && (
                <button
                  onClick={(e) => handleDeleteCustomTone(e, tone.id)}
                  className="absolute top-1 right-1 p-1.5 text-red-400 hover:text-white bg-gray-900/50 hover:bg-red-600 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 focus:opacity-100"
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

              {/* Badge "Populaire" raffiné */}
              {isPreferred && (
                <div
                  className="absolute -top-2 left-1/2 transform -translate-x-1/2 px-2 py-0.5 bg-emerald-500 rounded-full shadow-lg shadow-emerald-900/50"
                  aria-hidden="true"
                  title="Meilleur choix"
                >
                  <p className="text-xs font-bold text-white uppercase tracking-wider">
                    <span className="mr-1">★</span>Populaire
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Info-bulle pour les tons personnalisés */}
      {customTones.length > 0 && (
        <div className="mt-4 p-3 bg-gray-800/50 border border-emerald-500/30 rounded-xl">
          <p className="text-sm text-gray-400 flex items-center gap-2">
            <span className="text-emerald-400">i</span>
            Les tons **personnalisés** sont générés par IA et sauvegardés localement. Passez la souris pour l'option de suppression (<span className="text-red-400 font-bold">X</span>).
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