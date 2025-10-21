// CSS transformation logic

import {
  type AnimationConfig,
  type AnimationPreset,
  type Keyframe,
} from '../types';

export class CssGenerator {
  /**
   * Generate CSS animation from config
   */
  static generate(config: AnimationConfig): string {
    return `
      animation-name: ${config.name};
      animation-duration: ${config.duration}ms;
      animation-timing-function: ${config.easing};
      ${config.delay ? `animation-delay: ${config.delay}ms;` : ''}
      ${
        config.iterations
          ? `animation-iteration-count: ${config.iterations};`
          : ''
      }
    `.trim();
  }

  /**
   * Generate CSS keyframes
   */
  static generateKeyframes(name: string, keyframes: Keyframe[]): string {
    const frames = keyframes
      .map(kf => {
        const props = Object.entries(kf.properties)
          .map(([key, value]) => `${key}: ${value};`)
          .join(' ');
        return `${kf.offset * 100}% { ${props} }`;
      })
      .join('\n  ');

    return `@keyframes ${name} {\n  ${frames}\n}`;
  }

  /**
   * Parse CSS animation string (for editor)
   */
  static parse(cssString: string): Partial<AnimationConfig> {
    // Basic parsing logic
    return {};
  }
}
