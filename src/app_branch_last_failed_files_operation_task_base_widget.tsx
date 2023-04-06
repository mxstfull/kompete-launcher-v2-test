import React from 'react';
import chroma from 'chroma-js';
import { AppBranchFilesOperationTaskProgress } from 'patchkit-generic-patcher2_foundation';

import { LabelButtonWidget } from './label_button_widget';
import { AppBranchFilesOperationTaskBaseWidget } from './app_branch_files_operation_task_base_widget';

export const AppBranchFailedLastFilesOperationTaskBaseWidget = (
  {
    appBranchLastFailedFilesOperationTaskProgress,
    startAppFilesOperationTask,
  }: {
    appBranchLastFailedFilesOperationTaskProgress?: AppBranchFilesOperationTaskProgress;
    startAppFilesOperationTask: () => void;
  },
) => {

  return <AppBranchFilesOperationTaskBaseWidget
    appBranchFilesOperationTaskProgress={appBranchLastFailedFilesOperationTaskProgress}
    megabytesCountPerSecondWidget={{
      isVisible: false,
    }}
    progressBarWidget={{
      fillWidget: {
        shouldBeAnimatedIfPercentageIsUndefined: false,
        htmlStyle: {
          backgroundColor: `grey`,
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
            ? chroma(`#2d9cdb`).brighten().hex()
            : `#2d9cdb`,
        }),
        text: `RESUME`,
      }}
      onClicked={startAppFilesOperationTask}
    />}
  />;
};
