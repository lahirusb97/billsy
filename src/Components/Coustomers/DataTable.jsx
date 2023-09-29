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
} from "firebase/firestore";
import { addCustomerDocData } from "../../Store/Slices/coustomerData";
import { color } from "framer-motion";

const Example = () => {
  const COUSTOMER_DATA = useSelector(
    (state) => state.coustomer_data.COUSTOMER_DATA["Coustomers"]
  );
  const ALL_COUSTOMER_DATA = useSelector(
    (state) => state.coustomer_data.COUSTOMER_DATA_DOC
  );
  const loadSW = useSelector((state) => state.coustomer_data.DATA_LOAD);
  const columns = useMemo(
    () => [
      {
        id: "employee", //id used to define `group` column
        header: "Employee",
        filterVariant: "text",
        columns: [
          {
            accessorFn: (row) => `${row.Name} `, //accessorFn used to join multiple data into a single cell
            id: "name", //id is still required when using accessorFn instead of accessorKey
            header: "Name",
            size: 80,
            Cell: ({ renderedCellValue, row }) => (
              <Box className="flex items-center justify-center">
                <img
                  style={{ borderRadius: "50%" }}
                  alt="avatar"
                  src={row.original.Img}
                  loading="lazy"
                  className="w-14 h-14 object-cover bg-center border-rad rounded-s-full mr-2 "
                />
                {/* using renderedCellValue instead of cell.getValue() preserves filter match highlighting */}
                <span className="capitalize font-semibold text-grayLite2">
                  {renderedCellValue}
                </span>
              </Box>
            ),
          },
          {
            accessorKey: "Mobile", //accessorKey used to define `data` column. `id` gets set to accessorKey automatically
            enableClickToCopy: true,
            header: "Mobile",
            size: 150,
            filterVariant: "text",
            Cell: ({ renderedCellValue }) => (
              <Typography variant="inherit">{renderedCellValue}</Typography>
            ),
          },
        ],
      },
      {
        id: "id",
        header: "Total Sales",
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
        accessorKey: "Debt",
        // filterVariant: 'range', //if not using filter modes feature, use this instead of filterFn
        filterFn: "between",
        header: "Debt",
        size: 100,
        //custom conditional format and styling
        Cell: ({ cell }) => (
          <Box
            component="span"
            sx={(theme) => ({
              backgroundColor:
                cell.getValue() > 0
                  ? theme.palette.warning.dark
                  : theme.palette.success.dark,
              borderRadius: "0.25rem",
              color: "#fff",
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
      {
        id: "id",
        header: "Referal Sales",
        columns: [
          {
            accessorKey: "Ref_total",
            // filterVariant: 'range', //if not using filter modes feature, use this instead of filterFn
            filterFn: "grater",
            header: "Referal Total",
            size: 100,
            //custom conditional format and styling
            Cell: ({ cell, row }) => (
              <Box
                component="span"
                sx={(theme) => ({
                  borderRadius: "0.25rem",
                  color: "#288F60",
                  fontWeight: "bold",
                  maxWidth: "9ch",
                })}
              >
                <h1>
                  {cell.getValue()?.toLocaleString?.("en-US", {
                    style: "currency",
                    currency: "LKR",
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}
                </h1>
              </Box>
            ),
          },
        ],
      },
    ],
    []
  );

  const dispatch = useDispatch();
  useEffect(() => {
    // Anything in here is fired on component mount.
    return () => {
      // Anything in here is fired on component unmount.
    };
  }, []);
  return (
    <MaterialReactTable
      enableColumnFilters={false}
      enableRowSelection
      columns={columns}
      data={Object.values(ALL_COUSTOMER_DATA).map((e) => e)}
      enableColumnFilterModes
      enableColumnOrdering
      enableGrouping
      enablePinning
      enableRowActions
      initialState={{ showColumnFilters: true }}
      positionToolbarAlertBanner="bottom"
      renderDetailPanel={({ row }) => (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          <div className="">
            <h1>Coustomer Dashboard</h1>{" "}
          </div>
        </Box>
      )}
      renderRowActionMenuItems={({ closeMenu }) => [
        <MenuItem
          key={0}
          onClick={() => {
            // View profile logic...
            closeMenu();
          }}
          sx={{ m: 0 }}
        >
          <ListItemIcon>
            <AccountCircle />
          </ListItemIcon>
          View Profile
        </MenuItem>,
        <MenuItem
          key={1}
          onClick={() => {
            // Send email logic...
            closeMenu();
          }}
          sx={{ m: 0 }}
        >
          <ListItemIcon>
            <Send />
          </ListItemIcon>
          Send Email
        </MenuItem>,
      ]}
      renderTopToolbarCustomActions={({ table }) => {
        const handleDeactivate = () => {
          table.getSelectedRowModel().flatRows.map((row) => {
            alert("deactivating " + row.getValue("name"));
          });
        };

        const handleActivate = () => {
          table.getSelectedRowModel().flatRows.map((row) => {
            alert("activating " + row.getValue("name"));
          });
        };

        const handleContact = () => {
          const db = getFirestore();
          const collectionRef = collection(db, "Coustomers");
          const q = query(collectionRef);
          onSnapshot(q, (snapshot) => {
            const documentsData = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            dispatch(addCustomerDocData(documentsData));
          });
        };

        return (
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <Button
              color="error"
              disabled={!table.getIsSomeRowsSelected()}
              onClick={handleDeactivate}
              variant="contained"
            >
              Delete
            </Button>
            <Button
              color="success"
              disabled={!table.getIsSomeRowsSelected()}
              onClick={handleActivate}
              variant="contained"
            >
              Activate
            </Button>
            <Button
              disabled={loadSW}
              color="info"
              onClick={handleContact}
              variant="contained"
            >
              Load Coustomer Data
            </Button>
          </div>
        );
      }}
    />
  );
};

export default Example;
