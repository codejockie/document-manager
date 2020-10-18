module.exports = (api) => {
  api.cache(true);

  return {
    env: {
      test: {
        only: ['./**/*.js', 'node_modules/jest-runtime'],
        presets: ['@babel/preset-env', '@babel/preset-react'],
        plugins: ['transform-export-extensions', '@babel/plugin-transform-runtime'],
      },
      development: {
        plugins: ['@babel/plugin-transform-react-jsx-source', '@babel/plugin-transform-react-display-name'],
      },
    },
    presets: [
      [
        '@babel/preset-env',
        {
          targets: {
            browsers: ['last 2 versions', 'safari 7'],
            node: 'current',
          },
          debug: false,
        },
      ],
    ],
    plugins: [
      '@babel/plugin-transform-spread',
      '@babel/plugin-syntax-dynamic-import',
      '@babel/plugin-proposal-object-rest-spread',
      '@babel/plugin-proposal-export-default-from',
      '@babel/plugin-proposal-export-namespace-from',
      ['@babel/plugin-proposal-decorators', { decoratorsBeforeExport: true }],
      ['@babel/plugin-proposal-class-properties', { loose: true }],
    ],
  };
};
