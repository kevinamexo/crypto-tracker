import React, { useState, useEffect } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import TablePagination from "@material-ui/core/TablePagination";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { Sparklines, SparklinesLine } from "react-sparklines";
import { Coin } from "./CoinsResponseTypes";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../redux/app/store";
import "react-loading-skeleton/dist/skeleton.css";

import Skeleton from "react-loading-skeleton";

import axios from "axios";
import {
  setTableData,
  setTableOrder,
  setAssetsTablePage,
  setActiveColumn,
} from "../../redux/app/features/tables/assetsTableSlice";
import {
  activeParameterType,
  RankParameter,
  RankParameters,
  parameters,
} from "./Coins";

type RowNames = keyof Coin;
const rowNames: activeParameterType[] = [
  "name",
  "sparkline",
  "price",
  "marketCap",
  "24hVolume",
  "change",
  "listedAt",
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

const BasicTable: React.FC = () => {
  const {
    loadingAssets,
    assetsTablePage,
    tableData,
    tableOrder,
    activeColumn,
    resultsPerPage,
  } = useSelector((state: RootState) => state.assetsTable);
  const dispatch = useDispatch();
  const NumberFormatter = (value: string, decimal: number) => {
    return parseFloat(parseFloat(value).toFixed(decimal)).toLocaleString(
      "en-IN",
      {
        useGrouping: true,
      }
    );
  };
  const [orderDirection, setOrderDirection] = useState<"desc" | "asc">("desc");
  const handleSortRequest = (rowName: activeParameterType) => {
    dispatch(setActiveColumn(rowName));
    setOrderDirection(orderDirection === "asc" ? "desc" : "asc");
    dispatch(setTableOrder(orderDirection === "asc" ? "desc" : "asc"));
    let newData = setTableData(sortArray(tableData, rowName, orderDirection));
    console.log(newData);
    dispatch(setTableData(newData.payload));
  };

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    page: number
  ) => {
    dispatch(setAssetsTablePage(page));
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
                  <div
                    style={{
                      fontWeight: "700",
                      fontSize: "13px",
                      textAlign: "center",
                    }}
                  >
                    {parameters[rowName]}
                  </div>
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
                  {loadingAssets === false ? (
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
                        style={{
                          fontWeight: `${rowName === "name" ? "700" : "500"}`,

                          color: `${
                            rowName === "change" && row[rowName] < 0
                              ? "red"
                              : rowName === "change" && row[rowName] > 0
                              ? "green"
                              : ""
                          }`,
                        }}
                      >
                        {rowName === "sparkline"
                          ? null
                          : rowName === "listedAt"
                          ? new Date(row[rowName] * 1000).toDateString()
                          : rowName === "change"
                          ? `${row[rowName]}%`
                          : rowName === "price"
                          ? "$" + NumberFormatter(row[rowName], 3)
                          : row[rowName] ?? "-"}
                      </p>

                      {rowName === "sparkline" && (
                        <Sparklines data={row[rowName]}>
                          <SparklinesLine
                            color={row["change"] < 0 ? "red" : "green"}
                          />
                        </Sparklines>
                      )}
                    </div>
                  ) : (
                    <Skeleton
                      width={
                        rowName === "name"
                          ? 50
                          : rowName === "sparkline"
                          ? 70
                          : rowName === "marketCap"
                          ? 80
                          : 90
                      }
                    />
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </TableContainer>
      <TablePagination
        component="div"
        count={100}
        page={assetsTablePage}
        rowsPerPage={resultsPerPage}
        onPageChange={handleChangePage}
      />
    </TableContainer>
  );
};

export default React.memo(BasicTable);
