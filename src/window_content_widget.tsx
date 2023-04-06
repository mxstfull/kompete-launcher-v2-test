import React from 'react';
import { AppPresentation } from 'patchkit-generic-patcher2_foundation';
import { retrieveAppPresentationAsync } from 'patchkit-generic-patcher2_ipc';

import { LoadingWidget } from './loading_widget';
import { ConnectionFailureWidget } from './connection_failure_widget';
import { AppBranchWidget } from './app_branch_widget';

export const WindowContentWidget = (
  {
    appId,
    appBranchId,
  }: {
    appId: string;
    appBranchId: string;
  },
) => {

  const [appPresentation, setAppPresentation] =
    React.useState<AppPresentation | undefined>(undefined);

  const [isRefreshingAppPresentation, setIsRefreshingAppPresentation] =
    React.useState<boolean>(false);

  const [shouldRefreshAppPresentation, setShouldRefreshAppPresentation] =
    React.useState<boolean>(true);

  React.useEffect(
    () => {

      if (!shouldRefreshAppPresentation) {

        return;
      }

      setIsRefreshingAppPresentation(true);

      // tslint:disable-next-line: no-floating-promises
      (async () => {

        try {

          const appNewPresentation = await retrieveAppPresentationAsync({ appId });

          setAppPresentation(
            appNewPresentation,
          );

        } catch {

          // ignore
        }

        setShouldRefreshAppPresentation(false);
        setIsRefreshingAppPresentation(false);
      })();
    },
    [
      shouldRefreshAppPresentation,
    ],
  );

  return isRefreshingAppPresentation || shouldRefreshAppPresentation
    ? <LoadingWidget />
    : appPresentation === undefined
      ? <ConnectionFailureWidget
        refresh={() => {

          setShouldRefreshAppPresentation(true);
        }}
      />
      : <AppBranchWidget
        appId={appId}
        appBranchId={appBranchId}
        appPresentation={appPresentation}
      />;
};
