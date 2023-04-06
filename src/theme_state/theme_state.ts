export interface ThemeState {
  currentAppId?: string;
  appChangelogPopups: {
    [appId: string]: {} | undefined;
  };
  optionsPopups: {
    [appId: string]: {} | undefined;
  };
}
