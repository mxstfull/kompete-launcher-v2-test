import React from 'react';
import { AppBranchFilesOperationTaskProgress } from 'patchkit-generic-patcher2_foundation';

import { AppBranchTaskProgressBarWidget } from './app_branch_task_progress_bar_widget';

export const AppBranchFilesOperationTaskBaseWidget = (
  {
    appBranchFilesOperationTaskProgress,
    megabytesCountPerSecondWidget,
    progressBarWidget,
    createButtonWidget,
  }: {
    appBranchFilesOperationTaskProgress?: AppBranchFilesOperationTaskProgress;
    megabytesCountPerSecondWidget: {
      isVisible: boolean;
    };
    progressBarWidget: {
      fillWidget: {
        shouldBeAnimatedIfPercentageIsUndefined: boolean;
        htmlStyle: {
          backgroundColor: string;
        };
      };
    };
    createButtonWidget: () => React.ReactNode;
  },
) => {

  const megabytesCountPerSecondWidgetText = (() => {

    if (appBranchFilesOperationTaskProgress === undefined) {

      return ``;
    }

    const megabytesCountPerSecond = Math.round(
      (appBranchFilesOperationTaskProgress.packagesProcessedBytesCountPerSecond ?? 0) / 1024 / 1024 * 100,
    ) / 100;

    return `${megabytesCountPerSecond} MB/s`;
  })();

  const bytesCountToTotalBytesCountWidgetText = (() => {

    if (appBranchFilesOperationTaskProgress === undefined) {

      return ``;
    }

    const megabytesCount = appBranchFilesOperationTaskProgress.packagesProcessedBytesCount / 1024 / 1024;
    const totalMegabytesCount = appBranchFilesOperationTaskProgress.packagesTotalBytesCount / 1024 / 1024;

    return `${Math.round(megabytesCount)} MB / ${Math.round(totalMegabytesCount)} MB`;
  })();

  const progressBarWidgetPercentage = appBranchFilesOperationTaskProgress === undefined
    ? undefined
    : Math.round(
      (appBranchFilesOperationTaskProgress.packagesProcessedBytesCount)
      /
      appBranchFilesOperationTaskProgress.packagesTotalBytesCount
      *
      100.0,
    );

  return <div
    style={{
      width: `100%`,
      height: `100%`,
      paddingLeft: `25px`,
      paddingRight: `25px`,

      display: `flex`,
      flexDirection: `column`,
      justifyContent: `center`,
      alignItems: `stretch`,
    }}
  >
    <div
      style={{
        width: `100%`,
        height: `8px`,
        marginTop: `8px`,
        marginBottom: `8px`,
      }}
    >
      <AppBranchTaskProgressBarWidget
        fillWidget={{
          shouldBeAnimatedIfPercentageIsUndefined:
            progressBarWidget.fillWidget.shouldBeAnimatedIfPercentageIsUndefined,
          htmlStyle: {
            backgroundColor:
              progressBarWidget.fillWidget.htmlStyle.backgroundColor,
          },
        }}
        percentage={progressBarWidgetPercentage}
      />
    </div>
    <div
      style={{
        width: `100%`,

        display: `flex`,
        justifyContent: `space-between`,
        alignItems: `center`,
      }}
    >{[
      megabytesCountPerSecondWidget.isVisible
        ? <div
          style={{
            position: `absolute`,
            width: `100%`,
            height: `100%`,

            display: `flex`,
            justifyContent: `center`,
            alignItems: `center`,

            fontFamily: `Roboto`,
            fontWeight: 400,
            fontSize: `12px`,
            color: `#ffffff`,
          }}
        >
          {megabytesCountPerSecondWidgetText}
        </div>
        : undefined,
      <div
        style={{
          display: `flex`,
          justifyContent: `center`,
          alignItems: `center`,

          fontFamily: `Roboto`,
          fontWeight: 400,
          fontSize: `12px`,
          color: `#ffffff`,
        }}
      >
        {bytesCountToTotalBytesCountWidgetText}
      </div>,
      createButtonWidget(),
    ]}</div>
  </div>;
};
