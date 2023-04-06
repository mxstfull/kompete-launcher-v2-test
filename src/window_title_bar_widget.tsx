import React from 'react';
import { minimizeWindowAsync, startQuitTaskAsync } from 'patchkit-generic-patcher2_ipc';

import { assert } from './assert';
import { useState } from './use_state';
import { minimizeWindowIcon, closeWindowIcon } from './assets';
import { openOptionsPopup, openAppChangelogPopup } from './theme_state';
import { ButtonWidget } from './button_widget';
import { LabelButtonWidget } from './label_button_widget';

export const WindowTitleBarWidget = (
  {
    appId,
  }: {
    appId: string | undefined;
  },
) => {

  const state = useState();

  const appState = (() => {

    if (state === undefined || appId === undefined) {

      return undefined;
    }

    const result = state.apps[appId];

    assert(result !== undefined);

    return result;
  })();

  return <div
    style={{
      width: `100%`,
      height: `100%`,

      display: `flex`,
      justifyContent: `space-between`,

      backgroundColor: `#303030`,

      ...{
        WebkitAppRegion: `drag`,
      },
    }}
  >
    <div
      style={{
        position: `absolute`,
        width: `100%`,
        height: `100%`,

        display: `flex`,
        justifyContent: `center`,
        alignItems: `center`,

        fontFamily: `Roboto`,
        fontWeight: 600,
        fontSize: `14px`,
        color: `#ffffff`,
      }}
    >
      {appState?.name}
    </div>
    <div
      style={{
        height: `100%`,
        marginLeft: `16px`,
        marginRight: `16px`,

        display: `flex`,
        justifyContent: `flex-start`,
        alignItems: `center`,
      }}
    >
      {state === undefined || appId === undefined
        ? []
        : [
          <LabelButtonWidget
            htmlStyle={{
              cursor: `pointer`,
              ...{
                WebkitAppRegion: `no-drag`,
              },
            }}
            labelWidget={{
              getHtmlStyle: ({ isHovered }) => ({

                fontFamily: `Roboto`,
                fontWeight: 500,
                fontSize: `12px`,
                color: isHovered
                  ? `#dddddd`
                  : `#ffffff`,
              }),
              text: `OPTIONS`,
            }}
            onClicked={() => openOptionsPopup({ appId })}
          />,
          <div
            style={{
              width: `12px`,
            }}
          />,
          <LabelButtonWidget
            htmlStyle={{
              cursor: `pointer`,
              ...{
                WebkitAppRegion: `no-drag`,
              },
            }}
            labelWidget={{
              getHtmlStyle: ({ isHovered }) => ({

                fontFamily: `Roboto`,
                fontWeight: 500,
                fontSize: `12px`,
                color: isHovered
                  ? `#dddddd`
                  : `#ffffff`,
              }),
              text: `CHANGELOG`,
            }}
            onClicked={() => openAppChangelogPopup({ appId })}
          />,
        ]
      }
    </div>
    <div
      style={{
        height: `100%`,

        display: `flex`,
        justifyContent: `flex-end`,
      }}
    >
      <ButtonWidget
        htmlStyle={{
          cursor: `pointer`,
          ...{
            WebkitAppRegion: `no-drag`,
          },
        }}
        onClicked={async () => await minimizeWindowAsync({})}
        createChildWidget={({ isHovered }) => <img
          style={{
            width: `15px`,
            height: `2px`,
            paddingTop: `16.5px`,
            paddingBottom: `16.5px`,
            paddingLeft: `17.5px`,
            paddingRight: `17.5px`,

            backgroundColor: isHovered
              ? `#2d9cdb`
              : `transparent`,
          }}
          src={minimizeWindowIcon}
        />}
      />
      <ButtonWidget
        htmlStyle={{
          cursor: `pointer`,
          ...{
            WebkitAppRegion: `no-drag`,
          },
        }}
        onClicked={async () => await startQuitTaskAsync({})}
        createChildWidget={({ isHovered }) => <img
          style={{
            width: `14px`,
            height: `14px`,
            paddingTop: `10.5px`,
            paddingBottom: `10.5px`,
            paddingLeft: `18px`,
            paddingRight: `18px`,

            backgroundColor: isHovered
              ? `#ff0000`
              : `transparent`,
          }}
          src={closeWindowIcon}
        />}
      />
    </div>
  </div>;
};
