import React from 'react';
import { AppPresentation } from 'patchkit-generic-patcher2_foundation';
import { UnauthorizedAccessToAppBranchDir } from 'patchkit-generic-patcher2_foundation';
import { startAppBranchUpdateTaskAsync, showDefaultErrorDialogAsync } from 'patchkit-generic-patcher2_ipc';
import { handleUnauthorizedAccessToAppDirAsync } from './handle_unauthorized_access_to_app_dir_async';

import { assert } from './assert';
import { useDefinedState } from './use_defined_state';
import { UnauthorizedAccessToAppBranchDirWidget } from './unauthorized_access_to_app_branch_dir_widget';
import { AppBranchOngoingInstallTaskErrorHandlerWidget } from './app_branch_ongoing_install_task_error_handler';
import { AppBranchOngoingUpdateTaskErrorHandlerWidget } from './app_branch_ongoing_update_task_error_handler';
import { AppBranchOngoingRepairTaskErrorHandlerWidget } from './app_branch_ongoing_repair_task_error_handler';
import { AppBranchOngoingMoveTaskErrorHandlerWidget } from './app_branch_ongoing_move_task_error_handler';
import { AppBranchOngoingUninstallTaskErrorHandlerWidget } from './app_branch_ongoing_uninstall_task_error_handler';
import { AppBranchStateWidget } from './app_branch_state_widget';

export const AppBranchWidget = (
  {
    appId,
    appBranchId,
    appPresentation,
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

  if (appBranchState.dir?.isAccessUnauthorized ?? false) {

    return UnauthorizedAccessToAppBranchDirWidget({ appId, appBranchId });
  }

  return <AppBranchOngoingInstallTaskErrorHandlerWidget
    appId={appId}
    appBranchId={appBranchId}
    childWidget={<AppBranchOngoingUpdateTaskErrorHandlerWidget
      appId={appId}
      appBranchId={appBranchId}
      childWidget={<AppBranchOngoingRepairTaskErrorHandlerWidget
        appId={appId}
        appBranchId={appBranchId}
        childWidget={<AppBranchOngoingMoveTaskErrorHandlerWidget
          appId={appId}
          appBranchId={appBranchId}
          childWidget={<AppBranchOngoingUninstallTaskErrorHandlerWidget
            appId={appId}
            appBranchId={appBranchId}
            childWidget={<div
              style={{
                width: `100%`,
                height: `100%`,

                display: `flex`,
                flexDirection: `column`,
                justifyContent: `flex-start`,
                alignItems: `stretch`,
              }}
            >
              <div
                style={{
                  width: `100%`,
                  height: `265px`,
                  flexGrow: 0,
                  flexShrink: 0,
                }}
              >
                <img
                  style={{
                    width: `100%`,
                    height: `100%`,

                    objectFit: `cover`,
                  }}
                  src={appState.bannerImageUrl}
        				  onLoad={async () => {
        					if(appBranchState.installedVersionId !== undefined && appBranchState.doesNeedRepair == false){
        						try {

        					  await startAppBranchUpdateTaskAsync({ appId, appBranchId });

        					} catch (e) {

        					  if (e instanceof UnauthorizedAccessToAppBranchDir) {

        						await handleUnauthorizedAccessToAppDirAsync({ appState });

        					  } else {

        						await showDefaultErrorDialogAsync({
        						  defaultErrorDialogTitle: `Error!`,
        						  defaultErrorDialogMessage: `Cannot check for the app updates right now. Please try again.`,
        						});
        					  }
        					}

        					}
        				  }}
                />
              </div>
              <div
                style={{
                  width: `100%`,
                  flexBasis: 0,
                  flexGrow: 1,
                  flexShrink: 0,
                }}
              >
                <AppBranchStateWidget
                  appId={appId}
                  appBranchId={appBranchId}
                  appPresentation={appPresentation}
                />
              </div>
            </div>}
          />}
        />}
      />}
    />}
  />;
};
