import path = require('path');

export const _getThemeDirPathForProdMode = (
): string => {

  return path.resolve(
    `theme_prod`,
  );
};
