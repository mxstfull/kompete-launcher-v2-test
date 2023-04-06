import path = require('path');

export const _getThemeTsconfigFilePath = (
): string => {

  return path.resolve(
    `tsconfig.json`,
  );
};
