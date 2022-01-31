import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { activeParameterType } from "../../../../pages/Coins/Coins";
export type TableTimePeriod = "3h" | "24h" | "7d" | "30d" | "1y";

type TableRequestOrder = "asc" | "desc";
interface TableState {
  loadingAssets: boolean | null;
  tableData: Record<string, any>[];
  timePeriod: TableTimePeriod;
  tableOrder: TableRequestOrder;
  activeColumn: activeParameterType;
}

const initialState: TableState = {
  loadingAssets: null,
  tableData: [] as Record<string, any>[],
  timePeriod: "24h",
  tableOrder: "desc",
  activeColumn: "price",
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
    setTableOrder: (state, action: PayloadAction<TableRequestOrder>) => {
      state.tableOrder = action.payload;
    },
    setActiveColumn: (state, action: PayloadAction<activeParameterType>) => {
      state.activeColumn = action.payload;
    },
  },
});

export const {
  setLoadingAssets,
  setTableData,
  setTimePeriod,
  setTableOrder,
  setActiveColumn,
} = assetsTableSlice.actions;

export default assetsTableSlice.reducer;
