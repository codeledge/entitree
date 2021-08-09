import { DEFAULT_LANG, LANGS } from "constants/langs";

import { createSelector } from "reselect";
import { useAppSelector } from "store";

const langCodeSelector = ({ settings }) => settings.languageCode;

export const currentLangSelector = createSelector(
  [langCodeSelector],
  (langCode) => {
    return LANGS.find(({ code }) => langCode === code) || DEFAULT_LANG;
  },
);

export const useCurrentLang = () => useAppSelector(currentLangSelector);
