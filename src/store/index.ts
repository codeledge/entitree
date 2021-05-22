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
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";

import { combineReducers } from "redux";
import navigationReducer from "./navigationSlice";
import settingsReducer from "./settingsSlice";
import storage from "redux-persist/lib/storage";
import themeReducer from "./themeSlice";

const rootReducer = combineReducers({
  settings: settingsReducer,
  navigation: navigationReducer,
  theme: themeReducer,
});

const persistConfig = {
  key: "root",
  whitelist: ["settings"],
  version: 1,
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

export const persistor = persistStore(store);

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
