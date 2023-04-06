import { assert } from './assert';
import { useState } from './use_state';

export const useDefinedState = (
) => {

  const state = useState();

  assert(state !== undefined);

  return state;
};
