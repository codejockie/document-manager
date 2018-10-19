module.exports = {
  setupFiles: [
    '<rootDir>/__mocks__/localStorage.js'
  ],
  testMatch: ['**/__tests__/client/**/*.spec.js?(x)'],
  verbose: true,
  testURL: 'http://localhost'
};
