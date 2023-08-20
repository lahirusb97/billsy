import React, { useEffect, useMemo, useState } from "react";

//MRT Imports
//import MaterialReactTable from 'material-react-table'; //default import deprecated
import { MaterialReactTable } from "material-react-table";

//Material UI Imports
import { Box, Button, ListItemIcon, MenuItem, Typography } from "@mui/material";

//Date Picker Imports
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

//Icons Imports
import {
  AccountCircle,
  BuildCircle,
  ReceiptLong,
  Send,
} from "@mui/icons-material";

//Mock Data

import { useDispatch, useSelector } from "react-redux";
import CircleChart from "../Component/CircleChart";
import {
  collection,
  query,
  where,
  onSnapshot,
  getFirestore,
  getDocs,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { addCustomerDocData } from "../../Store/Slices/coustomerData";
import {
  billHistory,
  openclose,
  openedbill,
} from "../../Store/Slices/billlSlice";
import { openScackbar } from "../../Store/Slices/SnackBarSlice";

const Example = ({ dateTime }) => {
  const [openBIll, setopenBill] = useState();
  const ALL_COUSTOMER_DATA = useSelector(
    (state) => state.bill_data.BILLHISTORY
  );
  const CATEGORY_DATA = useSelector((state) => state.shop_data.SELECTED_SHOP);
  const USERDATA = useSelector((state) => state.user_data.userData);

  const columns = useMemo(
    () => [
      {
        id: "bill", //id used to define `group` column
        header: "Bill",
        filterVariant: "text",
        columns: [
          {
            accessorFn: (row) => `${row.Bill_id} `, //accessorFn used to join multiple data into a single cell
            id: "name", //id is still required when using accessorFn instead of accessorKey
            header: "Bill Number",
            size: 150,
            Cell: ({ renderedCellValue, row }) => (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                }}
              >
                {/* using renderedCellValue instead of cell.getValue() preserves filter match highlighting */}
                <h2 className="font-semibold text-blue capitalize">
                  {renderedCellValue}
                </h2>
              </Box>
            ),
          },
          {
            accessorKey: "Name", //accessorKey used to define `data` column. `id` gets set to accessorKey automatically
            enableClickToCopy: true,
            header: "Name",
            size: 150,
            filterVariant: "text",
          },
        ],
      },
      {
        id: "id",
        header: "Price",
        columns: [
          {
            accessorKey: "Total",
            // filterVariant: 'range', //if not using filter modes feature, use this instead of filterFn
            filterFn: "grater",
            header: "Total",
            size: 100,
            //custom conditional format and styling
            Cell: ({ cell }) => (
              <Box
                component="span"
                sx={(theme) => ({
                  // color: theme.palette.success.dark,
                  borderRadius: "0.25rem",
                  color: "#6D7BE3",
                  fontWeight: "bold",
                  maxWidth: "9ch",
                  p: "0.25rem",
                })}
              >
                {cell.getValue()?.toLocaleString?.("en-US", {
                  style: "currency",
                  currency: "LKR",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
              </Box>
            ),
          },
        ],
      },
      {
        accessorFn: (row) => `${row.Payment} `,

        accessorKey: "Payment",
        // filterVariant: 'range', //if not using filter modes feature, use this instead of filterFn
        filterFn: "between",
        header: "Payment Left",
        size: 100,
        //custom conditional format and styling
        Cell: ({ cell, row }) => (
          <Box
            component="span"
            sx={(theme) => ({
              backgroundColor:
                row.original.Total > row.original.Payment
                  ? theme.palette.warning.dark
                  : theme.palette.success.dark,
              borderRadius: "0.25rem",
              color: "#fff",
              maxWidth: "9ch",
              p: "0.25rem",
            })}
          >
            {(row.original.Total - row.original.Payment)
              .toString()
              .toLocaleString?.("en-US", {
                style: "currency",
                currency: "LKR",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}
          </Box>
        ),
      },
    ],
    []
  );
  //!
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const formattedTime = currentDateTime.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);
  //!
  const dispatch = useDispatch();

  return (
    <MaterialReactTable
      columns={columns}
      data={Object.values(ALL_COUSTOMER_DATA).map((e) => e)}
      enableColumnFilterModes
      enableColumnOrdering
      enableGrouping
      enablePinning
      enableRowActions
      enableRowSelection
      initialState={{ showColumnFilters: false }}
      positionToolbarAlertBanner="bottom"
      renderRowActionMenuItems={({ closeMenu, row }) => [
        <MenuItem
          key={0}
          onClick={() => {
            // View profile logic...
            // closeMenu();
            //TODO

            dispatch(openclose(true));
            dispatch(openedbill(row.original["id"]));
          }}
          sx={{ m: 0 }}
        >
          <ListItemIcon>
            <AccountCircle />
          </ListItemIcon>
          View Bill
        </MenuItem>,
      ]}
      renderTopToolbarCustomActions={({ table }) => {
        const handleDeactivate = () => {
          table.getSelectedRowModel().flatRows.map((row, cell) => {
            if (USERDATA["Admin"] === true) {
              const deleteDocs = async () => {
                const db = getFirestore();
                await deleteDoc(
                  doc(
                    db,
                    `bills/${
                      CATEGORY_DATA["Shop_id"]
                    }/${currentDateTime.getFullYear()}`,
                    row.original.id
                  )
                ).then(async () => {
                  if (row.original["Coustomer_Id"] !== "none") {
                    //! ADD THIS LIKE OLD ONE

                    const docRef = doc(
                      db,
                      "Coustomers",
                      row.original["Coustomer_Id"]
                    );
                    const docSnap = await getDoc(docRef);

                    if (docSnap.exists()) {
                      const data = docSnap.data();
                      await updateDoc(docRef, {
                        Total: data.Total - row.original["Total"],
                        Cost: data.Cost - row.original["Cost"],
                      })
                        .then(() => {
                          dispatch(
                            openScackbar({
                              open: true,
                              type: "success",
                              msg: "Item Permently Deleted",
                            })
                          );
                        })
                        .catch((e) =>
                          dispatch(
                            openScackbar({
                              open: true,
                              type: "error",
                              msg: "Error Check your internet conection",
                            })
                          )
                        );
                    } else {
                      // docSnap.data() will be undefined in this case
                      console.log("zzzzz");
                    }
                  }
                  //TODO
                  if (row.original["Ref_id"] !== "none") {
                    //! ADD THIS LIKE OLD ONE

                    const docRef = doc(
                      db,
                      "Coustomers",
                      row.original["Ref_id"]
                    );
                    const docSnap = await getDoc(docRef);

                    if (docSnap.exists()) {
                      const data = docSnap.data();
                      await updateDoc(docRef, {
                        Ref_total: data.Ref_total - row.original["Total"],
                        Ref_cost: data.Ref_cost - row.original["Cost"],
                      })
                        .then(() => {
                          dispatch(
                            openScackbar({
                              open: true,
                              type: "success",
                              msg: "Item Permently Deleted",
                            })
                          );
                        })
                        .catch((e) =>
                          dispatch(
                            openScackbar({
                              open: true,
                              type: "error",
                              msg: "Error Check your internet conection",
                            })
                          )
                        );
                    } else {
                      // docSnap.data() will be undefined in this case
                      console.log("zzzzz");
                    }
                  }
                });
              };
              deleteDocs();
            }
          });
        };

        const handleActivate = () => {
          table.getSelectedRowModel().flatRows.map((row) => {
            alert("activating " + row.getValue("name"));
          });
        };

        const handleContact = async () => {
          // const db = getFirestore();
          // const collectionRef = collection(db, "bills");

          const db = getFirestore();
          // const collectionRef = collection(
          //   db,
          //   "bills/uoktXafs3Siz4vPnU3mA/2023"
          // );
          // const q = query(collectionRef);

          // getDocs(q)
          //   .then((querySnapshot) => {
          //     const documentsData = querySnapshot.docs.map((doc) => doc.data());
          //     console.log(documentsData);
          //   })
          //   .catch((error) => {
          //     console.error("Error getting documents: ", error);
          //   });
          const collectionRef = collection(
            db,
            `bills/${CATEGORY_DATA["Shop_id"]}/${currentDateTime.getFullYear()}`
          );
          const startDate = dateTime.startOf("day").toDate();
          const endDate = dateTime.endOf("day").toDate();
          console.log(startDate);
          const dateRangeQuery = query(
            collectionRef,
            where("Date", ">=", startDate),
            where("Date", "<=", endDate)
          );

          onSnapshot(dateRangeQuery, (snapshot) => {
            const billList = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
              Date: doc.data().Date.toDate().getTime(),
            }));
            dispatch(billHistory(billList));
          });
        };

        return (
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <Button
              color="error"
              disabled={!table.getIsSomeRowsSelected() && !USERDATA["Admin"]}
              onClick={handleDeactivate}
              variant="contained"
            >
              Delete
            </Button>

            <Button color="info" onClick={handleContact} variant="contained">
              Show Bills
            </Button>
          </div>
        );
      }}
    />
  );
};

export default Example;
