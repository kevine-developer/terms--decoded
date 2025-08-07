export const Tone = {
  Simple: 'Simple',
  Sarcastic: 'Sarcastique',
  Developer: 'Développeur',
  Risks: 'Essentiel & Risques',
} as const;

export type Tone = typeof Tone[keyof typeof Tone];