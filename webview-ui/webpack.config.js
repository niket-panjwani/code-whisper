const path = require('path');

module.exports = {
  entry: './src/index.tsx', // The entry point of your React app
  output: {
    path: path.resolve(__dirname, '../out'), // The output directory
    filename: 'bundle.js', // The name of the output file
  },
  devServer: {
    headers: {
      'Content-Security-Policy': "default-src 'self'; connect-src http://localhost:3000"
    }
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader',
        },
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'images/',
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
};