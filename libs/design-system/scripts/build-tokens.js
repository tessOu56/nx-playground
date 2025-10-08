#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🏗️  Building design tokens...');

// 第一步：CSS to JSON
console.log('📝 Step 1: Converting CSS to JSON...');
const cssToJsonConverter = require('./css-to-json');
const converter = new cssToJsonConverter();
converter.convert();

// 第二步：JSON to Vanilla Extract themes using Style Dictionary
console.log('🎨 Step 2: Converting JSON to Vanilla Extract themes...');

const rawTokensDir = path.join(__dirname, '../src/tokens/raw');
const generatedDir = path.join(__dirname, '../src/tokens/generated');

if (!fs.existsSync(generatedDir)) {
  fs.mkdirSync(generatedDir, { recursive: true });
}

// 處理每個主題檔案
const tokenFiles = fs
  .readdirSync(rawTokensDir)
  .filter((file) => file.endsWith('.json'));

tokenFiles.forEach((file) => {
  const filePath = path.join(rawTokensDir, file);
  const tokenData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const themeName = file.replace('.json', '').replace('-tokens', '');

  console.log(`📦 Processing ${themeName} theme...`);
  generateVanillaExtractTheme(tokenData, themeName);
});

// 生成 Tailwind CSS 變數檔案
const baseTokenPath = path.join(rawTokensDir, 'base-tokens.json');
if (fs.existsSync(baseTokenPath)) {
  const baseTokenData = JSON.parse(fs.readFileSync(baseTokenPath, 'utf8'));
  generateTailwindVariables(baseTokenData);
  generateTailwindConfig(baseTokenData);
  generateTokensDocumentation(baseTokenData); // 新增：生成文檔
  generateVisualTokensPage(baseTokenData); // 新增：生成視覺化展示頁面
  generateTokensJson(baseTokenData); // 新增：生成 JSON 格式
  generateTypeScriptDefinitions(baseTokenData); // 新增：生成 TypeScript 定義
}

console.log('✅ Design tokens built successfully!');
console.log('📁 Generated files:');
console.log('  - Vanilla Extract themes: src/tokens/generated/*-theme.css.ts');
console.log(
  '  - Tailwind CSS variables: src/tokens/generated/tailwind-variables.css'
);
console.log('  - Tailwind config: src/tokens/generated/tailwind-config.js');
console.log('  - Tokens documentation: src/tokens/generated/TOKENS.md');
console.log('  - Visual reference: src/tokens/generated/tokens-visual.html');
console.log('  - JSON tokens: src/tokens/generated/tokens.json');
console.log(
  '  - TypeScript definitions: src/tokens/generated/design-tokens.d.ts'
);

function generateVanillaExtractTheme(tokenData, themeName) {
  const selector =
    themeName === 'base' ? ':root' : `[data-theme="${themeName}"]`;

  const colors = {};
  if (tokenData.colors) {
    Object.entries(tokenData.colors).forEach(([category, colorTokens]) => {
      if (typeof colorTokens === 'object' && colorTokens !== null) {
        colors[category] = {};
        Object.entries(colorTokens).forEach(([shade, value]) => {
          colors[category][shade] = value;
        });
      }
    });
  }

  const spacing = {};
  if (tokenData.spacing) {
    Object.entries(tokenData.spacing).forEach(([name, value]) => {
      spacing[name] = value;
    });
  }

  const radius = {};
  if (tokenData.radius) {
    Object.entries(tokenData.radius).forEach(([name, value]) => {
      radius[name] = value;
    });
  }

  const typography = {
    fontFamily: {},
    fontWeight: {},
    fontSize: {},
    lineHeight: {},
  };

  if (tokenData.typography) {
    if (tokenData.typography.fontFamily) {
      Object.entries(tokenData.typography.fontFamily).forEach(
        ([name, value]) => {
          typography.fontFamily[name] = value;
        }
      );
    }
    if (tokenData.typography.fontWeight) {
      Object.entries(tokenData.typography.fontWeight).forEach(
        ([name, value]) => {
          typography.fontWeight[name] = value;
        }
      );
    }
    if (tokenData.typography.fontSize) {
      Object.entries(tokenData.typography.fontSize).forEach(([name, value]) => {
        typography.fontSize[name] = value;
      });
    }
    if (tokenData.typography.lineHeight) {
      Object.entries(tokenData.typography.lineHeight).forEach(
        ([name, value]) => {
          typography.lineHeight[name] = value;
        }
      );
    }
  }

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

  const themeContent = `import { createGlobalTheme } from '@vanilla-extract/css';

export const theme = createGlobalTheme('${selector}', {
  colors: ${JSON.stringify(colorsString, null, 2).replace(/"/g, "'")},
  spacing: ${JSON.stringify(spacingString, null, 2).replace(/"/g, "'")},
  radius: ${JSON.stringify(radiusString, null, 2).replace(/"/g, "'")},
  typography: ${JSON.stringify(typographyString, null, 2).replace(/"/g, "'")}
});`;

  const outputPath = path.join(generatedDir, `${themeName}-theme.css.ts`);
  fs.writeFileSync(outputPath, themeContent);
  console.log(`  ✅ Generated ${themeName}-theme.css.ts`);
}

