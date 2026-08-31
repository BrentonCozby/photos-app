const stylistic = require('@stylistic/eslint-plugin')
const n = require('eslint-plugin-n')
const simpleImportSort = require('eslint-plugin-simple-import-sort')
const globals = require('globals')
const tseslint = require('typescript-eslint')

module.exports = tseslint.config(
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      'spa/src/vite-env.d.ts',
    ],
  },

  {
    files: ['**/*.ts'],
    extends: [tseslint.configs.recommended],
  },

  {
    files: ['**/*.ts'],

    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },

    plugins: {
      '@stylistic': stylistic,
      'simple-import-sort': simpleImportSort,
    },

    rules: {
      // off
      '@typescript-eslint/no-explicit-any': 'off',

      // warning
      'no-console': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',

      // on
      '@stylistic/indent': ['error', 2],
      '@stylistic/comma-dangle': ['error', 'always-multiline'],
      '@stylistic/comma-spacing': ['error', { 'after': true }],
      '@stylistic/object-curly-spacing': ['error', 'always'],
      '@stylistic/quotes': ['error', 'single'],
      '@stylistic/semi': ['error', 'never'],
      '@stylistic/no-multi-spaces': ['error'],
      'prefer-promise-reject-errors': ['error'],
      'no-throw-literal': ['error'],
      'no-useless-catch': ['error'],
      'simple-import-sort/imports': [
        'error',
        {
          // Custom Grouping: https://github.com/lydell/eslint-plugin-simple-import-sort#custom-grouping
          // Examples: https://github.com/lydell/eslint-plugin-simple-import-sort/blob/main/examples/.eslintrc.js
          groups: [
            // Side effect imports.
            ['^\\u0000'],
            // Node.js builtins prefixed with `node:`.
            ['^node:'],
            // Packages: anything starting with a letter, digit or `_`, or with
            // `@` not followed by legacy|test|fixtures.
            ['^(\\w|@(?!legacy|test|fixtures)\\w)'],
            // Absolute imports and other imports such as Vue-style `@/foo`.
            // Anything not matched in another group.
            ['^'],
            // Relative imports.
            // Anything that starts with a dot.
            ['^\\.'],
          ],
        },
      ],
      'simple-import-sort/exports': 'error',
    },
  },

  {
    files: ['server/**/*.ts'],

    ...n.configs['flat/recommended'],

    rules: {
      ...n.configs['flat/recommended'].rules,
      'n/no-missing-import': 'off',
      // The plugin cannot resolve the @/ alias, so every internal import reads
      // as an unpublished package.
      'n/no-unpublished-import': 'off',
      'no-console': 'off',
      'n/no-unsupported-features/es-syntax': ['error', {
        'ignores': ['modules'],
      }],
    },
  },
)
