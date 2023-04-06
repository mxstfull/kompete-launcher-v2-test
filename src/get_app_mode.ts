import { AppMode } from './app_mode';

export const getAppMode = (
): AppMode => {

  return (global as any).$injected.appMode;
};
