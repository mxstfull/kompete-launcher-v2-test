import React from 'react';
import chroma from 'chroma-js';
import { UnauthorizedAccessToAppBranchDir } from 'patchkit-generic-patcher2_foundation';
import { startAppBranchRepairTaskAsync, showDefaultErrorDialogAsync } from 'patchkit-generic-patcher2_ipc';

import { assert } from './assert';
import { useDefinedState } from './use_defined_state';
import { PerformAppActionWidget } from './perform_app_branch_action_widget';
import { handleUnauthorizedAccessToAppDirAsync } from './handle_unauthorized_access_to_app_dir_async';

export const RepairAppBranchWidget = (
  {
    appId,
    appBranchId,
  }: {
    appId: string;
    appBranchId: string;
  },
) => {

  const state = useDefinedState();

  const appState = state.apps[appId];

  assert(appState !== undefined);

  const appBranchState = appState.branches[appBranchId];

  assert(appBranchState !== undefined);

  return <PerformAppActionWidget
    appId={appId}
    appBranchId={appBranchId}
    performAction={async () => {

      try {

        await startAppBranchRepairTaskAsync({ appId, appBranchId });

      } catch (e) {

        if (e instanceof UnauthorizedAccessToAppBranchDir) {

          await handleUnauthorizedAccessToAppDirAsync({ appState });

        } else {

          await showDefaultErrorDialogAsync({
            defaultErrorDialogTitle: `Error!`,
            defaultErrorDialogMessage: `Cannot repair the app right now. Please try again later.`,
          });
        }
      }
    }}
    performActionButtonWidget={{
      labelWidget: {
        htmlStyle: {
          backgroundColor: `#ff8c00`,
          color: `white`,
        },
        hoveredHtmlStyle: {
          backgroundColor: chroma(`#ff8c00`).brighten().hex(),
          color: `white`,
        },
        text: `REPAIR`,
      },
    }}
    checkForUpdatesButtonWidget={{
      isVisible: false,
    }}
  />;
};
