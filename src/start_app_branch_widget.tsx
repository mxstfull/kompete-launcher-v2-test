import React from 'react';
import chroma from 'chroma-js';
import { UnauthorizedAccessToAppBranchDir } from 'patchkit-generic-patcher2_foundation';
import { startAppBranchAsync, showDefaultErrorDialogAsync } from 'patchkit-generic-patcher2_ipc';

import { assert } from './assert';
import { useDefinedState } from './use_defined_state';
import { PerformAppActionWidget } from './perform_app_branch_action_widget';
import { handleUnauthorizedAccessToAppDirAsync } from './handle_unauthorized_access_to_app_dir_async';

export const StartAppBranchWidget = (
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

        await startAppBranchAsync({ appId, appBranchId });

      } catch (e) {

        if (e instanceof UnauthorizedAccessToAppBranchDir) {

          await handleUnauthorizedAccessToAppDirAsync({ appState });

        } else {

          await showDefaultErrorDialogAsync({
            defaultErrorDialogTitle: `Error!`,
            defaultErrorDialogMessage: `Cannot start the app right now. Please try again later.`,
          });
        }
      }
    }}
    performActionButtonWidget={{
      labelWidget: {
        htmlStyle: {
          backgroundColor: `green`,
          color: `white`,
        },
        hoveredHtmlStyle: {
          backgroundColor: chroma(`green`).brighten().hex(),
          color: `white`,
        },
        text: `PLAY`,
      },
    }}
    checkForUpdatesButtonWidget={{
      isVisible: true,
    }}
  />;
};
