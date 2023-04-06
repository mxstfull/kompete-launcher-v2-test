import React from 'react';
import { AppPresentation, getHasAppBranchLastFilesOperationTaskFailed } from 'patchkit-generic-patcher2_foundation';

import { assert } from './assert';
import { useDefinedState } from './use_defined_state';
import { InstallAppBranchWidget } from './install_app_branch_widget';
import { RepairAppBranchWidget } from './repair_app_branch_widget';
import { StartAppBranchWidget } from './start_app_branch_widget';
import { AppBranchOngoingInstallTaskWidget } from './app_branch_ongoing_install_task_widget';
import { AppBranchOngoingUpdateTaskWidget } from './app_branch_ongoing_update_task_widget';
import { AppBranchOngoingRepairTaskWidget } from './app_branch_ongoing_repair_task_widget';
import { AppBranchOngoingMoveTaskWidget } from './app_branch_ongoing_move_task_widget';
import { AppBranchOngoingUninstallTaskWidget } from './app_branch_ongoing_uninstall_task_widget';
import { AppBranchLastFailedFilesOperationTaskWidget } from './app_branch_last_failed_files_operation_task_widget';
import { AppBranchLastFailedRepairTaskWidget } from './app_branch_last_failed_repair_task_widget';

export const AppBranchStateWidget = (
  {
    appId,
    appBranchId,
  }: {
    appId: string;
    appBranchId: string;
    appPresentation: AppPresentation;
  },
) => {

  const state = useDefinedState();

  const appState = state.apps[appId];

  assert(appState !== undefined);

  const appBranchState = appState.branches[appBranchId];

  assert(appBranchState !== undefined);

  if (appBranchState.ongoingInstallTaskId !== undefined) {

    return <AppBranchOngoingInstallTaskWidget
      appId={appId}
      appBranchId={appBranchId}
      appBranchOngoingInstallTaskId={appBranchState.ongoingInstallTaskId}
    />;

  } else if (appBranchState.ongoingUpdateTaskId !== undefined) {

    return <AppBranchOngoingUpdateTaskWidget
      appId={appId}
      appBranchId={appBranchId}
      appBranchOngoingUpdateTaskId={appBranchState.ongoingUpdateTaskId}
    />;

  } else if (appBranchState.ongoingRepairTaskId !== undefined) {

    return <AppBranchOngoingRepairTaskWidget
      appId={appId}
      appBranchId={appBranchId}
      appBranchOngoingRepairTaskId={appBranchState.ongoingRepairTaskId}
    />;

  } else if (appBranchState.ongoingMoveTaskId !== undefined) {

    return <AppBranchOngoingMoveTaskWidget
      appId={appId}
      appBranchId={appBranchId}
      appBranchOngoingMoveTaskId={appBranchState.ongoingMoveTaskId}
    />;

  } else if (appBranchState.ongoingUninstallTaskId !== undefined) {

    return <AppBranchOngoingUninstallTaskWidget
      appId={appId}
      appBranchId={appBranchId}
      appBranchOngoingUninstallTaskId={appBranchState.ongoingUninstallTaskId}
    />;
  }

  if (appBranchState.dir === undefined) {

    return <InstallAppBranchWidget
      appId={appId}
      appBranchId={appBranchId}
    />;
  }

  if (appBranchState.doesNeedRepair) {

    if (appBranchState.lastFilesOperationTask?.appBranchLastRepairTaskState === undefined) {

      return <RepairAppBranchWidget
        appId={appId}
        appBranchId={appBranchId}
      />;

    } else {

      return <AppBranchLastFailedRepairTaskWidget
        appId={appId}
        appBranchId={appBranchId}
        appBranchLastFailedRepairTaskState={appBranchState.lastFilesOperationTask.appBranchLastRepairTaskState}
      />;
    }
  }

  if (appBranchState.lastFilesOperationTask !== undefined) {

    const hasAppLastFilesOperationTaskFailed = getHasAppBranchLastFilesOperationTaskFailed({
      appBranchLastFilesOperationTaskState: appBranchState.lastFilesOperationTask,
    });

    if (hasAppLastFilesOperationTaskFailed) {

      return <AppBranchLastFailedFilesOperationTaskWidget
        appId={appId}
        appBranchId={appBranchId}
        appBranchLastFailedFilesOperationTaskState={appBranchState.lastFilesOperationTask}
      />;
    }
  }

  if (appBranchState.installedVersionId === undefined) {

    return <InstallAppBranchWidget
      appId={appId}
      appBranchId={appBranchId}
    />;
  }

  return <StartAppBranchWidget
    appId={appId}
    appBranchId={appBranchId}
  />;
};
