import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { stat } from "fs";

interface Modals {
  searchModal: boolean | null;
  minimizedSearchActive: boolean;
  modalActive: boolean | null;
}
const initialState: Modals = {
  searchModal: true,
  minimizedSearchActive: false,
  modalActive: null,
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
      if (action.payload === false) {
        state.modalActive = false;
      } else if (action.payload === true) {
        state.modalActive = true;
      }
    },
  },
});

export const { setSearchModal, setMinimizedSearchActive } = modalsSlice.actions;

export default modalsSlice.reducer;
