import React from 'react';
import { AppBranchLastInstallTaskState } from 'patchkit-generic-patcher2_foundation';
import { startAppBranchInstallTaskAsync } from 'patchkit-generic-patcher2_ipc';

import { AppBranchFailedLastFilesOperationTaskBaseWidget } from './app_branch_last_failed_files_operation_task_base_widget';

export const AppBranchLastFailedInstallTaskWidget = (
  {
    appId,
    appBranchId,
    appBranchLastFailedInstallTaskState,
  }: {
    appId: string;
    appBranchId: string;
    appBranchLastFailedInstallTaskState: AppBranchLastInstallTaskState;
  },
) => {

  return <AppBranchFailedLastFilesOperationTaskBaseWidget
    appBranchLastFailedFilesOperationTaskProgress={appBranchLastFailedInstallTaskState.progress}
    startAppFilesOperationTask={async () => {

      try {

        await startAppBranchInstallTaskAsync({ appId, appBranchId });

      } catch (e) {

        // TODO:
      }
    }}
  />;
};
