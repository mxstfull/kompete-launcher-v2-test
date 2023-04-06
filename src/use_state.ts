import React from 'react';

import { StateContext } from './state_context';

export const useState = () => React.useContext(StateContext);
