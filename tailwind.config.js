// 導入 design-system 的 Tailwind 配置
const designSystemConfig = require('./libs/design-system/src/tokens/generated/tailwind-config.js');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // Apps
    './apps/*/src/**/*.{js,ts,jsx,tsx}',
    './apps/*/index.html',
    './apps/*/public/**/*.html',

    // Libraries
    './libs/*/src/**/*.{js,ts,jsx,tsx}',

    // Root files
    './*.html',
    './*.js',
    './*.ts',
  ],
  theme: {
    extend: {
      // 使用 design-system 的完整配置
      ...designSystemConfig.theme.extend,

      // 語義化顏色映射
      colors: {
        ...designSystemConfig.theme.extend.colors,
        // 語義化顏色映射 - 使用 brand 顏色作為 primary
        primary: {
          50: 'var(--color-brand-50)',
          100: 'var(--color-brand-100)',
          200: 'var(--color-brand-200)',
          300: 'var(--color-brand-300)',
          400: 'var(--color-brand-400)',
          500: 'var(--color-brand-500)',
          600: 'var(--color-brand-600)',
          700: 'var(--color-brand-700)',
          800: 'var(--color-brand-800)',
          900: 'var(--color-brand-900)',
          950: 'var(--color-brand-950)',
        },
        secondary: {
          50: 'var(--color-gray-50)',
          100: 'var(--color-gray-100)',
          200: 'var(--color-gray-200)',
          300: 'var(--color-gray-300)',
          400: 'var(--color-gray-400)',
          500: 'var(--color-gray-500)',
          600: 'var(--color-gray-600)',
          700: 'var(--color-gray-700)',
          800: 'var(--color-gray-800)',
          900: 'var(--color-gray-900)',
          950: 'var(--color-gray-950)',
        },
        // 語義化背景顏色
        background: {
          primary: 'var(--color-background-primary)',
          secondary: 'var(--color-background-secondary)',
          tertiary: 'var(--color-background-tertiary)',
          inverse: 'var(--color-background-inverse)',
        },
        // 語義化文字顏色
        text: {
          primary: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
          tertiary: 'var(--color-text-tertiary)',
          inverse: 'var(--color-text-inverse)',
          disabled: 'var(--color-text-disabled)',
        },
        // 語義化邊框顏色
        border: {
          primary: 'var(--color-border-primary)',
          secondary: 'var(--color-border-secondary)',
          focus: 'var(--color-border-focus)',
          error: 'var(--color-border-error)',
          success: 'var(--color-border-success)',
          warning: 'var(--color-border-warning)',
        },
      },

      // 字體配置
      fontFamily: {
        ...designSystemConfig.theme.extend.fontFamily,
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },

      // 額外的間距
      spacing: {
        ...designSystemConfig.theme.extend.spacing,
        18: '4.5rem',
        88: '22rem',
      },

      // 額外的圓角
      borderRadius: {
        ...designSystemConfig.theme.extend.borderRadius,
        '4xl': '2rem',
      },

      // 動畫配置
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        spin: 'spin 1s linear infinite',
        ping: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        bounce: 'bounce 1s infinite',
      },

      // 關鍵幀動畫
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        spin: {
          to: { transform: 'rotate(360deg)' },
        },
        ping: {
          '75%, 100%': {
            transform: 'scale(2)',
            opacity: '0',
          },
        },
        pulse: {
          '50%': { opacity: '0.5' },
        },
        bounce: {
          '0%, 100%': {
            transform: 'translateY(-25%)',
            animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)',
          },
          '50%': {
            transform: 'none',
            animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)',
          },
        },
      },

      // 陰影配置
      boxShadow: {
        xs: 'var(--shadow-xs)',
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        xl: 'var(--shadow-xl)',
        '2xl': 'var(--shadow-2xl)',
        inner: 'var(--shadow-inner)',
      },

      // 過渡配置
      transitionProperty: {
        all: 'all',
        colors:
          'color, background-color, border-color, text-decoration-color, fill, stroke',
        opacity: 'opacity',
        shadow: 'box-shadow',
        transform: 'transform',
      },

      // 容器配置
      maxWidth: {
        'container-desktop': '1280px',
        paragraph: '720px',
      },

      // 響應式斷點
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },
    },
  },

  // 深色模式配置
  darkMode: 'class',

  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
};
