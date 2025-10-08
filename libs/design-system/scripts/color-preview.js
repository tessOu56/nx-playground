#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// ANSI 顏色代碼
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
  bgBlue: '\x1b[44m',
  bgMagenta: '\x1b[45m',
  bgCyan: '\x1b[46m',
  bgWhite: '\x1b[47m',
};

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

function getAnsiColor(r, g, b) {
  // 簡單的顏色映射（實際的 ANSI 256 色支援更複雜）
  if (r > 200 && g > 200 && b > 200) return colors.bgWhite;
  if (r > 200 && g < 100 && b < 100) return colors.bgRed;
  if (r < 100 && g > 200 && b < 100) return colors.bgGreen;
  if (r < 100 && g < 100 && b > 200) return colors.bgBlue;
  if (r > 200 && g > 200 && b < 100) return colors.bgYellow;
  if (r > 200 && g < 100 && b > 200) return colors.bgMagenta;
  if (r < 100 && g > 200 && b > 200) return colors.bgCyan;
  return colors.bgWhite;
}

function printColorPreview(colorName, colorValue) {
  const rgb = hexToRgb(colorValue);
  if (rgb) {
    const ansiColor = getAnsiColor(rgb.r, rgb.g, rgb.b);
    const preview = `${ansiColor}  ${colors.reset}`;
    console.log(
      `  ${preview} ${colors.bright}${colorName.padEnd(20)}${colors.reset} ${
        colors.cyan
      }${colorValue}${colors.reset}`
    );
  } else {
    console.log(
      `  ■■■■ ${colors.bright}${colorName.padEnd(20)}${colors.reset} ${
        colors.cyan
      }${colorValue}${colors.reset}`
    );
  }
}

function showColorPreview() {
  const tokensPath = path.join(
    __dirname,
    '../src/tokens/generated/tokens.json'
  );

  if (!fs.existsSync(tokensPath)) {
    console.log(
      `${colors.red 
        }❌ Tokens file not found. Run "pnpm run design:tokens" first.${ 
        colors.reset}`
    );
    return;
  }

  try {
    const tokensData = JSON.parse(fs.readFileSync(tokensPath, 'utf8'));

    console.log(
      `${colors.bright  }🎨 Design Tokens Color Preview${  colors.reset}`
    );
    console.log(
      `${colors.cyan  }================================${  colors.reset}`
    );
    console.log('');

    // 顯示主要顏色
    if (tokensData.colors) {
      console.log(`${colors.yellow  }🎨 Main Colors:${  colors.reset}`);

      // 藍色系
      if (tokensData.colors.blue) {
        console.log(`${colors.green  }  Blue:${  colors.reset}`);
        Object.entries(tokensData.colors.blue).forEach(([shade, value]) => {
          printColorPreview(`blue-${shade}`, value);
        });
        console.log('');
      }

      // 灰色系
      if (tokensData.colors.gray) {
        console.log(`${colors.green  }  Gray:${  colors.reset}`);
        Object.entries(tokensData.colors.gray).forEach(([shade, value]) => {
          if (shade.match(/^\d+$/)) {
            // 只顯示數字色階
            printColorPreview(`gray-${shade}`, value);
          }
        });
        console.log('');
      }

      // 語義化顏色
      if (tokensData.colors.brand) {
        console.log(`${colors.green  }  Brand:${  colors.reset}`);
        Object.entries(tokensData.colors.brand).forEach(([shade, value]) => {
          printColorPreview(`brand-${shade}`, value);
        });
        console.log('');
      }

      // 錯誤顏色
      if (tokensData.colors.error) {
        console.log(`${colors.green  }  Error:${  colors.reset}`);
        Object.entries(tokensData.colors.error).forEach(([shade, value]) => {
          printColorPreview(`error-${shade}`, value);
        });
        console.log('');
      }

      // 成功顏色
      if (tokensData.colors.success) {
        console.log(`${colors.green  }  Success:${  colors.reset}`);
        Object.entries(tokensData.colors.success).forEach(([shade, value]) => {
          printColorPreview(`success-${shade}`, value);
        });
        console.log('');
      }
    }

    console.log(`${colors.yellow  }💡 Tips:${  colors.reset}`);
    console.log(
      '  • 在 VS Code 中安裝 "Color Highlight" 擴展來在編輯器中顯示顏色'
    );
    console.log(
      '  • 使用 "pnpm run design:tokens:view" 查看完整的 tokens 列表'
    );
    console.log('  • 在瀏覽器中打開 tokens-visual.html 查看視覺化參考');
    console.log('');
  } catch (error) {
    console.log(
      `${colors.red  }❌ Error reading tokens: ${error.message}${  colors.reset}`
    );
  }
}

// 如果直接運行此腳本
if (require.main === module) {
  showColorPreview();
}

module.exports = { showColorPreview };
