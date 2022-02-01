import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { stat } from "fs";

interface Modals {
  searchModal: boolean | null;
}
const initialState: Modals = {
  searchModal: true,
};

const modalsSlice = createSlice({
  name: "modals",
  initialState,
  reducers: {
    setSearchModal: (state, action: PayloadAction<boolean>) => {
      state.searchModal = action.payload;
    },
  },
});

export const { setSearchModal } = modalsSlice.actions;

export default modalsSlice.reducer;
