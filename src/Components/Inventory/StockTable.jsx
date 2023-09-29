import * as React from "react";
import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import { TableHead } from "@mui/material";
import { useSelector } from "react-redux";

function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

export default function CustomPaginationActionsTable({
  state,
  setState,
  setEdit,
  edit,
}) {
  const ALL_STOCKS = useSelector((state) => state.stock_data.FILTER_STOCK);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    console.log(event.target.value);
    if (event.target.value <= ALL_STOCKS.length) {
      setRowsPerPage(parseInt(event.target.value, 10) || 0);
      setPage(0);
    }
  };

  const paginatedData = ALL_STOCKS.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, paginatedData.length);

  const columns = [
    { id: "name", label: "Name", minWidth: 100, align: "left" },

    {
      id: "price",
      label: "Price",
      align: "left",
      minWidth: 50,
      format: (value) => value.toLocaleString("en-US"),
    },
    {
      id: "cost",
      label: "Cost",
      align: "left",
      minWidth: 50,
      format: (value) => value.toLocaleString("en-US"),
    },
    {
      id: "Stock",
      label: "Stock",
      minWidth: 50,
      align: "left",
      format: (value) => value.toLocaleString("en-US"),
    },
    { id: "subcat", label: "Sub Category", minWidth: 100, align: "left" },
    { id: "Category", label: "Category", minWidth: 100, align: "left" },
    { id: "Brand", label: "Brand", minWidth: 100, align: "left" },
  ];
  const Stock_manage = useSelector(
    (state) => state.user_data.userData["Stock_manage"]
  );

  return (
    <TableContainer component={Paper}>
      <Table
        size="small"
        sx={{ minWidth: 500 }}
        aria-label="custom pagination table"
      >
        <TableHead>
          <TableRow
            sx={{
              "& th": {
                backgroundColor: "#E6E6E6",
                fontWeight: "bold",
                fontSize: "1rem",
              },
            }}
          >
            {columns.map((column) => (
              <TableCell
                key={column.id}
                align={column.align}
                style={{ minWidth: column.minWidth }}
              >
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {ALL_STOCKS.length > 0 ? (
            paginatedData.map((row) => (
              <TableRow
                onClick={() => {
                  if (Stock_manage) {
                    setState(true);
                    console.log(row);
                    setEdit(true, row);
                  } else {
                    setState(false);
                    setEdit(false, {});
                  }
                }}
                key={row.productID}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell align="left">{row.Product_name}</TableCell>
                <TableCell align="left">Rs: {row.Price}</TableCell>
                <TableCell align="left">RS: {row.Cost}</TableCell>
                <TableCell align="left">{row.Stock_count}</TableCell>
                <TableCell align="left">{row.Sub_Category}</TableCell>
                <TableCell align="left">{row.Category}</TableCell>
                <TableCell align="left">{row.Brand_name}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                rowSpan={8}
                align="center"
                className="centered-cell"
              >
                No Items are added
              </TableCell>
            </TableRow>
          )}

          {emptyRows > 0 && (
            <TableRow style={{ height: 53 * emptyRows }}>
              <TableCell colSpan={8} />
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[
                8,
                15,
                20,
                { label: "All", value: ALL_STOCKS.length },
              ]}
              colSpan={3}
              count={ALL_STOCKS.length}
              rowsPerPage={rowsPerPage}
              page={page}
              SelectProps={{
                inputProps: {
                  "aria-label": "rows per page",
                },
                native: true,
              }}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
}
