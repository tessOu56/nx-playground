module.exports = {
  // TypeScript/JavaScript 文件
  '*.{ts,tsx,js,jsx}': [
    // 先運行 ESLint 修復
    'eslint --fix',
    // 然後運行 Prettier 格式化
    'prettier --write',
    // 最後再次運行 ESLint 確保沒有問題
    'eslint --fix',
  ],

  // 樣式文件
  '*.{css,scss,css.ts,css.tsx}': ['prettier --write'],

  // 配置文件
  '*.{json,md,html,yaml,yml}': ['prettier --write'],

  // 其他文件類型
  '*.{txt,log}': ['prettier --write --parser markdown'],
};
