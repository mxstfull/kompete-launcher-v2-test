import { AppState, DefaultYesOrNoDialogResult } from 'patchkit-generic-patcher2_foundation';
import { showDefaultErrorDialogAsync, showDefaultYesOrNoDialogAsync, tryRestartingWithElevatedPermissionsAsync } from 'patchkit-generic-patcher2_ipc';

export const handleUnauthorizedAccessToAppDirAsync = async (
  {
    appState,
  }: {
    appState: AppState;
  },
) => {

  await showDefaultErrorDialogAsync({
    defaultErrorDialogTitle: `Error!`,
    defaultErrorDialogMessage: `Unauthorized access to ${appState.name} folder.`,
  });

  const defaultYesOrNoDialogResult = await showDefaultYesOrNoDialogAsync({
    defaultYesOrNoDialogTitle: `Unauthorized access`,
    defaultYesOrNoDialogMessage: `Cannot access the ${appState.name} folder. Would you like to restart the patcher with higher permissions?`,
  });

  switch (defaultYesOrNoDialogResult) {

    case DefaultYesOrNoDialogResult.Yes: {

      if (!await tryRestartingWithElevatedPermissionsAsync({})) {

        await showDefaultErrorDialogAsync({
          defaultErrorDialogTitle: `Error!`,
          defaultErrorDialogMessage: `Cannot restart the patcher with higher permissions.`,
        });
      }
      break;
    }
    case DefaultYesOrNoDialogResult.No: {

      break;
    }
  }
};
