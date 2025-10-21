// Animation type definitions

export interface AnimationConfig {
  name: string;
  duration: number;
  easing: string;
  delay?: number;
  iterations?: number | 'infinite';
}

export interface Keyframe {
  offset: number;
  properties: Record<string, string>;
}

export interface AnimationPreset extends AnimationConfig {
  id: string;
  category: 'fade' | 'slide' | 'bounce' | 'rotate' | 'scale' | 'custom';
  keyframes: Keyframe[];
  description: string;
}
