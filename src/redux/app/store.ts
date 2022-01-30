import { configureStore } from "@reduxjs/toolkit";
import layoutReducer from "./features/layout/layoutSlice";
import assetsTableReducer from "./features/tables/assetsTableSlice";
export const store = configureStore({
  reducer: {
    layout: layoutReducer,
    assetsTable: assetsTableReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
