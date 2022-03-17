module.exports = {
  extends: [
    '../.eslintrc.js',
    'plugin:node/recommended',
  ],

  env: {
    "browser": false,
  },

  plugins: [
    'node',
  ],

  parser: '@typescript-eslint/parser',

  parserOptions: {
    project: './tsconfig.json',
  },

  settings: {
    node: {
      tryExtensions: ['.js', '.json', '.ts'],
    },
  },

  rules: {
    // off
    'node/no-missing-import': 'off',
    'no-console': 'off',

    // on
    'node/no-unsupported-features/es-syntax': ['error', {
      'ignores': ['modules'],
    }],
  },
}
