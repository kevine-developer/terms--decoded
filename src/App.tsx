import { useCallback, useState } from "react";

import TextInput from "./components/TextInput";
import ToneSelector from "./components/ToneSelector";
import { EXAMPLE_TEXT } from "./constants/constants";
import { Tone } from "./types/types";
import ActionButton from "./components/ActionButton";
import Loader from "./components/Loader";
import OutputDisplay from "./components/OutputDisplay";
import { reformulateText } from "../services/geminiService";

function App() {
  const [inputText, setInputText] = useState<string>(EXAMPLE_TEXT);
  const [selectedTone, setSelectedTone] = useState<Tone>(Tone.Sarcastic);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [outputText, setOutputText] = useState<string>("");

  const handleReformulate = useCallback(async () => {
    if (!inputText.trim()) {
      setError("Veuillez coller le charabia juridique avant de continuer.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setOutputText("");

    try {
      const result = await reformulateText(inputText, selectedTone);
      setOutputText(result);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("Une erreur cosmique inattendue est survenue.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [inputText, selectedTone]);

  return (
    <main className="flex-grow container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/2 flex flex-col gap-6">
          <TextInput
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <ToneSelector
            selectedTone={selectedTone}
            onToneChange={setSelectedTone}
            className="mt-4"
            disabled={false}
          />
          <ActionButton
            onClick={handleReformulate}
            disabled={isLoading || !inputText.trim()}
          >
            {isLoading
              ? "Nos avocats-robots réfléchissent..."
              : "Déchiffrer ce charabia"}
          </ActionButton>
        </div>
        <div className="lg:w-1/2 flex flex-col">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-1 flex-grow min-h-[300px] lg:min-h-0">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <Loader />
              </div>
            ) : (
              <OutputDisplay outputText={outputText} error={error} />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default App;
