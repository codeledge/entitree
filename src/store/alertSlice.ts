import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type AlertState = {
  errors: string[];
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
  },
});

export const { setError } = alertSlice.actions;

export const showError = (message: string) => (dispatch) =>
  dispatch(setError(message));

export default alertSlice.reducer;
