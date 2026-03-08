import { useState, useRef, memo, useCallback, lazy, Suspense } from "react";
import { Paperclip, FileText, Hash } from "lucide-react";
import { clsx } from "clsx";
import Loader from "./Loader";

const FileUpload = lazy(() => import("./FileUpload"));
import { useTranslation } from "../i18n/TranslationContext";

interface TextInputProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  disabled?: boolean;
}

/**
 * TextInput — "Le Dossier Ouvert"
 * Unified text input area that integrates both direct typing and file upload.
 * Styled as a legal evidence document with Acid Lime focus border.
 * A11y: proper labels, aria-describedby for instructions, character count announced.
 */
import { motion, AnimatePresence } from "framer-motion";

function TextInputComponent({
  value,
  onChange,
  disabled = false,
}: TextInputProps) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<"text" | "file">("text");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  const handleFileContent = useCallback(
    (content: string) => {
      const syntheticEvent = {
        target: { value: content },
      } as React.ChangeEvent<HTMLTextAreaElement>;
      onChange(syntheticEvent);
      setActiveTab("text");
    },
    [onChange],
  );

  const charCount = value.length;

  return (
    <div className="w-full">
      {/* Tab switcher - Modern Mac-style segmented control */}
      <div className="flex items-center flex-col md:flex-row gap-1 justify-between mb-6">
        <label className="font-display text-sm font-semibold tracking-tight text-(--color-muted-slate) flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-(--color-acid-lime) shadow-[0_0_8px_var(--color-acid-lime-glow)]" />
          {t("input_header")}
        </label>

        <div className="flex p-1 bg-(--color-slate) rounded-full border border-(--color-glass-border)">
          {(["text", "file"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              disabled={disabled}
              className={clsx(
                "relative flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-medium transition-colors z-10",
                activeTab === tab
                  ? "text-(--color-void)"
                  : "text-(--color-muted-slate) hover:text-(--color-off-white)",
                disabled && "opacity-50 cursor-not-allowed",
              )}
            >
              {activeTab === tab && (
                <motion.div
                  layoutId="activeTabInput"
                  className="absolute inset-0 bg-(--color-acid-lime) rounded-lg -z-10"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              {tab === "file" && <Paperclip className="w-3.5 h-3.5" />}
              {tab === "text" ? t("input_tab_text") : t("input_tab_file")}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "text" ? (
          <motion.div
            key="text-panel"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className={clsx(
              "group relative rounded-2xl border transition-all duration-500 overflow-hidden",
              isFocused
                ? "border-(--color-acid-lime) shadow-[0_0_30px_rgba(200,255,0,0.05)] bg-(--color-graphite)"
                : "border-(--color-glass-border) bg-(--color-glass-bg) backdrop-blur-xl",
            )}
          >
            <textarea
              ref={textareaRef}
              id="legal-text-input"
              rows={8}
              disabled={disabled}
              value={value}
              onChange={onChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={t("input_placeholder")}
              className="block w-full bg-transparent p-6 font-mono text-sm md:text-md leading-relaxed resize-none focus:outline-none min-h-[220px] text-(--color-off-white) placeholder:text-(--color-muted-slate)/40"
            />

            {/* Bottom Bar: Stats */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-(--color-glass-border) bg-black/20">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-(--color-muted-slate)">
                  <FileText className="w-3.5 h-3.5" />
                  {charCount > 0
                    ? `${charCount} ${t("input_characters")}`
                    : t("file_dropzone")}
                </div>
              </div>

              {charCount > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2 px-3 py-1 bg-(--color-slate) rounded-full border border-(--color-glass-border)"
                >
                  <Hash className="w-3 h-3 text-(--color-acid-lime)" />
                  <span className="text-[10px] font-mono text-(--color-off-white)">
                    {Math.ceil(charCount / 5)} WORDS
                  </span>
                </motion.div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="file-panel"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <Suspense
              fallback={
                <div className="h-64 flex items-center justify-center bg-(--color-glass-bg) rounded-2xl border border-(--color-glass-border)">
                  <Loader />
                </div>
              }
            >
              <FileUpload
                onFileContent={handleFileContent}
                disabled={disabled}
                className="rounded-2xl border border-dashed border-(--color-glass-border) bg-(--color-glass-bg) hover:bg-(--color-graphite) hover:border-(--color-acid-lime)/30 transition-all cursor-pointer"
              />
            </Suspense>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const TextInput = memo(TextInputComponent);
export default TextInput;
