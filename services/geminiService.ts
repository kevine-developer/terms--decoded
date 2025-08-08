import { GoogleGenerativeAI } from "@google/generative-ai";
import type { Tone } from "../src/types/types";
import { TONE_PROMPTS } from "../src/constants/constants";


const genAI = new GoogleGenerativeAI(process.env.API_KEY!);
console.log(genAI);

export const reformulateText = async (text: string, tone: Tone): Promise<string> => {
  // 1. Vérification de la clé API
  if (!process.env.API_KEY) {
    console.error("API key for Gemini is not configured.");
    throw new Error("La clé API n'est pas configurée. L'application ne peut pas fonctionner.");
  }
  
  // 2. Utilisation d'un objet 'GenerativeModel'
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash-latest', // 3. Recommandation d'utiliser le modèle 'flash-latest' pour la rapidité
    systemInstruction: TONE_PROMPTS[tone],
  });

  const userPrompt = `Voici le texte à reformuler:\n\n\`\`\`\n${text}\n\`\`\``;

  try {
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: userPrompt }] }], // 4. Changement du format des 'contents'
      generationConfig: { // 5. 'config' a été renommé 'generationConfig'
        temperature: 0.7,
        topP: 0.95,
        topK: 64,
      },
    });
    
    // 6. Gestion des réponses multiples ou vides
    if (result.response.candidates && result.response.candidates.length > 0) {
      return result.response.text();
    } else {
      console.warn("Gemini API returned an empty or invalid response.");
      throw new Error("Oups, la reformulation a échoué. Le modèle a retourné une réponse vide.");
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Oups, la reformulation a échoué. Nos avocats-robots sont peut-être en pause café. Réessayez plus tard.");
  }
};