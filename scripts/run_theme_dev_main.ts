import path = require('path');

import { _getThemeEntryFilePath } from './_get_theme_entry_file_path';
import { _getThemeHtmlTemplateFilePath } from './_get_theme_html_template_file_path';
import { _getThemeTsconfigFilePath } from './_get_theme_tsconfig_file_path';
import { _getThemeDirPathForProdMode } from './_get_theme_dir_path_for_prod_mode';

import { runAppDevAsync } from './core';

// tslint:disable-next-line: no-floating-promises
(async () => {

  const themePort = 9060;

  await runAppDevAsync({
    appPort: themePort,
    appEntryFilePath: _getThemeEntryFilePath(),
    appHtmlTemplateFilePath: _getThemeHtmlTemplateFilePath(),
    appTsconfigFilePath: _getThemeTsconfigFilePath(),
    runAppDevTempDirPath: path.resolve(
      `obj/run_theme_dev_temp`,
    ),
  });
})();
