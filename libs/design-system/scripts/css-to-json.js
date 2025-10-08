const fs = require('fs');
const path = require('path');

class CSSToJSONConverter {
  constructor() {
    this.rawTokensDir = path.join(__dirname, '../src/tokens/raw');
    this.cssFilePath = path.join(
      __dirname,
      '../src/tokens/source/base-token.css'
    );
  }

  parseCSSVariables(cssContent) {
    const variables = {};
    const regex = /--([^:]+):\s*([^;]+);/g;
    let match;

    while ((match = regex.exec(cssContent)) !== null) {
      const [, name, value] = match;
      const cleanValue = value.trim();

      // 跳過包含 [object-object] 的變數（這些是無效的）
      if (cleanValue.includes('[object-object]')) {
        continue;
      }

      variables[name] = cleanValue;
    }

    return variables;
  }

  convertToTokenStructure(cssVariables) {
    const tokens = {
      colors: {
        base: {},
        gray: {},
        brand: {},
        error: {},
        warning: {},
        success: {},
        green: {}, // 添加 green 類別
        blue: {}, // 添加 blue 類別
      },
      spacing: {},
      radius: {},
      typography: {
        fontFamily: {},
        fontWeight: {},
        fontSize: {},
        lineHeight: {},
      },
    };

    // 處理顏色變數
    Object.entries(cssVariables).forEach(([name, value]) => {
      if (name.startsWith('colors-')) {
        const [, category] = name.split('-');
        if (category) {

          // 處理特殊的顏色變數名稱
          if (category === 'base') {
            const [, , shade] = name.split('-');
            tokens.colors.base[shade] = value;
          } else if (category === 'brand') {
            const [, , shade] = name.split('-');
            tokens.colors.brand[shade] = value;
          } else if (category === 'error') {
            const [, , shade] = name.split('-');
            tokens.colors.error[shade] = value;
          } else if (category === 'warning') {
            const [, , shade] = name.split('-');
            tokens.colors.warning[shade] = value;
          } else if (category === 'success') {
            const [, , shade] = name.split('-');
            tokens.colors.success[shade] = value;
          } else if (category === 'green') {
            const [, , shade] = name.split('-');
            tokens.colors.green[shade] = value;
          } else if (category === 'blue') {
            const [, , shade] = name.split('-');
            tokens.colors.blue[shade] = value;
          } else if (category === 'gray') {
            // 處理 gray 的各種變體
            const remainingParts = name.split('-').slice(2).join('-');

            if (remainingParts.includes('(light-mode)')) {
              const grayShade = remainingParts.replace('(light-mode)-', '');
              tokens.colors.gray[grayShade] = value;
            } else if (remainingParts.includes('(dark-mode)')) {
              const grayShade = remainingParts.replace('(dark-mode)-', '');
              tokens.colors.gray[grayShade] = value;
            } else if (remainingParts.includes('(dark-mode-alpha)')) {
              const grayShade = remainingParts.replace(
                '(dark-mode-alpha)-',
                ''
              );
              tokens.colors.gray[grayShade] = value;
            } else {
              // 處理其他 gray 變體（blue, cool, modern, neutral, iron, true, warm）
              const grayShade = remainingParts;
              tokens.colors.gray[grayShade] = value;
            }
          }
        }
      }
    });

    // 處理間距變數
    Object.entries(cssVariables).forEach(([name, value]) => {
      if (name.startsWith('spacing-')) {
        const [, key] = name.match(/spacing-([^-]+)/) || [];
        if (key) {
          const numValue = parseInt(value);
          if (!isNaN(numValue)) {
            tokens.spacing[key] = numValue;
          }
        }
      }
    });

    // 處理圓角變數
    Object.entries(cssVariables).forEach(([name, value]) => {
      if (name.startsWith('radius-')) {
        const [, key] = name.match(/radius-([^-]+)/) || [];
        if (key) {
          const numValue = parseInt(value);
          if (!isNaN(numValue)) {
            tokens.radius[key] = numValue;
          }
        }
      }
    });

    // 處理字體變數
    Object.entries(cssVariables).forEach(([name, value]) => {
      if (name.startsWith('font-family-')) {
        const [, key] = name.match(/font-family-([^-]+)/) || [];
        if (key) {
          tokens.typography.fontFamily[key] = value;
        }
      } else if (name.startsWith('font-weight-')) {
        const [, key] = name.match(/font-weight-([^-]+)/) || [];
        if (key) {
          tokens.typography.fontWeight[key] = value;
        }
      } else if (name.startsWith('font-size-')) {
        const [, key] = name.match(/font-size-([^-]+)/) || [];
        if (key) {
          const numValue = parseInt(value);
          if (!isNaN(numValue)) {
            tokens.typography.fontSize[key] = numValue;
          }
        }
      } else if (name.startsWith('line-height-')) {
        const [, key] = name.match(/line-height-([^-]+)/) || [];
        if (key) {
          const numValue = parseInt(value);
          if (!isNaN(numValue)) {
            tokens.typography.lineHeight[key] = numValue;
          }
        }
      }
    });

    return tokens;
  }

