import webpack = require('webpack');

import { _BuildAppWebpackFailure } from "./_build_app_webpack_failure";

export const _buildAppWebpackAsync = (
  {
    appWebpackConfig,
  }: {
    appWebpackConfig: webpack.Configuration;
  },
) => {

  return new Promise<void>(
    async (resolvePromise, rejectPromise) => {

      try {

        webpack(
          appWebpackConfig,
          (
            webpackError: Error | undefined | null,
            webpackStats: webpack.Stats,
          ) => {

            if (webpackError !== undefined && webpackError !== null) {

              rejectPromise(new _BuildAppWebpackFailure({
                msg: String(webpackError),
              }));
              return;

            } else if (webpackStats.hasErrors()) {

              rejectPromise(new _BuildAppWebpackFailure({
                msg: webpackStats.toString({
                  colors: true,
                  chunks: false,
                }),
              }));
              return;
            }

            console.log(webpackStats.toString({
              colors: true,
              chunks: false,
            }));

            resolvePromise();
          },
        );

      } catch (e) {

        rejectPromise(e);
      }
    },
  );
};
