import React from 'react';

import { AppBranchTaskBaseWidget } from './app_branch_task_base_widget';

export const AppBranchOngoingMoveTaskWidget = (
  {
  }: {
    appId: string;
    appBranchId: string;
    appBranchOngoingMoveTaskId: number;
  },
) => {

  return <AppBranchTaskBaseWidget />;
};
