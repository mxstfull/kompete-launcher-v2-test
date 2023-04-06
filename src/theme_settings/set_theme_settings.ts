import { ThemeSettings } from './theme_settings';

export const setThemeSettings = (
  {
    themeSettings,
  }: {
    themeSettings: ThemeSettings;
  },
) => {

  window.localStorage.setItem(
    `settings`,
    JSON.stringify(themeSettings),
  );
};
