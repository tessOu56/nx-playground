/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    // Include ui-components for proper class detection
    '../../libs/ui-components/src/**/*.{js,jsx,ts,tsx}',
  ],

  // Extend design-system configuration
  presets: [
    require('../../libs/design-system/src/tokens/generated/tailwind-config.js'),
  ],

  theme: {
    extend: {
      // Auth app specific brand colors (keep for Ory integration UI)
      colors: {
        // Primary brand color (brick red)
        'auth-primary': '#B34438',
        'auth-primary-light': '#C26960',
        'auth-primary-dark': '#A33E33',
        'auth-primary-lighter': '#DCA9A3',
        'auth-primary-lightest': '#CC827A',

        // Keep old aliases for backward compatibility
        primary: '#B34438',
        primary_light: '#C26960',
        primary_dark: '#A33E33',
        primary_lighter: '#DCA9A3',
        primary_lightest: '#CC827A',

        error: '#C81E1E',

        // Text colors
        text: '#847166',
        text_light: '#5B4233',
        text_dark: '#331301',
        text_lighter: '#ADA199',

        // Base colors
        base: '#FAF9F4',
        border: '#C8D8FF',

        // Avatar
        avatar_default: '#DBE4F7',

        // LINE brand colors
        line_default: '#06C755',
        line_dark: '#05B44C',
        line_darker: '#028B3C',

        // Gray scale
        gary_default: '#1E1E1E33',
        gray_lightest: '#D9D9D9',
        gray_light: '#E5E5E599',
        gray_lighter: '#BDBDBD',
        gray_dark: '#747775',
        gray_darker: '#9D9D9D',
        gray_darkest: '#1F1F1F',
      },
    },
  },

  darkMode: 'class',
  plugins: [],
};
