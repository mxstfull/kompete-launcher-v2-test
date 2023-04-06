import { _themeState } from "./_theme_state";
import { _onThemeStateUpdate } from "./_on_theme_state_update";

export const closeAppChangelogPopup = (
  {
    appId,
  }: {
    appId: string;
  },
) => {

  _themeState.appChangelogPopups[appId] = undefined;

  _onThemeStateUpdate();
};
