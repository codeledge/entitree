import { DefaultTheme } from "styled-components";
import { defaultTheme, THEMES } from "constants/themes";
import { createSelector } from "reselect";
import { useAppSelector } from "store";

const customThemesSelector = ({ settings }) => settings.customThemes;
const themeCodeSelector = ({ settings }) => settings.themeCode;

export const currentThemeSelector = createSelector(
  [customThemesSelector, themeCodeSelector],
  (customThemes, themeCode) => {
    const baseTheme = THEMES.find(({ code }) => themeCode === code) ?? defaultTheme;

    const currentTheme = {
      ...baseTheme,
      ...(customThemes[themeCode] || {}),
    } as DefaultTheme;

    return currentTheme;
  },
);

export const useCurrentTheme = () => useAppSelector(currentThemeSelector);
