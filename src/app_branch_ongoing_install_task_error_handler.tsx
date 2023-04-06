import React from 'react';
import { AppBranchInstallTaskState, AppBranchInstallTaskError } from 'patchkit-generic-patcher2_foundation';
import { showDefaultErrorDialogAsync, fetchAppBranchInstallTaskStateAsync } from 'patchkit-generic-patcher2_ipc';

import { assert } from './assert';
import { useDefinedState } from './use_defined_state';
import { handleUnauthorizedAccessToAppDirAsync } from './handle_unauthorized_access_to_app_dir_async';

export const AppBranchOngoingInstallTaskErrorHandlerWidget = (
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

  const [appBranchLastOngoingInstallTaskId, setAppBranchLastOngoingInstallTaskId] =
    React.useState<number | undefined>(undefined);

  const [shouldCheckAppBranchLastOngoingInstallTaskState, setShouldCheckLastAppBranchOngoingInstallTaskState] =
    React.useState<boolean>(true);

  React.useEffect(
    () => {

      if (appBranchLastOngoingInstallTaskId !== undefined) {

        return;
      }

      setAppBranchLastOngoingInstallTaskId(appBranchState.ongoingInstallTaskId);

      setShouldCheckLastAppBranchOngoingInstallTaskState(true);
    },
    [
      appBranchLastOngoingInstallTaskId,
      appBranchState.ongoingInstallTaskId,
    ],
  );

  React.useEffect(
    () => {

      if (!shouldCheckAppBranchLastOngoingInstallTaskState) {

        return;
      }

      setShouldCheckLastAppBranchOngoingInstallTaskState(false);

      // tslint:disable-next-line: no-floating-promises
      (async () => {

        if (appBranchLastOngoingInstallTaskId === undefined) {

          return;
        }

        let appBranchLastOngoingInstallTaskState: AppBranchInstallTaskState;

        try {

          appBranchLastOngoingInstallTaskState = await fetchAppBranchInstallTaskStateAsync({
            appId,
            appBranchId,
            appBranchInstallTaskId: appBranchLastOngoingInstallTaskId,
          });

        } catch {

          await new Promise((resolvePromise) => setTimeout(resolvePromise, 100));

          setShouldCheckLastAppBranchOngoingInstallTaskState(true);
          return;
        }

        if (!appBranchLastOngoingInstallTaskState.isFinished) {

          await new Promise((resolvePromise) => setTimeout(resolvePromise, 100));

          setShouldCheckLastAppBranchOngoingInstallTaskState(true);

        } else {

          try {

            switch (appBranchLastOngoingInstallTaskState.error) {

              case undefined: {

                break;
              }
              case AppBranchInstallTaskError.Fatal: {

                await showDefaultErrorDialogAsync({
                  defaultErrorDialogTitle: `Error!`,
                  defaultErrorDialogMessage: `Cannot install the app right now. Please try again later.`,
                });
                break;
              }
              case AppBranchInstallTaskError.Cancelled: {

                break;
              }
              case AppBranchInstallTaskError.OutOfAppBranchDirFreeSpace: {

                await showDefaultErrorDialogAsync({
                  defaultErrorDialogTitle: `Error!`,
                  defaultErrorDialogMessage: `Out of free disk space.`,
                });
                break;
              }
              case AppBranchInstallTaskError.UnauthorizedAccessToAppBranchDir: {

                await handleUnauthorizedAccessToAppDirAsync({ appState });
                break;
              }
              case AppBranchInstallTaskError.RequiredAppBranchLicenseKey: {

                break;
              }
              case AppBranchInstallTaskError.InvalidAppBranchLicenseKey: {

                break;
              }
              case AppBranchInstallTaskError.BlockedAppBranchLicenseKey: {

                break;
              }
            }
          } catch {
          }

          setAppBranchLastOngoingInstallTaskId(undefined);
        }
      })();
    },
    [
      shouldCheckAppBranchLastOngoingInstallTaskState,
    ],
  );

  return childWidget;
};
