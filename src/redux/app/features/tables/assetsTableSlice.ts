import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type TableTimePeriod = "3h" | "24h" | "7d" | "30d" | "1y";

interface TableState {
  loadingAssets: boolean | null;
  tableData: Record<string, any>[];
  timePeriod: TableTimePeriod;
}
const initialState: TableState = {
  loadingAssets: null,
  tableData: [] as Record<string, any>[],
  timePeriod: "24h",
};

const assetsTableSlice = createSlice({
  name: "assetsTable",
  initialState,
  reducers: {
    setLoadingAssets: (state, action: PayloadAction<boolean>) => {
      state.loadingAssets = action.payload;
    },
    setTimePeriod: (state, action: PayloadAction<TableTimePeriod>) => {
      state.timePeriod = action.payload;
    },
    setTableData: (state, action: PayloadAction<Array<Object>>) => {
      state.tableData = action.payload;
    },
  },
});

export const { setLoadingAssets, setTableData, setTimePeriod } =
  assetsTableSlice.actions;

export default assetsTableSlice.reducer;
