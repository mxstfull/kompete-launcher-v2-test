import React from 'react';
import { AppBranchUpdateTaskState, AppBranchUpdateTaskError } from 'patchkit-generic-patcher2_foundation';
import { showDefaultErrorDialogAsync, fetchAppBranchUpdateTaskStateAsync } from 'patchkit-generic-patcher2_ipc';

import { assert } from './assert';
import { useDefinedState } from './use_defined_state';
import { handleUnauthorizedAccessToAppDirAsync } from './handle_unauthorized_access_to_app_dir_async';

export const AppBranchOngoingUpdateTaskErrorHandlerWidget = (
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

  const [appBranchLastOngoingUpdateTaskId, setAppBranchLastOngoingUpdateTaskId] =
    React.useState<number | undefined>(undefined);

  const [shouldCheckAppBranchLastOngoingUpdateTaskState, setShouldCheckAppBranchLastOngoingUpdateTaskState] =
    React.useState<boolean>(true);

  React.useEffect(
    () => {

      if (appBranchLastOngoingUpdateTaskId !== undefined) {

        return;
      }

      setAppBranchLastOngoingUpdateTaskId(appBranchState.ongoingUpdateTaskId);

      setShouldCheckAppBranchLastOngoingUpdateTaskState(true);
    },
    [
      appBranchLastOngoingUpdateTaskId,
      appBranchState.ongoingUpdateTaskId,
    ],
  );

  React.useEffect(
    () => {

      if (!shouldCheckAppBranchLastOngoingUpdateTaskState) {

        return;
      }

      setShouldCheckAppBranchLastOngoingUpdateTaskState(false);

      // tslint:disable-next-line: no-floating-promises
      (async () => {

        if (appBranchLastOngoingUpdateTaskId === undefined) {

          return;
        }

        let appBranchLastOngoingUpdateTaskState: AppBranchUpdateTaskState;

        try {

          appBranchLastOngoingUpdateTaskState = await fetchAppBranchUpdateTaskStateAsync({
            appId,
            appBranchId,
            appBranchUpdateTaskId: appBranchLastOngoingUpdateTaskId,
          });

        } catch {

          await new Promise((resolvePromise) => setTimeout(resolvePromise, 100));

          setShouldCheckAppBranchLastOngoingUpdateTaskState(true);
          return;
        }

        if (!appBranchLastOngoingUpdateTaskState.isFinished) {

          await new Promise((resolvePromise) => setTimeout(resolvePromise, 100));

          setShouldCheckAppBranchLastOngoingUpdateTaskState(true);

        } else {

          try {

            switch (appBranchLastOngoingUpdateTaskState.error) {

              case undefined: {

                break;
              }
              case AppBranchUpdateTaskError.Fatal: {

                await showDefaultErrorDialogAsync({
                  defaultErrorDialogTitle: `Error!`,
                  defaultErrorDialogMessage: `Cannot check for the app updates right now. Please try again later.`,
                });
                break;
              }
              case AppBranchUpdateTaskError.Cancelled: {

                break;
              }
              case AppBranchUpdateTaskError.OutOfAppBranchDirFreeSpace: {

                await showDefaultErrorDialogAsync({
                  defaultErrorDialogTitle: `Error!`,
                  defaultErrorDialogMessage: `Out of free disk space.`,
                });
                break;
              }
              case AppBranchUpdateTaskError.UnauthorizedAccessToAppBranchDir: {

                await handleUnauthorizedAccessToAppDirAsync({ appState });
                break;
              }
              case AppBranchUpdateTaskError.RequiredAppBranchLicenseKey: {

                break;
              }
              case AppBranchUpdateTaskError.InvalidAppBranchLicenseKey: {

                break;
              }
              case AppBranchUpdateTaskError.BlockedAppBranchLicenseKey: {

                break;
              }
            }
          } catch {
          }

          setAppBranchLastOngoingUpdateTaskId(undefined);
        }
      })();
    },
    [
      shouldCheckAppBranchLastOngoingUpdateTaskState,
    ],
  );

  return childWidget;
};
