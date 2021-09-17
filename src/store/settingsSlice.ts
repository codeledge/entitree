import { Lang, LangCode, SecondLabel } from "types/Lang";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { DEFAULT_LANG_CODE } from "constants/langs";
import { DefaultTheme } from "styled-components";
import { RIGHT_ENTITY_OPTIONS } from "constants/properties";
import { defaultTheme } from "constants/themes";

export type SettingsState = {
  customThemes: Record<DefaultTheme["name"], DefaultTheme>;
  extraInfo?: string;
  followNavigation: boolean;
  hideToggleButton: boolean;
  imageType: "transparent_face" | "transparent_head" | "face";
  imageOverflow: "yes" | "no";
  languageCode: LangCode;
  rightEntityOption: typeof RIGHT_ENTITY_OPTIONS[1];
  secondLabelCode?: Lang["code"] | SecondLabel["code"];
  showBirthName: boolean;
  showExternalImages: boolean;
  showExtraInfo?: boolean;
  showEyeHairColors: boolean;
  showFace: boolean;
  showGenderColor: boolean;
  themeCode: string;
  wikibase: "wikidata" | "factgrid";
};

const initialState: SettingsState = {
  customThemes: {},
  followNavigation: true,
  hideToggleButton: false,
  imageType: "face",
  imageOverflow: "no",
  languageCode: DEFAULT_LANG_CODE,
  rightEntityOption: RIGHT_ENTITY_OPTIONS[1],
  showBirthName: false,
  showExternalImages: false,
  showEyeHairColors: false,
  showFace: true,
  showGenderColor: false,
  themeCode: defaultTheme.code,
  wikibase: "wikidata",
};

export const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setSetting: (
      state,
      { payload: { key, val } }: PayloadAction<{ key: string; val: any }>,
    ) => {
      state[key] = val;
    },
    setCustomTheme: (state, { payload }: PayloadAction<DefaultTheme>) => {
      state.customThemes[payload.code] = payload;
    },
    setLangCode: (state, { payload }: PayloadAction<LangCode>) => {
      state.languageCode = payload;
    },
    setSecondLabelCode: (
      state,
      { payload }: PayloadAction<SettingsState["secondLabelCode"]>,
    ) => {
      state.secondLabelCode = payload;
    },
    resetCurrentTheme: (state) => {
      delete state.customThemes[state.themeCode];
    },
  },
});

export const {
  resetCurrentTheme,
  setLangCode,
  setCustomTheme,
  setSecondLabelCode,
  setSetting,
} = settingsSlice.actions;

export default settingsSlice.reducer;
