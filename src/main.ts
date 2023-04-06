import React from 'react';
import ReactDOM from 'react-dom';
import WebFontLoader from 'webfontloader';
import OfflinePlugin from 'offline-plugin/runtime';

import { RootWidget } from './root_widget';
import { getAppMode } from './get_app_mode';
import { AppMode } from './app_mode';

WebFontLoader.load({
  google: {
    families: [
      `Roboto:300,400,500,600`,
    ],
  },
});

if (getAppMode() === AppMode.Prod) {

  OfflinePlugin.install();
}

ReactDOM.render(
  React.createElement(RootWidget),
  document.getElementById(`app`),
);
