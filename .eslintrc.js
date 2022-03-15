module.exports = {
  root: true,

  extends: [
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
  ],

  plugins: [
    '@typescript-eslint',
  ],

  parser: '@typescript-eslint/parser',

  parserOptions: {
    project: './tsconfig.json',
    ecmaVersion: "latest", // Allows the use of modern ECMAScript features
    sourceType: "module", // Allows for the use of imports
  },

  env: {
    node: true,
    jest: true,
  },

  ignorePatterns: [
    '.eslintrc.js',
    'jest.config.js',
  ],

  rules: {
    // off
    'import/prefer-default-export': 'off',
    "indent": "off",
    
    // warning
    'no-console': 'warn',
    '@typescript-eslint/no-unused-vars': 'warn',
    
    // on
    '@typescript-eslint/indent': ['error', 2], // in place of "indent"
    'comma-dangle': ['error', 'always-multiline'],
    'object-curly-spacing': ['error', 'always'],
    'quotes': ['error', 'single'],
    'semi': ['error', 'never'],
    'prefer-promise-reject-errors': ['error'],
    'no-throw-literal': ['error'],
    'no-useless-catch': ['error'],
    'no-multi-spaces': ['error'],
  },
}