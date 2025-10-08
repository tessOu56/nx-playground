// apps/events/tailwind.config.js
const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');
const { join } = require('path');

// 匯入根目錄的配置
const parentConfig = require('../../tailwind.config.js');

/** @type {import('tailwindcss').Config} */
module.exports = {
  // 展開根目錄的配置
  ...parentConfig,

  // 覆寫或擴展內容來源，確保包含這個應用程式的檔案
  content: [
    join(__dirname, 'src/**/*.{js,ts,jsx,tsx}'),
    join(__dirname, 'app/**/*.{js,ts,jsx,tsx}'),
    join(__dirname, 'components/**/*.{js,ts,jsx,tsx}'),
    ...createGlobPatternsForDependencies(join(__dirname, 'apps/events')),
  ],

  // 可以在這裡擴展或修改主題
  theme: {
    extend: {},
  },

  // 可以在這裡為這個應用程式添加額外的外掛
  plugins: [],
};
