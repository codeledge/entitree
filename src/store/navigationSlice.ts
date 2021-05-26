import { AppState, AppThunk } from "store";
import { Entity, EntityProp } from "types/Entity";
import { PayloadAction, createAction, createSlice } from "@reduxjs/toolkit";

import { CHILD_ID } from "constants/properties";
import { HYDRATE } from "next-redux-wrapper";
import getEntities from "lib/getEntities";
import getItemProps from "wikidata/getItemProps";
import getUpMap from "wikidata/getUpMap";

type NavigationState = {
  currentEntity?: Entity;
  currentEntityProps?: EntityProp[];
  currentProp?: EntityProp;
  currentUpMap?: UpMap;
  loadingEntity: boolean;
};

type UpMap = Record<string, any>;

const initialState: NavigationState = {
  loadingEntity: false,
};

const hydrate = createAction<AppState>(HYDRATE);

export const navigationSlice = createSlice({
  name: "navigation",
  initialState,
  reducers: {
    setCurrentEntity: (state, action) => {
      state.currentEntity = action.payload;
    },
    setLoadingEntity: (state, action: PayloadAction<boolean>) => {
      state.currentEntity = undefined;
      state.loadingEntity = action.payload;
    },
    setCurrentProp: (state, action: PayloadAction<EntityProp>) => {
      state.currentProp = action.payload;
    },
    setCurrentEntityProps: (state, action: PayloadAction<EntityProp[]>) => {
      state.currentEntityProps = action.payload;
    },
  },
  extraReducers(builder) {
    builder.addCase(hydrate, (state, action) => {
      //console.log("HYDRATE in " + navigationSlice.name, action.payload);
      return {
        ...state,
        ...action.payload[navigationSlice.name],
      };
    });
  },
});

export const loadEntity = (itemId): AppThunk => async (dispatch, getState) => {
  dispatch(setLoadingEntity(true));

  const { currentLang, secondLanguageCode } = getState().settings;
  const { currentProp } = getState().navigation;

  const [[entity], itemProps, upMap] = await Promise.all([
    getEntities([itemId], currentLang.code, {
      secondLanguageCode,
    }),
    getItemProps(itemId, currentLang.code),
    ...(currentProp ? [getUpMap(itemId, currentProp.id)] : []),
  ]);

  dispatch(setCurrentEntityProps(itemProps));

  if (!currentProp) {
    itemProps.forEach((prop) => {
      if (prop.id === CHILD_ID) dispatch(setCurrentProp(prop));
    });
  }
  dispatch(setCurrentEntity(entity));
};

export const {
  setCurrentEntity,
  setCurrentEntityProps,
  setLoadingEntity,
  setCurrentProp,
} = navigationSlice.actions;

export default navigationSlice.reducer;
