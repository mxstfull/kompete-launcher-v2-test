import { _themeState } from "./_theme_state";
import { _onThemeStateUpdate } from "./_on_theme_state_update";

export const setCurrentAppId = (
  {
    currentAppId,
  }: {
    currentAppId: string;
  },
) => {

  _themeState.currentAppId = currentAppId;

  _onThemeStateUpdate();
};
