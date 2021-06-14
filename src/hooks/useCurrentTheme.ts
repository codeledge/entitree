import { DefaultTheme } from "styled-components";
import { THEMES } from "constants/themes";
import { createSelector } from "reselect";
import { useAppSelector } from "store";

const customThemesSelector = ({ settings }) => settings.customThemes;
const themeCodeSelector = ({ settings }) => settings.themeCode;

export const currentThemeSelector = createSelector(
  [customThemesSelector, themeCodeSelector],
  (customThemes, themeCode) => {
    const baseTheme = THEMES.find(({ name }) => themeCode === name);
    //TODO: if theme not found?
    const currentTheme = {
      ...baseTheme,
      ...(customThemes[themeCode] || {}),
    } as DefaultTheme;

    return currentTheme;
  },
);

export const useCurrentTheme = () => useAppSelector(currentThemeSelector);