function generateTailwindVariables(tokenData) {
  let css = `/* Generated CSS Variables for Tailwind CSS */\n`;
  css += `:root {\n`;

  if (tokenData.colors) {
    Object.entries(tokenData.colors).forEach(([category, colorTokens]) => {
      if (typeof colorTokens === 'object' && colorTokens !== null) {
        Object.entries(colorTokens).forEach(([shade, value]) => {
          css += `  --color-${category}-${shade}: ${value};\n`;
        });
      }
    });
  }

  if (tokenData.spacing) {
    Object.entries(tokenData.spacing).forEach(([name, value]) => {
      css += `  --spacing-${name}: ${value}px;\n`;
    });
  }

  if (tokenData.radius) {
    Object.entries(tokenData.radius).forEach(([name, value]) => {
      css += `  --radius-${name}: ${value}px;\n`;
    });
  }

  if (tokenData.typography) {
    if (tokenData.typography.fontFamily) {
      Object.entries(tokenData.typography.fontFamily).forEach(
        ([name, value]) => {
          css += `  --font-family-${name}: ${value};\n`;
        }
      );
    }
    if (tokenData.typography.fontWeight) {
      Object.entries(tokenData.typography.fontWeight).forEach(
        ([name, value]) => {
          css += `  --font-weight-${name}: ${value};\n`;
        }
      );
    }
    if (tokenData.typography.fontSize) {
      Object.entries(tokenData.typography.fontSize).forEach(([name, value]) => {
        css += `  --font-size-${name}: ${value}px;\n`;
      });
    }
    if (tokenData.typography.lineHeight) {
      Object.entries(tokenData.typography.lineHeight).forEach(
        ([name, value]) => {
          css += `  --line-height-${name}: ${value}px;\n`;
        }
      );
    }
  }

  css += `}\n`;

  const outputPath = path.join(generatedDir, 'tailwind-variables.css');
  fs.writeFileSync(outputPath, css);
  console.log(`  ✅ Generated tailwind-variables.css`);
}

