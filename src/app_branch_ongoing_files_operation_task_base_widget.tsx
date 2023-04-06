import React from 'react';
import chroma from 'chroma-js';
import { AppBranchFilesOperationTaskProgress } from 'patchkit-generic-patcher2_foundation';

import { LabelButtonWidget } from './label_button_widget';
import { AppBranchFilesOperationTaskBaseWidget } from './app_branch_files_operation_task_base_widget';

export const AppBranchOngoingFilesOperationTaskBaseWidget = (
  {
    appBranchOngoingFilesOperationTaskProgress,
    cancelAppBranchOngoingFilesOperationTask,
  }: {
    appBranchOngoingFilesOperationTaskProgress?: AppBranchFilesOperationTaskProgress;
    cancelAppBranchOngoingFilesOperationTask: () => void;
  },
) => {

  return <AppBranchFilesOperationTaskBaseWidget
    appBranchFilesOperationTaskProgress={appBranchOngoingFilesOperationTaskProgress}
    megabytesCountPerSecondWidget={{
      isVisible: true,
    }}
    progressBarWidget={{
      fillWidget: {
        shouldBeAnimatedIfPercentageIsUndefined: true,
        htmlStyle: {
          backgroundColor: `#2d9cdb`,
        },
      },
    }}
    createButtonWidget={() => <LabelButtonWidget
      htmlStyle={{
        cursor: `pointer`,
      }}
      labelWidget={{
        getHtmlStyle: ({ isHovered }) => ({

          fontFamily: `Roboto`,
          fontWeight: 500,
          fontSize: `12px`,
          color: isHovered
            ? chroma(`#ff0000`).brighten().hex()
            : `#ff0000`,
        }),
        text: `PAUSE`,
      }}
      onClicked={cancelAppBranchOngoingFilesOperationTask}
    />}
  />;
};
