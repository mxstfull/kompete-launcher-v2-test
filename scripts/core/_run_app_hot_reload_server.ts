import webpack = require('webpack');
import webpackHotMiddleware = require('webpack-hot-middleware');
import webpackDevServer = require('webpack-dev-server');

export const _runAppHotReloadServer = (
  {
    appWebpackConfig,
    appHotReloadServerPort,
  }: {
    appWebpackConfig: webpack.Configuration;
    appHotReloadServerPort: number;
  },
) => {

  return new Promise(
    async (_resolve, reject) => {

      try {

        const webpackCompiler = webpack(appWebpackConfig);

        const webpackHotMiddlewareObj = webpackHotMiddleware(
          webpackCompiler as any,
          {
            log: false,
            heartbeat: 2500,
          },
        );

        webpackCompiler.hooks.compilation.tap(
          `compilation`,
          (webpackCompilation) => {

            (webpackCompilation.hooks as any).htmlWebpackPluginAfterEmit.tapAsync(
              `html-webpack-plugin-after-emit`,
              (___: any, webpackCallback: any) => {

                webpackHotMiddlewareObj.publish({ action: `reload` });
                webpackCallback();
              },
            );
          },
        );

        webpackCompiler.hooks.done.tap(
          `done`,
          (webpackStats) => {

            console.log(webpackStats.toString({
              colors: true,
              chunks: false,
            }));
          },
        );

        const webpackDevServerObj = new webpackDevServer(
          webpackCompiler as any,
          {
            quiet: true,
            before(webpackDevServerApp: any) {

              webpackDevServerApp.use(webpackHotMiddlewareObj);
            },
          },
        );

        webpackDevServerObj.listen(appHotReloadServerPort);

      } catch (e) {

        reject(e);
      }
    },
  );
};
