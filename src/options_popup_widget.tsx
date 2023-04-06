import React from 'react';
import chroma from 'chroma-js';
import { UnauthorizedAccessToAppBranchDir, DefaultYesOrNoDialogResult } from 'patchkit-generic-patcher2_foundation';
import { startAppBranchRepairTaskAsync, showDefaultErrorDialogAsync, startAppBranchUninstallTaskAsync, showDefaultYesOrNoDialogAsync } from 'patchkit-generic-patcher2_ipc';

import { assert } from './assert';
import { useDefinedState } from './use_defined_state';
import { useThemeState, closeOptionsPopup, openOptionsPopup } from './theme_state';
import { PopupWidget } from './popup_widget';
import { LabelButtonWidget } from './label_button_widget';
import { handleUnauthorizedAccessToAppDirAsync } from './handle_unauthorized_access_to_app_dir_async';

export const OptionsPopupWidget = (
  {
    appId,
    appBranchId,
  }: {
    appId: string;
    appBranchId: string;
  },
) => {

  const state = useDefinedState();
  const themeState = useThemeState();

  const appState = state.apps[appId];

  assert(appState !== undefined);

  const appBranchState = appState.branches[appBranchId];

  assert(appBranchState !== undefined);

  const appBranchDirState = appBranchState.dir;

  const hasAppBranchAnyOngoingTasks =
    appBranchState.ongoingInstallTaskId !== undefined ||
    appBranchState.ongoingMoveTaskId !== undefined ||
    appBranchState.ongoingRepairTaskId !== undefined ||
    appBranchState.ongoingUninstallTaskId !== undefined ||
    appBranchState.ongoingUpdateTaskId !== undefined;

  const optionsPopupState = themeState.optionsPopups[appId];

  if (optionsPopupState === undefined) {

    return null;
  }

  const isUninstallAppBranchButtonWidgetEnabled =
    appBranchDirState !== undefined && !hasAppBranchAnyOngoingTasks;

  const isRepairAppBranchButtonWidgetEnabled =
    appBranchDirState !== undefined && !hasAppBranchAnyOngoingTasks;

  return <PopupWidget
    title={`OPTIONS`}
    close={() => closeOptionsPopup({ appId })}
    createWindowContentWidget={() => <div
      style={{
        width: `100%`,
        height: `100%`,
        padding: `0px 15px 15px 25px`,

        display: `flex`,
        flexDirection: `column`,
        justifyContent: `center`,
        alignItems: `center`,
      }}
    >
      <LabelButtonWidget
        htmlStyle={{
          width: `115px`,
          height: `44px`,

          cursor: isUninstallAppBranchButtonWidgetEnabled
            ? `pointer`
            : undefined,
        }}
        labelWidget={{
          getHtmlStyle: ({ isHovered }) => ({

            width: `100%`,
            height: `100%`,

            display: `flex`,
            justifyContent: `center`,
            alignItems: `center`,

            fontFamily: `Roboto`,
            fontWeight: 500,
            fontSize: `12px`,
            color: `#ffffff`,

            backgroundColor: !isUninstallAppBranchButtonWidgetEnabled
              ? `#aaaaaa`
              : isHovered
                ? chroma(`#ff0000`).brighten().hex()
                : `#ff0000`,
          }),
          text: `UNINSTALL`,
        }}
        onClicked={!isUninstallAppBranchButtonWidgetEnabled
          ? () => { }
          : async () => {

            const defaultYesOrNoDialogResult = await showDefaultYesOrNoDialogAsync({
              defaultYesOrNoDialogTitle: `Please confirm`,
              defaultYesOrNoDialogMessage: `Are you sure you want to uninstall ${appState.name}?`,
            });

            if (defaultYesOrNoDialogResult !== DefaultYesOrNoDialogResult.Yes) {

              return;
            }

            closeOptionsPopup({ appId });

            try {

              await startAppBranchUninstallTaskAsync({ appId, appBranchId });

            } catch (e) {

              if (e instanceof UnauthorizedAccessToAppBranchDir) {

                await handleUnauthorizedAccessToAppDirAsync({ appState });

                openOptionsPopup({ appId });

              } else {

                await showDefaultErrorDialogAsync({
                  defaultErrorDialogTitle: `Error!`,
                  defaultErrorDialogMessage: `Cannot uninstall the app right now. Please try again.`,
                });

                openOptionsPopup({ appId });
              }
            }
          }}
      />
      <div
        style={{
          height: `15px`,
        }}
      />
      <LabelButtonWidget
        htmlStyle={{
          width: `115px`,
          height: `44px`,

          cursor: isRepairAppBranchButtonWidgetEnabled
            ? `pointer`
            : undefined,
        }}
        labelWidget={{
          getHtmlStyle: ({ isHovered }) => ({

            width: `100%`,
            height: `100%`,

            display: `flex`,
            justifyContent: `center`,
            alignItems: `center`,

            fontFamily: `Roboto`,
            fontWeight: 500,
            fontSize: `12px`,
            color: `#ffffff`,

            backgroundColor: !isRepairAppBranchButtonWidgetEnabled
              ? `#aaaaaa`
              : isHovered
                ? chroma(`#ff8c00`).brighten().hex()
                : `#ff8c00`,
          }),
          text: `REPAIR`,
        }}
        onClicked={!isRepairAppBranchButtonWidgetEnabled
          ? () => { }
          : async () => {

            closeOptionsPopup({ appId });

            try {

              await startAppBranchRepairTaskAsync({ appId, appBranchId });

            } catch (e) {

              if (e instanceof UnauthorizedAccessToAppBranchDir) {

                await handleUnauthorizedAccessToAppDirAsync({ appState });

                openOptionsPopup({ appId });

              } else {

                await showDefaultErrorDialogAsync({
                  defaultErrorDialogTitle: `Error!`,
                  defaultErrorDialogMessage: `Cannot repair the app right now. Please try again.`,
                });

                openOptionsPopup({ appId });
              }
            }
          }}
      />
    </div>}
  />;
};
