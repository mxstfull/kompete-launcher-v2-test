import React from 'react';
import { AppBranchLastRepairTaskState } from 'patchkit-generic-patcher2_foundation';
import { startAppBranchRepairTaskAsync } from 'patchkit-generic-patcher2_ipc';

import { AppBranchFailedLastFilesOperationTaskBaseWidget } from './app_branch_last_failed_files_operation_task_base_widget';

export const AppBranchLastFailedRepairTaskWidget = (
  {
    appId,
    appBranchId,
    appBranchLastFailedRepairTaskState,
  }: {
    appId: string;
    appBranchId: string;
    appBranchLastFailedRepairTaskState: AppBranchLastRepairTaskState;
  },
) => {

  return <AppBranchFailedLastFilesOperationTaskBaseWidget
    appBranchLastFailedFilesOperationTaskProgress={appBranchLastFailedRepairTaskState.progress}
    startAppFilesOperationTask={async () => {

      try {

        await startAppBranchRepairTaskAsync({ appId, appBranchId });

      } catch (e) {

        // TODO:
      }
    }}
  />;
};
