import nx from '@nx/eslint-plugin';

export default [
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  ...nx.configs['flat/react'],
  {
    ignores: [
      // Build outputs
      '**/dist/**',
      '**/build/**',
      '**/out/**',
      '**/.next/**',

      // Dependencies
      '**/node_modules/**',

      // Generated files
      '**/generated/**',
      '**/*.generated.*',
      '**/coverage/**',

      // Config files
      '**/*.config.*',
      '**/vite.config.*.timestamp*',
      '**/vitest.config.*.timestamp*',

      // Nx cache
      '**/.nx/**',

      // Only check src directories (exclude non-src files)
      '!**/src/**',

      // Specific app exclusions (if needed)
      'apps/auth/**',

      // Generated API client files
      'libs/api-client/src/generated/**',
    ],
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
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
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?[jt]s$'],
          depConstraints: [
            {
              sourceTag: '*',
              onlyDependOnLibsWithTags: ['*'],
            },
          ],
        },
      ],
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.cts', '**/*.mts'],
    languageOptions: {
      parserOptions: {
        project: [
          './tsconfig.base.json',
          './apps/*/tsconfig.app.json',
          './apps/*/tsconfig.json',
          './libs/*/tsconfig.lib.json',
        ],
        tsconfigRootDir: process.cwd(),
        createDefaultProgram: true,
      },
    },
    rules: {
      // 命名規範 - 放寬規則
      '@typescript-eslint/naming-convention': [
        'warn',
        {
          selector: 'default',
          format: ['camelCase'],
          leadingUnderscore: 'forbid',
          trailingUnderscore: 'forbid',
        },
        {
          selector: 'variable',
          format: ['camelCase', 'UPPER_CASE'],
          leadingUnderscore: 'forbid',
          trailingUnderscore: 'forbid',
        },
        {
          selector: 'parameter',
          format: ['camelCase'],
          leadingUnderscore: 'allow',
          trailingUnderscore: 'forbid',
        },
        {
          selector: 'memberLike',
          modifiers: ['private'],
          format: ['camelCase'],
          leadingUnderscore: 'require',
        },
        {
          selector: 'typeLike',
          format: ['PascalCase'],
        },
        {
          selector: 'enumMember',
          format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
        },
        {
          selector: 'function',
          format: ['camelCase', 'PascalCase'],
        },
        // 允許 React 組件使用 PascalCase
        {
          selector: 'variable',
          format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
          filter: {
            regex: '^[A-Z]',
            match: true,
          },
        },
        // 允許數字屬性名稱（用於設計系統 tokens）
        {
          selector: 'property',
          format: null,
          custom: {
            regex: '^[0-9]+$|^[0-9]+\\.[0-9]+$|^[a-zA-Z]+$|^[a-zA-Z]+[0-9]+$',
            match: true,
          },
        },
        // 允許 CSS 偽類選擇器
        {
          selector: 'property',
          format: null,
          custom: {
            regex: '^:[a-zA-Z-]+$',
            match: true,
          },
        },
        // 允許 React Router 配置屬性
        {
          selector: 'property',
          format: null,
          custom: {
            regex: '^v7_[a-zA-Z]+$',
            match: true,
          },
        },
        // 允許 Vite 配置屬性
        {
          selector: 'property',
          format: null,
          custom: {
            regex: '^@[a-zA-Z-]+/[a-zA-Z-]+$',
            match: true,
          },
        },
        // 允許 HTTP 標頭屬性
        {
          selector: 'property',
          format: null,
          custom: {
            regex: '^[A-Z][a-zA-Z-]+$',
            match: true,
          },
        },
        // 允許第三方 API 的下劃線命名（如 text_data, image_data）
        {
          selector: 'property',
          format: null,
          custom: {
            regex: '^[a-zA-Z]+_[a-zA-Z]+$',
            match: true,
          },
        },
      ],

      // 程式碼品質
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      'prefer-const': 'error',
      '@typescript-eslint/no-var-requires': 'error',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/prefer-nullish-coalescing': 'error',
      '@typescript-eslint/prefer-optional-chain': 'error',

      // React 相關
      'react/jsx-uses-react': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react/jsx-props-no-spreading': 'off',
      'react/require-default-props': 'off',
      'react/jsx-no-useless-fragment': 'error',
      'react/jsx-key': 'error',
      'react/no-array-index-key': 'warn',
      'react/self-closing-comp': 'error',

      // 一般程式碼風格
      'no-console': 'warn',
      'no-debugger': 'error',
      'no-alert': 'warn',
      'no-var': 'error',
      'prefer-template': 'error',
      'object-shorthand': 'error',
      'prefer-destructuring': [
        'error',
        {
          array: true,
          object: true,
        },
        {
          enforceForRenamedProperties: false,
        },
      ],
      'no-duplicate-imports': 'error',
      'sort-imports': [
        'error',
        {
          ignoreCase: false,
          ignoreDeclarationSort: true,
          ignoreMemberSort: true, // 忽略成員排序，讓 TypeScript 的 type 導入保持在前
          memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
          allowSeparatedGroups: true,
        },
      ],

      // 檔案組織
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
          ],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
          pathGroups: [
            {
              pattern: '**/*.css',
              group: 'index',
              position: 'after',
            },
          ],
        },
      ],
      'import/no-duplicates': 'error',
      'import/no-unresolved': 'off', // 由 TypeScript 處理
      'import/extensions': 'off', // 在 TypeScript 項目中通常不需要強制文件擴展名
      // 配合 TypeScript 的導入檢查 - 強制 type 導入排在前面
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          disallowTypeAnnotations: false,
          fixStyle: 'inline-type-imports',
        },
      ],
    },
  },
  {
    files: ['**/*.js', '**/*.jsx', '**/*.cjs', '**/*.mjs'],
    rules: {
      // JavaScript 檔案的規則（不需要 TypeScript 特定規則）
      'no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      'prefer-const': 'error',
      'no-var': 'error',
      'prefer-template': 'error',
      'object-shorthand': 'error',
      'prefer-destructuring': [
        'error',
        {
          array: true,
          object: true,
        },
        {
          enforceForRenamedProperties: false,
        },
      ],
      'no-duplicate-imports': 'error',
      'sort-imports': [
        'error',
        {
          ignoreCase: false,
          ignoreDeclarationSort: true,
          ignoreMemberSort: true, // 忽略成員排序，讓 TypeScript 的 type 導入保持在前
          memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
          allowSeparatedGroups: true,
        },
      ],
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
          ],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
          pathGroups: [
            {
              pattern: '**/*.css',
              group: 'index',
              position: 'after',
            },
          ],
        },
      ],
      'import/no-duplicates': 'error',
      'import/no-unresolved': 'off',
      'import/extensions': 'off', // 在 TypeScript 項目中通常不需要強制文件擴展名
      // 配合 TypeScript 的導入檢查 - 強制 type 導入排在前面
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          disallowTypeAnnotations: false,
          fixStyle: 'inline-type-imports',
        },
      ],
    },
  },
];
