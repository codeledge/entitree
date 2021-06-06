import { THEMES } from "constants/themes";
import store from "store";

export default function useCurrentTheme() {
  const { customThemes, themeCode } = store.getState().settings;

  const baseTheme = THEMES.find(({ name }) => themeCode === name);
  //TODO: if theme not found?
  const currentTheme = {
    ...baseTheme,
    ...(customThemes[themeCode] || {}),
  };

  return currentTheme;
}
