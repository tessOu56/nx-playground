const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');
const { join } = require('path');

const parentConfig = require('../../tailwind.config.js');

/** @type {import('tailwindcss').Config} */
module.exports = {
  ...parentConfig,
  content: [
    join(__dirname, 'src/**/*.{js,ts,jsx,tsx}'),
    join(
      __dirname,
      '../../node_modules/.pnpm/@is_tess+components@*/node_modules/@is_tess/components/dist/**/*.{js,mjs}'
    ),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {
      ...(parentConfig.theme?.extend ?? {}),
      colors: {
        ...(parentConfig.theme?.extend?.colors ?? {}),
        background: {
          DEFAULT: 'var(--background)',
          ...(parentConfig.theme?.extend?.colors?.background ?? {}),
        },
        foreground: {
          DEFAULT: 'var(--foreground)',
          muted: 'var(--muted-foreground)',
        },
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        border: {
          DEFAULT: 'var(--border)',
          ...(parentConfig.theme?.extend?.colors?.border ?? {}),
        },
        input: 'var(--input)',
        ring: 'var(--ring)',
        destructive: {
          DEFAULT: 'var(--destructive)',
          foreground: 'var(--destructive-foreground)',
        },
        line: {
          DEFAULT: 'var(--line)',
          strong: 'var(--line-strong)',
          hover: 'var(--line-strong-hover)',
          foreground: 'var(--line-foreground)',
        },
      },
      borderRadius: {
        ...(parentConfig.theme?.extend?.borderRadius ?? {}),
        DEFAULT: 'var(--radius)',
      },
    },
  },
};
