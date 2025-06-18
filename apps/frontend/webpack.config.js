const path = require('path')

module.exports = (env) => {
  const resultConfig = {
    devtool: 'eval-source-map',
    entry: './src/index.tsx',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'bundle.js',
    },
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      fallback: {
        fs: false,
        os: false,
        path: false,
        crypto: false,
      },
    },
    performance: {
      hints: false,
    },
    devServer: {
      static: {
        directory: path.join(__dirname, 'public'),
      },
      client: {
        overlay: true,
        logging: 'log',
      },
      compress: true,
      open: false,
      host: '0.0.0.0',
      port: 9000,
      allowedHosts: 'all',
      historyApiFallback: true,
    },
    plugins: [],
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          exclude: /node_modules/,
          use: 'ts-loader',
        },
      ],
    },
  }

  return resultConfig
}
