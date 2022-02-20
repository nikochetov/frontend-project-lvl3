const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssWebpackPlugin = require('mini-css-extract-plugin');
const { DefinePlugin } = require('webpack');

const isProd = () => process.env.NODE_ENV === 'production';

const ASSET_PATH = process.env.ASSET_PATH || '/';

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  entry: './src/index.js',
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
    // publicPath: '/',
    assetModuleFilename: 'assets/[hash][ext][query]',
  },
  devServer: {
    port: 4300,
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [isProd() ? MiniCssWebpackPlugin.loader : 'style-loader', 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
      // {
      //   test: /\.html$/i,
      //   loader: 'html-loader',
      // },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
      favicon: './src/assets/favicon.ico',
    }),
    new MiniCssWebpackPlugin(),
    new CleanWebpackPlugin(),
    new DefinePlugin({
      'process.env.ASSET_PATH': JSON.stringify(ASSET_PATH),
    }),
  ],
};
