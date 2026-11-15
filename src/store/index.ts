import { Action, Reducer, combineReducers } from "redux";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  Persistor,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore,
} from "redux-persist";
import { ThunkAction, configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import settingsReducer, { SETTINGS_SLICE_NAME } from "./settingsSlice";

import alertReducer from "./alertSlice";
import { createWrapper } from "next-redux-wrapper";
import storage from "redux-persist/lib/storage";
import treeReducer from "./treeSlice";

const rootReducer = combineReducers({
  alert: alertReducer,
  settings: settingsReducer,
  tree: treeReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

const persistConfig = {
  key: "entitree_v1",
  whitelist: [SETTINGS_SLICE_NAME],
  version: 6,
  storage,
  debug: process.env.NODE_ENV === "development",
};

const createAppStore = (reducer: Reducer<RootState>) =>
  configureStore({
    reducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
    devTools: process.env.NODE_ENV === "development",
  });

export type AppStore = ReturnType<typeof createAppStore>;

// Only set in the browser, where settings are persisted to localStorage
let persistor: Persistor | undefined;
export const getPersistor = () => persistor;

// next-redux-wrapper calls this once per request on the server,
// and only once in the browser (it keeps the client store)
const makeStore = (): AppStore => {
  if (typeof window === "undefined") return createAppStore(rootReducer);

  const store = createAppStore(
    persistReducer(persistConfig, rootReducer) as unknown as Reducer<RootState>,
  );
  persistor = persistStore(store);
  return store;
};

export type AppState = RootState;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action
>;

export type AppDispatch = AppStore["dispatch"];

export const wrapper = createWrapper<AppStore>(makeStore, {
  debug: false,
});

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
