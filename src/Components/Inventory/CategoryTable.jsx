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
import { useDispatch, useSelector } from "react-redux";
import { AddCircle, Delete, RemoveCircle } from "@mui/icons-material";
import { Button, Modal, TextField } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {
  getFirestore,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  deleteField,
} from "firebase/firestore";
import { getDatabase, ref, onValue, remove, child } from "firebase/database";
import { openScackbar } from "../../Store/Slices/SnackBarSlice";

function Row(props) {
  const { row, setRows } = props;
  const [open, setOpen] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);

  const [inputcate, setinputcate] = React.useState("");
  const handleOpen = () => (Stock_manage ? setOpen2(true) : setOpen2(false));
  const handleClose = () => setOpen2(false);
  const StockData = useSelector((state) => state.stock_data.CATEGORY_DATA);
  const allStocks = useSelector((state) => state.stock_data.ALL_STOCKS);
  const Stock_manage = useSelector(
    (state) => state.user_data.userData["Stock_manage"]
  );
  const all_data = useSelector((state) => state.user_data.CURRENT_SHOP);
  const dispatch = useDispatch();
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
    })
      .then(() => {
        dispatch(
          openScackbar({
            open: true,
            type: "success",
            msg: `Sub Category Added `,
          })
        );
      })
      .catch((e) => {
        dispatch(
          openScackbar({
            open: true,
            type: "warning",
            msg: e,
          })
        );
      });
  };
  //!
  const removeSubCate = async (sub, index) => {
    if (Stock_manage) {
      const filterdData = allStocks.filter((item) =>
        item["Sub_Category"].includes(sub["sub_category_name"])
      );
      try {
        const db = getDatabase(); // Make sure getDatabase() is defined and returns a valid database reference
        const shopId = StockData["Shop_id"]; // Make sure StockData is defined and contains the "Shop_id" property
        const fdb = getFirestore();

        // const dbArrayRef = doc(fdb, `/Shop/${shopId}`, sub["main_cate"]);
        const dbArrayRef = doc(fdb, "Shop", StockData.id);
        //!REMOVE ITEM START
        const removePromises = filterdData.map(async (element) => {
          const databaseRef = ref(
            db,
            `/System/Inventory/${shopId}/${element["productID"]}/`
          );

          return remove(databaseRef);
        });
        await Promise.all(removePromises);
        //! REMOVE ITEM END

        await updateDoc(dbArrayRef, {
          // mainCate: arrayRemove(sub["sub_category_name"]),
          [sub["main_cate"]]: arrayRemove(sub["sub_category_name"]),
        });
        dispatch(
          openScackbar({
            open: true,
            type: "success",
            msg: `Delete Complete`,
          })
        );
      } catch (error) {
        // Handle any errors that might occur during the asynchronous operations

        dispatch(
          openScackbar({
            open: true,
            type: "success",
            msg: error.message,
          })
        );
      }
    }
  };

  const removeAllCate = async (itemsCount, subcatCount, cate) => {
    if (Stock_manage) {
      if (itemsCount === 0) {
        const fdb = getFirestore();
        const dbArrayRef = doc(fdb, "Shop", StockData.id);

        if (subcatCount > 0) {
          await updateDoc(dbArrayRef, {
            cate: deleteField(),
          })
            .then(async () => {
              await updateDoc(dbArrayRef, {
                Category: arrayRemove(cate),
              }).then(() => {
                console.log(cate);
              });
            })
            .catch((e) => console.log(e));
        } else {
          await updateDoc(dbArrayRef, {
            Category: arrayRemove(cate),
          }).then(() => {
            console.log(StockData);
          });
        }
        setRows((prevRows) => prevRows.filter((row) => row.category !== cate));
      } else {
        dispatch(
          openScackbar({
            open: true,
            type: "error",
            msg: "Remove clear sub categorys before deleteing complete category",
          })
        );
      }
    }
  };
  return (
    <React.Fragment>
      <TableRow
        className="capitalize"
        sx={{ "& > *": { borderBottom: "unset" } }}
      >
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
        <TableCell align="left" size="small" aria-label="expand row">
          <Delete
            onClick={() =>
              removeAllCate(row.total, row.sub_category, row.category)
            }
            className="text-red cursor-pointer"
          />
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Manage Sub Category
              </Typography>
              {Stock_manage ? (
                <h2 className="font-semibold text-purple">
                  Add sub Category{" "}
                  <AddCircle
                    onClick={handleOpen}
                    className="text-greendark cursor-pointer"
                  />
                </h2>
              ) : (
                <></>
              )}
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
  const Stock_manage = useSelector(
    (state) => state.user_data.userData["Stock_manage"]
  );

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
          subdata.push({
            main_cate: cate,
            sub_category_name: sub,
            total: subItemTotal.length,
          });
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
  }, [StockData, allStocks]);
  const [open, setOpen] = React.useState(false);
  const [inputcate, setinputcate] = React.useState("");
  const handleOpen = () => (Stock_manage ? setOpen(true) : setOpen(false));
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
      {Stock_manage ? (
        <h2 className="font-semibold text-purple pl-2">
          Add Category{" "}
          <AddCircle
            onClick={handleOpen}
            className="text-greendark cursor-pointer"
          />
        </h2>
      ) : (
        <></>
      )}
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell style={{ width: "10px" }} />
            <TableCell align="left" style={{ maxWidth: "100px" }}>
              Category
            </TableCell>
            <TableCell align="left">Sub Categorys </TableCell>
            <TableCell align="left">Total Product</TableCell>
            <TableCell style={{ width: "10px" }} />
          </TableRow>
        </TableHead>
        <TableBody className="capitalize">
          {rows.map((row) => (
            <Row key={row.category} row={row} setRows={setrows} />
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
