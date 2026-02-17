export type EQPreset = 'off' | 'bass-boost' | 'pop' | 'rock' | 'classical' | 'jazz';

export interface EQSettings {
  preset: EQPreset;
  gains: number[];
}

export const EQ_PRESETS: Record<EQPreset, number[]> = {
  'off': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  'bass-boost': [8, 6, 4, 2, 0, 0, 0, 0, 0, 0],
  'pop': [2, 4, 6, 4, 2, 0, -2, -2, 0, 0],
  'rock': [6, 4, 2, 0, -2, -2, 0, 2, 4, 6],
  'classical': [0, 0, 0, 0, 0, 0, -2, -2, -2, -4],
  'jazz': [4, 2, 0, 2, 4, 4, 2, 0, 2, 4],
};

export const EQ_PRESET_LABELS: Record<EQPreset, string> = {
  'off': 'Off',
  'bass-boost': 'Bass Boost',
  'pop': 'Pop',
  'rock': 'Rock',
  'classical': 'Classical',
  'jazz': 'Jazz',
};
