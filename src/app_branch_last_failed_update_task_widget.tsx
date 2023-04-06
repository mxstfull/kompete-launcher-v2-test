import React from 'react';
import { AppBranchLastUpdateTaskState } from 'patchkit-generic-patcher2_foundation';
import { startAppBranchUpdateTaskAsync } from 'patchkit-generic-patcher2_ipc';

import { AppBranchFailedLastFilesOperationTaskBaseWidget } from './app_branch_last_failed_files_operation_task_base_widget';

export const AppBranchLastFailedUpdateTaskWidget = (
  {
    appId,
    appBranchId,
    appBranchLastFailedUpdateTaskState,
  }: {
    appId: string;
    appBranchId: string;
    appBranchLastFailedUpdateTaskState: AppBranchLastUpdateTaskState;
  },
) => {

  return <AppBranchFailedLastFilesOperationTaskBaseWidget
    appBranchLastFailedFilesOperationTaskProgress={appBranchLastFailedUpdateTaskState.progress}
    startAppFilesOperationTask={async () => {

      try {

        await startAppBranchUpdateTaskAsync({ appId, appBranchId });

      } catch (e) {

        // TODO:
      }
    }}
  />;
};
