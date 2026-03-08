import { memo } from "react";
import { clsx } from "clsx";
import {
  MessageSquare,
  Sparkles,
  Code,
  AlertTriangle,
  Star,
} from "lucide-react";
import { ToneValues } from "../constants/ToneValues";
import type { ToneInterface } from "../types/types";
import { useTranslation } from "../i18n/TranslationContext";

interface ToneSelectorProps {
  selectedTone: ToneInterface;
  onToneChange: (tone: ToneInterface) => void;
  disabled?: boolean;
  className?: string;
}

// Tone metadata pour récupérer les icônes (on gère les textes via t() mtn)
const TONE_META_ICONS: Record<string, any> = {
  Simple: MessageSquare,
  Sarcastique: Sparkles,
  Développeur: Code,
  "Essentiel & Risques": AlertTriangle,
};

/**
 * ToneSelector — "Les Cartes de Personnalité"
 * Each tone is a personality card styled like a minimalist RPG/tarot card.
 * A11y: radiogroup role, keyboard navigation (arrow keys), proper ARIA labels.
 */
import { motion } from "framer-motion";

function ToneSelectorComponent({
  selectedTone,
  onToneChange,
  disabled = false,
  className = "",
}: ToneSelectorProps) {
  const { t } = useTranslation();

  const handleToneChange = (tone: ToneInterface) => {
    if (!disabled) onToneChange(tone);
  };

  const isSelected = (tone: ToneInterface): boolean => {
    return tone.toneText === selectedTone.toneText;
  };

  return (
    <div className={className}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-display text-sm font-semibold tracking-tight text-(--color-muted-slate) flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-(--color-acid-lime) shadow-[0_0_8px_var(--color-acid-lime-glow)]" />
          {t("tone_label")}
        </h2>
      </div>

      <div role="radiogroup" className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {ToneValues.map((tone) => {
          const selected = isSelected(tone);
          const translationKeyBase = tone.toneText
            .toLowerCase()
            .replace(/ & /g, "_")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");

          const displayName =
            t(`tone_name_${translationKeyBase}` as any) || tone.toneText;
          const subtitle = t(`tone_sub_${translationKeyBase}` as any) || "";
          const Icon = TONE_META_ICONS[tone.toneText] || MessageSquare;
          const isPreferred = tone.tonePref;

          return (
            <motion.button
              key={tone.toneText}
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleToneChange(tone)}
              disabled={disabled}
              className={clsx(
                "relative flex flex-col items-start p-2 rounded-2xl border transition-all duration-300 text-left overflow-hidden",
                selected
                  ? "border-(--color-acid-lime) bg-(--color-graphite) shadow-[0_0_25px_rgba(200,255,0,0.06)]"
                  : "border-(--color-glass-border) bg-(--color-glass-bg) backdrop-blur-md grayscale opacity-70 hover:grayscale-0 hover:opacity-100",
                disabled && "opacity-40 cursor-not-allowed pointer-events-none",
              )}
            >
              {/* Selection Glow */}
              {selected && (
                <motion.div
                  layoutId="toneGlow"
                  className="absolute -top-10 -right-10 w-24 h-24 bg-(--color-acid-lime) blur-[60px] opacity-20"
                />
              )}

              <div
                className={clsx(
                  "p-2 rounded-xl mb-4 border transition-colors",
                  selected
                    ? "bg-(--color-acid-lime) border-transparent text-(--color-void)"
                    : "bg-(--color-slate) border-(--color-glass-border) text-(--color-muted-slate)",
                )}
              >
                <Icon className="w-3 h-3 sm:w-4 sm:h-4" />
              </div>

              <div className="flex flex-col gap-1">
                <span
                  className={clsx(
                    "font-display text-sm font-bold tracking-tight uppercase",
                    selected
                      ? "text-(--color-acid-lime)"
                      : "text-(--color-off-white)",
                  )}
                >
                  {displayName}
                </span>

                {subtitle && (
                  <span className="font-mono text-[10px] text-(--color-muted-slate) leading-tight line-clamp-2">
                    {subtitle}
                  </span>
                )}
              </div>

              {isPreferred && (
                <div className="absolute top-3 right-3 text-(--color-acid-lime) opacity-40">
                  <Star className="w-3 h-3 fill-current" />
                </div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

const ToneSelector = memo(ToneSelectorComponent);
export default ToneSelector;
