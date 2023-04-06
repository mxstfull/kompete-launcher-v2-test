import React from 'react';
import { ThemeStateProviderWidget } from 'src/theme_state';
import { fetchStateAsync } from 'patchkit-generic-patcher2_ipc';

import { WindowWidget } from './window_widget';
import { StateProviderWidget } from './state_provider_widget';

export const RootWidget = (
) => {

  return <StateProviderWidget
    fetchStateAsync={fetchStateAsync}
  >
    <ThemeStateProviderWidget>
      <WindowWidget />
    </ThemeStateProviderWidget>
  </StateProviderWidget>;
};
