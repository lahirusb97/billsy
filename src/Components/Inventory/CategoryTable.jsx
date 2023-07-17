import * as React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useSelector } from "react-redux";
import { AddCircle, RemoveCircle } from "@mui/icons-material";
import { Button, Modal, TextField } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { getFirestore, doc, updateDoc, arrayUnion } from "firebase/firestore";
function Row(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);
  const [inputcate, setinputcate] = React.useState("");
  const handleOpen = () => setOpen2(true);
  const handleClose = () => setOpen2(false);
  const StockData = useSelector((state) => state.stock_data.CATEGORY_DATA);
  const allStocks = useSelector((state) => state.stock_data.ALL_STOCKS);

  const addSubCategory = () => {
    const db = getFirestore();
    const cat = row["category"];

    // Replace 'collectionName' with the name of your collection and 'documentId' with the ID of your document
    const collectionRef = doc(db, "Shop", StockData.id);

    // Replace 'newData' with the data you want to add to the array
    const newData = inputcate;

    // Use the 'arrayUnion' function to add the newData to the 'dataArray' field in your document
    updateDoc(collectionRef, {
      [cat]: arrayUnion(newData),
    });
  };
  //!
  const removeSubCate = (sub) => {
    const filterdData = allStocks.filter((item) =>
      item["Sub_Category"].includes(sub["sub_category_name"])
    );
    console.log(filterdData);
  };
  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.category}
        </TableCell>

        <TableCell align="left">{row.sub_category}</TableCell>
        <TableCell align="left">{row.total}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Manage Sub Category
              </Typography>
              <h2 className="font-semibold text-purple">
                Add sub Category{" "}
                <AddCircle
                  onClick={handleOpen}
                  className="text-greendark cursor-pointer"
                />
              </h2>
              <Table size="small" aria-label="purchases">
                <TableHead className="bg-blue">
                  <TableRow>
                    <TableCell
                      style={{
                        width: "10px",
                        color: "#ffffff",
                        fontWeight: "semi-bold",
                      }}
                    >
                      Remove
                    </TableCell>

                    <TableCell
                      style={{
                        maxWidth: "auto",
                        color: "#ffffff",
                        fontWeight: "semi-bold",
                      }}
                      align="left"
                    >
                      Sub Category
                    </TableCell>
                    <TableCell
                      style={{
                        maxWidth: "auto",
                        color: "#ffffff",
                        fontWeight: "semi-bold",
                      }}
                      align="left"
                    >
                      Total Prodyct
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody className="bg-bluelite">
                  {row.history.map((historyRow) => (
                    <TableRow key={historyRow.sub_category_name}>
                      <TableCell style={{ width: "10px" }}>
                        <RemoveCircle
                          onClick={() => {
                            removeSubCate(historyRow);
                          }}
                          className="text-red cursor-pointer"
                        />
                      </TableCell>

                      <TableCell align="left" component="th" scope="row">
                        {historyRow.sub_category_name}
                      </TableCell>
                      <TableCell align="left">{historyRow.total}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
      <Modal
        open={open2}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <CloseIcon className="cursor-pointer" onClick={handleClose} />
          <Typography
            style={{ margin: ".5rem" }}
            id="modal-modal-title "
            variant="h9"
            component="h2"
          >
            Category Name
          </Typography>
          <TextField
            label="Category Name"
            value={inputcate}
            onChange={(e) => setinputcate(e.target.value)}
          />
          <button
            onClick={addSubCategory}
            className="bg-greendark  p-4 text-mywhite"
          >
            Add
          </button>
        </Box>
      </Modal>
    </React.Fragment>
  );
}

Row.propTypes = {
  row: PropTypes.shape({
    total: PropTypes.number.isRequired,
    sub_category: PropTypes.number.isRequired,
    history: PropTypes.arrayOf(
      PropTypes.shape({
        sub_category_name: PropTypes.string.isRequired,
        total: PropTypes.number.isRequired,
      })
    ).isRequired,
    category: PropTypes.string.isRequired,
  }).isRequired,
};

export default function CollapsibleTable() {
  const StockData = useSelector((state) => state.stock_data.CATEGORY_DATA);
  const allStocks = useSelector((state) => state.stock_data.ALL_STOCKS);
  const [rows, setrows] = React.useState([]);

  React.useEffect(() => {
    const MainData = [];

    StockData["Category"].map((cate) => {
      const subdata = [];
      let toalItem = 0;
      let subtotal = 0;
      if (StockData[cate]) {
        const subcount = StockData[cate].map((sub) => {
          const subItemTotal = allStocks.filter((item) =>
            item["Sub_Category"].includes(sub)
          );
          subdata.push({ sub_category_name: sub, total: subItemTotal.length });
          toalItem += subItemTotal.length;
        });
        subtotal = subcount.length;
      }
      MainData.push({
        category: cate,
        sub_category: subtotal,
        total: toalItem,
        history: subdata,
      });
      setrows(MainData);
    });
    // console.log("check");
  }, [StockData, allStocks]);
  const [open, setOpen] = React.useState(false);
  const [inputcate, setinputcate] = React.useState("");
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  //!addCategory
  const addCategory = () => {
    const db = getFirestore();

    // Replace 'collectionName' with the name of your collection and 'documentId' with the ID of your document
    const collectionRef = doc(db, "Shop", StockData.id);

    // Replace 'newData' with the data you want to add to the array
    const newData = inputcate;

    // Use the 'arrayUnion' function to add the newData to the 'dataArray' field in your document
    updateDoc(collectionRef, {
      Category: arrayUnion(newData),
    });
  };

  return (
    <TableContainer component={Paper}>
      <Typography variant="h6" gutterBottom component="div" paddingLeft={2}>
        Manage Category
      </Typography>
      <h2 className="font-semibold text-purple pl-2">
        Add Category{" "}
        <AddCircle
          onClick={handleOpen}
          className="text-greendark cursor-pointer"
        />
      </h2>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell style={{ width: "10px" }} />
            <TableCell align="left" style={{ maxWidth: "100px" }}>
              Category
            </TableCell>
            <TableCell align="left">Sub Categorys </TableCell>
            <TableCell align="left">Total Product</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <Row key={row.category} row={row} />
          ))}
        </TableBody>
      </Table>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <CloseIcon className="cursor-pointer" onClick={handleClose} />
          <Typography
            style={{ margin: ".5rem" }}
            id="modal-modal-title "
            variant="h9"
            component="h2"
          >
            Category Name
          </Typography>
          <TextField
            label="Category Name"
            value={inputcate}
            onChange={(e) => setinputcate(e.target.value)}
          />
          <button
            onClick={addCategory}
            className="bg-greendark  p-4 text-mywhite"
          >
            Add
          </button>
        </Box>
      </Modal>
    </TableContainer>
  );
}
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  minWidth: "300px",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
