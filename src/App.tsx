import { useState } from "react";
import "./App.css";
import TextInput from "./components/TextInput";
import ToneSelector from "./components/ToneSelector";
import { EXAMPLE_TEXT } from "./constants/constants";
import { Tone } from "./types/types";

function App() {
  const [inputText, setInputText] = useState<string>(EXAMPLE_TEXT);
  const [selectedTone, setSelectedTone] = useState<Tone>(Tone.Sarcastic);

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
        </div>
      </div>
    </main>
  );
}

export default App;
