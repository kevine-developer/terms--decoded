
import { GoogleGenAI } from "@google/genai";
import type { Tone } from "../src/types/types";
import { TONE_PROMPTS } from "../src/constants/constants";



const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const reformulateTextWithRetry = async (text: string, tone: Tone): Promise<string> => {
  if (!process.env.API_KEY) {
    console.error("API key for Gemini is not configured.");
    throw new Error("La clé API n'est pas configurée. L'application ne peut pas fonctionner.");
  }

  const model = 'gemini-2.5-flash';
  const systemInstruction = TONE_PROMPTS[tone];
  const userPrompt = `Voici le texte à reformuler:\n\n\`\`\`\n${text}\n\`\`\``;

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
    throw new Error("Oups, la reformulation a échoué. Nos avocats-robots sont peut-être en pause café. Réessayez plus tard.");
  }
};
