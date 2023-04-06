import React from 'react';
import chroma from 'chroma-js';
import { tryRestartingWithElevatedPermissionsAsync, showDefaultErrorDialogAsync } from 'patchkit-generic-patcher2_ipc';

import { assert } from './assert';
import { useDefinedState } from './use_defined_state';
import { unauthorizedAccessToAppDirIcon } from './assets';
import { LabelButtonWidget } from './label_button_widget';

export const UnauthorizedAccessToAppBranchDirWidget = (
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

  return <div
    style={{
      width: `100%`,
      height: `100%`,

      display: `flex`,
      justifyContent: `center`,
      alignItems: `center`,
      flexDirection: `column`,
    }}
  >
    <img
      style={{
        width: `40px`,
        height: `auto`,
      }}
      src={unauthorizedAccessToAppDirIcon}
    />
    <div
      style={{
        marginTop: `5px`,

        fontFamily: `Roboto`,
        fontWeight: 400,
        fontSize: `12px`,
        color: `#ffffff`,
      }}
    >
      Unauthorized access to ${appState.name} folder. The patcher needs to be restarted with elevated permissions.
      </div>
    <LabelButtonWidget
      htmlStyle={{
        width: `150px`,
        height: `36px`,
        marginTop: `10px`,

        cursor: `pointer`,
      }}
      labelWidget={{
        getHtmlStyle: ({ isHovered }) => ({

          width: `100%`,
          height: `100%`,

          display: `flex`,
          justifyContent: `center`,
          alignItems: `center`,

          backgroundColor: isHovered
            ? chroma(`#2d9cdb`).brighten().hex()
            : `#2d9cdb`,

          fontFamily: `Roboto`,
          fontWeight: 500,
          fontSize: `12px`,
          color: `#ffffff`,
        }),
        text: `RESTART`,
      }}
      onClicked={async () => {

        if (!await tryRestartingWithElevatedPermissionsAsync({})) {

          await showDefaultErrorDialogAsync({
            defaultErrorDialogTitle: `Error!`,
            defaultErrorDialogMessage: `Cannot restart the patcher with higher permissions.`,
          });
        }
      }}
    />
  </div>;
};
