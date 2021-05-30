import { Theme, defaultTheme } from "constants/themes";

import { createSlice } from "@reduxjs/toolkit";
import { setTreeLayout } from "lib/getTreeLayout";

const initialState: Theme = defaultTheme;

export const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setTheme: (state, { payload: theme }) => {
      // eslint-disable-next-line no-param-reassign
      state = theme;
      setTreeLayout(theme);
    },
  },
});

export const { setTheme } = themeSlice.actions;

export default themeSlice.reducer;