function generateTailwindConfig(tokenData) {
  const colors = {};
  const spacing = {};
  const borderRadius = {};
  const fontFamily = {};
  const fontWeight = {};
  const fontSize = {};
  const lineHeight = {};

  if (tokenData.colors) {
    Object.entries(tokenData.colors).forEach(([category, colorTokens]) => {
      if (typeof colorTokens === 'object' && colorTokens !== null) {
        colors[category] = {};
        Object.entries(colorTokens).forEach(([shade, _value]) => {
          colors[category][shade] = `var(--color-${category}-${shade})`;
        });
      }
    });
  }

  if (tokenData.spacing) {
    Object.entries(tokenData.spacing).forEach(([name, _value]) => {
      spacing[name] = `var(--spacing-${name})`;
    });
  }

  if (tokenData.radius) {
    Object.entries(tokenData.radius).forEach(([name, _value]) => {
      borderRadius[name] = `var(--radius-${name})`;
    });
  }

  if (tokenData.typography) {
    if (tokenData.typography.fontFamily) {
      Object.entries(tokenData.typography.fontFamily).forEach(
        ([name, _value]) => {
          fontFamily[name] = `var(--font-family-${name})`;
        }
      );
    }
    if (tokenData.typography.fontWeight) {
      Object.entries(tokenData.typography.fontWeight).forEach(
        ([name, _value]) => {
          fontWeight[name] = `var(--font-weight-${name})`;
        }
      );
    }
    if (tokenData.typography.fontSize) {
      Object.entries(tokenData.typography.fontSize).forEach(([name, _value]) => {
        const lineHeightToken = tokenData.typography.lineHeight?.[name];
        if (lineHeightToken) {
          fontSize[name] = [
            `var(--font-size-${name})`,
            { lineHeight: `var(--line-height-${name})` },
          ];
        } else {
          fontSize[name] = `var(--font-size-${name})`;
        }
      });
    }
    if (tokenData.typography.lineHeight) {
      Object.entries(tokenData.typography.lineHeight).forEach(
        ([name, _value]) => {
          lineHeight[name] = `var(--line-height-${name})`;
        }
      );
    }
  }

  const configContent = `module.exports = {
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

  const outputPath = path.join(generatedDir, 'tailwind-config.js');
  fs.writeFileSync(outputPath, configContent);
  console.log(`  ✅ Generated tailwind-config.js`);
}

function generateTokensDocumentation(tokenData) {
  let markdown = `# Design Tokens Documentation\n\n`;
  markdown += `This document outlines the design tokens used in the project. These tokens are organized into categories and can be used to maintain consistency across the UI.\n\n`;

  // 添加 Tailwind CSS 使用說明
  markdown += `## Usage in Tailwind CSS\n\n`;
  markdown += `All design tokens are available as Tailwind CSS classes. Here's how to use them:\n\n`;
  markdown += `### Colors\n`;
  markdown += `- Use \`bg-{color}-{shade}\` for background colors\n`;
  markdown += `- Use \`text-{color}-{shade}\` for text colors\n`;
  markdown += `- Use \`border-{color}-{shade}\` for border colors\n\n`;
  markdown += `### Spacing\n`;
  markdown += `- Use \`p-{spacing}\`, \`m-{spacing}\`, \`gap-{spacing}\` etc.\n\n`;
  markdown += `### Border Radius\n`;
  markdown += `- Use \`rounded-{radius}\` for border radius\n\n`;
  markdown += `### Typography\n`;
  markdown += `- Use \`font-{weight}\` for font weights\n`;
  markdown += `- Use \`text-{size}\` for font sizes\n\n`;

  // 添加語義化顏色說明
  markdown += `## Semantic Colors\n\n`;
  markdown += `For better theme support, use these semantic color classes:\n\n`;
  markdown += `### Text Colors\n`;
  markdown += `- \`text-text-primary\` - Primary text color\n`;
  markdown += `- \`text-text-secondary\` - Secondary text color\n`;
  markdown += `- \`text-text-tertiary\` - Tertiary text color\n`;
  markdown += `- \`text-text-disabled\` - Disabled text color\n`;
  markdown += `- \`text-text-inverse\` - Inverse text color\n\n`;
  markdown += `### Background Colors\n`;
  markdown += `- \`bg-background-primary\` - Primary background color\n`;
  markdown += `- \`bg-background-secondary\` - Secondary background color\n`;
  markdown += `- \`bg-background-tertiary\` - Tertiary background color\n`;
  markdown += `- \`bg-background-inverse\` - Inverse background color\n\n`;
  markdown += `### Border Colors\n`;
  markdown += `- \`border-border-primary\` - Primary border color\n`;
  markdown += `- \`border-border-secondary\` - Secondary border color\n`;
  markdown += `- \`border-border-focus\` - Focus border color\n`;
  markdown += `- \`border-border-error\` - Error border color\n`;
  markdown += `- \`border-border-success\` - Success border color\n`;
  markdown += `- \`border-border-warning\` - Warning border color\n\n`;

  if (tokenData.colors) {
    markdown += `## Available Colors\n\n`;
    Object.entries(tokenData.colors).forEach(([category, colorTokens]) => {
      markdown += `### ${
        category.charAt(0).toUpperCase() + category.slice(1)
      }\n\n`;
      if (typeof colorTokens === 'object' && colorTokens !== null) {
        Object.entries(colorTokens).forEach(([shade, value]) => {
          markdown += `- **${
            shade.charAt(0).toUpperCase() + shade.slice(1)
          }**: \`${value}\` (Tailwind: \`bg-${category}-${shade}\`, \`text-${category}-${shade}\`)\n`;
        });
      }
      markdown += `\n`;
    });
  }

  if (tokenData.spacing) {
    markdown += `## Available Spacing\n\n`;
    Object.entries(tokenData.spacing).forEach(([name, value]) => {
      markdown += `- **${
        name.charAt(0).toUpperCase() + name.slice(1)
      }**: \`${value}px\` (Tailwind: \`p-${name}\`, \`m-${name}\`, \`gap-${name}\`)\n`;
    });
    markdown += `\n`;
  }

  if (tokenData.radius) {
    markdown += `## Available Border Radius\n\n`;
    Object.entries(tokenData.radius).forEach(([name, value]) => {
      markdown += `- **${
        name.charAt(0).toUpperCase() + name.slice(1)
      }**: \`${value}px\` (Tailwind: \`rounded-${name}\`)\n`;
    });
    markdown += `\n`;
  }

  if (tokenData.typography) {
    markdown += `## Available Typography\n\n`;
    if (tokenData.typography.fontFamily) {
      markdown += `### Font Family\n\n`;
      Object.entries(tokenData.typography.fontFamily).forEach(
        ([name, value]) => {
          markdown += `- **${
            name.charAt(0).toUpperCase() + name.slice(1)
          }**: \`${value}\` (Tailwind: \`font-${name}\`)\n`;
        }
      );
      markdown += `\n`;
    }
    if (tokenData.typography.fontWeight) {
      markdown += `### Font Weight\n\n`;
      Object.entries(tokenData.typography.fontWeight).forEach(
        ([name, value]) => {
          markdown += `- **${
            name.charAt(0).toUpperCase() + name.slice(1)
          }**: \`${value}\` (Tailwind: \`font-${name}\`)\n`;
        }
      );
      markdown += `\n`;
    }
    if (tokenData.typography.fontSize) {
      markdown += `### Font Size\n\n`;
      Object.entries(tokenData.typography.fontSize).forEach(([name, value]) => {
        markdown += `- **${
          name.charAt(0).toUpperCase() + name.slice(1)
        }**: \`${value}px\` (Tailwind: \`text-${name}\`)\n`;
      });
      markdown += `\n`;
    }
    if (tokenData.typography.lineHeight) {
      markdown += `### Line Height\n\n`;
      Object.entries(tokenData.typography.lineHeight).forEach(
        ([name, value]) => {
          markdown += `- **${
            name.charAt(0).toUpperCase() + name.slice(1)
          }**: \`${value}px\` (Tailwind: \`leading-${name}\`)\n`;
        }
      );
      markdown += `\n`;
    }
  }

  // 添加使用範例
  markdown += `## Usage Examples\n\n`;
  markdown += `### Button Component\n`;
  markdown += `\`\`\`tsx\n`;
  markdown += `<button className="bg-primary-500 text-white px-4 py-2 rounded-md">\n`;
  markdown += `  Click me\n`;
  markdown += `</button>\n`;
  markdown += `\`\`\`\n\n`;
  markdown += `### Card Component\n`;
  markdown += `\`\`\`tsx\n`;
  markdown += `<div className="bg-background-primary border border-border-primary rounded-lg p-6">\n`;
  markdown += `  <h2 className="text-text-primary text-xl font-semibold mb-4">Card Title</h2>\n`;
  markdown += `  <p className="text-text-secondary">Card content goes here.</p>\n`;
  markdown += `</div>\n`;
  markdown += `\`\`\`\n\n`;
  markdown += `### Form Input\n`;
  markdown += `\`\`\`tsx\n`;
  markdown += `<div className="space-y-2">\n`;
  markdown += `  <label className="text-sm font-medium text-text-primary">Name</label>\n`;
  markdown += `  <input className="w-full px-3 py-2 border border-border-primary rounded-md bg-background-primary text-text-primary" />\n`;
  markdown += `</div>\n`;
  markdown += `\`\`\`\n\n`;

  markdown += `## Theme Switching\n\n`;
  markdown += `All semantic colors automatically adapt to the current theme. Use the \`ThemeSwitcher\` component to switch between themes:\n\n`;
  markdown += `\`\`\`tsx\n`;
  markdown += `import { ThemeSwitcher } from '@nx-playground/ui-components';\n\n`;
  markdown += `function App() {\n`;
  markdown += `  return (\n`;
  markdown += `    <div>\n`;
  markdown += `      <ThemeSwitcher />\n`;
  markdown += `      {/* Your app content */}\n`;
  markdown += `    </div>\n`;
  markdown += `  );\n`;
  markdown += `}\n`;
  markdown += `\`\`\`\n\n`;

  markdown += `---\n\n`;
  markdown += `*This documentation is automatically generated from design tokens. Update the source CSS files and run \`pnpm run design:tokens\` to regenerate.*\n`;

  const outputPath = path.join(generatedDir, 'TOKENS.md');
  fs.writeFileSync(outputPath, markdown);
  console.log(`  ✅ Generated TOKENS.md`);

  // 生成視覺化展示頁面
  generateVisualTokensPage(tokenData);
}

