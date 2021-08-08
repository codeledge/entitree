import { Action, combineReducers } from "redux";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore,
} from "redux-persist";
import { MakeStore, createWrapper } from "next-redux-wrapper";
import {
  ThunkAction,
  configureStore,
  getDefaultMiddleware,
} from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

import alertReducer from "./alertSlice";
import settingsReducer from "./settingsSlice";
import storage from "redux-persist/lib/storage";
import treeReducer from "./treeSlice";

const rootReducer = combineReducers({
  alert: alertReducer,
  settings: settingsReducer,
  tree: treeReducer,
});

const persistConfig = {
  key: "root",
  whitelist: ["settings"],
  version: 3,
  storage,
  debug: process.env.NODE_ENV === "development",
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
    },
  }),
});

const makeStore: MakeStore = () => store;

export const persistor = persistStore(store);

export default store;

export type AppStore = ReturnType<typeof makeStore>;
export type AppState = ReturnType<AppStore["getState"]>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action
>;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const wrapper = createWrapper<AppStore>(makeStore, {
  debug: false,
});

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
