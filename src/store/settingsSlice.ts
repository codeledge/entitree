import { DEFAULT_LANG, DEFAULT_LANG_CODE } from "constants/langs";
import { Lang, LangCode, SecondLabel } from "types/Lang";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { DefaultTheme } from "styled-components";
import { RIGHT_ENTITY_OPTIONS } from "constants/properties";
import { defaultTheme } from "constants/themes";

type SettingsState = {
  themeCode: string;
  currentLang: Lang;
  languageCode: LangCode;
  secondLanguageCode?: LangCode;
  secondLabel?: Lang | SecondLabel;
  showGenderColor: boolean;
  showEyeHairColors: boolean;
  showBirthName: boolean;
  hideToggleButton: boolean;
  showExternalImages: boolean;
  showFace: boolean;
  rightEntityOption: typeof RIGHT_ENTITY_OPTIONS[0];
  imageType: "face" | "head";
  customThemes: Record<DefaultTheme["name"], DefaultTheme>;
  showExtraInfo?: boolean;
  extraInfo?: string;
};

const initialState: SettingsState = {
  themeCode: defaultTheme.name,
  currentLang: DEFAULT_LANG,
  languageCode: DEFAULT_LANG_CODE,
  showGenderColor: false,
  showEyeHairColors: false,
  showBirthName: false,
  hideToggleButton: false,
  showExternalImages: false,
  showFace: false,
  rightEntityOption: RIGHT_ENTITY_OPTIONS[1],
  imageType: "face",
  customThemes: {},
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
    setCustomTheme: (state, { payload }) => {
      state.customThemes[payload.name] = payload;
    },
    setCurrentLang: (state, { payload }: PayloadAction<Lang>) => {
      state.currentLang = payload;
    },
    setSecondLabel: (
      state,
      { payload }: PayloadAction<SettingsState["secondLabel"]>,
    ) => {
      state.secondLabel = payload;
    },
    setCustomThemeProp: (
      state,
      { payload: { key, val } }: PayloadAction<{ key: string; val: any }>,
    ) => {
      state.customThemes[state.themeCode][key] = val;
    },
    resetCurrentTheme: (state) => {
      delete state.customThemes[state.themeCode];
    },
  },
});

export const {
  resetCurrentTheme,
  setCurrentLang,
  setCustomTheme,
  setCustomThemeProp,
  setSecondLabel,
  setSetting,
} = settingsSlice.actions;

export default settingsSlice.reducer;
