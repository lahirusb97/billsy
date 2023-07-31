import React, { useMemo } from "react";

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
import { data } from "./Datalist";
import { useSelector } from "react-redux";
import CircleChart from "../Component/CircleChart";

const Example = () => {
  const COUSTOMER_DATA = useSelector(
    (state) => state.coustomer_data.COUSTOMER_DATA["Coustomers"]
  );
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
            size: 250,
            Cell: ({ renderedCellValue, row }) => (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                }}
              >
                <img
                  alt="avatar"
                  width={40}
                  height={40}
                  src={row.original.Img}
                  loading="lazy"
                  style={{ borderRadius: "50%" }}
                />
                {/* using renderedCellValue instead of cell.getValue() preserves filter match highlighting */}
                <span>{renderedCellValue}</span>
              </Box>
            ),
          },
          {
            accessorKey: "Mobile", //accessorKey used to define `data` column. `id` gets set to accessorKey automatically
            enableClickToCopy: true,
            header: "Mobile",
            size: 300,
            filterVariant: "text",
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
            filterFn: "between",
            header: "Total",
            size: 200,
            //custom conditional format and styling
            Cell: ({ cell }) => (
              <Box
                component="span"
                sx={(theme) => ({
                  backgroundColor:
                    cell.getValue() < 50_000
                      ? theme.palette.error.dark
                      : cell.getValue() >= 50_000 && cell.getValue() < 75_000
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
        ],
      },
    ],
    []
  );

  return (
    <MaterialReactTable
      columns={columns}
      data={Object.values(COUSTOMER_DATA).map((e) => e)}
      enableColumnFilterModes
      enableColumnOrdering
      enableGrouping
      enablePinning
      enableRowActions
      enableRowSelection
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
          <div className="flex items-center justify-center flex-col"></div>
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
          table.getSelectedRowModel().flatRows.map((row) => {
            alert("contact " + row.getValue("name"));
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
              Deactivate
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
              color="info"
              disabled={!table.getIsSomeRowsSelected()}
              onClick={handleContact}
              variant="contained"
            >
              Contact
            </Button>
          </div>
        );
      }}
    />
  );
};

export default Example;