  generateEnterpriseTokens(baseTokens) {
    const enterpriseTokens = JSON.parse(JSON.stringify(baseTokens));

    // 企業版主題的顏色調整
    enterpriseTokens.colors.brand = {
      25: '#f0f4ff',
      50: '#e6f0ff',
      100: '#cce0ff',
      200: '#99c2ff',
      300: '#66a3ff',
      400: '#3385ff',
      500: '#0066ff',
      600: '#0052cc',
      700: '#003d99',
      800: '#002966',
      900: '#001433',
      950: '#000a1a',
    };

    return enterpriseTokens;
  }

  generateMonochromeTokens(baseTokens) {
    const monochromeTokens = JSON.parse(JSON.stringify(baseTokens));

    // 黑白灰色調主題
    const grayColors = baseTokens.colors.gray;
    monochromeTokens.colors.brand = grayColors;
    monochromeTokens.colors.error = grayColors;
    monochromeTokens.colors.warning = grayColors;
    monochromeTokens.colors.success = grayColors;

    return monochromeTokens;
  }

  saveTokens(tokens, filename) {
    if (!fs.existsSync(this.rawTokensDir)) {
      fs.mkdirSync(this.rawTokensDir, { recursive: true });
    }

    const filePath = path.join(this.rawTokensDir, filename);
    fs.writeFileSync(filePath, JSON.stringify(tokens, null, 2));
    console.log(`  ✅ Generated ${filename}`);
  }

  convert() {
    console.log('🔄 Converting CSS to JSON tokens...');

    if (!fs.existsSync(this.cssFilePath)) {
      console.error('❌ 找不到 figma-tokens.css 文件');
      return;
    }

    const cssContent = fs.readFileSync(this.cssFilePath, 'utf8');
    const cssVariables = this.parseCSSVariables(cssContent);

    // 轉換為基礎 token 結構
    const baseTokens = this.convertToTokenStructure(cssVariables);

    // 生成企業版主題
    const enterpriseTokens = this.generateEnterpriseTokens(baseTokens);

    // 生成黑白灰色調主題
    const monochromeTokens = this.generateMonochromeTokens(baseTokens);

    // 保存所有主題
    this.saveTokens(baseTokens, 'base-tokens.json');
    this.saveTokens(enterpriseTokens, 'enterprise-tokens.json');
    this.saveTokens(monochromeTokens, 'monochrome-tokens.json');

    console.log('✅ CSS to JSON conversion completed!');
  }
}

// 主執行邏輯
function main() {
  const converter = new CSSToJSONConverter();
  converter.convert();
}

if (require.main === module) {
  main();
}

module.exports = CSSToJSONConverter;
