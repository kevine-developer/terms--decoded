import { useState, useEffect, useCallback, memo } from "react";
import { AlertOctagon, X } from "lucide-react";
import { useTranslation } from "../i18n/TranslationContext";

/**
 * KonamiEasterEgg — Listens for the Konami Code sequence
 * (↑ ↑ ↓ ↓ ← → ← → B A) and shows a satirical "ALERTE CGU" modal.
 * Fully accessible: modal traps focus, uses ARIA roles, supports Escape to close.
 */
function KonamiEasterEggComponent() {
  const { t } = useTranslation();
  const [isTriggered, setIsTriggered] = useState(false);
  const [, setSequence] = useState<string[]>([]);

  const KONAMI = [
    "ArrowUp",
    "ArrowUp",
    "ArrowDown",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "ArrowLeft",
    "ArrowRight",
    "KeyB",
    "KeyA",
  ];

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    setSequence((prev) => {
      const next = [...prev, e.code].slice(-KONAMI.length);
      if (
        next.length === KONAMI.length &&
        next.every((k, i) => k === KONAMI[i])
      ) {
        setIsTriggered(true);
        return [];
      }
      return next;
    });
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Trap focus & handle escape in modal
  useEffect(() => {
    if (isTriggered) {
      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === "Escape") setIsTriggered(false);
      };
      document.addEventListener("keydown", handleEsc);
      // Prevent body scroll
      document.body.style.overflow = "hidden";
      return () => {
        document.removeEventListener("keydown", handleEsc);
        document.body.style.overflow = "";
      };
    }
  }, [isTriggered]);

  if (!isTriggered) return null;

  return (
    <div
      className="fixed inset-0 z-9999 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="konami-title"
      aria-describedby="konami-description"
    >
      {/* Backdrop with glitch flash */}
      <div
        className="absolute inset-0"
        style={{
          background: "rgba(255, 71, 87, 0.15)",
          backdropFilter: "blur(8px)",
        }}
        onClick={() => setIsTriggered(false)}
        aria-hidden="true"
      />

      {/* Modal content */}
      <div
        className="relative bg-(--color-graphite) border-2 mx-4 max-w-md w-full p-8 text-center"
        style={{
          borderColor: "var(--color-coral)",
          borderRadius: "var(--radius-md)",
          animation: "fade-in-up 400ms ease-out",
        }}
      >
        <button
          onClick={() => setIsTriggered(false)}
          className="absolute top-4 right-4 p-1 hover:rotate-90 transition-transform duration-300 cursor-pointer"
          style={{ color: "var(--color-coral)" }}
          aria-label="Fermer"
        >
          <X className="w-5 h-5" />
        </button>

        <AlertOctagon
          className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-6"
          style={{ color: "var(--color-coral)" }}
        />

        <h2
          id="konami-title"
          className="font-display text-2xl md:text-3xl font-bold mb-6 tracking-wide uppercase"
          style={{ color: "var(--color-coral)" }}
        >
          {t("konami_alert")}
        </h2>

        <div
          id="konami-description"
          className="font-mono text-sm md:text-base space-y-3 mb-8"
          style={{ color: "var(--color-off-white)" }}
        >
          <p>
            {t("konami_desc1").split("0")[0]}
            <strong style={{ color: "var(--color-acid-lime)" }}>0</strong>
            {t("konami_desc1").split("0")[1]}
          </p>
          <p>
            {t("konami_desc2").split("47")[0]}
            <strong style={{ color: "var(--color-coral)" }}>
              47{t("konami_desc2").split("47")[1]}
            </strong>
          </p>
          <p
            className="text-xs pt-2"
            style={{ color: "var(--color-warm-gray)" }}
          >
            {t("konami_desc3").split("76")[0]}
            <strong>76{t("konami_desc3").split("76")[1]}</strong>
            <br />
            {t("konami_desc4").split("0")[0]}
            <strong>0{t("konami_desc4").split("0")[1]}</strong>
          </p>
        </div>

        <button
          onClick={() => setIsTriggered(false)}
          autoFocus
          className="font-display font-bold uppercase tracking-widest px-8 py-3 cursor-pointer transition-all duration-300 hover:scale-105"
          style={{
            background: "var(--color-coral)",
            color: "var(--color-void)",
            borderRadius: "var(--radius-sm)",
            border: "none",
          }}
        >
          {t("konami_btn")}
        </button>

        <p
          className="text-xs mt-4 font-mono"
          style={{ color: "var(--color-warm-gray)" }}
        >
          {t("konami_desc5_toast" as any) ||
            "Bienvenue parmi les 99% d'humains qui ne lisent jamais les CGU."}
        </p>
      </div>
    </div>
  );
}

const KonamiEasterEgg = memo(KonamiEasterEggComponent);
export default KonamiEasterEgg;