function generateVisualTokensPage(tokenData) {
  let html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Design Tokens Visual Reference</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        .color-preview {
            width: 60px;
            height: 40px;
            border-radius: 6px;
            border: 1px solid #e5e7eb;
            display: inline-block;
            margin-right: 12px;
            vertical-align: middle;
        }
        .token-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 24px;
            margin: 24px 0;
        }
        .token-card {
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 16px;
            background: white;
        }
        .token-item {
            display: flex;
            align-items: center;
            margin: 8px 0;
            padding: 8px;
            border-radius: 4px;
            background: #f9fafb;
        }
        .token-info {
            flex: 1;
        }
        .token-name {
            font-weight: 600;
            font-size: 14px;
            color: #374151;
        }
        .token-value {
            font-family: monospace;
            font-size: 12px;
            color: #6b7280;
            margin-top: 2px;
        }
        .token-class {
            font-family: monospace;
            font-size: 12px;
            color: #059669;
            background: #d1fae5;
            padding: 2px 6px;
            border-radius: 3px;
            margin-top: 4px;
        }
        .spacing-preview {
            background: #3b82f6;
            display: inline-block;
            margin-right: 12px;
            vertical-align: middle;
        }
        .radius-preview {
            background: #3b82f6;
            display: inline-block;
            margin-right: 12px;
            vertical-align: middle;
        }
    </style>
