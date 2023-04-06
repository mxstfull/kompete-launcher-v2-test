import { _onThemeStateUpdateListeners } from "./_on_theme_state_update_listeners";

export const _subscribeToOnThemeStateUpdate = (
  listener: () => void,
) => {

  _onThemeStateUpdateListeners.push(listener);
};
