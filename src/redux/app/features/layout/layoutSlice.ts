import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LayoutState {
  setShowMenu: boolean | null;
  windowWidth: number | null;
  searchTableBreakpoint: number;
}
const initialState: LayoutState = {
  setShowMenu: null,
  windowWidth: null,
  searchTableBreakpoint: 768,
};

const layoutSlice = createSlice({
  name: "layout",
  initialState,
  reducers: {
    setShowMenu: (state, action: PayloadAction<boolean>) => {
      state.setShowMenu = action.payload;
    },
    setWindowWidth: (state, action: PayloadAction<number>) => {
      state.windowWidth = action.payload;
    },
  },
});

export const { setShowMenu, setWindowWidth } = layoutSlice.actions;

export default layoutSlice.reducer;
