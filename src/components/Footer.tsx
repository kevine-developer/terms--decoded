import { useState, useEffect, memo } from "react";
import { Code2, Users } from "lucide-react";
import { useTranslation } from "../i18n/TranslationContext";

/**
 * Footer — Minimalist brutalist footer with satirical community counter.
 * Uses semantic <footer> with proper content info role.
 */
function FooterComponent() {
  const { t } = useTranslation();
  const [count, setCount] = useState(1337);

  // Slowly increment the counter for fun
  useEffect(() => {
    const interval = setInterval(() => {
      setCount((c) => c + Math.floor(Math.random() * 3) + 1);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="text-center py-8 mt-auto relative" role="contentinfo">
      {/* Top separator */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-32"
        style={{ background: "var(--color-slate)" }}
        aria-hidden="true"
      />

      {/* Community counter */}
      <div
        className="font-mono text-xs mb-4 tracking-wide flex items-center justify-center gap-2"
        style={{ color: "var(--color-warm-gray)" }}
        aria-live="polite"
        aria-atomic="true"
      >
        <Users className="w-3 h-3" />
        <p>{t("footer_community", /* { count: count.toLocaleString() } */)}</p>
      </div>

      {/* Credits */}
      <p
        className="font-mono text-xs flex items-center justify-center gap-2 flex-wrap"
        style={{ color: "var(--color-warm-gray)" }}
      >
        <span className="flex items-center gap-1.5">
          {t("footer_made_with")} {" "}
          {t("footer_by")}
        </span>
        <a
          href="https://kevine-dev.link/"
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors duration-300 underline underline-offset-4 flex items-center gap-1 font-bold"
          style={{ color: "var(--color-lavender)" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.color = "var(--color-acid-lime)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = "var(--color-lavender)")
          }
          aria-label="Visiter le profil de DevEnGalère (ouvre un nouvel onglet)"
        >
          <Code2 className="w-3 h-3" />
          DevEnGalère
        </a>
        <span className="text-(--color-slate) mx-1">|</span>
        <a
          href="https://github.com/kevine-developer/terms--decoded"
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors duration-300 underline underline-offset-4 flex items-center gap-1 font-bold"
          style={{ color: "var(--color-lavender)" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.color = "var(--color-acid-lime)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = "var(--color-lavender)")
          }
          aria-label="Contribuer sur GitHub (ouvre un nouvel onglet)"
        >
          {t("footer_open_source")}
        </a>
      </p>

      {/* License & Data Policy */}
      <p
        className="font-mono text-[11px] mt-2"
        style={{ color: "var(--color-warm-gray)" }}
      >
        Released under MIT License. All data processing is local/transient via
        Gemini API.
      </p>

      {/* Disclaimer */}
      <p
        className="font-mono text-xs mt-4 max-w-md mx-auto"
        style={{ color: "var(--color-warm-gray)" }}
      >
        {t("output_disclaimer")}
      </p>
    </footer>
  );
}

const Footer = memo(FooterComponent);
export default Footer;
