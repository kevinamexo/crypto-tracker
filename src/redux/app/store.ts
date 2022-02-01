import { configureStore } from "@reduxjs/toolkit";
import layoutReducer from "./features/layout/layoutSlice";
import assetsTableReducer from "./features/tables/assetsTableSlice";
import modalsReducer from "./features/modalsSlice";
export const store = configureStore({
  reducer: {
    layout: layoutReducer,
    assetsTable: assetsTableReducer,
    modals: modalsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
