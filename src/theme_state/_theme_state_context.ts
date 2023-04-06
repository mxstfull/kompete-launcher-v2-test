import React from 'react';

import { _themeState } from './_theme_state';

import { ThemeState } from './theme_state';

export const _ThemeStateContext =
  React.createContext<ThemeState>(_themeState);
