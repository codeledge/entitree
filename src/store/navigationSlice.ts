import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type NavigationState = {
  currentEntity?: WikidataEntity;
  currentEntityId?: WikidataEntity["id"];
  currentProp?: WikidataProp;
  currentPropId?: WikidataProp["id"];
  currentUpMap?: UpMap;
  loadingEntity: boolean;
};

type UpMap = Record<string, any>;

const initialState: NavigationState = {
  loadingEntity: false,
};

type WikidataEntity = {
  id: string;
  label: string;
  description: string;
  availableProps: WikidataProp[];
};

type WikidataProp = {
  id: string;
  label: string;
  overrideLabel: string;
  isFav: boolean;
};

export const settingsSlice = createSlice({
  name: "navigation",
  initialState,
  reducers: {
    setCurrentEntity: (state, action: PayloadAction<WikidataEntity>) => {
      state.currentEntity = action.payload;
    },
    setLoadingEntity: (state, action: PayloadAction<boolean>) => {
      state.currentEntity = undefined;
      state.loadingEntity = action.payload;
    },
    setCurrentEntityId: (
      state,
      action: PayloadAction<WikidataEntity["id"]>,
    ) => {
      state.currentEntityId = action.payload;
    },
    setCurrentProp: (state, action: PayloadAction<WikidataProp>) => {
      state.currentProp = action.payload;
    },
    setCurrentPropId: (state, action: PayloadAction<WikidataProp["id"]>) => {
      state.currentPropId = action.payload;
    },
  },
});

export const loadEntity = () => (dispatch) => {
  dispatch(setLoadingEntity(true));
  //let [_currentEntity, itemProps] = await getItemMemo;
};

export const {
  setCurrentEntity,
  setCurrentEntityId,
  setLoadingEntity,
  setCurrentProp,
  setCurrentPropId,
} = settingsSlice.actions;

export default settingsSlice.reducer;
