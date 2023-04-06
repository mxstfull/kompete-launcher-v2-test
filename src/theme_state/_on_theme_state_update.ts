import { _onThemeStateUpdateListeners } from "./_on_theme_state_update_listeners";

export const _onThemeStateUpdate = (
) => {

  for (const listener of _onThemeStateUpdateListeners) {

    listener();
  }
};
