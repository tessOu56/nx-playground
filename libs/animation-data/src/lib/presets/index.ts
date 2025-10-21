// Animation presets

import { type AnimationPreset } from '../types';

export const fadeInPreset: AnimationPreset = {
  id: 'fade-in',
  name: 'Fade In',
  category: 'fade',
  duration: 300,
  easing: 'ease-in',
  description: 'Simple fade in animation',
  keyframes: [
    { offset: 0, properties: { opacity: '0' } },
    { offset: 1, properties: { opacity: '1' } },
  ],
};

export const slideInPreset: AnimationPreset = {
  id: 'slide-in',
  name: 'Slide In',
  category: 'slide',
  duration: 400,
  easing: 'ease-out',
  description: 'Slide in from left',
  keyframes: [
    { offset: 0, properties: { transform: 'translateX(-100%)' } },
    { offset: 1, properties: { transform: 'translateX(0)' } },
  ],
};

export const allPresets: AnimationPreset[] = [fadeInPreset, slideInPreset];
