import path = require('path');
import webpack = require('webpack');
// @ts-ignore
import OfflinePlugin = require('offline-plugin');
import WebpackInjectPlugin = require('webpack-inject-plugin');
import HtmlWebpackPlugin = require('html-webpack-plugin');
import { TsconfigPathsPlugin } from 'tsconfig-paths-webpack-plugin';
import { ThemeDevToolsWebpackPlugin } from 'patchkit-patcher2_theme_dev_tools_webpack_plugin';

import { AppMode } from "./app_mode";

export const _getAppWebpackConfig = (
  {
    appMode,
    appEntryFilePath,
    appTsconfigFilePath,
    appHtmlTemplateFilePath,
    appWebpackDirPath,
  }: {
    appMode: AppMode;
    appEntryFilePath: string;
    appTsconfigFilePath: string;
    appHtmlTemplateFilePath: string;
    appWebpackDirPath: string;
  },
): webpack.Configuration => {

  return {
    mode: appMode === AppMode.Dev
      ? `development`
      : `production`,
    devtool: appMode === AppMode.Dev
      ? `inline-source-map`
      : `source-map`,
    entry: {
      main: appMode === AppMode.Dev
        ? [
          path.resolve(
            `node_modules/webpack-hot-middleware/client?noInfo=true&reload=true`,
          ),
          appEntryFilePath,
        ]
        : appEntryFilePath,
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          enforce: `pre`,
          use: [`source-map-loader`],
        },
        {
          test: /\.ts(x?)$/,
          exclude: /node_modules/,
          use: [
            {
              loader: `ts-loader`,
              options: {
                configFile: appTsconfigFilePath,
              },
            },
          ],
        },
        {
          test: /\.(woff2?|eot|ttf|otf|mp4|webm|ogg|mp3|wav|flac|aac|png|jpe?g|gif|svg|webp)(\?.*)?$/,
          use: {
            loader: `file-loader`,
            options: {
              name: `assets/[path][name].[ext]`,
            },
          },
        },
      ],
    },
    node: {
      __dirname: true,
      __filename: true,
      fs: `empty`,
      net: `empty`,
      tls: `empty`,
    },
    plugins: [
      new WebpackInjectPlugin.default(() => {

        const appInjectedVariables = {
          appMode,
        };

        return `global.$injected = ${JSON.stringify(appInjectedVariables)};`;
      }),
      new HtmlWebpackPlugin({
        filename: `index.html`,
        template: appHtmlTemplateFilePath,
        minify: {
          collapseWhitespace: true,
          removeAttributeQuotes: true,
          removeComments: true,
        },
      }),
      ...(appMode === AppMode.Dev
        ? [
          new webpack.HotModuleReplacementPlugin(),
          new ThemeDevToolsWebpackPlugin(),
        ]
        : [
          new webpack.LoaderOptionsPlugin({
            minimize: true,
          }),
          new OfflinePlugin(),
        ]),
      new webpack.NoEmitOnErrorsPlugin(),
    ],
    output: {
      devtoolModuleFilenameTemplate: appMode === AppMode.Dev
        ? `[absolute-resource-path]`
        : undefined,
      filename: `[name].js`,
      path: appWebpackDirPath,
    },
    resolveLoader: {
      modules: [
        path.resolve(
          `node_modules`,
        ),
      ],
    },
    optimization: {
      minimize: false,
    },
    resolve: {
      symlinks: false,
      plugins: [
        new TsconfigPathsPlugin(),
      ],
      extensions: [`.ts`, `.tsx`, `.js`, `.json`],
      alias: {
        "offline-plugin/runtime": path.resolve(
          `node_modules/offline-plugin/runtime`,
        ),
      },
    },
  };
};
