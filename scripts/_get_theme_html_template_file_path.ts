import path = require('path');

export const _getThemeHtmlTemplateFilePath = (
): string => {

  return path.resolve(
    `src/index.ejs`,
  );
};
