
import  { useState, useEffect } from 'react';

interface OutputDisplayProps {
  outputText: string;
  error: string | null;
}

interface CopyIconProps {
  className?: string;
}

const CopyIcon  = ({ className} : CopyIconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
);

const CheckIcon  = ({ className }: CopyIconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
);

const OutputDisplay = ({ outputText, error }: OutputDisplayProps ) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  const handleCopy = () => {
    if (outputText) {
      navigator.clipboard.writeText(outputText);
      setCopied(true);
    }
  };

  const hasContent = outputText || error;

  return (
    <div className="relative h-full w-full flex flex-col">
      <div className="flex justify-between items-center p-4 border-b border-gray-700">
        <h3 className="text-lg font-medium text-gray-300">Traduction en clair</h3>
        {outputText && !error && (
            <button
            onClick={handleCopy}
            className={`flex items-center gap-2 text-sm py-1 px-3 rounded-md transition-colors duration-200 ${
                copied
                ? 'bg-green-600 text-white'
                : 'bg-gray-600 hover:bg-gray-500 text-gray-200'
            }`}
            >
            {copied ? <CheckIcon className="w-4 h-4" /> : <CopyIcon className="w-4 h-4" />}
            {copied ? 'Copié !' : 'Copier'}
            </button>
        )}
      </div>

      <div className="p-6 overflow-y-auto flex-grow prose prose-invert prose-sm max-w-none prose-p:text-gray-300 prose-strong:text-white">
        {error && (
          <div className="text-red-400 bg-red-900/50 p-4 rounded-lg">
            <p className="font-bold">Erreur de traduction :</p>
            <p>{error}</p>
          </div>
        )}
        {!error && outputText && (
          <p style={{ whiteSpace: 'pre-wrap' }}>{outputText}</p>
        )}
        {!hasContent && (
           <div className="h-full flex flex-col items-center justify-center text-center text-gray-500">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
            <p className="font-medium">Le résultat de la traduction apparaîtra ici.</p>
            <p className="text-sm">Prêt à transformer du charabia en quelque chose d'utile (ou de drôle) ?</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OutputDisplay;
