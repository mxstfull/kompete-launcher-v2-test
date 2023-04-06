import React from 'react';

import { AppBranchTaskBaseWidget } from './app_branch_task_base_widget';

export const AppBranchOngoingUninstallTaskWidget = (
  {
  }: {
    appId: string;
    appBranchId: string;
    appBranchOngoingUninstallTaskId: number;
  },
) => {

  return <AppBranchTaskBaseWidget />;
};
