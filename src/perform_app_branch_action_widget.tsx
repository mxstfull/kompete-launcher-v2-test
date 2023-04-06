import React from 'react';
import chroma from 'chroma-js';
import { UnauthorizedAccessToAppBranchDir } from 'patchkit-generic-patcher2_foundation';
import { startAppBranchUpdateTaskAsync, showDefaultErrorDialogAsync } from 'patchkit-generic-patcher2_ipc';

import { assert } from './assert';
import { useDefinedState } from './use_defined_state';
import { LabelButtonWidget } from './label_button_widget';
import { ButtonWidget } from './button_widget';
import { handleUnauthorizedAccessToAppDirAsync } from './handle_unauthorized_access_to_app_dir_async';

export const PerformAppActionWidget = (
  {
    appId,
    appBranchId,
    performAction,
    performActionButtonWidget,
    checkForUpdatesButtonWidget,
  }: {
    appId: string;
    appBranchId: string;
    performAction: () => void;
    performActionButtonWidget: {
      labelWidget: {
        text: string;
        htmlStyle: {
          color: string;
          backgroundColor: string;
        };
        hoveredHtmlStyle: {
          color: string;
          backgroundColor: string;
        };
      };
    };
    checkForUpdatesButtonWidget: {
      isVisible: boolean;
    };
  },
) => {

  const state = useDefinedState();

  const appState = state.apps[appId];

  assert(appState !== undefined);

  const appBranchState = appState.branches[appBranchId];

  assert(appBranchState !== undefined);

  return <div
    style={{
      height: `100%`,
      marginRight: `17px`,

      display: `flex`,
      justifyContent: `flex-end`,
      alignItems: `center`,
    }}
  >
    {[
      checkForUpdatesButtonWidget.isVisible
        ? <ButtonWidget
          htmlStyle={{
            marginTop: `24px`,
            marginRight: `10px`,

            cursor: `pointer`,
          }}
          createChildWidget={({ isHovered }) => <div
            style={{

              fontFamily: `Roboto`,
              fontWeight: 500,
              fontSize: `12px`,
              color: isHovered
                ? chroma(`#2d9cdb`).brighten().hex()
                : `#2d9cdb`,
            }}
          >
            CHECK FOR UPDATES
          </div>}
          onClicked={async () => {

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
          }}
        />
        : undefined,
      <LabelButtonWidget
        htmlStyle={{
          width: `115px`,
          height: `44px`,
          borderRadius: `2.5px`,

          cursor: `pointer`,
        }}
        labelWidget={{
          getHtmlStyle: ({ isHovered }) => ({
            width: `100%`,
            height: `100%`,

            fontFamily: `Roboto`,
            fontWeight: 500,
            fontSize: `12px`,

            ...(
              isHovered
                ? performActionButtonWidget.labelWidget.hoveredHtmlStyle
                : performActionButtonWidget.labelWidget.htmlStyle
            ),

            display: `flex`,
            justifyContent: `center`,
            alignItems: `center`,
          }),
          text: performActionButtonWidget.labelWidget.text,
        }}
        onClicked={performAction}
      />,
    ]}
  </div>;
};
