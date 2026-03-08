import { useState, useEffect, memo } from "react";
import { clsx } from "clsx";
import { Clipboard, FileText, Check, AlertCircle, Search } from "lucide-react";
import { parseMarkdown } from "../utils/parseMarkdown";
import { markdownToPlainText } from "../utils/markdownToPlainText";
import StampAnimation from "./StampAnimation";
import { useTranslation } from "../i18n/TranslationContext";

interface OutputDisplayProps {
  outputText: string;
  error: string | null;
}

import { motion, AnimatePresence } from "framer-motion";

function OutputDisplayComponent({ outputText, error }: OutputDisplayProps) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState<"markdown" | "plain" | null>(null);
  const [showStamp, setShowStamp] = useState(false);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(null), 2500);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  useEffect(() => {
    if (outputText) {
      setShowStamp(true);
    } else {
      setShowStamp(false);
    }
  }, [outputText]);

  const handleCopyMarkdown = async () => {
    if (outputText) {
      await navigator.clipboard.writeText(outputText);
      setCopied("markdown");
    }
  };

  const handleCopyPlain = async () => {
    if (outputText) {
      const plainText = markdownToPlainText(outputText);
      await navigator.clipboard.writeText(plainText);
      setCopied("plain");
    }
  };

  const renderedHTML = parseMarkdown(outputText);

  return (
    <section
      className="relative w-full flex flex-col bg-(--color-glass-bg) backdrop-blur-2xl rounded-2xl border border-(--color-glass-border) overflow-hidden shadow-2xl"
      aria-label={t("output_header")}
    >
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-(--color-glass-border) bg-black/20">
        <div className="flex items-center gap-4">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/40" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/40" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/40" />
          </div>
          <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-(--color-muted-slate)">
            {t("output_header")}
          </h2>
        </div>

        {outputText && !error && (
          <div className="flex gap-2">
            <button
              onClick={handleCopyMarkdown}
              className={clsx(
                "flex items-center gap-2 px-3 py-1.5 rounded-lg font-mono text-[10px] transition-all border",
                copied === "markdown"
                  ? "bg-(--color-acid-lime) border-transparent text-(--color-void)"
                  : "bg-(--color-slate) border-(--color-glass-border) text-(--color-off-white) hover:border-(--color-acid-lime)/30",
              )}
            >
              {copied === "markdown" ? (
                <Check className="w-3 h-3" />
              ) : (
                <Clipboard className="w-3 h-3" />
              )}
              {copied === "markdown" ? t("output_copied") : "MD"}
            </button>
            <button
              onClick={handleCopyPlain}
              className={clsx(
                "flex items-center gap-2 px-3 py-1.5 rounded-lg font-mono text-[10px] transition-all border",
                copied === "plain"
                  ? "bg-(--color-acid-lime) border-transparent text-(--color-void)"
                  : "bg-(--color-slate) border-(--color-glass-border) text-(--color-off-white) hover:border-(--color-acid-lime)/30",
              )}
            >
              {copied === "plain" ? (
                <Check className="w-3 h-3" />
              ) : (
                <FileText className="w-3 h-3" />
              )}
              {copied === "plain" ? t("output_copied") : "TEXT"}
            </button>
          </div>
        )}
      </div>

      <div className="p-6 md:p-10 grow relative min-h-[300px]">
        <AnimatePresence mode="wait">
          {error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-6 rounded-xl border border-red-500/20 bg-red-500/5 backdrop-blur-sm"
            >
              <div className="flex items-center gap-3 mb-3 text-red-400">
                <AlertCircle className="w-5 h-5" />
                <span className="font-display font-bold text-sm uppercase tracking-wider">
                  {t("output_error_title" as any) || "Decryption Failed"}
                </span>
              </div>
              <p className="font-mono text-sm text-red-200/80 leading-relaxed">
                {error}
              </p>
            </motion.div>
          ) : outputText ? (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <StampAnimation visible={showStamp} />
              <div
                className="markdown-content prose prose-invert prose-acid max-w-none"
                dangerouslySetInnerHTML={{ __html: renderedHTML }}
              />

              <div className="mt-12 pt-6 border-t border-(--color-glass-border) flex flex-col items-center gap-4">
                <p className="font-mono text-[10px] text-(--color-muted-slate) text-center max-w-md leading-relaxed opacity-50">
                  {t("output_disclaimer")}
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              className="h-full flex flex-col items-center justify-center text-center py-20"
            >
              <div className="relative mb-6">
                <Search className="w-16 h-16 text-(--color-muted-slate) opacity-20" />
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute inset-0 bg-(--color-acid-lime) blur-2xl rounded-full -z-10"
                />
              </div>
              <h3 className="font-display font-bold text-lg text-(--color-off-white) mb-2 uppercase tracking-tight">
                {t("output_empty_title" as any) || "Awaiting Signal"}
              </h3>
              <p className="font-mono text-xs text-(--color-muted-slate)">
                {t("output_empty_subtitle" as any) ||
                  "Insert legal jargon to decode."}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

const OutputDisplay = memo(OutputDisplayComponent);
export default OutputDisplay;
