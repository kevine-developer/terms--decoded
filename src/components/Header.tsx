import { memo } from "react";
import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import { useTranslation } from "../i18n/TranslationContext";

function HeaderComponent() {
  const { t } = useTranslation();

  const titleParts = t("meta_title").split(" ");
  const mainTitle = titleParts.slice(0, -1).join(" ");
  const highlight = titleParts[titleParts.length - 1];

  return (
    <header className="text-center py-4 md:py-10 relative z-10" role="banner">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-(--color-glass-border) bg-(--color-glass-bg) mb-6 backdrop-blur-md">
          <ShieldCheck className="w-3.5 h-3.5 text-(--color-acid-lime)" />
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-(--color-muted-slate)">
            {t("header_slogan")}
          </span>
        </div>

        <h1 className="font-display text-2xl sm:text-4xl md:text-5xl font-bold tracking-tighter px-4 text-(--color-off-white)">
          {mainTitle}{" "}
          <span className="text-(--color-acid-lime) relative inline-block">
            {highlight}
            <motion.span
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="absolute -bottom-1 left-0 h-[3px] bg-(--color-acid-lime) rounded-full opacity-40"
            />
          </span>
        </h1>

        <p className="font-body text-sm md:text-md mt-6 max-w-2xl mx-auto text-(--color-muted-slate) leading-relaxed px-6">
          {t("header_subtitle")}
        </p>
      </motion.div>
    </header>
  );
}

const Header = memo(HeaderComponent);
export default Header;