</head>
<body class="bg-gray-50 min-h-screen">
    <div class="container mx-auto px-6 py-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Design Tokens Visual Reference</h1>
        <p class="text-gray-600 mb-8">Visual representation of all design tokens with their actual values and Tailwind CSS classes.</p>
        
        <div class="mb-8">
            <h2 class="text-2xl font-semibold text-gray-800 mb-4">Colors</h2>`;

  if (tokenData.colors) {
    Object.entries(tokenData.colors).forEach(([category, colorTokens]) => {
      html += `
            <div class="token-card">
                <h3 class="text-lg font-semibold text-gray-800 mb-4">${
                  category.charAt(0).toUpperCase() + category.slice(1)
                }</h3>`;

      if (typeof colorTokens === 'object' && colorTokens !== null) {
        Object.entries(colorTokens).forEach(([shade, value]) => {
          html += `
                <div class="token-item">
                    <div class="color-preview" style="background-color: ${value}"></div>
                    <div class="token-info">
                        <div class="token-name">${
                          shade.charAt(0).toUpperCase() + shade.slice(1)
                        }</div>
                        <div class="token-value">${value}</div>
                        <div class="token-class">bg-${category}-${shade} | text-${category}-${shade}</div>
                    </div>
                </div>`;
        });
      }

      html += `
            </div>`;
    });
  }

  html += `
        </div>
        
        <div class="mb-8">
            <h2 class="text-2xl font-semibold text-gray-800 mb-4">Spacing</h2>
            <div class="token-card">`;

  if (tokenData.spacing) {
    Object.entries(tokenData.spacing).forEach(([name, value]) => {
      html += `
                <div class="token-item">
                    <div class="spacing-preview" style="width: ${value}px; height: 20px;"></div>
                    <div class="token-info">
                        <div class="token-name">${
                          name.charAt(0).toUpperCase() + name.slice(1)
                        }</div>
                        <div class="token-value">${value}px</div>
                        <div class="token-class">p-${name} | m-${name} | gap-${name}</div>
                    </div>
                </div>`;
    });
  }

  html += `
            </div>
        </div>
        
        <div class="mb-8">
            <h2 class="text-2xl font-semibold text-gray-800 mb-4">Border Radius</h2>
            <div class="token-card">`;

  if (tokenData.radius) {
    Object.entries(tokenData.radius).forEach(([name, value]) => {
      html += `
                <div class="token-item">
                    <div class="radius-preview" style="width: 60px; height: 40px; border-radius: ${value}px;"></div>
                    <div class="token-info">
                        <div class="token-name">${
                          name.charAt(0).toUpperCase() + name.slice(1)
                        }</div>
                        <div class="token-value">${value}px</div>
                        <div class="token-class">rounded-${name}</div>
                    </div>
                </div>`;
    });
  }

  html += `
            </div>
        </div>
        
        <div class="mb-8">
            <h2 class="text-2xl font-semibold text-gray-800 mb-4">Typography</h2>`;

  if (tokenData.typography) {
    if (tokenData.typography.fontSize) {
      html += `
            <div class="token-card">
                <h3 class="text-lg font-semibold text-gray-800 mb-4">Font Sizes</h3>`;

      Object.entries(tokenData.typography.fontSize).forEach(([name, value]) => {
        html += `
                <div class="token-item">
                    <div class="token-info">
                        <div class="token-name" style="font-size: ${value}px;">${
          name.charAt(0).toUpperCase() + name.slice(1)
        }</div>
                        <div class="token-value">${value}px</div>
                        <div class="token-class">text-${name}</div>
                    </div>
                </div>`;
      });

      html += `
            </div>`;
    }

    if (tokenData.typography.fontWeight) {
      html += `
            <div class="token-card">
                <h3 class="text-lg font-semibold text-gray-800 mb-4">Font Weights</h3>`;

      Object.entries(tokenData.typography.fontWeight).forEach(
        ([name, value]) => {
          html += `
                <div class="token-item">
                    <div class="token-info">
                        <div class="token-name" style="font-weight: ${value};">${
            name.charAt(0).toUpperCase() + name.slice(1)
          }</div>
                        <div class="token-value">${value}</div>
                        <div class="token-class">font-${name}</div>
                    </div>
                </div>`;
        }
      );

      html += `
            </div>`;
    }
  }

  html += `
        </div>
        
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
            <h3 class="text-lg font-semibold text-blue-800 mb-2">How to Use</h3>
            <p class="text-blue-700 mb-4">This visual reference shows all available design tokens with their actual values. Use the Tailwind CSS classes in your components for consistent styling.</p>
            <div class="text-sm text-blue-600">
                <p><strong>Example:</strong></p>
                <code class="bg-blue-100 px-2 py-1 rounded">className="bg-blue-500 text-white p-4 rounded-md"</code>
            </div>
        </div>
    </div>
