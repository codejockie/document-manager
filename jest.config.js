module.exports = {
  coverageReporters: ['html', 'json', 'lcov', 'text'],
  moduleNameMapper: {
    '^@/(.*)': '<rootDir>/client/src/$1',
  },
  setupFiles: ['<rootDir>/__mocks__/localStorage.js'],
  testMatch: ['**/__tests__/client/**/*.spec.js?(x)'],
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
  verbose: true,
  testURL: 'http://localhost',
};
