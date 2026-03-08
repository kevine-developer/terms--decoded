import { useRef, useState, memo } from "react";
import { FileUp, AlertCircle } from "lucide-react";
import { isFileSupported, readFile } from "../utils/fileReaderService";
import { useTranslation } from "../i18n/TranslationContext";

interface FileUploadProps {
  onFileContent: (content: string) => void;
  disabled?: boolean;
  className?: string;
}

/**
 * FileUpload — "Dépôt de Pièces"
 * Brutalist design with dashed Acid Lime borders when active.
 * A11y: focus management, keyboard support (via clicking the label), error alerts.
 */
function FileUploadComponent({
  onFileContent,
  disabled = false,
  className = "",
}: FileUploadProps) {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileSelect = async (file: File) => {
    // Max size 10MB
    if (file.size > 10 * 1024 * 1024) {
      setUploadError(t("file_too_large", { name: file.name }));
      return;
    }

    // Check supported format
    if (!isFileSupported(file)) {
      setUploadError(
        t("file_unsupported", { ext: file.name.split(".").pop() || "" }),
      );
      return;
    }

    setIsProcessing(true);
    setUploadError(null);

    try {
      const result = await readFile(file);
      if (result.success && result.text) {
        onFileContent(result.text);
        setUploadError(null);
      } else {
        setUploadError(result.error || t("file_process_error"));
      }
    } catch (error) {
      console.error("File reading error:", error);
      setUploadError(t("file_unexpected_error"));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) handleFileSelect(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled && !isProcessing) setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (disabled || isProcessing) return;
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelect(file);
  };

  const openFileDialog = () => {
    if (!disabled && !isProcessing && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openFileDialog}
        className={`
          relative border-2 border-dashed rounded-md p-8 text-center cursor-pointer
          transition-all duration-300 min-h-[220px] flex flex-col items-center justify-center
          ${
            dragActive
              ? "border-(--color-acid-lime) bg-(--color-acid-lime)/5 scale-[1.01]"
              : "border-(--color-slate) hover:border-(--color-lavender) bg-(--color-graphite)"
          }
          ${disabled || isProcessing ? "opacity-50 cursor-not-allowed" : ""}
        `}
        role="button"
        aria-label="Cliquer ou glisser-déposer un fichier pour importation"
        aria-busy={isProcessing}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openFileDialog();
          }
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx,.txt,.md"
          onChange={handleFileInputChange}
          disabled={disabled || isProcessing}
          className="hidden"
          aria-hidden="true"
        />

        {isProcessing ? (
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-2 border-(--color-acid-lime) border-t-transparent rounded-full animate-spin"></div>
            <p
              className="font-mono text-sm"
              style={{ color: "var(--color-off-white)" }}
            >
              {t("file_extracting")}
            </p>
          </div>
        ) : (
          <div className="space-y-4 flex flex-col items-center">
            <div style={{ color: "var(--color-slate)" }} aria-hidden="true">
              <FileUp className="w-12 h-12" />
            </div>
            <div>
              <p className="font-display font-bold text-sm uppercase tracking-wider mb-2">
                <span style={{ color: "var(--color-acid-lime)" }}>
                  {t("file_click_import")}
                </span>{" "}
                {t("file_or_drop")}
              </p>
              <p
                className="font-mono text-xs"
                style={{ color: "var(--color-warm-gray)" }}
              >
                {t("file_supported_formats")}
              </p>
            </div>
          </div>
        )}

        {/* Drop zone overlay */}
        {dragActive && !disabled && !isProcessing && (
          <div
            className="absolute inset-0 rounded-md flex items-center justify-center font-display font-bold uppercase tracking-widest text-sm"
            style={{
              background: "var(--color-acid-lime)",
              color: "var(--color-void)",
              opacity: 0.95,
            }}
          >
            {t("file_release_drop")}
          </div>
        )}
      </div>

      {uploadError && (
        <div
          className="mt-4 p-3 border font-mono text-xs rounded-md flex items-start gap-3"
          style={{
            background: "rgba(255, 71, 87, 0.1)",
            borderColor: "var(--color-coral)",
            color: "var(--color-coral)",
          }}
          role="alert"
        >
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <p>
            <strong>{t("file_error_prefix")}</strong> {uploadError}
          </p>
        </div>
      )}
    </div>
  );
}

const FileUpload = memo(FileUploadComponent);
export default FileUpload;
