#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// 顏色輸出函數
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
};

function colorize(text, color) {
  return `${colors[color]}${text}${colors.reset}`;
}

function printHeader() {
  console.log(colorize('🎨 Design Tokens Viewer', 'bright'));
  console.log(colorize('========================', 'cyan'));
  console.log('');
}

function printColorPreview(colorName, colorValue) {
  // 簡單的顏色預覽（使用 ANSI 顏色）
  const preview = '■■■■';
  console.log(
    `  ${preview} ${colorize(colorName.padEnd(15), 'bright')} ${colorize(
      colorValue,
      'cyan'
    )}`
  );
}

function printSpacingPreview(spacingName, spacingValue) {
  const preview = '─'.repeat(Math.min(parseInt(spacingValue), 20));
  console.log(
    `  ${preview} ${colorize(spacingName.padEnd(15), 'bright')} ${colorize(
      `${spacingValue}px`,
      'cyan'
    )}`
  );
}

function printRadiusPreview(radiusName, radiusValue) {
  const preview = '◉';
  console.log(
    `  ${preview} ${colorize(radiusName.padEnd(15), 'bright')} ${colorize(
      `${radiusValue}px`,
      'cyan'
    )}`
  );
}

function viewTokens() {
  const tokensPath = path.join(
    __dirname,
    '../src/tokens/generated/tokens.json'
  );

  if (!fs.existsSync(tokensPath)) {
    console.log(
      colorize(
        '❌ Tokens file not found. Run "pnpm run design:tokens" first.',
        'red'
      )
    );
    return;
  }

  try {
    const tokensData = JSON.parse(fs.readFileSync(tokensPath, 'utf8'));

    printHeader();

    // 顯示元數據
    console.log(colorize('📊 Metadata:', 'yellow'));
    console.log(`  Generated: ${tokensData.metadata.generatedAt}`);
    console.log(`  Version: ${tokensData.metadata.version}`);
    console.log('');

    // 顯示顏色
    if (tokensData.colors) {
      console.log(colorize('🎨 Colors:', 'yellow'));
      Object.entries(tokensData.colors).forEach(([category, colorTokens]) => {
        console.log(colorize(`  ${category.toUpperCase()}:`, 'green'));
        if (typeof colorTokens === 'object' && colorTokens !== null) {
          Object.entries(colorTokens).forEach(([shade, value]) => {
            printColorPreview(`${category}-${shade}`, value);
          });
        }
        console.log('');
      });
    }

    // 顯示間距
    if (tokensData.spacing) {
      console.log(colorize('📏 Spacing:', 'yellow'));
      Object.entries(tokensData.spacing).forEach(([name, value]) => {
        printSpacingPreview(name, value);
      });
      console.log('');
    }

    // 顯示圓角
    if (tokensData.radius) {
      console.log(colorize('🔘 Border Radius:', 'yellow'));
      Object.entries(tokensData.radius).forEach(([name, value]) => {
        printRadiusPreview(name, value);
      });
      console.log('');
    }

    // 顯示語義化顏色
    if (tokensData.semantic) {
      console.log(colorize('🎯 Semantic Colors:', 'yellow'));
      console.log(colorize('  Text Colors:', 'green'));
      Object.entries(tokensData.semantic.text).forEach(([name, value]) => {
        console.log(
          `    ${colorize(name.padEnd(15), 'bright')} ${colorize(
            value,
            'cyan'
          )}`
        );
      });
      console.log('');

      console.log(colorize('  Background Colors:', 'green'));
      Object.entries(tokensData.semantic.background).forEach(
        ([name, value]) => {
          console.log(
            `    ${colorize(name.padEnd(15), 'bright')} ${colorize(
              value,
              'cyan'
            )}`
          );
        }
      );
      console.log('');

      console.log(colorize('  Border Colors:', 'green'));
      Object.entries(tokensData.semantic.border).forEach(([name, value]) => {
        console.log(
          `    ${colorize(name.padEnd(15), 'bright')} ${colorize(
            value,
            'cyan'
          )}`
        );
      });
      console.log('');
    }

    // 顯示 Tailwind 類別
    console.log(colorize('🛠️  Tailwind Classes:', 'yellow'));
    console.log(colorize('  Example usage:', 'green'));
    console.log(`    ${colorize('bg-blue-500', 'cyan')} - Background color`);
    console.log(`    ${colorize('text-gray-900', 'cyan')} - Text color`);
    console.log(`    ${colorize('p-4', 'cyan')} - Padding`);
    console.log(`    ${colorize('rounded-md', 'cyan')} - Border radius`);
    console.log(
      `    ${colorize('text-text-primary', 'cyan')} - Semantic text color`
    );
    console.log(
      `    ${colorize(
        'bg-background-primary',
        'cyan'
      )} - Semantic background color`
    );
    console.log('');

    // 顯示檔案位置
    console.log(colorize('📁 Generated Files:', 'yellow'));
    console.log(`  ${colorize('TOKENS.md', 'cyan')} - Documentation`);
    console.log(
      `  ${colorize('tokens-visual.html', 'cyan')} - Visual reference`
    );
    console.log(`  ${colorize('tokens.json', 'cyan')} - JSON format`);
    console.log(
      `  ${colorize('tailwind-variables.css', 'cyan')} - CSS variables`
    );
    console.log('');
  } catch (error) {
    console.log(colorize(`❌ Error reading tokens: ${error.message}`, 'red'));
  }
}

// 如果直接運行此腳本
if (require.main === module) {
  viewTokens();
}

module.exports = { viewTokens };
