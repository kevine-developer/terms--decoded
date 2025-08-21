import { useRef, useState } from 'react';
import { isFileSupported, readFile } from '../utils/fileReaderService';

interface FileUploadProps {
  onFileContent: (content: string) => void;
  disabled?: boolean;
  className?: string;
}

function FileUpload({ 
  onFileContent, 
  disabled = false, 
  className = '' 
}: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileSelect = async (file: File) => {
    // Taille max 10MB
    if (file.size > 10 * 1024 * 1024) {
      setUploadError(`❌ Le fichier "${file.name}" dépasse la taille maximale de 10MB.`);
      return;
    }

    // Vérifie format supporté
    if (!isFileSupported(file)) {
      setUploadError(
        `Format non supporté: ${file.name.split('.').pop()}. ` +
        'Formats acceptés: PDF, DOC, DOCX, TXT,MD.'
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
        setUploadError(result.error || 'Erreur inconnue lors de la lecture du fichier.');
      }
    } catch (error) {
      console.error('Erreur lors de la lecture du fichier:', error);
      setUploadError('Une erreur inattendue s\'est produite lors du traitement du fichier.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled && !isProcessing) {
      setDragActive(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Vérifie si on quitte réellement la zone
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (disabled || isProcessing) return;

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const openFileDialog = () => {
    if (!disabled && !isProcessing && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className={`${className}`}>
      {/* Zone de drop */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-4 text-center cursor-pointer
          transition-all duration-200 min-h-[200px] ease-in-out flex flex-col justify-center
          ${dragActive 
            ? 'border-emerald-400 bg-emerald-50/5 scale-[1.02]' 
            : 'border-gray-600 hover:border-gray-500'
          }
          ${disabled || isProcessing 
            ? 'opacity-50 cursor-not-allowed' 
            : 'hover:bg-gray-800/50'
          }
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx,.txt,.md"
          onChange={handleFileInputChange}
          disabled={disabled || isProcessing}
          className="hidden"
        />
        <div className="space-y-2">
          {isProcessing ? (
            <>
              <div className="mx-auto w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm text-gray-300">
                Extraction du contenu en cours...
              </p>
            </>
          ) : (
            <>
              <div className="mx-auto w-8 h-8 text-gray-400">
                📄
              </div>
              <div>
                <p className="text-sm text-gray-300">
                  <span className="font-medium text-emerald-400">Cliquez pour choisir</span>
                  {' '}ou glissez-déposez un fichier
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  PDF, DOC, DOCX, TXT (max 10MB)
                </p>
              </div>
            </>
          )}
        </div>

        {/* Indicateur de drag actif */}
        {dragActive && !disabled && !isProcessing && (
          <div className="absolute inset-0 bg-emerald-500/10 border-2 border-emerald-400 rounded-lg flex items-center justify-center">
            <p className="text-emerald-400 font-medium">
              Relâchez pour importer le fichier
            </p>
          </div>
        )}
      </div>

      {/* Messages d'erreur */}
      {uploadError && (
        <div className="mt-2 p-2 bg-red-900/20 border border-red-700 rounded text-red-300 text-sm">
          <span className="font-medium">❌ Erreur:</span> {uploadError}
        </div>
      )}
    </div>
  );
}

export default FileUpload;
