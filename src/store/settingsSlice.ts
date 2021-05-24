import { DEFAULT_LANG, DEFAULT_LANG_CODE } from "constants/langs";
import { Lang, LangCode } from "types/Lang";

import { RIGHT_ENTITY_OPTIONS } from "constants/properties";
import { Theme } from "constants/themes";
import { createSlice } from "@reduxjs/toolkit";

type SettingsState = {
  themeCode: string;
  currentLang: Lang;
  languageCode: LangCode;
  secondLanguageCode?: LangCode;
  showGenderColor: boolean;
  showEyeHairColors: boolean;
  showBirthName: boolean;
  hideToggleButton: boolean;
  showExternalImages: boolean;
  showFace: boolean;
  rightEntityOption: typeof RIGHT_ENTITY_OPTIONS[0];
  imageType: "face" | "head";
  customThemes: Record<Theme["name"], Theme>;
};

const initialState: SettingsState = {
  themeCode: "default",
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
    setSettings: (state, action) => {
      state = action.payload;
    },
    setCustomTheme: (state, { payload }) => {
      state.customThemes[payload.name] = payload;
    },
  },
});

export const { setSettings, setCustomTheme } = settingsSlice.actions;

export default settingsSlice.reducer;