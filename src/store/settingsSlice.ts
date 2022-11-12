import { Lang, LangCode, SecondLabel } from "types/Lang";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { DEFAULT_LANG_CODE } from "constants/langs";
import { DataSource } from "@entitree/helper";
import { DefaultTheme } from "styled-components";
import { RIGHT_ENTITY_OPTIONS } from "constants/properties";
import { defaultTheme } from "constants/themes";

export type SettingsState = {
  customThemes: Record<DefaultTheme["name"], DefaultTheme>;
  extraInfo?: string;
  followNavigation: boolean;
  hideToggleButton: boolean;
  imageOverflow: string;
  imageType: "transparent_face" | "transparent_head" | "face";
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
  orientation: "horizontal" | "vertical";
  dataSource: DataSource;
  hasDonatedAt?: Date;
  hasAcceptedCookies: boolean;
};

const initialState: SettingsState = {
  customThemes: {},
  followNavigation: true,
  hideToggleButton: false,
  imageOverflow: "no",
  imageType: "face",
  languageCode: DEFAULT_LANG_CODE,
  rightEntityOption: RIGHT_ENTITY_OPTIONS[1],
  showBirthName: false,
  showExternalImages: false,
  showEyeHairColors: false,
  showFace: true,
  showGenderColor: false,
  themeCode: defaultTheme.code,
  orientation: "vertical",
  dataSource: "wikidata",
  hasAcceptedCookies: false,
};

export const SETTINGS_SLICE_NAME = "settings";
export const settingsSlice = createSlice({
  name: SETTINGS_SLICE_NAME,
  initialState,
  reducers: {
    setSetting: (
      state,
      { payload: partialState }: PayloadAction<Partial<SettingsState>>,
    ) => ({
      ...state,
      ...partialState,
    }),
    setCustomTheme: (state, { payload }: PayloadAction<DefaultTheme>) => {
      state.customThemes[payload.code] = payload;
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
  setCustomTheme,
  setSecondLabelCode,
  setSetting,
} = settingsSlice.actions;

export default settingsSlice.reducer;
