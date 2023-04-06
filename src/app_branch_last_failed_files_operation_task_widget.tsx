import React from 'react';
import { AppBranchLastFilesOperationTaskState } from 'patchkit-generic-patcher2_foundation';

import { assert } from './assert';
import { AppBranchLastFailedInstallTaskWidget } from './app_branch_last_failed_install_task_widget';
import { AppBranchLastFailedUpdateTaskWidget } from './app_branch_last_failed_update_task_widget';
import { AppBranchLastFailedRepairTaskWidget } from './app_branch_last_failed_repair_task_widget';

export const AppBranchLastFailedFilesOperationTaskWidget = (
  {
    appId,
    appBranchId,
    appBranchLastFailedFilesOperationTaskState,
  }: {
    appId: string;
    appBranchId: string;
    appBranchLastFailedFilesOperationTaskState: AppBranchLastFilesOperationTaskState;
  },
) => {

  if (appBranchLastFailedFilesOperationTaskState.appBranchLastInstallTaskState !== undefined) {

    return <AppBranchLastFailedInstallTaskWidget
      appId={appId}
      appBranchId={appBranchId}
      appBranchLastFailedInstallTaskState={
        appBranchLastFailedFilesOperationTaskState.appBranchLastInstallTaskState
      }
    />;

  } else if (appBranchLastFailedFilesOperationTaskState.appBranchLastUpdateTaskState !== undefined) {

    return <AppBranchLastFailedUpdateTaskWidget
      appId={appId}
      appBranchId={appBranchId}
      appBranchLastFailedUpdateTaskState={
        appBranchLastFailedFilesOperationTaskState.appBranchLastUpdateTaskState
      }
    />;

  } else if (appBranchLastFailedFilesOperationTaskState.appBranchLastRepairTaskState !== undefined) {

    return <AppBranchLastFailedRepairTaskWidget
      appId={appId}
      appBranchId={appBranchId}
      appBranchLastFailedRepairTaskState={
        appBranchLastFailedFilesOperationTaskState.appBranchLastRepairTaskState
      }
    />;
  }

  assert(false);
};
