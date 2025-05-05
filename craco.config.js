const webpack = require('webpack');

module.exports = {
  webpack: {
    configure: {
      resolve: {
        fallback: {
          process: require.resolve('process/browser.js'),
          stream: require.resolve('stream-browserify'),
          util: require.resolve('util/'),
          buffer: require.resolve('buffer/'),
          path: require.resolve('path-browserify')
        },
      },
    },
    plugins: {
      add: [
        new webpack.ProvidePlugin({
          process: 'process/browser.js',
          Buffer: ['buffer', 'Buffer'],
        }),
      ],
    },
  },
};