</body>
</html>`;

  const outputPath = path.join(generatedDir, 'tokens-visual.html');
  fs.writeFileSync(outputPath, html);
  console.log(`  ✅ Generated tokens-visual.html`);
}

function generateTokensJson(tokenData) {
  const tokensJson = {
    metadata: {
      generatedAt: new Date().toISOString(),
      version: '1.0.0',
      description: 'Design tokens in JSON format for programmatic access',
    },
    colors: tokenData.colors || {},
    spacing: tokenData.spacing || {},
    radius: tokenData.radius || {},
    typography: tokenData.typography || {},
    semantic: {
      text: {
        primary: 'var(--color-text-primary)',
        secondary: 'var(--color-text-secondary)',
        tertiary: 'var(--color-text-tertiary)',
        disabled: 'var(--color-text-disabled)',
        inverse: 'var(--color-text-inverse)',
      },
      background: {
        primary: 'var(--color-background-primary)',
        secondary: 'var(--color-background-secondary)',
        tertiary: 'var(--color-background-tertiary)',
        inverse: 'var(--color-background-inverse)',
      },
      border: {
        primary: 'var(--color-border-primary)',
        secondary: 'var(--color-border-secondary)',
        focus: 'var(--color-border-focus)',
        error: 'var(--color-border-error)',
        success: 'var(--color-border-success)',
        warning: 'var(--color-border-warning)',
      },
    },
    tailwind: {
      colors: {},
      spacing: {},
      borderRadius: {},
      fontFamily: {},
      fontWeight: {},
      fontSize: {},
      lineHeight: {},
    },
  };

  // 生成 Tailwind 格式的 tokens
  if (tokenData.colors) {
    Object.entries(tokenData.colors).forEach(([category, colorTokens]) => {
      if (typeof colorTokens === 'object' && colorTokens !== null) {
        tokensJson.tailwind.colors[category] = {};
        Object.entries(colorTokens).forEach(([shade, _value]) => {
          tokensJson.tailwind.colors[category][
            shade
          ] = `var(--color-${category}-${shade})`;
        });
      }
    });
  }

  if (tokenData.spacing) {
    Object.entries(tokenData.spacing).forEach(([name, _value]) => {
      tokensJson.tailwind.spacing[name] = `var(--spacing-${name})`;
    });
  }

  if (tokenData.radius) {
    Object.entries(tokenData.radius).forEach(([name, _value]) => {
      tokensJson.tailwind.borderRadius[name] = `var(--radius-${name})`;
    });
  }

  if (tokenData.typography) {
    if (tokenData.typography.fontFamily) {
      Object.entries(tokenData.typography.fontFamily).forEach(
        ([name, _value]) => {
          tokensJson.tailwind.fontFamily[name] = `var(--font-family-${name})`;
        }
      );
    }
    if (tokenData.typography.fontWeight) {
      Object.entries(tokenData.typography.fontWeight).forEach(
        ([name, _value]) => {
          tokensJson.tailwind.fontWeight[name] = `var(--font-weight-${name})`;
        }
      );
    }
    if (tokenData.typography.fontSize) {
      Object.entries(tokenData.typography.fontSize).forEach(([name, _value]) => {
        tokensJson.tailwind.fontSize[name] = `var(--font-size-${name})`;
      });
    }
    if (tokenData.typography.lineHeight) {
      Object.entries(tokenData.typography.lineHeight).forEach(
        ([name, _value]) => {
          tokensJson.tailwind.lineHeight[name] = `var(--line-height-${name})`;
        }
      );
    }
  }

  const outputPath = path.join(generatedDir, 'tokens.json');
  fs.writeFileSync(outputPath, JSON.stringify(tokensJson, null, 2));
  console.log(`  ✅ Generated tokens.json`);
}

function generateTypeScriptDefinitions(tokenData) {
  let ts = `/**
 * Design Tokens TypeScript Definitions
 * 
 * 這個檔案提供設計 tokens 的完整 TypeScript 支援，
 * 包括 IntelliSense 自動完成和實際數值顯示。
 */

