import { _themeState } from "./_theme_state";
import { _onThemeStateUpdate } from "./_on_theme_state_update";

export const closeOptionsPopup = (
  {
    appId,
  }: {
    appId: string;
  },
) => {

  _themeState.optionsPopups[appId] = undefined;

  _onThemeStateUpdate();
};
