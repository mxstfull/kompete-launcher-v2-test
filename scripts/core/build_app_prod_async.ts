import fs = require('fs');

import { _getAppWebpackConfig } from './_get_app_webpack_config';
import { _buildAppWebpackAsync } from './_build_app_webpack_async';
import { _BuildAppWebpackFailure } from './_build_app_webpack_failure';

import { AppMode } from './app_mode';
import { BuildAppFailure } from './build_app_failure';

export const buildAppProdAsync = async (
  {
    appEntryFilePath,
    appTsconfigFilePath,
    appHtmlTemplateFilePath,
    appDirPath,
  }: {
    appEntryFilePath: string;
    appTsconfigFilePath: string;
    appHtmlTemplateFilePath: string;
    appDirPath: string;
  },
): Promise<void> => {

  // Webpack might be using this variable so it's safe to set it anyway
  process.env.NODE_ENV = `production`;

  if (fs.existsSync(appDirPath)) {

    fs.rmdirSync(appDirPath, {
      recursive: true,
    });
  }

  const appWebpackConfig = _getAppWebpackConfig({
    appMode: AppMode.Prod,
    appEntryFilePath,
    appTsconfigFilePath,
    appHtmlTemplateFilePath,
    appWebpackDirPath: appDirPath,
  });

  try {

    await _buildAppWebpackAsync({
      appWebpackConfig,
    });

  } catch (e) {

    if (e instanceof _BuildAppWebpackFailure) {

      throw new BuildAppFailure({
        msg: e.message,
      });
    }

    throw e;
  }
};
