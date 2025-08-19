// fileReaderService.ts
import * as mammoth from 'mammoth';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
// ⚠️ récupère l’URL asset du worker (laisse le bundler l’émettre correctement)
import workerSrc from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

GlobalWorkerOptions.workerSrc = workerSrc;

export interface FileReadResult {
  success: boolean;
  text?: string;
  error?: string;
}

export const readPDFFile = async (file: File): Promise<FileReadResult> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = getDocument({
      data: new Uint8Array(arrayBuffer),
    });
    const pdf = await loadingTask.promise;

    let fullText = '';

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageText = (textContent.items as { str: string }[])
        .map((item) => (typeof item?.str === 'string' ? item.str : ''))
        .join(' ');
      fullText += pageText + '\n\n';
    }

    return { success: true, text: fullText.trim() };
  } catch (error: unknown) {

    const msg =
            /worker|Cannot load script|fake worker/i.test(String((error as Error)?.message || error))
        ? "Le worker PDF.js n'a pas pu être chargé. Vérifie la configuration du worker (voir plus bas)."
        : "Impossible de lire le fichier PDF. Vérifie qu'il n'est pas protégé par mot de passe.";
    return { success: false, error: msg };
  }
};

export const readDocFile = async (file: File): Promise<FileReadResult> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    if (result.messages.length > 0) {
      console.warn('Messages lors de la lecture du document:', result.messages);
    }
    return { success: true, text: result.value };
  } catch (error) {
    console.error('Erreur lors de la lecture du document:', error);
    return {
      success: false,
      error:
        "Impossible de lire le fichier Word. Assurez-vous que le format est supporté (.doc, .docx).",
    };
  }
};

export const readTextFile = async (file: File): Promise<FileReadResult> => {
  try {
    const text = await file.text();
    return { success: true, text };
  } catch (error) {
    console.error('Erreur lors de la lecture du fichier texte:', error);
    return { success: false, error: 'Impossible de lire le fichier texte.' };
  }
};

export const readFile = async (file: File): Promise<FileReadResult> => {
  const ext = file.name.toLowerCase().split('.').pop() || '';
  const type = (file.type || '').toLowerCase();

  if (file.size > 10 * 1024 * 1024) {
    return {
      success: false,
      error: 'Le fichier est trop volumineux. Taille maximale : 10MB.',
    };
  }

  if (type === 'application/pdf' || type === 'application/x-pdf' || ext === 'pdf') {
    return readPDFFile(file);
  }
  if (
    type ===
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    type === 'application/msword' ||
    ext === 'docx' ||
    ext === 'doc'
  ) {
    return readDocFile(file);
  }
  if (type.startsWith('text/') || ['txt', 'md', 'csv'].includes(ext)) {
    return readTextFile(file);
  }

  return {
    success: false,
    error:
      `Type de fichier non supporté: ${ext || type}. ` +
      'Formats supportés: PDF, DOC, DOCX, TXT.',
  };
};

export const isFileSupported = (file: File): boolean => {
  const ext = file.name.toLowerCase().split('.').pop() || '';
  const type = (file.type || '').toLowerCase();
  const supportedExt = ['pdf', 'doc', 'docx', 'txt', 'md', 'csv'];
  const supportedTypes = [
    'application/pdf',
    'application/x-pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
    'text/plain',
    'text/markdown',
    'text/csv',
  ];
  return supportedExt.includes(ext) || supportedTypes.some((t) => type.includes(t));
};
