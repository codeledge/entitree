import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { VideoLink } from "constants/videos";

type AlertState = {
  errors: string[];
  video?: VideoLink;
};

const initialState: AlertState = {
  errors: [],
};

export const alertSlice = createSlice({
  name: "alert",
  initialState,
  reducers: {
    setError: (state, { payload }: PayloadAction<string>) => {
      state.errors?.push(payload);
    },
    setVideo: (state, { payload }: PayloadAction<VideoLink | undefined>) => {
      state.video = payload;
    },
  },
});

export const { setError, setVideo } = alertSlice.actions;

export default alertSlice.reducer;
