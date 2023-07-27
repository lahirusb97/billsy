import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useDispatch, useSelector } from "react-redux";
import {
  AddCircleRounded,
  PlusOneRounded,
  RemoveCircle,
} from "@mui/icons-material";
import { addQty, removeItem, removeQty } from "../../Store/Slices/InvoiceSlice";

export default function InvoiceDataTable() {
  const INVOICE_ITEMS = useSelector(
    (state) => state.invoice_data.INVOICE_ITEMS
  );
  const TOTAL_PRICE = useSelector((state) => state.invoice_data.TOTAL_PRICE);
  const [total, setTotal] = React.useState(0);
  const dispatch = useDispatch();
  // React.useEffect(() => {
  //   INVOICE_ITEMS.map((item) => setTotal(total + item["Price"]));
  // }, [INVOICE_ITEMS]);

  return (
    <TableContainer component={Paper}>
      <Table size="small" sx={{ minWidth: 400 }} aria-label="spanning table">
        <TableHead>
          <TableRow className="bg-black ">
            <TableCell style={{ color: "#ffffff" }}>Description</TableCell>
            <TableCell style={{ color: "#ffffff" }} align="center">
              Qty.
            </TableCell>
            <TableCell style={{ color: "#ffffff" }} align="right">
              Price RS.
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {INVOICE_ITEMS.length === 0 ? (
            <TableRow style={{ height: "100px" }}>
              <TableCell colSpan={3} align="center">
                No items in the invoice.
              </TableCell>
            </TableRow>
          ) : (
            INVOICE_ITEMS.map((row, i) => (
              <TableRow key={"s" + i}>
                <TableCell>
                  <RemoveCircle
                    className="cursor-pointer text-red"
                    onClick={() => {
                      dispatch(removeItem(i));
                    }}
                  />
                  {row["Product_name"]}
                </TableCell>
                <TableCell align="center">
                  <AddCircleRounded
                    onClick={() => {
                      if (row["productID"]) {
                        if (row["Stock_count"] > row["Qty"]) {
                          dispatch(addQty(i));
                        }
                      } else {
                        dispatch(addQty(i));
                      }
                    }}
                    className="text-greendark cursor-pointer"
                  />
                  <span className="text-lg font-bold px-2">{row["Qty"]}</span>
                  <RemoveCircle
                    onClick={() => {
                      if (row["Qty"] > 1) {
                        dispatch(removeQty(i));
                      }
                    }}
                    className="text-red cursor-pointer"
                  />
                </TableCell>
                <TableCell align="right">{row["Price"]}</TableCell>
              </TableRow>
            ))
          )}
          <TableRow>
            <TableCell rowSpan={3} />
            <TableCell
              className="bg-black"
              style={{ color: "#ffffff", fontWeight: "bold" }}
              colSpan={1}
            >
              Grand total
            </TableCell>
            <TableCell
              className="bg-black"
              style={{ color: "#ffffff", fontWeight: "bold" }}
              align="right"
            >
              RS. {TOTAL_PRICE}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
