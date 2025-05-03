const webpack = require('webpack');

module.exports = {
  webpack: {
    configure: {
      resolve: {
        fallback: {
          querystring: require.resolve('querystring-es3'),
          os: require.resolve('os-browserify/browser'),
          path: require.resolve('path-browserify'),
          crypto: require.resolve('crypto-browserify'),
          zlib: require.resolve('browserify-zlib'),
          stream: require.resolve('stream-browserify'),
          http: require.resolve('stream-http'),
          https: require.resolve('https-browserify'),
          net: false,
          tls: false,
          child_process: false,
          fs: false, // Asegúrate de que fs: false sea intencional
          util: require.resolve('util/'),
          assert: require.resolve('assert/'),
          url: require.resolve('url/'),
          buffer: require.resolve('buffer/'),
          // http2: false, // Puedes mantenerlo en false si no necesitas un polyfill específico
        }
      },
      plugins: [
        new webpack.ProvidePlugin({
          process: 'process/browser',
          Buffer: ['buffer', 'Buffer']
        }),
        new webpack.DefinePlugin({
          'process.env.NODE_DEBUG': JSON.stringify(false) // Usar JSON.stringify para valores booleanos
        })
      ],
      // Ignorar advertencias de source map si son problemáticas
      ignoreWarnings: [/Failed to parse source map/],
    }
  }
};