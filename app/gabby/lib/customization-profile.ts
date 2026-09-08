import type { OrbMode } from './gabby-types';

export const DEFAULT_MODE_NAMES: Record<OrbMode, string> = {
  focus: 'FOCUS', learn: 'LEARN', create: 'CREATE', execute: 'EXECUTE', protect: 'PROTECT', success: 'SUCCESS', rest: 'REST',
};

export interface GabbyCustomizationProfile {
  accent: string;
  intensity: number;
  fieldDensity: 'minimal' | 'standard' | 'immersive';
  motion: 'full' | 'low' | 'none';
  dockPosition: 'left' | 'right' | 'bottom';
  voiceTone: 'direct' | 'warm' | 'technical';
  modeNames: Record<OrbMode, string>;
}

export const DEFAULT_CUSTOMIZATION: GabbyCustomizationProfile = {
  accent: '#35D07F', intensity: 75, fieldDensity: 'standard', motion: 'full', dockPosition: 'right', voiceTone: 'direct', modeNames: DEFAULT_MODE_NAMES,
};

export function applyCustomization(input: Partial<GabbyCustomizationProfile>): GabbyCustomizationProfile {
  return {
    ...DEFAULT_CUSTOMIZATION,
    ...input,
    intensity: Math.max(0, Math.min(100, input.intensity ?? DEFAULT_CUSTOMIZATION.intensity)),
    modeNames: DEFAULT_MODE_NAMES,
  };
}
