const StyleDictionary = require('style-dictionary');

// 註冊自定義格式
StyleDictionary.registerFormat({
  name: 'vanilla-extract/css',
  formatter (dictionary, _config) {
    const { allProperties } = dictionary;

    const colors = {};
    const spacing = {};
    const radius = {};
    const typography = {
      fontFamily: {},
      fontWeight: {},
      fontSize: {},
      lineHeight: {},
    };

    allProperties.forEach((prop) => {
      const { name, value: _value, category, type } = prop;

      if (category === 'color') {
        const [, colorCategory, colorShade] = name.replace('colors-', '').split('-');
        if (colorCategory && colorShade) {
          if (!colors[colorCategory]) {
            colors[colorCategory] = {};
          }
          colors[colorCategory][colorShade] = propValue;
        }
      } else if (category === 'size' && type === 'spacing') {
        const spacingName = name.replace('spacing-', '');
        spacing[spacingName] = propValue;
      } else if (category === 'size' && type === 'borderRadius') {
        const radiusName = name.replace('radius-', '');
                  radius[radiusName] = propValue;
      } else if (category === 'font') {
        if (type === 'fontFamilies') {
          const fontName = name.replace('font-family-', '');
                      typography.fontFamily[fontName] = propValue;
        } else if (type === 'fontWeights') {
          const weightName = name.replace('font-weight-', '');
                      typography.fontWeight[weightName] = propValue;
        } else if (type === 'fontSizes') {
          const sizeName = name.replace('font-size-', '');
                      typography.fontSize[sizeName] = propValue;
        } else if (type === 'lineHeights') {
          const heightName = name.replace('line-height-', '');
                      typography.lineHeight[heightName] = propValue;
        }
      }
    });

    // 將數字值轉換為字符串
    const convertValuesToString = (obj) => {
      const result = {};
      Object.entries(obj).forEach(([key, value]) => {
        if (typeof value === 'object' && value !== null) {
          result[key] = convertValuesToString(value);
        } else {
          result[key] = typeof value === 'number' ? `${value}px` : value;
        }
      });
      return result;
    };

    const colorsString = convertValuesToString(colors);
    const spacingString = convertValuesToString(spacing);
    const radiusString = convertValuesToString(radius);
    const typographyString = convertValuesToString(typography);

    return `import { createGlobalTheme } from '@vanilla-extract/css';

export const theme = createGlobalTheme('${config.selector || ':root'}', {
  colors: ${JSON.stringify(colorsString, null, 2).replace(/"/g, "'")},
  spacing: ${JSON.stringify(spacingString, null, 2).replace(/"/g, "'")},
  radius: ${JSON.stringify(radiusString, null, 2).replace(/"/g, "'")},
  typography: ${JSON.stringify(typographyString, null, 2).replace(/"/g, "'")}
});`;
  },
});

StyleDictionary.registerFormat({
  name: 'tailwind/css-variables',
  formatter (dictionary, _config) {
    const { allProperties } = dictionary;
    let css = `/* Generated CSS Variables for Tailwind CSS */\n`;
    css += `${config.selector || ':root'} {\n`;

    allProperties.forEach((prop) => {
      const { name, value: propValue } = prop;
      const cssVarName = `--${name.replace(/-/g, '-')}`;
      css += `  ${cssVarName}: ${propValue};\n`;
    });

    css += '}\n';
    return css;
  },
});

StyleDictionary.registerFormat({
  name: 'tailwind/config',
  formatter (dictionary, _config) {
    const { allProperties } = dictionary;

    const colors = {};
    const spacing = {};
    const borderRadius = {};
    const fontFamily = {};
    const fontWeight = {};
    const fontSize = {};
    const lineHeight = {};

    allProperties.forEach((prop) => {
      const { name, value: _propValue, category, type } = prop;

      if (category === 'color') {
        const [, colorCategory, colorShade] = name.replace('colors-', '').split('-');
        if (colorCategory && colorShade) {
          if (!colors[colorCategory]) {
            colors[colorCategory] = {};
          }
          colors[colorCategory][colorShade] = `var(--${name})`;
        }
      } else if (category === 'size' && type === 'spacing') {
        const spacingName = name.replace('spacing-', '');
        spacing[spacingName] = `var(--${name})`;
      } else if (category === 'size' && type === 'borderRadius') {
        const radiusName = name.replace('radius-', '');
        borderRadius[radiusName] = `var(--${name})`;
      } else if (category === 'font') {
        if (type === 'fontFamilies') {
          const fontName = name.replace('font-family-', '');
          fontFamily[fontName] = `var(--${name})`;
        } else if (type === 'fontWeights') {
          const weightName = name.replace('font-weight-', '');
          fontWeight[weightName] = `var(--${name})`;
        } else if (type === 'fontSizes') {
          const sizeName = name.replace('font-size-', '');
          fontSize[sizeName] = [
            `var(--${name})`,
            {
              lineHeight: `var(--${name.replace('font-size', 'line-height')})`,
            },
          ];
        } else if (type === 'lineHeights') {
          const heightName = name.replace('line-height-', '');
          lineHeight[heightName] = `var(--${name})`;
        }
      }
    });

    return `module.exports = {
  theme: {
    extend: {
      colors: ${JSON.stringify(colors, null, 2)},
      spacing: ${JSON.stringify(spacing, null, 2)},
      borderRadius: ${JSON.stringify(borderRadius, null, 2)},
      fontFamily: ${JSON.stringify(fontFamily, null, 2)},
      fontWeight: ${JSON.stringify(fontWeight, null, 2)},
      fontSize: ${JSON.stringify(fontSize, null, 2)},
      lineHeight: ${JSON.stringify(lineHeight, null, 2)}
    }
  }
};`;
  },
});

// v5 配置格式
module.exports = {
  source: ['src/tokens/raw/**/*.json'],
  platforms: {
    vanillaExtract: {
      transforms: ['attribute/cti', 'name/cti/kebab'],
      buildPath: 'src/tokens/generated/',
      files: [
        {
          destination: 'base-theme.css.ts',
          format: 'vanilla-extract/css',
          filter (token) {
            return token.filePath.includes('base-tokens');
          },
          options: {
            selector: ':root',
          },
        },
        {
          destination: 'enterprise-theme.css.ts',
          format: 'vanilla-extract/css',
          filter (token) {
            return token.filePath.includes('enterprise-tokens');
          },
          options: {
            selector: '[data-theme="enterprise"]',
          },
        },
        {
          destination: 'monochrome-theme.css.ts',
          format: 'vanilla-extract/css',
          filter (token) {
            return token.filePath.includes('monochrome-tokens');
          },
          options: {
            selector: '[data-theme="monochrome"]',
          },
        },
      ],
    },
    tailwind: {
      transforms: ['attribute/cti', 'name/cti/kebab'],
      buildPath: 'src/tokens/generated/',
      files: [
        {
          destination: 'tailwind-variables.css',
          format: 'tailwind/css-variables',
          filter (token) {
            return token.filePath.includes('base-tokens');
          },
          options: {
            selector: ':root',
          },
        },
        {
          destination: 'tailwind-config.js',
          format: 'tailwind/config',
          filter (token) {
            return token.filePath.includes('base-tokens');
          },
        },
      ],
    },
  },
};
