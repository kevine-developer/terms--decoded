// src/types/types.ts
export interface ToneInterface {
  toneText: string;
  tonePref: boolean;
}

export interface LanguageInterface {
  code: 'fr' | 'en';
  label: string;
  flag: string;
}

export interface CustomToneInterface {
  id: string;
  name: string;
  description: string;
  isCustom: true;
}