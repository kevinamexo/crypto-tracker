import React, { useState, useEffect } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { Coin } from "./CoinsResponseTypes";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../redux/app/store";
import { setTableData } from "../../redux/app/features/tables/assetsTableSlice";
import {
  activeParameterType,
  RankParameter,
  RankParameters,
  parameters,
} from "./Coins";

type RowNames = keyof Coin;
const rowNames: activeParameterType[] = [
  "name",
  "price",
  "marketCap",
  "24hVolume",
  "change",
  "listedAt",
];
const rows: Partial<Coin>[] = [
  {
    uuid: "fJaxCpLFd",
    symbol: "CWAR",
    name: "Cryowar",
    color: "#000000",
    iconUrl: "https://cdn.coinranking.com/XOqFfKw9A/Crowar.png",
    marketCap: "135531610",
    price: "0.4405429511164211",
    listedAt: 1639440107,
    tier: 1,
    change: "-2.47",
    rank: 248,

    lowVolume: false,
    coinrankingUrl: "https://coinranking.com/coin/fJaxCpLFd+cryowar-cwar",
    "24hVolume": "1308423",
    btcPrice: "0.000011511771845436",
  },
  {
    uuid: "UnOIYBcRaC7v2",
    symbol: "NUSD",
    name: "nUSD",
    color: null,
    iconUrl: "https://cdn.coinranking.com/T_enEu8BWGZ/nusd.svg",
    marketCap: null,
    price: "1e-9",
    listedAt: 1639306029,
    tier: 1,
    change: "0",
    rank: 579,

    lowVolume: false,
    coinrankingUrl: "https://coinranking.com/coin/UnOIYBcRaC7v2+nusd-nusd",
    "24hVolume": "8776831",
    btcPrice: "2.6117e-14",
  },
  {
    uuid: "McF09lRrU",
    symbol: "JASMY",
    name: "JasmyCoin",
    color: null,
    iconUrl: "https://cdn.coinranking.com/_5qBTxhiQ/jasmy.png",
    marketCap: "239993361",
    price: "0.05047252467335172",
    listedAt: 1638808862,
    tier: 1,
    change: "8.18",
    rank: 196,

    lowVolume: false,
    coinrankingUrl: "https://coinranking.com/coin/McF09lRrU+jasmycoin-jasmy",
    "24hVolume": "62398851",
    btcPrice: "0.000001319005337409",
  },
];

const sortArray = (
  arr: Array<any>,
  property: string,
  sortBy: "asc" | "desc"
) => {
  switch (sortBy) {
    case "asc":
      console.log([...arr].sort((a, b) => a[property] - b[property]));
      return [...arr].sort((a, b) => a[property] - b[property]);
    case "desc":
      console.log([...arr].sort((a, b) => b[property] - a[property]));
      return [...arr].sort((a, b) => b[property] - a[property]);
    default:
      return [...arr];
      break;
  }
};

const BasicTable: React.FC<{ sortBy: string }> = ({ sortBy }) => {
  const { loadingAssets, tableData } = useSelector(
    (state: RootState) => state.assetsTable
  );
  const dispatch = useDispatch();

  const [orderDirection, setOrderDirection] = useState<"desc" | "asc">("asc");
  const [activeColumn, setActiveColumn] = useState<string>(sortBy);
  const handleSortRequest = (rowName: activeParameterType) => {
    console.log(rowName);
    setActiveColumn(rowName);
    setOrderDirection(orderDirection === "asc" ? "desc" : "asc");
    let newData = setTableData(sortArray(tableData, rowName, orderDirection));
    console.log(newData);
    dispatch(setTableData(newData.payload));
  };
  return (
    <TableContainer component={Paper}>
      <TableContainer aria-label="simple table">
        <TableHead>
          {rowNames.map((rowName, index) => (
            <TableCell
              key={index}
              onClick={(
                e: React.MouseEvent<HTMLTableHeaderCellElement, MouseEvent>
              ) => handleSortRequest(rowName)}
            >
              <TableRow>
                <TableSortLabel
                  active={activeColumn === rowName}
                  direction={orderDirection}
                >
                  <div>{parameters[rowName]}</div>
                </TableSortLabel>
              </TableRow>
            </TableCell>
          ))}
        </TableHead>
        <TableBody>
          {tableData.map((row, index: number) => (
            <TableRow key={index}>
              {rowNames.map((rowName, index) => (
                <TableCell>
                  <div className="tableValueCell ">
                    {rowName === "name" && (
                      <img
                        className="tableValueCell-logo"
                        src={row["iconUrl"]}
                      />
                    )}
                    <p
                      className={
                        rowName === "name" ? "tableValueCell-value" : ""
                      }
                    >
                      {rowName === "listedAt"
                        ? new Date(row[rowName] * 1000).toDateString()
                        : row[rowName] ?? "-"}
                    </p>
                  </div>
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </TableContainer>
    </TableContainer>
  );
};

export default BasicTable;
