import React from 'react';
import chroma from 'chroma-js';
import { AppBranchDirIsAlreadyCreated, UnauthorizedAccessToAppBranchDir } from 'patchkit-generic-patcher2_foundation';
import { createAppBranchDirAsync, showDefaultErrorDialogAsync, startAppBranchInstallTaskAsync } from 'patchkit-generic-patcher2_ipc';

import { assert } from './assert';
import { useDefinedState } from './use_defined_state';
import { PerformAppActionWidget } from './perform_app_branch_action_widget';
import { handleUnauthorizedAccessToAppDirAsync } from './handle_unauthorized_access_to_app_dir_async';

export const InstallAppBranchWidget = (
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

        await createAppBranchDirAsync({
          appId,
          appBranchId,
          appBranchDirPath: appBranchState.defaultDirPath,
          isOverwritingOtherAppBranchDirAllowed: true,
          isAppBranchNotEmptyDirAllowed: true,
        });

      } catch (e) {

        if (e instanceof AppBranchDirIsAlreadyCreated) {

          // TODO: Check if it matches the app dir path

        } else if (e instanceof UnauthorizedAccessToAppBranchDir) {

          await handleUnauthorizedAccessToAppDirAsync({ appState });

          return;

        } else {

          await showDefaultErrorDialogAsync({
            defaultErrorDialogTitle: `Error!`,
            defaultErrorDialogMessage: `Cannot install the app right now. Please try again.`,
          });

          return;
        }
      }

      try {

        await startAppBranchInstallTaskAsync({ appId, appBranchId });

      } catch (e) {

        if (e instanceof UnauthorizedAccessToAppBranchDir) {

          await handleUnauthorizedAccessToAppDirAsync({ appState });

        } else {

          await showDefaultErrorDialogAsync({
            defaultErrorDialogTitle: `Error!`,
            defaultErrorDialogMessage: `Cannot install the app right now. Please try again later.`,
          });
        }
      }
    }}
    performActionButtonWidget={{
      labelWidget: {
        htmlStyle: {
          backgroundColor: `#2d9cdb`,
          color: `white`,
        },
        hoveredHtmlStyle: {
          backgroundColor: chroma(`#2d9cdb`).brighten().hex(),
          color: `white`,
        },
        text: `INSTALL`,
      },
    }}
    checkForUpdatesButtonWidget={{
      isVisible: false,
    }}
  />;
};
