import React from 'react';

import { _subscribeToOnThemeStateUpdate } from './_subscribe_to_on_theme_state_update';
import { _themeState } from './_theme_state';
import { _ThemeStateContext } from './_theme_state_context';

import { ThemeState } from './theme_state';

export const ThemeStateProviderWidget = (
  {
    children,
  }: {
    children: React.ReactNode;
  },
) => {

  const [themeStore, setThemeStore] =
    React.useState<ThemeState>(_themeState);

  React.useEffect(() => {

    _subscribeToOnThemeStateUpdate(() => {

      setThemeStore({ ..._themeState });
    });

    return () => {

      // TODO: Remove listener
    };
  }, []);

  return React.createElement(
    _ThemeStateContext.Provider,
    {
      value: themeStore,
    },
    children,
  );
};
