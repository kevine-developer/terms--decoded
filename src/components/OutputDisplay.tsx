// src/components/OutputDisplay.tsx
import { useState, useEffect } from "react";
import { parseMarkdown } from "../utils/parseMarkdown";
import { markdownToPlainText } from "../utils/markdownToPlainText";
import type { LanguageInterface } from "../types/types";

interface OutputDisplayProps {
  outputText: string;
  error: string | null;
  language: LanguageInterface;
}

interface CopyIconProps {
  className?: string;
}

const CopyIcon = ({ className }: CopyIconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
    />
  </svg>
);

const CheckIcon = ({ className }: CopyIconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 13l4 4L19 7"
    />
  </svg>
);

const OutputDisplay = ({ outputText, error, language }: OutputDisplayProps) => {
  const [copied, setCopied] = useState<"markdown" | "plain" | null>(null);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  const handleCopyMarkdown = () => {
    if (outputText) {
      navigator.clipboard.writeText(outputText);
      setCopied("markdown");
    }
  };

  const handleCopyPlain = () => {
    if (outputText) {
      const plainText = markdownToPlainText(outputText);
      navigator.clipboard.writeText(plainText);
      setCopied("plain");
    }
  };

  const hasContent = outputText || error;
  const renderedHTML = parseMarkdown(outputText);

  // Textes selon la langue
  const texts = {
    fr: {
      title: "Traduction en clair",
      copy: "Copier",
      markdown: "Markdown",
      plainText: "Texte brut",
      markdownCopied: "Markdown copié !",
      plainCopied: "Texte copié !",
      errorTitle: "Erreur de traduction :",
      resultWillAppear: "Le résultat de la traduction apparaîtra ici.",
      readyToTransform:
        "Prêt à transformer du charabia en quelque chose d'utile (ou de drôle) ?",
      markdownSupport: "  Support Markdown inclus !",
    },
    en: {
      title: "Plain translation",
      copy: "Copy",
      markdown: "Markdown",
      plainText: "Plain text",
      markdownCopied: "Markdown copied!",
      plainCopied: "Text copied!",
      errorTitle: "Translation error:",
      resultWillAppear: "The translation result will appear here.",
      readyToTransform:
        "Ready to transform gibberish into something useful (or funny)?",
      markdownSupport: "  Markdown support included!",
    },
  };

  const t = texts[language.code];

  return (
    <div className="relative w-full flex flex-col">
      <div className="flex justify-between items-center p-4 border-b border-gray-700">
        <h3 className="text-lg font-medium text-gray-300">{t.title}</h3>
        {outputText && !error && (
          <div className="flex gap-2 items-center">
            {/* Dropdown pour les options de copie */}
            <div className="relative group">
              <button className="flex items-center gap-2 text-sm py-1 px-3 rounded-md bg-gray-600 hover:bg-gray-500 text-gray-200 cursor-pointer transition-colors duration-200">
                {copied === "markdown" && (
                  <>
                    <CheckIcon className="w-4 h-4" />
                    {t.markdownCopied}
                  </>
                )}
                {copied === "plain" && (
                  <>
                    <CheckIcon className="w-4 h-4" />
                    {t.plainCopied}
                  </>
                )}
                {!copied && (
                  <>
                    <CopyIcon className="w-4 h-4" />
                    {t.copy}
                    <svg
                      className="w-3 h-3 ml-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </>
                )}
              </button>

              {/* Menu dropdown */}
              {!copied && (
                <div className="absolute right-0 top-full mt-1 bg-gray-700 border border-gray-600 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 ">
                  <button
                    onClick={handleCopyMarkdown}
                    className=" w-full  px-4 py-2 text-sm text-gray-200 hover:bg-gray-600 hover:text-white transition-colors duration-150 flex items-center rounded-t-lg"
                  >
                    {t.markdown}
                  </button>

                  <button
                    onClick={handleCopyPlain}
                    className="w-full  px-4 py-2 text-sm text-gray-200 hover:bg-gray-600 hover:text-white transition-colors duration-150 flex items-center gap-2 rounded-b-lg"
                  >
                    {t.plainText}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="p-6 overflow-y-auto flex-grow">
        {error && (
          <div className="text-red-400 bg-red-900/50 p-4 rounded-lg border border-red-700/50">
            <p className="font-bold mb-2">{t.errorTitle}</p>
            <p className="text-red-300">{error}</p>
          </div>
        )}

        {!error && outputText && (
          <div
            className="prose prose-invert max-w-none markdown-content"
            dangerouslySetInnerHTML={{ __html: renderedHTML }}
          />
        )}

        {!hasContent && (
          <div className="h-full flex flex-col items-center justify-center text-center text-gray-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mb-4 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
            <p className="font-medium text-gray-400 mb-2">
              {t.resultWillAppear}
            </p>
            <p className="text-sm text-gray-500">{t.readyToTransform}</p>
            <p className="text-xs text-emerald-400 mt-2">{t.markdownSupport}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OutputDisplay;
