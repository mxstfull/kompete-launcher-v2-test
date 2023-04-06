import React from 'react';
import { AppBranchInstallTaskState } from 'patchkit-generic-patcher2_foundation';
import { fetchAppBranchInstallTaskStateAsync, cancelAppBranchInstallTaskAsync } from 'patchkit-generic-patcher2_ipc';

import { AppBranchOngoingFilesOperationTaskBaseWidget } from './app_branch_ongoing_files_operation_task_base_widget';

export const AppBranchOngoingInstallTaskWidget = (
  {
    appId,
    appBranchId,
    appBranchOngoingInstallTaskId,
  }: {
    appId: string;
    appBranchId: string;
    appBranchOngoingInstallTaskId: number;
  },
) => {

  const [appBranchLastOngoingInstallTaskId, setAppBranchLastOngoingInstallTaskId] =
    React.useState<number | undefined>(undefined);

  const [appBranchOngoingInstallTaskState, setAppBranchOngoingInstallTaskState] =
    React.useState<AppBranchInstallTaskState | undefined>(undefined);

  const [shouldRefreshAppBranchOngoingInstallTaskState, setShouldRefreshAppBranchOngoingInstallTaskState] =
    React.useState<boolean>(true);

  React.useEffect(
    () => {

      if (appBranchLastOngoingInstallTaskId !== appBranchOngoingInstallTaskId) {

        setAppBranchLastOngoingInstallTaskId(appBranchOngoingInstallTaskId);
        setAppBranchOngoingInstallTaskState(undefined);
        setShouldRefreshAppBranchOngoingInstallTaskState(true);
      }
    },
    [
      appBranchOngoingInstallTaskId,
    ],
  );

  React.useEffect(
    () => {

      if (!shouldRefreshAppBranchOngoingInstallTaskState) {

        return;
      }

      setShouldRefreshAppBranchOngoingInstallTaskState(false);

      // tslint:disable-next-line: no-floating-promises
      (async () => {

        let appBranchOngoingInstallTaskNewState: AppBranchInstallTaskState;

        try {

          appBranchOngoingInstallTaskNewState =
            await fetchAppBranchInstallTaskStateAsync({
              appId,
              appBranchId,
              appBranchInstallTaskId: appBranchOngoingInstallTaskId,
            });

        } catch {

          await new Promise((resolvePromise) => setTimeout(resolvePromise, 100));

          setShouldRefreshAppBranchOngoingInstallTaskState(true);
          return;
        }

        if (!appBranchOngoingInstallTaskNewState.isFinished) {

          await new Promise((resolvePromise) => setTimeout(resolvePromise, 100));

          setShouldRefreshAppBranchOngoingInstallTaskState(true);
        }

        setAppBranchOngoingInstallTaskState(
          appBranchOngoingInstallTaskNewState,
        );
      })();
    },
    [
      shouldRefreshAppBranchOngoingInstallTaskState,
    ],
  );

  return <AppBranchOngoingFilesOperationTaskBaseWidget
    appBranchOngoingFilesOperationTaskProgress={appBranchOngoingInstallTaskState?.progress}
    cancelAppBranchOngoingFilesOperationTask={async () => {

      await cancelAppBranchInstallTaskAsync({
        appId,
        appBranchId,
        appBranchInstallTaskId: appBranchOngoingInstallTaskId,
      });
    }}
  />;
};
