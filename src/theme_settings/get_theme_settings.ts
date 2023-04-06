import { ThemeSettings } from './theme_settings';

export const getThemeSettings = (
): ThemeSettings => {

  const defaultThemeSettings: ThemeSettings = {
    wasAcceptDataUsageAgreementPopupAutomaticallyOpened: false,
  };

  try {

    const themeSettingsAsJson = window.localStorage.getItem(`settings`);

    if (themeSettingsAsJson === null) {

      return defaultThemeSettings;
    }

    return JSON.parse(themeSettingsAsJson);

  } catch {

    return defaultThemeSettings;
  }
};
