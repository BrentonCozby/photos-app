module.exports = {
  root: true,

  extends: [
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
  ],

  plugins: [
    '@typescript-eslint',
    'simple-import-sort',
  ],

  parser: '@typescript-eslint/parser',

  parserOptions: {
    project: './tsconfig.json',
    ecmaVersion: 'latest', // Allows the use of modern ECMAScript features
    sourceType: 'module', // Allows for the use of imports
  },

  env: {
    node: true,
    jest: true,
  },

  ignorePatterns: [
    '.eslintrc.js',
    'jest.config.js',
    'dist',
  ],

  rules: {
    // off
    'import/prefer-default-export': 'off',
    'indent': 'off',
    '@typescript-eslint/no-explicit-any': 'off',

    // warning
    'no-console': 'warn',
    '@typescript-eslint/no-unused-vars': 'warn',

    // on
    '@typescript-eslint/indent': ['error', 2], // in place of 'indent'
    'comma-dangle': ['error', 'always-multiline'],
    'comma-spacing': ['error', { 'after': true }],
    'object-curly-spacing': ['error', 'always'],
    'quotes': ['error', 'single'],
    'semi': ['error', 'never'],
    'prefer-promise-reject-errors': ['error'],
    'no-throw-literal': ['error'],
    'no-useless-catch': ['error'],
    'no-multi-spaces': ['error'],
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
          // Packages.
          // Things that start with a letter (or digit or underscore), or `@` and is not followed by legacy|test|fixtures.
          // then followed by letter digit or whitespace (supports our aliases)
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
}
