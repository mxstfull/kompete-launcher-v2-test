import React from 'react';
import { AppBranchUninstallTaskState, AppBranchUninstallTaskError } from 'patchkit-generic-patcher2_foundation';
import { fetchAppBranchUninstallTaskStateAsync, showDefaultErrorDialogAsync } from 'patchkit-generic-patcher2_ipc';

import { assert } from './assert';
import { useDefinedState } from './use_defined_state';
import { handleUnauthorizedAccessToAppDirAsync } from './handle_unauthorized_access_to_app_dir_async';

export const AppBranchOngoingUninstallTaskErrorHandlerWidget = (
  {
    appId,
    appBranchId,
    childWidget,
  }: {
    appId: string;
    appBranchId: string;
    childWidget: React.ReactElement;
  },
) => {

  const state = useDefinedState();

  const appState = state.apps[appId];

  assert(appState !== undefined);

  const appBranchState = appState.branches[appBranchId];

  assert(appBranchState !== undefined);

  const [appBranchLastOngoingUninstallTaskId, setAppBranchLastOngoingUninstallTaskId] =
    React.useState<number | undefined>(undefined);

  const [shouldCheckAppBranchLastOngoingUninstallTaskState, setShouldCheckAppBranchLastOngoingUninstallTaskState] =
    React.useState<boolean>(true);

  React.useEffect(
    () => {

      if (appBranchLastOngoingUninstallTaskId !== undefined) {

        return;
      }

      setAppBranchLastOngoingUninstallTaskId(appBranchState.ongoingUninstallTaskId);

      setShouldCheckAppBranchLastOngoingUninstallTaskState(true);
    },
    [
      appBranchLastOngoingUninstallTaskId,
      appBranchState.ongoingUninstallTaskId,
    ],
  );

  React.useEffect(
    () => {

      if (!shouldCheckAppBranchLastOngoingUninstallTaskState) {

        return;
      }

      setShouldCheckAppBranchLastOngoingUninstallTaskState(false);

      // tslint:disable-next-line: no-floating-promises
      (async () => {

        if (appBranchLastOngoingUninstallTaskId === undefined) {

          return;
        }

        let appBranchLastOngoingUninstallTaskState: AppBranchUninstallTaskState;

        try {

          appBranchLastOngoingUninstallTaskState = await fetchAppBranchUninstallTaskStateAsync({
            appId,
            appBranchId,
            appBranchUninstallTaskId: appBranchLastOngoingUninstallTaskId,
          });

        } catch {

          await new Promise((resolvePromise) => setTimeout(resolvePromise, 100));

          setShouldCheckAppBranchLastOngoingUninstallTaskState(true);
          return;
        }

        if (!appBranchLastOngoingUninstallTaskState.isFinished) {

          await new Promise((resolvePromise) => setTimeout(resolvePromise, 100));

          setShouldCheckAppBranchLastOngoingUninstallTaskState(true);

        } else {

          try {

            switch (appBranchLastOngoingUninstallTaskState.error) {

              case undefined: {

                break;
              }
              case AppBranchUninstallTaskError.Fatal: {

                await showDefaultErrorDialogAsync({
                  defaultErrorDialogTitle: `Error!`,
                  defaultErrorDialogMessage: `Cannot uninstall the app right now. Please try again later.`,
                });
                break;
              }
              case AppBranchUninstallTaskError.Cancelled: {

                break;
              }
              case AppBranchUninstallTaskError.UnauthorizedAccessToAppBranchDir: {

                await handleUnauthorizedAccessToAppDirAsync({ appState });
                break;
              }
            }
          } catch {
          }

          setAppBranchLastOngoingUninstallTaskId(undefined);
        }
      })();
    },
    [
      shouldCheckAppBranchLastOngoingUninstallTaskState,
    ],
  );

  return childWidget;
};
