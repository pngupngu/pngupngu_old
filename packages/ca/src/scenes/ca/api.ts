export interface Params {
  e1: number;
  e2: number;
  f1: number;
}

type PresetKeys = 'gol' | 'growth' | 'noise' | 'brush' | 'tim' | 'gus';
export type Presets = Record<PresetKeys, Params>;