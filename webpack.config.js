import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import MiniCssWebpackPlugin from 'mini-css-extract-plugin';

import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProd = () => process.env.NODE_ENV === 'production';

const webpackConfig = {
  mode: process.env.NODE_ENV || 'development',
  entry: {
    main: path.resolve(__dirname, 'src', 'index.js'),
  },
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
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
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader',
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
    new MiniCssWebpackPlugin(),
    new CleanWebpackPlugin(),
  ],
};

export default webpackConfig;
