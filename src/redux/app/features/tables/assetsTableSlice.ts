import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { stat } from "fs";
import { activeParameterType } from "../../../../pages/Coins/Coins";
import { Coin, Stats } from "../../../../pages/Coins/CoinsResponseTypes";

export type TableTimePeriod = "3h" | "24h" | "7d" | "30d" | "1y";

type TableRequestOrder = "asc" | "desc";
interface TableState {
  loadingAssets: boolean | null;
  tableData: Record<string, any>[];
  timePeriod: TableTimePeriod;
  tableOrder: TableRequestOrder;
  activeColumn: activeParameterType;
  resultsPerPage: number;
  assetsTablePage: number;
  loadingSearchResults: boolean | null;
  searchResults: Array<any>;
  searchValue: string;
  stats: Stats;
}

const initialState: TableState = {
  loadingAssets: null,
  tableData: [] as Record<string, any>[],
  timePeriod: "24h",
  tableOrder: "desc",
  activeColumn: "price",
  resultsPerPage: 20,
  assetsTablePage: 1,
  loadingSearchResults: null,
  searchResults: [] as Partial<Coin>[],
  searchValue: "",
  stats: {} as Stats,
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
      state.assetsTablePage = 1;
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
    setResultsPerPage: (state, action: PayloadAction<number>) => {
      state.resultsPerPage = action.payload;
    },
    setAssetsTablePage: (state, action: PayloadAction<number>) => {
      state.assetsTablePage = action.payload;
    },
    setLoadingSearchResults: (state, action: PayloadAction<boolean>) => {
      state.loadingSearchResults = action.payload;
    },
    setSearchResultsArr: (state, action: PayloadAction<any>) => {
      state.searchResults = [...(action.payload as Partial<Coin>[])];
    },
    setSearchValue: (state, action: PayloadAction<string>) => {
      state.searchValue = action.payload;
    },
    setStats: (state, action: PayloadAction<Stats>) => {
      state.stats = action.payload;
    },
  },
});

export const {
  setLoadingAssets,
  setTableData,
  setTimePeriod,
  setTableOrder,
  setActiveColumn,
  setResultsPerPage,
  setAssetsTablePage,
  setLoadingSearchResults,
  setSearchResultsArr,
  setSearchValue,
  setStats,
} = assetsTableSlice.actions;

export default assetsTableSlice.reducer;
