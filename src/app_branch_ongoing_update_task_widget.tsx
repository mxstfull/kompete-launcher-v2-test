import React from 'react';
import { AppBranchUpdateTaskState } from 'patchkit-generic-patcher2_foundation';
import { fetchAppBranchUpdateTaskStateAsync, cancelAppBranchUpdateTaskAsync } from 'patchkit-generic-patcher2_ipc';

import { AppBranchOngoingFilesOperationTaskBaseWidget } from './app_branch_ongoing_files_operation_task_base_widget';

export const AppBranchOngoingUpdateTaskWidget = (
  {
    appId,
    appBranchId,
    appBranchOngoingUpdateTaskId,
  }: {
    appId: string;
    appBranchId: string;
    appBranchOngoingUpdateTaskId: number;
  },
) => {

  const [appBranchLastOngoingUpdateTaskId, setAppBranchLastOngoingUpdateTaskId] =
    React.useState<number | undefined>(undefined);

  const [appBranchOngoingUpdateTaskState, setAppBranchOngoingUpdateTaskState] =
    React.useState<AppBranchUpdateTaskState | undefined>(undefined);

  const [shouldRefreshAppBranchOngoingUpdateTaskState, setShouldRefreshAppBranchOngoingUpdateTaskState] =
    React.useState<boolean>(true);

  React.useEffect(
    () => {

      if (appBranchLastOngoingUpdateTaskId !== appBranchOngoingUpdateTaskId) {

        setAppBranchLastOngoingUpdateTaskId(appBranchOngoingUpdateTaskId);
        setAppBranchOngoingUpdateTaskState(undefined);
        setShouldRefreshAppBranchOngoingUpdateTaskState(true);
      }
    },
    [
      appBranchOngoingUpdateTaskId,
    ],
  );

  React.useEffect(
    () => {

      if (!shouldRefreshAppBranchOngoingUpdateTaskState) {

        return;
      }

      setShouldRefreshAppBranchOngoingUpdateTaskState(false);

      // tslint:disable-next-line: no-floating-promises
      (async () => {

        let appBranchOngoingUpdateTaskNewState: AppBranchUpdateTaskState;

        try {

          appBranchOngoingUpdateTaskNewState =
            await fetchAppBranchUpdateTaskStateAsync({
              appId,
              appBranchId,
              appBranchUpdateTaskId: appBranchOngoingUpdateTaskId,
            });

        } catch {

          await new Promise((resolvePromise) => setTimeout(resolvePromise, 100));

          setShouldRefreshAppBranchOngoingUpdateTaskState(true);
          return;
        }

        if (!appBranchOngoingUpdateTaskNewState.isFinished) {

          await new Promise((resolvePromise) => setTimeout(resolvePromise, 100));

          setShouldRefreshAppBranchOngoingUpdateTaskState(true);
        }

        setAppBranchOngoingUpdateTaskState(
          appBranchOngoingUpdateTaskNewState,
        );
      })();
    },
    [
      shouldRefreshAppBranchOngoingUpdateTaskState,
    ],
  );

  return <AppBranchOngoingFilesOperationTaskBaseWidget
    appBranchOngoingFilesOperationTaskProgress={appBranchOngoingUpdateTaskState?.progress}
    cancelAppBranchOngoingFilesOperationTask={async () => {

      await cancelAppBranchUpdateTaskAsync({
        appId,
        appBranchId,
        appBranchUpdateTaskId: appBranchOngoingUpdateTaskId,
      });
    }}
  />;
};