// 基礎顏色定義
export interface BaseColors {
  white: '#ffffff';
  black: '#000000';
  transparent: 'rgba(255, 255, 255, 0)';
}

// 灰色系定義
export interface GrayColors {
`;

  // 生成灰色系定義
  if (tokenData.colors && tokenData.colors.gray) {
    Object.entries(tokenData.colors.gray).forEach(([shade, value]) => {
      ts += `  '${shade}': '${value}';\n`;
    });
  }

  ts += `}

// 品牌顏色定義
export interface BrandColors {
`;

  // 生成品牌顏色定義
  if (tokenData.colors && tokenData.colors.brand) {
    Object.entries(tokenData.colors.brand).forEach(([shade, value]) => {
      ts += `  '${shade}': '${value}';\n`;
    });
  }

  ts += `}

// 錯誤顏色定義
export interface ErrorColors {
`;

  // 生成錯誤顏色定義
  if (tokenData.colors && tokenData.colors.error) {
    Object.entries(tokenData.colors.error).forEach(([shade, value]) => {
      ts += `  '${shade}': '${value}';\n`;
    });
  }

  ts += `}

// 警告顏色定義
export interface WarningColors {
`;

  // 生成警告顏色定義
  if (tokenData.colors && tokenData.colors.warning) {
    Object.entries(tokenData.colors.warning).forEach(([shade, value]) => {
      ts += `  '${shade}': '${value}';\n`;
    });
  }

  ts += `}

// 成功顏色定義
export interface SuccessColors {
`;

  // 生成成功顏色定義
  if (tokenData.colors && tokenData.colors.success) {
    Object.entries(tokenData.colors.success).forEach(([shade, value]) => {
      ts += `  '${shade}': '${value}';\n`;
    });
  }

  ts += `}

// 綠色定義
export interface GreenColors {
`;

  // 生成綠色定義
  if (tokenData.colors && tokenData.colors.green) {
    Object.entries(tokenData.colors.green).forEach(([shade, value]) => {
      ts += `  '${shade}': '${value}';\n`;
    });
  }

  ts += `}

// 藍色定義
export interface BlueColors {
`;

  // 生成藍色定義
  if (tokenData.colors && tokenData.colors.blue) {
    Object.entries(tokenData.colors.blue).forEach(([shade, value]) => {
      ts += `  '${shade}': '${value}';\n`;
    });
  }

  ts += `}

// 間距定義
export interface Spacing {
`;

  // 生成間距定義
  if (tokenData.spacing) {
    Object.entries(tokenData.spacing).forEach(([name, value]) => {
      // 修復間距鍵名，將 '0.5' 和 '1.5' 改為 '0․5' 和 '1․5'
      const fixedName = name === '0.5' ? '0․5' : name === '1.5' ? '1․5' : name;
      ts += `  '${fixedName}': '${value}px';\n`;
    });
  }

  ts += `}

