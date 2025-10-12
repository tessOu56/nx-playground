import { FlatCompat } from '@eslint/eslintrc';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import js from '@eslint/js';
import { fixupConfigRules } from '@eslint/compat';

const compat = new FlatCompat({
  baseDirectory: dirname(fileURLToPath(import.meta.url)),
  recommendedConfig: js.configs.recommended,
});

export default [
  ...fixupConfigRules(compat.extends('next')),
  ...fixupConfigRules(compat.extends('next/core-web-vitals')),
  {
    ignores: [
      '.next/**/*',
      'node_modules/**/*',
      'out/**/*',
      'dist/**/*',
      'build/**/*',
      'generated/**/*',
    ],
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      // 禁用有問題的規則
      '@typescript-eslint/no-array-constructor': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      // 確保 naming-convention 規則可用
      '@typescript-eslint/naming-convention': 'off',
    },
  },
];
