const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// const { fileURLToPath } = require('url');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

const isProd = () => process.env.NODE_ENV === 'production';

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  entry: {
    main: path.resolve(__dirname, 'src', 'index.js'),
  },
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  devtool: 'source-map',
  devServer: {
    port: 4300,
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [isProd() ? MiniCssExtractPlugin.loader : 'style-loader', 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
      favicon: './src/assets/favicon.ico',
    }),
    new MiniCssExtractPlugin(), new CleanWebpackPlugin(),
  ],
};
