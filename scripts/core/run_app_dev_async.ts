import { _getAppWebpackConfig } from './_get_app_webpack_config';
import { _runAppHotReloadServer } from './_run_app_hot_reload_server';

import { AppMode } from './app_mode';

export const runAppDevAsync = async (
  {
    appPort,
    appEntryFilePath,
    appTsconfigFilePath,
    appHtmlTemplateFilePath,
    runAppDevTempDirPath,
  }: {
    appPort: number;
    appEntryFilePath: string;
    appTsconfigFilePath: string;
    appHtmlTemplateFilePath: string;
    runAppDevTempDirPath: string;
  },
): Promise<void> => {

  // Webpack might be using this variable so it's safe to set it anyway
  process.env.NODE_ENV = `development`;

  const appWebpackConfig = _getAppWebpackConfig({
    appMode: AppMode.Dev,
    appEntryFilePath,
    appTsconfigFilePath,
    appHtmlTemplateFilePath,
    appWebpackDirPath: runAppDevTempDirPath,
  });

  await _runAppHotReloadServer({
    appWebpackConfig,
    appHotReloadServerPort: appPort,
  });
};
