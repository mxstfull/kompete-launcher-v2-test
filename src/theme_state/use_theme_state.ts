import React from 'react';

import { _ThemeStateContext } from './_theme_state_context';

export const useThemeState = () => React.useContext(_ThemeStateContext);
