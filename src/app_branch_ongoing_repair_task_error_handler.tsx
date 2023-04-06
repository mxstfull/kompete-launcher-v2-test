import React from 'react';
import { AppBranchRepairTaskError, AppBranchRepairTaskState } from 'patchkit-generic-patcher2_foundation';
import { showDefaultErrorDialogAsync, fetchAppBranchRepairTaskStateAsync } from 'patchkit-generic-patcher2_ipc';

import { assert } from './assert';
import { useDefinedState } from './use_defined_state';
import { handleUnauthorizedAccessToAppDirAsync } from './handle_unauthorized_access_to_app_dir_async';

export const AppBranchOngoingRepairTaskErrorHandlerWidget = (
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

  const [appBranchLastOngoingRepairTaskId, setAppBranchLastOngoingRepairTaskId] =
    React.useState<number | undefined>(undefined);

  const [shouldCheckAppBranchLastOngoingRepairTaskState, setShouldCheckAppBranchLastOngoingRepairTaskState] =
    React.useState<boolean>(true);

  React.useEffect(
    () => {

      if (appBranchLastOngoingRepairTaskId !== undefined) {

        return;
      }

      setAppBranchLastOngoingRepairTaskId(appBranchState.ongoingRepairTaskId);

      setShouldCheckAppBranchLastOngoingRepairTaskState(true);
    },
    [
      appBranchLastOngoingRepairTaskId,
      appBranchState.ongoingRepairTaskId,
    ],
  );

  React.useEffect(
    () => {

      if (!shouldCheckAppBranchLastOngoingRepairTaskState) {

        return;
      }

      setShouldCheckAppBranchLastOngoingRepairTaskState(false);

      // tslint:disable-next-line: no-floating-promises
      (async () => {

        if (appBranchLastOngoingRepairTaskId === undefined) {

          return;
        }

        let appBranchLastOngoingRepairTaskState: AppBranchRepairTaskState;

        try {

          appBranchLastOngoingRepairTaskState = await fetchAppBranchRepairTaskStateAsync({
            appId,
            appBranchId,
            appBranchRepairTaskId: appBranchLastOngoingRepairTaskId,
          });

        } catch {

          await new Promise((resolvePromise) => setTimeout(resolvePromise, 100));

          setShouldCheckAppBranchLastOngoingRepairTaskState(true);
          return;
        }

        if (!appBranchLastOngoingRepairTaskState.isFinished) {

          await new Promise((resolvePromise) => setTimeout(resolvePromise, 100));

          setShouldCheckAppBranchLastOngoingRepairTaskState(true);

        } else {

          try {

            switch (appBranchLastOngoingRepairTaskState.error) {

              case undefined: {

                break;
              }
              case AppBranchRepairTaskError.Fatal: {

                await showDefaultErrorDialogAsync({
                  defaultErrorDialogTitle: `Error!`,
                  defaultErrorDialogMessage: `Cannot repair the app right now. Please try again later.`,
                });
                break;
              }
              case AppBranchRepairTaskError.Cancelled: {

                break;
              }
              case AppBranchRepairTaskError.OutOfAppBranchDirFreeSpace: {

                await showDefaultErrorDialogAsync({
                  defaultErrorDialogTitle: `Error!`,
                  defaultErrorDialogMessage: `Out of free disk space.`,
                });
                break;
              }
              case AppBranchRepairTaskError.UnauthorizedAccessToAppBranchDir: {

                await handleUnauthorizedAccessToAppDirAsync({ appState });
                break;
              }
              case AppBranchRepairTaskError.RequiredAppBranchLicenseKey: {

                break;
              }
              case AppBranchRepairTaskError.InvalidAppBranchLicenseKey: {

                break;
              }
              case AppBranchRepairTaskError.BlockedAppBranchLicenseKey: {

                break;
              }
            }
          } catch {
          }

          setAppBranchLastOngoingRepairTaskId(undefined);
        }
      })();
    },
    [
      shouldCheckAppBranchLastOngoingRepairTaskState,
    ],
  );

  return childWidget;
};
