import React from 'react';
import emotion = require('emotion');
import { AppBranchVersionPresentation } from 'patchkit-generic-patcher2_foundation';
import { retrieveAppBranchVersionsPresentationAsync } from 'patchkit-generic-patcher2_ipc';

import { assert } from './assert';
import { useThemeState, closeAppChangelogPopup } from './theme_state';
import { PopupWidget } from './popup_widget';
import { LoadingWidget } from './loading_widget';
import { ConnectionFailureWidget } from './connection_failure_widget';

export const AppChangelogPopupWidget = (
  {
    appId,
    appBranchId,
  }: {
    appId: string;
    appBranchId: string;
  },
) => {

  const themeState = useThemeState();

  const appChangelogPopupState = themeState.appChangelogPopups[appId];

  const [appBranchVersionsPresentation, setAppBranchVersionsPresentation] =
    React.useState<{ [appVersionId: string]: AppBranchVersionPresentation | undefined; } | undefined>(undefined);

  const [isRefreshingAppBranchVersionsPresentation, setIsRefreshingAppBranchVersionsPresentation] =
    React.useState<boolean>(false);

  const [shouldRefreshAppBranchVersionsPresentation, setShouldRefreshAppBranchVersionsPresentation] =
    React.useState<boolean>(true);

  React.useEffect(
    () => {

      if (appChangelogPopupState === undefined) {

        return;
      }

      if (!shouldRefreshAppBranchVersionsPresentation) {

        return;
      }

      setIsRefreshingAppBranchVersionsPresentation(true);

      // tslint:disable-next-line: no-floating-promises
      (async () => {

        try {

          setAppBranchVersionsPresentation(
            await retrieveAppBranchVersionsPresentationAsync({
              appId,
              appBranchId,
            }),
          );

        } catch {

          // ignore
        }

        setShouldRefreshAppBranchVersionsPresentation(false);
        setIsRefreshingAppBranchVersionsPresentation(false);
      })();
    },
    [
      appChangelogPopupState,
      shouldRefreshAppBranchVersionsPresentation,
    ],
  );

  if (appChangelogPopupState === undefined) {

    return null;
  }

  return <PopupWidget
    title={`CHANGELOG`}
    close={() => closeAppChangelogPopup({ appId })}
    createWindowContentWidget={() => shouldRefreshAppBranchVersionsPresentation || isRefreshingAppBranchVersionsPresentation
      ? <LoadingWidget />
      : appBranchVersionsPresentation === undefined
        ? <ConnectionFailureWidget
          refresh={() => setShouldRefreshAppBranchVersionsPresentation(true)}
        />
        : <div
          className={emotion.css`
              &::-webkit-scrollbar {
                width: 5px;
              }

              &::-webkit-scrollbar-thumb {
                border-radius: 50px;

                background-color: #dedede;
              }
            `}
          style={{
            width: `100%`,
            height: `100%`,
            padding: `0px 25px 25px 25px`,

            overflow: `auto`,
          }}
        >{[
          ...Object.values(appBranchVersionsPresentation).reverse().map((
            appVersionPresentation,
          ) => {

            assert(appVersionPresentation !== undefined);

            return [
              <div
                style={{
                  display: `block`,
                  marginTop: `17px`,

                  fontFamily: `Roboto`,
                  fontWeight: 400,
                  fontSize: `12px`,
                  color: `#ffffff`,
                }}
              >
                {appVersionPresentation.label}
              </div>,
              <div
                style={{
                  display: `block`,
                  marginTop: `17px`,

                  whiteSpace: `pre-wrap`,

                  fontFamily: `Roboto`,
                  fontWeight: 400,
                  fontSize: `12px`,
                  color: `#ffffff`,
                }}
              >
                {appVersionPresentation.changelog}
              </div>,
            ];
          }),
        ]}</div>}
  />;
};
