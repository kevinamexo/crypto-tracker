import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TableState {
  loadingAssets: boolean | null;
  tableData: Record<string, any>[];
}
const initialState: TableState = {
  loadingAssets: null,
  tableData: [] as Record<string, any>[],
};

const assetsTableSlice = createSlice({
  name: "assetsTable",
  initialState,
  reducers: {
    setLoadingAssets: (state, action: PayloadAction<boolean>) => {
      state.loadingAssets = action.payload;
    },
    setTableData: (state, action: PayloadAction<Array<Object>>) => {
      state.tableData = action.payload;
    },
  },
});

export const { setLoadingAssets, setTableData } = assetsTableSlice.actions;

export default assetsTableSlice.reducer;
