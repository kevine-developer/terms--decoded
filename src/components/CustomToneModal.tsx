
// src/components/CustomToneModal.tsx
import { useState, useRef, useEffect, useCallback } from "react";
import type { CustomToneInterface } from "../types/types";
import { generateToneDescription } from "../utils/toneGenerator";

interface CustomToneModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (customTone: CustomToneInterface) => void;
}

function CustomToneModal({ isOpen, onClose, onSave }: CustomToneModalProps) {
  const [name, setName] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const modalRef = useRef<HTMLDivElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  // Focus automatique sur l'input du nom quand le modal s'ouvre
  useEffect(() => {
    if (isOpen && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [isOpen]);

  const handleClose = useCallback(() => {
    setName("");
    setError("");
    setIsGenerating(false);
    onClose();
  }, [onClose]);

  // Gestion de l'échappement pour fermer le modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, handleClose]);

  const handleSave = async () => {
    const trimmedName = name.trim();

    if (!trimmedName) {
      setError("Le nom du ton est obligatoire");
      return;
    }

    if (trimmedName.length < 3) {
      setError("Le nom doit contenir au moins 3 caractères");
      return;
    }

    if (trimmedName.length > 50) {
      setError("Le nom ne peut pas dépasser 50 caractères");
      return;
    }

    setIsGenerating(true);
    setError("");

    try {
      // Générer automatiquement la description basée sur le titre
      const generatedDescription = await generateToneDescription(trimmedName);

      const customTone: CustomToneInterface = {
        id: `custom-${Date.now()}`,
        name: trimmedName,
        description: generatedDescription,
        isCustom: true,
      };

      onSave(customTone);
      handleClose();
    } catch (error) {
      console.error("Erreur lors de la génération de la description:", error);
      setError(
        "Impossible de générer la description du ton. Vérifiez votre connexion et réessayez."
      );
      setIsGenerating(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className="bg-gray-800 border border-gray-700 rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">
            Créer un ton personnalisé
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors p-1"
            aria-label="Fermer"
          >
            <svg
              className="w-6 h-6"
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
        </div>

        {/* Form */}
        <div className="space-y-4">
          {/* Nom du ton */}
          <div>
            <label
              htmlFor="tone-name"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Nom du ton personnalisé
            </label>
            <input
              ref={nameInputRef}
              id="tone-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Professeur bienveillant, Ami rigolo, Expert accessible..."
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              maxLength={50}
              disabled={isGenerating}
            />
            <p className="text-xs text-gray-500 mt-1">
              {name.length}/50 caractères
            </p>
          </div>

          {/* Indicateur de génération */}
          {isGenerating && (
            <div className="flex items-center gap-3 p-3 bg-emerald-900/20 border border-emerald-700 rounded-lg">
              <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
              <div>
                <p className="text-emerald-300 font-medium">
                   Génération de la description en cours...
                </p>
                <p className="text-xs text-emerald-400 mt-1">
                  L'IA analyse votre titre pour créer le prompt parfait
                </p>
              </div>
            </div>
          )}

          {/* Message d'erreur */}
          {error && (
            <div className="bg-red-900/20 border border-red-700 rounded-lg p-3">
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={handleClose}
            disabled={isGenerating}
            className="flex-1 py-2 px-4 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed text-gray-300 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            disabled={!name.trim() || name.trim().length < 3 || isGenerating}
            className="flex-1 py-2 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Génération...
              </>
            ) : (
              <> Créer le ton</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CustomToneModal;
