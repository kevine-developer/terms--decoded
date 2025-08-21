// src/utils/localStorageService.ts
import type { CustomToneInterface } from '../types/types';

const CUSTOM_TONES_KEY = 'jaiLuLesCGU_customTones';

export const saveCustomTones = (customTones: CustomToneInterface[]): void => {
  try {
    localStorage.setItem(CUSTOM_TONES_KEY, JSON.stringify(customTones));
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des tons personnalisés:', error);
  }
};

export const loadCustomTones = (): CustomToneInterface[] => {
  try {
    const saved = localStorage.getItem(CUSTOM_TONES_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Validation basique des données
      if (Array.isArray(parsed)) {
        return parsed.filter(tone => 
          tone && 
          typeof tone.id === 'string' && 
          typeof tone.name === 'string' && 
          typeof tone.description === 'string' &&
          tone.isCustom === true
        );
      }
    }
  } catch (error) {
    console.error('Erreur lors du chargement des tons personnalisés:', error);
  }
  return [];
};

export const addCustomTone = (customTones: CustomToneInterface[], newTone: CustomToneInterface): CustomToneInterface[] => {
  const updatedTones = [...customTones, newTone];
  saveCustomTones(updatedTones);
  return updatedTones;
};

export const removeCustomTone = (customTones: CustomToneInterface[], toneId: string): CustomToneInterface[] => {
  const updatedTones = customTones.filter(tone => tone.id !== toneId);
  saveCustomTones(updatedTones);
  return updatedTones;
};