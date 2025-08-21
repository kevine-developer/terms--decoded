// services/geminiService.ts
import { GoogleGenAI } from "@google/genai";
import type { ToneInterface, LanguageInterface, CustomToneInterface } from "../src/types/types";
import { getTonePrompt, type ToneType, type LanguageCode } from "../src/constants/constants";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const reformulateTextWithRetry = async (
  text: string, 
  tone: ToneInterface | CustomToneInterface,
  language: LanguageInterface
): Promise<string> => {
  if (!process.env.API_KEY) {

  const model = 'gemini-2.5-flash';
  
  let systemInstruction: string;
  
  // Gérer les tons personnalisés vs les tons prédéfinis
  if ('id' in tone && tone.isCustom) {
    // Ton personnalisé
    systemInstruction = `${tone.description}

IMPORTANT: Réponds UNIQUEMENT en ${language.code === 'fr' ? 'FRANÇAIS' : 'ENGLISH'}.`;
  } else {
    // Ton prédéfini
    const toneType = (tone as ToneInterface).toneText as ToneType;
    systemInstruction = getTonePrompt(toneType, language.code as LanguageCode);
  }

  const userPrompt = language.code === 'fr' 
    ? `Voici le texte à reformuler:\n\n\`\`\`\n${text}\n\`\`\``
    : `Here is the text to reformulate:\n\n\`\`\`\n${text}\n\`\`\``;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: userPrompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
        topP: 0.95,
        topK: 64,
        thinkingConfig: { thinkingBudget: 0 } // For faster responses suitable for interactive UI
      },
    });
    
    return response.text as string;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    const errorMessage = language.code === 'fr' 
      ? "Oups, la reformulation a échoué. Nos avocats-robots sont peut-être en pause café. Réessayez plus tard."
      : "Oops, the reformulation failed. Our robot lawyers might be on a coffee break. Try again later.";
    throw new Error(errorMessage);
  }
};