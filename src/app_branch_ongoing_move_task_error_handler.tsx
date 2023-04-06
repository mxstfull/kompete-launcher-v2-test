import React from 'react';
import { AppBranchMoveTaskError, AppBranchMoveTaskState } from 'patchkit-generic-patcher2_foundation';
import { showDefaultErrorDialogAsync, fetchAppBranchMoveTaskStateAsync } from 'patchkit-generic-patcher2_ipc';

import { assert } from './assert';
import { useDefinedState } from './use_defined_state';
import { handleUnauthorizedAccessToAppDirAsync } from './handle_unauthorized_access_to_app_dir_async';

export const AppBranchOngoingMoveTaskErrorHandlerWidget = (
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

  const [appBranchLastOngoingMoveTaskId, setAppBranchLastOngoingMoveTaskId] =
    React.useState<number | undefined>(undefined);

  const [shouldCheckAppBranchLastOngoingMoveTaskState, setShouldCheckAppBranchLastOngoingMoveTaskState] =
    React.useState<boolean>(true);

  React.useEffect(
    () => {

      if (appBranchLastOngoingMoveTaskId !== undefined) {

        return;
      }

      setAppBranchLastOngoingMoveTaskId(appBranchState.ongoingMoveTaskId);

      setShouldCheckAppBranchLastOngoingMoveTaskState(true);
    },
    [
      appBranchLastOngoingMoveTaskId,
      appBranchState.ongoingMoveTaskId,
    ],
  );

  React.useEffect(
    () => {

      if (!shouldCheckAppBranchLastOngoingMoveTaskState) {

        return;
      }

      setShouldCheckAppBranchLastOngoingMoveTaskState(false);

      // tslint:disable-next-line: no-floating-promises
      (async () => {

        if (appBranchLastOngoingMoveTaskId === undefined) {

          return;
        }

        let appBranchLastOngoingMoveTaskState: AppBranchMoveTaskState;

        try {

          appBranchLastOngoingMoveTaskState = await fetchAppBranchMoveTaskStateAsync({
            appId,
            appBranchId,
            appBranchMoveTaskId: appBranchLastOngoingMoveTaskId,
          });

        } catch {

          await new Promise((resolvePromise) => setTimeout(resolvePromise, 100));

          setShouldCheckAppBranchLastOngoingMoveTaskState(true);
          return;
        }

        if (!appBranchLastOngoingMoveTaskState.isFinished) {

          await new Promise((resolvePromise) => setTimeout(resolvePromise, 100));

          setShouldCheckAppBranchLastOngoingMoveTaskState(true);

        } else {

          try {

            switch (appBranchLastOngoingMoveTaskState.error) {

              case undefined: {

                break;
              }
              case AppBranchMoveTaskError.Fatal: {

                await showDefaultErrorDialogAsync({
                  defaultErrorDialogTitle: `Error!`,
                  defaultErrorDialogMessage: `Cannot move the app right now. Please try again later.`,
                });
                break;
              }
              case AppBranchMoveTaskError.Cancelled: {

                break;
              }
              case AppBranchMoveTaskError.OutOfAppBranchNewDirFreeSpace: {

                await showDefaultErrorDialogAsync({
                  defaultErrorDialogTitle: `Error!`,
                  defaultErrorDialogMessage: `Out of free disk space.`,
                });
                break;
              }
              case AppBranchMoveTaskError.UnauthorizedAccessToAppBranchDir: {

                await handleUnauthorizedAccessToAppDirAsync({ appState });
                break;
              }
              case AppBranchMoveTaskError.UnauthorizedAccessToAppBranchNewDir: {

                await handleUnauthorizedAccessToAppDirAsync({ appState });
                break;
              }
            }
          } catch {
          }

          setAppBranchLastOngoingMoveTaskId(undefined);
        }
      })();
    },
    [
      shouldCheckAppBranchLastOngoingMoveTaskState,
    ],
  );

  return childWidget;
};
