import { Theme, defaultTheme } from "constants/themes";

import { createSlice } from "@reduxjs/toolkit";

const initialState: Theme = defaultTheme;

export const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setTheme: (state, action) => {
      // eslint-disable-next-line no-param-reassign
      state = action.payload;
    },
  },
});

export const { setTheme } = themeSlice.actions;

export default themeSlice.reducer;
