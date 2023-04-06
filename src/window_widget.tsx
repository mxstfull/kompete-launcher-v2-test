import React from 'react';
import { fetchUpdateStateAsync, setShouldApplyUpdateAfterQuitAsync, startQuitTaskAsync } from 'patchkit-generic-patcher2_ipc';
import { useState } from './use_state';
import { useThemeState, setCurrentAppId } from './theme_state';
import { LoadingWidget } from './loading_widget';
import { WindowTitleBarWidget } from './window_title_bar_widget';
import { WindowContentWidget } from './window_content_widget';
import { AppChangelogPopupWidget } from './app_changelog_popup_widget';
import { OptionsPopupWidget } from './options_popup_widget';

export const WindowWidget = (
  {
  }: {
  },
) => {

  const state = useState();
  const themeState = useThemeState();

  React.useEffect(
    () => {

      // tslint:disable-next-line: no-floating-promises
      (async () => {

        const updateState = await fetchUpdateStateAsync({});

        if (updateState !== undefined && updateState.isAvailable) {

          await setShouldApplyUpdateAfterQuitAsync({
            shouldApplyUpdateAfterQuit: true,
          });

          await startQuitTaskAsync({});
        }
      })();
    },
    [],
  );

  React.useEffect(
    () => {

      if (themeState.currentAppId !== undefined) {

        return;
      }

      const appsId = Object.keys(state?.apps ?? {});

      if (appsId.length === 0) {

        return;
      }

      setCurrentAppId({
        currentAppId: appsId[0],
      });
    },
    [
      state?.apps,
    ],
  );

  const currentAppId = themeState.currentAppId;

  const appBranchId = `main`;

  const popupContainerWidgetStyle: React.CSSProperties = {
    position: `absolute`,
    width: `100%`,
    height: `100%`,
    top: `0px`,
    left: `0px`,
    pointerEvents: `none`,
  };

  return <div
    style={{
      width: `calc(100% - 32px)`,
      height: `calc(100% - 32px)`,
      margin: `16px`,
      borderRadius: `5px`,

      backgroundColor: `#303030`,

      boxShadow: `0px 0px 8px 4px rgba(0, 0, 0, 0.1)`,
    }}
    children={<div
      style={{
        width: `100%`,
        height: `100%`,

        display: `flex`,
        flexDirection: `column`,
        justifyContent: `flex-start`,
        alignItems: `stretch`,
      }}
      children={[
        <div
          style={{
            width: `100%`,
            height: `35px`,
            flexGrow: 0,
            flexShrink: 0,
          }}
          children={<WindowTitleBarWidget
            appId={currentAppId}
          />}
        />,
        <div
          style={{
            width: `100%`,
            flexBasis: 0,
            flexGrow: 1,
            flexShrink: 0,

            display: `flex`,
            justifyContent: `stretch`,
            alignItems: `stretch`,
          }}
          children={[
            <div
              style={{
                height: `100%`,
                flexBasis: 0,
                flexGrow: 1,
                flexShrink: 0,
              }}
            >{[
              ...(
                state === undefined || currentAppId === undefined
                  ? [<LoadingWidget />]
                  : [
                    <WindowContentWidget
                      key={`${currentAppId}-${appBranchId}-1`}
                      appId={currentAppId}
                      appBranchId={appBranchId}
                    />,
                    <div
                      key={`${currentAppId}-${appBranchId}-2`}
                      style={popupContainerWidgetStyle}
                    >
                      <AppChangelogPopupWidget
                        appId={currentAppId}
                        appBranchId={appBranchId}
                      />
                    </div>,
                    <div
                      key={`${currentAppId}-${appBranchId}-3`}
                      style={popupContainerWidgetStyle}
                    >
                      <OptionsPopupWidget
                        appId={currentAppId}
                        appBranchId={appBranchId}
                      />
                    </div>,
                  ]
              ),
            ]}</div>,
          ]}
        />,
      ]}
    />}
  />;
};