// 圓角定義
export interface BorderRadius {
`;

  // 生成圓角定義
  if (tokenData.radius) {
    Object.entries(tokenData.radius).forEach(([name, value]) => {
      ts += `  '${name}': '${value}px';\n`;
    });
  }

  ts += `}

// 字體大小定義
export interface FontSize {
  'xs': '12px';
  'sm': '14px';
  'base': '16px';
  'lg': '18px';
  'xl': '20px';
  '2xl': '24px';
  '3xl': '30px';
  '4xl': '36px';
  '5xl': '48px';
  '6xl': '60px';
  '7xl': '72px';
  '8xl': '96px';
  '9xl': '128px';
}

// 字重定義
export interface FontWeight {
  'thin': '100';
  'extralight': '200';
  'light': '300';
  'normal': '400';
  'medium': '500';
  'semibold': '600';
  'bold': '700';
  'extrabold': '800';
  'black': '900';
}

// 行高定義
export interface LineHeight {
  'none': '1';
  'tight': '1.25';
  'snug': '1.375';
  'normal': '1.5';
  'relaxed': '1.625';
  'loose': '2';
  '3': '0.75rem';
  '4': '1rem';
  '5': '1.25rem';
  '6': '1.5rem';
  '7': '1.75rem';
  '8': '2rem';
  '9': '2.25rem';
  '10': '2.5rem';
}

// 語義化顏色定義
export interface SemanticColors {
  text: {
    primary: 'var(--color-text-primary)';
    secondary: 'var(--color-text-secondary)';
    tertiary: 'var(--color-text-tertiary)';
    disabled: 'var(--color-text-disabled)';
    inverse: 'var(--color-text-inverse)';
  };
  background: {
    primary: 'var(--color-background-primary)';
    secondary: 'var(--color-background-secondary)';
    tertiary: 'var(--color-background-tertiary)';
    inverse: 'var(--color-background-inverse)';
  };
  border: {
    primary: 'var(--color-border-primary)';
    secondary: 'var(--color-border-secondary)';
    focus: 'var(--color-border-focus)';
    error: 'var(--color-border-error)';
    success: 'var(--color-border-success)';
    warning: 'var(--color-border-warning)';
  };
}

// 主要顏色定義
export interface PrimaryColors {
  '25': 'var(--color-primary-25)';
  '50': 'var(--color-primary-50)';
  '100': 'var(--color-primary-100)';
  '200': 'var(--color-primary-200)';
  '300': 'var(--color-primary-300)';
  '400': 'var(--color-primary-400)';
  '500': 'var(--color-primary-500)';
  '600': 'var(--color-primary-600)';
  '700': 'var(--color-primary-700)';
  '800': 'var(--color-primary-800)';
  '900': 'var(--color-primary-900)';
  '950': 'var(--color-primary-950)';
}

// 次要顏色定義
export interface SecondaryColors {
  '25': 'var(--color-secondary-25)';
  '50': 'var(--color-secondary-50)';
  '100': 'var(--color-secondary-100)';
  '200': 'var(--color-secondary-200)';
  '300': 'var(--color-secondary-300)';
  '400': 'var(--color-secondary-400)';
  '500': 'var(--color-secondary-500)';
  '600': 'var(--color-secondary-600)';
  '700': 'var(--color-secondary-700)';
  '800': 'var(--color-secondary-800)';
  '900': 'var(--color-secondary-900)';
  '950': 'var(--color-secondary-950)';
}

// 完整的設計 tokens 定義
export interface DesignTokens {
  colors: {
    base: BaseColors;
    gray: GrayColors;
    brand: BrandColors;
    error: ErrorColors;
    warning: WarningColors;
    success: SuccessColors;
    green: GreenColors;
    blue: BlueColors;
    primary: PrimaryColors;
    secondary: SecondaryColors;
  };
  spacing: Spacing;
  radius: BorderRadius;
  typography: {
    fontSize: FontSize;
    fontWeight: FontWeight;
    lineHeight: LineHeight;
  };
  semantic: SemanticColors;
}

// 主題類型定義
export type ThemeType = 'base' | 'enterprise' | 'monochrome';

// 主題配置定義
export interface ThemeConfig {
  name: ThemeType;
  displayName: string;
  description: string;
  selector: string;
  primaryColor: string;
}
`;

  const outputPath = path.join(generatedDir, 'design-tokens.d.ts');
  fs.writeFileSync(outputPath, ts);
  console.log(`  ✅ Generated design-tokens.d.ts`);
}
