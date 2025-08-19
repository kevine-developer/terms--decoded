import { useState } from 'react';
import FileUpload from './FileUpload';

interface TextInputProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  disabled?: boolean;
}

function TextInput({ value, onChange, disabled = false }: TextInputProps) {
  const [activeTab, setActiveTab] = useState<'text' | 'file'>('text');

  const handleFileContent = (content: string) => {
    // Créer un événement synthétique pour maintenir la compatibilité
    const syntheticEvent = {
      target: {
        value: content
      }
    } as React.ChangeEvent<HTMLTextAreaElement>;
    
    onChange(syntheticEvent);
    
    // Passer automatiquement à l'onglet texte pour voir le contenu
    setActiveTab('text');
  };

  return (
    <div className="space-y-4">
      <div>
        <label
          htmlFor="legal-text"
          className="block text-lg font-medium text-gray-300 mb-2"
        >
          Jargon juridique à décoder
        </label>
        
        {/* Onglets */}
        <div className="flex mb-3 bg-gray-800 rounded-lg p-1 gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('text')}
            disabled={disabled}
            className={`
              flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all duration-200
              ${activeTab === 'text'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            Saisir le texte
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('file')}
            disabled={disabled}
            className={`
              flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all duration-200
              ${activeTab === 'file'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
             Importer un fichier
          </button>
        </div>
      </div>

      {/* Contenu des onglets */}
      {activeTab === 'text' ? (
        <div className="space-y-2">
          <textarea
            id="legal-text"
            name="legal-text"
            rows={12}
            disabled={disabled}
            className={`
              block w-full bg-gray-800 border border-gray-700 rounded-lg p-4 
              text-gray-200 font-mono text-sm focus:ring-2 focus:ring-indigo-500 
              focus:border-indigo-500 transition-colors duration-200 resize-y
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
            placeholder="Collez ici les 30 pages que vous avez fait semblant de lire..."
            value={value}
            onChange={onChange}
          />
          
{/*           {value && (
            <div className="flex justify-between items-center text-xs text-gray-500">
              <span>{value.length.toLocaleString()} caractères</span>
              <span>
                ~{Math.ceil(value.split(/\s+/).length / 250)} min de lecture
              </span>
            </div>
          )} */}
        </div>
      ) : (
        <FileUpload
          onFileContent={handleFileContent}
          disabled={disabled}
          className=" "
        />
      )}

    </div>
  );
}

export default TextInput;