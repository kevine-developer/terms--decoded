export const markdownToPlainText = (markdown: string): string => {
  if (!markdown) return "";

  let plainText = markdown;

  // Supprimer les headers
  plainText = plainText.replace(/^#{1,6}\s+/gm, "");

  // Supprimer le formatage bold/italic
  plainText = plainText.replace(/\*\*(.*?)\*\*/g, "$1");
  plainText = plainText.replace(/__(.*?)__/g, "$1");
  plainText = plainText.replace(/\*(.*?)\*/g, "$1");
  plainText = plainText.replace(/_(.*?)_/g, "$1");

  // Supprimer les codes inline et blocks
  plainText = plainText.replace(/`([^`]+)`/g, "$1");
  plainText = plainText.replace(/```[\s\S]*?```/g, "");

  // Convertir les listes en texte simple
  plainText = plainText.replace(/^\s*[-*+]\s+/gm, "• ");
  plainText = plainText.replace(/^\s*\d+\.\s+/gm, "");

  // Supprimer les liens (garder le texte)
  plainText = plainText.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");

  // Supprimer les blockquotes
  plainText = plainText.replace(/^>\s*/gm, "");

  // Supprimer les lignes horizontales
  plainText = plainText.replace(/^---$/gm, "");

  // Nettoyer les espaces multiples et nouvelles lignes
  plainText = plainText.replace(/\n\s*\n\s*\n/g, "\n\n");
  plainText = plainText.trim();

  return plainText;
};