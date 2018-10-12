module.exports = (api) => {
  api.cache(true);

  return {
    env: {
      test: {
        presets: ['@babel/preset-env', '@babel/preset-react'],
        plugins: ['transform-export-extensions'],
        only: [
          './**/*.js',
          'node_modules/jest-runtime'
        ]
      }
    },
    presets: [
      [
        '@babel/preset-env',
        {
          targets: {
            browsers: [
              'last 2 versions',
              'safari 7'
            ],
            node: 'current'
          },
          debug: false
        }
      ]
    ],
    plugins: [
      ['@babel/plugin-proposal-class-properties', { loose: true }],
      '@babel/plugin-proposal-object-rest-spread'
    ]
  };
};
