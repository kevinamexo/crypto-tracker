import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LayoutState {
  setShowMenu: boolean | null;
}
const initialState: LayoutState = {
  setShowMenu: null,
};

const layoutSlice = createSlice({
  name: "layout",
  initialState,
  reducers: {
    setShowMenu: (state, action: PayloadAction<boolean>) => {
      state.setShowMenu = action.payload;
    },
  },
});

export const { setShowMenu } = layoutSlice.actions;

export default layoutSlice.reducer;
