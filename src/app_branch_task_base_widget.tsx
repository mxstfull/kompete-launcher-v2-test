import React from 'react';

import { AppBranchTaskProgressBarWidget } from './app_branch_task_progress_bar_widget';

export const AppBranchTaskBaseWidget = (
  {
  }: {
  },
) => {

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
          shouldBeAnimatedIfPercentageIsUndefined: true,
          htmlStyle: {
            backgroundColor: `#2d9cdb`,
          },
        }}
        percentage={undefined}
      />
    </div>
  </div>;
};
