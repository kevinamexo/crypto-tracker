import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { stat } from "fs";

interface Modals {
  searchModal: boolean | null;
  minimizedSearchActive: boolean;
}
const initialState: Modals = {
  searchModal: true,
  minimizedSearchActive: false,
};

const modalsSlice = createSlice({
  name: "modals",
  initialState,
  reducers: {
    setSearchModal: (state, action: PayloadAction<boolean>) => {
      state.searchModal = action.payload;
    },
    setMinimizedSearchActive: (state, action: PayloadAction<boolean>) => {
      state.minimizedSearchActive = action.payload;
    },
  },
});

export const { setSearchModal, setMinimizedSearchActive } = modalsSlice.actions;

export default modalsSlice.reducer;
