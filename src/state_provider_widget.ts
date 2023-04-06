import React from 'react';
import { FetchStateAsync, State } from 'patchkit-generic-patcher2_foundation';

import { StateContext } from './state_context';

export const StateProviderWidget = (
  {
    children,
    fetchStateAsync,
  }: {
    children: React.ReactNode;
    fetchStateAsync: FetchStateAsync;
  },
) => {

  const [state, setState] =
    React.useState<State | undefined>(undefined);

  const [shouldRefreshState, setShouldRefreshState] =
    React.useState<boolean>(true);

  React.useEffect(
    () => {

      if (!shouldRefreshState) {

        return;
      }

      setShouldRefreshState(false);

      // tslint:disable-next-line: no-floating-promises
      (async () => {

        try {

          const newState = await fetchStateAsync({});

          if (newState.isInitialized) {

            setState(
              newState,
            );
          }
        } catch {

          // ignore
        }

        await new Promise((resolvePromise) => setTimeout(resolvePromise, 100));

        setShouldRefreshState(true);
      })();
    },
    [
      shouldRefreshState,
    ],
  );

  return React.createElement(
    StateContext.Provider,
    {
      value: state,
    },
    children,
  );
};
