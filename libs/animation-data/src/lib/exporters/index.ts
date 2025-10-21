// Animation data exporters

import { CssGenerator } from '../transformers';
import { type AnimationPreset } from '../types';

export class JsonExporter {
  /**
   * Export animation as JSON
   */
  static export(preset: AnimationPreset): string {
    return JSON.stringify(preset, null, 2);
  }
}

export class CssExporter {
  /**
   * Export animation as CSS
   */
  static export(preset: AnimationPreset): string {
    const keyframes = CssGenerator.generateKeyframes(
      preset.name,
      preset.keyframes
    );
    const animation = CssGenerator.generate(preset);

    return `/* ${preset.description} */\n${keyframes}\n\n.animated-${preset.id} {\n  ${animation}\n}`;
  }
}
