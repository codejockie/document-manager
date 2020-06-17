const plugins = [
  [
    'babel-plugin-transform-imports',
    {
      '@material-ui/core': {
        // Use "transform: '@material-ui/core/esm/${member}'," if your bundler supports ES modules
        transform: '@material-ui/core/${member}',
        preventFullImport: true
      },
      '@material-ui/icons': {
        // Use "transform: '@material-ui/icons/esm/${member}'," if your bundler supports ES modules
        transform: '@material-ui/icons/${member}',
        preventFullImport: true
      }
    }
  ]
];

module.exports = { plugins };
