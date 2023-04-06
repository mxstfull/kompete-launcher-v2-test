import React from 'react';
import { AppBranchRepairTaskState } from 'patchkit-generic-patcher2_foundation';
import { fetchAppBranchRepairTaskStateAsync, cancelAppBranchRepairTaskAsync } from 'patchkit-generic-patcher2_ipc';

import { AppBranchOngoingFilesOperationTaskBaseWidget } from './app_branch_ongoing_files_operation_task_base_widget';

export const AppBranchOngoingRepairTaskWidget = (
  {
    appId,
    appBranchId,
    appBranchOngoingRepairTaskId,
  }: {
    appId: string;
    appBranchId: string;
    appBranchOngoingRepairTaskId: number;
  },
) => {

  const [appBranchLastOngoingRepairTaskId, setAppBranchLastOngoingRepairTaskId] =
    React.useState<number | undefined>(undefined);

  const [appBranchOngoingRepairTaskState, setAppBranchOngoingRepairTaskState] =
    React.useState<AppBranchRepairTaskState | undefined>(undefined);

  const [shouldRefreshAppBranchOngoingRepairTaskState, setShouldRefreshAppBranchOngoingRepairTaskState] =
    React.useState<boolean>(true);

  React.useEffect(
    () => {

      if (appBranchLastOngoingRepairTaskId !== appBranchOngoingRepairTaskId) {

        setAppBranchLastOngoingRepairTaskId(appBranchOngoingRepairTaskId);
        setAppBranchOngoingRepairTaskState(undefined);
        setShouldRefreshAppBranchOngoingRepairTaskState(true);
      }
    },
    [
      appBranchOngoingRepairTaskId,
    ],
  );

  React.useEffect(
    () => {

      if (!shouldRefreshAppBranchOngoingRepairTaskState) {

        return;
      }

      setShouldRefreshAppBranchOngoingRepairTaskState(false);

      // tslint:disable-next-line: no-floating-promises
      (async () => {

        let appBranchOngoingRepairTaskNewState: AppBranchRepairTaskState;

        try {

          appBranchOngoingRepairTaskNewState =
            await fetchAppBranchRepairTaskStateAsync({
              appId,
              appBranchId,
              appBranchRepairTaskId: appBranchOngoingRepairTaskId,
            });

        } catch {

          await new Promise((resolvePromise) => setTimeout(resolvePromise, 100));

          setShouldRefreshAppBranchOngoingRepairTaskState(true);
          return;
        }

        if (!appBranchOngoingRepairTaskNewState.isFinished) {

          await new Promise((resolvePromise) => setTimeout(resolvePromise, 100));

          setShouldRefreshAppBranchOngoingRepairTaskState(true);
        }

        setAppBranchOngoingRepairTaskState(
          appBranchOngoingRepairTaskNewState,
        );
      })();
    },
    [
      shouldRefreshAppBranchOngoingRepairTaskState,
    ],
  );

  return <AppBranchOngoingFilesOperationTaskBaseWidget
    appBranchOngoingFilesOperationTaskProgress={appBranchOngoingRepairTaskState?.progress}
    cancelAppBranchOngoingFilesOperationTask={async () => {

      await cancelAppBranchRepairTaskAsync({
        appId,
        appBranchId,
        appBranchRepairTaskId: appBranchOngoingRepairTaskId,
      });
    }}
  />;
};
