import React from "react";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";

interface HeaderProps {
  valueToOrderBy: string;
  orderDirection: "desc" | "asc";
  handleRequestSort: (e: any, property: any) => any;
}
const TableHeader: React.FC<HeaderProps> = ({
  valueToOrderBy,
  orderDirection,
  handleRequestSort,
}) => {
  return (
    <TableHead>
      <TableRow>
        <TableCell key="name">
          <TableSortLabel
            active={valueToOrderBy === "name"}
            direction={valueToOrderBy === "name" ? orderDirection : "desc"}
            onClick={(e) => handleRequestSort(e, "name")}
          >
            Name
          </TableSortLabel>
        </TableCell>

        <TableCell key="age">
          <TableSortLabel
            active={valueToOrderBy === "age"}
            direction={valueToOrderBy === "age" ? orderDirection : "desc"}
            onClick={(e) => handleRequestSort(e, "age")}
          >
            Age
          </TableSortLabel>
        </TableCell>
      </TableRow>
    </TableHead>
  );
};

export default TableHeader;
