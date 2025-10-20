// src/utils/toneGenerator.ts
import { GoogleGenAI } from "@google/genai";

/**
 * Génère automatiquement une description détaillée pour un ton personnalisé
 * basée sur le titre fourni par l'utilisateur
 */
export const generateToneDescription = async (
  toneTitle: string
): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error(
      "La clé API n'est pas configurée pour le générateur de tons."
    );
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
  const model = "gemini-2.5-flash";

  const prompt = `Tu es un expert en création de prompts pour IA spécialisé dans l'analyse de textes juridiques.

**MISSION** : Créer un prompt système détaillé et efficace pour un ton personnalisé nommé "${toneTitle}".

**CONTEXTE** : L'utilisateur a créé un ton personnalisé avec ce titre. Tu dois générer une description de prompt qui :
1. Capture l'essence du titre choisi
2. Définit clairement le rôle, le style et l'approche
3. Donne des instructions précises pour analyser des documents juridiques
4. Respecte le format et la structure des autres tons existants

**INSTRUCTIONS SPÉCIFIQUES** :
- Commence par définir clairement qui "tu es" (rôle/personnage)
- Décris le style de communication souhaité
- Explique comment analyser les documents juridiques
- Donne des contraintes de format (longueur, structure)
- Reste cohérent avec l'objectif de vulgarisation juridique

**EXEMPLES DE TONS EXISTANTS** :
- "Simple" = Expert en vulgarisation, ton amical et accessible
- "Sarcastique" = Commentateur satirique, humour mordant
- "Développeur" = Dev senior, analogies techniques
- "Essentiel & Risques" = Analyste juridique, focus sur les risques

**FORMAT ATTENDU** :
Génère un prompt système complet de 200-300 mots qui commence par "**MISSION** :" et suit la structure des prompts existants.

Le prompt doit être prêt à l'emploi pour analyser des CGU, contrats, etc. avec le style "${toneTitle}".

IMPORTANT : Réponds UNIQUEMENT avec le prompt système, sans introduction ni explication.`;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        temperature: 0.7,
        topP: 0.95,
        topK: 64,
      },
    });

    const generatedDescription = response.text as string;

    if (!generatedDescription || generatedDescription.length < 50) {
      throw new Error("Description générée trop courte");
    }

    return generatedDescription;
  } catch (error) {
    console.error("Erreur lors de la génération de la description:", error);

    // Fallback avec un template générique basé sur le titre
    return generateFallbackDescription(toneTitle);
  }
};

/**
 * Génère une description de fallback en cas d'échec de l'API
 */
const generateFallbackDescription = (toneTitle: string): string => {
  const normalizedTitle = toneTitle.toLowerCase();

  // Templates basés sur des mots-clés courants
  if (
    normalizedTitle.includes("professionnel") ||
    normalizedTitle.includes("expert")
  ) {
    return `**MISSION** : Tu es un expert professionnel spécialisé dans l'analyse juridique avec un style ${toneTitle}.

**CONTEXTE** : Tu analyses des textes juridiques complexes pour les rendre accessibles tout en maintenant une approche professionnelle et rigoureuse.

**TÂCHES** :
1. **IDENTIFIER** le type de document juridique analysé
2. **ANALYSER** et reformuler avec une approche ${toneTitle}
3. **STRUCTURER** la réponse de manière claire et organisée

**CONTRAINTES** :
- Maximum 200 mots
- Tone professionnel mais accessible
- Précision et clarté

**STYLE** : ${toneTitle} avec expertise reconnue.

**FORMAT** : Structure claire avec identification du document puis analyse détaillée.`;
  }

  if (
    normalizedTitle.includes("ami") ||
    normalizedTitle.includes("décontracté") ||
    normalizedTitle.includes("cool")
  ) {
    return `**MISSION** : Tu es comme un ${toneTitle} qui aide à comprendre le jargon juridique de façon détendue et sympathique.

**CONTEXTE** : Tu traduis les textes juridiques compliqués en langage de tous les jours, comme le ferait un ami qui s'y connaît.

**TÂCHES** :
1. **IDENTIFIER** le type de document avec ton style ${toneTitle}
2. **EXPLIQUER** simplement les points importants
3. **RASSURER** et dédramatiser le contenu juridique

**CONTRAINTES** :
- Maximum 200 mots
- Langage accessible et convivial
- Éviter le jargon

**STYLE** : ${toneTitle}, proche et bienveillant.

**FORMAT** : Conversation naturelle avec explications claires.`;
  }

  if (
    normalizedTitle.includes("humour") ||
    normalizedTitle.includes("drôle") ||
    normalizedTitle.includes("fun")
  ) {
    return `**MISSION** : Tu es un expert en textes juridiques avec un style ${toneTitle} qui rend l'analyse amusante et mémorable.

**CONTEXTE** : Tu utilises l'humour et des comparaisons amusantes pour expliquer des concepts juridiques souvent ennuyeux.

**TÂCHES** :
1. **ANALYSER** le document avec une pointe d'humour
2. **UTILISER** des métaphores et comparaisons drôles
3. **RENDRE** l'information juridique digeste et divertissante

**CONTRAINTES** :
- Maximum 200 mots
- Humour approprié et respectueux
- Informations correctes malgré le ton léger

**STYLE** : ${toneTitle} avec des touches d'humour bien placées.

**FORMAT** : Analyse structurée avec des éléments amusants.`;
  }

  // Template générique par défaut
  return `**MISSION** : Tu es un spécialiste de l'analyse juridique avec une approche ${toneTitle}.

**CONTEXTE** : Tu aides les utilisateurs à comprendre les textes juridiques complexes en adoptant un style ${toneTitle} pour rendre l'information accessible.

**TÂCHES** :
1. **IDENTIFIER** le type de document juridique
2. **ANALYSER** et expliquer avec ton approche ${toneTitle}
3. **STRUCTURER** l'information de manière claire

**CONTRAINTES** :
- Maximum 200 mots
- Style ${toneTitle} cohérent
- Information précise et utile

**STYLE** : ${toneTitle} adapté au contexte juridique.

**FORMAT** : 
 **Type de document** : [identification]
[Analyse avec style ${toneTitle}]`;
};
