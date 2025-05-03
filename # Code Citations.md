# Code Citations

## License: unknown
https://github.com/iDevelopThings/VueClassStore/blob/f189d62818510d3992f7bba3085de11462a7f384/webpack.config.js

```javascript
const webpack = require('webpack');
const path = require('path');

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
          fs: false,
          net: false,
          tls: false,
          child_process: false,
          http2: false,
          util: require.resolve('util/'),
          url: require.resolve('url/'),
          assert: require.resolve('assert/'),
          buffer: require.resolve('buffer/')
        }
      },
      plugins: [
        new webpack.ProvidePlugin({
          process: 'process/browser',
          Buffer: ['buffer', 'Buffer']
        }),
        new webpack.DefinePlugin({
          'process.env.NODE_DEBUG': false
        })
      ]
    }
  }
};
```

