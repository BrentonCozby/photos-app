module.exports = {
  preset:  'ts-jest',
  testEnvironment: 'node',
  setupFiles: ['dotenv/config'],
  verbose: true,
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  transform: {
    '^.+\\.ts?': 'ts-jest',
  },
  globals: {
    'ts-jest': {
      diagnostics: false,
    },
  },
}