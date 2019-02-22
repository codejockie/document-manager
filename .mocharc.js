module.exports = {
  compiler: '@babel/register',
  diff: true,
  exit: true,
  extension: ['js'],
  package: './package.json',
  recursive: true,
  reporter: 'spec',
  require: '@babel/polyfill',
  spec: '__tests__/server/**/*.spec.js',
  slow: 75,
  timeout: 90000,
  ui: 'bdd'
}
