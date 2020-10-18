module.exports = {
  collectCoverage: true,
  coveragePathIgnorePatterns: ['/node_modules/', '<rootDir>/__tests__/client/helpers'],
  coverageReporters: ['html', 'json', 'lcov', 'text'],
  coverageThreshold: {
    global: {
      branches: 95,
      functions: 95,
      lines: 95,
      statements: -10,
    },
  },
  moduleDirectories: ['node_modules', 'client/src'],
  moduleNameMapper: {
    '^@/(.*)': '<rootDir>/client/src/$1',
  },
  setupFiles: ['<rootDir>/__mocks__/localStorage.js'],
  testMatch: ['**/__tests__/client/**/*.spec.js?(x)'],
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
  testURL: 'http://localhost',
  verbose: true,
};
