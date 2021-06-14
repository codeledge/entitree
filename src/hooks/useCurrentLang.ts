import { LANGS } from "constants/langs";
import { createSelector } from "reselect";
import { useAppSelector } from "store";

const langCodeSelector = ({ settings }) => settings.languageCode;

export const currentThemeSelector = createSelector(
  [langCodeSelector],
  (langCode) => {
    return LANGS.find(({ code }) => langCode === code)!;
  },
);

export const useCurrentLang = () => useAppSelector(currentThemeSelector);
