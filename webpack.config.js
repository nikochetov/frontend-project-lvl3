import HtmlWebpackPlugin from 'html-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

const isProd = () => process.env.NODE_ENV === 'production';

export default {
  mode: process.env.NODE_ENV || 'development',
  entry: {
    main: './src/index.js',
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
