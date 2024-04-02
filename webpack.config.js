const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const ESLintPlugin = require('eslint-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const pkJson = require('./package.json');
const license = fs.readFileSync('./LICENSE', 'utf-8');

const copyright = (licenseFile) => `
  ${pkJson.displayName} v${pkJson.version}
  ----------------------------------------
  Copyright (c) ${new Date().getFullYear()} ${pkJson.author}.
  Homepage: ${pkJson.homepage}
  Released under the ${pkJson.license} License.

  License information can be found in ${licenseFile}.
`;


const configs = {
  entry: './src/index.tsx',
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: '/dist/',
    filename: 'index.js',

    library: {
      name: pkJson.name,
      type: 'umd',
      umdNamedDefine: true,
    },
    globalObject: 'this',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' },
      {
        test: /\.scss$/,
        use: [
          'css-loader',
          'sass-loader',
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js', '.tsx'],
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  plugins: [
    new webpack.BannerPlugin(license),
    new ESLintPlugin({
      cache: false,
      eslintPath: require.resolve('eslint'),
      resolvePluginsRelativeTo: __dirname,
      ignore: true,
      useEslintrc: true,
      extensions: ['ts', 'js'],
    }),
    new CleanWebpackPlugin({
      cleanStaleWebpackAssets: false,
      cleanOnceBeforeBuildPatterns: [path.resolve(__dirname, './dist')],
    }),
  ],
  externals: {
    'react': {
      commonjs: 'react',
      commonjs2: 'react',
      amd: 'React',
      root: 'React'
    },
    'react-dom': {
      commonjs: 'react-dom',
      commonjs2: 'react-dom',
      amd: 'ReactDOM',
      root: 'ReactDOM'
    }    
  }
};


module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  return {
    ...configs,
    devtool: 'source-map',
    optimization: {
      minimize: isProduction,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            sourceMap: true,
            compress: isProduction,
          },
          extractComments: {
            filename: 'LICENSE.txt',
            banner: copyright,
          },
        }),
      ],
    },
  };
}
