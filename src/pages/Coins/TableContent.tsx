import React, { useState, useEffect } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import TableHeader from "./TableHeader";

const rowInformation = [
  { name: "Bob Jonson", age: 69 },
  { name: "Jenny Jonson", age: 33 },
];

function descendingComparator(a: any, b: any, orderBy: any) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return;
}

function getComparator(order: any, orderBy: "name" | "age" | string) {
  return order === "desc"
    ? (a: any, b: any) => descendingComparator(a, b, orderBy)
    : (a: any, b: any) => descendingComparator(a, b, orderBy);
}

const sortedRowInformation = (rowArray: any, comparator: any) => {
  const stabilizedRowArray = rowArray.map((el: any, index: number) => [
    el,
    index,
  ]);
  stabilizedRowArray.sort((a: any, b: any) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedRowArray.map((el: any) => el[0]);
};

export default function TableContent() {
  const [orderDirection, setOrderDirection] = useState<"asc" | "desc">("asc");
  const [valueToOrderBy, setValueToOrderBy] = useState<string | "name" | "age">(
    "name"
  );

  const handleRequestSort = (event: any, property: any) => {
    const isAscending = valueToOrderBy === property && orderDirection === "asc";
    setValueToOrderBy(property);
    console.log("changing" + orderDirection);
    setOrderDirection(isAscending === true ? "desc" : "asc");
  };

  useEffect(() => {
    console.log(orderDirection);
    console.log(valueToOrderBy);
  }, [valueToOrderBy, orderDirection]);
  return (
    <>
      <TableContainer>
        <Table>
          <TableHeader
            valueToOrderBy={valueToOrderBy}
            orderDirection={orderDirection}
            handleRequestSort={handleRequestSort}
          />
          {sortedRowInformation(
            rowInformation,
            getComparator(orderDirection, valueToOrderBy)
          ).map((person: any, index: number) => (
            <TableRow key={index}>
              <TableCell>{person.name}</TableCell>
              <TableCell>{person.age}</TableCell>
            </TableRow>
          ))}
        </Table>
      </TableContainer>
    </>
  );
}
